import React, { useState } from "react";
import { Link, Navigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const loading = useSelector((state) => state.auth.loading);
  const user = useSelector((state) => state.auth.user);
  const { handleRegister } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await handleRegister({
      username: form.username,
      email: form.email,
      password: form.password,
    });
    if (result?.success) {
      toast.success(
        <>
          {result?.message}{" "}
          <a
            href="https://mail.google.com"
            target="_self"
            className="text-blue-400 hover:underline font-medium"
          >
            Click here to open Gmail
          </a>
        </>,
      );
    } else {
      toast.error(result?.message || "Registration Failed");
    }
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
        <div
          style={{
            position: "absolute",
            left: "-10%",
            top: "-20%",
            width: "60%",
            height: "120%",
            background:
              "radial-gradient(closest-side, rgba(139,92,246,0.16), transparent)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-10%",
            bottom: "-10%",
            width: "50%",
            height: "90%",
            background:
              "radial-gradient(closest-side, rgba(99,102,241,0.08), transparent)",
            filter: "blur(80px)",
          }}
        />
      </div>
      <div className="w-full max-w-md bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-white">
            Create your account
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Fast, clean and secure signup
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Username
            </label>
            <input
              required
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Your username"
              className="w-full px-4 py-3 bg-transparent border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Email
            </label>
            <input
              required
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-transparent border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Password
            </label>
            <input
              required
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter a strong password"
              className="w-full pr-12 px-4 py-3 bg-transparent border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-12  -translate-y-1/2 text-sm text-slate-300/80 px-2 py-1 rounded"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-lg text-white font-semibold bg-linear-to-r from-purple-600 to-purple-400 hover:opacity-95 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-sm text-slate-400 mt-4">
          Already have an Account?{" "}
          <Link className="text-purple-300 hover:underline" to="/login">
            Login here
          </Link>
        </p>

        <p className="text-center text-sm text-slate-400 mt-4">
          By creating an account you agree to the terms.
        </p>
      </div>
    </div>
  );
};

export default Register;
