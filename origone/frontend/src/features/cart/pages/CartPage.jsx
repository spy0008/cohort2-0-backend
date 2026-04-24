import { useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

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
      <h1 className="text-2xl font-semibold mb-8">
        Shopping Cart ({items.length})
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Your cart is empty 🛒
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-10">
          {/* ITEMS */}
          <div className="lg:col-span-8 space-y-5">
            {items.map((item, i) => {
              const stock = getStock(item);

              return (
                <motion.div
                  key={i}
                  layout
                  className="bg-white p-4 rounded-xl shadow-sm flex gap-4"
                >
                  <img
                    src={item?.product?.images?.[0]?.url || "/placeholder.png"}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.title}</h3>

                    <p className="text-sm text-gray-500">
                      {item.size} • {item.color}
                    </p>

                    <p className="text-orange-500 font-semibold mt-1">
                      ₹{item.product.price.amount}
                    </p>

                    {/* STOCK */}
                    <p className="text-xs text-gray-500 mt-1">
                      {stock <= 5
                        ? `Only ${stock} left`
                        : `In stock (${stock})`}
                    </p>

                    {/* QTY */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        disabled={item.quantity <= 1}
                        onClick={() => decreaseQty(item)}
                        className="w-8 h-8 border rounded cursor-pointer"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        disabled={item.quantity >= stock}
                        onClick={() => increaseQty(item)}
                        className={`w-8 h-8 border cursor-pointer rounded ${item.quantity >= stock ? 'opacity-20' : ""}`}
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
                    className="text-red-500 cursor-pointer text-sm"
                  >
                    Remove
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* SUMMARY */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>

              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-orange-500 hover:bg-orange-600 transition-colors duration-200 cursor-pointer text-white py-3 rounded-xl"
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;