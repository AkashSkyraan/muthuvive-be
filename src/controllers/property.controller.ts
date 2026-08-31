import { Request, Response } from "express";

import { validateRequest, sendResponse } from "../utils/helper";
import { addUpdateCategorySchema } from "../utils/validator";
import { PropertyModel } from "../models/property.model";

export class PropertyController {
  static async addUpdateProperty(req: Request, res: Response) {
    try {
      const data = validateRequest(req.body, addUpdateCategorySchema);

      const result = await PropertyModel.addUpdateProperty(data);

      return sendResponse(
        res,
        200,
        1,
        [result],
        data.id
          ? "Category updated successfully"
          : "Category added successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(
        res,
        err.status || 500,
        0,
        [],
        err.message || "Internal Server Error",
        err.errors || [],
      );
    }
  }

  static async getProperties(req: Request, res: Response) {
    try {
      const { id, status } = req.query;

      const propertyId = id ? Number(id) : undefined;
      const propertyStatus =
        status !== undefined ? String(status).trim() : undefined;

      if (id && (isNaN(propertyId!) || propertyId! <= 0)) {
        return sendResponse(res, 200, 0, [], "Invalid property id", []);
      }

      if (
        propertyStatus !== undefined &&
        !["active", "inactive"].includes(propertyStatus.toLowerCase())
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

      const properties = await PropertyModel.getProperty({
        id: propertyId,
        status: propertyStatus?.toLowerCase(),
      });

      if (propertyId && !properties) {
        return sendResponse(res, 200, 0, [], "Property not found", []);
      }

      const assetUrl = process.env.ASSET_URL || "";

      if (propertyId) {
        properties.image = properties.image
          ? `${assetUrl}${properties.image}`
          : null;
      } else {
        properties.forEach((property: any) => {
          property.image = property.image
            ? `${assetUrl}${property.image}`
            : null;
        });
      }

      return sendResponse(
        res,
        200,
        1,
        propertyId ? [properties] : properties,
        "Properties fetched successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }

  static async deleteProperty(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(res, 200, 0, [], "Invalid property id", []);
      }

      const result = await PropertyModel.deleteProperty(Number(id));

      if (!result) {
        return sendResponse(res, 200, 0, [], "Property not found", []);
      }

      return sendResponse(
        res,
        200,
        1,
        [result],
        "Property deleted successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }



}
