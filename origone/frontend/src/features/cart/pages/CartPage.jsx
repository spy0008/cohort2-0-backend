import { useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2 } from "lucide-react";

const CartPage = () => {
  const {
    cart,
    fetchCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    getStock,
  } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const items = cart?.items || [];

  const total = items.reduce((acc, item) => {
    const price = item?.product?.price?.amount || 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-16 py-24">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black transition cursor-pointer"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Shopping Cart</h1>
        <span className="text-sm text-gray-500">{items.length} items</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-28 text-gray-500">
          <p className="text-lg">Your cart is empty 🛒</p>
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:opacity-90 transition cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-5">
            {items.map((item, i) => {
              const stock = getStock(item);

              return (
                <motion.div
                  key={i}
                  layout
                  className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition flex gap-5"
                >
                  <img
                    src={item?.product?.images?.[0]?.url || "/placeholder.png"}
                    className="w-24 h-24 object-cover rounded-xl border"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-base">
                        {item.product.title}
                      </h3>

                      <p className="text-xs text-gray-400 mt-1">
                        {item.size} • {item.color}
                      </p>

                      <p className="text-orange-500 font-semibold mt-2">
                        ₹{item.product.price.amount}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {stock <= 5
                          ? `Only ${stock} left`
                          : `In stock (${stock})`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        disabled={item.quantity <= 1}
                        onClick={() => decreaseQty(item)}
                        className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100 cursor-pointer disabled:opacity-30"
                      >
                        −
                      </button>

                      <span className="font-medium">{item.quantity}</span>

                      <button
                        disabled={item.quantity >= stock}
                        onClick={() => increaseQty(item)}
                        className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100 cursor-pointer disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart({
                        productId: item.product._id,
                        size: item.size,
                        color: item.color,
                      })
                    }
                    className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              );
            })}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm space-y-5 sticky top-24">
              <h2 className="text-lg font-semibold">Order Summary</h2>

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
                onClick={() => navigate("/checkout")}
                className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-200 cursor-pointer text-white py-3 rounded-xl font-medium shadow-sm hover:shadow-md"
              >
                Proceed to Checkout →
              </button>

              <button
                onClick={() => navigate("/shop")}
                className="w-full text-sm text-gray-500 hover:text-black transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
