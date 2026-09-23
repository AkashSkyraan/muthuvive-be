import { Router } from "express";
import { DashController } from "../controllers/dashboard.controller";

const router = Router();

router.post(
  "/create-admin",

  /*
      #swagger.tags = ['Admin']
      #swagger.summary = 'Create / Update Admin'
      #swagger.description = 'Create a new admin when ID is not provided, or update an existing admin when ID is provided'
      #swagger.consumes = ['application/json']

      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          id: 1,
          role: "subadmin",
          name: "Kamalesh",
          password: "12345678",
          status: 'active'
        }
      }

      #swagger.responses[201] = {
        description: 'Admin created successfully',
        schema: {
          success: 1,
          data: {
            id: 1,
            role: "admin",
            name: "Kamalesh",
            status: 'active'
          },
          message: 'Admin created successfully'
        }
      }

      #swagger.responses[200] = {
        description: 'Admin updated successfully / Validation error / Admin already exists',
        schema: {
          success: 1,
          data: {
            id: 1,
            role: "subadmin",
            name: "Kamalesh",
            status: 'active'
          },
          message: 'Admin updated successfully'
        }
      }

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  DashController.createAdmin,
);

router.post(
  "/login-admin",

  /*
      #swagger.tags = ['Admin']
      #swagger.summary = 'Admin Login'
      #swagger.description = 'Login admin or sub admin using name and password'
      #swagger.consumes = ['application/json']

      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          name: "Kamalesh",
          password: "12345678"
        }
      }

      #swagger.responses[200] = {
        description: 'Login successful',
        schema: {
          success: 1,
          data: {
            token: "eyJhbGciOiJIUzI1NiIs...",
            admin: {
              id: 1,
              role: "admin",
              name: "Kamalesh",
              status: 1
            }
          },
          message: "Login successful"
        }
      }

      #swagger.responses[401] = {
        description: 'Invalid username or password',
        schema: {
          success: 0,
          data: [],
          message: "Invalid username or password"
        }
      }

      #swagger.responses[403] = {
        description: 'Admin account is inactive',
        schema: {
          success: 0,
          data: [],
          message: "Your account is inactive"
        }
      }

      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */

  DashController.loginAdmin,
);

router.get("/auth/me", DashController.getCurrentAdmin);

router.post("/logout", DashController.logoutAdmin);

router.put(
  "/status",
  /*
    #swagger.tags = ['Admin']
    #swagger.summary = 'Update Property Status'

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        prop_id: "PABCDE123",
        status: "accepted",
        rejected_reason: ""
      }
    }

    #swagger.responses[200] = {
      description: 'Property status updated successfully'
    }

    #swagger.responses[400] = {
      description: 'Invalid request'
    }

    #swagger.responses[404] = {
      description: 'Property not found'
    }
  */
  DashController.updatePropertyStatus,
);
export default router;
