"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryModel = void 0;
const helper_1 = require("../utils/helper");
class GalleryModel {
    static async addUpdateGallery(data) {
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
            await (0, helper_1.executeQuery)(sql, [
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
        const result = await (0, helper_1.executeQuery)(sql, [
            data.image,
            data.type,
            data.is_hero,
            data.status ?? "active",
        ]);
        return {
            id: result.insertId,
        };
    }
    static async getGallery(data = {}) {
        const conditions = [];
        const values = [];
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
        const rows = await (0, helper_1.executeQuery)(sql, values);
        if (data.id) {
            return rows && rows.length > 0 ? rows[0] : null;
        }
        return rows || [];
    }
    static async deleteGallery(id) {
        const sql = `
    DELETE FROM gallery
    WHERE id = ?
  `;
        const result = await (0, helper_1.executeQuery)(sql, [id]);
        if (result.affectedRows === 0) {
            return null;
        }
        return {
            id,
        };
    }
}
exports.GalleryModel = GalleryModel;
