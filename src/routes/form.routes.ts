import { Router } from "express";
import { FormController } from "../controllers/form.controller";

const router = Router();

router.post(
  "/properties/step",

  /*
      #swagger.tags = ['10.Form']
      #swagger.summary = 'Save Property Form Step'
    #swagger.description = 'Create or update property form '
      #swagger.consumes = ['application/json']

      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          step: 1,
          user_id: 1,
          prop_id: "PAb12C3456",

          category: 1,
          sub_category: 2,
          country: "India",
          state: "Tamil Nadu",
          district: "Chennai",
          city: "Chennai",
          map_link: "https://maps.google.com/?q=Chennai",

          prop_name: "Green Valley Residency",
          prop_area: 1200,
          area_unit: "sqft",
          road_plan: "30 Feet Road",
          road_length: 30,
          road_length_unit: "ft",
          pathway: 0,
          length: 40,
          length_unit: "feet",
          width: 30,
          width_unit: "ft",
          c_well: 1,
          i_well: 0,
          electricity: 1,
          hp: 5,
          facing: "East",
          construct: 1,
          construct_type: 1,
          other_type: null,
          min_price: 2500000,
          max_price: 3000000,
          carpet_area: 1000,
          carp_unit: "sqft",
          build: 1200,
          build_unit: "sqft",
          super_build: 1400,
          super_build_unit: "sqft",
          total_floor: 4,
          your_floor: 2,
          avail_status: 1,
          bhk: 2,

          amenities: [1, 2, 3],
          prop_highs: [1, 2],
          rooms: 3,
          lift: 1,
          washroom: 2,

          cover: 101,
          pr_img: [102, 103, 104],
          pr_vid: [105, 106],
          patta: [107],
          pr_doc: [108, 109],
          status : "inprogress"
        }
      }

      #swagger.responses[200] = {
        description: 'Property step saved successfully',
        schema: {
          success: 1,
          data: {
            prop_id: "PAb12C3456",
            step: 1,
            action: "created"
          },
          message: "Step 1 saved successfully"
        }
      }

      #swagger.responses[400] = {
        description: 'Invalid step / Property ID is required',
        schema: {
          success: 0,
          data: [],
          message: "Invalid step"
        }
      }

      #swagger.responses[500] = {
        description: 'Internal Server Error',
        schema: {
          success: 0,
          data: [],
          message: "Something went wrong"
        }
      }
  */

  FormController.savePropertyStep,
);
router.get(
  "/get-prop-byid",
  /*
    #swagger.tags = ['10.Form']
    #swagger.summary = 'Get Property By ID'
    #swagger.description = 'Get complete property details including prop_form data, amenities, property highlights, media, and category-specific data'

    #swagger.parameters['prop_id'] = {
      in: 'query',
      required: true,
      type: 'string',
      example: 'P7K2XM',
      description: 'Property ID'
    }

    #swagger.parameters['type'] = {
      in: 'query',
      required: false,
      type: 'string',
      enum: [1,2,3,4,5],
      example: 1,
      description: 'Property category type number 1-dtcp , 2-farmland'
    }

    #swagger.responses[200] = {
      description: 'Property fetched successfully',
      schema: {
        type: 'object',
        properties: {
          status: {
            type: 'integer',
            example: 1
          },
          message: {
            type: 'string',
            example: 'Property fetched successfully'
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 15
              },
              prop_id: {
                type: 'string',
                example: 'P7K2XM'
              },
              category: {
                type: 'integer',
                example: 3
              },
              sub_category: {
                type: 'integer',
                example: 5
              },
              country: {
                type: 'string',
                example: 'India'
              },
              state: {
                type: 'string',
                example: 'Tamil Nadu'
              },
              district: {
                type: 'string',
                example: 'Coimbatore'
              },
              city: {
                type: 'string',
                example: 'Pollachi'
              },
              user_id: {
                type: 'integer',
                example: 10
              },
              map: {
                type: 'string',
                example: 'https://maps.google.com/...'
              },
              prop_name: {
                type: 'string',
                example: 'Green Farm'
              },
              prop_area: {
                type: 'number',
                example: 5
              },
              area_unit: {
                type: 'string',
                example: 'acre'
              },
              road_plan: {
                type: 'string',
                example: 'East'
              },
              road_length: {
                type: 'number',
                example: 40
              },
              road_length_unit: {
                type: 'string',
                example: 'feet'
              },
              pathway: {
                type: 'number',
                example: 10
              },
              length: {
                type: 'number',
                example: 100
              },
              length_unit: {
                type: 'string',
                example: 'feet'
              },
              width: {
                type: 'number',
                example: 50
              },
              width_unit: {
                type: 'string',
                example: 'feet'
              },
              c_well: {
                type: 'integer',
                example: 1
              },
              i_well: {
                type: 'integer',
                example: 0
              },
              electricity: {
                type: 'integer',
                example: 1
              },
              hp: {
                type: 'number',
                example: 5
              },
              facing: {
                type: 'string',
                example: 'East'
              },
              construct: {
                type: 'integer',
                example: 0
              },
              construct_type: {
                type: 'string',
                nullable: true,
                example: null
              },
              other_type: {
                type: 'string',
                nullable: true,
                example: null
              },
              step: {
                type: 'integer',
                example: 4
              },
              status: {
                type: 'string',
                example: 'active'
              },

              amenities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      example: 1
                    },
                    name: {
                      type: 'string',
                      example: 'Water Facility'
                    }
                  }
                }
              },

              property_highs: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      example: 2
                    },
                    name: {
                      type: 'string',
                      example: 'Main Road Access'
                    }
                  }
                }
              },

              media: {
                type: 'object',
                properties: {
                  cover: {
                    type: 'object',
                    nullable: true,
                    properties: {
                      id: {
                        type: 'integer',
                        example: 101
                      },
                      url: {
                        type: 'string',
                        example: 'https://domain.com/uploads/cover.jpg'
                      }
                    }
                  },

                  images: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'integer',
                          example: 102
                        },
                        url: {
                          type: 'string',
                          example: 'https://domain.com/uploads/image.jpg'
                        }
                      }
                    }
                  },

                  videos: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'integer',
                          example: 105
                        },
                        url: {
                          type: 'string',
                          example: 'https://domain.com/uploads/video.mp4'
                        }
                      }
                    }
                  },

                  patta: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'integer',
                          example: 107
                        },
                        url: {
                          type: 'string',
                          example: 'https://domain.com/uploads/patta.jpg'
                        }
                      }
                    }
                  },

                  documents: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'integer',
                          example: 109
                        },
                        url: {
                          type: 'string',
                          example: 'https://domain.com/uploads/document.pdf'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
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
  FormController.getProperty,
);

export default router;
