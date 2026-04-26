import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const images = [
  {
    src: "https://ik.imagekit.io/spy1710/orgone/IN_Mf0526p2_4x5.jpg_imwidth=1024",
    className: "col-span-2 row-span-3",
  },
  {
    src: "https://ik.imagekit.io/spy1710/orgone/photo-1512436991641-6745cdb1723f?tr=w-800",
    className: "col-span-2 row-span-1",
  },
  {
    src: "https://ik.imagekit.io/spy1710/orgone/IN_ws23L_wk16_16x9.jpg_imwidth=1024",
    className: "col-span-1 row-span-1",
  },
  {
    src: "https://ik.imagekit.io/spy1710/orgone/Tops-WCE-wk16.jpg_imwidth=384",
    className: "col-span-1 row-span-1",
  },
  {
    src: "https://ik.imagekit.io/spy1710/orgone/e0c0652e8b85cf9abbd4c22ca8df6113.jpg?tr=w-800",
    className: "col-span-2 row-span-1",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 1.05 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const Hero = () => {
  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 gap-2 h-screen p-2"
      >
        {images.map((img, i) => (
          <motion.div
            key={i}
            variants={item}
            className={`${img.className} overflow-hidden`}
          >
            <img
              src={img.src}
              loading="lazy"
              className="w-full h-full object-cover will-change-transform 
              transition-transform duration-500 ease-out hover:scale-105"
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 z-10">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold leading-tight max-w-xl"
        >
          Own Your <span className="text-orange-500">Expression</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 max-w-md text-sm md:text-base text-gray-300"
        >
          Minimal. Bold. Designed for the modern generation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 flex gap-4"
        >
          <a
            href="#fetured-product"
            className="bg-orange-500 hover:bg-orange-400 px-6 py-3 text-black font-medium 
            transition cursor-pointer"
          >
            Shop Now
          </a>

          <Link
            to="/shop"
            className="border border-white px-6 py-3 hover:bg-white hover:text-black 
            transition cursor-pointer"
          >
            Explore
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;