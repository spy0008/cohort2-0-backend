import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black overflow-hidden">

      <div className="relative flex flex-col items-center gap-6">
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold tracking-[0.2em] text-white"
        >
          ORgone<span className="text-[#C6A96B]">.</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-gray-400 text-xs tracking-[0.3em] uppercase"
        >
          Own Your Expression
        </motion.p>

        {/* 🔥 Premium Loading Bar */}
        <div className="relative w-44 h-0.5 bg-white/10 rounded-full overflow-hidden mt-2">
          {/* Glow layer */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#C6A96B]/40 to-transparent blur-sm" />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "120%" }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
              ease: "easeInOut",
            }}
            className="h-full w-1/2 bg-linear-to-r from-transparent via-[#C6A96B] to-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
