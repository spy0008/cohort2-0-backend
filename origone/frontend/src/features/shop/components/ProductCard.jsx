import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const image1 = product.images?.[0]?.url || "/placeholder.png";
  const image2 = product.images?.[1]?.url;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      onClick={() => navigate(`/shop/product/${product._id}`)}
      className="group bg-white rounded-2xl overflow-hidden cursor-pointer 
      border border-gray-100 hover:border-black/10 shadow-sm hover:shadow-lg transition-all"
    >
      <div className="relative overflow-hidden">
        <img
          src={image1}
          className={`w-full h-64 object-cover transition duration-700 ${
            image2 ? "group-hover:opacity-0" : "group-hover:scale-110"
          }`}
        />

        {image2 && (
          <img
            src={image2}
            className="w-full h-64 object-cover absolute inset-0 opacity-0 
            group-hover:opacity-100 transition duration-700"
          />
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-500" />

        <span
          className="absolute top-3 left-3 bg-white/80 backdrop-blur-md 
        text-[10px] px-2.5 py-1 rounded-full font-medium tracking-wide"
        >
          NEW
        </span>
      </div>

      <div className="p-4 space-y-1.5">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
          {product.title}
        </h3>

        <p className="text-base font-semibold text-black">
          ₹{product.price?.amount}
        </p>

        <p className="text-xs text-gray-400">Free Delivery</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
