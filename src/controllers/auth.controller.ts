import { Request, Response } from "express";
import {
  generateOtp,
  getOtpExpiry,
  sendResponse,
  validateRequest,
} from "../utils/helper";
import {
  requestOtpSchema,
  resetPasswordSchema,
  signupSchema,
  verifyOtpSchema,
} from "../utils/validator";
import { AuthModel } from "../models/auth.model";
import bcrypt from "bcryptjs";
// signup - 1
//forgot pass - 2

export class AuthController {
  static async requestOTP(req: Request, res: Response) {
    try {
      const { type, purpose, email, mobile } = validateRequest(
        req.body,
        requestOtpSchema,
      );
      const existingUser = await AuthModel.findUserByEmailOrMobile(type);
      if (purpose === 1 && existingUser) {
        return sendResponse(res, 400, 0, [], "User Already Exisits", []);
      }
      if (purpose === 2 && !existingUser) {
        return sendResponse(res, 400, 0, [], "User Not Found", []);
      }
      const otp = generateOtp();
      const expiresAt = getOtpExpiry();
      await AuthModel.createOtp(email, mobile, otp, purpose, expiresAt);
      const result =
        process.env.NODE_ENV === "development" ? [{ otp: otp }] : [];

      return sendResponse(res, 200, 1, result, "OTP sent successfully", []);
    } catch (err: any) {
      console.log(err);
      return sendResponse(res, 500, 0, [], "Internal Server Error", []);
    }
  }

  static async verifyOTP(req: Request, res: Response) {
    try {
      const { type, purpose, email, mobile, otp } = validateRequest(
        req.body,
        verifyOtpSchema,
      );

      const otpRecord = await AuthModel.getLatestOTP(
        type,
        email || null,
        mobile || null,
        purpose,
      );

      if (!otpRecord) {
        return sendResponse(res, 400, 0, [], "OTP Not Found", []);
      }

      if (otpRecord.verified_at) {
        return sendResponse(res, 400, 0, [], "OTP Already Verified", []);
      }

      if (new Date(otpRecord.expires_at) < new Date()) {
        return sendResponse(res, 400, 0, [], "OTP Expired", []);
      }

      if (otpRecord.otp !== otp) {
        return sendResponse(res, 400, 0, [], "Invalid OTP", []);
      }

      await AuthModel.markOTPVerified(otpRecord.id);

      return sendResponse(
        res,
        200,
        1,
        [],
        purpose === 1
          ? "OTP verified successfully for signup"
          : "OTP verified successfully for password reset",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", []);
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { type, email, mobile, password } = validateRequest(
        req.body,
        resetPasswordSchema,
      );

      const identifier = type === "email" ? email : mobile;

      const user = await AuthModel.findUserByEmailOrMobile(identifier);

      if (!user) {
        return sendResponse(res, 400, 0, [], "User Not Found", []);
      }

      const verifiedOTP = await AuthModel.getVerifiedOTP(
        type,
        email || null,
        mobile || null,
        2,
      );

      if (!verifiedOTP) {
        return sendResponse(
          res,
          400,
          0,
          [],
          "Please verify OTP before resetting password",
          [],
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await AuthModel.updatePassword(user.id, hashedPassword);

      return sendResponse(res, 200, 1, [], "Password reset successfully", []);
    } catch (err: any) {
      console.log(err);

      return sendResponse(res, 500, 0, [], "Internal Server Error", []);
    }
  }

  static async signup(req: Request, res: Response) {
    try {
      const { email, mobile, password  , confirm_password} = validateRequest(
        req.body,
        signupSchema,
      );

      const normalizedEmail = email?.trim().toLowerCase() || null;

      const normalizedMobile = mobile?.trim() || null;

      const existingUser = await AuthModel.findUserByEmailOrMobile(
        normalizedEmail || normalizedMobile!,
      );

      if (existingUser) {
        return sendResponse(
          res,
          409,
          0,
          [],
          "User already exists with this email or mobile",
          [],
        );
      }

      let verified = false;

      if (normalizedEmail) {
        const emailOtp = await AuthModel.getLatestOTP(
          "email",
          normalizedEmail,
          null,
          1,
        );

        if (emailOtp?.verified_at && !emailOtp?.consumed_at) {
          verified = true;
        }
      }

      if (!verified && normalizedMobile) {
        const mobileOtp = await AuthModel.getLatestOTP(
          "mobile",
          null,
          normalizedMobile,
          1,
        );

        if (mobileOtp?.verified_at && !mobileOtp?.consumed_at) {
          verified = true;
        }
      }

      if (!verified) {
        return sendResponse(
          res,
          400,
          0,
          [],
          "Please verify email or mobile before signup",
          [],
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const userId = await AuthModel.createUser(
        normalizedEmail,
        normalizedMobile,
        hashedPassword,
      );

      return sendResponse(
        res,
        201,
        1,
        [
          {
            id: userId,
            email: normalizedEmail,
            mobile: normalizedMobile,
          },
        ],
        "Signup successful",
        [],
      );
    } catch (err: any) {
      console.log(err);

      return sendResponse(res, 500, 0, [], "Internal Server Error", []);
    }
  }

  
}
