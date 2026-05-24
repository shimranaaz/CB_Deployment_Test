import { Request, Response } from "express";
import User from "../models/User.js";
import Resume from "../models/Resume.js";
import Payment from "../models/Payment.js";
import ATS from "../models/ATS.js";
import Coupon from "../models/Coupon.js";
import LinkedIn from '../models/LinkedIn.js';
import imagekit from "../configs/imageKit.js";
import fs from "fs";
import multer from "multer";
import groq from "../configs/ai.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");
const pdfParse = pdfParseModule.default || pdfParseModule;

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {


    const totalATSSubmissions = await ATS.countDocuments();
    const totalLinkedInSubmissions = await LinkedIn.countDocuments();
    const totalUsers = await User.countDocuments({ isDeleted: { $ne: true } });
    const totalResumes = await Resume.countDocuments();
    const totalSuccessfulPayments = await Payment.countDocuments({ status: "success" });
    const totalFailedPayments = await Payment.countDocuments({ status: "failed" });

    const totalRevenue = await Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const lostRevenue = await Payment.aggregate([
      { $match: { status: "failed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    //  Coupon stats
    const activeCoupons = await Coupon.countDocuments({ isActive: true });
    const couponUsageResult = await Coupon.aggregate([
      { $group: { _id: null, total: { $sum: "$usedCount" } } }
    ]);
    const totalCouponsUsed = couponUsageResult[0]?.total || 0;

    const recentUsers = await User.find({ isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password -otp");

    const recentPayments = await Payment.find({ status: "success" })
      .populate("userId", "name email mobile")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalResumes,
        totalPayments: totalSuccessfulPayments,
        totalFailedPayments,
        totalRevenue: totalRevenue[0]?.total || 0,
        lostRevenue: lostRevenue[0]?.total || 0,
        totalATSSubmissions,
        totalLinkedInSubmissions,
        activeCoupons,
        totalCouponsUsed,
      },
      recentUsers,
      recentPayments,
    });
  } catch (error: any) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch stats" });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;

    const baseQuery: any = { isDeleted: { $ne: true } };
    const query = search
      ? {
        ...baseQuery,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { mobile: { $regex: search, $options: "i" } },
        ],
      }
      : baseQuery;

 const users = await User.find(query)
      .select("-password -otp")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    // Attach latest ATS score for each user
    const usersWithATS = await Promise.all(
      users.map(async (user: any) => {
        const userObj = user.toObject();
        const latestATS = await ATS.findOne({ email: userObj.email })
          .sort({ createdAt: -1 })
          .select('atsScore');
        userObj.atsScore = latestATS?.atsScore ?? null;
        return userObj;
      })
    );

    const total = await User.countDocuments(query);

res.status(200).json({
      success: true,
      users: usersWithATS,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch users" });
  }
};

export const getAllPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, status = "" } = req.query;
    const query = status ? { status } : {};

    const payments = await Payment.find(query)
      .populate({ path: "userId", select: "name email mobile isDeleted" })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const transformedPayments = payments.map((payment: any) => {
      const paymentObj = payment.toObject();
      if (!paymentObj.userId || paymentObj.userId.isDeleted) {
        paymentObj.userId = {
          name: paymentObj.deletedUserInfo?.name || "Deleted Account",
          email: paymentObj.deletedUserInfo?.email || "N/A",
          mobile: paymentObj.deletedUserInfo?.mobile || "N/A",
          isDeleted: true,
        };
      }
      return paymentObj;
    });

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      payments: transformedPayments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error("Get Payments Error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch payments" });
  }
};

export const getFailedPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const payments = await Payment.find({ status: "failed" })
      .populate({ path: "userId", select: "name email mobile isDeleted" })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const transformedPayments = payments.map((payment: any) => {
      const paymentObj = payment.toObject();
      if (!paymentObj.userId || paymentObj.userId.isDeleted) {
        paymentObj.userId = {
          name: paymentObj.deletedUserInfo?.name || "Deleted Account",
          email: paymentObj.deletedUserInfo?.email || "N/A",
          mobile: paymentObj.deletedUserInfo?.mobile || "N/A",
          isDeleted: true,
        };
      }
      return paymentObj;
    });

    const total = await Payment.countDocuments({ status: "failed" });

    res.status(200).json({
      success: true,
      payments: transformedPayments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error("Get Failed Payments Error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch failed payments" });
  }
};

