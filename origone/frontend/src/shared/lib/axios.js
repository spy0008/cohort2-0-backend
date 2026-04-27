import axios from "axios";
import { store } from "../../app/app.store";
import { setClearUser } from "../../features/auth/state/auth.slice";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
});

let isLoggingOut = false;

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    const isAuthRoute =
      url.includes("/api/auth/login") ||
      url.includes("/api/auth/register") ||
      url.includes("/api/auth/me");

    if (status === 401 && !isAuthRoute) {
      if (!isLoggingOut) {
        isLoggingOut = true;

        try {
          store.dispatch(setClearUser());
        } catch (e) {
          console.error("Logout dispatch failed:", e);
        }

        setTimeout(() => {
          isLoggingOut = false;
        }, 1000);
      }
    }

    if (!error.response) {
      console.error("Network error or server unreachable");
    }

    if (status === 500) {
      console.error("Server error");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
