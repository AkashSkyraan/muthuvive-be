import { Request, Response } from "express";
import { EnquiryModel } from "../models/enquiry.model";
import { sendResponse, validateRequest } from "../utils/helper";
import { addUpdateEnquirySchema } from "../utils/validator";

class EnquiryController {
  static async addUpdateEnquiry(req: Request, res: Response) {
    try {
      const data = validateRequest(req.body, addUpdateEnquirySchema);

      const result = await EnquiryModel.addUpdateEnquiry(data);

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

  static async getEnquiryData(req: Request, res: Response) {
    try {
      const { id, status, regarding, property_id, mobile, email } = req.query;

      const enquiryId = id ? Number(id) : undefined;
      const propertyId = property_id ? Number(property_id) : undefined;

      const enquiries = await EnquiryModel.getEnquiry({
        id: enquiryId,
        status: status ? String(status) : undefined,
        regarding: regarding ? String(regarding) : undefined,
        property_id: propertyId,
        mobile: mobile ? String(mobile) : undefined,
        email: email ? String(email) : undefined,
      });

      if (enquiryId && !enquiries) {
        return sendResponse(res, 200, 0, [], "Enquiry data not found", []);
      }

      return sendResponse(
        res,
        200,
        1,
        enquiryId ? [enquiries] : enquiries,
        "Enquiries fetched successfully",
        [],
      );
    } catch (error: any) {
      console.log("Get Enquiry Error:", error);

      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }
}

export default EnquiryController;
