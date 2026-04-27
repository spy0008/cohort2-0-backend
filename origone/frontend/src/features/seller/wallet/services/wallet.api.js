import axiosInstance from "../../../../shared/lib/axios";

export const getWalletApi = async () => {
  const res = await axiosInstance.get("/api/seller-funds/");
  return res.data;
};

export const getTransactionsApi = async () => {
  const res = await axiosInstance.get("/api/seller-funds/transactions");
  return res.data;
};

export const withdrawApi = async () => {
  const res = await axiosInstance.post("/api/seller-funds/withdraw");
  return res.data;
};