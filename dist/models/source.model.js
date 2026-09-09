"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceModel = void 0;
const helper_1 = require("../utils/helper");
class SourceModel {
    static async insertMultipleMedia(files) {
        if (!files?.length) {
            return [];
        }
        const values = [];
        const placeholders = [];
        files.forEach((file) => {
            placeholders.push("(?, ?, ?, ?, ?, ?, ?)");
            values.push(file.file_name, file.org_name, file.url, file.path, file.mime_type, file.media_type, file.file_size);
        });
        const query = `
    INSERT INTO media (
      file_name,
      org_name,
      url,
      path,
      mime_type,
      media_type,
      file_size
    )
    VALUES ${placeholders.join(", ")}
  `;
        const result = await (0, helper_1.executeQuery)(query, values);
        const insertedIds = [];
        for (let i = 0; i < result.affectedRows; i++) {
            insertedIds.push(result.insertId + i);
        }
        return insertedIds;
    }
    static async getUploads(params) {
        const { media_type, id } = params;
        const conditions = ["status = 'active'"];
        const queryParams = [];
        if (media_type) {
            const types = media_type.split(",").map((t) => t.trim());
            if (types.length) {
                conditions.push(`media_type IN (${types.map(() => "?").join(",")})`);
                queryParams.push(...types);
            }
        }
        if (id) {
            let ids = [];
            if (Array.isArray(id)) {
                ids = id;
            }
            else {
                ids = String(id)
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean);
            }
            if (ids.length) {
                conditions.push(`id IN (${ids.map(() => "?").join(",")})`);
                queryParams.push(...ids);
            }
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
        const dataQuery = `
    SELECT
      id,
      file_name,
      org_name,
      url,
      file_size,
    COALESCE(created_at, '') AS created_at
    FROM media
    ${whereClause}
    ORDER BY id DESC
    
  `;
        const rows = await (0, helper_1.executeQuery)(dataQuery, [...queryParams]);
        return {
            data: rows || [],
        };
    }
    // aminities
    static async addUpdateAminities(data) {
        console.log(data);
        if (data.id) {
            const sql = `
        UPDATE amenities
        SET
          name = ?,
          status = ?
        WHERE id = ?
      `;
            await (0, helper_1.executeQuery)(sql, [data.name, data.status, data.id]);
            return {
                id: data.id,
            };
        }
        const sql = `
      INSERT INTO amenities (
       name 
      )
      VALUES (?)
    `;
        const result = await (0, helper_1.executeQuery)(sql, [data.name]);
        return {
            id: result.insertId,
        };
    }
    static async getAmenities(data = {}) {
        const conditions = [];
        const values = [];
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
      status,
      created_at
    FROM amenities
  `;
        if (conditions.length > 0) {
            sql += ` WHERE ${conditions.join(" AND ")}`;
        }
        sql += ` ORDER BY id DESC`;
        const rows = await (0, helper_1.executeQuery)(sql, values);
        if (data.id) {
            return rows.length > 0 ? rows[0] : null;
        }
        return rows || [];
    }
    // property highlights
    static async addUpdatePropertyHighlights(data) {
        if (data.id) {
            const sql = `
      UPDATE prop_highlights
      SET
        name = ?,
        status = ?
      WHERE id = ?
    `;
            const values = [data.name, data.status, data.id];
            await (0, helper_1.executeQuery)(sql, values);
            return {
                id: data.id,
            };
        }
        const sql = `
    INSERT INTO prop_highlights (
      name,
      status
    )
    VALUES (?, ?)
  `;
        const result = await (0, helper_1.executeQuery)(sql, [data.name, data.status]);
        return {
            id: result.insertId,
        };
    }
    static async getPropertyHighlights(data = {}) {
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
        let sql = ` SELECT id, name, status, created_at FROM prop_highlights `;
        if (conditions.length > 0) {
            sql += ` WHERE ${conditions.join(" AND ")}`;
        }
        sql += ` ORDER BY id DESC`;
        const rows = await (0, helper_1.executeQuery)(sql, values);
        if (data.id) {
            return rows.length > 0 ? rows[0] : null;
        }
        return rows || [];
    }
}
exports.SourceModel = SourceModel;
