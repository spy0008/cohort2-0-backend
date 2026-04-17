import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProductCard = ({ product }) => {
  const images = product.images || [];
  const hasMultiple = images.length > 1;

  const [[index, direction], setIndex] = useState([0, 0]);

  const paginate = (dir) => {
    if (!hasMultiple) return;
    setIndex(([prev]) => [
      (prev + dir + images.length) % images.length,
      dir,
    ]);
  };

  // 🔥 Auto play on hover
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isHovering || !hasMultiple) return;

    const interval = setInterval(() => {
      paginate(1);
    }, 2500);

    return () => clearInterval(interval);
  }, [isHovering, index]);

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      className="group cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
    >
      {/* 📸 IMAGE CAROUSEL */}
      <div className="relative aspect-4/5 bg-black overflow-hidden">

        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={index}
            src={images[index]?.url || "/placeholder.png"}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            drag={hasMultiple ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (!hasMultiple) return;
              const swipe = offset.x + velocity.x;

              if (swipe < -100) paginate(1);
              else if (swipe > 100) paginate(-1);
            }}
            className="absolute w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* ⬅️ ➡️ Arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={() => paginate(-1)}
              className="opacity-0 cursor-pointer group-hover:opacity-100 transition absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 px-3 py-1 rounded-lg text-[#C6A96B]"
            >
              ‹
            </button>

            <button
              onClick={() => paginate(1)}
              className="opacity-0 cursor-pointer group-hover:opacity-100 transition absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 px-3 py-1 rounded-lg text-[#C6A96B]"
            >
              ›
            </button>
          </>
        )}

        {hasMultiple && (
          <div className="absolute bottom-3 w-full flex justify-center gap-2">
            {images.map((_, i) => (
              <div
                key={i}
                onClick={() => setIndex([i, i > index ? 1 : -1])}
                className={`h-2 w-2 rounded-full cursor-pointer transition ${
                  i === index
                    ? "bg-[#C6A96B] w-4"
                    : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="font-semibold text-lg">{product.title}</h2>

        <p className="text-sm text-gray-400 line-clamp-2 mt-1">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-[#C6A96B] font-bold">
            {product.price.currency} {product.price.amount}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;