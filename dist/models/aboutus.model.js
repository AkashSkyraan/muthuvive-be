"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbouUsModel = void 0;
const helper_1 = require("../utils/helper");
class AbouUsModel {
    static async addUpdateAboutUsdata(data) {
        console.log(data);
        if (data.id) {
            const sql = `
      UPDATE about_us
      SET
        yoe = ?,
        projects = ?,
        clients = ?,
        users = ?,
        address = ?,
        mobile = ?,
        email = ? 
      WHERE id = ?
    `;
            await (0, helper_1.executeQuery)(sql, [
                data.yoe,
                data.projects,
                data.clients,
                data.users,
                data.address,
                data.mobile,
                data.email,
                data.id,
            ]);
            return {
                id: data.id,
            };
        }
        const sql = `
    INSERT INTO about_us (
      yoe,
      projects,
      clients,
      users,
      address,
      mobile,
      email
    )
    VALUES (?, ?, ?, ? ,? , ?,?)
  `;
        const result = await (0, helper_1.executeQuery)(sql, [
            data.yoe,
            data.projects,
            data.clients,
            data.users,
            data.address,
            data.mobile,
            data.email,
        ]);
        return {
            id: result.insertId,
        };
    }
    static async getABoutUsData(data = {}) {
        const conditions = [];
        const values = [];
        if (data.id) {
            conditions.push("id = ?");
            values.push(data.id);
        }
        let sql = `
    SELECT
      id,
      yoe,
      projects,
      clients,
      users,
      address,
      mobile,
      email
    FROM about_us
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
}
exports.AbouUsModel = AbouUsModel;
