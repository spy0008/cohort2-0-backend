import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "user", unique: true },
    balance: { type: Number, default: 0 },
    withdrawableBalance: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const walletModel = mongoose.model("wallet", walletSchema);

export default walletModel;
