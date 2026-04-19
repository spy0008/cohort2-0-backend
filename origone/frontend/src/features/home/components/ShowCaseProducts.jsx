import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const products = [
  {
    id: 1,
    name: "Female Top",
    price: "₹1299",
    img: "https://ik.imagekit.io/spy1710/orgone/DS23J-2x3-startpage-wk16.jpg_imwidth=1024",
  },
  {
    id: 2,
    name: "Urban Hoodie",
    price: "₹800",
    img: "https://ik.imagekit.io/spy1710/orgone/c2dea28890a26edf3f574f04baa92d9eafee1546.jpg_imwidth=128",
  },
  {
    id: 3,
    name: "Classic",
    price: "₹1399",
    img: "https://ik.imagekit.io/spy1710/orgone/Tops-WCE-wk16.jpg_imwidth=384",
  },
  {
    id: 4,
    name: "Street Pants",
    price: "₹999",
    img: "https://ik.imagekit.io/spy1710/orgone/IN_Wk15_CE_Jeans.jpg_imwidth=384",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0 },
};

const ShowCaseProducts = () => {
  return (
    <div className="px-6 md:px-20 py-20 bg-white" id="fetured-product">
      {/* 🔥 TITLE */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl mb-12"
      >
        Featured Collection
      </motion.h2>

      {/* 🔥 PRODUCTS GRID */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        id="featured-product"
      >
        {products.map((itemData) => (
          <motion.div key={itemData.id} variants={item}>
            <Link to="/shop" className="group block">
              {/* IMAGE */}
              <div className="relative overflow-hidden">
                <img
                  src={itemData.img}
                  className="w-full h-72 object-cover group-hover:scale-110 transition duration-700"
                />

                {/* 🔥 HOVER OVERLAY */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white text-sm border px-4 py-2">
                    View
                  </span>
                </div>
              </div>

              {/* INFO */}
              <div className="mt-3 text-sm">
                <p className="group-hover:text-orange-500 transition">
                  {itemData.name}
                </p>
                <p className="text-gray-500">Starting : {itemData.price}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ShowCaseProducts;
