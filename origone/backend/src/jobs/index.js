import cron from "node-cron";
import { releaseWalletMoney } from "./wallet.job.js";

cron.schedule("0 * * * *", async () => {
  console.log("Running wallet release job...");
  await releaseWalletMoney();
});