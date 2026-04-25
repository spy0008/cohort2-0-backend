import { Router } from "express";
import { getWallet, getWalletTransactions, withdraw } from "../controllers/wallet.controller";
import { authenticateSeller } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticateSeller, getWallet); // ✅ balance
router.get("/transactions", authenticateSeller, getWalletTransactions); // ✅ history
router.post("/withdraw", authenticateSeller, withdraw); // ✅ withdraw


export default router;
