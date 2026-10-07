import { Request, Response } from "express";
import {
  generateOtp,
  generateToken,
  getOtpExpiry,
  sendResponse,
  validateRequest,
} from "../utils/helper";
import {
  loginSchema,
  requestOtpSchema,
  resetPasswordSchema,
  signupSchema,
  verifyOtpSchema,
} from "../utils/validator";
import { AuthModel } from "../models/auth.model";
import bcrypt from "bcryptjs";
import { sendSmsOTP } from "../services/sms.service";
import { UserModel } from "../models/user.model";
import { sendEmailOTP } from "../utils/email";
// signup - 1
//forgot pass - 2

export class AuthController {
  static async requestOTP(req: Request, res: Response) {
    try {
      const { purpose, email, mobile } = validateRequest(
        req.body,
        requestOtpSchema,
      );
      const identifier = email || mobile;
      const existingUser = await AuthModel.findUserByEmailOrMobile(identifier);

      if (purpose === 1 && existingUser) {
        return sendResponse(res, 400, 0, [], "User Already Exisits", []);
      }
      if (purpose === 2 && !existingUser) {
        return sendResponse(res, 400, 0, [], "User Not Found", []);
      }
      const otp =
        process.env.NODE_ENV === "production" ? generateOtp() : "123456";
      const expiresAt = getOtpExpiry();

      if (process.env.NODE_ENV === "production" && mobile) {
        await sendSmsOTP(mobile, otp);
      }

      if (email) {
        await sendEmailOTP(email, otp, purpose);
      }

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
      const { purpose, email, mobile, otp } = validateRequest(
        req.body,
        verifyOtpSchema,
      );

      const type: "email" | "mobile" = email ? "email" : "mobile";

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
      console.log(err);
      return sendResponse(res, 500, 0, [], "Internal Server Error", []);
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { email, mobile, password } = validateRequest(
        req.body,
        resetPasswordSchema,
      );

      const identifier = email || mobile;

      const user = await AuthModel.findUserByEmailOrMobile(identifier);

      if (!user) {
        return sendResponse(res, 400, 0, [], "User Not Found", []);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await AuthModel.updatePassword(user.id, hashedPassword);

      return sendResponse(res, 200, 1, [], "Password reset successfully", []);
    } catch (err: any) {
      console.log(err);

      return sendResponse(res, 500, 0, [], "Internal Server Error", []);
    }
  }

  static async signup(req: Request, res: Response) {
    try {
      const { user_name, email, mobile, password } = validateRequest(
        req.body,
        signupSchema,
      );

      const existingEmail = email
        ? await AuthModel.findUserByEmailOrMobile(email)
        : null;

      const existingMobile = mobile
        ? await AuthModel.findUserByEmailOrMobile(mobile)
        : null;

      if (existingEmail) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "User already exists with this email",
          [],
        );
      }
      if (existingMobile) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "User already exists with this Mobile",
          [],
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userId = await AuthModel.createUser(
        user_name,
        email,
        mobile,
        hashedPassword,
      );

      const token = generateToken(userId);

      const isProduction = process.env.NODE_ENV === "production";

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return sendResponse(
        res,
        201,
        1,
        [
          {
            id: userId,
            user_name,
            email,
            mobile,
          },
        ],
        "Signup successful",
        [],
      );
    } catch (err: any) {
      console.log("Signup Error:", err);

      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors,
      ]);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, mobile, password } = validateRequest(
        req.body,
        loginSchema,
      );

      const type = email || mobile;

      const user = await AuthModel.findUserByEmailOrMobile(type);

      if (!user) {
        return sendResponse(res, 400, 0, [], "Invalid email or mobile", []);
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return sendResponse(res, 400, 0, [], "Invalid password", []);
      }

      const token = generateToken(user.id);

      const isProduction = process.env.NODE_ENV === "production";

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return sendResponse(
        res,
        200,
        1,
        [
          {
            id: user.id,
            user_name: user.user_name,
            email: user.email,
            mobile: user.mobile,
          },
        ],
        "Login successful",
        [],
      );
    } catch (err: any) {
      console.log("Login Error:", err);

      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors,
      ]);
    }
  }

  static logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });

      return sendResponse(res, 200, 1, [], "Logout successful", []);
    } catch (error) {
      console.error("Logout Error:", error);

      return sendResponse(res, 500, 0, [], "Internal server error", []);
    }
  };

  static async verifyPassword(req: Request, res: Response) {
    try {
      const { user_id, password } = req.body;

      if (!user_id || !password) {
        return sendResponse(
          res,
          400,
          0,
          [],
          "user_id and password are required",
          [],
        );
      }

      const result = await UserModel.verifyPassword({
        user_id: Number(user_id),
        password: String(password),
      });

      if (!result) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "Current password is incorrect",
          [],
        );
      }

      return sendResponse(
        res,
        200,
        1,
        [],
        "Password verified successfully",
        [],
      );
    } catch (error) {
      return sendResponse(res, 500, 0, [], "Internal server error", [error]);
    }
  }
}
