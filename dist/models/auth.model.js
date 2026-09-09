"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = void 0;
const helper_1 = require("../utils/helper");
class AuthModel {
    static async findUserByEmailOrMobile(type) {
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
        const rows = await (0, helper_1.executeQuery)(sql, [type, type]);
        return rows[0] || null;
    }
    static async createOtp(email, mobile, otp, purpose, expiresAt) {
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
        const updateResult = await (0, helper_1.executeQuery)(updateSql, [
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
        const insertResult = await (0, helper_1.executeQuery)(insertSql, [
            email,
            mobile,
            otp,
            purpose,
            expiresAt,
        ]);
        return insertResult.insertId;
    }
    static async getLatestOTP(type, email, mobile, purpose) {
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
        const rows = await (0, helper_1.executeQuery)(sql, [value, purpose]);
        return rows[0] || null;
    }
    static async markOTPVerified(id) {
        const sql = `
    UPDATE otp
    SET verified_at = NOW()
    WHERE id = ?
  `;
        await (0, helper_1.executeQuery)(sql, [id]);
    }
    static async updatePassword(userId, password) {
        const sql = `
    UPDATE users
    SET password = ?
    WHERE id = ?
  `;
        const result = await (0, helper_1.executeQuery)(sql, [password, userId]);
        return result.affectedRows;
    }
    static async getVerifiedOTP(type, email, mobile, purpose) {
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
        const rows = await (0, helper_1.executeQuery)(sql, [value, purpose]);
        return rows[0] || null;
    }
    static async createUser(user_name, email, mobile, hashedPassword) {
        const sql = `
      INSERT INTO users (
      user_name,
        email,
        mobile,
        password
      )
      VALUES (?, ?, ? , ?)
    `;
        const result = await (0, helper_1.executeQuery)(sql, [
            user_name,
            email,
            mobile,
            hashedPassword,
        ]);
        return result.insertId;
    }
}
exports.AuthModel = AuthModel;
