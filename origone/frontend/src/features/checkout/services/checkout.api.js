import axiosInstance from "../../../shared/lib/axios";

export const createPaymentApi = () =>
  axiosInstance.post("/api/orders/create-payment");

export const verifyPaymentApi = (data) =>
  axiosInstance.post("/api/orders/verify-payment", data);

export const getOrderByIdApi = (id) => axiosInstance.get(`/api/orders/${id}`);
