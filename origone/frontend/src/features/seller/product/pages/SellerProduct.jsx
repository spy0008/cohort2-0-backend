import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

import { useSellerProducts } from "../hooks/useSellerProduct";
import ProductGrid from "../components/ProductGrid";

const SellerProductsPage = () => {
  const { products, loading } = useSellerProducts();
  const navigate = useNavigate();

  return (
    <div className="p-20 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/seller/dashboard")}
            className="p-2 cursor-pointer rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-3xl font-semibold">My Vault 🧥</h1>
        </div>

        <span className="text-gray-500">{products?.length || 0} Products</span>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading products...</div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
};

export default SellerProductsPage;
