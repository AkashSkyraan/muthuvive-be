import cron from "node-cron";
import { PlanModel } from "../models/plan.model";

cron.schedule("0 0 * * *", async () => {
  try {
    const result = await PlanModel.expireProperties();

    if (result.affectedRows > 0) {
      console.log(
        `[PROPERTY EXPIRY] ${result.affectedRows} properties expired`,
      );
    }
  } catch (error) {
    console.error("[PROPERTY EXPIRY ERROR]", error);
  }
});
