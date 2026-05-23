import fs from 'fs';
import mammoth from 'mammoth';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || ''
});

interface ATSCategoryScore {
  score: number;
  details: string;
}

interface ATSScoreResult {
  keywordsMatch: ATSCategoryScore;
  skillsSection: ATSCategoryScore;
  experienceRelevance: ATSCategoryScore;
  educationCertifications: ATSCategoryScore;
  resumeFormatting: ATSCategoryScore;
  projectsAchievements: ATSCategoryScore;
  overallScore: number;
}

interface ExtractedUserData {
  fullName: string;
  email: string;
  mobile: string;
}

interface ParsedResumeData {
  personalDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    linkedin: string;
    github: string;
  };
  summaryOrAboutMe: string;
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  experience: Array<{
    company: string;
    jobTitle: string;
    location: string;
    duration: string;
    responsibilities: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    year: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  certifications: string[];
  additionalInformation: string[];
}

interface AnalysisResult {
  overallScore: number;
  userData: ExtractedUserData;
  detailedReport: {
    keywordsMatch: { score: number; percentage: number; details: string; };
    skillsSection: { score: number; percentage: number; details: string; };
    experienceRelevance: { score: number; percentage: number; details: string; };
    educationCertifications: { score: number; percentage: number; details: string; };
    resumeFormatting: { score: number; percentage: number; details: string; };
    projectsAchievements: { score: number; percentage: number; details: string; };
    parsedData: {
      name: string;
      email: string;
      phone: string;
      summary: string;
      skills: string[];
      experience: Array<{
        company: string;
        position: string;
        duration: string;
        responsibilities: string[];
      }>;
      education: Array<{
        institution: string;
        degree: string;
        year: string;
      }>;
      projects: Array<{
        title: string;
        description: string;
      }>;
    };
  };
}

// Extract text from different file formats
async function extractTextFromFile(file: Express.Multer.File): Promise<string> {
  let text = '';

  try {
    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
     const pdfParseModule: any = await import('pdf-parse');
const pdfParse = pdfParseModule.default || pdfParseModule;
const result = await pdfParse(dataBuffer);
text = result.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: file.path });
      text = result.value;
    } else {
      text = fs.readFileSync(file.path, 'utf8');
    }

    return text;
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to extract text from file');
  }
}

