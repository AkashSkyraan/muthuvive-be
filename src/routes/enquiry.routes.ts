import { Router } from "express";
import EnquiryController from "../controllers/enquiry.controller";

const router = Router();

router.post(
  "/add-enquiry",

  /*
        #swagger.tags = ['8.Enquiry']
    #swagger.summary = 'Add / Update Enquiry'
    #swagger.description = 'Send a new enquiry or update an existing enquiry for a property'
    #swagger.consumes = ['application/json']

      #swagger.consumes = ['application/json']

      #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        id : 1,
        name: "Kamalesh",
        email: "kamalesh@gmail.com",
        mobile: "9876543210",
        message: "I am interested in this property",
        regarding: "Property Enquiry",
        status : "pending",
        property_id: 1
      }
    }

      #swagger.responses[200] = {
       description: 'Enquiry sent successfully',
        schema: {
          success: true,
          data: [
            {
              id: 1
            }
          ],
          message: 'Enquiry sent successfully'
        }
      }

      

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  EnquiryController.addUpdateEnquiry,
);

router.get(
  "/get-enquiries",

  /*
    #swagger.tags = ['8.Enquiry']
    #swagger.summary = 'Get Enquiries list data'
    #swagger.description = 'Get enquiries by ID, status, regarding, property ID, mobile or email'

    #swagger.parameters['id'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: 'Enquiry ID'
    }

    #swagger.parameters['status'] = {
      in: 'query',
      required: false,
      type: 'string',
      enum: ['pending', 'contacted', 'closed'],
      description: 'Filter enquiries by status'
    }

    #swagger.parameters['regarding'] = {
      in: 'query',
      required: false,
      type: 'string',
      description: 'Filter enquiries by regarding'
    }

    #swagger.parameters['property_id'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: 'Filter enquiries by property ID'
    }

    #swagger.parameters['mobile'] = {
      in: 'query',
      required: false,
      type: 'string',
      description: 'Search mobile number using wildcard'
    }

    #swagger.parameters['email'] = {
      in: 'query',
      required: false,
      type: 'string',
      description: 'Search email using wildcard'
    }

    #swagger.responses[200] = {
      description: 'Enquiries fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */

  EnquiryController.getEnquiryData,
);


export default router;
