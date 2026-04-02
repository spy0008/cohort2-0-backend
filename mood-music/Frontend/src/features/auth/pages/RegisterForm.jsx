import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RegisterForm = () => {
  const { loading, handleRegister } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    await handleRegister({ email, password, username });
    navigate("/");
  }
  return (
    <main className="main-body">
      <div className="form-body">
        <h1>Register</h1>
        <p>welcome to mood music, play music according to your mood</p>
        <form onSubmit={handleSubmit}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Enter Username"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter Password"
          />
          <button>Register</button>
          <p>
            Already have an account?{" "}
            <Link className="auth-link" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default RegisterForm;
