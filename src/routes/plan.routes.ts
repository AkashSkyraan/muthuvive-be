import { Router } from "express";
import { PlanController } from "../controllers/plan.controller";

const router = Router();

router.post(
  "/add-plan",

  /*
      #swagger.tags = ['3.Plan']
      #swagger.summary = 'Add or Update Plan'
      #swagger.description = 'Create a new plan or update an existing plan'

      #swagger.consumes = ['application/json']

      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          $id: 1,
          duration: 'year',
          old_amount: 4999,
          new_amount: 2999,
          features: [
            '365 Days Listing',
            'Wider Visibility',
            'Property Promotion',
            'Regular Verification',
            'Better Selling Opportunity'
          ],
          status: 'active'
        }
      }

      #swagger.responses[200] = {
        description: 'Plan added or updated successfully'
      }

    

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  PlanController.addUpdatePlan,
);

router.get(
  "/plans",

  /*
      #swagger.tags = ['3.Plan']
      #swagger.summary = 'Get Plans'
      #swagger.description = 'Get all plans or filter by ID and status'

      #swagger.parameters['id'] = {
        in: 'query',
        required: false,
        type: 'integer',
        description: 'Plan ID'
      }

      #swagger.parameters['status'] = {
        in: 'query',
        required: false,
        type: 'string',
        enum: ['active', 'inactive'],
        description: 'Plan status'
      }

      #swagger.responses[200] = {
        description: 'Plans fetched successfully'
      }

 
      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  PlanController.getPlans,
);

router.delete(
  "/plans/:id",

  /*
      #swagger.tags = ['3.Plan']
      #swagger.summary = 'Delete Plan'
      #swagger.description = 'Delete a plan based on plan ID'

      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        description: 'Plan ID'
      }

      #swagger.responses[200] = {
        description: 'Plan deleted successfully'
      }

    

      #swagger.responses[404] = {
        description: 'Plan not found'
      }

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  PlanController.deletePlan,
);

router.get(
  "/get-property-plan",

  /*
      #swagger.tags = ['3.Plan']
      #swagger.summary = 'Get Property Plan'
      #swagger.description = 'Get plans purchased by a user for a specific property using user ID and property ID'

      #swagger.parameters['user_id'] = {
        in: 'query',
        required: true,
        type: 'integer',
        example: 1,
        description: 'User ID'
      }

      #swagger.parameters['prop_id'] = {
        in: 'query',
        required: true,
        type: 'string',
        example: 'PC5QZo055',
        description: 'Property ID'
      }

      #swagger.responses[200] = {
        description: 'Property plan fetched successfully',
        schema: {
          success: true,
          data: [],
          message: "Property plan fetched successfully",
          error: []
        }
      }

      #swagger.responses[400] = {
        description: 'user_id and prop_id are required'
      }

      #swagger.responses[404] = {
        description: 'Property plan not found'
      }

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  PlanController.getPropertyPlan,
);

export default router;
