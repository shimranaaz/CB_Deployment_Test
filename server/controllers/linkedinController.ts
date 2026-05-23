import { Request, Response } from 'express';
import LinkedIn from '../models/LinkedIn.js';
import User from '../models/User.js';
import Groq from 'groq-sdk';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const PDFParser = require('pdf2json');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});


const LINKEDIN_OPTIMIZATION_LIMIT = 3;


async function extractResumeText(file: Express.Multer.File): Promise<string> {
  if (file.mimetype === 'application/pdf') {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      pdfParser.on('pdfParser_dataError', (err: any) => reject(err));
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        const text = pdfData.Pages
          .map((page: any) =>
            page.Texts.map((t: any) => {
              try {
                return decodeURIComponent(t.R.map((r: any) => r.T).join(''));
              } catch {
                return t.R.map((r: any) => r.T).join('');
              }
            }).join(' ')
          )
          .join('\n');
        resolve(text);
      });
      pdfParser.parseBuffer(file.buffer);
    });
  }
  return file.buffer.toString('utf8');
}


export const checkLinkedInAccess = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isPaidPlan = ['Basic', 'Advanced', 'Professional'].includes(user.plan);
    const usesLeft = Math.max(0, LINKEDIN_OPTIMIZATION_LIMIT - (user.linkedinOptimizationCount || 0));

    if (usesLeft <= 0) {
      res.json({
        success: true,
        hasAccess: false,
        reason: 'limit-exceeded',
        usesLeft: 0,
        isPaidPlan,
        linkedinPaid: user.linkedinPaid,
      });
      return;
    }

    res.json({
      success: true,
      hasAccess: true,
      reason: 'ok',
      usesLeft,
      isPaidPlan,
      linkedinPaid: user.linkedinPaid,
    });


  } catch (error: unknown) {
    console.error('❌ LinkedIn check-access error:', error);
    const message = error instanceof Error ? error.message : 'Failed to check access';
    res.status(500).json({ success: false, message });
  }
};

