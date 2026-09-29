import { Request, Response } from "express";
import { sendResponse, validateRequest } from "../utils/helper";
import {
  addUpdateAmenitiesSchema,
  addUpdatePropertyHighlightSchema,
} from "../utils/validator";
import { SourceModel } from "../models/source.model";

export class SourceController {
  static async addUpdateAmenities(req: Request, res: Response) {
    try {
      const data = validateRequest(req.body, addUpdateAmenitiesSchema);

      const result = await SourceModel.addUpdateAminities(data);

      return sendResponse(
        res,
        200,
        1,
        [result],
        data.id
          ? "Amenities updated successfully"
          : "Amenities added successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }

  static async getAmenities(req: Request, res: Response) {
    try {
      const { id, status } = req.query;

      const amenityID = id ? Number(id) : undefined;

      const amenityStatus =
        status !== undefined ? String(status).trim() : undefined;

      if (id && (isNaN(amenityID!) || amenityID! <= 0)) {
        return sendResponse(res, 200, 0, [], "Invalid Amenity id", []);
      }

      if (
        amenityStatus !== undefined &&
        !["active", "inactive"].includes(amenityStatus.toLowerCase())
      ) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "Status must be either active or inactive",
          [],
        );
      }

      const amenities = await SourceModel.getAmenities({
        id: amenityID,
        status: amenityStatus?.toLowerCase(),
      });

      if (amenityID && !amenities) {
        return sendResponse(res, 200, 0, [], "amenity not found", []);
      }

      return sendResponse(
        res,
        200,
        1,
        amenityID ? [amenities] : amenities,
        "Amenity  fetched successfully",
        [],
      );
    } catch (error: any) {
      console.log(error);
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }

  // property high

  static async addUpdatePropertyHighlights(req: Request, res: Response) {
    try {
      const data = validateRequest(req.body, addUpdatePropertyHighlightSchema);

      const result = await SourceModel.addUpdatePropertyHighlights(data);

      return sendResponse(
        res,
        200,
        1,
        [result],
        data.id
          ? "Property highlight updated successfully"
          : "Property highlight added successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }

  static async getPropertyHighlights(req: Request, res: Response) {
    try {
      const { id, status } = req.query;
      const propertyHighlightID = id ? Number(id) : undefined;
      const propertyHighlightStatus =
        status !== undefined ? String(status).trim() : undefined;
      if (id && (isNaN(propertyHighlightID!) || propertyHighlightID! <= 0)) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "Invalid Property Highlight id",
          [],
        );
      }
      if (
        propertyHighlightStatus !== undefined &&
        !["active", "inactive"].includes(propertyHighlightStatus.toLowerCase())
      ) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "Status must be either active or inactive",
          [],
        );
      }
      const propertyHighlights = await SourceModel.getPropertyHighlights({
        id: propertyHighlightID,
        status: propertyHighlightStatus?.toLowerCase(),
      });
      if (propertyHighlightID && !propertyHighlights) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "Property Highlight not found",
          [],
        );
      }
      return sendResponse(
        res,
        200,
        1,
        propertyHighlightID ? [propertyHighlights] : propertyHighlights,
        "Property Highlights fetched successfully",
        [],
      );
    } catch (error: any) {
      console.log(error);
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }

  // geo location

  static getAdressDetailsFromPincode = async (req: Request, res: Response) => {
    try {
      const pincode = String(req.query.pincode || "").trim();
      if (!pincode) {
        return sendResponse(res, 200, 0, [], "Pincode is required", []);
      }
      const icountry = "india";
      const data = await SourceModel.getLatLngFromPincode(pincode, icountry);
      if (!data) {
        return sendResponse(res, 200, 0, [], "Pincode not found", []);
      }
      return sendResponse(
        res,
        200,
        1,
        [data],
        "Address fetched successfully from pincode",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Something went wrong", [
        err.errors || err.message || err,
      ]);
    }
  };

  static getPincodeDetails = async (req: Request, res: Response) => {
    try {
      const country = String(req.query.country || "").trim();

      const state = String(req.query.state || "").trim();

      const district = String(req.query.district || "").trim();

      const city = String(req.query.city || "").trim();

      if (!country) {
        return sendResponse(res, 400, 0, [], "Country is required", []);
      }

      const data = await SourceModel.getPincodeDetails(
        country,
        state || undefined,
        district || undefined,
        city || undefined,
      );

      if (!data || data.length === 0) {
        return sendResponse(res, 400, 0, [], "Location details not found", []);
      }

      if (!state && !district) {
        return sendResponse(
          res,
          200,
          1,
          data,
          "States fetched successfully",
          [],
        );
      }

      // COUNTRY + STATE → DISTRICTS
      if (state && !district) {
        return sendResponse(
          res,
          200,
          1,
          data,
          "Districts fetched successfully",
          [],
        );
      }

      // COUNTRY + STATE + DISTRICT → CITIES
      return sendResponse(res, 200, 1, data, "Cities fetched successfully", []);
    } catch (err: any) {
      console.error("getPincodeDetails error:", err);

      return sendResponse(res, 500, 0, [], "Something went wrong", [
        err?.errors || err?.message || err,
      ]);
    }
  };

  // search alogorith,

  static async searchPincode(req: Request, res: Response) {
    try {
      let search = String(req.query.search || "").trim();

      // + and other symbols -> space
      // only letters, spaces and commas allowed
      search = search
        .replace(/\+/g, " ")
        .replace(/[^a-zA-Z,\s]/g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*,\s*/g, ", ")
        .trim();

      if (search.length < 3) {
        return sendResponse(
          res,
          400,
          0,
          [],
          "Search must contain at least 3 characters",
          [],
        );
      }

      const data = await SourceModel.searchPincode(search);

      return sendResponse(
        res,
        200,
        1,
        data,
        "Pincode location fetched successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error?.message || error,
      ]);
    }
  }
}
