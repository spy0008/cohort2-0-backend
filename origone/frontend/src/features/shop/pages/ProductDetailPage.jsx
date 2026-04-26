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

  const user = useSelector((state) => state.auth.user);
  const isOwner = user?._id === product?.seller?._id;

  const colors = product
    ? [...new Set(product.variants.map((v) => v.color))]
    : [];

  const allSizes = product
    ? [...new Set(product.variants.map((v) => v.size))]
    : [];

  useEffect(() => {
    if (product?.images?.length && !selectedImage) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

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

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  if (!product) return <div className="p-20 text-center">Not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen px-6 md:px-16 py-20">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8 text-gray-600 hover:text-black transition cursor-pointer"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-1 flex lg:flex-col gap-3">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img.url}
              onClick={() => setSelectedImage(img.url)}
              className={`w-16 h-16 rounded-xl object-cover cursor-pointer border transition ${
                selectedImage === img.url
                  ? "border-black scale-105"
                  : "border-gray-200 hover:border-black/40"
              }`}
            />
          ))}
        </div>

        <div className="lg:col-span-6 bg-white rounded-3xl p-6 flex items-center justify-center shadow-sm">
          <motion.img
            key={selectedImage}
            src={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03 }}
            className="max-h-125 object-contain"
          />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {product.title}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              by {product.seller.fullname}
            </p>
          </div>

          <div className="text-2xl font-semibold">₹{product.price.amount}</div>

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
                      className={`w-9 h-9 rounded-full border-2 cursor-pointer transition ${
                        selectedVariant?.color === color
                          ? "border-black scale-110"
                          : "border-gray-300"
                      }`}
                      style={{ background: color }}
                    />
                  );
                })}
              </div>
            </div>
          )}

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
                      className={`px-4 py-2 rounded-full text-sm border transition cursor-pointer ${
                        selectedVariant?.size === size
                          ? "bg-black text-white border-black"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedVariant && (
            <p className="text-green-600 text-sm font-medium">
              In Stock ({selectedVariant.stock})
            </p>
          )}

          <div className="flex gap-4 pt-2">
            {isOwner ? (
              <>
                <button
                  onClick={handleEdit}
                  className="flex-1 border py-3 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                >
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition cursor-pointer"
                >
                  Delete
                </button>
              </>
            ) : (
              <motion.button
                disabled={!selectedVariant}
                onClick={handleAddToCart}
                whileTap={{ scale: 0.96 }}
                className={`flex-1 py-3 rounded-xl text-white font-medium transition ${
                  !selectedVariant
                    ? "bg-gray-400 cursor-not-allowed"
                    : added
                      ? "bg-green-500"
                      : "bg-orange-500 cursor-pointer hover:bg-orange-600"
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

      <div className="mt-16 max-w-4xl">
        <div className="bg-white p-8 rounded-3xl shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Product Description</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
