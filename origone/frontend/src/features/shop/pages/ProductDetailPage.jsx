import { useParams, useNavigate } from "react-router";
import { useSingleProduct } from "../hooks/useSingleProduct";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useProductActions } from "../../seller/product/hooks/useProductActions";
import { useCart } from "../../cart/hooks/useCart";
import toast from "react-hot-toast";

const ProductDetailPage = () => {
  const { deleteProduct } = useProductActions();
  const { addToCart } = useCart();

  const { id } = useParams();
  const navigate = useNavigate();

  const [added, setAdded] = useState(false);

  const {
    product,
    loading,
    selectedImage,
    selectedVariant,
    setSelectedImage,
    setSelectedVariant,
  } = useSingleProduct(id);

  // ✅ ADD TO CART
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Select variant");
      return;
    }

    try {
      await addToCart({
        product: product,
        size: selectedVariant.size,
        color: selectedVariant.color,
      });

      // ✅ animation
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      toast.error("Failed to add");
    }
  };

  const handleDelete = async () => {
    await deleteProduct(product._id);
    navigate("/seller/dashboard/my-vault");
  };

  const handleEdit = () => {
    navigate(`/seller/dashboard/edit-product/${product._id}`);
  };

  const user = useSelector((state) => state.auth.user);
  const isOwner = user?._id === product?.seller?._id;

  // ✅ derived data
  const colors = product
    ? [...new Set(product.variants.map((v) => v.color))]
    : [];

  const allSizes = product
    ? [...new Set(product.variants.map((v) => v.size))]
    : [];

  // ✅ default image
  useEffect(() => {
    if (product?.images?.length && !selectedImage) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!product) return <div className="p-20 text-center">Not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen px-6 md:px-16 py-22">
      {/* 🔙 BACK */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center cursor-pointer gap-2 text-gray-700 hover:text-orange-500 transition"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 🔥 THUMBNAILS */}
        <div className="lg:col-span-1 flex lg:flex-col gap-3">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img.url}
              onClick={() => setSelectedImage(img.url)}
              className={`w-16 h-16 rounded-lg object-cover cursor-pointer border ${
                selectedImage === img.url
                  ? "border-orange-500"
                  : "border-gray-200"
              }`}
            />
          ))}
        </div>

        {/* 🔥 MAIN IMAGE */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 flex justify-center">
          <motion.img
            src={selectedImage}
            whileHover={{ scale: 1.05 }}
            className="max-h-125 object-contain"
          />
        </div>

        {/* 🔥 DETAILS */}
        <div className="lg:col-span-5 space-y-5">
          <h1 className="text-3xl font-semibold">{product.title}</h1>

          <p className="text-sm text-gray-500">
            Seller: {product.seller.fullname}
          </p>

          <div className="text-2xl font-bold">₹{product.price.amount}</div>

          {/* 🎨 COLORS */}
          {colors.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Color</p>
              <div className="flex gap-3">
                {colors.map((color) => {
                  const variant = product.variants.find(
                    (v) => v.color === color,
                  );

                  return (
                    <div
                      key={color}
                      onClick={() => {
                        setSelectedVariant(variant);
                        if (variant?.images?.length) {
                          setSelectedImage(variant.images[0].url);
                        }
                      }}
                      className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                        selectedVariant?.color === color
                          ? "border-orange-500 scale-110"
                          : "border-gray-300"
                      }`}
                      style={{ background: color }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* 📏 SIZES */}
          {allSizes.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Select Size</p>

              <div className="flex gap-3 flex-wrap">
                {allSizes.map((size) => {
                  const variant = product.variants.find((v) => v.size === size);

                  return (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedVariant(variant);
                        if (variant?.images?.length) {
                          setSelectedImage(variant.images[0].url);
                        }
                      }}
                      className={`px-4 py-2 cursor-pointer rounded-lg border ${
                        selectedVariant?.size === size
                          ? "border-orange-500 text-orange-500"
                          : "border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 📦 STOCK */}
          {selectedVariant && (
            <p className="text-green-600 text-sm">
              In Stock ({selectedVariant.stock})
            </p>
          )}

          {/* 🚀 ACTIONS */}
          <div className="flex gap-4 pt-3">
            {isOwner ? (
              <>
                <button
                  onClick={handleEdit}
                  className="flex-1 border py-3 rounded-xl hover:bg-orange-100"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-xl hover:bg-red-600"
                >
                  Delete
                </button>
              </>
            ) : (
              <motion.button
                disabled={!selectedVariant}
                onClick={handleAddToCart}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-3 rounded-xl text-white transition ${
                  !selectedVariant
                    ? "bg-gray-400 cursor-not-allowed"
                    : added
                      ? "bg-green-500"
                      : "bg-orange-500 hover:bg-orange-400"
                }`}
              >
                {added ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Check size={18} /> Added
                  </motion.span>
                ) : (
                  "Add to Cart"
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* 📝 DESCRIPTION */}
      <div className="mt-16 bg-white p-8 rounded-2xl max-w-5xl">
        <h2 className="text-xl font-semibold mb-4">Product Description</h2>
        <p className="text-gray-600">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetailPage;
