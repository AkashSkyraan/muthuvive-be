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
        email = ? ,
        c_yoe = ? ,
        c_projects = ?,
        c_clients = ?,
        c_built = ?
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
                data.c_yoe,
                data.c_projects,
                data.c_clients,
                data.c_built,
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
      email,
      c_yoe,
      c_projects,
      c_clients,
      c_built
    )
    VALUES (?, ?, ?, ? ,? , ?,?,?,?,?,?)
  `;
        const result = await (0, helper_1.executeQuery)(sql, [
            data.yoe,
            data.projects,
            data.clients,
            data.users,
            data.address,
            data.mobile,
            data.email,
            data.c_yoe,
            data.c_projects,
            data.c_clients,
            data.c_built,
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
      email,
      c_yoe,
      c_projects,
      c_clients,
      c_built
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
    // cons
    static async addUpdateConsultants(data) {
        if (data.id) {
            const sql = `
      UPDATE construct_consultants
      SET
       name = ?,
       role = ? ,
       image = ?
      WHERE id = ?
    `;
            await (0, helper_1.executeQuery)(sql, [data.name, data.role, data.image, data.id]);
            return {
                id: data.id,
            };
        }
        const sql = `
    INSERT INTO construct_consultants (
      name ,
      role,
      image
    )
    VALUES (?, ?,?)
  `;
        const result = await (0, helper_1.executeQuery)(sql, [
            data.name,
            data.role,
            data.image,
        ]);
        return {
            id: result.insertId,
        };
    }
    static async getConsultantData(data = {}) {
        const conditions = [];
        const values = [];
        if (data.id) {
            conditions.push("id = ?");
            values.push(data.id);
        }
        let sql = `
    SELECT
      id,
      name,
      role,
      image
    FROM construct_consultants
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
