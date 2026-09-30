import { Request, Response } from "express";
import crypto from "crypto";
import { sendResponse } from "../utils/helper";
import { PaymentModel } from "../models/payment.model";

class PaymentController {
  // =========================================================
  // CREATE ORDER
  // =========================================================

  static async createOrder(req: Request, res: Response) {
    try {
      const user_id = Number(req.user?.id);
      console.log(user_id);
      const { prop_id, plan_id } = req.body;

      if (!user_id) {
        return sendResponse(res, 401, 0, [], "Unauthorized", []);
      }

      if (!prop_id) {
        return sendResponse(res, 400, 0, [], "Property ID is required", []);
      }

      if (!plan_id) {
        return sendResponse(res, 400, 0, [], "Plan ID is required", []);
      }

      const data = await PaymentModel.createOrder({
        user_id,
        prop_id: String(prop_id),
        plan_id: Number(plan_id),
      });

      return sendResponse(
        res,
        200,
        1,
        data,
        "Payment order created successfully",
        [],
      );
    } catch (error: any) {
      console.error("Create payment order error:", error);

      return sendResponse(
        res,
        500,
        0,
        [],
        error?.message || "Internal server error",
        [],
      );
    }
  }

  // =========================================================
  // VERIFY PAYMENT
  // =========================================================

  static async verifyPayment(req: Request, res: Response) {
    try {
      const user_id = Number(req.user?.id);

      if (!user_id) {
        return sendResponse(res, 401, 0, [], "Unauthorized", []);
      }

      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return sendResponse(
          res,
          400,
          0,
          [],
          "Payment details are required",
          [],
        );
      }

      const data = await PaymentModel.completePaidAndPost({
        user_id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      return sendResponse(
        res,
        200,
        1,
        data,
        "Payment verified and property posted successfully",
        [],
      );
    } catch (error: any) {
      console.error("Verify payment error:", error);

      return sendResponse(
        res,
        400,
        0,
        [],
        error?.message || "Payment verification failed",
        [],
      );
    }
  }

  // =========================================================
  // GET PAYMENT
  // =========================================================

  static async getPayment(req: Request, res: Response) {
    try {
      const user_id = Number(req.user?.id);

      const { razorpay_order_id } = req.query;

      if (!user_id) {
        return sendResponse(res, 401, 0, [], "Unauthorized", []);
      }

      if (!razorpay_order_id) {
        return sendResponse(
          res,
          400,
          0,
          [],
          "Razorpay order ID is required",
          [],
        );
      }

      const data = await PaymentModel.getPayment({
        user_id,
        razorpay_order_id: String(razorpay_order_id),
      });

      return sendResponse(
        res,
        200,
        1,
        data,
        "Payment fetched successfully",
        [],
      );
    } catch (error: any) {
      console.error("Get payment error:", error);

      return sendResponse(res, 500, 0, [], "Internal server error", []);
    }
  }

  static async webhook(req: Request, res: Response) {
    try {
      const signature = req.headers["x-razorpay-signature"] as string;

      if (!signature) {
        return res.status(400).json({
          success: false,
          message: "Webhook signature missing",
        });
      }

      const rawBody = req.body;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(rawBody)
        .digest("hex");

      const expectedBuffer = Buffer.from(expectedSignature);

      const receivedBuffer = Buffer.from(signature);

      if (
        expectedBuffer.length !== receivedBuffer.length ||
        !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid webhook signature",
        });
      }

      const event = JSON.parse(rawBody.toString());

      const eventName = event.event;

      console.log("Razorpay webhook:", eventName);

      // ---------------------------------------------
      // Payment captured
      // ---------------------------------------------

      if (eventName === "payment.captured") {
        const payment = event.payload?.payment?.entity;

        if (!payment) {
          return res.status(200).json({
            success: true,
          });
        }

        const razorpayPaymentId = payment.id;
        const razorpayOrderId = payment.order_id;

        await PaymentModel.markWebhookPaid({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
        });
      }

      // ---------------------------------------------
      // Payment failed
      // ---------------------------------------------

      if (eventName === "payment.failed") {
        const payment = event.payload?.payment?.entity;

        if (payment?.order_id) {
          await PaymentModel.markWebhookPaid({
            razorpay_order_id: payment.order_id,
            razorpay_payment_id: payment.id,
          });
        }
      }

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error("Razorpay webhook error:", error);

      return res.status(500).json({
        success: false,
        message: "Webhook processing failed",
      });
    }
  }
}

export default PaymentController;
