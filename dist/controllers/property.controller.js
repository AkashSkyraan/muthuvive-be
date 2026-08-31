"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyController = void 0;
const helper_1 = require("../utils/helper");
const validator_1 = require("../utils/validator");
const property_model_1 = require("../models/property.model");
class PropertyController {
    static async addUpdateProperty(req, res) {
        try {
            const data = (0, helper_1.validateRequest)(req.body, validator_1.addUpdateCategorySchema);
            const result = await property_model_1.PropertyModel.addUpdateProperty(data);
            return (0, helper_1.sendResponse)(res, 200, 1, [result], data.id
                ? "Category updated successfully"
                : "Category added successfully", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], err.message || "Internal Server Error", err.errors || []);
        }
    }
    static async getProperties(req, res) {
        try {
            const { id, status } = req.query;
            const propertyId = id ? Number(id) : undefined;
            const propertyStatus = status !== undefined ? String(status).trim() : undefined;
            if (id && (isNaN(propertyId) || propertyId <= 0)) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid property id", []);
            }
            if (propertyStatus !== undefined &&
                !["active", "inactive"].includes(propertyStatus.toLowerCase())) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Status must be either active or inactive", []);
            }
            const properties = await property_model_1.PropertyModel.getProperty({
                id: propertyId,
                status: propertyStatus?.toLowerCase(),
            });
            if (propertyId && !properties) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Property not found", []);
            }
            const assetUrl = process.env.ASSET_URL || "";
            if (propertyId) {
                properties.image = properties.image
                    ? `${assetUrl}${properties.image}`
                    : null;
            }
            else {
                properties.forEach((property) => {
                    property.image = property.image
                        ? `${assetUrl}${property.image}`
                        : null;
                });
            }
            return (0, helper_1.sendResponse)(res, 200, 1, propertyId ? [properties] : properties, "Properties fetched successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
    static async deleteProperty(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid property id", []);
            }
            const result = await property_model_1.PropertyModel.deleteProperty(Number(id));
            if (!result) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Property not found", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, [result], "Property deleted successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
}
exports.PropertyController = PropertyController;
