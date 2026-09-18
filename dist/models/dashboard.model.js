"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModel = void 0;
const helper_1 = require("../utils/helper");
class DashboardModel {
}
exports.DashboardModel = DashboardModel;
_a = DashboardModel;
DashboardModel.createAdmin = async (role, name, password, status) => {
    const sql = `
    INSERT INTO admins
    (
      role,
      name,
      password,
      status
    )
    VALUES (?, ?, ?, ?)
  `;
    const result = await (0, helper_1.executeQuery)(sql, [role, name, password, status]);
    return result.insertId;
};
DashboardModel.getById = async (id) => {
    const sql = `
    SELECT
      id,
      role,
      name,
      password,
      status
    FROM admins
    WHERE id = ?
    LIMIT 1
  `;
    const rows = await (0, helper_1.executeQuery)(sql, [id]);
    return rows[0] || null;
};
DashboardModel.getByName = async (name) => {
    const sql = `
    SELECT
      id,
      role,
      name,
      password,
      status
    FROM admins
    WHERE name = ?
    LIMIT 1
  `;
    const rows = await (0, helper_1.executeQuery)(sql, [name]);
    return rows[0] || null;
};
DashboardModel.updateAdmin = async (id, role, name, password, status) => {
    const sql = `
    UPDATE admins
    SET
      role = ?,
      name = ?,
      password = ?,
      status = ?
    WHERE id = ?
  `;
    return await (0, helper_1.executeQuery)(sql, [role, name, password, status, id]);
};
DashboardModel.getAdminLogin = async (name) => {
    const sql = `
    SELECT
      id,
      role,
      name,
      password,
      status
    FROM admins
    WHERE name = ?
    LIMIT 1
  `;
    const rows = await (0, helper_1.executeQuery)(sql, [name]);
    return rows[0] || null;
};
