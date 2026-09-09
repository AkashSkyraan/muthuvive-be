import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ValidationError } from "../types/global.types";
import Joi from "joi";
import db from "../config/db";
import { Response } from "express";

export const validateRequest = (data: any, schema: Joi.ObjectSchema): any => {
  const { error, value } = schema.validate(data, {
    abortEarly: true,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((err) => err.message).join(", ");

    const errorObject: ValidationError = new Error("Validation Error");
    errorObject.status = 200;
    errorObject.errors = errorMessages;

    throw errorObject;
  }

  return value;
};

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: number,
  data: any = [],
  message: string = "",
  error: any = [],
) => {
  return res.status(statusCode).json({
    success,
    data,
    message,
    error,
  });
};

export async function executeQuery(
  sql: string,
  params: Record<string, any> = {},
): Promise<any> {
  try {
    const [results] = await db.query(sql, params);
    return results;
  } catch (error) {
    throw error;
  }
}

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getOtpExpiry = (): Date => {
  const expirySeconds = process.env.NODE_ENV === "devlopment" ? 30 : 180;
  return new Date(Date.now() + expirySeconds * 1000);
};

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: number) => {
  return jwt.sign({ user_id: userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};
