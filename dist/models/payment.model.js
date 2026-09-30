"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = void 0;
const crypto_1 = __importDefault(require("crypto"));
const helper_1 = require("../utils/helper");
const payment_1 = __importDefault(require("../config/payment"));
class PaymentModel {
    static async createOrder(data) {
        const { user_id, prop_id, plan_id } = data;
        const planRows = await (0, helper_1.executeQuery)(`
    SELECT
      id,
      new_amount,
      duration
    FROM plan
    WHERE id = ?
    LIMIT 1
    `, [plan_id]);
        if (!planRows.length) {
            throw new Error("Plan not found");
        }
        const plan = planRows[0];
        const amount = Number(plan.new_amount);
        const duration = Number(plan.duration);
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new Error("Invalid plan amount");
        }
        if (!Number.isFinite(duration) || duration <= 0) {
            throw new Error("Invalid plan duration");
        }
        const amountInPaise = Math.round(amount * 100);
        const propertyRows = await (0, helper_1.executeQuery)(`
    SELECT
      prop_id,
      status
    FROM prop_form
    WHERE prop_id = ?
      AND user_id = ?
    LIMIT 1
    `, [prop_id, user_id]);
        if (!propertyRows.length) {
            throw new Error("Property not found or unauthorized");
        }
        const receipt = `prop_${prop_id}_${user_id}_${Date.now()}`;
        const order = await payment_1.default.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt,
            notes: {
                user_id: String(user_id),
                prop_id,
                plan_id: String(plan_id),
                duration: String(duration),
            },
        });
        await (0, helper_1.executeQuery)(`
    INSERT INTO payments
    (
      user_id,
      prop_id,
      plan_id,
      razorpay_order_id,
      amount,
      currency,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [user_id, prop_id, plan_id, order.id, amountInPaise, "INR", "created"]);
        return {
            order_id: order.id,
            amount: amountInPaise,
            currency: "INR",
            key_id: process.env.RAZORPAY_KEY_ID,
        };
    }
    static async completePaidAndPost(data) {
        const { user_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, } = data;
        const paymentRows = await (0, helper_1.executeQuery)(`
    SELECT
      p.*,
      pl.duration
    FROM payments p
    INNER JOIN plan pl
      ON pl.id = p.plan_id
    WHERE p.razorpay_order_id = ?
      AND p.user_id = ?
    LIMIT 1
    `, [razorpay_order_id, user_id]);
        if (!paymentRows.length) {
            throw new Error("Payment order not found");
        }
        const payment = paymentRows[0];
        // Already completed
        if (payment.status === "paid") {
            return {
                alreadyPaid: true,
                payment_id: payment.razorpay_payment_id,
                order_id: payment.razorpay_order_id,
                prop_id: payment.prop_id,
                plan_id: payment.plan_id,
            };
        }
        // -----------------------------------------
        // Verify Razorpay signature
        // -----------------------------------------
        const generatedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");
        const generatedBuffer = Buffer.from(generatedSignature);
        const receivedBuffer = Buffer.from(razorpay_signature);
        if (generatedBuffer.length !== receivedBuffer.length ||
            !crypto_1.default.timingSafeEqual(generatedBuffer, receivedBuffer)) {
            throw new Error("Invalid payment signature");
        }
        // -----------------------------------------
        // Mark payment paid
        // -----------------------------------------
        await (0, helper_1.executeQuery)(`
    UPDATE payments
    SET
      razorpay_payment_id = ?,
      razorpay_signature = ?,
      status = 'paid',
      purchased_at = NOW(),
      updated_at = NOW()
    WHERE id = ?
      AND status = 'created'
    `, [razorpay_payment_id, razorpay_signature, payment.id]);
        // -----------------------------------------
        // Insert purchase history
        // -----------------------------------------
        const duration = Number(payment.duration);
        if (!duration || duration <= 0) {
            throw new Error("Invalid plan duration");
        }
        /*
         * Renewal logic:
         *
         * If current active plan exists:
         *     new expiry = current expiry + duration
         *
         * If expired/no active plan:
         *     new expiry = NOW() + duration
         */
        const activePlanRows = await (0, helper_1.executeQuery)(`
    SELECT
      expired_at
    FROM prop_plans
    WHERE prop_id = ?
      AND user_id = ?
      AND expired_at > NOW()
    ORDER BY expired_at DESC
    LIMIT 1
    `, [payment.prop_id, user_id]);
        let purchasedAt = new Date();
        let expiredAtExpression = `
    DATE_ADD(NOW(), INTERVAL ? DAY)
  `;
        let insertParams;
        if (activePlanRows.length) {
            expiredAtExpression = `
      DATE_ADD(?, INTERVAL ? DAY)
    `;
            insertParams = [
                user_id,
                payment.prop_id,
                payment.plan_id,
                activePlanRows[0].expired_at,
                duration,
            ];
        }
        else {
            insertParams = [user_id, payment.prop_id, payment.plan_id];
        }
        if (activePlanRows.length) {
            await (0, helper_1.executeQuery)(`
      INSERT INTO prop_plans
      (
        user_id,
        prop_id,
        plan_id,
        purchased_at,
        expired_at
      )
      VALUES
      (
        ?,
        ?,
        ?,
        NOW(),
        DATE_ADD(?, INTERVAL ? DAY)
      )
      `, insertParams);
        }
        else {
            await (0, helper_1.executeQuery)(`
      INSERT INTO prop_plans
      (
        user_id,
        prop_id,
        plan_id,
        purchased_at,
        expired_at
      )
      VALUES
      (
        ?,
        ?,
        ?,
        NOW(),
        DATE_ADD(NOW(), INTERVAL ? DAY)
      )
      `, [user_id, payment.prop_id, payment.plan_id, duration]);
        }
        // -----------------------------------------
        // Update property
        // -----------------------------------------
        await (0, helper_1.executeQuery)(`
    UPDATE prop_form
    SET
      status = 'posted',
      updated_at = NOW()
    WHERE prop_id = ?
      AND user_id = ?
    `, [payment.prop_id, user_id]);
        return {
            alreadyPaid: false,
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
            prop_id: payment.prop_id,
            plan_id: payment.plan_id,
            status: "posted",
        };
    }
    static async verifyPayment(data) {
        const { user_id, prop_id, plan_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, } = data;
        // -------------------------------------------------------
        // 1. Get payment from DB
        // -------------------------------------------------------
        const paymentRows = await (0, helper_1.executeQuery)(`
      SELECT
        *
      FROM payments
      WHERE razorpay_order_id = ?
        AND user_id = ?
        AND prop_id = ?
        AND plan_id = ?
      LIMIT 1
      `, [razorpay_order_id, user_id, prop_id, plan_id]);
        if (!paymentRows.length) {
            throw new Error("Payment order not found");
        }
        const payment = paymentRows[0];
        // -------------------------------------------------------
        // 2. Prevent duplicate processing
        // -------------------------------------------------------
        if (payment.status === "paid") {
            return {
                success: true,
                alreadyPaid: true,
                payment_id: payment.razorpay_payment_id,
            };
        }
        // -------------------------------------------------------
        // 3. Generate signature
        // -------------------------------------------------------
        const generatedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${payment.razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");
        // -------------------------------------------------------
        // 4. Compare signature safely
        // -------------------------------------------------------
        const generatedBuffer = Buffer.from(generatedSignature);
        const receivedBuffer = Buffer.from(razorpay_signature);
        if (generatedBuffer.length !== receivedBuffer.length ||
            !crypto_1.default.timingSafeEqual(generatedBuffer, receivedBuffer)) {
            throw new Error("Invalid payment signature");
        }
        // -------------------------------------------------------
        // 5. Verify amount from DB
        // -------------------------------------------------------
        const expectedAmount = Number(payment.amount);
        // -------------------------------------------------------
        // 6. Update payment
        // -------------------------------------------------------
        await (0, helper_1.executeQuery)(`
      UPDATE payments
      SET
        razorpay_payment_id = ?,
        razorpay_signature = ?,
        status = 'paid',
        purchased_at = NOW(),
        updated_at = NOW()
      WHERE id = ?
      `, [razorpay_payment_id, razorpay_signature, payment.id]);
        return {
            success: true,
            alreadyPaid: false,
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
            amount: expectedAmount,
            currency: payment.currency,
            status: "paid",
        };
    }
    static async getPayment(data) {
        const { user_id, razorpay_order_id } = data;
        const rows = await (0, helper_1.executeQuery)(`
      SELECT
        id,
        user_id,
        prop_id,
        plan_id,
        razorpay_order_id,
        razorpay_payment_id,
        amount,
        currency,
        status,
        purchased_at,
        created_at,
        updated_at
      FROM payments
      WHERE user_id = ?
        AND razorpay_order_id = ?
      LIMIT 1
      `, [user_id, razorpay_order_id]);
        return rows[0] || null;
    }
    static async markWebhookPaid(data) {
        const { razorpay_order_id, razorpay_payment_id } = data;
        await (0, helper_1.executeQuery)(`
    UPDATE payments
    SET
      razorpay_payment_id = ?,
      status = 'paid',
      purchased_at = COALESCE(
        purchased_at,
        NOW()
      ),
      updated_at = NOW()
    WHERE razorpay_order_id = ?
      AND status <> 'paid'
    `, [razorpay_payment_id, razorpay_order_id]);
    }
    static async markWebhookFailed(data) {
        const { razorpay_order_id, razorpay_payment_id } = data;
        await (0, helper_1.executeQuery)(`
    UPDATE payments
    SET
      razorpay_payment_id = ?,
      status = 'failed',
      updated_at = NOW()
    WHERE razorpay_order_id = ?
      AND status <> 'paid'
    `, [razorpay_payment_id, razorpay_order_id]);
    }
}
exports.PaymentModel = PaymentModel;
