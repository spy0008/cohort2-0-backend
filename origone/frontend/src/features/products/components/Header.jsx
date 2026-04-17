import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-10">

      <div>
        <h1 className="text-3xl font-bold tracking-wide">
          ORgone <span className="text-[#C6A96B]">Vault</span>
        </h1>
        <p className="text-gray-400 text-sm">
          Your premium product space
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/seller/create-product")}
        className="bg-[#C6A96B] text-black px-5 py-2 rounded-xl font-semibold"
      >
        + Add Product
      </motion.button>
    </div>
  );
};

export default Header;