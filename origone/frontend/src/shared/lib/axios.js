import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      import("../../app/app.store").then(({ store }) => {
        try {
          store.dispatch({ type: "auth/setUser", payload: null });
        } catch (e) {
          console.error("Failed to dispatch logout action", e);
        }
      });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
