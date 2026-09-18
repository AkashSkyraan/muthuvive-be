"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUpdateConsultantSchema = exports.addUpdateSubCategorySchema = exports.addUpdatePropertyHighlightSchema = exports.addUpdateAmenitiesSchema = exports.addUpdateEnquirySchema = exports.addUpdateGallerySchema = exports.addUpdateAboutUsSchema = exports.addUpdatePropertyAreaSchema = exports.updateProfileSchema = exports.addUpdateTestimonialSchema = exports.addUpdatePlanSchema = exports.addUpdateCategorySchema = exports.loginSchema = exports.signupSchema = exports.resetPasswordSchema = exports.verifyOtpSchema = exports.requestOtpSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.requestOtpSchema = joi_1.default.object({
    type: joi_1.default.string().optional(),
    purpose: joi_1.default.number().required().messages({
        "any.required": "Purpose is required",
    }),
    email: joi_1.default.string().optional(),
    mobile: joi_1.default.string().optional(),
})
    .or("email", "mobile")
    .messages({
    "object.missing": "Either email or mobile is required",
});
exports.verifyOtpSchema = joi_1.default.object({
    purpose: joi_1.default.number().valid(1, 2).required().messages({
        "any.required": "Purpose is required",
    }),
    email: joi_1.default.string().optional(),
    mobile: joi_1.default.number().optional(),
    otp: joi_1.default.string()
        .pattern(/^[0-9]{6}$/)
        .required()
        .messages({
        "string.pattern.base": "OTP must be a 6 digit number",
    }),
});
exports.resetPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().optional(),
    mobile: joi_1.default.string().optional(),
    password: joi_1.default.string().min(8).max(128).required(),
});
exports.signupSchema = joi_1.default.object({
    user_name: joi_1.default.string().optional(),
    email: joi_1.default.string().optional(),
    mobile: joi_1.default.string().optional(),
    password: joi_1.default.string().required().messages({
        "any.required": "Password is required",
    }),
}).or("email", "mobile");
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().optional(),
    mobile: joi_1.default.string().optional(),
    password: joi_1.default.string().required(),
});
exports.addUpdateCategorySchema = joi_1.default.object({
    id: joi_1.default.number().integer().optional(),
    image: joi_1.default.string().max(500).allow(null, "").optional(),
    name: joi_1.default.string().trim().max(255).required(),
    status: joi_1.default.string().valid("active", "inactive").optional(),
});
exports.addUpdatePlanSchema = joi_1.default.object({
    id: joi_1.default.number().optional(),
    duration: joi_1.default.string().trim().min(1).max(50).required().messages({
        "string.empty": "Duration is required",
        "any.required": "Duration is required",
    }),
    old_amount: joi_1.default.number().default(0),
    new_amount: joi_1.default.number().required().messages({
        "number.base": "New amount must be a number",
        "any.required": "New amount is required",
    }),
    features: joi_1.default.array().items(joi_1.default.string().trim().min(1).max(255)).default([]),
    status: joi_1.default.string().valid("active", "active").default("active"),
});
exports.addUpdateTestimonialSchema = joi_1.default.object({
    id: joi_1.default.number().integer().optional(),
    location: joi_1.default.string().required().messages({
        "any.required": "Location is required",
        "string.empty": "Location is required",
    }),
    name: joi_1.default.string().trim().min(1).max(150).required().messages({
        "string.empty": "Name is required",
        "any.required": "Name is required",
    }),
    image: joi_1.default.string().trim().allow("", null).optional(),
    content: joi_1.default.string().trim().min(1).required().messages({
        "string.empty": "Testimonial content is required",
        "any.required": "Testimonial content is required",
    }),
    rating: joi_1.default.number().required().messages({
        "string.empty": "Rating  is required",
        "any.required": "Rating is required",
    }),
    status: joi_1.default.string().valid("active", "inactive").default("active"),
});
exports.updateProfileSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(100).optional().messages({
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name cannot exceed 100 characters",
    }),
    email: joi_1.default.string().optional(),
    mobile: joi_1.default.string()
        .trim()
        .pattern(/^[0-9]{10}$/)
        .optional()
        .messages({
        "string.pattern.base": "Mobile number must be 10 digits",
    }),
    country_code: joi_1.default.string().optional(),
    user_id: joi_1.default.number().required().messages({
        "any.required": "User ID is required",
    }),
});
// by area
exports.addUpdatePropertyAreaSchema = joi_1.default.object({
    id: joi_1.default.number().integer().optional(),
    image: joi_1.default.string().max(500).allow(null, "").optional(),
    name: joi_1.default.string().trim().max(255).required(),
    property_count: joi_1.default.number().required().messages({
        "any.required": "Property Count is required",
    }),
    status: joi_1.default.string().valid("active", "inactive").optional(),
});
// aboutus
exports.addUpdateAboutUsSchema = joi_1.default.object({
    id: joi_1.default.number().integer().optional(),
    yoe: joi_1.default.number().required().messages({
        "any.required": "Years Of Experience is required",
    }),
    projects: joi_1.default.number().required().messages({
        "any.required": "Completed Projects are required",
    }),
    clients: joi_1.default.number().required().messages({
        "any.required": "Clients are required",
    }),
    users: joi_1.default.number().required().messages({
        "any.required": "Users are required",
    }),
    address: joi_1.default.string().required().messages({
        "any.required": "address is required",
    }),
    mobile: joi_1.default.string().required().messages({
        "any.required": "Mobile Number is required",
    }),
    email: joi_1.default.string().required().messages({
        "any.required": "address is required",
    }),
    c_yoe: joi_1.default.number().required().messages({
        "any.required": "Years Of Experience is required",
    }),
    c_projects: joi_1.default.number().required().messages({
        "any.required": "Completed Projects are required",
    }),
    c_clients: joi_1.default.number().required().messages({
        "any.required": "Clients are required",
    }),
    c_built: joi_1.default.number().required().messages({
        "any.required": "Construction are required",
    }),
});
// Gallery
exports.addUpdateGallerySchema = joi_1.default.object({
    id: joi_1.default.number().integer().optional(),
    type: joi_1.default.string().required().messages({
        "any.required": "Type is required",
    }),
    image: joi_1.default.string().required().messages({
        "any.required": "Image is required",
    }),
    is_hero: joi_1.default.number().optional(),
    status: joi_1.default.string().optional(),
});
// enquiry
exports.addUpdateEnquirySchema = joi_1.default.object({
    id: joi_1.default.number().integer().optional(),
    name: joi_1.default.string().required().messages({
        "any.required": "name is required",
    }),
    email: joi_1.default.string().optional(),
    mobile: joi_1.default.string().optional(),
    messages: joi_1.default.string().optional(),
    regarding: joi_1.default.string().required().messages({
        "any.required": "Regarding is required",
    }),
    property_id: joi_1.default.number().optional(),
    status: joi_1.default.string().optional(),
});
exports.addUpdateAmenitiesSchema = joi_1.default.object({
    id: joi_1.default.number().integer().optional(),
    name: joi_1.default.string().required().messages({
        "any.required": "name is required",
    }),
    status: joi_1.default.string().optional(),
});
exports.addUpdatePropertyHighlightSchema = joi_1.default.object({
    id: joi_1.default.number().integer().optional(),
    name: joi_1.default.string().required().messages({
        "any.required": "name is required",
    }),
    status: joi_1.default.string().optional(),
});
exports.addUpdateSubCategorySchema = joi_1.default.object({
    id: joi_1.default.number().integer().positive().optional(),
    prop_id: joi_1.default.number().integer().positive().required(),
    sub_name: joi_1.default.string().trim().required(),
    status: joi_1.default.string().optional(),
});
// consultants
exports.addUpdateConsultantSchema = joi_1.default.object({
    id: joi_1.default.number().integer().optional(),
    name: joi_1.default.string().required().messages({
        "any.required": "Name is required",
    }),
    role: joi_1.default.string().required().messages({
        "any.required": "Role is required",
    }),
    image: joi_1.default.string().required().messages({
        "any.required": "Image is required",
    }),
});
