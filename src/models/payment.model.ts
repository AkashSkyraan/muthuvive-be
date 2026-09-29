import crypto from "crypto";
import {
  CreatePaymentOrderData,
  VerifyPaymentData,
} from "../types/payment.types";
import { executeQuery } from "../utils/helper";
import razorpay from "../config/payment";

export class PaymentModel {
  static async createOrder(data: CreatePaymentOrderData) {
    const { user_id, prop_id, plan_id } = data;

    const planRows: any[] = await executeQuery(
      `
      SELECT
        id,
        new_amount
      FROM prop_plans
      WHERE id = ?
      LIMIT 1
      `,
      [plan_id],
    );

    if (!planRows.length) {
      throw new Error("Plan not found");
    }

    const plan = planRows[0];

    const amount = Number(plan.new_amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Invalid plan amount");
    }

    // Razorpay expects amount in paise
    const amountInPaise = Math.round(amount * 100);

    // -------------------------------------------------------
    // 2. Check property exists / belongs to user
    // -------------------------------------------------------

    const propertyRows: any[] = await executeQuery(
      `
      SELECT
        prop_id
      FROM prop_form
      WHERE prop_id = ?
        AND user_id = ?
      LIMIT 1
      `,
      [prop_id, user_id],
    );

    if (!propertyRows.length) {
      throw new Error("Property not found or unauthorized");
    }

    const receipt = `prop_${prop_id}_${user_id}_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        user_id: String(user_id),
        prop_id,
        plan_id: String(plan_id),
      },
    });

    // -------------------------------------------------------
    // 5. Save payment record
    // -------------------------------------------------------

    await executeQuery(
      `
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
      `,
      [user_id, prop_id, plan_id, order.id, amountInPaise, "INR", "created"],
    );

    return {
      order_id: order.id,
      amount: amountInPaise,
      currency: "INR",
      key_id: process.env.RAZORPAY_KEY_ID,
    };
  }

  static async verifyPayment(data: VerifyPaymentData) {
    const {
      user_id,
      prop_id,
      plan_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = data;

    // -------------------------------------------------------
    // 1. Get payment from DB
    // -------------------------------------------------------

    const paymentRows: any[] = await executeQuery(
      `
      SELECT
        *
      FROM payments
      WHERE razorpay_order_id = ?
        AND user_id = ?
        AND prop_id = ?
        AND plan_id = ?
      LIMIT 1
      `,
      [razorpay_order_id, user_id, prop_id, plan_id],
    );

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

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${payment.razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // -------------------------------------------------------
    // 4. Compare signature safely
    // -------------------------------------------------------

    const generatedBuffer = Buffer.from(generatedSignature);
    const receivedBuffer = Buffer.from(razorpay_signature);

    if (
      generatedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(generatedBuffer, receivedBuffer)
    ) {
      throw new Error("Invalid payment signature");
    }

    // -------------------------------------------------------
    // 5. Verify amount from DB
    // -------------------------------------------------------

    const expectedAmount = Number(payment.amount);

    // -------------------------------------------------------
    // 6. Update payment
    // -------------------------------------------------------

    await executeQuery(
      `
      UPDATE payments
      SET
        razorpay_payment_id = ?,
        razorpay_signature = ?,
        status = 'paid',
        purchased_at = NOW(),
        updated_at = NOW()
      WHERE id = ?
      `,
      [razorpay_payment_id, razorpay_signature, payment.id],
    );

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

  static async getPayment(data: {
    user_id: number;
    razorpay_order_id: string;
  }) {
    const { user_id, razorpay_order_id } = data;

    const rows: any[] = await executeQuery(
      `
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
      `,
      [user_id, razorpay_order_id],
    );

    return rows[0] || null;
  }

  static async markWebhookPaid(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
  }) {
    const { razorpay_order_id, razorpay_payment_id } = data;

    await executeQuery(
      `
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
    `,
      [razorpay_payment_id, razorpay_order_id],
    );
  }

  static async markWebhookFailed(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
  }) {
    const { razorpay_order_id, razorpay_payment_id } = data;

    await executeQuery(
      `
    UPDATE payments
    SET
      razorpay_payment_id = ?,
      status = 'failed',
      updated_at = NOW()
    WHERE razorpay_order_id = ?
      AND status <> 'paid'
    `,
      [razorpay_payment_id, razorpay_order_id],
    );
  }
}
