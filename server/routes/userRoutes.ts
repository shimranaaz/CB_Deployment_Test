import express from "express";
import {
  getUserById,
  getUserResumes,
  loginUser,
  registerUser,
  changePassword,
  deleteAccount,
  updateProfile,
  forgotPassword,
  verifyOTP,
  resetPassword,
  resendOTP,
  sendContactMessage, 
} from "../controllers/userController";

import protect from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

// ==================== AUTH ROUTES ====================
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// ==================== PASSWORD RESET ROUTES (PUBLIC) ====================
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/resend-otp", resendOTP);

// ==================== CONTACT FORM ROUTE (PUBLIC) ====================
userRouter.post("/contact", sendContactMessage);

// ==================== USER DATA ROUTES (PROTECTED) ====================
userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect, getUserResumes);

// ==================== PROFILE MANAGEMENT (PROTECTED) ====================
userRouter.put("/update-profile", protect, updateProfile);
userRouter.put("/change-password", protect, changePassword);
userRouter.delete("/delete-account", protect, deleteAccount);

console.log("✅ User routes registered successfully");

export default userRouter;