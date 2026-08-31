import Joi from "joi";

export const requestOtpSchema = Joi.object({
  type: Joi.string().optional(),
  purpose: Joi.number().required().messages({
    "any.required": "Purpose is required",
  }),
  email: Joi.string().optional(),
  mobile: Joi.string().optional(),
})
  .or("email", "mobile")
  .messages({
    "object.missing": "Either email or mobile is required",
  });

export const verifyOtpSchema = Joi.object({
  type: Joi.string().valid("email", "mobile").required(),
  purpose: Joi.number().valid(1, 2).required(),
  email: Joi.string().optional(),
  mobile: Joi.number().optional(),
  otp: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.pattern.base": "OTP must be a 6 digit number",
    }),
});

export const resetPasswordSchema = Joi.object({
  type: Joi.string().valid("email", "mobile").required(),

  email: Joi.optional(),
  mobile: Joi.optional(),
  password: Joi.string().min(8).max(128).required(),

  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
});

export const signupSchema = Joi.object({
  email: Joi.string().optional(),

  mobile: Joi.string().optional(),

  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),

  confirm_password: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
}).or("email", "mobile");

export const loginSchema = Joi.object({
  type: Joi.string().valid("email", "mobile").required(),

  email: Joi.string().optional(),

  mobile: Joi.string().optional(),

  password: Joi.string().required(),
});

export const addUpdateCategorySchema = Joi.object({
  id: Joi.number().integer().optional(),

  image: Joi.string().max(500).allow(null, "").optional(),

  name: Joi.string().trim().max(255).required(),

  status: Joi.string().valid("active", "inactive").optional(),
});

export const addUpdatePlanSchema = Joi.object({
  id: Joi.number().optional(),

  duration: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "Duration is required",
    "any.required": "Duration is required",
  }),

  old_amount: Joi.number().default(0),

  new_amount: Joi.number().required().messages({
    "number.base": "New amount must be a number",
    "any.required": "New amount is required",
  }),

  features: Joi.array().items(Joi.string().trim().min(1).max(255)).default([]),

  status: Joi.string().valid("active", "active").default("active"),
});

export const addUpdateTestimonialSchema = Joi.object({
  id: Joi.number().integer().optional(),
  location: Joi.string().required().messages({
    "any.required": "Location is required",
    "string.empty": "Location is required",
  }),

  name: Joi.string().trim().min(1).max(150).required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),

  image: Joi.string().trim().allow("", null).optional(),

  content: Joi.string().trim().min(1).required().messages({
    "string.empty": "Testimonial content is required",
    "any.required": "Testimonial content is required",
  }),

  rating: Joi.number().required().messages({
    "string.empty": "Rating  is required",
    "any.required": "Rating is required",
  }),

  status: Joi.string().valid("active", "inactive").default("active"),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional().messages({
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 100 characters",
  }),

  email: Joi.string().optional(),

  mobile: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
    }),
  country_code: Joi.string().optional(),
  user_id: Joi.number().required().messages({
    "any.required": "User ID is required",
  }),
});
