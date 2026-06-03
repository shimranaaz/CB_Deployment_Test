// src/controllers/aiController.ts
import { Request, Response } from "express";
import Resume from "../models/Resume.js";
import User from "../models/User.js";
import groq from "../configs/ai.js";

// Extend Request interface to include userId
interface AuthRequest extends Request {
  userId?: string;
}

// controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req: AuthRequest, res: Response) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else."
                },
                {
                    role: "user",
                    content: userContent
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        const enhancedContent = response.choices[0]?.message?.content ?? "";
        return res.status(200).json({ enhancedContent });
    } catch (error: any) {
        console.error("Groq API Error:", error);
        return res.status(400).json({ message: error.message || "Failed to enhance summary" });
    }
};

// controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req: AuthRequest, res: Response) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentence also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else."
                },
                {
                    role: "user",
                    content: userContent
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        const enhancedContent = response.choices[0]?.message?.content ?? "";
        return res.status(200).json({ enhancedContent });
    } catch (error: any) {
        console.error("Groq API Error:", error);
        return res.status(400).json({ message: error.message || "Failed to enhance job description" });
    }
};

// ─── Helper: build parsed-data string from existing resume for JD re-enhancement ───
const resumeToText = (resume: any): string => {
  const p = resume.personal_info || {};
  const exp = (resume.experience || [])
    .map((e: any) => `${e.position} at ${e.company} (${e.start_date} - ${e.end_date}): ${e.description}`)
    .join("\n");
  const proj = (resume.projects || [])
    .map((p: any) => `${p.name} (${p.type}): ${p.description}`)
    .join("\n");
  const edu = (resume.education || [])
    .map((e: any) => `${e.degree} in ${e.field} from ${e.institution}`)
    .join("\n");

  return `
Name: ${p.full_name || ""}
Title: ${p.title || ""}
Email: ${p.email || ""}
Phone: ${p.phone || ""}
Location: ${p.location || ""}
LinkedIn: ${p.linkedin || ""}
Website: ${p.website || ""}

Professional Summary:
${resume.professional_summary || ""}

Skills:
${(resume.skills || []).join(", ")}

Experience:
${exp}

Projects:
${proj}

Education:
${edu}

Certifications: ${resume.additional_info?.certifications || ""}
Languages: ${resume.additional_info?.languages || ""}
Interests: ${resume.additional_info?.interests || ""}
`.trim();
};

