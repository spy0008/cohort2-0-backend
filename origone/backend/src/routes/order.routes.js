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
  getOrderById,
} from "../controllers/order.controller.js";

const router = express.Router();

// Buyer
router.get("/my-orders", authenticateUser, getMyOrders);
router.post("/create-payment", authenticateUser, createPaymentOrder);
router.post("/verify-payment", authenticateUser, verifyPaymentAndCreateOrder);
router.get("/:id", authenticateUser, getOrderById);

// Seller
router.put("/:orderId/status", authenticateSeller, updateOrderStatus);
router.get("/seller/orders", authenticateSeller, getSellerOrders);

export default router;
