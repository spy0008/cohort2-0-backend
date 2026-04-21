import axiosInstance from "../../../../shared/lib/axios";

export const getDashboardApi = async () => {
  const res = await axiosInstance.get("/products/seller/dashboard");
  return res.data;
};

export const getRevenueApi = async () => {
  const res = await axiosInstance.get("/products/seller/revenue");
  return res.data;
};

export const getSellerOrdersApi = async () => {
  const res = await axiosInstance.get("/orders/seller/orders");
  return res.data;
};

export const updateOrderStatusApi = (orderId, status) => {
  return axiosInstance.put(`/orders/${orderId}/status`, {
    status,
  });
};
