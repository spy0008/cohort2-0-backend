import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const EmailVerify = () => {
  const [searchParams] = useSearchParams();
  const tokenFromParams = searchParams.get("token") || "";
  const [token, setToken] = useState(tokenFromParams);
  const [loading, setLoading] = useState(false);
  const isVerified = useSelector((state) => state.auth.user?.verified);
  const { handleVerify } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenFromParams) setToken(tokenFromParams);
  }, [tokenFromParams]);

  useEffect(() => {
    if (isVerified) {
      navigate("/");
    }
  }, [isVerified, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Token not available");
      return;
    }
    try {
      setLoading(true);
      const result = await handleVerify(token);

      if (result?.success) {
        toast.success(result.message || "Email Verification Done.");
        navigate("/login");
      } else {
        toast.error(result.message || "Verification Failed");
      }
    } catch (error) {
      toast.error(error?.message || "Backend Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Verify Your Email
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
