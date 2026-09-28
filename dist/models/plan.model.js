"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanModel = void 0;
const db_1 = __importDefault(require("../config/db"));
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
    static async getPropertyPlan(data) {
        const { user_id, prop_id } = data;
        const query = `
    SELECT
      pp.id,
      pp.user_id,
      pp.prop_id,
      pp.plan_id,
      p.features AS features,
      p.old_amount AS old_amount,
      p.new_amount AS new_amount,
      p.duration AS duration,
      pp.purchased_at,
      pp.expired_at,

      CASE
        WHEN pp.purchased_at <= NOW()
          AND (pp.expired_at IS NULL OR pp.expired_at > NOW())
        THEN 1
        ELSE 0
      END AS is_active

    FROM prop_plans pp

    LEFT JOIN plan p
      ON p.id = pp.plan_id

    WHERE pp.user_id = ?
      AND pp.prop_id = ?

    ORDER BY pp.id DESC
  `;
        const result = await (0, helper_1.executeQuery)(query, [user_id, prop_id]);
        return result;
    }
    static async paidAndPost(data) {
        const { user_id, plan_id, prop_id, duration } = data;
        const connection = await db_1.default.getConnection();
        try {
            await connection.beginTransaction();
            // ---------------------------------------
            // PROPERTY
            // ---------------------------------------
            const [propertyRows] = await connection.query(`
      SELECT
        id,
        prop_id,
        user_id,
        status
      FROM prop_form
      WHERE prop_id = ?
        AND status IN ('approved', 'posted')
      LIMIT 1
      `, [prop_id]);
            if (!propertyRows.length) {
                throw new Error("Property not found");
            }
            const property = propertyRows[0];
            // ---------------------------------------
            // USER OWNERSHIP
            // ---------------------------------------
            if (Number(property.user_id) !== Number(user_id)) {
                throw new Error("You are not authorized to post this property");
            }
            // ---------------------------------------
            // PLAN
            // ---------------------------------------
            const [planRows] = await connection.query(`
      SELECT
        id,
        duration
      FROM plan
      WHERE id = ?
      LIMIT 1
      `, [plan_id]);
            if (!planRows.length) {
                throw new Error("Plan not found");
            }
            // ---------------------------------------
            // DURATION
            // ---------------------------------------
            const days = Number(duration);
            if (!Number.isInteger(days) || days <= 0) {
                throw new Error("Duration must be a valid number of days");
            }
            // ---------------------------------------
            // PURCHASE DATE
            // ---------------------------------------
            const purchasedAt = new Date();
            // ---------------------------------------
            // EXPIRY DATE
            // ---------------------------------------
            const expiredAt = new Date(purchasedAt);
            expiredAt.setDate(expiredAt.getDate() + days);
            // ---------------------------------------
            // UPDATE PROPERTY
            // ---------------------------------------
            await connection.query(`
      UPDATE prop_form
      SET
        purchase_plan = ?,
        purchased_at = ?,
        status = 'posted'
      WHERE prop_id = ?
        AND user_id = ?
      `, [plan_id, purchasedAt, prop_id, user_id]);
            // ---------------------------------------
            // INSERT HISTORY
            // ---------------------------------------
            await connection.query(`
      INSERT INTO prop_plans
      (
        user_id,
        plan_id,
        prop_id,
        purchased_at,
        expired_at
      )
      VALUES (?, ?, ?, ?, ?)
      `, [user_id, plan_id, prop_id, purchasedAt, expiredAt]);
            // ---------------------------------------
            // COMMIT
            // ---------------------------------------
            await connection.commit();
            return {
                user_id,
                plan_id,
                prop_id,
                duration: days,
                purchased_at: purchasedAt,
                expired_at: expiredAt,
                status: "posted",
            };
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    static async expireProperties() {
        const connection = await db_1.default.getConnection();
        try {
            const [result] = await connection.query(`
      UPDATE prop_form
      SET
        status = 'expired'
      WHERE status = 'posted'
        AND expired_at IS NOT NULL
        AND expired_at <= NOW()
    `);
            return {
                affectedRows: result.affectedRows,
            };
        }
        finally {
            connection.release();
        }
    }
}
exports.PlanModel = PlanModel;
