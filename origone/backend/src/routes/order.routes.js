import express from "express";
import {
  authenticateUser,
  authenticateSeller,
} from "../middlewares/auth.middleware.js";
import {
  getMyOrders,
  updateOrderStatus,
  getSellerRevenue,
  createPaymentOrder,
  verifyPaymentAndCreateOrder,
  getSellerOrders,
  getSellerDashboard,
} from "../controllers/order.controller.js";

const router = express.Router();

// Buyer
router.get("/my-orders", authenticateUser, getMyOrders);
router.post("/create-payment", authenticateUser, createPaymentOrder);
router.post("/verify-payment", authenticateUser, verifyPaymentAndCreateOrder);

// Seller
router.put("/:orderId/status", authenticateSeller, updateOrderStatus);
router.get("/seller/revenue", authenticateSeller, getSellerRevenue);
router.get("/seller/orders", authenticateSeller, getSellerOrders);
router.get("/seller/dashboard", authenticateSeller, getSellerDashboard);

export default router;
