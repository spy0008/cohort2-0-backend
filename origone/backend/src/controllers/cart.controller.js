import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

// find variant
function findVariant(product, size, color) {
  return product.variants.find((v) => v.size === size && v.color === color);
}

// ================= ADD TO CART =================
export const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, size, color, quantity = 1 } = req.body;

  const product = await productModel.findById(productId);

  if (!product || !product.isActive) {
    return res.status(404).json({ message: "Product not available" });
  }

  if (product.seller.toString() === userId.toString()) {
    return res.status(400).json({ message: "You cannot buy your own product" });
  }

  const variant = findVariant(product, size, color);

  if (!variant) {
    return res.status(400).json({ message: "Variant not found" });
  }

  if (variant.stock < quantity) {
    return res.status(400).json({ message: "Not enough stock" });
  }

  let cart = await cartModel.findOne({ user: userId });

  if (!cart) {
    cart = await cartModel.create({
      user: userId,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color,
  );

  if (existingItem) {
    if (variant.stock < existingItem.quantity + quantity) {
      return res.status(400).json({ message: "Stock exceeded" });
    }

    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      size,
      color,
      quantity,
    });
  }

  await cart.save();

  res.json({
    success: true,
    message: "Added to cart",
    cart,
  });
};

// ================= GET CART =================
export const getCart = async (req, res) => {
  const userId = req.user._id;

  const cart = await cartModel
    .findOne({ user: userId })
    .populate("items.product");

  if (!cart) {
    return res.json({ success: true, cart: { items: [] } });
  }

  res.json({ success: true, cart });
};

// ================= UPDATE CART =================
export const updateCartItem = async (req, res) => {
  const userId = req.user._id;
  const { productId, size, color, quantity } = req.body;

  const cart = await cartModel.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.find(
    (i) =>
      i.product.toString() === productId &&
      i.size === size &&
      i.color === color,
  );

  if (!item) {
    return res.status(404).json({ message: "Item not in cart" });
  }

  const product = await productModel.findById(productId);
  const variant = findVariant(product, size, color);

  if (!variant) {
    return res.status(400).json({ message: "Variant not found" });
  }

  if (variant.stock < quantity) {
    return res.status(400).json({ message: "Stock exceeded" });
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter(
      (i) =>
        !(
          i.product.toString() === productId &&
          i.size === size &&
          i.color === color
        ),
    );
  } else {
    item.quantity = quantity;
  }

  await cart.save();

  res.json({ success: true, cart });
};

// ================= REMOVE ITEM =================
export const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, size, color } = req.body;

  const cart = await cartModel.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = cart.items.filter(
    (item) =>
      !(
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
      ),
  );

  await cart.save();

  res.json({
    success: true,
    message: "Item removed",
    cart,
  });
};

// ================= CLEAR CART =================
export const clearCart = async (req, res) => {
  const userId = req.user._id;

  await cartModel.findOneAndUpdate({ user: userId }, { items: [] });

  res.json({ success: true, message: "Cart cleared" });
};
