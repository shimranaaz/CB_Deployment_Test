import Resume from "../models/Resume.js";
import groq from "../configs/ai.js";
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;
        if (!userContent) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Best free model on Groq
            messages: [
                {
                    role: "system",
                    content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else."
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
    }
    catch (error) {
        console.error("Groq API Error:", error);
        return res.status(400).json({ message: error.message || "Failed to enhance summary" });
    }
};
export const enhanceJobDescription = async (req, res) => {
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
                    content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentence also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else."
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
    }
    catch (error) {
        console.error("Groq API Error:", error);
        return res.status(400).json({ message: error.message || "Failed to enhance job description" });
    }
};
export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;
        if (!resumeText) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const systemPrompt = "You are an expert AI Agent to extract data from resume. You must respond ONLY with valid JSON, no markdown code blocks, no additional text.";
        const userPrompt = `Extract data from this resume and return ONLY a JSON object: ${resumeText}

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
            temperature: 0.3, // Lower temperature for more consistent JSON
            max_tokens: 2000,
            response_format: { type: "json_object" }
        });
        let extractedData = response.choices[0]?.message?.content ?? "{}";
        // Clean up any markdown code blocks if present
        extractedData = extractedData.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsedData = JSON.parse(extractedData);
        // Create resume with extracted data
        const newResume = await Resume.create({
            userId,
            title: title || "Untitled Resume",
            ...parsedData
        });
        res.json({ resumeId: newResume._id, message: "Resume uploaded successfully" });
    }
    catch (error) {
        console.error("Groq API Error:", error);
        return res.status(400).json({
            message: error.message || "Failed to upload resume",
            details: error.response?.data || error
        });
    }
};
export const testGroqConnection = async (req, res) => {
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
    }
    catch (error) {
        console.error("Groq API Test Error:", error);
        return res.status(500).json({
            success: false,
            message: "Groq API connection failed",
            error: error.message
        });
    }
};
