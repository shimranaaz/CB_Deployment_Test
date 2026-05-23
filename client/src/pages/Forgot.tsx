import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/users/forgot-password", { email });
      toast.success(data.message || "OTP sent successfully!");
      
      // Navigate to OTP verification page with email
      navigate("/verify-otp", { state: { email } });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-1">
          <Link to="/">
            <img
              src="/logo-Cb.png"
              alt="Career Logo"
              className="object-cover"
              style={{ height: "60px", width: "230px", marginTop: "-15px" }}
            />
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#2c2a63] text-center mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Enter your email address to receive a verification code to reset your password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-2 font-medium">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-[#2c2a63] focus:ring-2 focus:ring-[#2c2a63]/20 transition-all"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2c2a63] text-[#EDC9AF] hover:opacity-90 font-medium rounded-lg py-3 mt-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending OTP..." : "Send Reset Link"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2 text-[#2c2a63] hover:text-[#2c2a63]/80 text-sm font-semibold mt-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;