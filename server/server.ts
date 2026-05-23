import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import termsRouter from './routes/termsRoutes.js';
import coverLetterRouter from './routes/coverLetterRoutes.js';
import atsRouter from './routes/atsRoutes.js';
import pricingRouter from './routes/pricingRoutes.js';
import couponRouter from "./routes/couponRoutes.js";
import ebookRouter from "./routes/ebookRoutes.js";

import linkedinRoutes from './routes/linkedin.routes.js';


import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT: number = parseInt(process.env.PORT || "5000", 10);

// Silence logs in production to save memory
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.info = () => {};
}

// Database connection
await connectDB();
// ==================== MAIL CONFIGURATION CHECK ====================
console.log("\n📧 Mail Configuration:");
if (process.env.RESEND_API_KEY) {
  console.log("✅ Resend API Key: Configured");
  console.log(`📬 Emails will be sent from: info@careerblueprint.co.in`);
} else {
  console.log("❌ Resend API Key: Missing");
  console.log("⚠️  Email functionality will not work!");
  console.log("💡 Add RESEND_API_KEY to your .env file");
}
console.log("");

// ⚠️ Razorpay Webhook MUST be raw
// ✅ CORS must be FIRST before everything
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://careersblueprint.netlify.app",
      "https://careerblueprint.co.in",      
      "https://www.careerblueprint.co.in", 
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);



app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => res.send("Server is live..."));

// ==================== ROUTES ====================
app.use('/api/users', userRouter);
console.log("📌 Mounted user routes at /api/users");

app.use('/api/resumes', resumeRouter);
console.log("📌 Mounted resume routes at /api/resumes");

app.use('/api/ai', aiRouter);
console.log("📌 Mounted AI routes at /api/ai");

app.use('/api/payments', paymentRouter);
console.log("📌 Mounted payment routes at /api/payment");

app.use('/api/admin', adminRouter);
console.log("📌 Mounted admin routes at /api/admin");

app.use('/api/terms', termsRouter);
console.log("📌 Mounted terms routes at /api/terms");

app.use('/api/cover-letters', coverLetterRouter);
console.log("📌 Mounted cover letter routes at /api/cover-letters");

app.use('/api/ats', atsRouter);
console.log("📌 Mounted ATS routes at /api/ats");

app.use('/api/pricing', pricingRouter);
console.log("📌 Mounted pricing routes at /api/pricing");

app.use('/api/coupons', couponRouter);

app.use('/api/ebooks', ebookRouter);
console.log("📌 Mounted ebook routes at /api/ebooks");

app.use('/api/linkedin', linkedinRoutes);

console.log('\n📂 UPLOADS CONFIGURATION:');
console.log('   Current __dirname:', __dirname);

// Try different possible paths
const uploadsPath = path.join(__dirname, '../uploads');
const uploadsPathAlt = path.join(__dirname, 'uploads');
const uploadsPathRoot = path.join(__dirname, '../../uploads');

let finalUploadsPath = uploadsPath;

// Auto-detect correct path
if (fs.existsSync(uploadsPath)) {
  finalUploadsPath = uploadsPath;
  console.log('   ✅ Found uploads at:', uploadsPath);
} else if (fs.existsSync(uploadsPathAlt)) {
  finalUploadsPath = uploadsPathAlt;
  console.log('   ✅ Found uploads at:', uploadsPathAlt);
} else if (fs.existsSync(uploadsPathRoot)) {
  finalUploadsPath = uploadsPathRoot;
  console.log('   ✅ Found uploads at:', uploadsPathRoot);
} else {
  // Create the folder if it doesn't exist
  finalUploadsPath = uploadsPath;
  fs.mkdirSync(finalUploadsPath, { recursive: true });
  console.log('   ℹ️  Created uploads folder at:', finalUploadsPath);
}

// Create ats-resumes subfolder if it doesn't exist
const atsPath = path.join(finalUploadsPath, 'ats-resumes');
if (!fs.existsSync(atsPath)) {
  fs.mkdirSync(atsPath, { recursive: true });
  console.log('   ✅ Created ats-resumes folder');
} else {
  const files = fs.readdirSync(atsPath);
  console.log(`   📄 ATS files found: ${files.length}`);
  if (files.length > 0) {
    console.log(`   📋 Sample file: ${files[0]}`);
  }
}

// Serve static files
app.use('/uploads', express.static(finalUploadsPath));
console.log('   🌐 Serving static files from:', finalUploadsPath);
console.log('   🔗 Access via: http://localhost:' + PORT + '/uploads/ats-resumes/filename.pdf\n');


// Auto-cleanup uploads every 10 mins
setInterval(() => {
  const cleanFolder = (folderPath: string) => {
    if (!fs.existsSync(folderPath)) return;
    fs.readdirSync(folderPath).forEach(file => {
      const fp = path.join(folderPath, file);
      const ageMs = Date.now() - fs.statSync(fp).mtimeMs;
      if (ageMs > 10 * 60 * 1000) { // older than 10 mins
        fs.unlinkSync(fp);
        console.log('🗑️ Auto-deleted:', file);
      }
    });
  };
  cleanFolder(path.join(finalUploadsPath, 'ats-resumes'));
  cleanFolder(path.join(finalUploadsPath, 'linkedin-resumes'));
}, 10 * 60 * 1000);


const BACKEND_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
setInterval(() => {
  fetch(`${BACKEND_URL}/`)
    .then(() => console.log('🏓 Keep-alive ping sent'))
    .catch(() => {});
}, 14 * 60 * 1000);



app.listen(PORT, () => {
  console.log(`\n✅ Server is running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});