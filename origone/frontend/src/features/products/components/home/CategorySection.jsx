// components/CategorySection.jsx
const categories = ["Hoodies", "Streetwear", "Minimal", "Winter"];

const CategorySection = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 mb-12">
      <div className="flex gap-3 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;