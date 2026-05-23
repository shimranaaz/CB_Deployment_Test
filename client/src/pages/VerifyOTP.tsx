// src/pages/VerifyOTP.tsx
import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      toast.error("Please enter your email first");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
    
    if (newOtp.length < 6) {
      inputRefs.current[newOtp.length]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      await api.post("/users/verify-otp", { email, otp: otpString });
      toast.success("OTP verified successfully!");
      
      // Navigate to reset password page
      navigate("/reset-password", { state: { email, otp: otpString } });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);

    try {
      const { data } = await api.post("/users/resend-otp", { email });
      toast.success(data.message || "New OTP sent successfully!");
      
      // Reset timer and OTP
      setResendTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to resend OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-3 sm:p-4 md:p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-4 sm:p-6 md:p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-1 mb-4 sm:mb-6">
          <Link to="/">
            <img
              src="/logo-Cb.png"
              alt="Career Logo"
              className="object-cover h-10 w-40 sm:h-12 sm:w-48 md:h-14 md:w-56"
              style={{ marginTop: "-8px" }}
            />
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2c2a63] text-center mb-2">
          Enter verification code
        </h1>
        <p className="text-sm sm:text-base text-gray-500 text-center mb-6 sm:mb-8 px-2">
          Please enter the code we emailed to<br />
          <span className="font-medium text-gray-700 break-all">{email}</span>
        </p>

        {/* OTP Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-1.5 sm:gap-2 justify-center mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded-lg outline-none focus:border-[#2c2a63] focus:ring-2 focus:ring-[#2c2a63]/20 transition-all bg-[#E8F5E9]"
                disabled={loading}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className="w-full bg-[#2c2a63] text-[#EDC9AF] hover:opacity-90 font-medium rounded-lg py-2.5 sm:py-3 text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "Verifying..." : "Continue"}
            <ArrowRight size={18} className="sm:w-5 sm:h-5" />
          </button>
        </form>

        {/* Resend OTP */}
        <div className="text-center mt-4 sm:mt-6">
          {canResend ? (
            <button
              onClick={handleResendOTP}
              disabled={loading}
              className="text-[#2c2a63] hover:text-[#2c2a63]/80 font-semibold text-xs sm:text-sm transition-colors disabled:opacity-50"
            >
              Resend code
            </button>
          ) : (
            <p className="text-gray-500 text-xs sm:text-sm">
              Resend code in <span className="font-semibold text-[#2c2a63]">{formatTime(resendTimer)}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;