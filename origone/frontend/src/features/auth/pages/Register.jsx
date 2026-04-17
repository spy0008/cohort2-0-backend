import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    password: "",
    isSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await handleRegister({
      email: formData.email,
      contact: formData.contactNumber,
      password: formData.password,
      isSeller: formData.isSeller,
      fullname: formData.fullName,
    });
    if (user.role == "buyer") {
      navigate("/");
    } else if (user.role == "seller") {
      navigate("/seller/dashboard");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center text-white overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-125 h-125 bg-purple-500/20 blur-[140px] -top-25 -left-25" />
        <div className="absolute w-100 h-100 bg-[#C6A96B]/20 blur-[140px] -bottom-25 -right-25" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-md 
        bg-white/5 backdrop-blur-xl 
        border border-white/10 
        rounded-3xl p-10 
        shadow-[0_20px_80px_rgba(0,0,0,0.8)]"
      >
        <motion.h2
          variants={item}
          className="text-lg tracking-[0.4em] text-[#C6A96B]"
        >
          ORgone.
        </motion.h2>

        <motion.p variants={item} className="text-sm text-white/50 mb-2">
          Built to Be Seen.
        </motion.p>

        <motion.h1 variants={item} className="text-4xl font-bold mb-8">
          Create Your Identity
        </motion.h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {["fullName", "contactNumber", "email", "password"].map((field) => (
            <motion.input
              key={field}
              variants={item}
              type={field === "password" ? "password" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field}
              required
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 
              focus:border-[#C6A96B] focus:ring-2 focus:ring-[#C6A96B]/30
              transition-all duration-300 outline-none"
            />
          ))}

          <motion.label
            variants={item}
            className="flex items-center gap-3 text-sm text-gray-300"
          >
            <input
              type="checkbox"
              name="isSeller"
              checked={formData.isSeller}
              onChange={handleChange}
              className="accent-[#C6A96B]"
            />
            Register as Seller
          </motion.label>

          <motion.button
            variants={item}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-4 py-3 rounded-xl 
            bg-linear-to-r from-[#C6A96B] to-[#E6C98F] 
            text-black font-semibold
            shadow-[0_0_30px_rgba(198,169,107,0.4)]"
          >
            Sign Up
          </motion.button>

          <motion.div variants={item}>
            <ContinueWithGoogle />
          </motion.div>

          <motion.p
            variants={item}
            className="text-center text-sm text-gray-400"
          >
            Already have an account?{" "}
            <a href="/login" className="text-[#C6A96B] hover:underline">
              Sign in
            </a>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
