import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { Link, useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const { handleRegister } = useAuth();
  const loading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    contact: "",
    email: "",
    password: "",
    isSeller: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = await handleRegister(formData);

    if (!user) return;

    if (user.role === "buyer") navigate("/");
    else navigate("/seller/dashboard");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      <div className="hidden md:flex relative">
        <motion.img
          src="https://ik.imagekit.io/spy1710/orgone/registerImage.jpg"
          className="absolute inset-0 w-full h-full object-cover"
           initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          alt="Register_image"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <h1 className="text-3xl tracking-widest font-semibold">
            ORgone<span className="text-orange-500">.</span>
          </h1>

          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Where Style Meets Identity
            </h2>
            <p className="text-gray-300 text-sm mt-2">
              Create your presence in the fashion world.
            </p>
          </div>

          <p className="text-xs text-gray-400">© 2026 ORgone</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 bg-white">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm flex flex-col gap-5"
        >
          <h2 className="text-3xl font-semibold">Sign Up</h2>

          {["fullname", "contact", "email"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              className="border-b py-3 outline-none focus:border-orange-500"
              required
            />
          ))}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="border-b py-3 outline-none w-full focus:border-orange-500"
              required
            />

            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-3 cursor-pointer text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              onChange={(e) =>
                setFormData({ ...formData, isSeller: e.target.checked })
              }
            />
            Register as Seller
          </label>

          <button
            disabled={loading}
            className="bg-orange-500 text-white py-3 font-medium hover:bg-orange-400 transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <ContinueWithGoogle />

          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 hover:underline">
              Sign in
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Register;