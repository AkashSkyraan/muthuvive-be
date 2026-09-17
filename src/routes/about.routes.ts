import { Router } from "express";
import { AboutUsController } from "../controllers/aboutus.controller";

const router = Router();

router.post(
  "/add-aboutus-data",

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
          email : "abc@gmail.com",
          c_yoe : 2,
          c_projects : 150,
          c_clients : 1500,
          c_built : 50000

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

  AboutUsController.addUpdateAboutUs,
);

router.get(
  "/about-data",

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

  AboutUsController.getAboutUsData,
);

// c_worker

router.post(
  "/add-consultant",

  /*
      #swagger.tags = ['6.About Us']
      #swagger.summary = 'Add or Update Consultant data'
      #swagger.description = 'Create a Consultant  data or update an existing consultant data'

      #swagger.consumes = ['application/json']

      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          id: 1,
          name : "skyraan",
          role : "sr. Engineer",
          image : "/uploads/image/abced"

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
          message: 'consultants added successfully'
        }
      }

      #swagger.responses[400] = {
        description: 'Validation Error'
      }

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  AboutUsController.addUpdateConsultants,
);

router.get(
  "/consultant",

  /*
      #swagger.tags = ['6.About Us']
      #swagger.summary = 'Get Consultants data'
      #swagger.description = 'Get all consultants data or fetch a specific record by ID'

      #swagger.parameters['id'] = {
        in: 'query',
        required: false,
        type: 'integer',
        description: 'Consultants ID. If provided, fetches the specific record; otherwise fetches all records.'
      }

      #swagger.responses[200] = {
        description: 'Consultants data fetched successfully'
      }

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  AboutUsController.getConsultants,
);

export default router;
