import { UpdateProfileInput } from "../types/user.types";
import { executeQuery } from "../utils/helper";

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
}
