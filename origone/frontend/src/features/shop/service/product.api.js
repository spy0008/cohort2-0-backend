import axiosInstance from "../../../shared/lib/axios";

export const getSingleProductApi = async (id) => {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data;
};