// controller for uploading a resume to the database
// POST: /api/ai/upload-resume
export const uploadResume = async (req: AuthRequest, res: Response) => {
    try {
      const { resumeText, title, jobDescription, isNewUpload, useExistingResumeId } = req.body;
      const userId = req.userId;

      // ── Validate: must have EITHER resumeText (new upload) OR useExistingResumeId (re-use) ──
 if (isNewUpload && (!resumeText || resumeText.trim().length < 10)) {
  return res.status(400).json({ message: "Could not extract text from your PDF. Please make sure it's a text-based PDF, not a scanned image." });
}
      if (!isNewUpload && !useExistingResumeId && !resumeText) {
        return res.status(400).json({ message: "Please provide a resume or select an existing one." });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      // ── Upload slot check ──
      if (isNewUpload) {
        if (user.resumeUploadCount >= user.resumeUploadLimit) {
          return res.status(403).json({
            message: `Upload limit reached. Your ${user.plan} plan allows ${user.resumeUploadLimit} resume uploads. Please upgrade to upload more.`
          });
        }
      }

      // ── JD credit check ──
      if (jobDescription) {
        if (user.jdEnhancementCount >= user.jdEnhancementLimit) {
          return res.status(403).json({
            message: user.plan === "Free"
              ? "Free plan allows 1 JD enhancement. Upgrade to get more."
              : `JD enhancement limit reached. Your ${user.plan} plan allows ${user.jdEnhancementLimit} enhancements. Please upgrade.`
          });
        }
      }

      // ── Resolve the resume text to use ──
      let resolvedResumeText = resumeText || "";

      if (!isNewUpload && useExistingResumeId) {
        // Re-use an existing uploaded resume's parsed data
        const existingResume = await Resume.findOne({ _id: useExistingResumeId, userId });
        if (!existingResume) {
          return res.status(404).json({ message: "Existing resume not found." });
        }
        resolvedResumeText = resumeToText(existingResume);
      }

      // ── If no JD and re-using existing resume, just duplicate the resume ──
      if (!jobDescription && !isNewUpload && useExistingResumeId) {
        const existingResume = await Resume.findOne({ _id: useExistingResumeId, userId });
        if (!existingResume) {
          return res.status(404).json({ message: "Existing resume not found." });
        }
        const resumeObj = existingResume.toObject();
        const { _id, createdAt, updatedAt, __v, ...resumeData } = resumeObj as any;

        const newResume = await Resume.create({
          ...resumeData,
          userId,
          title: title || "Untitled Resume",
        });

        return res.json({ resumeId: newResume._id, message: "Resume duplicated successfully" });
      }

        const systemPrompt = "You are an expert AI Agent to extract and enhance resume data. You must respond ONLY with valid JSON, no markdown code blocks, no additional text.";

        const userPrompt = jobDescription
            ? `You have two inputs:
1. A resume (raw text)
2. A target job description

Your task:
- Extract all information from the resume
- Tailor and enhance the professional_summary, experience descriptions, project descriptions, and skills to better align with the job description
- For projects: reframe the project type, description and highlight technologies/outcomes that match the job description keywords
- Keep personal_info (name, email, phone, etc.) exactly as found in the resume
- Do NOT fabricate experience, projects or education — only rephrase/reframe what exists
- Use keywords from the job description naturally in the enhanced content
- Make it ATS-friendly

Resume:
${resolvedResumeText}

Job Description:
${jobDescription}

Return ONLY this JSON structure, no markdown, no explanations:
{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": false
    }
  ],
  "projects": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "start_date": "",
      "end_date": "",
      "is_current": false
    }
  ]
}`
            : `Extract data from this resume and return ONLY a JSON object: ${resolvedResumeText}

Use this exact JSON structure:
{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": false
    }
  ],
  "projects": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "start_date": "",
      "end_date": "",
      "is_current": false
    }
  ]
}

Return ONLY the JSON, no markdown, no explanations.`;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.3,
            max_tokens: 2000,
            response_format: { type: "json_object" }
        });

        let extractedData = response.choices[0]?.message?.content ?? "{}";
        extractedData = extractedData.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsedData = JSON.parse(extractedData);

        const newResume = await Resume.create({
          userId,
          title: title || "Untitled Resume",
          ...parsedData
        });

        // ── Increment counts ──
        const incFields: Record<string, number> = {};
        if (jobDescription) incFields.jdEnhancementCount = 1;
        if (isNewUpload) incFields.resumeUploadCount = 1;
        if (Object.keys(incFields).length > 0) {
          await User.findByIdAndUpdate(userId, { $inc: incFields });
        }

        return res.json({ resumeId: newResume._id, message: "Resume uploaded successfully" });

    } catch (error: any) {
        console.error("Upload Resume Error:", error);
        return res.status(400).json({
            message: error.message || "Failed to upload resume",
            details: error.response?.data || error
        });
    }
};

// GET: /api/ai/uploaded-resumes  — returns all user-uploaded resumes (isNewUpload ones)
// We identify them by resumeUploadCount tracking; we just return all resumes for the user
// so the frontend can pick "use existing"
export const getUploadedResumes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const resumes = await Resume.find({ userId, adminCreated: { $ne: true } })
      .select("_id title updatedAt personal_info template")
      .sort({ updatedAt: -1 })
      .limit(20);
    return res.json({ resumes });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const testGroqConnection = async (req: Request, res: Response) => {
    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: "Say 'Groq API is working!' in one sentence."
                }
            ],
            temperature: 0.7,
            max_tokens: 50
        });

        const message = response.choices[0]?.message?.content ?? "";

        return res.status(200).json({
            success: true,
            message: "Groq API connected successfully!",
            response: message,
            model: "llama-3.3-70b-versatile"
        });
    } catch (error: any) {
        console.error("Groq API Test Error:", error);
        return res.status(500).json({
            success: false,
            message: "Groq API connection failed",
            error: error.message
        });
    }
};