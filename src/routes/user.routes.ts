import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

router.put(
  "/update-profile",

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

  UserController.updateProfile,
);

export default router;
