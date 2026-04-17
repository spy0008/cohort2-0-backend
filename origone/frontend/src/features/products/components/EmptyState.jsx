import React from "react";
import { motion } from "framer-motion";

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-[60vh] text-center"
    >
      <h2 className="text-2xl font-semibold mb-3">
        No Products Yet
      </h2>
      <p className="text-gray-400">
        Start adding products to see them here 🚀
      </p>
    </motion.div>
  );
};

export default EmptyState;