// AI-powered resume parsing using Groq
async function parseResumeWithAI(resumeText: string): Promise<ParsedResumeData> {
  const prompt = `Your task is to extract ALL possible information from the resume text provided below.
The resume can be in ANY format (PDF, DOCX, plain text, tables, creative layouts).
--------------------
STRICT RULES (IMPORTANT):
--------------------
1. Return ONLY valid JSON.
2. Do NOT add explanations, comments, or markdown.
3. Do NOT hallucinate or guess.
4. If a field is missing, return an empty string "" or empty array [].
5. Extract information EXACTLY as written in the resume.
6. Group skills logically into technical, soft, and tools.
7. Preserve bullet points and responsibilities clearly.
8. Do not change wording unless required for structure.
9. IMPORTANT: Escape all special characters in strings. Replace newlines with spaces. No control characters allowed.
--------------------
FIELDS TO EXTRACT (DO NOT SKIP ANY):
--------------------
{
  "personalDetails": {
    "fullName": "",
    "email": "",
    "phone": "",
    "address": "",
    "website": "",
    "linkedin": "",
    "github": ""
  },
  "summaryOrAboutMe": "",
  "skills": {
    "technical": [],
    "soft": [],
    "tools": []
  },
  "experience": [
    {
      "company": "",
      "jobTitle": "",
      "location": "",
      "duration": "",
      "responsibilities": []
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "fieldOfStudy": "",
      "year": ""
    }
  ],
  "projects": [
    {
      "title": "",
      "description": "",
      "technologies": []
    }
  ],
  "certifications": [],
  "additionalInformation": []
}
--------------------
RESUME TEXT START
--------------------
${resumeText}
--------------------
RESUME TEXT END
--------------------
Return ONLY the JSON object, nothing else.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume parser. Extract structured data from resumes and return ONLY valid JSON with no additional text. Ensure all strings are properly escaped with no control characters.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 4000,
    });

    let response = completion.choices[0]?.message?.content || '{}';
    console.log('🤖 Raw AI Response (first 500 chars):', response.substring(0, 500));

    // Clean response (remove markdown if present)
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
    }

    // Remove control characters before parsing
    cleanedResponse = cleanedResponse
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
      .replace(/\r\n/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ')
      .replace(/\t/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    console.log('🧹 Cleaned response (first 500 chars):', cleanedResponse.substring(0, 500));

    const parsed: ParsedResumeData = JSON.parse(cleanedResponse);
    console.log('✅ Successfully parsed resume data');
    return parsed;
  } catch (error: any) {
    console.error('❌ AI parsing error:', error.message);
    console.error('Failed JSON (first 1000 chars):', error);
    throw new Error('Failed to parse resume with AI');
  }
}

//  RULE-BASED SCORING - No AI can inflate scores
function calculateRuleBasedScore(
  resumeText: string,
  parsedData: ParsedResumeData,
  jobDescription?: string
): ATSScoreResult {

  console.log('🔍 Starting RULE-BASED scoring (AI cannot inflate)');

  // ============================================
  // 1. KEYWORDS MATCH (0-75 points)
  // ============================================
  let keywordsScore = 0;
  let keywordsDetails = '';

  const resumeLower = resumeText.toLowerCase();
  const wordCount = resumeText.split(/\s+/).length;

  if (jobDescription) {
    const jdLower = jobDescription.toLowerCase();
    const jdWords = jdLower.split(/\s+/).filter(w => w.length > 3);
    const uniqueJdWords = [...new Set(jdWords)];

    let matches = 0;
    for (const word of uniqueJdWords.slice(0, 50)) { // Check top 50 keywords
      if (resumeLower.includes(word)) matches++;
    }

    const matchRate = matches / Math.min(uniqueJdWords.length, 50);

    if (matchRate >= 0.70) keywordsScore = 70;
    else if (matchRate >= 0.60) keywordsScore = 60;
    else if (matchRate >= 0.50) keywordsScore = 50;
    else if (matchRate >= 0.40) keywordsScore = 40;
    else if (matchRate >= 0.30) keywordsScore = 30;
    else if (matchRate >= 0.20) keywordsScore = 20;
    else keywordsScore = 10;

    keywordsDetails = `${matches}/${Math.min(uniqueJdWords.length, 50)} job keywords found (${Math.round(matchRate * 100)}% match). ${matchRate < 0.50 ? 'Add more role-specific keywords from the job description.' : 'Good keyword alignment.'}`;
  } else {
    // Generic keyword check
    const techKeywords = ['python', 'java', 'javascript', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes', 'git'];
    const actionVerbs = ['developed', 'designed', 'implemented', 'managed', 'led', 'created', 'built', 'improved', 'optimized'];

    let techCount = techKeywords.filter(k => resumeLower.includes(k)).length;
    let verbCount = actionVerbs.filter(v => resumeLower.includes(v)).length;

    const keywordDensity = (techCount + verbCount) / 19;

    if (keywordDensity >= 0.60) keywordsScore = 60;
    else if (keywordDensity >= 0.45) keywordsScore = 50;
    else if (keywordDensity >= 0.30) keywordsScore = 40;
    else if (keywordDensity >= 0.20) keywordsScore = 30;
    else keywordsScore = 20;

    keywordsDetails = `Found ${techCount} tech keywords and ${verbCount} action verbs. ${keywordDensity < 0.30 ? 'Add more industry-specific terms and action verbs.' : 'Reasonable keyword usage.'}`;
  }

  // ============================================
  // 2. SKILLS SECTION (0-75 points)
  // ============================================
  let skillsScore = 0;
  let skillsDetails = '';

  const totalSkills = parsedData.skills.technical.length + parsedData.skills.soft.length + parsedData.skills.tools.length;

  if (totalSkills === 0) {
    skillsScore = 5;
    skillsDetails = 'No dedicated skills section found. Add a clearly labeled "Skills" or "Technical Skills" section.';
  } else if (totalSkills < 5) {
    skillsScore = 25;
    skillsDetails = `Only ${totalSkills} skills listed. Add 10-15 relevant skills organized by category.`;
  } else if (totalSkills < 8) {
    skillsScore = 40;
    skillsDetails = `${totalSkills} skills found. Consider adding more to reach 10-15 skills.`;
  } else if (totalSkills < 12) {
    skillsScore = 55;
    skillsDetails = `${totalSkills} skills listed. Good coverage, ensure they're all relevant.`;
  } else if (totalSkills < 18) {
    skillsScore = 65;
    skillsDetails = `${totalSkills} skills found. Well-organized skills section.`;
  } else {
    skillsScore = 70;
    skillsDetails = `${totalSkills} skills listed. Comprehensive skills coverage.`;
  }

  // ============================================
  // 3. EXPERIENCE RELEVANCE (0-75 points)
  // ============================================
  let experienceScore = 0;
  let experienceDetails = '';

  const experiences = parsedData.experience.filter(exp => exp.company || exp.jobTitle);
  const hasQuantifiableResults = (resumeText.match(/\d+%|\$[\d,]+|increased|decreased|improved|reduced|generated|saved|grew/gi) || []).length;

  if (experiences.length === 0) {
    experienceScore = 5;
    experienceDetails = 'No work experience found. Add internships, projects, or relevant experience.';
  } else if (experiences.length === 1) {
    if (hasQuantifiableResults >= 3) {
      experienceScore = 40;
      experienceDetails = '1 position listed with some quantifiable achievements. Add more roles if available.';
    } else {
      experienceScore = 25;
      experienceDetails = '1 position listed without metrics. Add quantifiable results (e.g., "Improved performance by 30%").';
    }
  } else if (experiences.length === 2) {
    if (hasQuantifiableResults >= 5) {
      experienceScore = 55;
      experienceDetails = '2 positions with good quantifiable results. Strong foundation.';
    } else {
      experienceScore = 40;
      experienceDetails = '2 positions listed but lacking metrics. Add numbers and measurable outcomes.';
    }
  } else {
    if (hasQuantifiableResults >= 8) {
      experienceScore = 70;
      experienceDetails = `${experiences.length} positions with excellent quantifiable achievements.`;
    } else if (hasQuantifiableResults >= 5) {
      experienceScore = 60;
      experienceDetails = `${experiences.length} positions listed. Add more quantifiable results to each role.`;
    } else {
      experienceScore = 45;
      experienceDetails = `${experiences.length} positions but lacking measurable achievements. Use numbers and percentages.`;
    }
  }

  // Internship penalty
  if (resumeLower.includes('intern') && !resumeLower.match(/senior|lead|manager|director|principal|staff engineer/)) {
    experienceScore = Math.min(experienceScore, 50);
    experienceDetails += ' Note: Entry-level/internship experience detected.';
  }

  // ============================================
  // 4. EDUCATION & CERTIFICATIONS (0-75 points)
  // ============================================
  let educationScore = 0;
  let educationDetails = '';

  const hasEducation = parsedData.education.length > 0;
  const hasCertifications = parsedData.certifications.length > 0;

  if (!hasEducation) {
    educationScore = 20;
    educationDetails = 'No education listed. Add degree information.';
  } else {
    educationScore = 50; // Base score for having education

    if (hasCertifications && parsedData.certifications.length >= 2) {
      educationScore = 70;
      educationDetails = `Education + ${parsedData.certifications.length} certifications. Excellent credentials.`;
    } else if (hasCertifications) {
      educationScore = 60;
      educationDetails = `Education + ${parsedData.certifications.length} certification. Add more industry certifications for higher scores.`;
    } else {
      educationScore = 50;
      educationDetails = 'Education present. Consider adding relevant certifications (AWS, Google, etc.).';
    }
  }

  // ============================================
  // 5. RESUME FORMATTING (0-75 points)
  // ============================================
  let formattingScore = 0;
  let formattingDetails = '';

  const hasEmail = !!parsedData.personalDetails.email;
  const hasPhone = !!parsedData.personalDetails.phone;
  const hasLinkedIn = !!parsedData.personalDetails.linkedin;
  const hasProperLength = wordCount >= 300 && wordCount <= 1000;
  const hasSections = (resumeLower.match(/experience|education|skills|projects/g) || []).length >= 3;

  let formattingPoints = 0;
  if (hasEmail) formattingPoints += 15;
  if (hasPhone) formattingPoints += 10;
  if (hasLinkedIn) formattingPoints += 10;
  if (hasProperLength) formattingPoints += 25;
  else if (wordCount >= 250) formattingPoints += 15;
  if (hasSections) formattingPoints += 15;

  formattingScore = Math.min(formattingPoints, 75);

  formattingDetails = `Format check: ${hasEmail ? '✓' : '✗'} Email, ${hasPhone ? '✓' : '✗'} Phone, ${hasLinkedIn ? '✓' : '✗'} LinkedIn, ${hasProperLength ? '✓' : '✗'} Length (${wordCount} words), ${hasSections ? '✓' : '✗'} Clear sections.`;
  if (!hasProperLength) {
    formattingDetails += wordCount < 300 ? ' Resume too short - aim for 300-800 words.' : ' Resume too long - keep under 1000 words.';
  }

  // ============================================
  // 6. PROJECTS & ACHIEVEMENTS (0-75 points)
  // ============================================
  let projectsScore = 0;
  let projectsDetails = '';

  const projects = parsedData.projects.filter(p => p.title || p.description);

  if (projects.length === 0) {
    projectsScore = 10;
    projectsDetails = 'No projects section. Add 2-4 relevant projects with technologies used.';
  } else if (projects.length === 1) {
    projectsScore = 35;
    projectsDetails = '1 project listed. Add 1-2 more projects to strengthen your profile.';
  } else if (projects.length === 2) {
    projectsScore = 55;
    projectsDetails = '2 projects found. Good start - consider adding one more.';
  } else if (projects.length >= 3) {
    projectsScore = 70;
    projectsDetails = `${projects.length} projects listed. Strong project portfolio.`;
  }

  // Bonus for project details
  const hasProjectMetrics = projects.some(p =>
    p.description && (p.description.match(/\d+|users|performance|efficiency/i))
  );
  if (hasProjectMetrics && projects.length >= 2) {
    projectsScore = Math.min(projectsScore + 5, 75);
  }

  // ============================================
  // CALCULATE WEIGHTED OVERALL SCORE
  // ============================================
  const weights = jobDescription ? {
    keywordsMatch: 0.25,
    skillsSection: 0.20,
    experienceRelevance: 0.25,
    educationCertifications: 0.10,
    resumeFormatting: 0.10,
    projectsAchievements: 0.10
  } : {
    keywordsMatch: 0.167,
    skillsSection: 0.167,
    experienceRelevance: 0.167,
    educationCertifications: 0.167,
    resumeFormatting: 0.167,
    projectsAchievements: 0.165
  };

  let overallScore = Math.round(
    keywordsScore * weights.keywordsMatch +
    skillsScore * weights.skillsSection +
    experienceScore * weights.experienceRelevance +
    educationScore * weights.educationCertifications +
    formattingScore * weights.resumeFormatting +
    projectsScore * weights.projectsAchievements
  );

  // ============================================
  // APPLY CRITICAL PENALTIES
  // ============================================

  // Missing sections penalty
  const missingPenalty = calculateMissingSectionsPenalty(parsedData);
  overallScore = Math.round(overallScore * (1 - missingPenalty));

  // No quantifiable results = major penalty
  if (hasQuantifiableResults < 2) {
    overallScore = Math.min(overallScore, 45);
  }

  // Lowest section drags down overall
  const lowestScore = Math.min(keywordsScore, skillsScore, experienceScore, projectsScore);
  if (lowestScore < 30) {
    overallScore = Math.min(overallScore, 40);
  } else if (lowestScore < 45) {
    overallScore = Math.min(overallScore, 52);
  }

  // Critical sections must meet minimum
  if (experienceScore < 40) overallScore = Math.min(overallScore, 48);
  if (skillsScore < 35) overallScore = Math.min(overallScore, 45);

  // Length penalty
  if (wordCount < 250) overallScore = Math.min(overallScore, 42);

  // No resume should exceed 75%
  overallScore = Math.min(overallScore, 75);

  console.log('📊 Rule-based scores calculated:', {
    keywords: keywordsScore,
    skills: skillsScore,
    experience: experienceScore,
    education: educationScore,
    formatting: formattingScore,
    projects: projectsScore,
    overall: overallScore
  });

  return {
    keywordsMatch: { score: keywordsScore, details: keywordsDetails },
    skillsSection: { score: skillsScore, details: skillsDetails },
    experienceRelevance: { score: experienceScore, details: experienceDetails },
    educationCertifications: { score: educationScore, details: educationDetails },
    resumeFormatting: { score: formattingScore, details: formattingDetails },
    projectsAchievements: { score: projectsScore, details: projectsDetails },
    overallScore: overallScore
  };
}

