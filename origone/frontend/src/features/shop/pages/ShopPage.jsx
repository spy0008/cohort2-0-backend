import { useState, useEffect } from "react";
import { useShop } from "../hooks/useShop";
import ProductCard from "../components/ProductCard";
import { useDebounce } from "../hooks/useDebounce";

const ShopPage = () => {
  const { products, loading, setFilters, page, pages, setPage } = useShop();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("new");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setFilters({
      search: debouncedSearch,
      sort,
      minPrice,
      maxPrice,
    });
    setPage(1);
  }, [debouncedSearch, sort, minPrice, maxPrice]);

  return (
    <div className="px-6 md:px-12 py-20 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Explore Products
        </h1>

        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative w-full md:w-72">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full border bg-white shadow-sm focus:ring-2 focus:ring-black outline-none"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-24 px-2 py-2 border rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-24 px-2 py-2 border rounded-lg text-sm"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="new">Newest</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          No products found 😢
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 cursor-pointer py-1 border rounded disabled:opacity-30"
            >
              Prev
            </button>

            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1 ? "bg-orange-500 text-white" : "border"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className="px-3 cursor-pointer py-1 border rounded disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShopPage;
