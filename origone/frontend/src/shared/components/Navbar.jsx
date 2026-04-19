import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { ArrowDown } from "lucide-react";
import { useAuth } from "../../features/auth/hook/useAuth";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { handleLogout } = useAuth();
  const user = useSelector((state) => state.auth.user);
  const dropdownRef = useRef();
  const location = useLocation();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
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
      {/* LOGO */}
      <h1 className="text-3xl tracking-widest font-semibold">
        ORgone<span className="text-orange-500">.</span>
      </h1>

      {/* NAV LINKS */}
      <div className="hidden md:flex gap-8 text-sm tracking-wide">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `transition ${
              isActive ? "text-orange-500" : "hover:text-orange-500"
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `transition ${
              isActive ? "text-orange-500" : "hover:text-orange-500"
            }`
          }
        >
          Shop
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `transition ${
              isActive ? "text-orange-500" : "hover:text-orange-500"
            }`
          }
        >
          About
        </NavLink>
      </div>

      {/* ACTION */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {user ? (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setOpen(!open)}
            onMouseEnter={() => setOpen(true)}
          >
            {/* AVATAR */}
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-black text-sm">
              {user?.fullname?.[0]}
            </div>

            {/* ARROW */}
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowDown size={16} />
            </motion.div>

            {/* DROPDOWN */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 w-64 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl text-white"
                >
                  {/* USER INFO */}
                  <div className="mb-3">
                    <p className="text-sm font-medium">{user?.fullname}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>

                  <div className="border-t border-white/10 my-2" />

                  {/* ROLE */}
                  <p className="text-xs text-gray-400 mb-3">
                    Account:{" "}
                    <span className="text-orange-500 capitalize">
                      {user?.role}
                    </span>
                  </p>

                  {/* ACTIONS */}
                  <div className="flex flex-col gap-2 text-sm">
                    {user?.role === "seller" && (
                      <Link
                        to="/seller/dashboard"
                        className="hover:text-orange-500 transition"
                      >
                        Dashboard
                      </Link>
                    )}

                    <button onClick={handleLogout} className="text-left cursor-pointer hover:text-red-500 transition">
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            to="/register"
            className="bg-black text-white px-4 py-2 text-sm hover:text-orange-500 transition"
          >
            Join
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default Navbar;
