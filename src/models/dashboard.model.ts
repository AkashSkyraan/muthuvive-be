import { executeQuery } from "../utils/helper";

export class DashboardModel {
  static createAdmin = async (
    role: string,
    name: string,
    password: string,
    status: number,
  ) => {
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

    const result: any = await executeQuery(sql, [role, name, password, status]);

    return result.insertId;
  };

  static getById = async (id: number) => {
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

    const rows: any[] = await executeQuery(sql, [id]);

    return rows[0] || null;
  };

  static getByName = async (name: string) => {
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

    const rows: any[] = await executeQuery(sql, [name]);

    return rows[0] || null;
  };

  static updateAdmin = async (
    id: number,
    role: string,
    name: string,
    password: string,
    status: number,
  ) => {
    const sql = `
    UPDATE admins
    SET
      role = ?,
      name = ?,
      password = ?,
      status = ?
    WHERE id = ?
  `;

    return await executeQuery(sql, [role, name, password, status, id]);
  };

  static getAdminLogin = async (name: string) => {
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

    const rows: any[] = await executeQuery(sql, [name]);

    return rows[0] || null;
  };

  static async updatePropertyStatus(data: {
    prop_id: string;
    status: string;
    rejection_reason: string | null;
  }) {
    const { prop_id, status, rejection_reason } = data;

    let query = "";
    let params: any[] = [];

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

    const result: any = await executeQuery(query, params);

    if (!result?.affectedRows) {
      return null;
    }

    return {
      prop_id,
      status,
    };
  }

  static async getAdminById(id: number) {
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

    const rows = await executeQuery(query, [id]);

    const admins = rows as any[];

    return admins.length > 0 ? admins[0] : null;
  }

  static async getSUbAdmin({
    name,
    status,
    limit,
    offset,
  }: {
    name: string | null;
    status: string | null;
    limit: number;
    offset: number;
  }) {
    let whereQuery = `
    WHERE role = 'subadmin'
  `;

    const params: any[] = [];

    if (name) {
      whereQuery += ` AND name LIKE ?`;
      params.push(`%${name}%`);
    }

    if (status) {
      whereQuery += ` AND status = ?`;
      params.push(status);
    }

    // TOTAL RECORDS
    const countQuery = `
    SELECT COUNT(*) AS total
    FROM admins
    ${whereQuery}
  `;

    const countResult = await executeQuery(countQuery, params);

    const total = Number(countResult[0]?.total || 0);

    // PAGINATED DATA
    const dataQuery = `
    SELECT
      id,
      name,
      role,
      status
    FROM admins
    ${whereQuery}
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `;

    const dataResult = await executeQuery(dataQuery, [
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
