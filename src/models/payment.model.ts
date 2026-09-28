

// import pool from "../config/db";
// import razorpay from "../config/payment";
// import { executeQuery } from "../utils/helper";


// class PaymentModule {
 
//   static async createOrder(data: {
//     user_id: number;
//     prop_id: string;
//     plan_id: number;
//   }) {
//     const { user_id, prop_id, plan_id } = data;

    
//     const planQuery = `
//       SELECT
//         id,
//         name,
//         price,
//         duration
//       FROM plans
//       WHERE id = ?
//         AND status = 'active'
//       LIMIT 1
//     `;

//     const plans: any[] = await executeQuery(planQuery, [plan_id]);

//     if (!plans.length) {
//       throw new Error("Plan not found or inactive");
//     }

//     const plan = plans[0];

    
//     const propertyQuery = `
//       SELECT
//         prop_id,
//         user_id,
//         prop_name
//       FROM prop_form
//       WHERE prop_id = ?
//         AND user_id = ?
//       LIMIT 1
//     `;

//     const properties: any[] = await executeQuery(propertyQuery, [
//       prop_id,
//       user_id,
//     ]);

//     if (!properties.length) {
//       throw new Error("Property not found for this user");
//     }

//     const amount = Math.round(Number(plan.price) * 100);

//     if (!amount || amount <= 0) {
//       throw new Error("Invalid plan amount");
//     }

//     const receipt = `PROP_${prop_id}_${Date.now()}`;

//     const razorpayOrder = await razorpay.orders.create({
//       amount,
//       currency: "INR",
//       receipt,
//       notes: {
//         user_id: String(user_id),
//         prop_id,
//         plan_id: String(plan_id),
//       },
//     });

    
//     const insertQuery = `
//       INSERT INTO payments (
//         user_id,
//         prop_id,
//         plan_id,
//         razorpay_order_id,
//         amount,
//         currency,
//         status
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?)
//     `;

//     await executeQuery(insertQuery, [
//       user_id,
//       prop_id,
//       plan_id,
//       razorpayOrder.id,
//       Number(plan.price),
//       "INR",
//       "created",
//     ]);

//     return {
//       order_id: razorpayOrder.id,
//       amount: Number(plan.price),
//       amount_paise: amount,
//       currency: "INR",

//       key_id: process.env.RAZORPAY_KEY_ID,

//       plan: {
//         id: plan.id,
//         name: plan.name,
//         price: Number(plan.price),
//         duration: plan.duration,
//       },

//       property: {
//         prop_id,
//         prop_name: properties[0].prop_name,
//       },
//     };
//   }

//   /**
//    * Verify Razorpay Payment
//    */
//   static async verifyPayment(data: {
//     user_id: number;
//     prop_id: string;
//     plan_id: number;

//     razorpay_order_id: string;
//     razorpay_payment_id: string;
//     razorpay_signature: string;
//   }) {
//     const {
//       user_id,
//       prop_id,
//       plan_id,
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     } = data;

//     /**
//      * Get payment
//      */
//     const paymentQuery = `
//       SELECT
//         id,
//         user_id,
//         prop_id,
//         plan_id,
//         amount,
//         status
//       FROM payments
//       WHERE razorpay_order_id = ?
//         AND user_id = ?
//         AND prop_id = ?
//         AND plan_id = ?
//       LIMIT 1
//     `;

//     const payments: any[] = await executeQuery(paymentQuery, [
//       razorpay_order_id,
//       user_id,
//       prop_id,
//       plan_id,
//     ]);

//     if (!payments.length) {
//       throw new Error("Payment order not found");
//     }

//     const payment = payments[0];

//     /**
//      * Verify Razorpay signature
//      */
//     const generatedSignature = crypto
//       .createHmac(
//         "sha256",
//         process.env.RAZORPAY_KEY_SECRET as string,
//       )
//       .update(
//         `${razorpay_order_id}|${razorpay_payment_id}`,
//       )
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature) {
//       throw new Error("Invalid payment signature");
//     }

//     /**
//      * Already paid?
//      */
//     if (payment.status === "paid") {
//       return {
//         already_paid: true,
//         payment_id: payment.id,
//       };
//     }

   
//     const connection = await pool.getConnection();

//     try {
//       await connection.beginTransaction();

    
//       await connection.query(
//         `
//           UPDATE payments
//           SET
//             razorpay_payment_id = ?,
//             razorpay_signature = ?,
//             status = 'paid',
//             purchased_at = NOW()
//           WHERE id = ?
//         `,
//         [
//           razorpay_payment_id,
//           razorpay_signature,
//           payment.id,
//         ],
//       );

//       /**
//        * Get plan duration
//        */
//       const [planRows]: any = await connection.query(
//         `
//           SELECT
//             id,
//             duration
//           FROM plans
//           WHERE id = ?
//           LIMIT 1
//         `,
//         [plan_id],
//       );

//       if (!planRows.length) {
//         throw new Error("Plan not found");
//       }

//       const duration = Number(planRows[0].duration) || 30;

//       await connection.query(
//         `
//           INSERT INTO prop_plans (
//             user_id,
//             prop_id,
//             plan_id,
//             purchased_at,
//             expired_at
//           )
//           VALUES (
//             ?,
//             ?,
//             ?,
//             NOW(),
//             DATE_ADD(NOW(), INTERVAL ? DAY)
//           )
//         `,
//         [
//           user_id,
//           prop_id,
//           plan_id,
//           duration,
//         ],
//       );

//       await connection.commit();

//       return {
//         already_paid: false,
//         payment_id: payment.id,
//         razorpay_order_id,
//         razorpay_payment_id,
//         prop_id,
//         plan_id,
//         status: "paid",
//       };
//     } catch (error) {
//       await connection.rollback();
//       throw error;
//     } finally {
//       connection.release();
//     }
//   }

//   /**
//    * Get payment by order ID
//    */
//   static async getPaymentByOrderId(
//     razorpay_order_id: string,
//   ) {
//     const query = `
//       SELECT
//         *
//       FROM payments
//       WHERE razorpay_order_id = ?
//       LIMIT 1
//     `;

//     const result: any[] = await executeQuery(query, [
//       razorpay_order_id,
//     ]);

//     return result[0] || null;
//   }
// }

// export default PaymentModule;