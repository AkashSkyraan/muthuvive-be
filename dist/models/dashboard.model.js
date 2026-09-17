"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModel = void 0;
const helper_1 = require("../utils/helper");
class DashboardModel {
    static async getByUsername(name) {
        const [rows] = await (0, helper_1.executeQuery)(`
      SELECT *
      FROM admins
      WHERE name = ?
      LIMIT 1
      `, [name]);
        return rows[0] || null;
    }
    static async createAdmin(name, password) {
        const [result] = await (0, helper_1.executeQuery)(`
      INSERT INTO admins
      (
        name,
        password,
        role,
        status
      )
      VALUES (?, ?, 'admin','active')
      `, [name, password]);
        return result.insertId;
    }
    static async getSubAdmins() {
        const [rows] = await (0, helper_1.executeQuery)(`
      SELECT
        id,
        name,
        role,
        status,
        
        created_at
      FROM admins
      WHERE role = 'subadmin'
      ORDER BY id DESC
      `);
        return rows;
    }
}
exports.DashboardModel = DashboardModel;
