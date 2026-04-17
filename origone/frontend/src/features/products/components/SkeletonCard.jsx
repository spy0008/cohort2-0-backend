import React from "react";

const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="aspect-4/5 bg-gray-800" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
};

export default SkeletonCard;