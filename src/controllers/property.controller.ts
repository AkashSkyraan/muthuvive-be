import { Request, Response } from "express";

import { validateRequest, sendResponse } from "../utils/helper";
import {
  addUpdateCategorySchema,
  addUpdatePropertyAreaSchema,
  addUpdateSubCategorySchema,
  bookmarkSchema,
} from "../utils/validator";
import { PropertyModel } from "../models/property.model";
import { FormModule } from "../models/form.module";
import { string } from "joi";

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
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors,
      ]);
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

  // by area

  static async addUpdatePropertyArea(req: Request, res: Response) {
    try {
      const data = validateRequest(req.body, addUpdatePropertyAreaSchema);

      const result = await PropertyModel.addUpdatePropertyArea(data);

      return sendResponse(
        res,
        200,
        1,
        [result],
        data.id
          ? "Property Area updated successfully"
          : "Property Area added successfully",
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

  static async getPropertyArea(req: Request, res: Response) {
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

      const properties = await PropertyModel.getPropertyArea({
        id: propertyId,
        status: propertyStatus?.toLowerCase(),
      });

      if (propertyId && !properties) {
        return sendResponse(res, 200, 0, [], "Property Area not found", []);
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
        "Property Area fetched successfully",
        [],
      );
    } catch (error: any) {
      console.log(error);
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }

  static async deletePropertyArea(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(res, 200, 0, [], "Invalid property id", []);
      }

      const result = await PropertyModel.deletePropertyArea(Number(id));

      if (!result) {
        return sendResponse(res, 200, 0, [], "Property not found", []);
      }

      return sendResponse(
        res,
        200,
        1,
        [result],
        "Property Area deleted successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }

  // sub cat

  static async addUpdateSubProperty(req: Request, res: Response) {
    try {
      const data = validateRequest(req.body, addUpdateSubCategorySchema);

      const result = await PropertyModel.addUpdateSubProperty(data);

      return sendResponse(
        res,
        200,
        1,
        [result],
        data.id
          ? "Sub category updated successfully"
          : "Sub category added successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors,
      ]);
    }
  }

  static async getSubProperties(req: Request, res: Response) {
    try {
      const { id, prop_id, status } = req.query;

      const subPropertyId = id ? Number(id) : undefined;
      const propertyId = prop_id ? Number(prop_id) : undefined;

      const subPropertyStatus =
        status !== undefined ? String(status).trim().toLowerCase() : undefined;

      if (id !== undefined && (isNaN(subPropertyId!) || subPropertyId! <= 0)) {
        return sendResponse(res, 200, 0, [], "Invalid sub category id", []);
      }

      if (prop_id !== undefined && (isNaN(propertyId!) || propertyId! <= 0)) {
        return sendResponse(res, 200, 0, [], "Invalid property id", []);
      }

      if (
        subPropertyStatus !== undefined &&
        !["active", "inactive"].includes(subPropertyStatus)
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

      const subProperties = await PropertyModel.getSubProperty({
        id: subPropertyId,
        prop_id: propertyId,
        status: subPropertyStatus,
      });

      // Single ID requested but not found
      if (subPropertyId && !subProperties) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "Property sub category not found",
          [],
        );
      }

      return sendResponse(
        res,
        200,
        1,
        subPropertyId ? [subProperties] : subProperties,
        "Property sub categories fetched successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }

  // DTCP

  // static async getPropertyBasedOnTypes(req: Request, res: Response) {
  //   try {
  //     const { status, type, location } = req.query;

  //     const page = Number(req.query.page) ||  1;
  //     const limit = Number(req.query.limit) || 5;
  //     const offset = (page - 1) * limit;

  //     const data = await FormModule.getPropertyBasedOnTypes({
  //       status: status ? String(status) : null,
  //       type: type ? String(type) : null,
  //       location: location ? String(location) : null,
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
  //     return sendResponse(res, 500, 0, [], "Internal server error", [
  //       error?.message || error,
  //     ]);
  //   }
  // }

  static async getPropertyBasedOnTypes(req: Request, res: Response) {
    try {
      const { status, type, location, user_id } = req.query;

      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.max(Number(req.query.limit) || 5, 1);

      const offset = (page - 1) * limit;

      const data = await FormModule.getPropertyBasedOnTypes({
        status: status ? String(status) : null,
        type: type ? String(type) : null,
        location: location ? String(location) : null,
        user_id: user_id ? Number(user_id) : null,
        page,
        limit,
        offset,
      });

      return sendResponse(
        res,
        200,
        1,
        data,
        "Properties fetched successfully",
        [],
      );
    } catch (error: any) {
      console.error("getPropertyBasedOnTypes error:", error);

      return sendResponse(res, 500, 0, [], "Internal server error", [
        error?.message || error,
      ]);
    }
  }

  static async addUpdateBookmark(req: Request, res: Response) {
    try {
      const data = validateRequest(req.body, bookmarkSchema);

      const result = await PropertyModel.addUpdateBookmark(data);

      return sendResponse(
        res,
        200,
        1,
        [result],
        result.bookmarked
          ? "Bookmark added successfully"
          : "Bookmark removed successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err?.message || err,
      ]);
    }
  }

  static async getBookmarkProperties(req: Request, res: Response) {
    try {
      const user_id = Number(req.query.user_id);
      const type = Number(req.query.type);
      const search = String(req.query.search);

      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Number(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      if (!user_id) {
        return sendResponse(res, 400, 0, [], "user_id is required", []);
      }

      const result = await FormModule.getBookmarkProperties({
        search,
        type,
        user_id,
        page,
        limit,
        offset,
      });

      return sendResponse(
        res,
        200,
        1,
        [result],
        "Bookmarked properties fetched successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err?.message || err,
      ]);
    }
  }

  static getPropertyPriceRange = async (req: Request, res: Response) => {
    try {
      const prop_type = Number(req.query.type);
      const status = req.query.status ? String(req.query.status) : null;

      if (!prop_type) {
        return sendResponse(res, 400, 0, [], "Property type is required", []);
      }

      const data = await PropertyModel.getPropertyPriceRange(prop_type, status);

      return sendResponse(
        res,
        200,
        1,
        [data],
        "Property price range fetched successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error?.message || error,
      ]);
    }
  };

  // recnet

  static async getRecentViews(req: Request, res: Response) {
    try {
      const { user_id } = req.query;

      const page = Math.max(Number(req.query.page) || 1, 1);

      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 30);

      if (!user_id) {
        return sendResponse(res, 400, 0, [], "User ID is required", []);
      }

      const result = await FormModule.getRecentViews({
        user_id: Number(user_id),
        page,
        limit,
      });

      return sendResponse(
        res,
        200,
        1,
        [result],
        "Recent views fetched successfully",
        [],
      );
    } catch (error) {
      console.error("Get Recent Views Error:", error);

      return sendResponse(res, 500, 0, [], "Internal server error", []);
    }
  }
}
