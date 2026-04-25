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

    if (!wallet) throw new Error("Wallet not found");
    if (wallet.withdrawableBalance <= 0) throw new Error("No balance");

    const user = await userModel.findById(sellerId).session(session);
    const fundAccountId = user.bankDetails.razorpayFundAccountId;

    if (!user?.bankDetails?.razorpayFundAccountId) {
      throw new Error("Bank not linked");
    }

    const amount = wallet.withdrawableBalance;

    // ✅ Deduct first
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
          status: "processing",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    // =========================
    // 🔥 Razorpay call OUTSIDE
    // =========================

    const idempotencyKey = `withdraw_${sellerId}_${txn[0]._id}_${Date.now()}`;

    try {
      const payout = await razorpay.payouts.create(
        {
          account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
          fund_account_id: fundAccountId,
          amount: amount * 100,
          currency: "INR",
          mode: "IMPS",
          purpose: "payout",
          reference_id: idempotencyKey,
          narration: "Seller Withdrawal",
        },
        {
          "Idempotency-Key": idempotencyKey,
        },
      );

      await walletTxnModel.findByIdAndUpdate(txn[0]._id, {
        status: "success",
      });

      return res.json({
        success: true,
        message: "Withdrawal successful",
        payoutId: payout.id,
      });
    } catch (err) {
      await walletModel.updateOne(
        { seller: sellerId },
        { $inc: { withdrawableBalance: amount } },
      );

      await walletTxnModel.findByIdAndUpdate(txn[0]._id, {
        status: "failed",
      });

      return res.status(500).json({
        message: "Payout failed, amount restored",
      });
    }
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