export const getAllResumes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;

    let query: any = {};

    if (search && (search as string).trim()) {
      const searchTerm = (search as string).trim();

      const matchingUsers = await User.find({
        isDeleted: { $ne: true },
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
      }).select("_id");

      const userIds = matchingUsers.map((u) => u._id);

      query = {
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { userId: { $in: userIds } },
        ],
      };
    }

    const resumes = await Resume.find(query)
      .populate({ path: "userId", select: "name email mobile isDeleted" })
      .sort({ updatedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const transformedResumes = resumes.map((resume: any) => {
      const resumeObj = resume.toObject();
      if (!resumeObj.userId || resumeObj.userId.isDeleted) {
        resumeObj.userId = {
          name: resumeObj.deletedUserInfo?.name || "Deleted Account",
          email: resumeObj.deletedUserInfo?.email || "N/A",
          mobile: resumeObj.deletedUserInfo?.mobile || "N/A",
          isDeleted: true,
        };
      }
      return resumeObj;
    });

    const total = await Resume.countDocuments(query);

    res.status(200).json({
      success: true,
      resumes: transformedResumes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error("Get Resumes Error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch resumes" });
  }
};

export const updateUserPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { plan } = req.body;

    if (!["Free", "Basic", "Advanced", "Professional"].includes(plan)) {
      res.status(400).json({ message: "Invalid plan" });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        plan,
        planExpiresAt: plan !== "Free"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : undefined
      },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, message: "User plan updated", user });
  } catch (error: any) {
    console.error("Update Plan Error:", error);
    res.status(500).json({ message: error.message || "Failed to update plan" });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userInfo = {
      name: user.name,
      email: user.email,
      mobile: user.mobile || "N/A",
    };

    await Payment.updateMany({ userId }, { $set: { deletedUserInfo: userInfo } });
    await Resume.updateMany({ userId }, { $set: { deletedUserInfo: userInfo } });

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: error.message || "Failed to delete user" });
  }
};

export const deletePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findByIdAndDelete(paymentId);

    if (!payment) {
      res.status(404).json({ message: "Payment not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Payment deleted successfully" });
  } catch (error: any) {
    console.error("Delete Payment Error:", error);
    res.status(500).json({ message: error.message || "Failed to delete payment" });
  }
};

export const deleteResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findByIdAndDelete(resumeId);

    if (!resume) {
      res.status(404).json({ message: "Resume not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Resume deleted successfully" });
  } catch (error: any) {
    console.error("Delete Resume Error:", error);
    res.status(500).json({ message: error.message || "Failed to delete resume" });
  }
};

// ===================== COUPON MANAGEMENT =====================

export const createCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { couponCode, discountType, discountValue, expiryDate } = req.body;

    if (!couponCode || !discountType || !discountValue || !expiryDate) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (!["percent", "flat"].includes(discountType)) {
      res.status(400).json({ message: "discountType must be 'percent' or 'flat'" });
      return;
    }

    if (discountType === "percent" && (Number(discountValue) <= 0 || Number(discountValue) > 100)) {
      res.status(400).json({ message: "Percent discount must be between 1 and 100" });
      return;
    }

    const existing = await Coupon.findOne({ couponCode: couponCode.toUpperCase() });
    if (existing) {
      res.status(400).json({ message: "Coupon code already exists" });
      return;
    }

    const coupon = new Coupon({
      couponCode: couponCode.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      expiryDate: new Date(expiryDate),
    });

    await coupon.save();
    res.status(201).json({ success: true, message: "Coupon created successfully", coupon });
  } catch (error: any) {
    console.error("Create Coupon Error:", error);
    res.status(500).json({ message: error.message || "Failed to create coupon" });
  }
};

export const getAllCoupons = async (req: Request, res: Response): Promise<void> => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error: any) {
    console.error("Get Coupons Error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch coupons" });
  }
};

export const deleteCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { couponId } = req.params;
    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
      res.status(404).json({ message: "Coupon not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Coupon deleted successfully" });
  } catch (error: any) {
    console.error("Delete Coupon Error:", error);
    res.status(500).json({ message: error.message || "Failed to delete coupon" });
  }
};


export const getUserResumes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('name email');
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
 const resumes = await Resume.find({ userId })
      .select('title template updatedAt createdAt adminUploadedPdf status adminCreated createdByRole personal_info professional_summary skills experience education projects additional_info accent_color public hasBeenDownloaded')
      .sort({ updatedAt: -1 });
    res.status(200).json({ success: true, user, resumes });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch resumes' });
  }
};


