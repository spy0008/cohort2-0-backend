import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },

    // 🔥 SNAPSHOT DATA (VERY IMPORTANT)
    title: String,
    image: String,

    // 🔥 VARIANT
    size: String,
    color: String,

    quantity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "razorpay"],
      default: "cod",
    },

    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,

    address: {
      fullAddress: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },
  },
  { timestamps: true },
);

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
