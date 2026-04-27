import axiosInstance from "../../../shared/lib/axios";

export const getProductsApi = async (params) => {
  const { data } = await axiosInstance.get("/api/products", { params });
  return data;
};