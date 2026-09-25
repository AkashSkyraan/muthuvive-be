import { UpdateProfileInput } from "../types/user.types";
import { executeQuery } from "../utils/helper";
import bcrypt from "bcryptjs";
export class UserModel {
  static async updateProfile(data: UpdateProfileInput) {
    const fields: string[] = [];
    const values: any[] = [];

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

    const result: any = await executeQuery(sql, values);

    if (result.affectedRows === 0) {
      return null;
    }

    return {
      id: data.user_id,
    };
  }

  static async getUserById(user_id: number) {
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

    const result: any[] = await executeQuery(query, [user_id]);

    return result.length > 0 ? result[0] : null;
  }

  static async verifyPassword({
    user_id,
    password,
  }: {
    user_id: number;
    password: string;
  }) {
    const rows: any = await executeQuery(
      `
      SELECT password
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
      [user_id],
    );

    if (!rows.length) {
      return false;
    }

    const hashedPassword = rows[0].password;

    const isValid = await bcrypt.compare(password, hashedPassword);

    return isValid;
  }
}
