"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialController = void 0;
const testimonial_model_1 = require("../models/testimonial.model");
const helper_1 = require("../utils/helper");
const validator_1 = require("../utils/validator");
class TestimonialController {
    static async addUpdateTestimonial(req, res) {
        try {
            const data = (0, helper_1.validateRequest)(req.body, validator_1.addUpdateTestimonialSchema);
            const result = await testimonial_model_1.TestimonialModel.addUpdateTestimonial(data);
            return (0, helper_1.sendResponse)(res, 200, 1, [result], data.id
                ? "Testimonial updated successfully"
                : "Testimonial added successfully", []);
        }
        catch (error) {
            console.log(error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
    static async getTestimonials(req, res) {
        try {
            const { id, status } = req.query;
            const testimonialId = id ? Number(id) : undefined;
            const testimonialStatus = status !== undefined ? String(status).trim().toLowerCase() : undefined;
            const testimonials = await testimonial_model_1.TestimonialModel.getTestimonial({
                id: testimonialId,
                status: testimonialStatus,
            });
            if (testimonialId && !testimonials) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Testimonial not found", []);
            }
            const assetUrl = process.env.ASSET_URL || "";
            if (testimonialId) {
                testimonials.image = testimonials.image
                    ? `${assetUrl}${testimonials.image}`
                    : null;
            }
            else {
                testimonials.forEach((testimonial) => {
                    testimonial.image = testimonial.image
                        ? `${assetUrl}${testimonial.image}`
                        : null;
                });
            }
            return (0, helper_1.sendResponse)(res, 200, 1, testimonialId ? [testimonials] : testimonials, "Testimonials fetched successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
    static async deleteTestimonial(req, res) {
        try {
            const { id } = req.params;
            const testimonialId = Number(id);
            if (!id) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "ID is required", []);
            }
            const result = await testimonial_model_1.TestimonialModel.deleteTestimonial(testimonialId);
            if (!result) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Testimonial not found", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, [result], "Testimonial deleted successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", [
                error.errors,
            ]);
        }
    }
}
exports.TestimonialController = TestimonialController;
