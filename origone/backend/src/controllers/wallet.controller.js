import mongoose from "mongoose";
import walletModel from "../models/wallet.model.js";
import walletTxnModel from "../models/walletTransaction.model.js";
import userModel from "../models/user.model.js";
import { razorpay } from "../services/payment.service.js";

export const withdraw = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sellerId = req.user._id;

    const wallet = await walletModel
      .findOne({ seller: sellerId })
      .session(session);

    if (!wallet || wallet.withdrawableBalance <= 0) {
      throw new Error("No withdrawable balance");
    }

    const amount = wallet.withdrawableBalance;

    // ✅ Deduct balance safely
    const updated = await walletModel.updateOne(
      {
        seller: sellerId,
        withdrawableBalance: { $gte: amount },
      },
      {
        $inc: { withdrawableBalance: -amount },
      },
      { session },
    );

    if (updated.modifiedCount === 0) {
      throw new Error("Balance already used");
    }

    // ✅ Create txn (processing)
    const txn = await walletTxnModel.create(
      [
        {
          seller: sellerId,
          amount,
          type: "debit",
          status: "processing", // 🔥 important
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    // ✅ SIMULATE SUCCESS (after 2 sec)
    setTimeout(async () => {
      await walletTxnModel.findByIdAndUpdate(txn[0]._id, {
        status: "success",
      });
    }, 2000);

    return res.json({
      success: true,
      message: "Withdrawal requested",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({
      message: err.message,
    });
  }
};
export const getWallet = async (req, res) => {
  try {
    const sellerId = req.user._id;

    let wallet = await walletModel.findOne({ seller: sellerId });

    if (!wallet) {
      wallet = await walletModel.create({ seller: sellerId });
    }

    res.json({
      success: true,
      wallet,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWalletTransactions = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const txns = await walletTxnModel
      .find({ seller: sellerId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      transactions: txns,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
