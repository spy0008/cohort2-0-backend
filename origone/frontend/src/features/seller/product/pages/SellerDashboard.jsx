import { useSellerDashboard } from "../hooks/useSellerDashboard";
import StatCard from "../components/dashboard/StateCard";
import RevenueCard from "../components/dashboard/RevenueCard";
import OrdersTable from "../components/dashboard/OrdersTable";
import { Loader2 } from "lucide-react";

const SellerDashboard = () => {
  const { loading, stats, revenue, orders } = useSellerDashboard();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-20 space-y-6 max-w-7xl mx-auto">

      <h1 className="text-3xl font-semibold">Dashboard 📊</h1>

      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Products" value={stats.totalProducts} />
        <StatCard title="Orders" value={stats.totalOrders} />
        <RevenueCard revenue={revenue} />
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
};

export default SellerDashboard;