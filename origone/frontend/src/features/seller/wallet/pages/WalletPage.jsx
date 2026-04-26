import { useWallet } from "../hooks/useWallet";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const WalletPage = () => {
  const { wallet, transactions, withdraw } = useWallet();
  const [withdrawing, setWithdrawing] = useState(false);
  const navigate = useNavigate();

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getRemainingTime = (date) => {
    const diff = new Date(date) - new Date();
    if (diff <= 0) return "Ready";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${hours}h ${minutes}m`;
  };

  const handleWithdraw = async () => {
    if (!wallet?.withdrawableBalance) return;

    setWithdrawing(true);
    await withdraw();
    setWithdrawing(false);
  };

  return (
    <div className="p-10 md:p-22 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-3xl font-semibold tracking-tight">Wallet 💰</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-linear-to-br from-orange-800 to-gray-900 text-white p-6 rounded-2xl shadow-lg">
          <p className="text-sm opacity-70">Total Balance</p>
          <h2 className="text-3xl font-semibold mt-2">
            ₹{wallet?.balance || 0}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col justify-between hover:shadow-md transition">
          <div>
            <p className="text-gray-500 text-sm">Withdrawable</p>
            <h2 className="text-3xl font-semibold mt-2">
              ₹{wallet?.withdrawableBalance || 0}
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Funds unlock after 3 days
            </p>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={!wallet?.withdrawableBalance || withdrawing}
            className="mt-5 w-full bg-black text-white py-2.5 rounded-lg 
            hover:opacity-90 transition cursor-pointer 
            disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {withdrawing ? "Processing..." : "Withdraw"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Transaction History</h2>

          <span className="text-xs text-gray-400">
            {transactions.length} records
          </span>
        </div>

        <div className="grid grid-cols-4 px-6 py-3 text-xs font-medium text-gray-500 border-b bg-gray-50">
          <span>Type</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Date</span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">
            No transactions yet
          </div>
        ) : (
          transactions.map((txn) => (
            <div
              key={txn._id}
              className="grid grid-cols-4 px-6 py-4 border-b last:border-none items-center hover:bg-gray-50 transition"
            >
              <span
                className={`text-sm font-medium ${
                  txn.type === "credit" ? "text-green-600" : "text-red-500"
                }`}
              >
                {txn.type === "credit" ? "Credit" : "Debit"}
              </span>

              <span className="text-sm font-medium">₹{txn.amount}</span>

              <span>
                {txn.status === "pending" && txn.availableAt ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
                    ⏳ {getRemainingTime(txn.availableAt)}
                  </span>
                ) : txn.status === "available" ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                    Ready
                  </span>
                ) : txn.status === "processing" ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                    Processing
                  </span>
                ) : txn.status === "failed" ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
                    Failed
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                    {txn.status}
                  </span>
                )}
              </span>

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