//  CALCULATE PENALTY FOR MISSING CRITICAL SECTIONS
function calculateMissingSectionsPenalty(parsedData: ParsedResumeData): number {
  let missingSections = 0;

  // Check critical sections
  if (!parsedData.skills.technical.length && !parsedData.skills.soft.length && !parsedData.skills.tools.length) {
    missingSections++;
    console.warn('🔴 CRITICAL: Missing Skills Section');
  }

  if (!parsedData.experience.length || parsedData.experience.every(exp => !exp.company && !exp.jobTitle)) {
    missingSections++;
    console.warn('🔴 CRITICAL: Missing Experience Section');
  }

  if (!parsedData.education.length) {
    missingSections++;
    console.warn('🔴 CRITICAL: Missing Education Section');
  }

  // Apply HEAVY penalties
  if (missingSections === 0) return 0;
  if (missingSections === 1) return 0.25; // -25%
  if (missingSections === 2) return 0.45; // -45%
  return 0.65; // -65% for 3 missing sections
}

export const analyzeResume = async (
  file: Express.Multer.File,
  jobDescription?: string
): Promise<AnalysisResult> => {
  try {
    console.log('📄 Analyzing resume with RULE-BASED STRICT scoring...');
    if (jobDescription) {
      console.log('🎯 Job description provided - performing targeted analysis');
    } else {
      console.log('📋 No job description - using general best practices');
    }

    // Step 1: Extract text from file
    const resumeText = await extractTextFromFile(file);

    if (!resumeText || resumeText.trim().length < 50) {
      throw new Error('Resume text is too short or empty');
    }

    // Step 2: Parse resume with AI
    const parsedData = await parseResumeWithAI(resumeText);

    // Step 3: Score resume with RULE-BASED scoring (no AI inflation)
    const scores = calculateRuleBasedScore(resumeText, parsedData, jobDescription);

    // Step 4: Extract basic user data
    const userData: ExtractedUserData = {
      fullName: parsedData.personalDetails.fullName || 'Unknown',
      email: parsedData.personalDetails.email || '',
      mobile: parsedData.personalDetails.phone || ''
    };

    // Step 5: Transform AI parsed data
    const transformedParsedData = {
      name: parsedData.personalDetails.fullName,
      email: parsedData.personalDetails.email,
      phone: parsedData.personalDetails.phone,
      summary: parsedData.summaryOrAboutMe,
      skills: [
        ...parsedData.skills.technical,
        ...parsedData.skills.soft,
        ...parsedData.skills.tools
      ],
      experience: parsedData.experience.map(exp => ({
        company: exp.company,
        position: exp.jobTitle,
        duration: exp.duration,
        responsibilities: exp.responsibilities
      })),
      education: parsedData.education.map(edu => ({
        institution: edu.institution,
        degree: `${edu.degree} - ${edu.fieldOfStudy}`.trim(),
        year: edu.year
      })),
      projects: parsedData.projects.map(proj => ({
        title: proj.title,
        description: proj.description
      }))
    };

    // Step 6: Return complete analysis
    const finalScore = scores.overallScore;
    console.log(`✅ Resume analysis complete - Final Score: ${finalScore}%`);

    // Score interpretation
    let interpretation = '';
    if (finalScore >= 70) interpretation = '⭐ EXCELLENT - Top 10%';
    else if (finalScore >= 60) interpretation = '✅ GOOD - Above Average';
    else if (finalScore >= 45) interpretation = '📊 AVERAGE - Industry Standard';
    else if (finalScore >= 30) interpretation = '📉 BELOW AVERAGE - Needs Improvement';
    else interpretation = '❌ POOR - Requires Major Revision';

    console.log(`📊 Score Interpretation: ${interpretation}`);

    return {
      overallScore: finalScore,
      userData,
      detailedReport: {
        keywordsMatch: {
          score: scores.keywordsMatch.score,
          percentage: scores.keywordsMatch.score,
          details: scores.keywordsMatch.details
        },
        skillsSection: {
          score: scores.skillsSection.score,
          percentage: scores.skillsSection.score,
          details: scores.skillsSection.details
        },
        experienceRelevance: {
          score: scores.experienceRelevance.score,
          percentage: scores.experienceRelevance.score,
          details: scores.experienceRelevance.details
        },
        educationCertifications: {
          score: scores.educationCertifications.score,
          percentage: scores.educationCertifications.score,
          details: scores.educationCertifications.details
        },
        resumeFormatting: {
          score: scores.resumeFormatting.score,
          percentage: scores.resumeFormatting.score,
          details: scores.resumeFormatting.details
        },
        projectsAchievements: {
          score: scores.projectsAchievements.score,
          percentage: scores.projectsAchievements.score,
          details: scores.projectsAchievements.details
        },
        parsedData: transformedParsedData
      }
    };
  } catch (error: any) {
    console.error('❌ Error analyzing resume:', error);
    throw error;
  }
};