import axiosInstance from "../../../shared/lib/axios";

export const createPaymentApi = () =>
  axiosInstance.post("/orders/create-payment");

export const verifyPaymentApi = (data) =>
  axiosInstance.post("/orders/verify-payment", data);

export const getOrderByIdApi = (id) => axiosInstance.get(`/orders/${id}`);
