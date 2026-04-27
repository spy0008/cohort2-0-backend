import axiosInstance from "../../../shared/lib/axios";

export const addToCartApi = (data) =>
  axiosInstance.post("/api/cart", data);

export const getCartApi = () =>
  axiosInstance.get("/api/cart");

export const updateCartApi = (data) =>
  axiosInstance.put("/api/cart", data);

export const removeCartApi = (data) =>
  axiosInstance.delete("/api/cart/remove", { data });

export const clearCartApi = () =>
  axiosInstance.delete("/api/cart/clear");