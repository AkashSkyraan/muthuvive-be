import { Router } from "express";
import PaymentController from "../controllers/payment.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/create-order", authMiddleware, PaymentController.createOrder);

router.post("/verify", authMiddleware, PaymentController.verifyPayment);

router.get("/get-payment", authMiddleware, PaymentController.getPayment);

router.post("/webhook", authMiddleware, PaymentController.webhook);
export default router;
