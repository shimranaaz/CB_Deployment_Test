

import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ATS from '../models/ATS.js';
import User from '../models/User.js';
import { analyzeResume } from '../utils/atsAnalyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export const uploadAndAnalyzeResume = async (req: Request, res: Response) => {
  try {
    console.log('📥 Received ATS analysis request');
    console.log('📎 File:', req.file);

    const jobDescription = req.body.jobDescription;

    if (jobDescription) {
      console.log('🎯 Job description received (length):', jobDescription.length);
      console.log('🎯 First 200 chars:', jobDescription.substring(0, 200));
    } else {
      console.log('📋 No job description - using RULE-BASED general scoring');
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('✅ File validation passed');
    console.log('📄 File details:', {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      path: req.file.path  // ✅ Now has value because of diskStorage
    });

    // ✅ FIXED: req.file.path now exists because route uses diskStorage
    const filePath = req.file.path;
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found at path: ${filePath}`);
      return res.status(500).json({
        success: false,
        message: 'Uploaded file not found on server'
      });
    }

    console.log('🔍 Starting RULE-BASED STRICT resume analysis...');
    if (jobDescription) {
      console.log('🎯 Performing targeted analysis with job description match');
    } else {
      console.log('📋 Performing general best practices analysis');
    }

    // Analyze the resume with RULE-BASED STRICT scoring (NO AI INFLATION)
    const analysis = await analyzeResume(req.file, jobDescription);

    console.log('✅ RULE-BASED Analysis complete:', {
      overallScore: analysis.overallScore,
      userData: analysis.userData,
      hasJobDescription: !!jobDescription,
      breakdown: {
        keywords: analysis.detailedReport.keywordsMatch?.score,
        skills: analysis.detailedReport.skillsSection?.score,
        experience: analysis.detailedReport.experienceRelevance?.score,
        education: analysis.detailedReport.educationCertifications?.score,
        formatting: analysis.detailedReport.resumeFormatting?.score,
        projects: analysis.detailedReport.projectsAchievements?.score
      }
    });

    // REALISTIC Score interpretation (Updated ranges based on rule-based scoring)
    let scoreInterpretation = '';
    let scoreCategory = '';

    if (analysis.overallScore >= 70) {
      scoreInterpretation = '⭐ EXCELLENT - Top 10% candidate';
      scoreCategory = 'excellent';
    } else if (analysis.overallScore >= 60) {
      scoreInterpretation = '✅ GOOD - Above average';
      scoreCategory = 'good';
    } else if (analysis.overallScore >= 45) {
      scoreInterpretation = '📊 AVERAGE - Industry standard';
      scoreCategory = 'average';
    } else if (analysis.overallScore >= 30) {
      scoreInterpretation = '📉 BELOW AVERAGE - Needs improvement';
      scoreCategory = 'below-average';
    } else {
      scoreInterpretation = '❌ POOR - Requires major revision';
      scoreCategory = 'poor';
    }

    console.log(`📊 Score Interpretation: ${scoreInterpretation}`);

    if (analysis.overallScore > 75) {
      console.log(`⚡ OUTSTANDING: Score above 75% (${analysis.overallScore}%). This candidate has exceptional credentials.`);
    } else if (analysis.overallScore > 70) {
      console.log(`🌟 EXCELLENT: Score above 70% (${analysis.overallScore}%). Strong candidate.`);
    }

    const resumePath = req.file.path.replace(/\\/g, '/');

    // Prepare realistic feedback based on RULE-BASED STRICT score ranges
    const prepareFeedback = (report: any, overallScore: number) => {
      const strengths: string[] = [];
      const improvements: string[] = [];
      const suggestions: string[] = [];

      // Scores 65+ are "strengths" (rule-based is stricter)
      if (report.keywordsMatch?.score >= 65) {
        strengths.push(`Strong keyword match (${report.keywordsMatch.score}%): ${report.keywordsMatch.details}`);
      }
      if (report.skillsSection?.score >= 65) {
        strengths.push(`Well-structured skills section (${report.skillsSection.score}%): ${report.skillsSection.details}`);
      }
      if (report.experienceRelevance?.score >= 65) {
        strengths.push(`Relevant experience demonstrated (${report.experienceRelevance.score}%): ${report.experienceRelevance.details}`);
      }
      if (report.projectsAchievements?.score >= 65) {
        strengths.push(`Strong projects section (${report.projectsAchievements.score}%): ${report.projectsAchievements.details}`);
      }
      if (report.resumeFormatting?.score >= 65) {
        strengths.push(`Good formatting structure (${report.resumeFormatting.score}%): ${report.resumeFormatting.details}`);
      }
      if (report.educationCertifications?.score >= 65) {
        strengths.push(`Strong education credentials (${report.educationCertifications.score}%): ${report.educationCertifications.details}`);
      }

      // Scores below 50 need major improvement
      if (report.keywordsMatch?.score < 50) {
        improvements.push(`⚠️ CRITICAL: Keywords need significant work (${report.keywordsMatch.score}%): ${report.keywordsMatch.details}`);
      } else if (report.keywordsMatch?.score < 65) {
        improvements.push(`Keywords could be improved (${report.keywordsMatch.score}%): ${report.keywordsMatch.details}`);
      }

      if (report.skillsSection?.score < 50) {
        improvements.push(`⚠️ CRITICAL: Skills section needs major improvement (${report.skillsSection.score}%): ${report.skillsSection.details}`);
      } else if (report.skillsSection?.score < 65) {
        improvements.push(`Skills section needs enhancement (${report.skillsSection.score}%): ${report.skillsSection.details}`);
      }

      if (report.experienceRelevance?.score < 50) {
        improvements.push(`⚠️ CRITICAL: Experience section requires significant strengthening (${report.experienceRelevance.score}%): ${report.experienceRelevance.details}`);
      } else if (report.experienceRelevance?.score < 65) {
        improvements.push(`Experience section could be stronger (${report.experienceRelevance.score}%): ${report.experienceRelevance.details}`);
      }

      if (report.resumeFormatting?.score < 50) {
        improvements.push(`⚠️ CRITICAL: Formatting needs major adjustment (${report.resumeFormatting.score}%): ${report.resumeFormatting.details}`);
      } else if (report.resumeFormatting?.score < 65) {
        improvements.push(`Formatting could be improved (${report.resumeFormatting.score}%): ${report.resumeFormatting.details}`);
      }

      if (report.projectsAchievements?.score < 50) {
        improvements.push(`⚠️ CRITICAL: Projects section needs substantial enhancement (${report.projectsAchievements.score}%): ${report.projectsAchievements.details}`);
      } else if (report.projectsAchievements?.score < 65) {
        improvements.push(`Projects section could be enhanced (${report.projectsAchievements.score}%): ${report.projectsAchievements.details}`);
      }

      // Education suggestions
      if (report.educationCertifications?.score < 55) {
        suggestions.push(`Education & Certifications (${report.educationCertifications.score}%): ${report.educationCertifications.details}`);
      } else if (report.educationCertifications?.score < 65) {
        suggestions.push(`Education section is adequate (${report.educationCertifications.score}%): ${report.educationCertifications.details}`);
      } else {
        suggestions.push(`Strong education credentials (${report.educationCertifications.score}%): ${report.educationCertifications.details}`);
      }

      // Overall score-based suggestions
      if (overallScore < 30) {
        suggestions.push('⚠️ Your resume requires comprehensive improvement across multiple areas. Consider professional resume writing assistance.');
        suggestions.push('Focus on adding quantifiable achievements, relevant keywords, and proper formatting.');
        suggestions.push('Priority: Add measurable results (e.g., "Increased sales by 25%", "Reduced costs by $50K").');
      } else if (overallScore < 45) {
        suggestions.push('Your resume has basic structure but needs significant refinement in key areas.');
        suggestions.push('Add more specific metrics and achievements to strengthen your application.');
        suggestions.push('Focus on quantifiable results and industry-specific keywords.');
      } else if (overallScore < 60) {
        suggestions.push('Your resume is at industry standard. Strengthen it with more detailed achievements.');
        suggestions.push('Add quantifiable results to each position and tailor keywords for specific roles.');
        suggestions.push('Consider adding relevant certifications or professional development.');
      } else if (overallScore < 70) {
        suggestions.push('Your resume is above average. Focus on fine-tuning details for specific job applications.');
        suggestions.push('Ensure each application highlights the most relevant achievements for that role.');
        suggestions.push('Continue optimizing keyword match for target positions.');
      } else {
        suggestions.push('Excellent resume! You\'re in the top tier of candidates.');
        suggestions.push('Minor optimizations: Tailor each application to the specific job requirements.');
        suggestions.push('Continue customizing your resume for each opportunity while maintaining this strong foundation.');
      }

      // Fallback messages
      if (strengths.length === 0) {
        strengths.push('Resume structure is present. Focus on the improvement areas below to enhance your application.');
      }
      if (improvements.length === 0) {
        improvements.push('Continue refining your resume based on specific job requirements for optimal results.');
      }

      return { strengths, improvements, suggestions };
    };

    const feedback = prepareFeedback(analysis.detailedReport, analysis.overallScore);

    // Save to database
    console.log('💾 Saving to database with RULE-BASED STRICT scoring results...');
    const atsSubmission = new ATS({
      fullName: analysis.userData.fullName,
      email: analysis.userData.email,
      mobile: analysis.userData.mobile,
      resumePath: resumePath,
      atsScore: analysis.overallScore,
      detailedReport: analysis.detailedReport,
      jobDescription: jobDescription || null,
      feedback: feedback
    });

await atsSubmission.save();
console.log('✅ Saved to database with ID:', atsSubmission._id);

const userId = (req as any).userId;
if (userId) {
  await User.findByIdAndUpdate(userId, { $set: { atsScore: analysis.overallScore } });
  console.log('✅ ATS score saved to user:', analysis.overallScore);
}
    console.log('📁 File saved at:', resumePath);
    console.log('📊 Score category:', scoreCategory);

    if (jobDescription) {
      console.log('🎯 Job description saved with submission');
    }

    // Log statistics for monitoring
    console.log('📈 Analysis Statistics:', {
      overallScore: analysis.overallScore,
      scoreCategory: scoreCategory,
      lowestSection: Math.min(
        analysis.detailedReport.keywordsMatch.score,
        analysis.detailedReport.skillsSection.score,
        analysis.detailedReport.experienceRelevance.score,
        analysis.detailedReport.educationCertifications.score,
        analysis.detailedReport.resumeFormatting.score,
        analysis.detailedReport.projectsAchievements.score
      ),
      highestSection: Math.max(
        analysis.detailedReport.keywordsMatch.score,
        analysis.detailedReport.skillsSection.score,
        analysis.detailedReport.experienceRelevance.score,
        analysis.detailedReport.educationCertifications.score,
        analysis.detailedReport.resumeFormatting.score,
        analysis.detailedReport.projectsAchievements.score
      )
    });
console.log('✅ Response sent successfully');

// ✅ Delete file after successful analysis
if (req.file?.path && fs.existsSync(req.file.path)) {
  try {
    fs.unlinkSync(req.file.path);
    console.log('🗑️ Cleaned up file after success');
  } catch (e) {
    console.warn('⚠️ Could not delete file after success');
  }
}

res.status(200).json({
      success: true,
      message: jobDescription
        ? `Resume analyzed with rule-based strict scoring against job description. Score: ${analysis.overallScore}% (${scoreInterpretation})`
        : `Resume analyzed with rule-based strict scoring. Score: ${analysis.overallScore}% (${scoreInterpretation})`,
      data: {
        atsScore: analysis.overallScore,
        scoreInterpretation: scoreInterpretation,
        scoreCategory: scoreCategory,
        userData: analysis.userData,
        detailedReport: analysis.detailedReport,
        feedback: feedback,
        hasJobDescription: !!jobDescription,
        analysisMetadata: {
          scoringMethod: 'rule-based',
          scoringVersion: '3.0-rule-based-strict',
          analysisDate: new Date().toISOString(),
          maxPossibleScore: 75
        }
      }
    });

  } catch (error: any) {
    console.error('❌❌❌ ERROR in uploadAndAnalyzeResume ❌❌❌');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    // ✅ Clean up file on error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('🗑️ Cleaned up file after error');
      } catch (cleanupError) {
        console.warn('⚠️ Could not delete temp file on error');
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze resume. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get ATS Report by ID
export const getATSReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log('🔍 Fetching ATS report for ID:', id);

    const submission = await ATS.findById(id);

    if (!submission) {
      console.error('❌ Submission not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    console.log('✅ Found submission:', {
      id: submission._id,
      name: submission.fullName,
      score: submission.atsScore,
      hasJobDescription: !!submission.jobDescription
    });

    res.json({
      success: true,
      data: submission
    });

  } catch (error: any) {
    console.error('❌ Error fetching ATS report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch report'
    });
  }
};

// Get all ATS records (Admin) - With Pagination & Statistics
export const getAllATSRecords = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

 const search = (req.query.search as string) || '';
const searchQuery = search
  ? {
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
      ],
    }
  : {};

const totalRecords = await ATS.countDocuments(searchQuery);
const atsRecords = await ATS.find(searchQuery)
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

    const allScores = await ATS.find().select('atsScore');
    const avgScore = allScores.length > 0
      ? Math.round(allScores.reduce((sum, record) => sum + record.atsScore, 0) / allScores.length)
      : 0;

    const scoreDistribution = {
      excellent: allScores.filter(s => s.atsScore >= 70).length,
      good: allScores.filter(s => s.atsScore >= 60 && s.atsScore < 70).length,
      average: allScores.filter(s => s.atsScore >= 45 && s.atsScore < 60).length,
      belowAverage: allScores.filter(s => s.atsScore >= 30 && s.atsScore < 45).length,
      poor: allScores.filter(s => s.atsScore < 30).length
    };

    console.log(`📊 Retrieved ${atsRecords.length} ATS records (Page ${page}/${Math.ceil(totalRecords / limit)})`);
    console.log(`📈 Average Score: ${avgScore}%`);
    console.log('📊 Score Distribution:', scoreDistribution);

    res.status(200).json({
      success: true,
      submissions: atsRecords,
      pagination: {
        total: totalRecords,
        page,
        pages: Math.ceil(totalRecords / limit),
        limit
      },
      statistics: {
        averageScore: avgScore,
        totalSubmissions: totalRecords,
        scoreDistribution: scoreDistribution
      }
    });
  } catch (error: any) {
    console.error('❌ Error in getAllATSRecords:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete ATS record (Admin) - Delete file too
export const deleteATSRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Deleting ATS record:', id);

    const atsRecord = await ATS.findByIdAndDelete(id);

    if (!atsRecord) {
      return res.status(404).json({
        success: false,
        message: 'ATS record not found'
      });
    }

    if (atsRecord.resumePath) {
      const fullPath = path.join(__dirname, '..', atsRecord.resumePath);

      console.log('🔍 Attempting to delete file:', fullPath);

      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log('✅ Successfully deleted resume file:', fullPath);
        } catch (err) {
          console.error('❌ Could not delete resume file:', err);
        }
      } else {
        console.warn('⚠️ Resume file not found (may have been deleted already):', fullPath);
      }
    }

    console.log('✅ ATS record deleted successfully');

    res.status(200).json({
      success: true,
      message: 'ATS record and file deleted successfully',
    });
  } catch (error: any) {
    console.error('❌ Error in deleteATSRecord:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};