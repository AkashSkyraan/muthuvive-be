"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const helper_1 = require("../utils/helper");
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
}
exports.UserModel = UserModel;
