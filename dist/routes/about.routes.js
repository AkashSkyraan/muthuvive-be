"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aboutus_controller_1 = require("../controllers/aboutus.controller");
const router = (0, express_1.Router)();
router.post("/add-aboutus-data", 
/*
    #swagger.tags = ['6.About Us']
    #swagger.summary = 'Add or Update About us data'
    #swagger.description = 'Create a About us data (counts) or update an existing Abouts us count'

    #swagger.consumes = ['application/json']

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        id: 1,
        yoe: 5,
        projects: 120,
        clients: 1200,
        users : 50000,
        address : "No.5, Skyraan Building",
        mobile : "98764210",
        email : "abc@gmail.com"
      }
    }

    #swagger.responses[200] = {
      description: 'added or updated successfully',
      schema: {
        success: true,
        data: [
          {
            id: 1
          }
        ],
        message: 'Abouts Us added successfully'
      }
    }

    #swagger.responses[400] = {
      description: 'Validation Error'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
aboutus_controller_1.AboutUsController.addUpdateAboutUs);
router.get("/about-data", 
/*
    #swagger.tags = ['6.About Us']
    #swagger.summary = 'Get About Us data'
    #swagger.description = 'Get all About Us data or fetch a specific record by ID'

    #swagger.parameters['id'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: 'About Us ID. If provided, fetches the specific record; otherwise fetches all records.'
    }

    #swagger.responses[200] = {
      description: 'About Us data fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
aboutus_controller_1.AboutUsController.getAboutUsData);
exports.default = router;
