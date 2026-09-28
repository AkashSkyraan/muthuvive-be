// import { Request, Response } from "express";
// import PaymentModule from "../models/payment.model";
// import { sendResponse } from "../utils/helper";

// class PaymentController {
//   static async createOrder(req: Request, res: Response) {
//     try {
//       const { user_id, prop_id, plan_id } = req.body;

//       if (!user_id || !prop_id || !plan_id) {
//         return sendResponse(
//           res,
//           400,
//           0,
//           [],
//           "user_id, prop_id and plan_id are required",
//           [],
//         );
//       }

//       const result = await PaymentModule.createOrder({
//         user_id: Number(user_id),
//         prop_id: String(prop_id),
//         plan_id: Number(plan_id),
//       });

//       return sendResponse(
//         res,
//         200,
//         1,
//         [result],
//         "Razorpay order created successfully",
//         [],
//       );
//     } catch (error: any) {
//       console.error("Create Razorpay order error:", error);

//       return sendResponse(
//         res,
//         500,
//         0,
//         [],
//         error.message || "Internal server error",
//         [],
//       );
//     }
//   }


// //   static async verifyPayment(req: Request, res: Response) {
// //     try {
// //       const {
// //         user_id,
// //         prop_id,
// //         plan_id,
// //         razorpay_order_id,
// //         razorpay_payment_id,
// //         razorpay_signature,
// //       } = req.body;

// //       if (
// //         !user_id ||
// //         !prop_id ||
// //         !plan_id ||
// //         !razorpay_order_id ||
// //         !razorpay_payment_id ||
// //         !razorpay_signature
// //       ) {
// //         return sendResponse(
// //           res,
// //           400,
// //           0,
// //           [],
// //           "Payment verification fields are required",
// //           [],
// //         );
// //       }

// //       const result = await PaymentModule.verifyPayment({
// //         user_id: Number(user_id),
// //         prop_id: String(prop_id),
// //         plan_id: Number(plan_id),

// //         razorpay_order_id: String(razorpay_order_id),

// //         razorpay_payment_id: String(razorpay_payment_id),

// //         razorpay_signature: String(razorpay_signature),
// //       });

// //       return sendResponse(res, 200, 1,[result], "Payment verified successfully", []);
// //     } catch (error: any) {
// //       console.error("Verify Razorpay payment error:", error);

// //       return sendResponse(
// //         res,
// //         400,
// //         0,
// //         [],
// //         error.message || "Payment verification failed",
// //         [],
// //       );
// //     }
// //   }

  
// //   static async getPayment(req: Request, res: Response) {
// //     try {
// //       const { razorpay_order_id } = req.query;

// //       if (!razorpay_order_id) {
// //         return sendResponse(res, 400, 0, "razorpay_order_id is required", null);
// //       }

// //       const result = await PaymentModule.getPaymentByOrderId(
// //         String(razorpay_order_id),
// //       );

// //       if (!result) {
// //         return sendResponse(res, 404, 0, "Payment not found", null);
// //       }

// //       return sendResponse(res, 200, 1, "Payment fetched successfully", result);
// //     } catch (error) {
// //       console.error("Get payment error:", error);

// //       return sendResponse(res, 500, 0, "Internal server error", null);
// //     }
// //   }
// }

// export default PaymentController;
