import { Request, Response } from "express";
import { executeQuery, sendResponse, validateRequest } from "../utils/helper";
import { addUpdateGallerySchema } from "../utils/validator";
import { GalleryModel } from "../models/gallery.model";
import { GetGallery } from "../types/gallery.types";

export class GalleryController {
  static async addUpdateGallery(req: Request, res: Response) {
    try {
      const data = validateRequest(req.body, addUpdateGallerySchema);

      const result = await GalleryModel.addUpdateGallery(data);

      return sendResponse(
        res,
        200,
        1,
        [result],
        data.id ? "Gallery updated successfully" : "Gallery added successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors,
      ]);
    }
  }

  static async getGallery(req: Request, res: Response) {
    try {
      const { id, status, type } = req.query;

      const galleryId = id ? Number(id) : undefined;

      const galleryStatus =
        status !== undefined ? String(status).trim().toLowerCase() : undefined;

      const galleryType = type !== undefined ? String(type).trim() : undefined;

      if (id && (isNaN(galleryId!) || galleryId! <= 0)) {
        return sendResponse(res, 200, 0, [], "Invalid gallery id", []);
      }

      if (
        galleryStatus !== undefined &&
        !["active", "inactive"].includes(galleryStatus)
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

      const galleries = await GalleryModel.getGallery({
        id: galleryId,
        status: galleryStatus,
        type: galleryType,
      });

      if (galleryId && !galleries) {
        return sendResponse(res, 200, 0, [], "Gallery image not found", []);
      }

      const assetUrl = process.env.ASSET_URL || "";

      if (galleryId) {
        galleries.image = galleries.image
          ? `${assetUrl}${galleries.image}`
          : null;
      } else {
        galleries.forEach((gallery: any) => {
          gallery.image = gallery.image ? `${assetUrl}${gallery.image}` : null;
        });
      }

      return sendResponse(
        res,
        200,
        1,
        galleryId ? [galleries] : galleries,
        "Gallery images fetched successfully",
        [],
      );
    } catch (error: any) {
      console.log(error);

      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }

  static async deleteGallery(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(res, 200, 0, [], "Invalid Image id", []);
      }

      const result = await GalleryModel.deleteGallery(Number(id));

      if (!result) {
        return sendResponse(res, 200, 0, [], "Image not found", []);
      }

      return sendResponse(
        res,
        200,
        1,
        [result],
        "Image  deleted successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }
}
