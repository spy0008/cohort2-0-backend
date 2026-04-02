import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register } from "../services/auth.api.js";

export function useAuth() {
  const context = useContext(AuthContext);

  const { user, setUser, setLoading, loading } = context;

  const handleLogin = async (username, password) => {
    setLoading(true);
    try {
      const result = await login(username, password);

      if (result.success) {
        setUser(result.user);
        return result;
      } else {
        return result.error;
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setLoading(true);
    try {
      const result = await register(username, email, password);

      if (result.success) {
        setUser(result.user);
        return result;
      } else {
        return result.error;
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { user, handleLogin, handleRegister, loading };
}
