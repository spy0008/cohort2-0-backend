import axios from "axios";
import { setUser } from "../../features/auth/state/auth.slice";
import { useDispatch } from "react-redux";


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
      const dispatch = useDispatch()
      dispatch(setUser(null));
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
