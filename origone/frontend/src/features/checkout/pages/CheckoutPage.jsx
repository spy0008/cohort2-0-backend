import { useState } from "react";
import { useCheckout } from "../hooks/useCheckout";
import { useCart } from "../../cart/hooks/useCart";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, CreditCard } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const { cart } = useCart();
  const { handlePayment, loading } = useCheckout();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullAddress: "",
    city: "",
    pincode: "",
  });

  const items = cart?.items || [];

  const total = items.reduce((acc, item) => {
    const price = item?.product?.price?.amount || 0;
    return acc + price * item.quantity;
  }, 0);

  const handleSubmit = () => {
    if (!address.fullAddress || !address.city || !address.pincode) {
      return toast.error("Please fill address");
    }

    handlePayment(address);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-16 py-24">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black transition cursor-pointer"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <h1 className="text-3xl font-semibold mb-10 tracking-tight">Checkout</h1>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm space-y-5"
          >
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <h2 className="text-lg font-semibold">Shipping Address</h2>
            </div>

            <input
              placeholder="Full Address"
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none transition"
              onChange={(e) =>
                setAddress({ ...address, fullAddress: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="City"
                className="border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none transition"
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />

              <input
                placeholder="Pincode"
                className="border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none transition"
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-5">Your Items</h2>

            <div className="space-y-4">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-center border-b pb-4 last:border-none"
                >
                  <img
                    src={item.product.images?.[0]?.url}
                    className="w-16 h-16 rounded-xl object-cover border"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product.title}</p>

                    <p className="text-xs text-gray-400">
                      {item.size} • {item.color}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-semibold">
                    ₹{item.product.price.amount * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm space-y-5 sticky top-24"
          >
            <div className="flex items-center gap-2">
              <CreditCard size={18} />
              <h2 className="text-lg font-semibold">Order Summary</h2>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-200 text-white py-3 rounded-xl font-medium shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Secure payment powered by Razorpay
            </p>

            <button
              onClick={() => navigate("/cart")}
              className="w-full text-sm text-gray-500 hover:text-black transition cursor-pointer"
            >
              Back to Cart
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
