import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

let logoutHandler = null;

export const setLogoutHandler = (fn) => {
  logoutHandler = fn;
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    const isAuthRoute =
      url.includes("/api/auth/login") ||
      url.includes("/api/auth/register") ||
      url.includes("/api/auth/me");

    if (status === 401 && !isAuthRoute) {
      logoutHandler && logoutHandler();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;