"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const property_controller_1 = require("../controllers/property.controller");
const router = (0, express_1.Router)();
router.post("/add-property", 
/*
    #swagger.tags = ['2.Property']
    #swagger.summary = 'Add or Update Property'
    #swagger.description = 'Create a new property or update an existing property'

    #swagger.consumes = ['application/json']

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $id: 1,
        image: 'property.jpg',
        name: 'Farmland',
        status: 'active'
      }
    }

    #swagger.responses[200] = {
      description: 'Property added or updated successfully',
      schema: {
        success: true,
        data: [
          {
            id: 1
          }
        ],
        message: 'Property added successfully'
      }
    }

    #swagger.responses[400] = {
      description: 'Validation Error'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
property_controller_1.PropertyController.addUpdateProperty);
router.get("/properties", 
/*
    #swagger.tags = ['2.Property']
    #swagger.summary = 'Get Properties'
    #swagger.description = 'Get all properties, a single property by ID, or filter properties by status'

    #swagger.parameters['id'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: 'Property ID'
    }

    #swagger.parameters['status'] = {
      in: 'query',
      required: false,
      type: 'string',
      enum: ['active', 'inactive'],
      description: 'Property status (Inactive, Active)'
    }

    #swagger.responses[200] = {
      description: 'Properties fetched successfully'
    }

    #swagger.responses[400] = {
      description: 'Invalid property ID or status'
    }

    #swagger.responses[404] = {
      description: 'Property not found'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
property_controller_1.PropertyController.getProperties);
router.delete("/properties/:id", 
/*
    #swagger.tags = ['2.Property']
    #swagger.summary = 'Delete Property'
    #swagger.description = 'Delete a property based on property ID'

    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'Property ID'
    }

    #swagger.responses[200] = {
      description: 'Property deleted successfully'
    }

    #swagger.responses[400] = {
      description: 'Invalid property ID'
    }

    #swagger.responses[404] = {
      description: 'Property not found'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
property_controller_1.PropertyController.deleteProperty);
exports.default = router;
