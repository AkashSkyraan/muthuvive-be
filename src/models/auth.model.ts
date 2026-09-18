import pool from "../config/db";
import { executeQuery } from "../utils/helper";

export class AuthModel {
  static async findUserByEmailOrMobile(type: string) {
    const sql = `
      SELECT
        id,
        email,
        mobile,
        password,
        status
      FROM users
      WHERE email = ?
         OR mobile = ?
      LIMIT 1
    `;

    const rows = await executeQuery(sql, [type, type]);

    return rows[0] || null;
  }

  static async createOtp(
    email: string | null,
    mobile: string | null,
    otp: string,
    purpose: number,
    expiresAt: Date,
  ) {
    const identifierColumn = email ? "email" : "mobile";

    const identifierValue = email || mobile;

    const updateSql = `
    UPDATE otp
    SET
      otp = ?,
      expires_at = ?,
      verified_at = NULL
    WHERE ${identifierColumn} = ?
      AND purpose = ?
  `;

    const updateResult: any = await executeQuery(updateSql, [
      otp,
      expiresAt,
      identifierValue,
      purpose,
    ]);

    if (updateResult.affectedRows > 0) {
      return updateResult.insertId || null;
    }

    const insertSql = `
    INSERT INTO otp (
      email,
      mobile,
      otp,
      purpose,
      expires_at
    )
    VALUES (?, ?, ?, ?, ?)
  `;

    const insertResult: any = await executeQuery(insertSql, [
      email,
      mobile,
      otp,
      purpose,
      expiresAt,
    ]);

    return insertResult.insertId;
  }

  static async getLatestOTP(
    type: "email" | "mobile",
    email: string | null,
    mobile: string | null,
    purpose: number,
  ) {
    const column = type === "email" ? "email" : "mobile";
    const value = type === "email" ? email : mobile;

    
    const sql = `
    SELECT
      id,
      email,
      mobile,
      otp,
      purpose,
      expires_at,
      verified_at
    FROM otp
    WHERE ${column} = ?
      AND purpose = ?
    ORDER BY id DESC
    LIMIT 1
  `;

    const rows = await executeQuery(sql, [value, purpose]);

    return rows[0] || null;
  }

  static async markOTPVerified(id: number) {
    const sql = `
    UPDATE otp
    SET verified_at = NOW()
    WHERE id = ?
  `;

    await executeQuery(sql, [id]);
  }

  static async updatePassword(userId: number, password: string) {
    const sql = `
    UPDATE users
    SET password = ?
    WHERE id = ?
  `;

    const result: any = await executeQuery(sql, [password, userId]);

    return result.affectedRows;
  }

  static async getVerifiedOTP(
    type: "email" | "mobile",
    email: string | null,
    mobile: string | null,
    purpose: number,
  ) {
    const column = type === "email" ? "email" : "mobile";

    const value = type === "email" ? email : mobile;

    const sql = `
    SELECT
      id,
      email,
      mobile,
      purpose,
      verified_at
    FROM otp
    WHERE ${column} = ?
      AND purpose = ?
      AND verified_at IS NOT NULL
    ORDER BY id DESC
    LIMIT 1
  `;

    const rows = await executeQuery(sql, [value, purpose]);

    return rows[0] || null;
  }

  static async createUser(
    user_name: string,
    email: string | null,
    mobile: string | null,
    hashedPassword: string,
  ) {
    const sql = `
      INSERT INTO users (
      user_name,
        email,
        mobile,
        password
      )
      VALUES (?, ?, ? , ?)
    `;

    const result: any = await executeQuery(sql, [
      user_name,
      email,
      mobile,
      hashedPassword,
    ]);

    return result.insertId;
  }
  // ---------------------------------------
}
