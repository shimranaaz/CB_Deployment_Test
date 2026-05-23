import { Request, Response } from 'express';
import CoverLetter from '../models/CoverLetter.js';

export interface AuthRequest extends Request {
  userId?: string;
}

export const createCoverLetter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title } = req.body;

    const coverLetter = await CoverLetter.create({
      user_id: req.userId,
      title: title || 'Untitled Cover Letter'
    });

    res.status(201).json({ coverLetter });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create cover letter', error: error.message });
  }
};

export const getUserCoverLetters = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coverLetters = await CoverLetter.find({ user_id: req.userId })
      .sort({ updatedAt: -1 });

    res.status(200).json({ coverLetters });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch cover letters', error: error.message });
  }
};

export const getCoverLetter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coverLetter = await CoverLetter.findOne({
      _id: req.params.id,
      user_id: req.userId
    });

    if (!coverLetter) {
      res.status(404).json({ message: 'Cover letter not found' });
      return;
    }

    res.status(200).json({ coverLetter });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch cover letter', error: error.message });
  }
};

export const updateCoverLetter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coverLetter = await CoverLetter.findOneAndUpdate(
      { _id: req.params.id, user_id: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!coverLetter) {
      res.status(404).json({ message: 'Cover letter not found' });
      return;
    }

    res.status(200).json({ coverLetter, message: 'Cover letter updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update cover letter', error: error.message });
  }
};

export const deleteCoverLetter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coverLetter = await CoverLetter.findOneAndDelete({
      _id: req.params.id,
      user_id: req.userId
    });

    if (!coverLetter) {
      res.status(404).json({ message: 'Cover letter not found' });
      return;
    }

    res.status(200).json({ message: 'Cover letter deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete cover letter', error: error.message });
  }
};