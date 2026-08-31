import { Request, Response } from "express";
import { executeQuery, sendResponse, validateRequest } from "../utils/helper";
import { updateProfileSchema } from "../utils/validator";
import { UserModel } from "../models/user.model";

export class UserController {
  static async updateProfile(req: Request, res: Response) {
    try {
      const data = validateRequest(req.body, updateProfileSchema);

      if (data.email) {
        const existingEmail: any = await executeQuery(
          `
        SELECT id
        FROM users
        WHERE email = ?
          AND id != ?
        LIMIT 1
        `,
          [data.email, data.user_id],
        );

        if (existingEmail.length > 0) {
          return sendResponse(res, 200, 0, [], "Email already exists", []);
        }
      }

      if (data.mobile) {
        const existingMobile: any = await executeQuery(
          `
        SELECT id
        FROM users
        WHERE mobile = ?
          AND id != ?
        LIMIT 1
        `,
          [data.mobile, data.user_id],
        );

        if (existingMobile.length > 0) {
          return sendResponse(
            res,
            200,
            0,
            [],
            "Mobile number already exists",
            [],
          );
        }
      }

      const result = await UserModel.updateProfile(data);

      if (!result) {
        return sendResponse(res, 200, 0, [], "User not found", []);
      }

      return sendResponse(
        res,
        200,
        1,
        [result],
        "Profile updated successfully",
        [],
      );
    } catch (error: any) {
      console.error("Update Profile Error:", error);

      return sendResponse(
        res,
        error.status || 500,
        0,
        [],
        error.message || "Internal server error",
        error.errors || [],
      );
    }
  }
}
