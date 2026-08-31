import { AddUpdatePlanInput, GetPlanInput } from "../types/plan.types";
import { executeQuery } from "../utils/helper";

export class PlanModel {
  static async addUpdatePlan(data: AddUpdatePlanInput) {
    if (data.id) {
      const sql = `
      UPDATE plan
      SET
        duration = ?,
        old_amount = ?,
        new_amount = ?,
        features = ?,
        status = ?
      WHERE id = ?
    `;

      await executeQuery(sql, [
        data.duration,
        data.old_amount ?? 0,
        data.new_amount,
        JSON.stringify(data.features || []),
        data.status ?? "active",
        data.id,
      ]);

      return {
        id: data.id,
      };
    }

    const sql = `
    INSERT INTO plan (
      
      duration,
      old_amount,
      new_amount,
      features,
      status
    )
    VALUES ( ?, ?, ?, ?, ?)
  `;

    const result: any = await executeQuery(sql, [
      data.duration,
      data.old_amount ?? 0,
      data.new_amount,
      JSON.stringify(data.features || []),
      data.status ?? "active",
    ]);

    return {
      id: result.insertId,
    };
  }

  static async getPlan(data: GetPlanInput = {}) {
    const conditions: string[] = [];
    const values: any[] = [];

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
      
      duration,
      old_amount,
      new_amount,
      features,
      status,
      created_at,
      updated_at
    FROM plan
  `;

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += ` ORDER BY id DESC`;

    const rows: any = await executeQuery(sql, values);

    if (data.id) {
      if (!rows || rows.length === 0) {
        return null;
      }

      const plan = rows[0];

      plan.features = plan.features ? JSON.parse(plan.features) : [];

      return plan;
    }

    return (rows || []).map((plan: any) => ({
      ...plan,
      features: plan.features ? JSON.parse(plan.features) : [],
    }));
  }

  static async deletePlan(id: number) {
    const sql = `
    DELETE FROM plan
    WHERE id = ?
  `;

    const result: any = await executeQuery(sql, [id]);

    if (result.affectedRows === 0) {
      return null;
    }

    return {
      id,
    };
  }
}
