import { Router } from "express";
import { PropertyController } from "../controllers/property.controller";

const router = Router();

router.post(
  "/add-property",

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

  PropertyController.addUpdateProperty,
);

router.get(
  "/properties",

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

  PropertyController.getProperties,
);

router.delete(
  "/properties/:id",

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

  PropertyController.deleteProperty,
);

// area

router.post(
  "/add-property-area",

  /*
      #swagger.tags = ['2.Property']
      #swagger.summary = 'Add or Update Property Area'
      #swagger.description = 'Create a new property area or update an existing property area'

      #swagger.consumes = ['application/json']

      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          $id: 1,
          image: 'property.jpg',
          name: 'Farmland',
          property_count : 1,
          status: 'active'
        }
      }

      #swagger.responses[200] = {
        description: 'Property area added or updated successfully',
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

  PropertyController.addUpdatePropertyArea,
);

router.get(
  "/property-area",

  /*
      #swagger.tags = ['2.Property']
      #swagger.summary = 'Get Property Areas'
      #swagger.description = 'Get all property Areas, a single property Area by ID, or filter property Area by status'

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
        description: 'Property Area fetched successfully'
      }

      #swagger.responses[400] = {
        description: 'Invalid property ID or status'
      }

      #swagger.responses[404] = {
        description: 'Property Area not found'
      }

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  PropertyController.getPropertyArea,
);

router.delete(
  "/property-areas/:id",

  /*
      #swagger.tags = ['2.Property']
      #swagger.summary = 'Delete Property Areas'
      #swagger.description = 'Delete a property Areas based on property ID'

      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        description: 'Property ID'
      }

      #swagger.responses[200] = {
        description: 'Property Area deleted successfully'
      }

      #swagger.responses[400] = {
        description: 'Invalid property ID'
      }

      #swagger.responses[404] = {
        description: 'Property Area not found'
      }

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  PropertyController.deletePropertyArea,
);

// sub category

router.post(
  "/add-sub-prop",

  /*
      #swagger.tags = ['2.Property']
      #swagger.summary = 'Add or Update Property Sub Category'
      #swagger.description = 'Create a new property sub category or update an existing property sub category'

      #swagger.consumes = ['application/json']

      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          $id: 1,
          prop_id: 1,
          sub_name: 'Residential Land',
          status: 'active'
        }
      }

      #swagger.responses[200] = {
        description: 'Property sub category added or updated successfully',
        schema: {
          success: true,
          data: [
            {
              id: 1
            }
          ],
          message: 'Property sub category added successfully'
        }
      }

      #swagger.responses[400] = {
        description: 'Validation Error'
      }

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  PropertyController.addUpdateSubProperty,
);

router.get(
  "/get-sub-prop",

  /*
      #swagger.tags = ['2.Property']
      #swagger.summary = 'Get Property Sub Categories'
      #swagger.description = 'Get all property sub categories, a single sub category by ID, or filter by property ID and status'

      #swagger.parameters['id'] = {
        in: 'query',
        required: false,
        type: 'integer',
        description: 'Property Sub Category ID'
      }

      #swagger.parameters['prop_id'] = {
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
        description: 'Sub category status'
      }

      #swagger.responses[200] = {
        description: 'Property sub categories fetched successfully'
      }

     

      #swagger.responses[404] = {
        description: 'Property sub category not found'
      }

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  PropertyController.getSubProperties,
);

// getDTCP and Formland

router.get(
  "/get-property",
  /*
    #swagger.tags = ['2.Property']
    #swagger.summary = 'Get Property By ID'
    #swagger.description = 'Get complete property details including prop_form data, amenities, property highlights, media, and category-specific data'

    #swagger.parameters['status'] = {
      in: 'query',
      required: false,
      type: 'string',
      example: 'available',
      description: 'Status for properties'
    }

    #swagger.parameters['type'] = {
      in: 'query',
      required: false,
      type: 'string',
      enum: [1,2,3,4,5],
      example: 1,
      description: 'Property category type number 1-dtcp , 2-farmland'
    }
    #swagger.parameters['location'] = {
      in: 'query',
      required: false,
      type: 'string',
     example: 'coimbatore',
      description: 'fetch data location for fetch beside properties'
    }
    
 #swagger.parameters['user_id'] = {
      in: 'query',
      required: false,
      type: 'integer',
      example: 1,
      description: 'user_id for users'
    }
    

    #swagger.responses[400] = {
      description: 'Property ID is required'
    }

    #swagger.responses[404] = {
      description: 'Property not found'
    }

    #swagger.responses[500] = {
      description: 'Internal server error'
    }
  */
  PropertyController.getPropertyBasedOnTypes,
);

