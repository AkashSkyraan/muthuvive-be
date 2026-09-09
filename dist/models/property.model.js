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
            data.status ?? "active",
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
    // area
    static async addUpdatePropertyArea(data) {
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
            const result = await (0, helper_1.executeQuery)(sql, [
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
        const result = await (0, helper_1.executeQuery)(sql, [
            data.image || null,
            data.name,
            data.property_count,
            data.status ?? 1,
        ]);
        return {
            id: result.insertId,
        };
    }
    static async getPropertyArea(data = {}) {
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
      property_count,
      status,
      created_at
    FROM property_area
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
    static async deletePropertyArea(id) {
        const sql = `
    DELETE FROM property_area
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
    // sub
    static async addUpdateSubProperty(data) {
        if (data.id) {
            const sql = `
      UPDATE prop_sub_category
      SET
        prop_id = ?,
        sub_name = ?,
        status = ?
      WHERE id = ?
    `;
            await (0, helper_1.executeQuery)(sql, [
                data.prop_id,
                data.sub_name,
                data.status,
                data.id,
            ]);
            await (0, helper_1.executeQuery)(`
        UPDATE property
        SET has_subcat = 1
        WHERE id = ?
      `, [data.prop_id]);
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
        const result = await (0, helper_1.executeQuery)(sql, [
            data.prop_id,
            data.sub_name,
            data.status,
        ]);
        await (0, helper_1.executeQuery)(`
      UPDATE property
      SET has_subcat = 1
      WHERE id = ?
    `, [data.prop_id]);
        return {
            id: result.insertId,
        };
    }
    static async getSubProperty(data = {}) {
        const conditions = [];
        const values = [];
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
        const rows = await (0, helper_1.executeQuery)(sql, values);
        if (data.id) {
            return rows && rows.length > 0 ? rows[0] : null;
        }
        return rows || [];
    }
}
exports.PropertyModel = PropertyModel;
