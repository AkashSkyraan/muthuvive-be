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
      console.log(error);
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

  static async getPropertyPlan(req: Request, res: Response) {
    try {
      const { user_id, prop_id } = req.query;

      if (!user_id || !prop_id) {
        return sendResponse(
          res,
          400,
          0,
          [],
          "user_id and prop_id are required",
          [],
        );
      }

      const data = await PlanModel.getPropertyPlan({
        user_id: Number(user_id),
        prop_id: String(prop_id),
      });

      return sendResponse(
        res,
        200,
        1,
        data,
        "Property plan fetched successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error?.message || error,
      ]);
    }
  }

  // 

  static async paidAndPost(req: Request, res: Response) {
  try {
    const { user_id, plan_id, prop_id, duration } = req.body;

    if (!user_id || !plan_id || !prop_id || !duration) {
      return sendResponse(
        res,
        400,
        0,
        [],
        "user_id, plan_id, prop_id and duration are required",
        []
      );
    }

    const result = await PlanModel.paidAndPost({
      user_id: Number(user_id),
      plan_id: Number(plan_id),
      prop_id: String(prop_id),
      duration: Number(duration),
    });

    return sendResponse(
      res,
      200,
      1,
      [result],
      "Property paid and posted successfully",
      []
    );
  } catch (error: any) {
    console.error("paidAndPost error:", error);

    return sendResponse(
      res,
      500,
      0,
      [],
       "Something went wrong",
      [error.message]
    );
  }
}
}
