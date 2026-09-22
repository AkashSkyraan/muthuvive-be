"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyController = void 0;
const helper_1 = require("../utils/helper");
const validator_1 = require("../utils/validator");
const property_model_1 = require("../models/property.model");
const form_module_1 = require("../models/form.module");
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
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
                err.errors,
            ]);
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
    // by area
    static async addUpdatePropertyArea(req, res) {
        try {
            const data = (0, helper_1.validateRequest)(req.body, validator_1.addUpdatePropertyAreaSchema);
            const result = await property_model_1.PropertyModel.addUpdatePropertyArea(data);
            return (0, helper_1.sendResponse)(res, 200, 1, [result], data.id
                ? "Property Area updated successfully"
                : "Property Area added successfully", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], err.message || "Internal Server Error", err.errors || []);
        }
    }
    static async getPropertyArea(req, res) {
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
            const properties = await property_model_1.PropertyModel.getPropertyArea({
                id: propertyId,
                status: propertyStatus?.toLowerCase(),
            });
            if (propertyId && !properties) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Property Area not found", []);
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
            return (0, helper_1.sendResponse)(res, 200, 1, propertyId ? [properties] : properties, "Property Area fetched successfully", []);
        }
        catch (error) {
            console.log(error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
    static async deletePropertyArea(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid property id", []);
            }
            const result = await property_model_1.PropertyModel.deletePropertyArea(Number(id));
            if (!result) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Property not found", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, [result], "Property Area deleted successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
    // sub cat
    static async addUpdateSubProperty(req, res) {
        try {
            const data = (0, helper_1.validateRequest)(req.body, validator_1.addUpdateSubCategorySchema);
            const result = await property_model_1.PropertyModel.addUpdateSubProperty(data);
            return (0, helper_1.sendResponse)(res, 200, 1, [result], data.id
                ? "Sub category updated successfully"
                : "Sub category added successfully", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
                err.errors,
            ]);
        }
    }
    static async getSubProperties(req, res) {
        try {
            const { id, prop_id, status } = req.query;
            const subPropertyId = id ? Number(id) : undefined;
            const propertyId = prop_id ? Number(prop_id) : undefined;
            const subPropertyStatus = status !== undefined ? String(status).trim().toLowerCase() : undefined;
            if (id !== undefined && (isNaN(subPropertyId) || subPropertyId <= 0)) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid sub category id", []);
            }
            if (prop_id !== undefined && (isNaN(propertyId) || propertyId <= 0)) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid property id", []);
            }
            if (subPropertyStatus !== undefined &&
                !["active", "inactive"].includes(subPropertyStatus)) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Status must be either active or inactive", []);
            }
            const subProperties = await property_model_1.PropertyModel.getSubProperty({
                id: subPropertyId,
                prop_id: propertyId,
                status: subPropertyStatus,
            });
            // Single ID requested but not found
            if (subPropertyId && !subProperties) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Property sub category not found", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, subPropertyId ? [subProperties] : subProperties, "Property sub categories fetched successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
    // DTCP
    static async getPropertyBasedOnTypes(req, res) {
        try {
            const { status, type, location } = req.query;
            const page = Math.max(Number(req.query.page) || 1, 1);
            const limit = Number(req.query.limit) || 5;
            const offset = (page - 1) * limit;
            const data = await form_module_1.FormModule.getPropertyBasedOnTypes({
                status: status ? String(status) : null,
                type: type ? String(type) : null,
                location: location ? String(location) : null,
                page,
                limit,
                offset,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, data, "Properties fetched successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error?.message || error,
            ]);
        }
    }
    static async addUpdateBookmark(req, res) {
        try {
            const data = (0, helper_1.validateRequest)(req.body, validator_1.bookmarkSchema);
            const result = await property_model_1.PropertyModel.addUpdateBookmark(data);
            return (0, helper_1.sendResponse)(res, 200, 1, [result], result.bookmarked
                ? "Bookmark added successfully"
                : "Bookmark removed successfully", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
                err?.message || err,
            ]);
        }
    }
    static async getBookmarkProperties(req, res) {
        try {
            const user_id = Number(req.query.user_id);
            const page = Math.max(Number(req.query.page) || 1, 1);
            const limit = Number(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            if (!user_id) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "user_id is required", []);
            }
            const result = await form_module_1.FormModule.getBookmarkProperties({
                user_id,
                page,
                limit,
                offset,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, result, "Bookmarked properties fetched successfully", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
                err?.message || err,
            ]);
        }
    }
}
exports.PropertyController = PropertyController;
