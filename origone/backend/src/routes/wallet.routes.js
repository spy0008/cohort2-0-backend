import { Router } from "express";
import { getWallet, getWalletTransactions, withdraw } from "../controllers/wallet.controller.js";
import { authenticateSeller } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticateSeller, getWallet); 
router.get("/transactions", authenticateSeller, getWalletTransactions); 
router.post("/withdraw", authenticateSeller, withdraw);


export default router;
