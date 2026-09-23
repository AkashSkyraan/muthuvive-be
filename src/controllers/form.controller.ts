import { Request, Response } from "express";
import { sendResponse } from "../utils/helper";
import { FormModule } from "../models/form.module";
import { customAlphabet } from "nanoid";

export class FormController {
  static savePropertyStep = async (req: Request, res: Response) => {
    try {
      const step = Number(req.body.step);
      const user_id = Number(req.body.user_id);
      const prop_id = req.body.prop_id ? String(req.body.prop_id).trim() : null;
      if (!step || step < 1 || step > 5) {
        return sendResponse(res, 400, 0, [], "Invalid step", []);
      }

      if (step > 1 && !prop_id) {
        return sendResponse(res, 200, 0, [], "Property ID is required", []);
      }
      const data = await FormModule.savePropertyStep({
        step,
        prop_id,
        user_id,
        body: req.body,
      });

      return sendResponse(
        res,
        200,
        1,
        data,
        `Property Form Data saved successfully`,
        [],
      );
    } catch (error: any) {
      console.log(error);
      return sendResponse(res, 500, 0, [], "Something went wrong", [
        error?.message || error,
      ]);
    }
  };

  static async getProperty(req: Request, res: Response) {
    try {
      const { prop_id, type, user_id } = req.query;

      if (!prop_id) {
        return sendResponse(res, 400, 0, [], "Property ID is required", []);
      }

      const data = await FormModule.getProperty({
        prop_id: String(prop_id),
        type: type ? String(type) : null,
        user_id: Number(user_id) || null,
      });

      return sendResponse(
        res,
        200,
        1,
        data,
        "Property fetched successfully",
        [],
      );
    } catch (error: any) {
      console.error("getProperty error:", error);

      return sendResponse(res, 500, 0, [], "Something went wrong", [
        error?.message || error,
      ]);
    }
  }
}
