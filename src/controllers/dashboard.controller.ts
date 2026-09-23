import { Request, Response } from "express";
import { sendResponse } from "../utils/helper";
import { DashboardModel } from "../models/dashboard.model";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export class DashController {
  static createAdmin = async (req: Request, res: Response) => {
    try {
      const { id, role, name, password, status } = req.body;

      // Common validation
      if (!role || !name || status === undefined) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "Role, name and status are required",
          [],
        );
      }

      // =====================================================
      // UPDATE
      // =====================================================
      if (id) {
        // Check admin exists
        const existingAdmin = await DashboardModel.getById(Number(id));

        if (!existingAdmin) {
          return sendResponse(res, 200, 0, [], "Admin not found", []);
        }

        // Check duplicate name
        const duplicateAdmin = await DashboardModel.getByName(name);

        if (duplicateAdmin && Number(duplicateAdmin.id) !== Number(id)) {
          return sendResponse(res, 200, 0, [], "Admin name already exists", []);
        }

        // Keep old password if password is not provided
        let hashedPassword = existingAdmin.password;

        if (password) {
          hashedPassword = await bcrypt.hash(password, 10);
        }

        await DashboardModel.updateAdmin(
          Number(id),
          role,
          name,
          hashedPassword,
          status,
        );

        return sendResponse(
          res,
          200,
          1,
          {
            id: Number(id),
            role,
            name,
            status,
          },
          "Admin updated successfully",
          [],
        );
      }

      // =====================================================
      // CREATE
      // =====================================================

      // Password required only for create
      if (!password) {
        return sendResponse(res, 200, 0, [], "Password is required", []);
      }

      // Check duplicate name
      const existingAdmin = await DashboardModel.getByName(name);

      if (existingAdmin) {
        return sendResponse(res, 200, 0, [], "Admin name already exists", []);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create admin
      const adminId = await DashboardModel.createAdmin(
        role,
        name,
        hashedPassword,
        status,
      );

      return sendResponse(
        res,
        201,
        1,
        {
          id: adminId,
          role,
          name,
          status,
        },
        "Admin created successfully",
        [],
      );
    } catch (error) {
      console.error("Create/Update Admin Error:", error);

      return sendResponse(res, 500, 0, [], "Internal server error", []);
    }
  };

  static loginAdmin = async (req: Request, res: Response) => {
    try {
      const { name, password } = req.body;

      if (!name || !password) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "Username and password are required",
          [],
        );
      }

      const admin = await DashboardModel.getAdminLogin(name);

      if (!admin) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "Invalid username or password",
          [],
        );
      }

      if (admin.status !== "active") {
        return sendResponse(res, 200, 0, [], "Your account is inactive", []);
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "Invalid username or password",
          [],
        );
      }

      const token = jwt.sign(
        {
          id: admin.id,
          role: admin.role,
          name: admin.name,
        },
        process.env.TOKEN_SECRET as string,
        {
          expiresIn: "90d",
        },
      );

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 90 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return sendResponse(
        res,
        200,
        1,
        [
          {
            id: admin.id,
            role: admin.role,
            name: admin.name,
            status: admin.status,
          },
        ],
        "Login successful",
        [],
      );
    } catch (error) {
      console.error("Admin Login Error:", error);

      return sendResponse(res, 500, 0, [], "Internal server error", []);
    }
  };

  static getCurrentAdmin = async (req: Request, res: Response) => {
    try {
      const token = req.cookies?.access_token;

      if (!token) {
        return sendResponse(res, 401, 0, [], "Authentication required", []);
      }

      const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as {
        id: number;
        role: string;
        name: string;
      };

      const admin = await DashboardModel.getAdminById(decoded.id);

      if (!admin) {
        return sendResponse(res, 401, 0, [], "User not found", []);
      }

      if (admin.status !== "active") {
        return sendResponse(res, 401, 0, [], "Your account is inactive", []);
      }

      return sendResponse(
        res,
        200,
        1,
        [
          {
            id: admin.id,
            role: admin.role,
            name: admin.name,
            status: admin.status,
          },
        ],
        "User fetched successfully",
        [],
      );
    } catch (error) {
      console.error("Get Current Admin Error:", error);

      return sendResponse(res, 401, 0, [], "Invalid or expired session", []);
    }
  };

  static logoutAdmin = async (req: Request, res: Response) => {
    try {
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      });

      return sendResponse(res, 200, 1, [], "Logout successful", []);
    } catch (error) {
      return sendResponse(res, 500, 0, [], "Internal server error", []);
    }
  };

  // prperty

  static async updatePropertyStatus(req: Request, res: Response) {
    try {
      const { prop_id, status, rejected_reason } = req.body;

      if (!prop_id) {
        return sendResponse(res, 400, 0, [], "Property ID is required", []);
      }

      if (!status) {
        return sendResponse(res, 400, 0, [], "Status is required", []);
      }

      const allowedStatuses = ["approved", "rejected", "sold"];

      if (!allowedStatuses.includes(status)) {
        return sendResponse(
          res,
          400,
          0,
          [],
          "Invalid status. Allowed: approved, rejected, sold",
          [],
        );
      }

      if (status === "rejected" && !rejected_reason?.trim()) {
        return sendResponse(
          res,
          400,
          0,
          [],
          "Rejection reason is required",
          [],
        );
      }

      const data = await DashboardModel.updatePropertyStatus({
        prop_id: String(prop_id),
        status: String(status),
        rejection_reason: rejected_reason
          ? String(rejected_reason).trim()
          : null,
      });

      if (!data) {
        return sendResponse(res, 404, 0, [], "Property not found", []);
      }

      return sendResponse(
        res,
        200,
        1,
        data,
        "Property status updated successfully",
        [],
      );
    } catch (error: any) {
      console.error("updatePropertyStatus error:", error);

      return sendResponse(res, 500, 0, [], "Internal server error", [
        error?.message || error,
      ]);
    }
  }
}
