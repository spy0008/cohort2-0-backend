import axiosInstance from "../../../shared/lib/axios";

export const getProductsApi = async (params) => {
  const { data } = await axiosInstance.get("/products", { params });
  return data;
};