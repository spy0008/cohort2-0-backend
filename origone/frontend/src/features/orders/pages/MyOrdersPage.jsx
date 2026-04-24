import { useNavigate } from "react-router";
import { useOrders } from "../hooks/useOrders";
import { motion } from "framer-motion";

const statusColor = {
  pending: "text-yellow-600",
  confirmed: "text-blue-600",
  shipped: "text-purple-600",
  delivered: "text-green-600",
  cancelled: "text-red-500",
};

const MyOrdersPage = () => {
  const { orders, loading } = useOrders();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        No orders yet 🛒
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-16 py-20">
      <h1 className="text-2xl font-semibold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            onClick={() => navigate(`/orders/${order._id}`)}
            layout
            className="bg-white cursor-pointer p-6 rounded-xl shadow-sm"
          >
            {/* HEADER */}
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-medium">₹{order.totalAmount}</p>
                <p
                  className={`text-sm capitalize ${statusColor[order.status]}`}
                >
                  {order.status}
                </p>
              </div>
            </div>

            {/* ITEMS */}
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-center border rounded-lg p-3"
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

            {/* ADDRESS */}
            <div className="mt-4 text-sm text-gray-500">
              Deliver to: {order.address.fullAddress}, {order.address.city} -{" "}
              {order.address.pincode}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
