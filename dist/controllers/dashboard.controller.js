"use strict";
// import { Request, Response } from "express";
// import { sendResponse } from "../utils/helper";
// export class DashController {
//   static createAdmin = async (req: Request, res: Response) => {
//     try {
//       const { name, password } = req.body;
//       if (!name || !password) {
//         return sendResponse(
//           res,
//           200,
//           0,
//           [],
//           "Username and password are required",
//           [],
//         );
//       }
//       // Check duplicate username
//     //   const existingAdmin = await AdminModel.getByUsername(username);
//       if (existingAdmin) {
//         return res.status(409).json({
//           success: false,
//           message: "Username already exists",
//         });
//       }
//       // Hash password
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const adminId = await AdminModel.createAdmin(username, hashedPassword);
//       return res.status(201).json({
//         success: true,
//         message: "Admin created successfully",
//         data: {
//           id: adminId,
//           username,
//           role: "admin",
//         },
//       });
//     } catch (error) {
//       console.error("Create Admin Error:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Internal server error",
//       });
//     }
//   };
// }
