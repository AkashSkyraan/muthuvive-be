"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.put("/update-profile", 
/*
    #swagger.tags = ['5.User']
    #swagger.summary = 'Update Profile'
    #swagger.description = 'Update user name, email, or mobile number'

    #swagger.security = [{
      bearerAuth: []
    }]

    #swagger.consumes = ['application/json']

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $user_id: 1,
        name: 'Kamalesh',
        email: 'kamalesh@example.com',
        mobile: '9876543210'
      }
    }

    #swagger.responses[200] = {
      description: 'Profile updated successfully'
    }

    #swagger.responses[401] = {
      description: 'Unauthorized'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
user_controller_1.UserController.updateProfile);
router.get("/get-user", user_controller_1.UserController.getUser);
exports.default = router;
