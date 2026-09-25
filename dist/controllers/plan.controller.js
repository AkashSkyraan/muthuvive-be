"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanController = void 0;
const plan_model_1 = require("../models/plan.model");
const helper_1 = require("../utils/helper");
const validator_1 = require("../utils/validator");
class PlanController {
    static async addUpdatePlan(req, res) {
        try {
            const data = (0, helper_1.validateRequest)(req.body, validator_1.addUpdatePlanSchema);
            const result = await plan_model_1.PlanModel.addUpdatePlan(data);
            return (0, helper_1.sendResponse)(res, 200, 1, [result], data.id ? "Plan updated successfully" : "Plan added successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, error.status || 500, 0, [], error.message || "Internal server error", error.errors || []);
        }
    }
    static async getPlans(req, res) {
        try {
            const { id, status } = req.query;
            const planId = id ? Number(id) : undefined;
            const planStatus = status !== undefined ? String(status).trim().toLowerCase() : undefined;
            const plans = await plan_model_1.PlanModel.getPlan({
                id: planId,
                status: planStatus,
            });
            if (planId && !plans) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Plan not found", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, planId ? [plans] : plans, "Plans fetched successfully", []);
        }
        catch (error) {
            console.log(error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
    static async deletePlan(req, res) {
        try {
            const { id } = req.params;
            const planId = Number(id);
            if (!id) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "ID is required", []);
            }
            const result = await plan_model_1.PlanModel.deletePlan(planId);
            if (!result) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Plan not found", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, [result], "Plan deleted successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
    static async getPropertyPlan(req, res) {
        try {
            const { user_id, prop_id } = req.query;
            if (!user_id || !prop_id) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "user_id and prop_id are required", []);
            }
            const data = await plan_model_1.PlanModel.getPropertyPlan({
                user_id: Number(user_id),
                prop_id: String(prop_id),
            });
            return (0, helper_1.sendResponse)(res, 200, 1, data, "Property plan fetched successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error?.message || error,
            ]);
        }
    }
}
exports.PlanController = PlanController;
