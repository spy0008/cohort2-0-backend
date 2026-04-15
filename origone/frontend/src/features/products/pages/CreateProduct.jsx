import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import CurrencySelect from "../components/currencySelect";

const MAX_IMAGES = 7;

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addFiles = (files) => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;
    const toAdd = Array.from(files).slice(0, remaining);
    const newImages = toAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileChange = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [images],
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("priceAmount", formData.priceAmount);
      data.append("priceCurrency", formData.priceCurrency);
      images.forEach((img) => data.append("images", img.file));
      await handleCreateProduct(data);
      navigate("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center text-white bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-125 h-125 bg-purple-500/20 blur-[140px] -top-25 -left-25" />
        <div className="absolute w-100 h-100 bg-[#C6A96B]/20 blur-[140px] -bottom-25 -right-25" />
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-lg tracking-[0.4em] text-[#C6A96B]">ORgone.</h2>
          <p className="text-sm text-white/50">Not Worn. Owned.</p>
        </div>

        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="text-white/50 cursor-pointer hover:text-[#C6A96B] text-2xl"
          >
            ←
          </button>
          <h1 className="text-4xl font-bold">Create Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex flex-col gap-6">
            <div>
              <label className="text-xs text-white/50 mb-1 block">
                Product Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Oversized Linen Shirt"
                className="w-full bg-transparent border-b border-white/10 py-3 focus:border-[#C6A96B] outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1 block">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-transparent border-b border-white/10 py-3 focus:border-[#C6A96B] outline-none transition resize-none"
              />
            </div>

            <div className="flex gap-4">
              <input
                type="number"
                name="priceAmount"
                value={formData.priceAmount}
                onChange={handleChange}
                placeholder="0.00"
                className="flex-1 bg-transparent border-b border-white/10 py-3 focus:border-[#C6A96B] outline-none"
              />

              <CurrencySelect
                value={formData.priceCurrency}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, priceCurrency: val }))
                }
              />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between text-xs text-white/50">
              <span>Images</span>
              <span>
                {images.length}/{MAX_IMAGES}
              </span>
            </div>

            {images.length < MAX_IMAGES && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-xl p-10 border border-dashed text-center cursor-pointer transition
                                ${isDragging ? "border-[#C6A96B] bg-[#C6A96B]/10" : "border-white/10 hover:border-[#C6A96B]/50"}`}
              >
                <p className="text-lg">📤</p>
                <p className="text-sm text-white/60">
                  Drag & drop or <span className="text-[#C6A96B]">browse</span>
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative rounded-xl overflow-hidden group"
                >
                  <img
                    src={img.preview}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-full mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 cursor-pointer rounded-xl 
                            bg-linear-to-r from-[#C6A96B] to-[#E6C98F] 
                            text-black font-semibold
                            shadow-[0_0_30px_rgba(198,169,107,0.4)]"
            >
              {isSubmitting ? "Publishing..." : "Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
