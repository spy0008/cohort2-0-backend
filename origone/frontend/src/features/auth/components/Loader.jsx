import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black overflow-hidden">
      {/* 🌈 Aurora Glow */}
      <div className="absolute w-100 h-100 bg-[#C6A96B]/20 blur-[140px] rounded-full -top-25 -left-25" />
      <div className="absolute w-100 h-100 bg-purple-500/20 blur-[140px] rounded-full -bottom-25 -right-25" />

      {/* 🔥 Content */}
      <div className="flex flex-col items-center gap-6">
        {/* Brand */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold tracking-wider"
        >
          ORgone<span className="text-[#C6A96B]">.</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-sm tracking-wide"
        >
          Elevate Your Style
        </motion.p>

        {/* Loading Bar */}
        <div className="w-40 h-0.5 bg-white/10 rounded-full overflow-hidden mt-2">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut",
            }}
            className="h-full w-1/2 bg-[#C6A96B]"
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
