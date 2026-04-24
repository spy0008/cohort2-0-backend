import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useOrderDetail } from "../hooks/useOrderDetail";

const statusColor = {
  pending: "text-yellow-600",
  confirmed: "text-blue-600",
  shipped: "text-purple-600",
  delivered: "text-green-600",
  cancelled: "text-red-500",
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { order, loading } = useOrderDetail(id);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Order not found</p>
        <button
          onClick={() => navigate("/orders")}
          className="px-4 py-2 cursor-pointer bg-orange-500 text-white rounded-lg"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-16 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-sm"
      >
        {/* 🔙 BACK */}
        <button
          onClick={() => navigate("/orders")}
          className="text-sm cursor-pointer text-gray-500 mb-4 hover:underline"
        >
          ← Back to Orders
        </button>

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">
              Order Details
            </h1>
            <p className="text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="text-right">
            <p className="font-medium">₹{order.totalAmount}</p>
            <p className={`text-sm capitalize ${statusColor[order.status]}`}>
              {order.status}
            </p>
          </div>
        </div>

        {/* PAYMENT INFO */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Payment Status</span>
            <span className="text-green-600 capitalize">
              {order.paymentStatus}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Payment Method</span>
            <span className="capitalize">{order.paymentMethod}</span>
          </div>

          <div className="flex justify-between">
            <span>Order ID</span>
            <span>{order._id}</span>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="mb-6">
          <h2 className="font-medium mb-1">Delivery Address</h2>
          <p className="text-sm text-gray-600">
            {order.address.fullAddress}, {order.address.city} -{" "}
            {order.address.pincode}
          </p>
        </div>

        {/* ITEMS */}
        <div className="border-t pt-4 space-y-4">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg"
            >
              <img
                src={item.image}
                className="w-16 h-16 object-cover rounded"
              />

              <div className="flex-1">
                <p className="text-sm font-medium">{item.title}</p>

                <p className="text-xs text-gray-500">
                  {item.size} • {item.color}
                </p>

                <p className="text-xs">
                  Qty: {item.quantity} × ₹{item.price}
                </p>
              </div>

              <div className="text-sm font-medium">
                ₹{item.quantity * item.price}
              </div>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="border-t mt-6 pt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetailPage;