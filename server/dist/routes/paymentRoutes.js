import express from "express";
import { createOrder, verifyPayment, handleWebhook, getUserPayments, checkTemplateAccess, checkDownloadLimit, trackDownload, checkResumeLimit, logPaymentFailure } from "../controllers/paymentController.js";
import protect from "../middlewares/authMiddleware.js";
const paymentRouter = express.Router();
// ==================== PROTECTED ROUTES ====================
paymentRouter.post("/create-order", protect, createOrder);
paymentRouter.post("/verify", protect, verifyPayment);
paymentRouter.get("/my-payments", protect, getUserPayments);
// Template access check
paymentRouter.get("/check-access/:templateId", protect, checkTemplateAccess);
// Download limit management
paymentRouter.get("/check-download-limit", protect, checkDownloadLimit);
paymentRouter.post("/track-download", protect, trackDownload);
// Resume limit check (before opening new resume)
paymentRouter.get("/check-resume-limit", protect, checkResumeLimit);
paymentRouter.post("/log-failure", protect, logPaymentFailure);
// ==================== WEBHOOK (PUBLIC) ====================
paymentRouter.post("/webhook", handleWebhook);
console.log("✅ Payment routes registered successfully");
export default paymentRouter;
