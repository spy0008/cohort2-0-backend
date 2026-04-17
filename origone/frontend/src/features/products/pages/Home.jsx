import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";

import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";

import PromoBar from "../components/home/PromoBar";
import Hero from "../components/home/Hero";
import CategorySection from "../components/home/CategorySection";

const Home = () => {
  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);

  const { handleGetAllProducts } = useProduct();

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen">
      {/* 🔴 Promo */}
      <PromoBar />

      {/* 🧊 Navbar */}
      <Navbar />

      {/* 💎 Hero */}
      <Hero />

      {/* 🏷️ Categories */}
      <CategorySection />

      {/* 🛍️ Products */}
      <div id="products" className="max-w-6xl mx-auto px-4 pb-16">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Latest Drops</h2>
          <p className="text-sm text-white/60">
            Handpicked styles just for you
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products?.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Home;
