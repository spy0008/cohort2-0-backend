import express from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getSellerDashboard,
  getSellerProducts,
  getSellerRevenue,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validator/product.validator.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

const router = express.Router();

/**
 * @route POST /api/products
 * @description Create a new product
 * @access Private (Seller only)
 */
router.post(
  "/",
  authenticateSeller,
  upload.any(),
  createProductValidator,
  createProduct,
);

/**
 * @route GET /api/products/seller
 * @description Get all products of the authenticated seller
 * @access Private (Seller only)
 */
router.get("/seller", authenticateSeller, getSellerProducts);

/**
 * @route GET /api/products
 * @description Get products
 * @access Public
 */
router.get("/", getProducts);

router.put("/:id", authenticateSeller, upload.any(), updateProduct);

router.delete("/:id", authenticateSeller, deleteProduct);

router.get("/seller/revenue", authenticateSeller, getSellerRevenue);
router.get("/seller/dashboard", authenticateSeller, getSellerDashboard);

/**
 * @route GET /api/products/:productId
 * @description Get single product
 * @access Public
 */
router.get("/:id", getSingleProduct);

export default router;
