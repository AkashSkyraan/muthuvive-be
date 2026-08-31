"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const helper_1 = require("../utils/helper");
const validator_1 = require("../utils/validator");
const auth_model_1 = require("../models/auth.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// signup - 1
//forgot pass - 2
class AuthController {
    static async requestOTP(req, res) {
        try {
            const { type, purpose, email, mobile } = (0, helper_1.validateRequest)(req.body, validator_1.requestOtpSchema);
            const existingUser = await auth_model_1.AuthModel.findUserByEmailOrMobile(type);
            if (purpose === 1 && existingUser) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "User Already Exisits", []);
            }
            if (purpose === 2 && !existingUser) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "User Not Found", []);
            }
            const otp = (0, helper_1.generateOtp)();
            const expiresAt = (0, helper_1.getOtpExpiry)();
            await auth_model_1.AuthModel.createOtp(email, mobile, otp, purpose, expiresAt);
            const result = process.env.NODE_ENV === "development" ? [{ otp: otp }] : [];
            return (0, helper_1.sendResponse)(res, 200, 1, result, "OTP sent successfully", []);
        }
        catch (err) {
            console.log(err);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", []);
        }
    }
    static async verifyOTP(req, res) {
        try {
            const { type, purpose, email, mobile, otp } = (0, helper_1.validateRequest)(req.body, validator_1.verifyOtpSchema);
            const otpRecord = await auth_model_1.AuthModel.getLatestOTP(type, email || null, mobile || null, purpose);
            if (!otpRecord) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "OTP Not Found", []);
            }
            if (otpRecord.verified_at) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "OTP Already Verified", []);
            }
            if (new Date(otpRecord.expires_at) < new Date()) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "OTP Expired", []);
            }
            if (otpRecord.otp !== otp) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "Invalid OTP", []);
            }
            await auth_model_1.AuthModel.markOTPVerified(otpRecord.id);
            return (0, helper_1.sendResponse)(res, 200, 1, [], purpose === 1
                ? "OTP verified successfully for signup"
                : "OTP verified successfully for password reset", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", []);
        }
    }
    static async resetPassword(req, res) {
        try {
            const { type, email, mobile, password } = (0, helper_1.validateRequest)(req.body, validator_1.resetPasswordSchema);
            const identifier = type === "email" ? email : mobile;
            const user = await auth_model_1.AuthModel.findUserByEmailOrMobile(identifier);
            if (!user) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "User Not Found", []);
            }
            const verifiedOTP = await auth_model_1.AuthModel.getVerifiedOTP(type, email || null, mobile || null, 2);
            if (!verifiedOTP) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "Please verify OTP before resetting password", []);
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 12);
            await auth_model_1.AuthModel.updatePassword(user.id, hashedPassword);
            return (0, helper_1.sendResponse)(res, 200, 1, [], "Password reset successfully", []);
        }
        catch (err) {
            console.log(err);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", []);
        }
    }
    static async signup(req, res) {
        try {
            const { email, mobile, password, confirm_password } = (0, helper_1.validateRequest)(req.body, validator_1.signupSchema);
            const normalizedEmail = email?.trim().toLowerCase() || null;
            const normalizedMobile = mobile?.trim() || null;
            const existingUser = await auth_model_1.AuthModel.findUserByEmailOrMobile(normalizedEmail || normalizedMobile);
            if (existingUser) {
                return (0, helper_1.sendResponse)(res, 409, 0, [], "User already exists with this email or mobile", []);
            }
            let verified = false;
            if (normalizedEmail) {
                const emailOtp = await auth_model_1.AuthModel.getLatestOTP("email", normalizedEmail, null, 1);
                if (emailOtp?.verified_at && !emailOtp?.consumed_at) {
                    verified = true;
                }
            }
            if (!verified && normalizedMobile) {
                const mobileOtp = await auth_model_1.AuthModel.getLatestOTP("mobile", null, normalizedMobile, 1);
                if (mobileOtp?.verified_at && !mobileOtp?.consumed_at) {
                    verified = true;
                }
            }
            if (!verified) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "Please verify email or mobile before signup", []);
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 12);
            const userId = await auth_model_1.AuthModel.createUser(normalizedEmail, normalizedMobile, hashedPassword);
            return (0, helper_1.sendResponse)(res, 201, 1, [
                {
                    id: userId,
                    email: normalizedEmail,
                    mobile: normalizedMobile,
                },
            ], "Signup successful", []);
        }
        catch (err) {
            console.log(err);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", []);
        }
    }
}
exports.AuthController = AuthController;
