import { AddUpdateGallery, GetGallery } from "../types/gallery.types";
import { executeQuery } from "../utils/helper";

export class GalleryModel {
  static async addUpdateGallery(data: AddUpdateGallery) {
    if (data.id) {
      const sql = `
      UPDATE gallery
      SET
        image = ?,
        type = ?,
        is_hero = ?,
        status = ?
      WHERE id = ?
    `;

      await executeQuery(sql, [
        data.image,
        data.type,
        data.is_hero,
        data.status ?? "active",
        data.id,
      ]);

      return {
        id: data.id,
      };
    }

    const sql = `
    INSERT INTO gallery (
      image,
      type,
      is_hero,
      status
    )
    VALUES (?, ?, ? , ?)
  `;

    const result: any = await executeQuery(sql, [
      data.image,
      data.type,
      data.is_hero,
      data.status ?? "active",
    ]);

    return {
      id: result.insertId,
    };
  }

  static async getGallery(data: GetGallery = {}) {
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
    if (data.type !== undefined) {
      conditions.push("type = ?");
      values.push(data.type);
    }

    let sql = `
      SELECT
        id,
        type,
        image,
        status,
        is_hero
      FROM gallery
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

  static async deleteGallery(id: number) {
    const sql = `
    DELETE FROM gallery
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
