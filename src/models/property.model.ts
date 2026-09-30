import {
  AddUpdateCategoryInput,
  AddUpdatePropertyAreaInput,
  AddUpdateSubCategoryInput,
  GetPropertyAreaInput,
  GetPropertyInput,
} from "../types/property.types";
import { executeQuery } from "../utils/helper";
import { GetSubPropertyInput } from "../utils/validator";

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
      data.status ?? "active",
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
      has_subcat,
      created_at,
      updated_at
    FROM property
  `;

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += ` ORDER BY id ASC`;

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

  // area
  static async addUpdatePropertyArea(data: AddUpdatePropertyAreaInput) {
    if (data.id) {
      const sql = `
          UPDATE property_area
          SET
            image = ?,
            name = ?,
            property_count = ?,
            status = ?
          WHERE id = ?
        `;

      const result: any = await executeQuery(sql, [
        data.image || null,
        data.name,
        data.property_count,
        data.status ?? "active",
        data.id,
      ]);

      return {
        id: data.id,
      };
    }

    const sql = `
        INSERT INTO property_area (
          image,
          name,
          property_count,
          status
        )
        VALUES (?, ?, ? , ?)
      `;

    const result: any = await executeQuery(sql, [
      data.image || null,
      data.name,
      data.property_count,
      data.status ?? 1,
    ]);

    return {
      id: result.insertId,
    };
  }

  static async getPropertyArea(data: GetPropertyAreaInput = {}) {
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
      property_count,
      status,
      created_at
    FROM property_area
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

  static async deletePropertyArea(id: number) {
    const sql = `
    DELETE FROM property_area
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

  // sub

  static async addUpdateSubProperty(data: AddUpdateSubCategoryInput) {
    if (data.id) {
      const sql = `
      UPDATE prop_sub_category
      SET
        prop_id = ?,
        sub_name = ?,
        status = ?
      WHERE id = ?
    `;

      await executeQuery(sql, [
        data.prop_id,
        data.sub_name,
        data.status,
        data.id,
      ]);

      await executeQuery(
        `
        UPDATE property
        SET has_subcat = 1
        WHERE id = ?
      `,
        [data.prop_id],
      );

      return {
        id: data.id,
      };
    }

    const sql = `
    INSERT INTO prop_sub_category (
      prop_id,
      sub_name,
      status
    )
    VALUES (?, ?, ?)
  `;

    const result: any = await executeQuery(sql, [
      data.prop_id,
      data.sub_name,
      data.status,
    ]);

    await executeQuery(
      `
      UPDATE property
      SET has_subcat = 1
      WHERE id = ?
    `,
      [data.prop_id],
    );

    return {
      id: result.insertId,
    };
  }

  static async getSubProperty(data: GetSubPropertyInput = {}) {
    const conditions: string[] = [];
    const values: any[] = [];

    if (data.id) {
      conditions.push("psc.id = ?");
      values.push(data.id);
    }

    if (data.prop_id) {
      conditions.push("psc.prop_id = ?");
      values.push(data.prop_id);
    }

    if (data.status !== undefined) {
      conditions.push("psc.status = ?");
      values.push(data.status);
    }

    let sql = `
    SELECT
      psc.id,
      psc.prop_id,
      psc.sub_name,
      psc.status,
      psc.created_at
    FROM prop_sub_category psc
  `;

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += ` ORDER BY psc.id DESC`;

    const rows: any = await executeQuery(sql, values);

    if (data.id) {
      return rows && rows.length > 0 ? rows[0] : null;
    }

    return rows || [];
  }

  static async addUpdateBookmark(data: any) {
    const { user_id, prop_id } = data;

    const existing: any = await executeQuery(
      `
    SELECT id
    FROM prop_bookmarks
    WHERE user_id = ?
      AND prop_id = ?
    LIMIT 1
    `,
      [user_id, prop_id],
    );

    if (existing.length > 0) {
      await executeQuery(
        `
      DELETE FROM prop_bookmarks
      WHERE user_id = ?
        AND prop_id = ?
      `,
        [user_id, prop_id],
      );

      return {
        user_id,
        prop_id,
        bookmarked: false,
        message: "Bookmark removed successfully",
      };
    }

    await executeQuery(
      `
    INSERT INTO prop_bookmarks
      (user_id, prop_id)
    VALUES
      (?, ?)
    `,
      [user_id, prop_id],
    );

    return {
      user_id,
      prop_id,
      bookmarked: true,
      message: "Property bookmarked successfully",
    };
  }

  static getPropertyPriceRange = async (
    prop_type: number,
    status: string | null,
  ) => {
    const query = `
    SELECT
      MIN(min_price) AS minPrice,
      MAX(max_price) AS maxPrice
    FROM prop_form
    WHERE category = ?
      AND status != 'deleted'
            ${status ? "AND status = ?" : ""}
  `;

    const params: any[] = [prop_type];

    if (status) {
      params.push(status);
    }

    const result: any[] = await executeQuery(query, params);

    return {
      minPrice: Number(result[0]?.minPrice || 0),
      maxPrice: Number(result[0]?.maxPrice || 0),
    };
  };

  // nearby
}
