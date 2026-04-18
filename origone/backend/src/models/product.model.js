import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    color: {
      type: String,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    price: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        enum: ["INR"],
        default: "INR",
      },
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    variants: [variantSchema],

    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true },
);

productSchema.index({ title: "text", description: "text" });

const productModel = mongoose.model("product", productSchema);

export default productModel;
