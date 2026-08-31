import { Request, Response } from "express";
import { sendResponse } from "../utils/helper";
import { SourceModel } from "../models/source.model";
import dotenv from "dotenv";
dotenv.config();
export class UploadController {
  static async upload(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files?.length) {
        return sendResponse(res, 200, 0, [], "File is required", []);
      }

      const uploadedFiles = files.map((file) => {
        const mimeType = file.mimetype;

        let mediaType = "file";

        if (mimeType.startsWith("image/")) {
          mediaType = "image";
        } else if (mimeType.startsWith("video/")) {
          mediaType = "video";
        } else if (mimeType.startsWith("audio/")) {
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

      const data = await SourceModel.insertMultipleMedia(uploadedFiles);

      const responseData = uploadedFiles.map((file, index) => ({
        id: data[index],
        ...file,
        url: `${process.env.ASSET_URL}${file?.url}`,
      }));

      return sendResponse(
        res,
        200,
        1,
        responseData,
        "Files uploaded successfully",
        [],
      );
    } catch (error: any) {
      console.error(error);

      return sendResponse(
        res,
        500,
        0,
        [],
        error.message || "Internal Server Error",
        [],
      );
    }
  }

  static async getUploads(req: Request, res: Response) {
    try {
      const { media_type, id } = req.body;

      const result = await SourceModel.getUploads({
        media_type,
        id,
      });

      return sendResponse(
        res,
        200,
        1,
        result,
        "Uploads fetched successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        error.message || "Internal Server Error",
        [],
      );
    }
  }
}
