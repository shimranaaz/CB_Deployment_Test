import React, { useEffect } from "react";
import { Route, Routes, Outlet } from "react-router-dom";

import Home from "./pages/Home";
import SharedResumeView from "./pages/SharedResumeView"
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import CoverLetterBuilder from "./pages/CoverLetterBuilder";
import Contact from "./components/home/Contact";
import Companies from "./pages/Companies";
import ServiceDetail from "./pages/ServiceDetail";
import UserProfile from "./pages/UserProfile";
import ResumeTemplates from "./pages/ResumeTemplates";
import ProStatusManager from "./pages/ProStatusManager";
import MissionSection from "./components/home/MissionSection";
import NotFound from "./pages/NotFound";
import ATSChecker from './components/ATSChecker';

import LinkedInScoreChecker from './components/LinkedInScoreChecker';
import LinkedInOptimizedProfile from './components/Linkedinoptimizedprofile';

import ATSReportPage from "./pages/ATSReportPage";
import SalesATSChecker from "./pages/SalesATSChecker";

import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";

import Login from "./pages/Login";
import ForgotPassword from "./pages/Forgot";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";

import AdminDashboard from "./pages/AdminDashboard";

import Interviewprep from "./components/home/Interviewprep";
import CareerCoaching from "./components/home/CareerCoaching";
import NetworkingStrategies from "./components/home/NetworkingStrategies";

import InterviewPromo from "./components/home/InterviewPromo";
import CareerCoachPromo from "./components/home/CareerCoachPromo";
import NetworkingPromo from "./components/home/NetworkingPromo";

import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

import ScrollToTop from "./components/home/ScrollToTop";
import ProtectedRoute from "./components/home/ProtectedRoute";

import { useDispatch } from "react-redux";
import api from "./configs/api";
import { login, setLoading } from "./app/features/authSlice";
import { Toaster } from "react-hot-toast";

interface User {
  name: string;
  email: string;
  id: string;
  role: string;
  plan?: string;
}

interface GetUserDataResponse {
  user: User;
}

const App: React.FC = () => {
  const dispatch = useDispatch();

  const getUserData = async (): Promise<void> => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        const { data } = await api.get<GetUserDataResponse>("/users/data");

        if (data.user) {
          dispatch(login({ token, user: data.user }));
        }
      }

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services/:serviceId" element={<ServiceDetail />} />
        <Route path="/resume/templates" element={<ResumeTemplates />} />
        <Route path="/interviewprep" element={<Interviewprep />} />
        <Route path="/career-coaching" element={<CareerCoaching />} />
        <Route path="/networking-strategies" element={<NetworkingStrategies />} />
        <Route path="/MissionSection" element={<MissionSection />} />
        <Route path="/interview-promo" element={<InterviewPromo />} />
        <Route path="/career-promo" element={<CareerCoachPromo />} />
        <Route path="/networking-promo" element={<NetworkingPromo />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        <Route path="/ats-checker" element={<ATSChecker />} />

        <Route path="/view/:resumeId" element={<SharedResumeView />} />
        <Route path="/ats-report" element={<ATSReportPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/login/*" element={<NotFound />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/forgot/*" element={<NotFound />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/verify-otp/*" element={<NotFound />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/*" element={<NotFound />} />

        <Route path="/linkedin-checker" element={<LinkedInScoreChecker />} />
        <Route path="/linkedin-optimized" element={<LinkedInOptimizedProfile />} />

        <Route
          path="/UserProfile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales/ats-checker"
          element={
            <ProtectedRoute allowedRoles={["sales", "admin"]}>
              <SalesATSChecker />
            </ProtectedRoute>
          }
        />

        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />

        <Route path="/prostatusmanager" element={<ProStatusManager />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
          <Route path="cover-letter/builder/:id" element={<CoverLetterBuilder />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Outlet />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>


        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;