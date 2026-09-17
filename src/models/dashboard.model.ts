import { executeQuery } from "../utils/helper";

export class DashboardModel {
  static async getByUsername(name: string) {
    const [rows]: any = await executeQuery(
      `
      SELECT *
      FROM admins
      WHERE name = ?
      LIMIT 1
      `,
      [name],
    );

    return rows[0] || null;
  }

  static async createAdmin(name: string, password: string) {
    const [result]: any = await executeQuery(
      `
      INSERT INTO admins
      (
        name,
        password,
        role,
        status
      )
      VALUES (?, ?, 'admin','active')
      `,
      [name, password],
    );

    return result.insertId;
  }

  static async getSubAdmins() {
    const [rows]: any = await executeQuery(
      `
      SELECT
        id,
        name,
        role,
        status,
        
        created_at
      FROM admins
      WHERE role = 'subadmin'
      ORDER BY id DESC
      `,
    );

    return rows;
  }
}
