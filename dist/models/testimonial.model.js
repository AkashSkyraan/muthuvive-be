"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialModel = void 0;
const helper_1 = require("../utils/helper");
class TestimonialModel {
    static async addUpdateTestimonial(data) {
        if (data.id) {
            const sql = `
      UPDATE testimonials
      SET
        name = ?,
        image = ?,
        content = ?,
        rating = ?,
        location = ?,
        status = ?
      WHERE id = ?
    `;
            await (0, helper_1.executeQuery)(sql, [
                data.name,
                data.image || null,
                data.content,
                data.rating ?? 5,
                data.location,
                data.status ?? 1,
                data.id,
            ]);
            return {
                id: data.id,
            };
        }
        const sql = `
    INSERT INTO testimonials (
      name,
      image,
      content,
      rating,
      location,
      status
    )
    VALUES (?, ?, ?, ?, ?,?)
  `;
        const result = await (0, helper_1.executeQuery)(sql, [
            data.name,
            data.image || null,
            data.content,
            data.rating ?? 5,
            data.location,
            data.status ?? "active",
        ]);
        return {
            id: result.insertId,
        };
    }
    static async getTestimonial(data = {}) {
        const conditions = [];
        const values = [];
        if (data.id) {
            conditions.push("id = ?");
            values.push(data.id);
        }
        if (data.status !== undefined) {
            conditions.push("status = ?");
            values.push(data.status === "active" ? "active" : "inactive");
        }
        let sql = `
    SELECT
      id,
      name,
      image,
      content,
      rating,
      location,
      status,
      created_at,
      updated_at
    FROM testimonials
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
    static async deleteTestimonial(id) {
        const sql = `
    DELETE FROM testimonials
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
exports.TestimonialModel = TestimonialModel;
