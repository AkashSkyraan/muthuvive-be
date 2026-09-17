import {
  AddUpdateAboutus,
  AddUpdateConsultant,
  GetAboutUsData,
  GetConsultant,
} from "../types/aboutus.types";
import { executeQuery } from "../utils/helper";

export class AbouUsModel {
  static async addUpdateAboutUsdata(data: AddUpdateAboutus) {
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

      await executeQuery(sql, [
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

    const result: any = await executeQuery(sql, [
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

  static async getABoutUsData(data: GetAboutUsData = {}) {
    const conditions: string[] = [];
    const values: any[] = [];

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

    const rows: any = await executeQuery(sql, values);

    if (data.id) {
      return rows && rows.length > 0 ? rows[0] : null;
    }

    return rows || [];
  }

  // cons

  static async addUpdateConsultants(data: AddUpdateConsultant) {
    if (data.id) {
      const sql = `
      UPDATE construct_consultants
      SET
       name = ?,
       role = ? ,
       image = ?
      WHERE id = ?
    `;

      await executeQuery(sql, [data.name, data.role, data.image, data.id]);

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

    const result: any = await executeQuery(sql, [
      data.name,
      data.role,
      data.image,
    ]);

    return {
      id: result.insertId,
    };
  }

  static async getConsultantData(data: GetConsultant = {}) {
    const conditions: string[] = [];
    const values: any[] = [];

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

    const rows: any = await executeQuery(sql, values);

    if (data.id) {
      return rows && rows.length > 0 ? rows[0] : null;
    }

    return rows || [];
  }
}
