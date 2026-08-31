import {
  AddUpdateCategoryInput,
  GetPropertyInput,
} from "../types/property.types";
import { executeQuery } from "../utils/helper";

export class PropertyModel {
  static async addUpdateProperty(data: AddUpdateCategoryInput) {
    if (data.id) {
      const sql = `
          UPDATE property
          SET
            image = ?,
            name = ?,
            status = ?
          WHERE id = ?
        `;

      const result: any = await executeQuery(sql, [
        data.image || null,
        data.name,
        data.status ?? 1,
        data.id,
      ]);

      return {
        id: data.id,
      };
    }

    const sql = `
        INSERT INTO property (
          image,
          name,
          status
        )
        VALUES (?, ?, ?)
      `;

    const result: any = await executeQuery(sql, [
      data.image || null,
      data.name,
      data.status ?? 1,
    ]);

    return {
      id: result.insertId,
    };
  }

  static async getProperty(data: GetPropertyInput = {}) {
    const conditions: string[] = [];
    const values: any[] = [];

    if (data.id) {
      conditions.push("id = ?");
      values.push(data.id);
    }

    if (data.status !== undefined) {
      conditions.push("status = ?");
      values.push(data.status);
    }

    let sql = `
    SELECT
      id,
      image,
      name,
      status,
      created_at,
      updated_at
    FROM property
  `;

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += ` ORDER BY id DESC`;

    const rows: any = await executeQuery(sql, values);

    if (data.id) {
      return rows && rows.length > 0 ? rows[0] : null;
    }

    return rows || [];
  }

  static async deleteProperty(id: number) {
    const sql = `
    DELETE FROM property
    WHERE id = ?
  `;

    const result: any = await executeQuery(sql, [id]);

    if (result.affectedRows === 0) {
      return null;
    }

    return {
      id,
    };
  }
}
