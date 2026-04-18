import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
  const { title, description, priceAmount, stock, variants } = req.body;
  const seller = req.user;

  const images = req.files?.length
    ? await Promise.all(
        req.files.map(async (file) => {
          return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
          });
        }),
      )
    : [];

  let parsedVariants = [];

  try {
    parsedVariants = variants ? JSON.parse(variants) : [];
  } catch (err) {
    return res.status(400).json({ message: "Invalid variants format" });
  }

  const product = await productModel.create({
    title,
    description,
    price: {
      amount: priceAmount,
      currency: "INR",
    },
    stock,
    variants: parsedVariants,
    images,
    seller: seller._id,
  });

  res.status(201).json({
    message: "Product created successfully",
    success: true,
    product,
  });
}

export const getSellerProducts = async (req, res) => {
  const sellerId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const products = await productModel
    .find({ seller: sellerId })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.json({ success: true, products });
};

export async function getProducts(req, res) {
  const { minPrice, maxPrice, search, sort, page = 1, limit = 10 } = req.query;

  let filter = { isActive: true };

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

  // 📄 Pagination
  const skip = (page - 1) * limit;

  const products = await productModel
    .find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  const total = await productModel.countDocuments(filter);

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    products,
  });
}

export async function getSingleProduct(req, res) {
  const { id } = req.params;

  const product = await productModel
    .findById(id)
    .populate("seller", "fullname");

  if (!product || !product.isActive) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ success: true, product });
}

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user._id;

  const { title, description, priceAmount, stock, variants } = req.body;

  const product = await productModel.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.seller.toString() !== sellerId.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (title) product.title = title;
  if (description) product.description = description;
  if (priceAmount) product.price.amount = priceAmount;
  if (stock !== undefined) product.stock = stock;

  if (variants) {
    try {
      product.variants = JSON.parse(variants);
    } catch (err) {
      return res.status(400).json({ message: "Invalid variants format" });
    }
  }

  if (req.files?.length) {
    const images = await Promise.all(
      req.files.map(async (file) => {
        return await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });
      }),
    );

    product.images = [...product.images, ...images];
  }

  await product.save();

  res.json({
    success: true,
    message: "Product updated successfully",
    product,
  });
};

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
