import mongoose from "mongoose";

const walletTxnSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },

    amount: Number,

    type: {
      type: String,
      enum: ["credit", "debit"],
    },

    status: {
      type: String,
      enum: ["pending", "processing", "success", "failed", "available"],
      default: "pending",
    },

    availableAt: Date,
  },
  { timestamps: true },
);

const walletTxnModel = mongoose.model("walletTransaction", walletTxnSchema);

walletTxnSchema.index({ seller: 1 });
walletTxnSchema.index({ status: 1, availableAt: 1 });

export default walletTxnModel;
