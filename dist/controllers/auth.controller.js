"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const helper_1 = require("../utils/helper");
const validator_1 = require("../utils/validator");
const auth_model_1 = require("../models/auth.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sms_service_1 = require("../services/sms.service");
const user_model_1 = require("../models/user.model");
// signup - 1
//forgot pass - 2
class AuthController {
    static async requestOTP(req, res) {
        try {
            const { purpose, email, mobile } = (0, helper_1.validateRequest)(req.body, validator_1.requestOtpSchema);
            const identifier = email || mobile;
            const existingUser = await auth_model_1.AuthModel.findUserByEmailOrMobile(identifier);
            if (purpose === 1 && existingUser) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "User Already Exisits", []);
            }
            if (purpose === 2 && !existingUser) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "User Not Found", []);
            }
            const otp = process.env.NODE_ENV === "production" ? (0, helper_1.generateOtp)() : "123456";
            const expiresAt = (0, helper_1.getOtpExpiry)();
            if (process.env.NODE_ENV === "production" && mobile) {
                await (0, sms_service_1.sendSmsOTP)(mobile, otp);
            }
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
            const { purpose, email, mobile, otp } = (0, helper_1.validateRequest)(req.body, validator_1.verifyOtpSchema);
            const type = email ? "email" : "mobile";
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
            console.log(err);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", []);
        }
    }
    static async resetPassword(req, res) {
        try {
            const { email, mobile, password } = (0, helper_1.validateRequest)(req.body, validator_1.resetPasswordSchema);
            const identifier = email || mobile;
            const user = await auth_model_1.AuthModel.findUserByEmailOrMobile(identifier);
            if (!user) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "User Not Found", []);
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
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
            const { user_name, email, mobile, password } = (0, helper_1.validateRequest)(req.body, validator_1.signupSchema);
            const existingEmail = email
                ? await auth_model_1.AuthModel.findUserByEmailOrMobile(email)
                : null;
            const existingMobile = mobile
                ? await auth_model_1.AuthModel.findUserByEmailOrMobile(mobile)
                : null;
            if (existingEmail) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "User already exists with this email", []);
            }
            if (existingMobile) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "User already exists with this Mobile", []);
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const userId = await auth_model_1.AuthModel.createUser(user_name, email, mobile, hashedPassword);
            const token = (0, helper_1.generateToken)(userId);
            res.cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 90 * 24 * 60 * 60 * 1000,
            });
            return (0, helper_1.sendResponse)(res, 201, 1, [
                {
                    id: userId,
                    user_name,
                    email,
                    mobile,
                },
            ], "Signup successful", []);
        }
        catch (err) {
            console.log("Signup Error:", err);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
                err.errors,
            ]);
        }
    }
    static async login(req, res) {
        try {
            const { email, mobile, password } = (0, helper_1.validateRequest)(req.body, validator_1.loginSchema);
            const type = email || mobile;
            const user = await auth_model_1.AuthModel.findUserByEmailOrMobile(type);
            if (!user) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "Invalid email or mobile", []);
            }
            const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
            if (!passwordMatch) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "Invalid password", []);
            }
            const token = (0, helper_1.generateToken)(user.id);
            // Set JWT cookie
            res.cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, [
                {
                    id: user.id,
                    user_name: user.user_name,
                    email: user.email,
                    mobile: user.mobile,
                },
            ], "Login successful", []);
        }
        catch (err) {
            console.log("Login Error:", err);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
                err.errors,
            ]);
        }
    }
    static async verifyPassword(req, res) {
        try {
            const { user_id, password } = req.body;
            if (!user_id || !password) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "user_id and password are required", []);
            }
            const result = await user_model_1.UserModel.verifyPassword({
                user_id: Number(user_id),
                password: String(password),
            });
            if (!result) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Current password is incorrect", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, [], "Password verified successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [error]);
        }
    }
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.logout = async (req, res) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Logout successful", []);
    }
    catch (error) {
        console.error("Logout Error:", error);
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", []);
    }
};
