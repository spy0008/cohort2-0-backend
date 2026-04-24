import { useDispatch, useSelector } from "react-redux";
import {
  addCart,
  fetchCart,
  updateCart,
  optimisticAdd,
  removeItem,
  updateQtyLocal,
} from "../state/cart.slice";
import { useRef } from "react";
import toast from "react-hot-toast";
import { removeCartApi } from "../services/cart.api";

export const useCart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((s) => s.cart);

  const updateTimeouts = useRef({});

  const getProductId = (product) =>
    typeof product === "object" ? product._id : product;

  const getStock = (item) => {
    const variant = item.product?.variants?.find(
      (v) => v.size === item.size && v.color === item.color,
    );
    return variant?.stock || 0;
  };

  const addToCart = async ({ product, size, color }) => {
    dispatch(
      optimisticAdd({
        productId: product._id,
        size,
        color,
        productData: product,
      }),
    );

    try {
      await dispatch(
        addCart({
          productId: product._id,
          size,
          color,
          quantity: 1,
        }),
      ).unwrap();

      dispatch(fetchCart());
      toast.success("Added to cart");
    } catch (err) {
      toast.error("Error");
    }
  };

  const removeFromCart = async ({ productId, size, color }) => {
    dispatch(removeItem({ productId, size, color }));

    try {
      await removeCartApi({ productId, size, color });
      dispatch(fetchCart());
    } catch {
      dispatch(fetchCart());
    }
  };

  const updateQuantity = (item, newQty) => {
    const productId = getProductId(item.product);
    const stock = getStock(item);

    if (newQty > stock || newQty < 1) return;

    dispatch(
      updateQtyLocal({
        productId,
        size: item.size,
        color: item.color,
        quantity: newQty,
      }),
    );

    const key = `${productId}-${item.size}-${item.color}`;

    if (updateTimeouts.current[key]) {
      clearTimeout(updateTimeouts.current[key]);
    }

    updateTimeouts.current[key] = setTimeout(() => {
      dispatch(
        updateCart({
          productId,
          size: item.size,
          color: item.color,
          quantity: newQty,
        }),
      );
    }, 500);
  };

  return {
    cart,
    fetchCart: () => dispatch(fetchCart()),
    addToCart,
    removeFromCart,
    increaseQty: (item) => updateQuantity(item, item.quantity + 1),
    decreaseQty: (item) => updateQuantity(item, item.quantity - 1),
    getStock,
  };
};
