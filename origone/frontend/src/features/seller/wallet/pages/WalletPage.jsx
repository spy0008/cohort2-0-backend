import { useWallet } from "../hooks/useWallet";
import { useState } from "react";

const WalletPage = () => {
  const { wallet, transactions, withdraw } = useWallet();
  const [withdrawing, setWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    if (!wallet?.withdrawableBalance) return;

    setWithdrawing(true);
    await withdraw();
    setWithdrawing(false);
  };

  

  return (
    <div className="p-20 max-w-6xl mx-auto space-y-8">

      {/* HEADER */}
      <h1 className="text-3xl font-semibold tracking-tight">
        Wallet 💰
      </h1>

      {/* BALANCE CARDS */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* TOTAL BALANCE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500 text-sm">Total Balance</p>
          <h2 className="text-3xl font-semibold mt-2">
            ₹{wallet?.balance || 0}
          </h2>
        </div>

        {/* WITHDRAWABLE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col justify-between">
          <div>
            <p className="text-gray-500 text-sm">Withdrawable</p>
            <h2 className="text-3xl font-semibold mt-2">
              ₹{wallet?.withdrawableBalance || 0}
            </h2>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={!wallet?.withdrawableBalance || withdrawing}
            className="mt-4 w-full bg-black text-white py-2 rounded-lg 
            hover:opacity-90 transition cursor-pointer 
            disabled:opacity-40"
          >
            {withdrawing ? "Processing..." : "Withdraw"}
          </button>
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold">
            Transaction History
          </h2>
        </div>

        {/* TABLE HEADER */}
        <div className="grid grid-cols-4 px-6 py-3 text-sm text-gray-500 border-b">
          <span>Type</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Date</span>
        </div>

        {/* TABLE BODY */}
        {transactions.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No transactions yet
          </div>
        ) : (
          transactions.map((txn) => (
            <div
              key={txn._id}
              className="grid grid-cols-4 px-6 py-4 border-b last:border-none items-center"
            >
              {/* TYPE */}
              <span
                className={`font-medium ${
                  txn.type === "credit"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {txn.type === "credit" ? "Credit" : "Debit"}
              </span>

              {/* AMOUNT */}
              <span className="font-medium">
                ₹{txn.amount}
              </span>

              {/* STATUS BADGE */}
              <span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    txn.status === "success"
                      ? "bg-green-100 text-green-600"
                      : txn.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : txn.status === "failed"
                      ? "bg-red-100 text-red-600"
                      : txn.status === "processing"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {txn.status}
                </span>
              </span>

              {/* DATE */}
              <span className="text-gray-500 text-sm">
                {new Date(txn.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WalletPage;