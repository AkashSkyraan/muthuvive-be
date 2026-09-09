import { Router } from "express";
import { GalleryController } from "../controllers/gallery.controller";

const router = Router();

router.post(
  "/add-gallery",

  /*
      #swagger.tags = ['7.Gallery']
      #swagger.summary = 'Add or Update Gallery'
      #swagger.description = 'Create a new gallery item or update an existing gallery item'

      #swagger.consumes = ['application/json']

      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          id: 1,
          image: "uploads/gallery.jpg",
          type: "project",
          is_hero : 0,
          status: "active"
        }
      }

      #swagger.responses[200] = {
        description: 'Gallery added or updated successfully',
        schema: {
          success: true,
          data: [
            {
              id: 1
            }
          ],
          message: 'Gallery added successfully'
        }
      }

      #swagger.responses[400] = {
        description: 'Validation Error'
      }

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  GalleryController.addUpdateGallery,
);

router.get(
  "/get-gallery",

  /*
      #swagger.tags = ['7.Gallery']
      #swagger.summary = 'Get Gallery'
      #swagger.description = 'Get all gallery items or filter by ID, type, and status'

      #swagger.parameters['id'] = {
        in: 'query',
        required: false,
        type: 'integer',
        description: 'Gallery ID'
      }

      #swagger.parameters['type'] = {
        in: 'query',
        required: false,
        type: 'string',
        description: 'Gallery type'
      }

      #swagger.parameters['status'] = {
        in: 'query',
        required: false,
        type: 'string',
        enum: ['active', 'inactive'],
        description: 'Gallery status'
      }

      #swagger.responses[200] = {
        description: 'Gallery fetched successfully'
      }

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  GalleryController.getGallery,
);

router.delete(
  "/gallery/:id",

  /*
      #swagger.tags = ['7.Gallery']
      #swagger.summary = 'Delete Gallery Images'
      #swagger.description = 'Delete a Gallery images based on Image ID'

      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        description: 'Image ID'
      }

      #swagger.responses[200] = {
        description: 'Galary Images deleted successfully'
      }

    

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  GalleryController.deleteGallery,
);

export default router;
