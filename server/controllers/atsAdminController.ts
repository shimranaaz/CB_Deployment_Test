import { Request, Response } from 'express';
import ATS from '../models/ATS.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all ATS submissions for admin
export const getAllATSSubmissions = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const searchQuery = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { mobile: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const atsSubmissions = await ATS.find(searchQuery)
      .select('fullName email mobile atsScore feedback createdAt resumePath')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await ATS.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      submissions: atsSubmissions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get ATS Submissions Error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch ATS submissions' });
  }
};

// Delete ATS submission and PDF file
export const deleteATSSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const submission = await ATS.findById(id);

    if (!submission) {
      return res.status(404).json({ message: 'ATS submission not found' });
    }

    //  DELETE PDF FILE - WINDOWS PATH FIX
    if (submission.resumePath) {
      try {
        // Normalize Windows backslashes to forward slashes
        let cleanPath = submission.resumePath.replace(/\\/g, '/').replace(/^\/+/, '');

        // Build absolute path using process.cwd() (works on both Windows & Linux)
        const filePath = path.join(process.cwd(), cleanPath);

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔍 DELETE ATTEMPT (CROSS-PLATFORM):');
        console.log('📝 Resume path from DB:', submission.resumePath);
        console.log('🧹 Cleaned path:', cleanPath);
        console.log('📂 Full file path:', filePath);
        console.log('📂 Process CWD:', process.cwd());
        console.log('📁 File exists?', fs.existsSync(filePath));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`✅ Successfully deleted PDF file: ${path.basename(filePath)}`);
        } else {
          console.log(`⚠️ File not found - will delete DB record only`);
        }
      } catch (fileError: any) {
        console.error('❌ Error deleting file:', fileError.message);
      }
    }

    // Delete from database
    await ATS.findByIdAndDelete(id);
    console.log(`✅ Successfully deleted ATS submission from database: ${id}`);

    res.status(200).json({
      success: true,
      message: 'ATS submission deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete ATS Submission Error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete ATS submission' });
  }
};

// Get ATS stats for dashboard
export const getATSStats = async (req: Request, res: Response) => {
  try {
    const totalSubmissions = await ATS.countDocuments();

    const avgScore = await ATS.aggregate([
      { $group: { _id: null, average: { $avg: '$atsScore' } } }
    ]);

    const scoreDistribution = await ATS.aggregate([
      {
        $bucket: {
          groupBy: '$atsScore',
          boundaries: [0, 50, 75, 100],
          default: 'Other',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalSubmissions,
        averageScore: avgScore[0]?.average || 0,
        scoreDistribution,
      },
    });
  } catch (error: any) {
    console.error('Get ATS Stats Error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch ATS stats' });
  }
};

// Get single ATS submission by ID with full details
export const getATSSubmissionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const submission = await ATS.findById(id);

    if (!submission) {
      return res.status(404).json({ message: 'ATS submission not found' });
    }

    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error: any) {
    console.error('Get ATS Submission Error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch ATS submission' });
  }
};