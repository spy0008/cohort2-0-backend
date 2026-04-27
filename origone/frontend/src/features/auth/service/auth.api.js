import axiosInstance from "../../../shared/lib/axios";

export async function register({
  email,
  contact,
  password,
  fullname,
  isSeller,
}) {
  const res = await axiosInstance.post("/api/auth/register", {
    email,
    contact,
    password,
    fullname,
    isSeller,
  });
  return res.data;
}

export async function login({ email, password }) {
  const res = await axiosInstance.post("/api/auth/login", { email, password });
  return res.data;
}

export async function getMe() {
  const res = await axiosInstance.get("/api/auth/me");
  return res.data;
}

export async function logout() {
  const res = await axiosInstance.post("/api/auth/logout");
  return res.data;
}

export const updateBankApi = (data) => {
  return axiosInstance.post("/api/auth/bank-details", data);
};
