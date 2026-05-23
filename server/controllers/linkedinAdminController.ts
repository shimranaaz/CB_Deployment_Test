import { Request, Response } from 'express';
import LinkedIn from '../models/LinkedIn.js';

export const getAllLinkedInSubmissions = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

const query = search
      ? {
       $or: [
            { username: { $regex: search, $options: 'i' } },
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

 const submissions = await LinkedIn.find(query)
      .select('username fullName email linkedinScore createdAt')
        .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await LinkedIn.countDocuments(query);

    res.status(200).json({
      success: true,
      submissions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch LinkedIn submissions' });
  }
};

export const deleteLinkedInSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const submission = await LinkedIn.findByIdAndDelete(id);

    if (!submission) {
      return res.status(404).json({ message: 'LinkedIn submission not found' });
    }

    res.status(200).json({ success: true, message: 'LinkedIn submission deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete LinkedIn submission' });
  }
};