import { Lock, Mail, User, Eye, EyeOff, ArrowLeft, Phone } from "lucide-react";
import React, { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../configs/api";
import { useAppDispatch } from "../app/hooks";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";
import loginImg from "/assets/Services/login.png";
import signupImg from "/assets/Services/signup.png";
import './Login.css';

type AuthState = "login" | "signup";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [state, setState] = React.useState<AuthState>("login");
  const [showPassword, setShowPassword] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [mobileError, setMobileError] = React.useState("");

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    
    if (value.length <= 10) {
      setFormData({ ...formData, mobile: value });
      
      // Validate mobile number
      if (value.length > 0 && value.length < 10) {
        setMobileError("Mobile number must be 10 digits");
      } else {
        setMobileError("");
      }
    }
  };

 // ✅ FIXED: Remove unused token parameter

const handlePostLoginRedirect = async () => {
  // ✅ Fetch user role first to determine where to redirect
  try {
    const { data: userData } = await api.get('/users/data');
    const role = userData.user.role;

    // ✅ Sales user → always go to ATS checker
    if (role === 'sales') {
      navigate('/sales/ats-checker');
      return;
    }

    // ✅ Admin user → go to admin dashboard
    if (role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }
  } catch (error) {
    // If role check fails, fall through to normal redirect logic
  }



  // Check if user was trying to select a template before login
  const pendingTemplateId = localStorage.getItem('pendingTemplateId');
  const pendingTemplateName = localStorage.getItem('pendingTemplateName');
  const redirectIntent = localStorage.getItem('redirectAfterLogin');
  
  if (redirectIntent === 'ats-template-selected' && pendingTemplateId) {
    try {
      // Create resume with the template user selected before login
      toast.loading('Creating your resume...', { id: 'create-resume' });
      
      const { data } = await api.post('/resumes/create', {
        title: `${pendingTemplateName || 'New'} Resume`,
        template: pendingTemplateId
      });
      
      // Clear the stored values
      localStorage.removeItem('pendingTemplateId');
      localStorage.removeItem('pendingTemplateName');
      localStorage.removeItem('redirectAfterLogin');
      
      // Show success message
      toast.success('Resume created successfully!', { id: 'create-resume' });
      
      // Redirect to builder with the created resume
      setTimeout(() => {
        navigate(`/app/builder/${data.resume._id}`);
      }, 500);
      
    } catch (error: any) {
      // Clear stored values even on error
      localStorage.removeItem('pendingTemplateId');
      localStorage.removeItem('pendingTemplateName');
      localStorage.removeItem('redirectAfterLogin');
      
      toast.error(error?.response?.data?.message || 'Failed to create resume', { id: 'create-resume' });
      
      // Fallback to app home
      navigate('/app');
    }
} else if (redirectIntent === 'resume-builder') {
    // User wanted to access resume builder
    localStorage.removeItem('redirectAfterLogin');
    navigate('/UserProfile');
  } else {
    // Normal login - go to user profile dashboard
    navigate('/UserProfile');
  }
};

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  // Validate mobile number for signup
  if (state === "signup") {
    if (formData.mobile.length !== 10) {
      setMobileError("Mobile number must be exactly 10 digits");
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
  }

  try {
    const { data } = await api.post(
      `/users/${state === "login" ? "login" : "register"}`,
      formData
    );

    if (state === "login") {
      dispatch(login(data) as any);
      localStorage.setItem("token", data.token);
      toast.success(data.message);
      
      // ✅ UPDATED: Call without token parameter
      await handlePostLoginRedirect();  // Removed data.token argument
      
    } else {
      toast.success("Signup successful! Please login.");
      setState("login");
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error.message);
  }
};

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-slate-50 to-slate-100">
      {/* IMAGE SECTION */}
      <div
        className={`hidden lg:flex items-center justify-center p-12 ${
          state === "login" ? "order-2" : "order-1"
        }`}
      >
        <div className="relative w-full h-full max-w-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#EDC9AF,#2c2a63)] rounded-3xl transform rotate-3"></div>

          <div className="relative h-full bg-white rounded-3xl shadow-2xl overflow-hidden">
            <img
              src={state === "login" ? signupImg : loginImg}
              alt="Auth"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        </div>
      </div>

      {/* FORM SECTION */}
      <div
        className={`flex items-center justify-center p-6 md:p-12 ${
          state === "login" ? "order-1" : "order-2"
        }`}
      >
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">

            {/* Back to Home */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-gray-600 hover:text-[#2c2a63] transition"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#2c2a63" }}>
                {state === "login" ? "Welcome Back" : "Create Account"}
              </h1>

              <p className="text-gray-500">
                {state === "login"
                  ? "Log in to continue building your future."
                  : "Sign up to start your learning journey."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {state === "signup" && (
                <>
                  {/* Full Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required={state === "signup"}
                      />
                    </div>
                  </div>

                  {/* Mobile Number Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="mobile"
                        placeholder="Enter 10-digit mobile number"
                        className={`w-full pl-12 pr-4 py-3 border ${
                          mobileError ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:outline-none focus:ring-2 ${
                          mobileError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                        } focus:border-transparent transition`}
                        value={formData.mobile}
                        onChange={handleMobileChange}
                        maxLength={10}
                        required={state === "signup"}
                      />
                    </div>
                    {mobileError && (
                      <p className="text-red-500 text-sm mt-1">{mobileError}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      {formData.mobile.length}/10 digits
                    </p>
                  </div>
                </>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {state === "login" && (
                <div className="text-right">
                  <Link
                    to="/forgot"
                    className="text-sm text-[#2c2a63] hover:text-[#1f1d4f] font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#2c2a63] text-[#EDC9AF] rounded-xl py-3.5 font-semibold text-lg hover:bg-[#1f1d4f] transform hover:scale-[1.02] transition-all shadow-lg"
              >
                {state === "login" ? "Log In" : "Sign Up"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {state === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setState("signup");
                        setFormData({ name: "", email: "", password: "", mobile: "" });
                        setShowPassword(false);
                        setMobileError("");
                      }}
                      className="font-semibold hover:underline"
                      style={{ color: "#2c2a63" }}
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setState("login");
                        setFormData({ name: "", email: "", password: "", mobile: "" });
                        setShowPassword(false);
                        setMobileError("");
                      }}
                      className="font-semibold hover:underline"
                      style={{ color: "#2c2a63" }}
                    >
                      Log In
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;