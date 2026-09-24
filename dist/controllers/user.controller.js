"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const helper_1 = require("../utils/helper");
const validator_1 = require("../utils/validator");
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    static async updateProfile(req, res) {
        try {
            const data = (0, helper_1.validateRequest)(req.body, validator_1.updateProfileSchema);
            if (data.email) {
                const existingEmail = await (0, helper_1.executeQuery)(`
        SELECT id
        FROM users
        WHERE email = ?
          AND id != ?
        LIMIT 1
        `, [data.email, data.user_id]);
                if (existingEmail.length > 0) {
                    return (0, helper_1.sendResponse)(res, 200, 0, [], "Email already exists", []);
                }
            }
            if (data.mobile) {
                const existingMobile = await (0, helper_1.executeQuery)(`
        SELECT id
        FROM users
        WHERE mobile = ?
          AND id != ?
        LIMIT 1
        `, [data.mobile, data.user_id]);
                if (existingMobile.length > 0) {
                    return (0, helper_1.sendResponse)(res, 200, 0, [], "Mobile number already exists", []);
                }
            }
            const result = await user_model_1.UserModel.updateProfile(data);
            if (!result) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "User not found", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, [result], "Profile updated successfully", []);
        }
        catch (error) {
            console.error("Update Profile Error:", error);
            return (0, helper_1.sendResponse)(res, error.status || 500, 0, [], error.message || "Internal server error", error.errors || []);
        }
    }
}
exports.UserController = UserController;
_a = UserController;
// get-user
UserController.getUser = async (req, res) => {
    try {
        const token = req.cookies?.access_token;
        console.log(token);
        if (!token) {
            return (0, helper_1.sendResponse)(res, 401, 0, [], "Authentication required", []);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // ---------------------------------------
        // Get user
        // ---------------------------------------
        const user = await user_model_1.UserModel.getUserById(decoded.user_id);
        if (!user) {
            return (0, helper_1.sendResponse)(res, 401, 0, [], "User not found", []);
        }
        // ---------------------------------------
        // Return user
        // ---------------------------------------
        return (0, helper_1.sendResponse)(res, 200, 1, [
            {
                id: user.id,
                user_name: user.user_name,
                email: user.email,
                mobile: user.mobile,
            },
        ], "User fetched successfully", []);
    }
    catch (error) {
        console.error("Get User Error:", error);
        return (0, helper_1.sendResponse)(res, 401, 0, [], "Invalid or expired session", []);
    }
};
