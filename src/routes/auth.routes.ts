import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post("/request-otp", AuthController.requestOTP);
router.post("/verify-otp", AuthController.verifyOTP);
router.post("/signup", AuthController.signup);
export default router;
