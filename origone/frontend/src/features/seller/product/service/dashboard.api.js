import axiosInstance from "../../../../shared/lib/axios";

export const getDashboardApi = async () => {
  const res = await axiosInstance.get("/api/products/seller/dashboard");
  return res.data;
};

export const getRevenueApi = async () => {
  const res = await axiosInstance.get("/api/products/seller/revenue");
  return res.data;
};

export const getSellerOrdersApi = async () => {
  const res = await axiosInstance.get("/api/orders/seller/orders");
  return res.data;
};

export const updateOrderStatusApi = (orderId, status) => {
  return axiosInstance.put(`/api/orders/${orderId}/status`, {
    status,
  });
};
