"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryController = void 0;
const helper_1 = require("../utils/helper");
const validator_1 = require("../utils/validator");
const gallery_model_1 = require("../models/gallery.model");
class GalleryController {
    static async addUpdateGallery(req, res) {
        try {
            const data = (0, helper_1.validateRequest)(req.body, validator_1.addUpdateGallerySchema);
            const result = await gallery_model_1.GalleryModel.addUpdateGallery(data);
            return (0, helper_1.sendResponse)(res, 200, 1, [result], data.id ? "Gallery updated successfully" : "Gallery added successfully", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
                err.errors,
            ]);
        }
    }
    static async getGallery(req, res) {
        try {
            const { id, status, type } = req.query;
            const galleryId = id ? Number(id) : undefined;
            const galleryStatus = status !== undefined ? String(status).trim().toLowerCase() : undefined;
            const galleryType = type !== undefined ? String(type).trim() : undefined;
            if (id && (isNaN(galleryId) || galleryId <= 0)) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid gallery id", []);
            }
            if (galleryStatus !== undefined &&
                !["active", "inactive"].includes(galleryStatus)) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Status must be either active or inactive", []);
            }
            const galleries = await gallery_model_1.GalleryModel.getGallery({
                id: galleryId,
                status: galleryStatus,
                type: galleryType,
            });
            if (galleryId && !galleries) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Gallery image not found", []);
            }
            const assetUrl = process.env.ASSET_URL || "";
            if (galleryId) {
                galleries.image = galleries.image
                    ? `${assetUrl}${galleries.image}`
                    : null;
            }
            else {
                galleries.forEach((gallery) => {
                    gallery.image = gallery.image ? `${assetUrl}${gallery.image}` : null;
                });
            }
            return (0, helper_1.sendResponse)(res, 200, 1, galleryId ? [galleries] : galleries, "Gallery images fetched successfully", []);
        }
        catch (error) {
            console.log(error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
    static async deleteGallery(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid Image id", []);
            }
            const result = await gallery_model_1.GalleryModel.deleteGallery(Number(id));
            if (!result) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Image not found", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, [result], "Image  deleted successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
}
exports.GalleryController = GalleryController;
