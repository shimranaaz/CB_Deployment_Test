import express from "express";
import protect from "../middlewares/authMiddleware";
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume } from "../controllers/aiController";
const aiRouter = express.Router();
aiRouter.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-job-desc", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, uploadResume);
export default aiRouter;
