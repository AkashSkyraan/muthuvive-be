"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enquiry_model_1 = require("../models/enquiry.model");
const helper_1 = require("../utils/helper");
const validator_1 = require("../utils/validator");
class EnquiryController {
    static async addUpdateEnquiry(req, res) {
        try {
            const data = (0, helper_1.validateRequest)(req.body, validator_1.addUpdateEnquirySchema);
            const result = await enquiry_model_1.EnquiryModel.addUpdateEnquiry(data);
            return (0, helper_1.sendResponse)(res, 200, 1, [result], data.id
                ? "About Us updated successfully"
                : "About Us added successfully", []);
        }
        catch (error) {
            console.log(error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
    static async getEnquiryData(req, res) {
        try {
            const { id, status, regarding, property_id, mobile, email } = req.query;
            const enquiryId = id ? Number(id) : undefined;
            const propertyId = property_id ? String(property_id) : undefined;
            const enquiries = await enquiry_model_1.EnquiryModel.getEnquiry({
                id: enquiryId,
                status: status ? String(status) : undefined,
                regarding: regarding ? String(regarding) : undefined,
                property_id: propertyId,
                mobile: mobile ? String(mobile) : undefined,
                email: email ? String(email) : undefined,
            });
            if (enquiryId && !enquiries) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Enquiry data not found", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, enquiryId ? [enquiries] : enquiries, "Enquiries fetched successfully", []);
        }
        catch (error) {
            console.log("Get Enquiry Error:", error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
    static async enquiryStatusChange(req, res) {
        try {
            const data = (0, helper_1.validateRequest)(req.body, validator_1.EnquiryStatusSchema);
            const result = await enquiry_model_1.EnquiryModel.addUpdateEnquiryStatus(data);
            return (0, helper_1.sendResponse)(res, 200, 1, [result], "Enquiry status updated successfully", []);
        }
        catch (error) {
            console.log("Enquiry status change error:", error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error?.errors || error?.message,
            ]);
        }
    }
}
exports.default = EnquiryController;
