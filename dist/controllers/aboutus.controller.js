"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutUsController = void 0;
const helper_1 = require("../utils/helper");
const validator_1 = require("../utils/validator");
const aboutus_model_1 = require("../models/aboutus.model");
class AboutUsController {
    static async addUpdateAboutUs(req, res) {
        try {
            const data = (0, helper_1.validateRequest)(req.body, validator_1.addUpdateAboutUsSchema);
            const result = await aboutus_model_1.AbouUsModel.addUpdateAboutUsdata(data);
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
    static async getAboutUsData(req, res) {
        try {
            const { id } = req.query;
            const aboutUsId = id ? Number(id) : undefined;
            const aboutUs = await aboutus_model_1.AbouUsModel.getABoutUsData({
                id: aboutUsId,
            });
            if (aboutUsId && !aboutUs) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "About Us data not found", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, aboutUsId ? [aboutUs] : aboutUs, "About Us data fetched successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", error.errors || []);
        }
    }
    // c_worker
    static async addUpdateConsultants(req, res) {
        try {
            const data = (0, helper_1.validateRequest)(req.body, validator_1.addUpdateConsultantSchema);
            const result = await aboutus_model_1.AbouUsModel.addUpdateConsultants(data);
            return (0, helper_1.sendResponse)(res, 200, 1, [result], data.id
                ? "Consultants updated successfully"
                : "Consultants added successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
    static async getConsultants(req, res) {
        try {
            const { id } = req.query;
            const consultantID = id ? Number(id) : undefined;
            const consultants = await aboutus_model_1.AbouUsModel.getConsultantData({
                id: consultantID,
            });
            if (consultantID && !consultants) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Consultants data not found", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, consultantID ? [consultants] : consultants, "Consultants  data fetched successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
}
exports.AboutUsController = AboutUsController;
