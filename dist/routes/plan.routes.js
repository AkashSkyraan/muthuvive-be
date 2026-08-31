"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const plan_controller_1 = require("../controllers/plan.controller");
const router = (0, express_1.Router)();
router.post("/add-plan", 
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
plan_controller_1.PlanController.addUpdatePlan);
router.get("/plans", 
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
plan_controller_1.PlanController.getPlans);
router.delete("/plans/:id", 
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
plan_controller_1.PlanController.deletePlan);
exports.default = router;
