import express from "express";
import {
  authenticateUser,
  authenticateSeller,
} from "../middlewares/auth.middleware.js";
import {
  getMyOrders,
  updateOrderStatus,
  createPaymentOrder,
  verifyPaymentAndCreateOrder,
  getSellerOrders,
} from "../controllers/order.controller.js";

const router = express.Router();

// Buyer
router.get("/my-orders", authenticateUser, getMyOrders);
router.post("/create-payment", authenticateUser, createPaymentOrder);
router.post("/verify-payment", authenticateUser, verifyPaymentAndCreateOrder);

// Seller
router.put("/:orderId/status", authenticateSeller, updateOrderStatus);
router.get("/seller/orders", authenticateSeller, getSellerOrders);

export default router;
