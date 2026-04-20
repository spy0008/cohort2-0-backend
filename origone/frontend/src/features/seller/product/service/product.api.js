import axiosInstance from "../../../../shared/lib/axios";

export async function createProductApi(formData) {
  const res = await axiosInstance.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

export async function getSellerProductsApi() {
  const res = await axiosInstance.get("/products/seller", {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}