import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  const image = product.images?.[0]?.url;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
    >
      {/* IMAGE */}
      <div className="h-60 bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <h2 className="font-semibold text-lg line-clamp-1">
          {product.title}
        </h2>

        <p className="text-gray-500 text-sm line-clamp-2">
          {product.description}
        </p>

        {/* PRICE */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">
            ₹ {product.price.amount}
          </span>

          <span className="text-xs text-gray-400">
            {new Date(product.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* VARIANTS */}
        <div className="flex flex-wrap gap-2 mt-2">
          {product.variants?.slice(0, 3).map((v, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 bg-gray-100 rounded-full"
            >
              {v.size} • {v.color}
            </span>
          ))}
        </div>

        {/* STOCK */}
        <div className="text-xs text-gray-500 mt-1">
          Total Stock:{" "}
          {product.variants.reduce((acc, v) => acc + v.stock, 0)}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;