import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    req.user = { id: decoded.id };

    next();
  } catch (error) {
    console.log("Auth Middleware Error:", error);

    return res.status(401).json({
      success: 0,
      message: "Invalid or expired token",
    });
  }
};