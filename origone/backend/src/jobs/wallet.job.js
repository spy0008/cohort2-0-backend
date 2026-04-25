import walletTxnModel from "../models/walletTransaction.model.js";
import walletModel from "../models/wallet.model.js";

export const releaseWalletMoney = async () => {
  const txns = await walletTxnModel
    .find({
      status: "pending",
      availableAt: { $lte: new Date() },
    })
    .limit(50);

  for (const txn of txns) {
    const wallet = await walletModel.findOne({ seller: txn.seller });
    if (!wallet) continue;

    const updated = await walletTxnModel.updateOne(
      { _id: txn._id, status: "pending" },
      { $set: { status: "available" } },
    );

    if (updated.modifiedCount === 0) continue;

    await walletModel.updateOne(
      { seller: txn.seller },
      { $inc: { withdrawableBalance: txn.amount } },
    );
  }
};
