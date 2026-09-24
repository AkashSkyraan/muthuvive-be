"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModel = void 0;
const helper_1 = require("../utils/helper");
class DashboardModel {
    static async updatePropertyStatus(data) {
        const { prop_id, status, rejection_reason } = data;
        let query = "";
        let params = [];
        if (status === "accepted") {
            query = `
      UPDATE prop_form
      SET
        status = ?,
        approved_at = NOW(),
        rejected_at = NULL,
        rejected_reason = NULL,
        sold_at = NULL
      WHERE prop_id = ?

    `;
            params = ["approved", prop_id];
        }
        if (status === "rejected") {
            query = `
      UPDATE prop_form
      SET
        status = ?,
        rejected_at = NOW(),
        rejected_reason = ?,
        approved_at = NULL,
        sold_at = NULL
      WHERE prop_id = ?
        
    `;
            params = ["rejected", rejection_reason, prop_id];
        }
        if (status === "sold") {
            query = `
      UPDATE prop_form
      SET
        status = ?,
        sold_at = NOW(),
        approved_at = NULL,
        rejected_at = NULL,
        rejected_reason = NULL
      WHERE prop_id = ?
       
    `;
            params = ["sold", prop_id];
        }
        const result = await (0, helper_1.executeQuery)(query, params);
        if (!result?.affectedRows) {
            return null;
        }
        return {
            prop_id,
            status,
        };
    }
    static async getAdminById(id) {
        const query = `
    SELECT
      id,
      name,
      role,
      status
    FROM admins
    WHERE id = ?
    LIMIT 1
  `;
        const rows = await (0, helper_1.executeQuery)(query, [id]);
        const admins = rows;
        return admins.length > 0 ? admins[0] : null;
    }
    static async getSUbAdmin({ id, name, status, limit, offset, }) {
        let whereQuery = `
    WHERE role = 'subadmin'
  `;
        const params = [];
        // ID filter
        if (id) {
            whereQuery += `
      AND id = ?
    `;
            params.push(id);
        }
        if (name) {
            whereQuery += `
      AND name LIKE ?
    `;
            params.push(`%${name}%`);
        }
        if (status) {
            whereQuery += `
      AND status = ?
    `;
            params.push(status);
        }
        // ==========================================
        // COUNT
        // ==========================================
        const countQuery = `
    SELECT COUNT(*) AS total
    FROM admins
    ${whereQuery}
  `;
        const countResult = await (0, helper_1.executeQuery)(countQuery, params);
        const total = Number(countResult[0]?.total || 0);
        // ==========================================
        // DATA
        // ==========================================
        const dataQuery = `
    SELECT
      id,
      name,
      role,
      status,
      password
    FROM admins
    ${whereQuery}
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `;
        const dataResult = await (0, helper_1.executeQuery)(dataQuery, [
            ...params,
            limit,
            offset,
        ]);
        return {
            data: dataResult,
            total,
        };
    }
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
