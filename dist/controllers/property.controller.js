"use strict";
var _a;
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
    // static async getPropertyBasedOnTypes(req: Request, res: Response) {
    //   try {
    //     const { status, type, location, user_id } = req.query;
    //     const page = Math.max(Number(req.query.page) || 1, 1);
    //     const limit = Math.max(Number(req.query.limit) || 5, 1);
    //     const offset = (page - 1) * limit;
    //     const data = await FormModule.getPropertyBasedOnTypes({
    //       status: status ? String(status) : null,
    //       type: type ? String(type) : null,
    //       location: location ? String(location) : null,
    //       user_id: user_id ? Number(user_id) : null,
    //       page,
    //       limit,
    //       offset,
    //     });
    //     return sendResponse(
    //       res,
    //       200,
    //       1,
    //       data,
    //       "Properties fetched successfully",
    //       [],
    //     );
    //   } catch (error: any) {
    //     console.error("getPropertyBasedOnTypes error:", error);
    //     return sendResponse(res, 500, 0, [], "Internal server error", [
    //       error?.message || error,
    //     ]);
    //   }
    // }
    static async getPropertyBasedOnTypes(req, res) {
        try {
            const { status, type, location, user_id, min_price, max_price, amenities, prop_highlights, search } = req.query;
            const page = Math.max(Number(req.query.page) || 1, 1);
            const limit = Math.max(Number(req.query.limit) || 5, 1);
            const offset = (page - 1) * limit;
            // ---------------------------------------
            // STATUS ARRAY
            // available,sold
            // ---------------------------------------
            const statusArray = status
                ? String(status)
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
                : [];
            // ---------------------------------------
            // AMENITIES ARRAY
            // 1,2,5
            // ---------------------------------------
            const amenitiesArray = amenities
                ? String(amenities)
                    .split(",")
                    .map(Number)
                    .filter((id) => Number.isInteger(id) && id > 0)
                : [];
            // ---------------------------------------
            // PROPERTY HIGHLIGHTS ARRAY
            // 1,3,4
            // ---------------------------------------
            const propHighlightsArray = prop_highlights
                ? String(prop_highlights)
                    .split(",")
                    .map(Number)
                    .filter((id) => Number.isInteger(id) && id > 0)
                : [];
            const data = await form_module_1.FormModule.getPropertyBasedOnTypes({
                status: statusArray,
                type: type ? String(type) : null,
                location: location ? String(location) : null,
                user_id: user_id ? Number(user_id) : null,
                min_price: min_price !== undefined && min_price !== ""
                    ? Number(min_price)
                    : null,
                max_price: max_price !== undefined && max_price !== ""
                    ? Number(max_price)
                    : null,
                amenities: amenitiesArray,
                prop_highlights: propHighlightsArray,
                search,
                page,
                limit,
                offset,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, data, "Properties fetched successfully", []);
        }
        catch (error) {
            console.error("getPropertyBasedOnTypes error:", error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [error?.message || error]);
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
            const type = Number(req.query.type);
            const search = String(req.query.search);
            const page = Math.max(Number(req.query.page) || 1, 1);
            const limit = Number(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            if (!user_id) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "user_id is required", []);
            }
            const result = await form_module_1.FormModule.getBookmarkProperties({
                search,
                type,
                user_id,
                page,
                limit,
                offset,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, [result], "Bookmarked properties fetched successfully", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
                err?.message || err,
            ]);
        }
    }
    // recnet
    static async getRecentViews(req, res) {
        try {
            const { user_id } = req.query;
            const page = Math.max(Number(req.query.page) || 1, 1);
            const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 30);
            if (!user_id) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "User ID is required", []);
            }
            const result = await form_module_1.FormModule.getRecentViews({
                user_id: Number(user_id),
                page,
                limit,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, [result], "Recent views fetched successfully", []);
        }
        catch (error) {
            console.error("Get Recent Views Error:", error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", []);
        }
    }
}
exports.PropertyController = PropertyController;
_a = PropertyController;
PropertyController.getPropertyPriceRange = async (req, res) => {
    try {
        const prop_type = Number(req.query.type);
        const status = req.query.status ? String(req.query.status) : null;
        if (!prop_type) {
            return (0, helper_1.sendResponse)(res, 400, 0, [], "Property type is required", []);
        }
        const data = await property_model_1.PropertyModel.getPropertyPriceRange(prop_type, status);
        return (0, helper_1.sendResponse)(res, 200, 1, [data], "Property price range fetched successfully", []);
    }
    catch (error) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
            error?.message || error,
        ]);
    }
};
