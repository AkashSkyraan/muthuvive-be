import {
  AddUpdateTestimonialInput,
  GetTestimonialInput,
} from "../types/testimonial.types";
import { executeQuery } from "../utils/helper";

export class TestimonialModel {
  static async addUpdateTestimonial(data: AddUpdateTestimonialInput) {
    if (data.id) {
      const sql = `
      UPDATE testimonials
      SET
        name = ?,
        image = ?,
        content = ?,
        rating = ?,
        status = ?
      WHERE id = ?
    `;

      await executeQuery(sql, [
        data.name,
        data.image || null,
        data.content,
        data.rating ?? 5,
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
      status
    )
    VALUES (?, ?, ?, ?, ?)
  `;

    const result: any = await executeQuery(sql, [
      data.name,
      data.image || null,
      data.content,
      data.rating ?? 5,
      data.status ?? "active",
    ]);

    return {
      id: result.insertId,
    };
  }

  static async getTestimonial(data: GetTestimonialInput = {}) {
    const conditions: string[] = [];
    const values: any[] = [];

    if (data.id) {
      conditions.push("id = ?");
      values.push(data.id);
    }

    if (data.status !== undefined) {
      conditions.push("status = ?");
      values.push(data.status === "active" ? 1 : 0);
    }

    let sql = `
    SELECT
      id,
      name,
      image,
      content,
      rating,
      status,
      created_at,
      updated_at
    FROM testimonials
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

  static async deleteTestimonial(id: number) {
    const sql = `
    DELETE FROM testimonials
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
