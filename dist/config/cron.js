"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const plan_model_1 = require("../models/plan.model");
node_cron_1.default.schedule("0 0 * * *", async () => {
    try {
        const result = await plan_model_1.PlanModel.expireProperties();
        if (result.affectedRows > 0) {
            console.log(`[PROPERTY EXPIRY] ${result.affectedRows} properties expired`);
        }
    }
    catch (error) {
        console.error("[PROPERTY EXPIRY ERROR]", error);
    }
});
