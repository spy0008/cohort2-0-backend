import { useSellerDashboard } from "../hooks/useSellerDashboard";
import StatCard from "../components/dashboard/StateCard";
import RevenueCard from "../components/dashboard/RevenueCard";
import OrdersTable from "../components/dashboard/OrdersTable";
import BankModal from "../components/dashboard/BankModal";
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useState } from "react";

const SellerDashboard = () => {
  const { loading, stats, revenue, orders } = useSellerDashboard();
  const { user } = useSelector((s) => s.auth);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isBankAdded = user?.bankDetails?.isVerified;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="p-10 md:p-22 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 ">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-3xl font-semibold tracking-tight">
            Seller Dashboard 📊
          </h1>
        </div>

        {!isBankAdded ? (
          <button
            onClick={() => setOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition cursor-pointer shadow-sm"
          >
            Add Bank Details
          </button>
        ) : (
          <button
            onClick={() => navigate("/seller/dashboard/wallet")}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition cursor-pointer shadow-sm"
          >
            Go to Wallet 💰
          </button>
        )}
      </div>

      {open && <BankModal onClose={() => setOpen(false)} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Products" value={stats.totalProducts} />
        <StatCard title="Orders" value={stats.totalOrders} />
        <RevenueCard revenue={revenue} />
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
};

export default SellerDashboard;
