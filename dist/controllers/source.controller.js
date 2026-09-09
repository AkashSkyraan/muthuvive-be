"use strict";
var _a;
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
_a = SourceController;
// geo location
SourceController.getAdressDetailsFromPincode = async (req, res) => {
    try {
        const pincode = String(req.query.pincode || "").trim();
        if (!pincode) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Pincode is required", []);
        }
        const icountry = "india";
        const data = await source_model_1.SourceModel.getLatLngFromPincode(pincode, icountry);
        if (!data) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Pincode not found", []);
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [data], "Address fetched successfully from pincode", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Something went wrong", [
            err.errors || err.message || err,
        ]);
    }
};
SourceController.getPincodeDetails = async (req, res) => {
    try {
        const country = String(req.query.country || "").trim();
        const state = String(req.query.state || "").trim();
        const district = String(req.query.district || "").trim();
        if (!country) {
            return (0, helper_1.sendResponse)(res, 400, 0, [], "Country is required", []);
        }
        const data = await source_model_1.SourceModel.getPincodeDetails(country, state || undefined, district || undefined);
        if (!data || data.length === 0) {
            return (0, helper_1.sendResponse)(res, 404, 0, [], "Location details not found", []);
        }
        // COUNTRY → STATES
        if (!state && !district) {
            return (0, helper_1.sendResponse)(res, 200, 1, data, "States fetched successfully", []);
        }
        // COUNTRY + STATE → DISTRICTS
        if (state && !district) {
            return (0, helper_1.sendResponse)(res, 200, 1, data, "Districts fetched successfully", []);
        }
        // COUNTRY + STATE + DISTRICT → CITIES
        return (0, helper_1.sendResponse)(res, 200, 1, data, "Cities fetched successfully", []);
    }
    catch (err) {
        console.error("getPincodeDetails error:", err);
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Something went wrong", [
            err?.errors || err?.message || err,
        ]);
    }
};
