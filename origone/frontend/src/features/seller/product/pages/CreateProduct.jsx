import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import MainImageUpload from "../components/MainImageUpload";
import VariantList from "../components/VariantList";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { fetchProduct } from "../../../shop/state/SingleProductSlice";
import { useProductActions } from "../hooks/useProductActions";

const CreateProduct = () => {
  const { updateProduct } = useProductActions();
  const { success: updateSuccess } = useSelector((s) => s.product.update);
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { createProduct, loading, success, error, reset } = useCreateProduct();

  const { product } = useSelector((s) => s.singleProduct);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [mainImages, setMainImages] = useState([]);
  const [variants, setVariants] = useState([
    { size: "", color: "", stock: 0, images: [] },
  ]);

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchProduct(id));
    }
  }, [id]);

  useEffect(() => {
    if (success || updateSuccess) {
      reset();
      navigate("/seller/dashboard/my-vault");
    }
  }, [success, updateSuccess]);

  useEffect(() => {
    if (product && isEditMode) {
      setTitle(product.title || "");
      setDescription(product.description || "");
      setPrice(product.price?.amount || "");

      const formattedMainImages =
        product.images?.map((img) => ({
          url: img.url,
          file: null,
          preview: img.url,
        })) || [];

      setMainImages(formattedMainImages);

      const formattedVariants =
        product.variants?.map((v) => ({
          size: v.size,
          color: v.color,
          stock: v.stock,
          images:
            v.images?.map((img) => ({
              url: img.url,
              file: null,
              preview: img.url,
            })) || [],
        })) || [];

      setVariants(formattedVariants);
    }
  }, [product]);

  useEffect(() => {
    if (success) {
      reset();
      toast.success(
        isEditMode
          ? "Product updated successfully"
          : "Product listed successfully",
      );
      navigate("/seller/dashboard/my-vault");
    }
  }, [success]);

  const handleSubmit = () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("priceAmount", price);

    mainImages.forEach((img) => {
      if (img.file) {
        formData.append("images", img.file);
      } else {
        formData.append("existingImages", img.url);
      }
    });

    const cleanVariants = variants.map((v) => ({
      size: v.size,
      color: v.color,
      stock: v.stock,
    }));

    formData.append("variants", JSON.stringify(cleanVariants));

    variants.forEach((variant, index) => {
      variant.images.forEach((img) => {
        if (img.file) {
          formData.append(`variant_${index}_images`, img.file);
        } else {
          formData.append(`variant_${index}_existingImages`, img.url);
        }
      });
    });

    if (isEditMode) {
      updateProduct({ id, formData });
    } else {
      createProduct(formData);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-20">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 cursor-pointer rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft size={22} />
        </button>

        <h1 className="text-3xl font-semibold">
          {isEditMode ? "Edit Product ✏️" : "Create Product 🛍️"}
        </h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow mb-6 space-y-4">
        <input
          placeholder="Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500"
        />

        <input
          type="number"
          placeholder="Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <MainImageUpload images={mainImages} setImages={setMainImages} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <VariantList variants={variants} setVariants={setVariants} />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="disabled:opacity-70 disabled:cursor-not-allowed w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="animate-spin" />}

        {loading
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
            ? "Update Product"
            : "Create Product"}
      </button>

      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
};

export default CreateProduct;
