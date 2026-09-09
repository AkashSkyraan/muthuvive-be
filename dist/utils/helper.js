"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeJSONParse = exports.generateToken = exports.comparePassword = exports.hashPassword = exports.getOtpExpiry = exports.generateOtp = exports.sendResponse = exports.validateRequest = void 0;
exports.executeQuery = executeQuery;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
const validateRequest = (data, schema) => {
    const { error, value } = schema.validate(data, {
        abortEarly: true,
        allowUnknown: true,
    });
    if (error) {
        const errorMessages = error.details.map((err) => err.message).join(", ");
        const errorObject = new Error("Validation Error");
        errorObject.status = 200;
        errorObject.errors = errorMessages;
        throw errorObject;
    }
    return value;
};
exports.validateRequest = validateRequest;
const sendResponse = (res, statusCode, success, data = [], message = "", error = []) => {
    return res.status(statusCode).json({
        success,
        data,
        message,
        error,
    });
};
exports.sendResponse = sendResponse;
async function executeQuery(sql, params = {}) {
    try {
        const [results] = await db_1.default.query(sql, params);
        return results;
    }
    catch (error) {
        throw error;
    }
}
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOtp = generateOtp;
const getOtpExpiry = () => {
    const expirySeconds = process.env.NODE_ENV === "devlopment" ? 30 : 180;
    return new Date(Date.now() + expirySeconds * 1000);
};
exports.getOtpExpiry = getOtpExpiry;
const SALT_ROUNDS = 10;
const hashPassword = async (password) => {
    return bcryptjs_1.default.hash(password, SALT_ROUNDS);
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hashedPassword) => {
    return bcryptjs_1.default.compare(password, hashedPassword);
};
exports.comparePassword = comparePassword;
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ user_id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
exports.generateToken = generateToken;
const safeJSONParse = (value) => {
    try {
        return value ? JSON.parse(value) : [];
    }
    catch {
        return [];
    }
};
exports.safeJSONParse = safeJSONParse;
