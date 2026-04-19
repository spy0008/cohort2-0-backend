import axios from "axios";
import { store } from "../../app/app.store";
import { setUser } from "../../features/auth/state/auth.slice";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      store.dispatch(setUser(null));
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
