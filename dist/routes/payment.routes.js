"use strict";
// import { Router } from "express";
// import PaymentController from "../controllers/payment.controller";
// const router = Router();
// router.post(
//   "/create-order",
//   /*
//     #swagger.tags = ['4.Payment']
//     #swagger.summary = 'Create Razorpay Order'
//     #swagger.description = 'Create a Razorpay payment order for purchasing a property plan'
//     #swagger.parameters['body'] = {
//       in: 'body',
//       required: true,
//       schema: {
//         user_id: 1,
//         prop_id: 'PC5QZo055',
//         plan_id: 1
//       }
//     }
//     #swagger.responses[200] = {
//       description: 'Razorpay order created successfully'
//     }
//     #swagger.responses[400] = {
//       description: 'Invalid request'
//     }
//     #swagger.responses[500] = {
//       description: 'Internal Server Error'
//     }
//   */
//   PaymentController.createOrder,
// );
// // router.post(
// //   "/verify",
// //   /*
// //     #swagger.tags = ['4.Payment']
// //     #swagger.summary = 'Verify Razorpay Payment'
// //     #swagger.description = 'Verify Razorpay payment signature and activate the purchased property plan'
// //     #swagger.parameters['body'] = {
// //       in: 'body',
// //       required: true,
// //       schema: {
// //         user_id: 1,
// //         prop_id: 'PC5QZo055',
// //         plan_id: 1,
// //         razorpay_order_id: 'order_xxxxxxxxx',
// //         razorpay_payment_id: 'pay_xxxxxxxxx',
// //         razorpay_signature: 'xxxxxxxxxxxxxxxx'
// //       }
// //     }
// //     #swagger.responses[200] = {
// //       description: 'Payment verified successfully'
// //     }
// //     #swagger.responses[400] = {
// //       description: 'Payment verification failed'
// //     }
// //     #swagger.responses[500] = {
// //       description: 'Internal Server Error'
// //     }
// //   */
// //   PaymentController.verifyPayment,
// // );
// // router.get(
// //   "/get-payment",
// //   /*
// //     #swagger.tags = ['4.Payment']
// //     #swagger.summary = 'Get Payment'
// //     #swagger.description = 'Get payment details using Razorpay order ID'
// //     #swagger.parameters['razorpay_order_id'] = {
// //       in: 'query',
// //       required: true,
// //       type: 'string',
// //       example: 'order_xxxxxxxxx',
// //       description: 'Razorpay Order ID'
// //     }
// //     #swagger.responses[200] = {
// //       description: 'Payment fetched successfully'
// //     }
// //     #swagger.responses[404] = {
// //       description: 'Payment not found'
// //     }
// //     #swagger.responses[500] = {
// //       description: 'Internal Server Error'
// //     }
// //   */
// //   PaymentController.getPayment,
// // );
// export default router;
