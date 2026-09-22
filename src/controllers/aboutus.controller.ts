import { Request, Response } from "express";
import { sendResponse, validateRequest } from "../utils/helper";
import {
  addUpdateAboutUsSchema,
  addUpdateConsultantSchema,
} from "../utils/validator";
import { AbouUsModel } from "../models/aboutus.model";

export class AboutUsController {
  static async addUpdateAboutUs(req: Request, res: Response) {
    try {
      const data = validateRequest(req.body, addUpdateAboutUsSchema);

      const result = await AbouUsModel.addUpdateAboutUsdata(data);

      return sendResponse(
        res,
        200,
        1,
        [result],
        data.id
          ? "About Us updated successfully"
          : "About Us added successfully",
        [],
      );
    } catch (error: any) {
      console.log(error);
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }

  static async getAboutUsData(req: Request, res: Response) {
    try {
      const { id } = req.query;

      const aboutUsId = id ? Number(id) : undefined;

      const aboutUs = await AbouUsModel.getABoutUsData({
        id: aboutUsId,
      });

      if (aboutUsId && !aboutUs) {
        return sendResponse(res, 200, 0, [], "About Us data not found", []);
      }

      return sendResponse(
        res,
        200,
        1,
        aboutUsId ? [aboutUs] : aboutUs,
        "About Us data fetched successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "Internal server error",
        error.errors || [],
      );
    }
  }

  // c_worker

  static async addUpdateConsultants(req: Request, res: Response) {
    try {
      const data = validateRequest(req.body, addUpdateConsultantSchema);

      const result = await AbouUsModel.addUpdateConsultants(data);

      return sendResponse(
        res,
        200,
        1,
        [result],
        data.id
          ? "Consultants updated successfully"
          : "Consultants added successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }

  static async getConsultants(req: Request, res: Response) {
    try {
      const { id } = req.query;

      const consultantID = id ? Number(id) : undefined;

      const consultants = await AbouUsModel.getConsultantData({
        id: consultantID,
      });



      if (consultantID && !consultants) {
        return sendResponse(res, 200, 0, [], "Consultants data not found", []);
      }

      

      return sendResponse(
        res,
        200,
        1,
        consultantID ? [consultants] : consultants,
        "Consultants  data fetched successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }
}
