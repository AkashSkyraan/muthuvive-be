"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const source_controller_1 = require("../controllers/source.controller");
const router = (0, express_1.Router)();
router.post("/add-amenities", 
/*
    #swagger.tags = ['9.Source']
    #swagger.summary = 'Add or Update Amenities'
    #swagger.description = 'Create a new Amenities or update an existing amenity'

    #swagger.consumes = ['application/json']

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $id: 1,
        
        name: 'Parking',
        status: 'active'
      }
    }

    #swagger.responses[200] = {
      description: 'Amenity added or updated successfully',
      schema: {
        success: true,
        data: [
          {
            id: 1
          }
        ],
        message: 'Amenity added successfully'
      }
    }

    #swagger.responses[400] = {
      description: 'Validation Error'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
source_controller_1.SourceController.addUpdateAmenities);
router.get("/get-amenities", 
/*
    #swagger.tags = ['9.Source']
    #swagger.summary = 'Get Amenities'
    #swagger.description = 'Get all amenities, a single amenity by ID, or filter amenities by status'

    #swagger.parameters['id'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: 'Amenity ID'
    }

    #swagger.parameters['status'] = {
      in: 'query',
      required: false,
      type: 'string',
      enum: ['active', 'inactive'],
      description: 'Amenity status (Inactive, Active)'
    }

    #swagger.responses[200] = {
      description: 'Amenities fetched successfully'
    }

    #swagger.responses[400] = {
      description: 'Invalid amenity ID or status'
    }

    #swagger.responses[404] = {
      description: 'Amenity not found'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
source_controller_1.SourceController.getAmenities);
router.post("/add-prop-highlights", 
/*
    #swagger.tags = ['9.Source']
    #swagger.summary = 'Add or Update Property Highlights'
    #swagger.description = 'Create a new property highlight or update an existing property highlight'

    #swagger.consumes = ['application/json']

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $id: 1,

        name: 'Swimming Pool',
        status: 'active'
      }
    }

    #swagger.responses[200] = {
      description: 'Property highlight added or updated successfully',
      schema: {
        success: true,
        data: [
          {
            id: 1
          }
        ],
        message: 'Property highlight added successfully'
      }
    }

    #swagger.responses[400] = {
      description: 'Validation Error'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
source_controller_1.SourceController.addUpdatePropertyHighlights);
router.get("/get-prop-highlights", 
/*
    #swagger.tags = ['9.Source']
    #swagger.summary = 'Get Property Highlights'
    #swagger.description = 'Get all property highlights, a single property highlight by ID, or filter property highlights by status'

    #swagger.parameters['id'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: 'Property Highlight ID'
    }

    #swagger.parameters['status'] = {
      in: 'query',
      required: false,
      type: 'string',
      enum: ['active', 'inactive'],
      description: 'Property Highlight status (Inactive, Active)'
    }

    #swagger.responses[200] = {
      description: 'Property Highlights fetched successfully'
    }

    #swagger.responses[400] = {
      description: 'Invalid property highlight ID or status'
    }

    #swagger.responses[404] = {
      description: 'Property Highlight not found'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
source_controller_1.SourceController.getPropertyHighlights);
exports.default = router;
