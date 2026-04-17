import React, { useEffect } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import StatsBar from "../components/StatsBar";
import ProductGrid from "../components/ProductGrid";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";

const Dashboard = () => {
  const { handleGetSellerProduct } = useProduct();
  const { sellerProducts, loading } = useSelector((state) => state.product);

  useEffect(() => {
    handleGetSellerProduct();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 🌈 Aurora Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-125 h-125 bg-purple-500/20 blur-[140px] -top-25 -left-25" />
        <div className="absolute w-100 h-100 bg-[#C6A96B]/20 blur-[140px] -bottom-25 -right-25" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <Header />

        {/* Stats */}
        <StatsBar products={sellerProducts} />

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : sellerProducts?.length > 0 ? (
          <ProductGrid products={sellerProducts} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
