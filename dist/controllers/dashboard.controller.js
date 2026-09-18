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
        // =====================================================
        // UPDATE
        // =====================================================
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
            let hashedPassword = existingAdmin.password;
            if (password) {
                hashedPassword = await bcryptjs_1.default.hash(password, 10);
            }
            await dashboard_model_1.DashboardModel.updateAdmin(Number(id), role, name, hashedPassword, status);
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
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create admin
        const adminId = await dashboard_model_1.DashboardModel.createAdmin(role, name, hashedPassword, status);
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
        // Compare password
        const isPasswordValid = await bcryptjs_1.default.compare(password, admin.password);
        if (!isPasswordValid) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid username or password", []);
        }
        // Create JWT
        const token = jsonwebtoken_1.default.sign({
            id: admin.id,
            role: admin.role,
            name: admin.name,
        }, process.env.TOKEN_SECRET, {
            expiresIn: "90d",
        });
        return (0, helper_1.sendResponse)(res, 200, 1, [
            {
                id: admin.id,
                role: admin.role,
                name: admin.name,
                status: admin.status,
                token,
            },
        ], "Login successful", []);
    }
    catch (error) {
        console.error("Admin Login Error:", error);
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", []);
    }
};
