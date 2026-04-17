// components/Hero.jsx
import { motion } from "framer-motion";
import { Link } from "react-router";

const Hero = () => {
  return (
    <div className="relative h-[70vh] flex items-center justify-center text-center">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-125 h-125 bg-purple-500/20 blur-[140px] -top-25 -left-25" />
        <div className="absolute w-100 h-100 bg-[#C6A96B]/20 blur-[140px] -bottom-25 -right-25" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <h1 className="text-4xl  md:text-7xl font-semibold leading-tight">
          Elevate Your <span className="text-[#C6A96B]">Style</span>
        </h1>

        <p className="mt-4 gloock-regular  text-white/60">
          Discover premium drops curated for modern fashion.
        </p>

        <Link
          to="#products"
          className="inline-block mt-6 px-6 py-3 bg-[#C6A96B] text-black rounded-xl font-medium hover:scale-105 transition"
        >
          Shop Now
        </Link>
      </motion.div>
    </div>
  );
};

export default Hero;
