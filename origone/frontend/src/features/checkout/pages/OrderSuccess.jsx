import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { useCheckout } from "../hooks/useCheckout";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { orderSuccess } = useCheckout();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderSuccess(id);

        if (!res?.order) throw new Error("Order not found");

        setOrder(res.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Fetching your order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Order not found</p>
        <button
          onClick={() => navigate("/shop")}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 flex justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8"
      >
        <div className="text-center mb-6">
          <div className="text-green-500 text-5xl mb-3">✔</div>
          <h1 className="text-2xl font-semibold">
            Order Confirmed 🎉
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Your payment was successful
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl mb-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID</span>
            <span className="font-medium">{order._id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-medium">₹{order.totalAmount}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className="text-green-600 capitalize">
              {order.paymentStatus}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Order Status</span>
            <span className="capitalize">{order.status}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-medium mb-2">Delivery Address</h2>
          <p className="text-sm text-gray-600">
            {order.address.fullAddress}, {order.address.city} -{" "}
            {order.address.pincode}
          </p>
        </div>

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

                <p className="text-xs text-gray-600">
                  Qty: {item.quantity} × ₹{item.price}
                </p>
              </div>

              <div className="text-sm font-medium">
                ₹{item.quantity * item.price}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => navigate("/shop")}
            className="flex-1 border py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="flex-1 bg-orange-500 hover:bg-orange-600 cursor-pointer text-white py-2 rounded-lg"
          >
            My Orders
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;