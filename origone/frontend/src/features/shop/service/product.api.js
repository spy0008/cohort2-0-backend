import axiosInstance from "../../../shared/lib/axios";

export const getSingleProductApi = async (id) => {
  const { data } = await axiosInstance.get(`/api/products/${id}`);
  return data;
};