import { Link, useNavigate } from "react-router-dom";
import "../styles/form.scss";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const LoginForm = () => {
  const { loading, handleLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    await handleLogin({ username, password });
    navigate("/"); 
  }
  return (
    <main className="main-body">
      <div className="form-body">
        <h1>Login</h1>
        <p>welcome back music lover</p>
        <form onSubmit={handleSubmit} className="form">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Enter Username"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter Password"
          />
          <button className="login-btn">Login</button>
          <p>
            Don't have an account?{" "}
            <Link className="auth-link" to="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default LoginForm;
