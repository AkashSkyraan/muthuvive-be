"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceController = void 0;
const helper_1 = require("../utils/helper");
const validator_1 = require("../utils/validator");
const source_model_1 = require("../models/source.model");
class SourceController {
    static async addUpdateAmenities(req, res) {
        try {
            const data = (0, helper_1.validateRequest)(req.body, validator_1.addUpdateAmenitiesSchema);
            const result = await source_model_1.SourceModel.addUpdateAminities(data);
            return (0, helper_1.sendResponse)(res, 200, 1, [result], data.id
                ? "Amenities updated successfully"
                : "Amenities added successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
    static async getAmenities(req, res) {
        try {
            const { id, status } = req.query;
            const amenityID = id ? Number(id) : undefined;
            const amenityStatus = status !== undefined ? String(status).trim() : undefined;
            if (id && (isNaN(amenityID) || amenityID <= 0)) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid Amenity id", []);
            }
            if (amenityStatus !== undefined &&
                !["active", "inactive"].includes(amenityStatus.toLowerCase())) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Status must be either active or inactive", []);
            }
            const amenities = await source_model_1.SourceModel.getAmenities({
                id: amenityID,
                status: amenityStatus?.toLowerCase(),
            });
            if (amenityID && !amenities) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "amenity not found", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, amenityID ? [amenities] : amenities, "Amenity  fetched successfully", []);
        }
        catch (error) {
            console.log(error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
    // property high
    static async addUpdatePropertyHighlights(req, res) {
        try {
            const data = (0, helper_1.validateRequest)(req.body, validator_1.addUpdatePropertyHighlightSchema);
            const result = await source_model_1.SourceModel.addUpdatePropertyHighlights(data);
            return (0, helper_1.sendResponse)(res, 200, 1, [result], data.id
                ? "Property highlight updated successfully"
                : "Property highlight added successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
    static async getPropertyHighlights(req, res) {
        try {
            const { id, status } = req.query;
            const propertyHighlightID = id ? Number(id) : undefined;
            const propertyHighlightStatus = status !== undefined ? String(status).trim() : undefined;
            if (id && (isNaN(propertyHighlightID) || propertyHighlightID <= 0)) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid Property Highlight id", []);
            }
            if (propertyHighlightStatus !== undefined &&
                !["active", "inactive"].includes(propertyHighlightStatus.toLowerCase())) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Status must be either active or inactive", []);
            }
            const propertyHighlights = await source_model_1.SourceModel.getPropertyHighlights({
                id: propertyHighlightID,
                status: propertyHighlightStatus?.toLowerCase(),
            });
            if (propertyHighlightID && !propertyHighlights) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Property Highlight not found", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, propertyHighlightID ? [propertyHighlights] : propertyHighlights, "Property Highlights fetched successfully", []);
        }
        catch (error) {
            console.log(error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
}
exports.SourceController = SourceController;
