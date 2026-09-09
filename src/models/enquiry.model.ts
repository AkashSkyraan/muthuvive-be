import { AddUpdateEnquiry, getEnquiry } from "../types/enquiry.types";
import { executeQuery } from "../utils/helper";

export class EnquiryModel {
  static async addUpdateEnquiry(data: AddUpdateEnquiry) {
    if (data.id) {
      const sql = `
          UPDATE send_enquiry
          SET
            name = ?,
            mobile = ?,
            email = ?,
            messages = ?,
            regarding = ?,
            property_id = ?,
            status = ? 
          WHERE id = ?
        `;

      await executeQuery(sql, [
        data.name,
        data.mobile,
        data.email,
        data.messages,
        data.regarding,
        data.property_id,
        data.status,
        data.id,
      ]);

      return {
        id: data.id,
      };
    }

    const sql = `
        INSERT INTO send_enquiry (
          name,
          mobile,
          email,
          messages,
          regarding,
          property_id
        )
        VALUES (?, ?, ?, ? ,? , ?)
      `;

    const result: any = await executeQuery(sql, [
      data.name,
      data.mobile,
      data.email,
      data.messages,
      data.regarding,
      data.property_id,
    ]);

    return {
      id: result.insertId,
    };
  }

  static async getEnquiry(data: getEnquiry = {}) {
    const conditions: string[] = [];
    const values: any[] = [];

    if (data.id) {
      conditions.push("id = ?");
      values.push(data.id);
    }

    if (data.status) {
      conditions.push("status = ?");
      values.push(data.status);
    }

    if (data.regarding) {
      conditions.push("regarding LIKE ?");
      values.push(`%${data.regarding}%`);
    }

    if (data.property_id) {
      conditions.push("property_id = ?");
      values.push(data.property_id);
    }

    if (data.mobile) {
      conditions.push("mobile LIKE ?");
      values.push(`%${data.mobile}%`);
    }

    if (data.email) {
      conditions.push("email LIKE ?");
      values.push(`%${data.email}%`);
    }

    let sql = `
    SELECT
      id,
      name,
      regarding,
      property_id,
      messages,
      mobile,
      email,
      status
    FROM send_enquiry
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
}