// ✅ FIXED createResumeForUser — sanitize AI data before saving
export const createResumeForUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { title, template } = req.body;
const user = await User.findById(userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    // ✅ Get requesting admin's role for createdByRole field
    const AdminUser = (await import("../models/User.js")).default;
    const requestingAdmin = await AdminUser.findById((req as any).userId);
    const requestingRole = requestingAdmin?.role || 'admin';

    let uploadedPdfUrl = '';
    let parsedResumeData: any = {};

    if (req.file) {
      const pdfBuffer = fs.readFileSync(req.file.path);

      let pdfText = '';
      try {
        const parsed = await pdfParse(pdfBuffer);
        pdfText = parsed.text || '';
        console.log(`📄 PDF text extracted: ${pdfText.length} characters`);
      } catch (pdfError) {
        console.error('❌ PDF parse error:', pdfError);
        pdfText = '';
      }

      try {
        const fileStream = fs.createReadStream(req.file.path);
        const ikResponse = await imagekit.upload({
          file: fileStream,
          fileName: `resume_${userId}_${Date.now()}.pdf`,
          folder: 'admin-resumes',
        });
        uploadedPdfUrl = ikResponse.url;
        console.log(`✅ PDF uploaded to ImageKit: ${uploadedPdfUrl}`);
      } catch (uploadError) {
        console.error('❌ ImageKit upload error:', uploadError);
      }

      if (pdfText.trim().length > 50) {
        try {
          const systemPrompt = `You are an expert AI Agent to extract data from resume. 
You must respond ONLY with valid JSON matching the exact structure provided. 
No markdown, no code blocks, no extra text whatsoever.`;

          const userPrompt = `Extract ALL data from this resume text and return ONLY a JSON object.

RESUME TEXT:
${pdfText}

Return this EXACT JSON structure with ALL fields populated from the resume:
{
  "professional_summary": "extracted summary here",
  "skills": ["skill1", "skill2", "skill3"],
  "personal_info": {
    "image": "",
    "full_name": "extracted full name",
    "title": "extracted job title",
    "email": "extracted email",
    "phone": "extracted phone",
    "location": "extracted city/location",
    "linkedin": "extracted linkedin url or empty string",
    "website": "extracted website or empty string"
  },
  "experience": [
    {
      "company": "company name",
      "position": "job title",
      "start_date": "start date",
      "end_date": "end date or empty if current",
      "description": "job description",
      "is_current": false
    }
  ],
  "projects": [
    {
      "name": "project name",
      "type": "project type",
      "description": "project description"
    }
  ],
  "education": [
    {
      "institution": "school name",
      "degree": "degree type",
      "field": "field of study",
      "start_date": "start date",
      "end_date": "end date",
      "gpa": "",
      "additional_info": "",
      "is_current": false
    }
  ],
  "additional_info": {
    "certifications": "comma separated certifications",
    "languages": "comma separated languages",
    "interests": "comma separated interests"
  }
}

CRITICAL: Return ONLY the JSON object. No markdown. No backticks. No explanations.`;

          const groqResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.1,
            max_tokens: 3000,
            response_format: { type: "json_object" }
          });

          let extractedText = groqResponse.choices[0]?.message?.content ?? "{}";
          // Strip any accidental markdown fences
          extractedText = extractedText
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim();

          const rawParsed = JSON.parse(extractedText);
          console.log(`✅ AI parsed data keys: ${Object.keys(rawParsed).join(', ')}`);

          // ✅ CRITICAL: Sanitize and normalize AI output to match schema exactly
          parsedResumeData = {
            professional_summary: typeof rawParsed.professional_summary === 'string'
              ? rawParsed.professional_summary
              : '',

            skills: Array.isArray(rawParsed.skills)
              ? rawParsed.skills.filter((s: any) => typeof s === 'string' && s.trim())
              : [],

            personal_info: {
              image: '',
              full_name: rawParsed.personal_info?.full_name || '',
              title: rawParsed.personal_info?.title || '',
              profession: rawParsed.personal_info?.title || '', // map title → profession too
              email: rawParsed.personal_info?.email || '',
              phone: rawParsed.personal_info?.phone || '',
              location: rawParsed.personal_info?.location || '',
              linkedin: rawParsed.personal_info?.linkedin || '',
              website: rawParsed.personal_info?.website || '',
            },

            experience: Array.isArray(rawParsed.experience)
              ? rawParsed.experience.map((exp: any) => ({
                  company: exp.company || '',
                  position: exp.position || '',
                  start_date: exp.start_date || '',
                  end_date: exp.is_current ? '' : (exp.end_date || ''),
                  description: exp.description || '',
                  is_current: Boolean(exp.is_current),
                }))
              : [],

            projects: Array.isArray(rawParsed.projects)
              ? rawParsed.projects.map((proj: any) => ({
                  name: proj.name || '',
                  type: proj.type || '',
                  description: proj.description || '',
                }))
              : [],

            education: Array.isArray(rawParsed.education)
              ? rawParsed.education.map((edu: any) => ({
                  institution: edu.institution || '',
                  degree: edu.degree || '',
                  field: edu.field || '',
                  start_date: edu.start_date || '',
                  end_date: edu.is_current ? '' : (edu.end_date || ''),
                  gpa: edu.gpa || '',
                  additional_info: edu.additional_info || '',
                  is_current: Boolean(edu.is_current),
                }))
              : [],

            additional_info: {
              certifications: rawParsed.additional_info?.certifications || '',
              languages: rawParsed.additional_info?.languages || '',
              interests: rawParsed.additional_info?.interests || '',
            },
          };

          console.log(`✅ Sanitized resume data — experience: ${parsedResumeData.experience.length}, education: ${parsedResumeData.education.length}, skills: ${parsedResumeData.skills.length}`);

        } catch (aiError) {
          console.error('❌ Groq AI parse error:', aiError);
          parsedResumeData = {};
        }
      }

      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }

    // ✅ Create resume — await fully before responding
    const resume = await Resume.create({
      userId,
      title: title || `${user.name}'s Resume`,
      template: template || 'digital-pro',
      professional_summary: parsedResumeData.professional_summary || '',
      skills: parsedResumeData.skills || [],
      personal_info: parsedResumeData.personal_info || {
        image: '', full_name: '', title: '', profession: '',
        email: '', phone: '', location: '', linkedin: '', website: ''
      },
      experience: parsedResumeData.experience || [],
      projects: parsedResumeData.projects || [],
      education: parsedResumeData.education || [],
      additional_info: parsedResumeData.additional_info || {
        certifications: '', languages: '', interests: ''
      },
      ...(uploadedPdfUrl && { adminUploadedPdf: uploadedPdfUrl }),
   status: 'draft',
      adminCreated: true,
      createdByRole: requestingRole,
    });

    // ✅ Fetch the saved doc fresh from DB to confirm all data persisted
    const savedResume = await Resume.findById(resume._id).lean();
    console.log(`✅ Resume saved and verified in DB: ${resume._id}`);
    console.log(`   - experience entries: ${savedResume?.experience?.length || 0}`);
    console.log(`   - education entries: ${savedResume?.education?.length || 0}`);
    console.log(`   - skills count: ${savedResume?.skills?.length || 0}`);

    res.status(201).json({ success: true, resume: savedResume });
  } catch (error: any) {
    console.error('❌ createResumeForUser error:', error);
    res.status(500).json({ message: error.message || 'Failed to create resume' });
  }
};

