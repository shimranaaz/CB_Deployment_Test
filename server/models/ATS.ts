import mongoose, { Document, Schema } from 'mongoose';

interface DetailedReportSection {
  score: number;
  percentage: number;
  details: string;
}

interface DetailedReport {
  keywordsMatch: DetailedReportSection;
  skillsSection: DetailedReportSection;
  experienceRelevance: DetailedReportSection;
  educationCertifications: DetailedReportSection;
  resumeFormatting: DetailedReportSection;
  projectsAchievements: DetailedReportSection;
  parsedData?: {
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
}

export interface IATS extends Document {
  fullName: string;
  email: string;
  mobile: string;
  resumePath: string;
  atsScore: number;
  detailedReport: DetailedReport;
  jobDescription?: string;
  feedback: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const ATSSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: false,
      trim: true,
      default: 'Not provided'
    },
    resumePath: {
      type: String,
      required: [true, 'Resume file path is required'],
    },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    detailedReport: {
      type: Schema.Types.Mixed,
      required: true,
      default: {}
    },

    jobDescription: {
      type: String,
      required: false,
      default: null
    },
    feedback: {
      strengths: {
        type: [String],
        default: []
      },
      improvements: {
        type: [String],
        default: []
      },
      suggestions: {
        type: [String],
        default: []
      }
    }
  },
  {
    timestamps: true,
  }
);

const ATS = mongoose.model<IATS>('ATS', ATSSchema);

export default ATS;