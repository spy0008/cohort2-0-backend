import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { useCheckout } from "../hooks/useCheckout";
import { CheckCircle, ArrowRight } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
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
          className="px-5 py-2 bg-black text-white rounded-lg hover:opacity-90 transition cursor-pointer"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 flex justify-center">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex justify-center mb-3"
          >
            <CheckCircle size={60} className="text-green-500" />
          </motion.div>

          <h1 className="text-2xl font-semibold">Order Confirmed 🎉</h1>

          <p className="text-gray-500 text-sm mt-1">
            Your payment was successful
          </p>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl mb-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID</span>
            <span className="font-medium">#{order._id.slice(-6)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-semibold">₹{order.totalAmount}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className="text-green-600 capitalize font-medium">
              {order.paymentStatus}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="capitalize font-medium">{order.status}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-medium mb-2">Delivery Address</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {order.address.fullAddress}, <br />
            {order.address.city} - {order.address.pincode}
          </p>
        </div>

        <div className="border-t pt-5 space-y-4">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl hover:shadow-sm transition"
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

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => navigate("/shop")}
            className="flex-1 border py-3 rounded-xl hover:bg-gray-100 transition cursor-pointer text-sm"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="flex-1 bg-orange-500 hover:bg-orange-600 transition cursor-pointer text-white py-3 rounded-xl text-sm flex items-center justify-center gap-2"
          >
            My Orders <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
