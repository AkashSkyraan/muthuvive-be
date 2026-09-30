"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = __importDefault(require("../controllers/payment.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/create-order", auth_middleware_1.authMiddleware, payment_controller_1.default.createOrder);
router.post("/verify", auth_middleware_1.authMiddleware, payment_controller_1.default.verifyPayment);
router.get("/get-payment", auth_middleware_1.authMiddleware, payment_controller_1.default.getPayment);
router.post("/webhook", auth_middleware_1.authMiddleware, payment_controller_1.default.webhook);
exports.default = router;
