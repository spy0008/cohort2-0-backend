import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { ArrowDown, ShoppingCart } from "lucide-react";
import { useAuth } from "../../features/auth/hook/useAuth";
import { useCart } from "../../features/cart/hooks/useCart";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openCart, setOpenCart] = useState(false);

  const { handleLogout } = useAuth();
  const user = useSelector((state) => state.auth.user);

  const dropdownRef = useRef();
  const cartRef = useRef();

  const location = useLocation();
  const { cart, fetchCart, removeFromCart } = useCart();

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const totalItems =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }

      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setOpenCart(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 px-6 md:px-12 py-4 flex justify-between items-center
      ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg shadow-sm text-black"
          : isHome
            ? "bg-transparent text-white"
            : "bg-white text-black border-b border-gray-200"
      }`}
    >
      <h1 className="text-3xl tracking-widest font-semibold">
        ORgone<span className="text-orange-500">.</span>
      </h1>

      <div className="hidden md:flex gap-8 text-sm tracking-wide items-center">
        {["/", "/shop", "/about"].map((path, i) => (
          <NavLink
            key={i}
            to={path}
            className={({ isActive }) =>
              `transition ${
                isActive ? "text-orange-500" : "hover:text-orange-500"
              }`
            }
          >
            {path === "/" ? "Home" : path.replace("/", "")}
          </NavLink>
        ))}

        {user?.role === "seller" && (
          <NavLink
            to="/seller/dashboard/my-vault"
            className={({ isActive }) =>
              `transition ${
                isActive ? "text-orange-500" : "hover:text-orange-500"
              }`
            }
          >
            My Vault
          </NavLink>
        )}
      </div>

      <div className="flex items-center gap-5 relative">
        {user && (
          <div ref={cartRef} className="relative">
            <button
              onClick={() => setOpenCart((prev) => !prev)}
              className="relative group"
            >
              <ShoppingCart className="group-hover:text-orange-500 cursor-pointer transition" />

              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] px-1.5 py-px rounded-full"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            <AnimatePresence>
              {openCart && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-82 bg-white text-black shadow-2xl rounded-2xl p-4 z-50"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg">Your Cart</h3>
                    <span className="text-xs text-gray-500">
                      {cart?.items?.length} items
                    </span>
                  </div>

                  {cart?.items?.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-6">
                      Your cart is empty 🛒
                    </p>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                        {cart.items.map((item, i) => (
                          <div
                            key={i}
                            className="relative flex gap-3 bg-gray-50 p-2  rounded-lg hover:bg-gray-100 transition"
                          >
                            <img
                              src={item?.product?.images?.[0]?.url}
                              className="w-14 h-14 object-cover rounded-md"
                            />

                            <div className="flex-1 text-sm">
                              <p className="font-medium line-clamp-1">
                                {item?.product?.title}
                              </p>

                              <p className="text-gray-500 text-xs">
                                {item?.size} • {item?.color}
                              </p>

                              <div className="flex justify-between items-center mt-1">
                                <span className="text-orange-500 font-semibold">
                                  ₹{item?.product?.price?.amount ?? 0}
                                </span>

                                <span className="text-xs text-gray-600">
                                  x{item?.quantity}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                removeFromCart({
                                  productId: item?.product?._id,
                                  size: item?.size,
                                  color: item?.color,
                                })
                              }
                              className="absolute cursor-pointer top-1 right-1 text-xs bg-white rounded-full px-1.5 py-px shadow hover:bg-red-50 text-red-500 hover:text-red-700 transition"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 border-t pt-3 flex justify-between text-sm font-medium">
                        <span>Total</span>
                        <span>
                          ₹
                          {cart.items.reduce(
                            (acc, item) =>
                              acc +
                              item.quantity *
                                (item?.product?.price?.amount ?? 0),
                            0,
                          )}
                        </span>
                      </div>

                      <Link
                        to="/cart"
                        onClick={() => setOpenCart(false)}
                        className="block mt-3 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white text-center py-2 rounded-xl text-sm transition"
                      >
                        View Cart →
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ================= PROFILE ================= */}
        <div ref={dropdownRef}>
          {user ? (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setOpenProfile(!openProfile)}
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-black text-sm">
                {user?.fullname?.[0]}
              </div>

              <motion.div animate={{ rotate: openProfile ? 180 : 0 }}>
                <ArrowDown size={16} />
              </motion.div>

              <AnimatePresence>
                {openProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-0 top-12 w-64 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl text-white"
                  >
                    <p className="text-sm font-medium">{user?.fullname}</p>
                    <p className="text-xs text-gray-400 mb-3">{user?.email}</p>

                    <div className="border-t border-white/10 my-2" />

                    <p className="text-xs text-gray-400 mb-3">
                      {" "}
                      Account:{" "}
                      <span className="text-orange-500 capitalize">
                        {" "}
                        {user?.role}{" "}
                      </span>{" "}
                    </p>

                    {user?.role === "seller" && (
                      <>
                        <Link
                          to="/seller/dashboard"
                          className="block hover:text-orange-500"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/seller/dashboard/create-product"
                          className="block hover:text-orange-500"
                        >
                          Add Product
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="mt-2 cursor-pointer text-left hover:text-red-500"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/register"
              className="bg-black text-white px-4 py-2 text-sm hover:text-orange-500"
            >
              Join
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
