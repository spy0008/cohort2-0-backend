import { useNavigate } from "react-router";
import { useOrders } from "../hooks/useOrders";
import { motion } from "framer-motion";
import { ArrowLeft, Package } from "lucide-react";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-600",
  confirmed: "bg-blue-100 text-blue-600",
  shipped: "bg-purple-100 text-purple-600",
  delivered: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-500",
};

const MyOrdersPage = () => {
  const { orders, loading } = useOrders();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-400">
        Loading orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-500 gap-4">
        <p>No orders yet 🛒</p>
        <button
          onClick={() => navigate("/shop")}
          className="px-5 py-2 bg-black text-white rounded-lg hover:opacity-90 transition cursor-pointer"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-16 py-24">
      {/* 🔙 BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black transition cursor-pointer"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">My Orders</h1>

        <span className="text-sm text-gray-500">{orders.length} orders</span>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            onClick={() => navigate(`/orders/${order._id}`)}
            layout
            className="bg-white cursor-pointer p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Package size={18} />
                </div>

                <div>
                  <p className="text-sm text-gray-400">Order ID</p>
                  <p className="font-semibold">#{order._id.slice(-6)}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="text-right space-y-1">
                <p className="font-semibold text-lg">₹{order.totalAmount}</p>

                <span
                  className={`px-2 py-1 text-xs rounded-full capitalize ${statusStyles[order.status]}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-center border rounded-xl p-3 hover:bg-gray-50 transition"
                >
                  <img
                    src={item.image}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>

                    <p className="text-xs text-gray-400">
                      {item.size} • {item.color}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>

                  <div className="text-sm font-semibold">
                    ₹{item.quantity * item.price}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 text-sm text-gray-500 border-t pt-4">
              <span className="font-medium text-gray-700">Deliver to:</span>{" "}
              {order.address.fullAddress}, {order.address.city} -{" "}
              {order.address.pincode}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
