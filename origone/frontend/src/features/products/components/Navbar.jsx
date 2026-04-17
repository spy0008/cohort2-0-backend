import { Link } from "react-router";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);

  console.log("nav", user);

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-50 
      w-full backdrop-blur-xl bg-white/5 border-b border-white/10 
      px-20 py-4 flex items-center justify-between shadow-lg"
    >
      {/* Branding */}
      <Link to="/" className="text-xl font-semibold tracking-wide">
        OR<span className="text-[#C6A96B]">gone</span>
      </Link>

      {/* Right */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#C6A96B] flex items-center justify-center text-black font-semibold">
              {user?.fullname[0]?.toUpperCase() || "U"}
            </div>
            <span>{user?.fullname.toUpperCase()}</span>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-sm px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            Login
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default Navbar;
