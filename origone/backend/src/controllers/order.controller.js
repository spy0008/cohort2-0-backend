import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import orderModel from "../models/order.model.js";
import crypto from "crypto";
import { razorpay } from "../services/payment.service.js";

export const verifyPaymentAndCreateOrder = async (req, res) => {
  const userId = req.user._id;

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    address,
  } = req.body;

  const existingOrder = await orderModel.findOne({
    razorpayPaymentId: razorpay_payment_id,
  });

  if (existingOrder) {
    return res.json({ success: true, order: existingOrder });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  const cart = await cartModel
    .findOne({ user: userId })
    .populate("items.product");

  let totalAmount = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;

    totalAmount += product.price.amount * item.quantity;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price.amount,
    });

    // 🔥 reduce stock
    const updated = await productModel.findOneAndUpdate(
      {
        _id: product._id,
        stock: { $gte: item.quantity },
      },
      {
        $inc: { stock: -item.quantity },
      },
      { new: true },
    );

    if (!updated) {
      return res.status(400).json({
        message: `${product.title} went out of stock`,
      });
    }
  }

  const order = await orderModel.create({
    user: userId,
    items: orderItems,
    totalAmount,
    paymentStatus: "paid",
    address,
  });

  cart.items = [];
  await cart.save();

  res.json({
    success: true,
    message: "Payment successful & order created",
    order,
  });
};

export const createPaymentOrder = async (req, res) => {
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
      return res.status(400).json({ message: "Invalid product in cart" });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({
        message: `${product.title} out of stock`,
      });
    }

    totalAmount += product.price.amount * item.quantity;
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: totalAmount * 100, // paisa
    currency: "INR",
  });

  res.json({
    success: true,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
  });
};

export const getMyOrders = async (req, res) => {
  const userId = req.user._id;

  const orders = await orderModel
    .find({ user: userId })
    .populate("items.product")
    .sort({ createdAt: -1 });

  res.json({ success: true, orders });
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await orderModel.findById(orderId).populate("items.product");

  const isSellerOrder = order.items.some(
    (item) => item.product.seller.toString() === req.user._id.toString(),
  );

  if (!isSellerOrder) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const allowedStatuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  order.status = status;

  await order.save();

  res.json({ success: true, order });
};

export const getSellerRevenue = async (req, res) => {
  const sellerId = req.user._id;

  const result = await orderModel.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $match: {
        "product.seller": sellerId,
      },
    },
    {
      $group: {
        _id: null,
        revenue: {
          $sum: {
            $multiply: ["$items.quantity", "$items.price"],
          },
        },
      },
    },
  ]);

  res.json({
    success: true,
    revenue: result[0]?.revenue || 0,
  });
};

export const getSellerOrders = async (req, res) => {
  const sellerId = req.user._id;

  const orders = await orderModel
    .find({
      "items.product": {
        $exists: true,
      },
    })
    .populate({
      path: "items.product",
      match: { seller: sellerId },
    })
    .sort({ createdAt: -1 });

  const filteredOrders = orders
    .map((order) => {
      const items = order.items.filter((item) => item.product !== null);
      if (items.length === 0) return null;

      return {
        ...order._doc,
        items,
      };
    })
    .filter(Boolean);

  res.json({ success: true, orders: filteredOrders });
};

export const getSellerDashboard = async (req, res) => {
  const sellerId = req.user._id;

  const products = await productModel.countDocuments({
    seller: sellerId,
  });

  const orders = await orderModel.countDocuments({
    "items.product": {
      $exists: true,
    },
  });

  res.json({
    success: true,
    stats: {
      totalProducts: products,
      totalOrders: orders,
    },
  });
};
