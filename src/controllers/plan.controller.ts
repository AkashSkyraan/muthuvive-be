import { Request, Response } from "express";
import { PlanModel } from "../models/plan.model";
import { sendResponse, validateRequest } from "../utils/helper";
import { addUpdatePlanSchema } from "../utils/validator";

export class PlanController {
  static async addUpdatePlan(req: Request, res: Response) {
    try {
      const data = validateRequest(req.body, addUpdatePlanSchema);

      const result = await PlanModel.addUpdatePlan(data);

      return sendResponse(
        res,
        200,
        1,
        [result],
        data.id ? "Plan updated successfully" : "Plan added successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(
        res,
        error.status || 500,
        0,
        [],
        error.message || "Internal server error",
        error.errors || [],
      );
    }
  }

  static async getPlans(req: Request, res: Response) {
    try {
      const { id, status } = req.query;

      const planId = id ? Number(id) : undefined;

      const planStatus =
        status !== undefined ? String(status).trim().toLowerCase() : undefined;

      const plans = await PlanModel.getPlan({
        id: planId,
        status: planStatus,
      });

      if (planId && !plans) {
        return sendResponse(res, 200, 0, [], "Plan not found", []);
      }

      return sendResponse(
        res,
        200,
        1,
        planId ? [plans] : plans,
        "Plans fetched successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }

  static async deletePlan(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const planId = Number(id);
      if (!id) {
        return sendResponse(res, 200, 0, [], "ID is required", []);
      }

      const result = await PlanModel.deletePlan(planId);

      if (!result) {
        return sendResponse(res, 200, 0, [], "Plan not found", []);
      }

      return sendResponse(
        res,
        200,
        1,
        [result],
        "Plan deleted successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }
}
