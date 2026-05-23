import express from "express";
import { getAllTerms, getTerm, updateTerm, initializeTerms, } from "../controllers/termsController.js";
import protect from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";
const termsRouter = express.Router();
// ==================== PUBLIC ROUTES ====================
// Get all terms sections (for Terms page)
termsRouter.get("/", getAllTerms);
// Get single term section
termsRouter.get("/:section", getTerm);
// ==================== ADMIN ONLY ROUTES ====================
// Update a term section
termsRouter.put("/:section", protect, adminOnly, updateTerm);
// Initialize default terms (run once)
termsRouter.post("/initialize", protect, adminOnly, initializeTerms);
console.log("✅ Terms routes registered successfully");
export default termsRouter;
