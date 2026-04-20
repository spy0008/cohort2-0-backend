// ProductGrid.jsx
import { useNavigate } from "react-router";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
  const navigate = useNavigate();

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🛍️</div>

        <h2 className="text-2xl font-semibold mb-2">No products yet</h2>

        <p className="text-gray-500 mb-6 max-w-md">
          Start building your store by adding your first product. Your products
          will appear here.
        </p>

        <button
          onClick={() => navigate("/seller/dashboard/create-product")}
          className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-80 transition"
        >
          + Create Product
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;
