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

      // Compare password
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

      // Create JWT
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
            token,
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
}
