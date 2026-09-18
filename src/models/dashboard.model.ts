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
}
