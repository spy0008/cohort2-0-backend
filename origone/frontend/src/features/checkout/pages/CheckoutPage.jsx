import { useState } from "react";
import { useCheckout } from "../hooks/useCheckout";
import { useCart } from "../../cart/hooks/useCart";
import { motion } from "framer-motion";

const CheckoutPage = () => {
  const { cart } = useCart();
  const { handlePayment, loading } = useCheckout();

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
      return alert("Please fill address");
    }

    handlePayment(address);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-16 py-20">
      <h1 className="text-3xl font-semibold mb-10">Checkout</h1>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* ADDRESS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm space-y-4"
          >
            <h2 className="text-lg font-semibold mb-2">
              Shipping Address
            </h2>

            <input
              placeholder="Full Address"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-400 outline-none"
              onChange={(e) =>
                setAddress({ ...address, fullAddress: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="City"
                className="border rounded-lg p-3 focus:ring-2 focus:ring-orange-400 outline-none"
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />

              <input
                placeholder="Pincode"
                className="border rounded-lg p-3 focus:ring-2 focus:ring-orange-400 outline-none"
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
              />
            </div>
          </motion.div>

          {/* CART ITEMS PREVIEW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-4">Your Items</h2>

            <div className="space-y-4">
              {items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <img
                    src={item.product.images?.[0]?.url}
                    className="w-16 h-16 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {item.product.title}
                    </p>

                    <p className="text-xs text-gray-500">
                      {item.size} • {item.color}
                    </p>

                    <p className="text-xs text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-medium">
                    ₹{item.product.price.amount * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm space-y-5 sticky top-24"
          >
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>

            <div className="border-t pt-3 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-xl font-medium"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Secure payment powered by Razorpay
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;