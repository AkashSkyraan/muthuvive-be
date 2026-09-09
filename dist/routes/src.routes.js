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
// geolocation
router.get("/get-address-by-pincode", 
/*
  #swagger.tags = ['9.Source']
  #swagger.summary = 'Get Address By Pincode'
  #swagger.description = 'Get address details by pincode and country'

  #swagger.parameters['pincode'] = {
    in: 'query',
    required: true,
    type: 'string',
    example: '624601',
    description: 'Pincode'
  }

 
  #swagger.responses[200] = {
    description: 'Address fetched successfully'
  }

  #swagger.responses[400] = {
    description: 'Invalid pincode or country'
  }

  #swagger.responses[500] = {
    description: 'Internal Server Error'
  }
*/
source_controller_1.SourceController.getAdressDetailsFromPincode);
router.get("/get-pincode-details", 
/*
  #swagger.tags = ['9.Source']
  #swagger.summary = 'Get Pincode Location Details'
  #swagger.description = 'Get states by country, districts by state, or cities by district'

  #swagger.parameters['country'] = {
    in: 'query',
    required: true,
    type: 'string',
    example: 'India',
    description: 'Country name'
  }

  #swagger.parameters['state'] = {
    in: 'query',
    required: false,
    type: 'string',
    example: 'Tamil Nadu',
    description: 'State name'
  }

  #swagger.parameters['district'] = {
    in: 'query',
    required: false,
    type: 'string',
    example: 'Dindigul',
    description: 'District name'
  }
  #swagger.parameters['city'] = {
    in: 'query',
    required: false,
    type: 'string',
    example: 'Palani',
    description: 'city name'
  }

  #swagger.responses[200] = {
    description: 'Location details fetched successfully'
  }

  #swagger.responses[400] = {
    description: 'Country is required'
  }

  #swagger.responses[404] = {
    description: 'Location details not found'
  }

  #swagger.responses[500] = {
    description: 'Internal Server Error'
  }
*/
source_controller_1.SourceController.getPincodeDetails);
exports.default = router;
