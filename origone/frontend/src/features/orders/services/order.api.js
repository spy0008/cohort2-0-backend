import axiosInstance from "../../../shared/lib/axios";

export const getMyOrdersApi = () => axiosInstance.get("/orders/my-orders");

export const getOrderByIdApi = (id) => axiosInstance.get(`/orders/${id}`);
