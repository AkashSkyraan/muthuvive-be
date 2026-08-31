import { Request, Response } from "express";
import { TestimonialModel } from "../models/testimonial.model";
import { sendResponse, validateRequest } from "../utils/helper";
import { addUpdateTestimonialSchema } from "../utils/validator";

export class TestimonialController {
  static async addUpdateTestimonial(req: Request, res: Response) {
    try {
      const data = validateRequest(req.body, addUpdateTestimonialSchema);

      const result = await TestimonialModel.addUpdateTestimonial(data);

      return sendResponse(
        res,
        200,
        1,
        [result],
        data.id
          ? "Testimonial updated successfully"
          : "Testimonial added successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }

  static async getTestimonials(req: Request, res: Response) {
    try {
      const { id, status } = req.query;

      const testimonialId = id ? Number(id) : undefined;

      const testimonialStatus =
        status !== undefined ? String(status).trim().toLowerCase() : undefined;

      const testimonials = await TestimonialModel.getTestimonial({
        id: testimonialId,
        status: testimonialStatus,
      });

      if (testimonialId && !testimonials) {
        return sendResponse(res, 200, 0, [], "Testimonial not found", []);
      }

      const assetUrl = process.env.ASSET_URL || "";

      if (testimonialId) {
        testimonials.image = testimonials.image
          ? `${assetUrl}${testimonials.image}`
          : null;
      } else {
        testimonials.forEach((testimonial: any) => {
          testimonial.image = testimonial.image
            ? `${assetUrl}${testimonial.image}`
            : null;
        });
      }

      return sendResponse(
        res,
        200,
        1,
        testimonialId ? [testimonials] : testimonials,
        "Testimonials fetched successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }

  static async deleteTestimonial(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const testimonialId = Number(id);

      if (!id) {
        return sendResponse(res, 200, 0, [], "ID is required", []);
      }

      const result = await TestimonialModel.deleteTestimonial(testimonialId);

      if (!result) {
        return sendResponse(res, 200, 0, [], "Testimonial not found", []);
      }

      return sendResponse(
        res,
        200,
        1,
        [result],
        "Testimonial deleted successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(res, 500, 0, [], "Internal server error", [
        error.errors,
      ]);
    }
  }

  
}
