"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanModel = void 0;
const helper_1 = require("../utils/helper");
class PlanModel {
    static async addUpdatePlan(data) {
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
            await (0, helper_1.executeQuery)(sql, [
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
        const result = await (0, helper_1.executeQuery)(sql, [
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
    static async getPlan(data = {}) {
        const conditions = [];
        const values = [];
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
      name,
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
        const rows = await (0, helper_1.executeQuery)(sql, values);
        const parseFeatures = (features) => {
            if (!features) {
                return [];
            }
            // MySQL driver may already return an array/object
            if (Array.isArray(features)) {
                return features;
            }
            if (typeof features === "object") {
                return features;
            }
            if (typeof features === "string") {
                try {
                    return JSON.parse(features);
                }
                catch {
                    return [];
                }
            }
            return [];
        };
        if (data.id) {
            if (!rows || rows.length === 0) {
                return null;
            }
            const plan = rows[0];
            plan.features = parseFeatures(plan.features);
            return plan;
        }
        return (rows || []).map((plan) => ({
            ...plan,
            features: parseFeatures(plan.features),
        }));
    }
    static async deletePlan(id) {
        const sql = `
    DELETE FROM plan
    WHERE id = ?
  `;
        const result = await (0, helper_1.executeQuery)(sql, [id]);
        if (result.affectedRows === 0) {
            return null;
        }
        return {
            id,
        };
    }
}
exports.PlanModel = PlanModel;
