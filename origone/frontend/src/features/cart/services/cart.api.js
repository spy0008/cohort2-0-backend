import axiosInstance from "../../../shared/lib/axios";

export const addToCartApi = (data) =>
  axiosInstance.post("/cart", data);

export const getCartApi = () =>
  axiosInstance.get("/cart");

export const updateCartApi = (data) =>
  axiosInstance.put("/cart", data);

export const removeCartApi = (data) =>
  axiosInstance.delete("/cart/remove", { data });

export const clearCartApi = () =>
  axiosInstance.delete("/cart/clear");