import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleRegister, loading } = useAuth();
  const navigate = useNavigate();

  async function handleFormSubmit(e) {
    e.preventDefault();
    const result = await handleRegister(username, email, password);
    I;

    if (result.success) {
      toast.success(result?.message || "Login Successfully!!!");
      navigate("/");
    } else {
      toast.error(result || "Register Failed");
    }
    setUsername("");
    setEmail("");
    setPassword("");
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            placeholder="Enter email"
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
          <button type="submit">
            {loading ? "Registering..." : "Regiseter"}
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link className="authFormLink" to="/login">
            Login.
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterForm;
