import { X } from "lucide-react";
import toast from "react-hot-toast";

const MAX_SIZE = 5 * 1024 * 1024;

const VariantItem = ({ variant, index, updateVariant, removeVariant }) => {
  const handleImage = (file) => {
    if (!file) return;

    if (file.size > MAX_SIZE) {
      toast.error("Max 5MB allowed");
      return;
    }

    const newImage = {
      file,
      preview: URL.createObjectURL(file),
    };

    // 🔥 REPLACE OLD IMAGE (NOT ADD)
    updateVariant(index, {
      ...variant,
      images: [newImage],
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0]; // 🔥 only first file
    handleImage(file);
  };

  return (
    <div className="border p-10 rounded-xl relative mb-4 bg-white">
      <button
        onClick={() => removeVariant(index)}
        className="absolute top-2 right-2 text-gray-400 hover:bg-gray-200 rounded-full p-1 hover:text-red-500"
      >
        <X size={18} />
      </button>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <select
          value={variant.size}
          onChange={(e) =>
            updateVariant(index, { ...variant, size: e.target.value })
          }
          className="border p-2 rounded-lg"
        >
          <option value="">Size</option>
          <option>XS</option>
          <option>S</option>
          <option>M</option>
          <option>L</option>
          <option>XL</option>
        </select>

        <input
          placeholder="Color"
          value={variant.color}
          onChange={(e) =>
            updateVariant(index, { ...variant, color: e.target.value })
          }
          className="border p-2 rounded-lg"
        />

        <input
          type="number"
          placeholder="Stock"
          value={variant.stock}
          onChange={(e) =>
            updateVariant(index, { ...variant, stock: e.target.value })
          }
          className="border p-2 rounded-lg"
        />
      </div>

      <label
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="block border-2 border-dashed p-5 rounded-xl text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition"
      >
        {variant.images.length
          ? "Replace Image"
          : "Upload Variant Image (Max 5MB)"}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImage(e.target.files[0])}
          className="hidden"
        />
      </label>

      {/* PREVIEW (ONLY ONE) */}
      {variant.images.length > 0 && (
        <div className="mt-3">
          <div className="relative w-20 h-20 group">
            <img
              src={variant.images[0].preview}
              className="w-full h-full object-cover rounded-lg"
            />

            <button
              onClick={() => updateVariant(index, { ...variant, images: [] })}
              className="absolute top-0 right-0 bg-orange-500 text-white rounded-full px-1 opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantItem;
