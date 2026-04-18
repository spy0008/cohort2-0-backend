import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/", authenticateUser, addToCart);

router.get("/", authenticateUser, getCart);

router.put("/", authenticateUser, updateCartItem);

router.delete("/:productId", authenticateUser, removeFromCart);

router.delete("/", authenticateUser, clearCart);

export default router;
