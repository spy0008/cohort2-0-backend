import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const image = product.images?.[0]?.url || "/placeholder.png";


  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/shop/product/${product._id}`)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          className="w-full h-56 object-cover hover:scale-110 transition duration-500"
        />

        <span className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1 rounded-full">
          NEW
        </span>
      </div>

      <div className="p-3 space-y-1">
        <h3 className="text-sm font-medium line-clamp-1">{product.title}</h3>

        <p className="text-black font-semibold text-sm">
          ₹{product.price?.amount}
        </p>

        <p className="text-xs text-gray-400">Free Delivery</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