export const updateResumeForUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, resumeId } = req.params;
    const { resumeData, title, template } = req.body;

    // Handle PDF upload if file provided
    let uploadedPdfUrl = '';
    if (req.file) {
      const fileStream = fs.createReadStream(req.file.path);
      const response = await imagekit.upload({
        file: fileStream,
        fileName: `resume_${userId}_${Date.now()}.pdf`,
        folder: 'admin-resumes',
      });
      uploadedPdfUrl = response.url;
      fs.unlinkSync(req.file.path);
    }

    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      {
        $set: {
          ...resumeData,
          ...(title && { title }),
          ...(template && { template }),
          ...(uploadedPdfUrl && { adminUploadedPdf: uploadedPdfUrl }),
        }
      },
      { new: true }
    );

    if (!resume) { res.status(404).json({ message: 'Resume not found' }); return; }
    res.status(200).json({ success: true, resume });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update resume' });
  }
};

export const transferResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeId } = req.params;
    const { newUserId } = req.body;

    const newUser = await User.findById(newUserId);
    if (!newUser) { res.status(404).json({ message: 'Target user not found' }); return; }

    const resume = await Resume.findByIdAndUpdate(
      resumeId,
      { $set: { userId: newUserId } }, // ← just change the userId
      { new: true }
    );

    if (!resume) { res.status(404).json({ message: 'Resume not found' }); return; }

    console.log(`✅ Resume ${resumeId} transferred to user ${newUserId}`);
    res.status(200).json({ success: true, resume, message: `Resume transferred to ${newUser.name}` });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to transfer resume' });
  }
};

export const deleteResumeForUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, resumeId } = req.params;
    const resume = await Resume.findOneAndDelete({ _id: resumeId, userId });
    if (!resume) { res.status(404).json({ message: 'Resume not found' }); return; }
    res.status(200).json({ success: true, message: 'Resume deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete resume' });
  }
};

export const publishResumeForUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    resume.status = 'published';
    await resume.save();

    console.log(`✅ Resume ${resumeId} published to user ${resume.userId}`);
    res.status(200).json({
      success: true,
      message: 'Resume sent to user dashboard successfully',
      resume,
    });
  } catch (error: any) {
    console.error('Publish Resume Error:', error);
    res.status(500).json({ message: error.message || 'Failed to publish resume' });
  }
};

export const unpublishResumeForUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    resume.status = 'draft';
    await resume.save();

    console.log(`📝 Resume ${resumeId} moved back to draft`);
    res.status(200).json({
      success: true,
      message: 'Resume moved to draft',
      resume,
    });
  } catch (error: any) {
    console.error('Unpublish Resume Error:', error);
    res.status(500).json({ message: error.message || 'Failed to unpublish resume' });
  }
};
