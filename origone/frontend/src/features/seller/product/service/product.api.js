import axiosInstance from "../../../../shared/lib/axios";

export async function createProductApi(formData) {
  const res = await axiosInstance.post("/api/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

export async function getSellerProductsApi() {
  const res = await axiosInstance.get("/api/products/seller");

  return res.data;
}

export const deleteProductApi = async (id) => {
  const res = await axiosInstance.delete(`/api/products/${id}`, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateProductApi = async (id, formData) => {
  const res = await axiosInstance.put(`/api/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
