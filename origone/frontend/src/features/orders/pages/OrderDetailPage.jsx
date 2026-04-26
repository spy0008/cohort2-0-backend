import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useOrderDetail } from "../hooks/useOrderDetail";
import { ArrowLeft } from "lucide-react";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { order, loading } = useOrderDetail(id);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
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
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-16 py-25">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center cursor-pointer gap-2 text-sm text-gray-500 hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </button>

        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-semibold">
                Order #{order._id.slice(-6)}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold">₹{order.totalAmount}</p>

              <span
                className={`px-3 py-1 text-xs rounded-full capitalize ${statusColor[order.status]}`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
            <div>
              <p className="text-gray-400 text-xs">Payment</p>
              <p className="capitalize font-medium">{order.paymentStatus}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs">Method</p>
              <p className="capitalize font-medium">{order.paymentMethod}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs">Items</p>
              <p className="font-medium">{order.items.length}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Delivery Address</p>
            <p className="text-sm text-gray-600">
              {order.address.fullAddress}, {order.address.city} -{" "}
              {order.address.pincode}
            </p>
          </div>

          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 items-center border rounded-xl p-3 hover:bg-gray-50 transition"
              >
                <img
                  src={item.image}
                  className="w-16 h-16 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <p className="text-sm font-medium">{item.title}</p>

                  <p className="text-xs text-gray-500">
                    {item.size} • {item.color}
                  </p>

                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>

                <p className="font-medium text-sm">
                  ₹{item.quantity * item.price}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetailPage;