export const analyzeLinkedIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { linkedinUrl, targetRole } = req.body;
    const wantsOptimization = req.query.optimize === 'true';

    if (!linkedinUrl?.trim() && !req.file) {
      res.status(400).json({ success: false, message: 'Please provide a LinkedIn URL or upload a resume file' });
      return;
    }

    const url = linkedinUrl?.trim() || '';
    if (url && !url.includes('linkedin.com/in/')) {
      res.status(400).json({ success: false, message: 'Please provide a valid LinkedIn profile URL (linkedin.com/in/yourname)' });
      return;
    }

    const usernameMatch = url.match(/linkedin\.com\/in\/([^/?#]+)/);
    const username = usernameMatch ? usernameMatch[1] : 'resume-user';

    if (req.userId) {
      const user = await User.findById(req.userId);
      if (user) {
        const currentCount = user.linkedinOptimizationCount || 0;
        if (currentCount >= LINKEDIN_OPTIMIZATION_LIMIT) {
          res.status(403).json({
            success: false,
            reason: 'limit-exceeded',
            message: `You have used all ${LINKEDIN_OPTIMIZATION_LIMIT} LinkedIn analyses.`,
            usesLeft: 0,
          });
          return;
        }
      }
    }

    console.log('🔍 LinkedIn analysis request for username:', username);
    console.log('🎯 Target role:', targetRole || 'Not specified');
    console.log('🔧 Wants optimization:', wantsOptimization);

    let resumeText = '';
    if (req.file) {
      resumeText = await extractResumeText(req.file);
      console.log('📄 Resume text extracted, length:', resumeText.length);
    }
    const urlOnlyWarning = !resumeText && url
      ? `\nIMPORTANT NOTE: No resume was provided. LinkedIn profiles cannot be scraped programmatically. 
You only have the username "${username}" to work with. 
- Do NOT invent fake job titles, companies, or skills.
- For profileFixData fields, write genuinely helpful general best-practice content and clearly indicate the user should personalise it.
- For userData.fullName, use the username as a readable name (capitalise first letter, replace hyphens with spaces).`
      : '';

    const systemPrompt = `You are a world-class LinkedIn profile optimization expert and career coach. 
You analyze LinkedIn profiles and provide detailed, actionable scores and insights.
You MUST respond ONLY with valid JSON, no markdown, no preamble, no explanation outside the JSON.`;

    const userPrompt = `You are analyzing a LinkedIn profile. Use ALL the information provided below to generate SPECIFIC, PERSONALIZED content — not generic placeholders.

${url ? `LinkedIn Profile URL: ${url}\nLinkedIn Username: ${username}` : 'No LinkedIn URL provided — analyze based on resume only.'}
Target Role: ${targetRole || 'Not specified'}
${resumeText ? `\nResume Content:\n${resumeText.slice(0, 4000)}` : ''}
${urlOnlyWarning}

CRITICAL INSTRUCTIONS:
- Use the actual name, skills, experience, education from the resume/URL above
- Write REAL optimized content based on their ACTUAL background
- Do NOT use placeholders like [Industry/Field] or [Your Name]
- If resume is provided, extract real job titles, companies, skills, education
- Generate content as if you are rewriting their actual LinkedIn profile
- If only a URL is provided (no resume), acknowledge this in profileFixData fields and give strong general advice the user can customise

Return ONLY this JSON structure (no markdown, no code blocks):
{
  "overallScore": <number 0-100>,
  "profileStrength": "<All-Star|Expert|Advanced|Intermediate|Beginner>",
"userData": {
    "fullName": "<extract real name from resume or convert username to readable name>",
    "email": "<extract email address exactly as written in the resume — if no email found in resume, return empty string>",
    "username": "${username}",
    "headline": "<write optimized headline using their ACTUAL role/skills — or best-practice template if no resume>",
    "estimatedConnections": "<500+|300+|100+>"
  },
  "detailedReport": {
    "profileCompleteness": {
      "score": <0-100>,
      "percentage": <0-100>,
      "details": "<specific feedback>"
    },
    "keywordOptimization": {
      "score": <0-100>,
      "percentage": <0-100>,
      "details": "<specific keywords they should add>"
    },
    "headlineStrength": {
      "score": <0-100>,
      "percentage": <0-100>,
      "details": "<specific feedback on their headline>"
    },
    "aboutSection": {
      "score": <0-100>,
      "percentage": <0-100>,
      "details": "<specific feedback on their about section>"
    },
    "experienceSection": {
      "score": <0-100>,
      "percentage": <0-100>,
      "details": "<specific feedback on their experience>"
    },
    "skillsEndorsements": {
      "score": <0-100>,
      "percentage": <0-100>,
      "details": "<specific feedback on their skills>"
    }
  },
  "recruiterVisibility": {
    "searchRankScore": <0-100>,
    "missingKeywords": ["<keyword1>", "<keyword2>", "<keyword3>"],
    "topRecommendations": [
      "<specific recommendation 1>",
      "<specific recommendation 2>",
      "<specific recommendation 3>",
      "<specific recommendation 4>",
      "<specific recommendation 5>"
    ]
  },
  "contentIntelligence": {
    "headlineSuggestion": "<rewrite headline using actual job title and skills>",
    "aboutSuggestion": "<write 3-4 sentences using ACTUAL experience, skills, and career goals>",
    "impactWords": ["<power word 1>", "<word2>", "<word3>"]
  },
  "careerAlignment": {
    "roleMatch": <0-100>,
    "targetRole": "${targetRole || 'General Professional'}",
    "alignmentTips": ["<tip 1>", "<tip2>", "<tip3>"]
  },
  "profileFixData": {
    "headline": "<write optimized headline — use ACTUAL data if available, best-practice template if not>",
    "summary": "<write 4-5 sentence professional summary — use ACTUAL experience if available>",
    "about": "<write full About section 3-4 paragraphs — use ACTUAL background if available>",
    "experience": "<rewrite experience bullet points with quantified achievements — use ACTUAL company/role if available>",
    "education": "<optimize education section — use ACTUAL degrees/institutions if available>",
    "skills": ["<skill1>", "<skill2>", "<skill3>", "<skill4>", "<skill5>", "<skill6>", "<skill7>", "<skill8>"]
  }
}`;

    console.log('🤖 Calling Groq API...');

    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2500,
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    console.log('✅ Groq API response received');

    const rawText = chatCompletion.choices[0]?.message?.content || '';
    if (!rawText) throw new Error('Empty response from Groq API');

    const clean = rawText.replace(/```json|```/g, '').trim();

    let analysisData: any;
try {
  analysisData = JSON.parse(clean);
} catch (parseError) {
  console.error('❌ JSON parse error. Raw response:', rawText.substring(0, 500));
  // Remove the analysisData.userData log - it's undefined here
  throw new Error('Failed to parse AI response as JSON. Please try again.');
}

    await LinkedIn.create({
      username,
      fullName: analysisData.userData?.fullName || username,
      email: analysisData.userData?.email || '',
      linkedinUrl: url || null,
      targetRole: targetRole || null,
      linkedinScore: analysisData.overallScore,
      profileStrength: analysisData.profileStrength,
      userData: analysisData.userData,
      detailedReport: analysisData.detailedReport,
      recruiterVisibility: analysisData.recruiterVisibility,
      contentIntelligence: analysisData.contentIntelligence,
      careerAlignment: analysisData.careerAlignment,
      profileFixData: analysisData.profileFixData,
    });

    if (req.userId) {
      await User.findByIdAndUpdate(req.userId, {
        $inc: { linkedinOptimizationCount: 1 },
      });
      console.log(`📊 LinkedIn analysis count incremented for user ${req.userId}`);
    }

    console.log('✅ LinkedIn analysis complete:', {
      overallScore: analysisData.overallScore,
      profileStrength: analysisData.profileStrength,
      username,
    });

    res.json({
      success: true,
      data: {
        linkedinScore: analysisData.overallScore,
        profileStrength: analysisData.profileStrength,
        userData: analysisData.userData,
        detailedReport: analysisData.detailedReport,
        recruiterVisibility: analysisData.recruiterVisibility,
        contentIntelligence: analysisData.contentIntelligence,
        careerAlignment: analysisData.careerAlignment,
        profileFixData: analysisData.profileFixData,
      },
    });

  } catch (error: unknown) {
    console.error('❌ LinkedIn analysis error:', error);
    const message = error instanceof Error ? error.message : 'Failed to analyze LinkedIn profile';
    res.status(500).json({ success: false, message });
  }
};

export const useLinkedInOptimization = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }


    if (!user.canUseLinkedInOptimization()) {
      res.status(403).json({
        success: false,
        message: 'LinkedIn optimization requires a paid plan or ₹199 one-time payment',
      });
      return;
    }

    const MAX_USES = 3;

    if (user.linkedinOptimizationCount >= MAX_USES) {
      res.status(403).json({
        success: false,
        message: `You have used all ${MAX_USES} LinkedIn optimization uses`,
        usageCount: user.linkedinOptimizationCount,
        usesRemaining: 0,
      });
      return;
    }

    user.linkedinOptimizationCount = (user.linkedinOptimizationCount || 0) + 1;
    await user.save();

    console.log(
      `✅ LinkedIn optimization used: user=${userId}, count=${user.linkedinOptimizationCount}/${MAX_USES}`
    );

    res.status(200).json({
      success: true,
      usageCount: user.linkedinOptimizationCount,
      usesRemaining: MAX_USES - user.linkedinOptimizationCount,
    });
  } catch (error: any) {
    console.error('❌ useLinkedInOptimization error:', error);
    res.status(500).json({ message: error.message || 'Failed to track LinkedIn optimization use' });
  }
};