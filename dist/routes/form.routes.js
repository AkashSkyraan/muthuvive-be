"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const form_controller_1 = require("../controllers/form.controller");
const router = (0, express_1.Router)();
router.post("/properties/step", form_controller_1.FormController.savePropertyStep);
router.get("/get-prop-byid", 
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
    enum: ['dtcp', 'commercial', 'agri'],
    example: 'agri',
    description: 'Property category type'
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
form_controller_1.FormController.getProperty);
exports.default = router;
