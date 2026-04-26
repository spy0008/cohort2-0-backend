import { useState, useEffect } from "react";
import { useShop } from "../hooks/useShop";
import ProductCard from "../components/ProductCard";
import { useDebounce } from "../hooks/useDebounce";
import { Search, SlidersHorizontal } from "lucide-react";

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
    <div className="px-6 md:px-16 py-20 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Explore Collection
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Discover minimal & modern styles
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border bg-white shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center mb-8">
        <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2 shadow-sm">
          <SlidersHorizontal size={16} className="text-gray-400" />
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-20 outline-none text-sm"
          />
          <span className="text-gray-300">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-20 outline-none text-sm"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-white shadow-sm text-sm cursor-pointer hover:border-black transition"
        >
          <option value="new">Newest</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg">No products found 😢</p>
          <p className="text-sm mt-1">Try adjusting filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-1.5 border rounded-full cursor-pointer 
              hover:bg-black hover:text-white transition disabled:opacity-30"
            >
              Prev
            </button>

            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-1.5 rounded-full cursor-pointer transition ${
                  page === i + 1
                    ? "bg-black text-white"
                    : "border hover:bg-black hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-1.5 border rounded-full cursor-pointer 
              hover:bg-black hover:text-white transition disabled:opacity-30"
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
