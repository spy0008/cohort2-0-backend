import axiosInstance from "../../../shared/lib/axios";

export const getMyOrdersApi = () => axiosInstance.get("/api/orders/my-orders");

export const getOrderByIdApi = (id) => axiosInstance.get(`/api/orders/${id}`);
