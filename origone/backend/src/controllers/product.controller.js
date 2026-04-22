import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";
import orderModel from "../models/order.model.js";

function validateVariants(variants) {
  const seen = new Set();

  for (const variant of variants) {
    if (!variant.size || !variant.color) {
      return "Variant size and color required";
    }

    const key = `${variant.size}-${variant.color}`;

    if (seen.has(key)) {
      return "Duplicate variant found";
    }

    seen.add(key);

    if (variant.stock === undefined || variant.stock < 0) {
      return "Variant stock must be >= 0";
    }
  }

  return null;
}

function validateImage(file) {
  if (!file.mimetype.startsWith("image/")) {
    throw new Error("Only image files allowed");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image too large (max 5MB)");
  }
}

// ================= CREATE PRODUCT =================
export async function createProduct(req, res) {
  const { title, description, priceAmount, variants } = req.body;
  const seller = req.user;

  let parsedVariants = [];

  if (!priceAmount || Number(priceAmount) <= 0) {
    return res.status(400).json({ message: "Invalid price" });
  }

  try {
    parsedVariants = variants ? JSON.parse(variants) : [];
  } catch {
    return res.status(400).json({ message: "Invalid variants format" });
  }

  if (!parsedVariants.length) {
    return res.status(400).json({
      message: "At least one variant is required",
    });
  }

  const error = validateVariants(parsedVariants);
  if (error) return res.status(400).json({ message: error });

  const finalVariants = await Promise.all(
    parsedVariants.map(async (variant, index) => {
      const files = req.files?.filter(
        (f) => f.fieldname === `variant_${index}_images`,
      );

      const images = files?.length
        ? await Promise.all(
            files.map((file) => {
              validateImage(file);
              return uploadFile({
                buffer: file.buffer,
                fileName: file.originalname,
              });
            }),
          )
        : [];

      return {
        size: variant.size,
        color: variant.color,
        stock: variant.stock,
        images,
      };
    }),
  );

  const mainImages = req.files?.filter((f) => f.fieldname === "images");

  const uploadedMainImages = mainImages?.length
    ? await Promise.all(
        mainImages.map((file) => {
          validateImage(file);
          return uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
          });
        }),
      )
    : [];

  const product = await productModel.create({
    title,
    description,
    price: {
      amount: Number(priceAmount),
      currency: "INR",
    },
    variants: finalVariants,
    images: uploadedMainImages,
    seller: seller._id,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
}

// ================= SELLER PRODUCTS =================
export const getSellerProducts = async (req, res) => {
  const sellerId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const products = await productModel
    .find({
      seller: sellerId,
      isActive: true,
    })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  res.json({ success: true, products });
};

// ================= GET ALL PRODUCTS =================
export async function getProducts(req, res) {
  const { minPrice, maxPrice, search, sort, page = 1, limit = 10 } = req.query;

  let filter = { isActive: true, "variants.0": { $exists: true } };

  if (minPrice || maxPrice) {
    filter["price.amount"] = {};
    if (minPrice) filter["price.amount"].$gte = Number(minPrice);
    if (maxPrice) filter["price.amount"].$lte = Number(maxPrice);
  }

  if (search) {
    filter.$text = { $search: search };
  }

  let sortOption = {};
  if (sort === "low") sortOption["price.amount"] = 1;
  if (sort === "high") sortOption["price.amount"] = -1;
  if (sort === "new") sortOption["createdAt"] = -1;

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const products = await productModel
    .find(filter)
    .sort(Object.keys(sortOption).length ? sortOption : { createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .select("title price images seller createdAt");

  const total = await productModel.countDocuments(filter);

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / limitNum),
    products,
  });
}

// ================= GET SINGLE PRODUCT =================
export async function getSingleProduct(req, res) {
  const { id } = req.params;

  const product = await productModel
    .findById(id)
    .populate("seller", "fullname")
    .select("-__v");

  if (!product || !product.isActive) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ success: true, product });
}

// ================= UPDATE PRODUCT =================
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user._id;

  const { title, description, priceAmount, variants } = req.body;

  const product = await productModel.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.seller.toString() !== sellerId.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (title) product.title = title;
  if (description) product.description = description;
  if (priceAmount) product.price.amount = Number(priceAmount);

  if (variants) {
    let parsedVariants = [];

    try {
      parsedVariants = JSON.parse(variants);
    } catch {
      return res.status(400).json({ message: "Invalid variants format" });
    }

    const error = validateVariants(parsedVariants);
    if (error) return res.status(400).json({ message: error });

    const finalVariants = await Promise.all(
      parsedVariants.map(async (variant, index) => {
        const files = req.files?.filter(
          (f) => f.fieldname === `variant_${index}_images`,
        );

        const images = files?.length
          ? await Promise.all(
              files.map((file) => {
                validateImage(file);
                return uploadFile({
                  buffer: file.buffer,
                  fileName: file.originalname,
                });
              }),
            )
          : variant.images !== undefined
            ? variant.images
            : product.variants[index]?.images || [];

        return {
          size: variant.size,
          color: variant.color,
          stock:
            variant.stock !== undefined
              ? variant.stock
              : product.variants[index]?.stock || 0,
          images,
        };
      }),
    );

    product.variants = finalVariants;
  }

  await product.save();

  res.json({
    success: true,
    message: "Product updated successfully",
    product,
  });
};

// ================= DELETE PRODUCT =================
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user._id;

  const product = await productModel.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.seller.toString() !== sellerId.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  product.isActive = false;
  await product.save();

  res.json({
    success: true,
    message: "Product deleted successfully",
  });
};

// ================= SELLER REVENUE =================
export const getSellerRevenue = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const result = await orderModel.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$items" },
      {
        $match: {
          "items.seller": sellerId,
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: {
              $multiply: ["$items.quantity", "$items.price"],
            },
          },
        },
      },
    ]);

    res.json({
      success: true,
      revenue: result[0]?.revenue || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= SELLER DASHBOARD =================
export const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const products = await productModel.countDocuments({
      seller: sellerId,
    });

    const orders = await orderModel.aggregate([
      { $unwind: "$items" },
      {
        $match: {
          "items.seller": sellerId,
        },
      },
      {
        $group: {
          _id: "$_id",
        },
      },
      {
        $count: "totalOrders",
      },
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts: products,
        totalOrders: orders[0]?.totalOrders || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
