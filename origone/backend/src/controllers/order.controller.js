import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import orderModel from "../models/order.model.js";
import crypto from "crypto";
import { razorpay } from "../services/payment.service.js";
import walletModel from "../models/wallet.model.js";
import walletTxnModel from "../models/walletTransaction.model.js";

function findVariant(product, size, color) {
  return product.variants.find((v) => v.size === size && v.color === color);
}

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

export const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      address,
    } = req.body;

    if (!address?.fullAddress || !address?.city || !address?.pincode) {
      return res.status(400).json({
        message: "Invalid address",
      });
    }

    const existingOrder = await orderModel.findOne({
      razorpay_payment_id,
    });

    if (existingOrder) {
      return res.status(400).json({
        message: "Order already created",
      });
    }

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

      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      address,
    });

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

    if (order.paymentStatus === "refunded") {
      return res.status(400).json({ message: "Already refunded" });
    }

    if (status === "cancelled" && order.status === "delivered") {
      return res.status(400).json({
        message: "Delivered order cannot be cancelled",
      });
    }

    if (status === "returned") {
      if (order.paymentStatus === "paid") {
        await razorpay.payments.refund(order.razorpay_payment_id, {
          amount: order.totalAmount * 100,
        });

        order.paymentStatus = "refunded";
      }

      for (const item of order.items) {
        await productModel.updateOne(
          {
            _id: item.product,
            "variants.size": item.size,
            "variants.color": item.color,
          },
          {
            $inc: { "variants.$.stock": item.quantity },
          },
        );
      }

      for (const item of order.items) {
        const amount = item.price * item.quantity;

        const wallet = await walletModel.findOne({ seller: item.seller });

        if (wallet) {
          wallet.balance = Math.max(0, wallet.balance - amount);
          wallet.withdrawableBalance = Math.max(
            0,
            wallet.withdrawableBalance - amount,
          );
          await wallet.save();
        }

        await walletTxnModel.create({
          seller: item.seller,
          order: order._id,
          amount,
          type: "debit",
          status: "failed",
        });
      }
    }

    if (status === "cancelled") {
      if (order.status === "cancelled") {
        return res.status(400).json({ message: "Already cancelled" });
      }

      if (order.status === "delivered") {
        return res.status(400).json({
          message: "Delivered order cannot be cancelled",
        });
      }

      order.cancelledAt = new Date();

      if (order.paymentStatus === "paid") {
        await razorpay.payments.refund(order.razorpay_payment_id, {
          amount: order.totalAmount * 100,
        });

        order.paymentStatus = "refunded";
      }

      for (const item of order.items) {
        await productModel.updateOne(
          {
            _id: item.product,
            "variants.size": item.size,
            "variants.color": item.color,
          },
          {
            $inc: { "variants.$.stock": item.quantity },
          },
        );
      }

      for (const item of order.items) {
        const amount = item.price * item.quantity;

        const wallet = await walletModel.findOne({ seller: item.seller });

        if (wallet) {
          wallet.balance = Math.max(0, wallet.balance - amount);
          wallet.withdrawableBalance = Math.max(
            0,
            wallet.withdrawableBalance - amount,
          );

          await wallet.save();
        }

        await walletTxnModel.create({
          seller: item.seller,
          order: order._id,
          amount,
          type: "debit",
          status: "failed",
        });
      }
    }

    if (status === "delivered" && order.status !== "delivered") {
      order.deliveredAt = new Date();

      for (const item of order.items) {
        const amount = item.price * item.quantity;

        let wallet = await walletModel.findOne({ seller: item.seller });
        if (!wallet) {
          wallet = await walletModel.create({ seller: item.seller });
        }

        wallet.balance += amount;
        await wallet.save();

        await walletTxnModel.create({
          seller: item.seller,
          order: order._id,
          amount,
          type: "credit",
          status: "pending",
          availableAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        });
      }

      order.sellerPaid = true;
    }

    order.status = status;

    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderModel.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
