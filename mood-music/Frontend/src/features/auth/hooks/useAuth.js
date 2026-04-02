import { AuthContext } from "../auth.context.jsx";
import { register, login, logout, getMe } from "../services/auth.api.js";
import { useContext, useEffect } from "react";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  async function handleRegister({ username, email, password }) {
    setLoading(true);

    const data = await register({ email, password, username });

    setUser(data.user);
    setLoading(false);
  }

  async function handleLogin({ username, email, password }) {
    setLoading(true);

    const data = await login({ email, username, password });

    setUser(data.user);
    setLoading(false);
  }

  async function handleGetMe() {
    setLoading(true);
    const data = await getMe();
    setUser(data.user);
    setLoading(false);
  }

  async function handleLogout() {
    setLoading(true);

    const data = await logout();

    setUser(null);
    setLoading(false);
  }

  useEffect(() => {
    handleGetMe();
  }, []);

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleLogout,
    handleGetMe,
  };
};
