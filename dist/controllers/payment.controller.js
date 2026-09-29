"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const helper_1 = require("../utils/helper");
const payment_model_1 = require("../models/payment.model");
class PaymentController {
    // =========================================================
    // CREATE ORDER
    // =========================================================
    static async createOrder(req, res) {
        try {
            const user_id = Number(req.user?.id);
            const { prop_id, plan_id } = req.body;
            if (!user_id) {
                return (0, helper_1.sendResponse)(res, 401, 0, [], "Unauthorized", []);
            }
            if (!prop_id) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "Property ID is required", []);
            }
            if (!plan_id) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "Plan ID is required", []);
            }
            const data = await payment_model_1.PaymentModel.createOrder({
                user_id,
                prop_id: String(prop_id),
                plan_id: Number(plan_id),
            });
            return (0, helper_1.sendResponse)(res, 200, 1, data, "Payment order created successfully", []);
        }
        catch (error) {
            console.error("Create payment order error:", error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], error?.message || "Internal server error", []);
        }
    }
    // =========================================================
    // VERIFY PAYMENT
    // =========================================================
    static async verifyPayment(req, res) {
        try {
            const user_id = Number(req.user?.id);
            const { prop_id, plan_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, } = req.body;
            if (!user_id) {
                return (0, helper_1.sendResponse)(res, 401, 0, [], "Unauthorized", []);
            }
            if (!prop_id ||
                !plan_id ||
                !razorpay_order_id ||
                !razorpay_payment_id ||
                !razorpay_signature) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "Payment details are required", []);
            }
            const data = await payment_model_1.PaymentModel.verifyPayment({
                user_id,
                prop_id: String(prop_id),
                plan_id: Number(plan_id),
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, data, "Payment verified successfully", []);
        }
        catch (error) {
            console.error("Verify payment error:", error);
            return (0, helper_1.sendResponse)(res, 400, 0, [], error?.message || "Payment verification failed", []);
        }
    }
    // =========================================================
    // GET PAYMENT
    // =========================================================
    static async getPayment(req, res) {
        try {
            const user_id = Number(req.user?.id);
            const { razorpay_order_id } = req.query;
            if (!user_id) {
                return (0, helper_1.sendResponse)(res, 401, 0, [], "Unauthorized", []);
            }
            if (!razorpay_order_id) {
                return (0, helper_1.sendResponse)(res, 400, 0, [], "Razorpay order ID is required", []);
            }
            const data = await payment_model_1.PaymentModel.getPayment({
                user_id,
                razorpay_order_id: String(razorpay_order_id),
            });
            return (0, helper_1.sendResponse)(res, 200, 1, data, "Payment fetched successfully", []);
        }
        catch (error) {
            console.error("Get payment error:", error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal server error", []);
        }
    }
    static async webhook(req, res) {
        try {
            const signature = req.headers["x-razorpay-signature"];
            if (!signature) {
                return res.status(400).json({
                    success: false,
                    message: "Webhook signature missing",
                });
            }
            const rawBody = req.body;
            const expectedSignature = crypto_1.default
                .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
                .update(rawBody)
                .digest("hex");
            const expectedBuffer = Buffer.from(expectedSignature);
            const receivedBuffer = Buffer.from(signature);
            if (expectedBuffer.length !== receivedBuffer.length ||
                !crypto_1.default.timingSafeEqual(expectedBuffer, receivedBuffer)) {
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
                await payment_model_1.PaymentModel.markWebhookPaid({
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
                    await payment_model_1.PaymentModel.markWebhookPaid({
                        razorpay_order_id: payment.order_id,
                        razorpay_payment_id: payment.id,
                    });
                }
            }
            return res.status(200).json({
                success: true,
            });
        }
        catch (error) {
            console.error("Razorpay webhook error:", error);
            return res.status(500).json({
                success: false,
                message: "Webhook processing failed",
            });
        }
    }
}
exports.default = PaymentController;
