"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post("/request-otp", 
/*
  #swagger.tags = ['1.Auth']
  #swagger.summary = 'Request OTP'
  #swagger.description = 'Send OTP to the user's email or mobile number'

  #swagger.consumes = ['application/json']

  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      email: "user@example.com",
      mobile: "9876543210",
      purpose : 1
    }
  }

  #swagger.responses[200] = {
    description: 'OTP sent successfully'
  }

  #swagger.responses[400] = {
    description: 'Validation Error'
  }

  #swagger.responses[500] = {
    description: 'Internal Server Error'
  }
*/
auth_controller_1.AuthController.requestOTP);
router.post("/verify-otp", 
/*
  #swagger.tags = ['1.Auth']
  #swagger.summary = 'Verify OTP'
  #swagger.description = 'Verify the OTP sent to the user email or mobile number'

  #swagger.consumes = ['application/json']

  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      email: "user@example.com",
      mobile: "9876543210",
      otp: "123456",
      purpose: 1
    }
  }

  #swagger.responses[200] = {
    description: 'OTP verified successfully',
    schema: {
      success: true,
      data: [],
      message: 'OTP verified successfully'
    }
  }

  #swagger.responses[400] = {
    description: 'Invalid or expired OTP'
  }

  #swagger.responses[500] = {
    description: 'Internal Server Error'
  }
*/
auth_controller_1.AuthController.verifyOTP);
router.post("/signup", 
/*
  #swagger.tags = ['1.Auth']
  #swagger.summary = 'User Signup'
  #swagger.description = 'Create a new user account after verifying email or mobile OTP'

  #swagger.consumes = ['application/json']

  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      user_name: "Kamalesh",
      email: "user@example.com",
      mobile: "9876543210",
      password: "Skyraan@123"
    }
  }

  #swagger.responses[201] = {
    description: 'Signup successful',
    schema: {
      success: true,
      data: [
        {
          id: 1,
          user_name: "Kamalesh",
          email: "user@example.com",
          mobile: "9876543210"
        }
      ],
      message: "Signup successful"
    }
  }

  #swagger.responses[400] = {
    description: 'OTP verification required or validation error'
  }

  #swagger.responses[409] = {
    description: 'User already exists'
  }

  #swagger.responses[500] = {
    description: 'Internal Server Error'
  }
*/
auth_controller_1.AuthController.signup);
router.post("/login", 
/*
  #swagger.tags = ['1.Auth']
  #swagger.summary = 'User Login'
  #swagger.description = 'Login using email or mobile number and password'

  #swagger.consumes = ['application/json']

  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      email: "user@example.com",
      mobile: "9876543210",
      password: "Skyraan@123"
    }
  }

  #swagger.responses[200] = {
    description: 'Login successful',
    schema: {
      success: true,
      data: [
        {
          id: 1,
          user_name: "Kamalesh",
          email: "user@example.com",
          mobile: "9876543210"
        }
      ],
      message: "Login successful"
    }
  }

  #swagger.responses[400] = {
    description: 'Invalid email/mobile or password'
  }

  #swagger.responses[400] = {
    description: 'User account is inactive'
  }

  #swagger.responses[400] = {
    description: 'Validation Error'
  }

  #swagger.responses[500] = {
    description: 'Internal Server Error'
  }
*/
auth_controller_1.AuthController.login);
router.post("/reset-password", 
/*
  #swagger.tags = ['1.Auth']
  #swagger.summary = 'Reset Password'
  #swagger.description = 'Reset user password using email or mobile number'

  #swagger.consumes = ['application/json']

  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      email: "user@example.com",
      mobile: "9876543210",
      password: "Skyraan@123"
    }
  }

  #swagger.responses[200] = {
    description: 'Password reset successfully',
    schema: {
      success: true,
      data: [],
      message: "Password reset successfully"
    }
  }

  #swagger.responses[400] = {
    description: 'User not found or validation error'
  }

  #swagger.responses[500] = {
    description: 'Internal Server Error'
  }
*/
auth_controller_1.AuthController.resetPassword);
router.post("/logout", auth_controller_1.AuthController.logout);
router.post("/verify-password", 
/*
  #swagger.tags = ['1.Auth']
  #swagger.summary = 'Verify Current Password'
  #swagger.description = 'Verify whether the provided password matches the user current password'

  #swagger.consumes = ['application/json']

  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      user_id: 123,
      password: "Skyraan@123"
    }
  }

  #swagger.responses[200] = {
    description: 'Password verified successfully',
    schema: {
      success: true,
      data: [],
      message: "Password verified successfully"
    }
  }

  #swagger.responses[400] = {
    description: 'User ID and password are required'
  }

  #swagger.responses[401] = {
    description: 'Current password is incorrect'
  }

  #swagger.responses[404] = {
    description: 'User not found'
  }

  #swagger.responses[500] = {
    description: 'Internal Server Error'
  }
*/
auth_controller_1.AuthController.verifyPassword);
exports.default = router;
