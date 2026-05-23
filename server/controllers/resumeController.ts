import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  userId?: string;
}

interface ResumeData {
  personal_info: {
    image?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface UpdateResumeBody {
  resumeId: string;
  resumeData: string | ResumeData;
  removeBackground?: boolean;
}

interface CreateResumeBody {
  title: string;
  template?: string;
}

export const createResume = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const { title, template } = req.body as CreateResumeBody;

    const resumeData: any = { userId, title };
    if (template) {
      resumeData.template = template;
    }

    const newResume = await Resume.create(resumeData);
    return res.status(201).json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};
const hasPersonalInfoChanged = (oldPersonalInfo: any, newPersonalInfo: any): boolean => {
  const fieldsToCheck = ['full_name', 'email', 'phone'];
  return fieldsToCheck.some(field => {
    const oldValue = (oldPersonalInfo?.[field] || '').trim().toLowerCase();
    const newValue = (newPersonalInfo?.[field] || '').trim().toLowerCase();
    return oldValue !== newValue && newValue !== '';
  });
};

export const deleteResume = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    await Resume.findOneAndDelete({ userId, _id: resumeId });
    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};
export const getResumeById = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const User = (await import("../models/User.js")).default;
    const requestingUser = await User.findById(userId);
    const isAdmin = requestingUser?.role === 'admin' || requestingUser?.role === 'sales';

    const resumeDoc = isAdmin
      ? await Resume.findById(resumeId)
      : await Resume.findOne({ userId, _id: resumeId });

    if (!resumeDoc) {
      return res.status(404).json({ message: "Resume not found" });
    }
    const resume = resumeDoc.toObject();
    delete resume.__v;

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const getPublicResumeById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const updateResume = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body as UpdateResumeBody;
    const image = req.file;

    let resumeDataCopy: ResumeData =
      typeof resumeData === "string" ? JSON.parse(resumeData) : structuredClone(resumeData);
    const User = (await import("../models/User.js")).default;
    const requestingUser = await User.findById(userId);
    if (!requestingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const isAdmin = requestingUser.role === 'admin' || requestingUser.role === 'sales';

    const existingResume = isAdmin
      ? await Resume.findById(resumeId)
      : await Resume.findOne({ userId, _id: resumeId });

    if (!existingResume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    const user = isAdmin
      ? await User.findById(existingResume.userId)
      : requestingUser;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(`📊 User state: editCount=${user.personalInfoEditCount}, locked=${user.personalInfoLocked}, isAdmin=${isAdmin}`);

    if (isAdmin) {
      console.log('👑 Admin edit — skipping personal info lock checks');
    }
    const isPersonalInfoChanged = hasPersonalInfoChanged(
      existingResume.personal_info,
      resumeDataCopy.personal_info
    );
    if (isAdmin) {
    } else
      if (!existingResume.hasBeenDownloaded) {
        console.log('📝 New resume (never downloaded) - personal info edits allowed');

      }
      else {
        if (user.personalInfoEditCount >= 1 && isPersonalInfoChanged) {
          console.log(`🚫 Edit blocked - GLOBAL edit limit reached (${user.personalInfoEditCount} edits used)`);

          return res.status(403).json({
            message: "You've reached your plan's personal info edit limit. Upgrade to edit again.",
            personalInfoLocked: user.personalInfoLocked,
            limitReached: true
          });
        }

        if (user.personalInfoEditCount === 0 && isPersonalInfoChanged) {
          user.personalInfoEditCount = 1;
          user.personalInfoLocked = true;
          await user.save();

          console.log(`🔒 LOCKED: Personal info locked globally after 1st edit`);
          console.log(`📝 Personal info edited: Count = ${user.personalInfoEditCount}, Locked = ${user.personalInfoLocked}`);
        }
      }
    if (image) {
      const imageBufferData = fs.createReadStream(image.path);

      const response = await imagekit.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder: "user-resumes",
        transformation: {
          pre: "w-300,h-300,fo-face,z-0.75" + (removeBackground ? ",e-bgremove" : "")
        }
      });

      resumeDataCopy.personal_info.image = response.url;
    }

    // ✅ Update resume — admin can update any resume by _id only
    const updateQuery = isAdmin
      ? { _id: resumeId }
      : { userId, _id: resumeId };

    const resume = await Resume.findOneAndUpdate(
      updateQuery,
      {
        $set: {
          ...resumeDataCopy,
          hasBeenDownloaded: existingResume.hasBeenDownloaded,
          firstDownloadDate: existingResume.firstDownloadDate
        }
      },
      { new: true, runValidators: true }
    );

    if (!resume) return res.status(404).json({ message: "Resume not found" });

    let message = "Saved successfully";
    if (existingResume.hasBeenDownloaded && user.personalInfoLocked) {
      message = `Personal info saved. ⚠️ These fields are now locked permanently across all downloaded resumes. Upgrade to unlock.`;
    }

    return res.status(200).json({
      message,
      resume,
      personalInfoLocked: user.personalInfoLocked,
      personalInfoEditCount: user.personalInfoEditCount
    });
  } catch (error) {
    console.error("❌ Update Resume Error:", error);
    return res.status(400).json({ message: (error as Error).message });
  }
};