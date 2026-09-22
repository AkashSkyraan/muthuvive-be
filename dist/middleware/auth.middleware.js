"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;
        const token = bearerToken || req.cookies?.access_token;
        if (!token) {
            return res.status(401).json({
                success: 0,
                message: "Unauthorized",
            });
        }
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET missing");
            return res.status(500).json({
                success: 0,
                message: "Internal Server Error",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    }
    catch (error) {
        console.log("Auth Middleware Error:", error);
        return res.status(401).json({
            success: 0,
            message: "Invalid or expired token",
        });
    }
};
exports.authMiddleware = authMiddleware;
