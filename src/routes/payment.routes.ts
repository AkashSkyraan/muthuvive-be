import { Router } from "express";
import PaymentController from "../controllers/payment.controller";

const router = Router();

router.post("/create-order", PaymentController.createOrder);

router.post("/verify", PaymentController.verifyPayment);

router.get("/get-payment", PaymentController.getPayment);

router.post("/webhook", PaymentController.webhook);
export default router;