router.post(
  "/add-bookmark",

  /*
      #swagger.tags = ['2.Property']
      #swagger.summary = 'Add or Remove Property Bookmark'
      #swagger.description = 'Bookmark a property for a user on first click and remove the bookmark on the next click using user_id and prop_id'

      #swagger.consumes = ['application/json']

      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          user_id: 1,
          prop_id: 'PABC123'
        }
      }

      #swagger.responses[200] = {
        description: 'Bookmark added or removed successfully',
        schema: {
          success: true,
          data: [
            {
              user_id: 1,
              prop_id: 'PABC123',
              bookmarked: true,
              message: 'Property bookmarked successfully'
            }
          ],
          message: 'Bookmark added successfully'
        }
      }

      #swagger.responses[400] = {
        description: 'Validation Error'
      }

      #swagger.responses[404] = {
        description: 'Property not found'
      }

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  PropertyController.addUpdateBookmark,
);

router.get(
  "/get-bookmarks",

  /*
      #swagger.tags = ['2.Property']
      #swagger.summary = 'Get User Bookmarked Properties'
      #swagger.description = 'Get all active bookmarked properties for a user using user_id'

      #swagger.consumes = ['application/json']

      #swagger.parameters['user_id'] = {
        in: 'query',
        required: true,
        type: 'integer',
        example: 1
      }

      #swagger.parameters['page'] = {
        in: 'query',
        required: false,
        type: 'integer',
        example: 1
      }

      #swagger.parameters['limit'] = {
        in: 'query',
        required: false,
        type: 'integer',
        example: 10
      }

      #swagger.responses[200] = {
        description: 'Bookmarked properties fetched successfully',
        schema: {
          success: true,
          data: {
            properties: [
              {
                id: 1,
                prop_id: 'PABC123',
                prop_name: 'Green Villa',
                category: 1,
                category_name: 'DTCP',
                sub_category: 2,
                sub_category_name: 'Residential',
                country: 'India',
                state: 'Tamil Nadu',
                district: 'Chennai',
                city: 'Adyar',
                user_id: 10,
                prop_area: 1200,
                area_unit: 'sq.ft',
                status: 'available',
                is_bookmarked: 1,
                media: {
                  cover: {
                    id: 1,
                    url: 'https://example.com/cover.jpg'
                  },
                  images: [],
                  videos: [],
                  patta: [],
                  documents: []
                },
                amenities: [
                  {
                    id: 1,
                    name: 'Parking'
                  }
                ],
                highlights: [
                  {
                    id: 1,
                    name: 'Near School'
                  }
                ]
              }
            ],
            pagination: {
              total: 1,
              page: 1,
              limit: 10,
              totalPages: 1
            }
          },
          message: 'Bookmarked properties fetched successfully'
        }
      }

      #swagger.responses[400] = {
        description: 'user_id is required'
      }

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  PropertyController.getBookmarkProperties,
);

router.get(
  "/price-range",
  /*
    #swagger.tags = ['2.Property']

    #swagger.summary = 'Get Property Price Range'

    #swagger.description = 'Get minimum and maximum property price based on property type and status. When status is available, sold properties are excluded and all other statuses are considered available.'

    #swagger.parameters['type'] = {
      in: 'query',
      required: true,
      type: 'integer',
      description: 'Property type ID',
      example: 1
    }

    #swagger.parameters['status'] = {
      in: 'query',
      required: false,
      type: 'string',
      description: 'Property status. Use available to exclude sold properties, or provide a specific status.',
      enum: ['available', 'sold'],
      example: 'available'
    }

    #swagger.responses[200] = {
      description: 'Property price range fetched successfully',
      schema: {
        success: true,
        data: {
          minPrice: 500000,
          maxPrice: 2500000
        },
        message: 'Property price range fetched successfully'
      }
    }

    #swagger.responses[400] = {
      description: 'Property type is required',
      schema: {
        success: false,
        data: [],
        message: 'Property type is required'
      }
    }

    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: {
        success: false,
        data: [],
        message: 'Internal server error'
      }
    }
  */
  PropertyController.getPropertyPriceRange,
);

export default router;
