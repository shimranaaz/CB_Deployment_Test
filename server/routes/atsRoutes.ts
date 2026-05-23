import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  uploadAndAnalyzeResume,
  getATSReport,
} from '../controllers/atsController.js';
import {
  getAllATSSubmissions,
  deleteATSSubmission,
} from '../controllers/atsAdminController.js';
import protect from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// ✅ FIXED: Disk storage so req.file.path is available in controller
const uploadDir = path.join(__dirname, '..', 'uploads', 'ats-resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Created uploads/ats-resumes directory');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'resume-' + uniqueSuffix + ext);
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT are allowed.'));
  }
};

const upload = multer({
  storage,  // ✅ Now using diskStorage
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

router.post('/analyze', upload.single('resume'), uploadAndAnalyzeResume);
router.get('/report/:id', getATSReport);
router.get('/', protect, authorizeRoles('admin', 'sales'), getAllATSSubmissions);
router.delete('/:id', protect, authorizeRoles('admin'), deleteATSSubmission);

export default router;