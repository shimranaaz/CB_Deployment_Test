import express from 'express';
import multer from 'multer';
import { useLinkedInOptimization } from '../controllers/linkedinController.js';
import { analyzeLinkedIn, checkLinkedInAccess } from '../controllers/linkedinController.js';
import protect from '../middlewares/authMiddleware.js';
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
        ];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type'));
        }
    },
});
router.get('/check-access', protect, checkLinkedInAccess);
router.post('/analyze', upload.single('resume'), analyzeLinkedIn);
router.post('/use-optimization', protect, useLinkedInOptimization);
export default router;
