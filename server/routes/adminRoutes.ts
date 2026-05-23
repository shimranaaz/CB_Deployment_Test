import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getAllPayments,
  getAllResumes,
  updateUserPlan,
  deleteUser,
  deletePayment,
  deleteResume,
  getFailedPayments,
  createCoupon,
  getAllCoupons,
  deleteCoupon,

  getUserResumes,
  createResumeForUser,
  updateResumeForUser,
  deleteResumeForUser,
  transferResume,
  publishResumeForUser,
  unpublishResumeForUser,

} from "../controllers/adminController.js";
import {
  getAllATSSubmissions,
  deleteATSSubmission,
  getATSStats,
  getATSSubmissionById
} from "../controllers/atsAdminController.js";
import protect from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";
import salesOrAdmin from "../middlewares/salesOrAdminMiddleware.js";
import { getAllLinkedInSubmissions, deleteLinkedInSubmission } from "../controllers/linkedinAdminController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const adminRouter = express.Router();

// ==================== DASHBOARD ====================
adminRouter.get("/stats", protect, salesOrAdmin, getDashboardStats);

// ==================== USERS ====================
adminRouter.get("/users", protect, salesOrAdmin, getAllUsers);
adminRouter.put("/users/:userId/plan", protect, adminOnly, updateUserPlan);
adminRouter.delete("/users/:userId", protect, adminOnly, deleteUser);

// ==================== PAYMENTS ====================
adminRouter.get("/payments", protect, adminOnly, getAllPayments);
adminRouter.get("/payments/failed", protect, adminOnly, getFailedPayments);
adminRouter.delete("/payments/:paymentId", protect, adminOnly, deletePayment);

// ==================== RESUMES ====================
adminRouter.get("/resumes", protect, salesOrAdmin, getAllResumes);
adminRouter.delete("/resumes/:resumeId", protect, adminOnly, deleteResume);

// ==================== ATS CHECKER ====================
adminRouter.get("/ats", protect, salesOrAdmin, getAllATSSubmissions);
adminRouter.get("/ats/stats", protect, salesOrAdmin, getATSStats);
adminRouter.get("/ats/:id", protect, salesOrAdmin, getATSSubmissionById);
adminRouter.delete("/ats/:id", protect, adminOnly, deleteATSSubmission);

// ==================== COUPONS ====================
adminRouter.post("/coupons", protect, adminOnly, createCoupon);
adminRouter.get("/coupons", protect, adminOnly, getAllCoupons);
adminRouter.delete("/coupons/:couponId", protect, adminOnly, deleteCoupon);

adminRouter.get("/linkedin", protect, salesOrAdmin, getAllLinkedInSubmissions);
adminRouter.delete("/linkedin/:id", protect, adminOnly, deleteLinkedInSubmission);
// ==================== ADMIN RESUME MANAGER ====================
adminRouter.get("/users/:userId/resumes", protect, salesOrAdmin, getUserResumes);
adminRouter.post("/users/:userId/resumes", protect, salesOrAdmin, upload.single("resumePdf"), createResumeForUser);
adminRouter.put("/users/:userId/resumes/:resumeId", protect, salesOrAdmin, upload.single("resumePdf"), updateResumeForUser);
adminRouter.delete("/users/:userId/resumes/:resumeId", protect, adminOnly, deleteResumeForUser);
adminRouter.put("/resumes/:resumeId/transfer", protect, adminOnly, transferResume);

// ==================== PUBLISH / UNPUBLISH ====================
adminRouter.put("/resumes/:resumeId/publish", protect, salesOrAdmin, publishResumeForUser);
adminRouter.put("/resumes/:resumeId/unpublish", protect, adminOnly, unpublishResumeForUser);


console.log("✅ Admin routes registered successfully");

export default adminRouter;