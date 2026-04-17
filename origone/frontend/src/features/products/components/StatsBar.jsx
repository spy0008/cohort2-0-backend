import React from "react";

const StatsBar = ({ products }) => {
  const total = products?.length || 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-gray-400 text-sm">Total Products</p>
        <h2 className="text-xl font-bold mt-1">{total}</h2>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-gray-400 text-sm">Active Listings</p>
        <h2 className="text-xl font-bold mt-1">{total}</h2>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-gray-400 text-sm">Revenue</p>
        <h2 className="text-xl font-bold mt-1">₹0</h2>
      </div>

    </div>
  );
};

export default StatsBar;