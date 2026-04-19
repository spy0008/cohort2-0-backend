import axiosInstance from "../../../shared/lib/axios";

export async function register({
  email,
  contact,
  password,
  fullname,
  isSeller,
}) {
  const res = await axiosInstance.post("/auth/register", {
    email,
    contact,
    password,
    fullname,
    isSeller,
  });
  return res.data;
}

export async function login({ email, password }) {
  const res = await axiosInstance.post("/auth/login", { email, password });
  return res.data;
}

export async function getMe() {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
}
