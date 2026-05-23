// src/pages/ResetPassword.tsx
import { useState, useEffect } from "react";
import {Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Redirect if no email or OTP provided
  useEffect(() => {
    if (!email || !otp) {
      toast.error("Invalid access. Please start from the beginning.");
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  // Check password strength
  useEffect(() => {
    setPasswordStrength({
      minLength: newPassword.length >= 6,
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    });
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/users/reset-password", { 
        email,
        otp,
        newPassword,
      });
      
      toast.success(data.message || "Password reset successfully!");
      
      // Navigate to login page
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to reset password. Please try again.";
      toast.error(errorMessage);
      console.error("Reset password error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!email || !otp) return null;

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
          Create New Password
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Your new password must be different from previously used passwords.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-gray-700 text-sm mb-2 font-medium">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-3 outline-none focus:border-[#2c2a63] focus:ring-2 focus:ring-[#2c2a63]/20 transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Password Strength Indicators */}
          {newPassword && (
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-600 mb-2">Password must contain:</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={16}
                    className={passwordStrength.minLength ? "text-green-500" : "text-gray-300"}
                  />
                  <span className={`text-xs ${passwordStrength.minLength ? "text-green-600" : "text-gray-500"}`}>
                    At least 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={16}
                    className={passwordStrength.hasNumber ? "text-green-500" : "text-gray-300"}
                  />
                  <span className={`text-xs ${passwordStrength.hasNumber ? "text-green-600" : "text-gray-500"}`}>
                    Contains a number
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={16}
                    className={passwordStrength.hasSpecialChar ? "text-green-500" : "text-gray-300"}
                  />
                  <span className={`text-xs ${passwordStrength.hasSpecialChar ? "text-green-600" : "text-gray-500"}`}>
                    Contains a special character
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 text-sm mb-2 font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-3 outline-none focus:border-[#2c2a63] focus:ring-2 focus:ring-[#2c2a63]/20 transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Password Match Indicator */}
          {confirmPassword && (
            <div className="flex items-center gap-2">
              {newPassword === confirmPassword ? (
                <>
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-xs text-green-600">Passwords match</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} className="text-red-500" />
                  <span className="text-xs text-red-600">Passwords do not match</span>
                </>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
            className="w-full bg-[#2c2a63] text-[#EDC9AF] hover:opacity-90 font-medium rounded-lg py-3 mt-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;