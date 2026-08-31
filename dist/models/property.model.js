"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyModel = void 0;
const helper_1 = require("../utils/helper");
class PropertyModel {
    static async addUpdateProperty(data) {
        if (data.id) {
            const sql = `
          UPDATE property
          SET
            image = ?,
            name = ?,
            status = ?
          WHERE id = ?
        `;
            const result = await (0, helper_1.executeQuery)(sql, [
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
        const result = await (0, helper_1.executeQuery)(sql, [
            data.image || null,
            data.name,
            data.status ?? 1,
        ]);
        return {
            id: result.insertId,
        };
    }
    static async getProperty(data = {}) {
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
        const rows = await (0, helper_1.executeQuery)(sql, values);
        if (data.id) {
            return rows && rows.length > 0 ? rows[0] : null;
        }
        return rows || [];
    }
    static async deleteProperty(id) {
        const sql = `
    DELETE FROM property
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
exports.PropertyModel = PropertyModel;
