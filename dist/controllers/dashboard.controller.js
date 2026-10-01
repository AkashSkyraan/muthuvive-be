"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashController = void 0;
const helper_1 = require("../utils/helper");
const dashboard_model_1 = require("../models/dashboard.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class DashController {
    // prperty
    static async updatePropertyStatus(req, res) {
        try {
            const { prop_id, status, rejected_reason } = req.body;
            if (!prop_id) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "Property ID is required", []);
            }
            if (!status) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "Status is required", []);
            }
            const allowedStatuses = ["approved", "rejected", "sold"];
            if (!allowedStatuses.includes(status)) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "Invalid status. Allowed: approved, rejected, sold", []);
            }
            if (status === "rejected" && !rejected_reason?.trim()) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "Rejection reason is required", []);
            }
            const data = await dashboard_model_1.DashboardModel.updatePropertyStatus({
                prop_id: String(prop_id),
                status: String(status),
                rejection_reason: rejected_reason
                    ? String(rejected_reason).trim()
                    : null,
            });
            if (!data) {
                return (0, helper_1.sendResponse)(res, 404, 0, [], "Property not found", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, data, "Property status updated successfully", []);
        }
        catch (error) {
            console.error("updatePropertyStatus error:", error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error?.message || error,
            ]);
        }
    }
}
exports.DashController = DashController;
_a = DashController;
DashController.createAdmin = async (req, res) => {
    try {
        const { id, role, name, password, status } = req.body;
        // Common validation
        if (!role || !name || status === undefined) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Role, name and status are required", []);
        }
        if (id) {
            // Check admin exists
            const existingAdmin = await dashboard_model_1.DashboardModel.getById(Number(id));
            if (!existingAdmin) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Admin not found", []);
            }
            // Check duplicate name
            const duplicateAdmin = await dashboard_model_1.DashboardModel.getByName(name);
            if (duplicateAdmin && Number(duplicateAdmin.id) !== Number(id)) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Admin name already exists", []);
            }
            // Keep old password if password is not provided
            let finalPassword = existingAdmin.password;
            if (password) {
                if (role === "admin") {
                    // Admin → bcrypt
                    finalPassword = await bcryptjs_1.default.hash(password, 10);
                }
                else if (role === "subadmin") {
                    // Sub Admin → direct password
                    finalPassword = password;
                }
            }
            await dashboard_model_1.DashboardModel.updateAdmin(Number(id), role, name, finalPassword, status);
            return (0, helper_1.sendResponse)(res, 200, 1, {
                id: Number(id),
                role,
                name,
                status,
            }, "Admin updated successfully", []);
        }
        // =====================================================
        // CREATE
        // =====================================================
        // Password required only for create
        if (!password) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Password is required", []);
        }
        // Check duplicate name
        const existingAdmin = await dashboard_model_1.DashboardModel.getByName(name);
        if (existingAdmin) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Admin name already exists", []);
        }
        // Hash password
        let finalPassword = password;
        if (role === "admin") {
            finalPassword = await bcryptjs_1.default.hash(password, 10);
        }
        else if (role === "subadmin") {
            finalPassword = password;
        }
        const adminId = await dashboard_model_1.DashboardModel.createAdmin(role, name, finalPassword, status);
        return (0, helper_1.sendResponse)(res, 201, 1, {
            id: adminId,
            role,
            name,
            status,
        }, "Admin created successfully", []);
    }
    catch (error) {
        console.error("Create/Update Admin Error:", error);
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", []);
    }
};
DashController.loginAdmin = async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Username and password are required", []);
        }
        const admin = await dashboard_model_1.DashboardModel.getAdminLogin(name);
        if (!admin) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid username or password", []);
        }
        if (admin.status !== "active") {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Your account is inactive", []);
        }
        let isPasswordValid = false;
        // Admin password is bcrypt hashed
        if (admin.role === "admin") {
            isPasswordValid = await bcryptjs_1.default.compare(password, admin.password);
        }
        // Subadmin password is stored as plain text
        else if (admin.role === "subadmin") {
            isPasswordValid = password === admin.password;
        }
        if (!isPasswordValid) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid username or password", []);
        }
        const token = jsonwebtoken_1.default.sign({
            id: admin.id,
            role: admin.role,
            name: admin.name,
        }, process.env.TOKEN_SECRET, {
            expiresIn: "90d",
        });
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 90 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        return (0, helper_1.sendResponse)(res, 200, 1, [
            {
                id: admin.id,
                role: admin.role,
                name: admin.name,
                status: admin.status,
            },
        ], "Login successful", []);
    }
    catch (error) {
        console.error("Admin Login Error:", error);
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", []);
    }
};
DashController.getCurrentAdmin = async (req, res) => {
    try {
        const token = req.cookies?.access_token;
        if (!token) {
            return (0, helper_1.sendResponse)(res, 401, 0, [], "Authentication required", []);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        const admin = await dashboard_model_1.DashboardModel.getAdminById(decoded.id);
        if (!admin) {
            return (0, helper_1.sendResponse)(res, 401, 0, [], "User not found", []);
        }
        if (admin.status !== "active") {
            return (0, helper_1.sendResponse)(res, 401, 0, [], "Your account is inactive", []);
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [
            {
                id: admin.id,
                role: admin.role,
                name: admin.name,
                status: admin.status,
            },
        ], "User fetched successfully", []);
    }
    catch (error) {
        console.error("Get Current Admin Error:", error);
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Invalid or expired session", []);
    }
};
DashController.logoutAdmin = async (req, res) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
        });
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Logout successful", []);
    }
    catch (error) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", []);
    }
};
DashController.getSUbAdmin = async (req, res) => {
    try {
        const name = req.query.name ? String(req.query.name).trim() : null;
        const id = req.query.id ? Number(req.query.id) : null;
        const status = req.query.status && String(req.query.status) !== "all"
            ? String(req.query.status)
            : null;
        // ==========================================
        // GET BY ID
        // ==========================================
        if (id) {
            const result = await dashboard_model_1.DashboardModel.getSUbAdmin({
                id,
                name: null,
                status: null,
                limit: 1,
                offset: 0,
            });
            if (!result.data.length) {
                return res.status(200).json({
                    success: 0,
                    data: [],
                    total: 0,
                    message: "Sub admin not found",
                    error: [],
                });
            }
            return res.status(200).json({
                success: 1,
                data: result.data,
                total: 1,
                message: "Sub admin fetched successfully",
                error: [],
            });
        }
        // ==========================================
        // LIST
        // ==========================================
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 10, 1);
        const offset = (page - 1) * limit;
        const result = await dashboard_model_1.DashboardModel.getSUbAdmin({
            id: null,
            name,
            status,
            limit,
            offset,
        });
        return res.status(200).json({
            success: 1,
            data: result.data,
            total: result.total,
            message: "Sub admins fetched successfully",
            error: [],
        });
    }
    catch (err) {
        console.error("Get Sub Admin Error:", err);
        return res.status(500).json({
            success: 0,
            data: [],
            total: 0,
            message: "Internal server error",
            error: [],
        });
    }
};
