"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const helper_1 = require("../utils/helper");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserModel {
    static async updateProfile(data) {
        const fields = [];
        const values = [];
        if (data.name !== undefined) {
            fields.push("user_name = ?");
            values.push(data.name);
        }
        if (data.email !== undefined) {
            fields.push("email = ?");
            values.push(data.email);
        }
        if (data.mobile !== undefined) {
            fields.push("mobile = ?");
            values.push(data.mobile);
        }
        if (fields.length === 0) {
            throw new Error("No profile fields to update");
        }
        values.push(data.user_id);
        const sql = `
    UPDATE users
    SET
      ${fields.join(", ")}
    WHERE id = ?
  `;
        const result = await (0, helper_1.executeQuery)(sql, values);
        if (result.affectedRows === 0) {
            return null;
        }
        return {
            id: data.user_id,
        };
    }
    static async getUserById(user_id) {
        const query = `
    SELECT
      id,
      user_name,
      email,
      mobile
    FROM users
    WHERE id = ?
    LIMIT 1
  `;
        const result = await (0, helper_1.executeQuery)(query, [user_id]);
        return result.length > 0 ? result[0] : null;
    }
    static async verifyPassword({ user_id, password, }) {
        const rows = await (0, helper_1.executeQuery)(`
      SELECT password
      FROM users
      WHERE id = ?
      LIMIT 1
    `, [user_id]);
        if (!rows.length) {
            return false;
        }
        const hashedPassword = rows[0].password;
        const isValid = await bcryptjs_1.default.compare(password, hashedPassword);
        return isValid;
    }
}
exports.UserModel = UserModel;
