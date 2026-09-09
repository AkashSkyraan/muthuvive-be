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
}
