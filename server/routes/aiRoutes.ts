import express, { Router } from "express";
import protect from "../middlewares/authMiddleware";
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume, getUploadedResumes } from "../controllers/aiController";

const aiRouter: Router = express.Router();

aiRouter.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-job-desc", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, uploadResume);
aiRouter.get("/uploaded-resumes", protect, getUploadedResumes);

export default aiRouter;
