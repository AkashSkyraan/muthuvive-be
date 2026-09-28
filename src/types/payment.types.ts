export interface CreatePaymentOrderData {
  user_id: number;
  prop_id: string;
  plan_id: number;
}

export interface VerifyPaymentData {
  user_id: number;
  prop_id: string;
  plan_id: number;

  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}