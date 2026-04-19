import {
  setClearUser,
  setError,
  setLoading,
  setUser,
} from "../state/auth.slice";
import { register, login, getMe, logout } from "../service/auth.api";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({
    email,
    contact,
    password,
    fullname,
    isSeller = false,
  }) {
    try {
      dispatch(setLoading(true));
      const data = await register({
        email,
        contact,
        password,
        fullname,
        isSeller,
      });
      dispatch(setUser(data.user));
      dispatch(setError(null));
      toast.success("Register Successfully 🔥");
      return data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Register failed");
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });

      dispatch(setUser(data.user));
      toast.success("Welcome back 🔥");
      dispatch(setError(null));

      return data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetUser() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setUser(null));
      dispatch(
        setError(
          error.response?.data?.message ||
            "Fetching user failed, please login again",
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    try {
      dispatch(setLoading(true));
      await logout();
      dispatch(setClearUser());
      dispatch(setError(null));
      toast.success("Logged out 👋");
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Logout failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleRegister, handleLogin, handleGetUser, handleLogout };
};
