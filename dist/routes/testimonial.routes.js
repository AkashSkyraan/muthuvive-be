"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testimonial_controller_1 = require("../controllers/testimonial.controller");
const router = (0, express_1.Router)();
router.post("/add-testimonial", 
/*
    #swagger.tags = ['4.Testimonial']
    #swagger.summary = 'Add or Update Testimonial'
    #swagger.description = 'Create a new testimonial or update an existing testimonial'

    #swagger.consumes = ['application/json']

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $id: 1,
        name: 'John David',
        image: 'uploads/images/john.jpg',
        content: 'This platform helped me find the perfect property. Highly recommended!',
        rating: 5,
        status: 'active'
      }
    }

    #swagger.responses[200] = {
      description: 'Testimonial added or updated successfully'
    }

  

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
testimonial_controller_1.TestimonialController.addUpdateTestimonial);
router.get("/testimonials", 
/*
    #swagger.tags = ['4.Testimonial']
    #swagger.summary = 'Get Testimonials'
    #swagger.description = 'Get all testimonials or filter by ID and status'

    #swagger.parameters['id'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: 'Testimonial ID'
    }

    #swagger.parameters['status'] = {
      in: 'query',
      required: false,
      type: 'string',
      enum: ['active', 'inactive'],
      description: 'Testimonial status'
    }

    #swagger.responses[200] = {
      description: 'Testimonials fetched successfully'
    }

   

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
testimonial_controller_1.TestimonialController.getTestimonials);
router.delete("/testimonials/:id", 
/*
    #swagger.tags = ['4.Testimonial']
    #swagger.summary = 'Delete Testimonial'
    #swagger.description = 'Delete a testimonial based on testimonial ID'

    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'Testimonial ID'
    }

    #swagger.responses[200] = {
      description: 'Testimonial deleted successfully'
    }

  

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
testimonial_controller_1.TestimonialController.deleteTestimonial);
exports.default = router;
