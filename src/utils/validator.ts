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
  email: Joi.string().optional(),
  mobile: Joi.string().optional(),
  password: Joi.string().min(8).max(128).required(),
});

export const signupSchema = Joi.object({
  user_name: Joi.string().optional(),
  email: Joi.string().optional(),

  mobile: Joi.string().optional(),

  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
}).or("email", "mobile");

export const loginSchema = Joi.object({
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

// by area

export const addUpdatePropertyAreaSchema = Joi.object({
  id: Joi.number().integer().optional(),

  image: Joi.string().max(500).allow(null, "").optional(),

  name: Joi.string().trim().max(255).required(),
  property_count: Joi.number().required().messages({
    "any.required": "Property Count is required",
  }),

  status: Joi.string().valid("active", "inactive").optional(),
});

// aboutus
export const addUpdateAboutUsSchema = Joi.object({
  id: Joi.number().integer().optional(),
  yoe: Joi.number().required().messages({
    "any.required": "Years Of Experience is required",
  }),
  projects: Joi.number().required().messages({
    "any.required": "Completed Projects are required",
  }),
  clients: Joi.number().required().messages({
    "any.required": "Clients are required",
  }),
  users: Joi.number().required().messages({
    "any.required": "Users are required",
  }),
  address: Joi.string().required().messages({
    "any.required": "address is required",
  }),
  mobile: Joi.string().required().messages({
    "any.required": "Mobile Number is required",
  }),
  email: Joi.string().required().messages({
    "any.required": "address is required",
  }),
  c_yoe: Joi.number().required().messages({
    "any.required": "Years Of Experience is required",
  }),
  c_projects: Joi.number().required().messages({
    "any.required": "Completed Projects are required",
  }),
  c_clients: Joi.number().required().messages({
    "any.required": "Clients are required",
  }),
  c_built: Joi.number().required().messages({
    "any.required": "Construction are required",
  }),
});

// Gallery

export const addUpdateGallerySchema = Joi.object({
  id: Joi.number().integer().optional(),
  type: Joi.string().required().messages({
    "any.required": "Type is required",
  }),
  image: Joi.string().required().messages({
    "any.required": "Image is required",
  }),
  is_hero: Joi.number().optional(),
  status: Joi.string().optional(),
});

// enquiry

export const addUpdateEnquirySchema = Joi.object({
  id: Joi.number().integer().optional(),
  name: Joi.string().required().messages({
    "any.required": "name is required",
  }),
  email: Joi.string().optional(),
  mobile: Joi.string().optional(),
  messages: Joi.string().optional(),

  regarding: Joi.string().required().messages({
    "any.required": "Regarding is required",
  }),
  property_id: Joi.number().optional(),
  status: Joi.string().optional(),
});

export const addUpdateAmenitiesSchema = Joi.object({
  id: Joi.number().integer().optional(),
  name: Joi.string().required().messages({
    "any.required": "name is required",
  }),
  status: Joi.string().optional(),
});
export const addUpdatePropertyHighlightSchema = Joi.object({
  id: Joi.number().integer().optional(),
  name: Joi.string().required().messages({
    "any.required": "name is required",
  }),
  status: Joi.string().optional(),
});

export const addUpdateSubCategorySchema = Joi.object({
  id: Joi.number().integer().positive().optional(),

  prop_id: Joi.number().integer().positive().required(),

  sub_name: Joi.string().trim().required(),

  status: Joi.string().optional(),
});

export interface GetSubPropertyInput {
  id?: number;
  prop_id?: number;
  status?: string;
}

// consultants

export const addUpdateConsultantSchema = Joi.object({
  id: Joi.number().integer().optional(),
  name: Joi.string().required().messages({
    "any.required": "Name is required",
  }),
  role: Joi.string().required().messages({
    "any.required": "Role is required",
  }),
  image: Joi.string().required().messages({
    "any.required": "Image is required",
  }),
});
