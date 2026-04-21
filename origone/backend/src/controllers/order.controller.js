import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import orderModel from "../models/order.model.js";
import crypto from "crypto";
import { razorpay } from "../services/payment.service.js";

// 🔥 helper
function findVariant(product, size, color) {
  return product.variants.find((v) => v.size === size && v.color === color);
}

// ================= CREATE PAYMENT ORDER =================
export const createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.product;

      if (!product || !product.isActive) {
        return res.status(400).json({ message: "Invalid product" });
      }

      const variant = findVariant(product, item.size, item.color);

      if (!variant || variant.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.title} out of stock`,
        });
      }

      totalAmount += product.price.amount * item.quantity;
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
    });

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= VERIFY PAYMENT + CREATE ORDER =================
export const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      address,
    } = req.body;

    // ✅ address validation
    if (!address?.fullAddress || !address?.city || !address?.pincode) {
      return res.status(400).json({
        message: "Invalid address",
      });
    }

    // ✅ duplicate payment check
    const existingOrder = await orderModel.findOne({
      razorpay_payment_id,
    });

    if (existingOrder) {
      return res.status(400).json({
        message: "Order already created",
      });
    }

    // ✅ verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      const variant = findVariant(product, item.size, item.color);

      if (!variant) {
        return res.status(400).json({
          message: `${product.title} variant not found`,
        });
      }

      // ✅ SAFE STOCK UPDATE (race condition fix)
      const updated = await productModel.updateOne(
        {
          _id: product._id,
          "variants.size": item.size,
          "variants.color": item.color,
          "variants.stock": { $gte: item.quantity },
        },
        {
          $inc: { "variants.$.stock": -item.quantity },
        },
      );

      if (updated.modifiedCount === 0) {
        return res.status(400).json({
          message: `${product.title} out of stock`,
        });
      }

      const price = variant.price || product.price.amount;

      totalAmount += price * item.quantity;

      // ✅ snapshot fix (image.url)
      orderItems.push({
        product: product._id,
        title: product.title,
        image: product.images?.[0]?.url || "",
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price,
        seller: product.seller,
      });
    }

    const order = await orderModel.create({
      user: userId,
      items: orderItems,
      totalAmount,
      paymentStatus: "paid",
      paymentMethod: "razorpay",

      // ✅ SAVE RAZORPAY DATA
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      address,
    });

    // ✅ clear cart
    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: "Payment successful & order created",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET MY ORDERS =================
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await orderModel
      .find({ user: userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET SELLER ORDERS =================
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders = await orderModel
      .find({ "items.seller": sellerId })
      .populate("user", "fullname email contact")
      .sort({ createdAt: -1 });

    const filteredOrders = orders.map((order) => {
      const items = order.items.filter(
        (item) => item.seller.toString() === sellerId.toString(),
      );

      return {
        ...order._doc,
        items,
      };
    });

    res.json({ success: true, orders: filteredOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE ORDER STATUS =================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isSeller = order.items.some(
      (item) => item.seller.toString() === req.user._id.toString(),
    );

    if (!isSeller) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const validFlow = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["shipped"],
      shipped: ["delivered"],
      delivered: ["returned"],
      returned: [],
      cancelled: [],
    };

    if (!validFlow[order.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${order.status} to ${status}`,
      });
    }

    order.status = status;

    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
