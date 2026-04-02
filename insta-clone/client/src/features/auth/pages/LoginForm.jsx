import { useState } from "react";
import "../styles/form.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate();

  async function handleFormSubmit(e) {
    e.preventDefault();

    const result = await handleLogin(username, password); // Use await instead of .then()

    if (result.success) {
      toast.success(result?.message || "Login Successfully!!!");
      navigate("/");
    } else {
      toast.error(result || "Login Failed");
    }

    setUsername("");
    setPassword("");
  }
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            name="username"
            placeholder="Enter username"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            placeholder="Enter password"
            required
          />
          <button type="submit"> {loading ? "Logging..." : "Login"}</button>
        </form>

        <p>
          don't have an account?{" "}
          <Link className="authFormLink" to="/register">
            register.
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginForm;
