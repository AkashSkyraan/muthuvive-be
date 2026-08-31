"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const helper_1 = require("../utils/helper");
const source_model_1 = require("../models/source.model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class UploadController {
    static async upload(req, res) {
        try {
            const files = req.files;
            if (!files?.length) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "File is required", []);
            }
            const uploadedFiles = files.map((file) => {
                const mimeType = file.mimetype;
                let mediaType = "file";
                if (mimeType.startsWith("image/")) {
                    mediaType = "image";
                }
                else if (mimeType.startsWith("video/")) {
                    mediaType = "video";
                }
                else if (mimeType.startsWith("audio/")) {
                    mediaType = "audio";
                }
                return {
                    org_name: file.originalname,
                    file_name: file.filename,
                    mime_type: mimeType,
                    media_type: mediaType,
                    file_size: file.size,
                    path: file.path.replace(/\\/g, "/"),
                    url: `${file.path.replace(/\\/g, "/")}`,
                };
            });
            const data = await source_model_1.SourceModel.insertMultipleMedia(uploadedFiles);
            const responseData = uploadedFiles.map((file, index) => ({
                id: data[index],
                ...file,
                url: `${process.env.ASSET_URL}${file?.url}`,
            }));
            return (0, helper_1.sendResponse)(res, 200, 1, responseData, "Files uploaded successfully", []);
        }
        catch (error) {
            console.error(error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], error.message || "Internal Server Error", []);
        }
    }
    static async getUploads(req, res) {
        try {
            const { media_type, id } = req.body;
            const result = await source_model_1.SourceModel.getUploads({
                media_type,
                id,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, result, "Uploads fetched successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], error.message || "Internal Server Error", []);
        }
    }
}
exports.UploadController = UploadController;
