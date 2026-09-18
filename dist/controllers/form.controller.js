"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormController = void 0;
const helper_1 = require("../utils/helper");
const form_module_1 = require("../models/form.module");
class FormController {
    static async getProperty(req, res) {
        try {
            const { prop_id, type } = req.query;
            if (!prop_id) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "Property ID is required", []);
            }
            const data = await form_module_1.FormModule.getProperty({
                prop_id: String(prop_id),
                type: type ? String(type) : null,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, data, "Property fetched successfully", []);
        }
        catch (error) {
            console.error("getProperty error:", error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Something went wrong", [
                error?.message || error,
            ]);
        }
    }
}
exports.FormController = FormController;
_a = FormController;
FormController.savePropertyStep = async (req, res) => {
    try {
        const step = Number(req.body.step);
        const user_id = Number(req.body.user_id);
        const prop_id = req.body.prop_id ? String(req.body.prop_id).trim() : null;
        if (!step || step < 1 || step > 5) {
            return (0, helper_1.sendResponse)(res, 400, 0, [], "Invalid step", []);
        }
        if (step > 1 && !prop_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Property ID is required", []);
        }
        const data = await form_module_1.FormModule.savePropertyStep({
            step,
            prop_id,
            user_id,
            body: req.body,
        });
        return (0, helper_1.sendResponse)(res, 200, 1, data, `Property Form Data saved successfully`, []);
    }
    catch (error) {
        console.log(error);
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Something went wrong", [
            error?.message || error,
        ]);
    }
};
