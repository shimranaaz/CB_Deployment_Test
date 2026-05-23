import mongoose, { Document, Schema } from 'mongoose';

export interface ILinkedIn extends Document {
  username: string;
  fullName: string;
  email: string;
  linkedinUrl?: string;
  targetRole?: string;
  linkedinScore: number;
  profileStrength: string;
  userData: {
    fullName: string;
    username: string;
    headline: string;
    estimatedConnections: string;
  };
  detailedReport: {
    profileCompleteness: { score: number; percentage: number; details: string };
    keywordOptimization: { score: number; percentage: number; details: string };
    headlineStrength:    { score: number; percentage: number; details: string };
    aboutSection:        { score: number; percentage: number; details: string };
    experienceSection:   { score: number; percentage: number; details: string };
    skillsEndorsements:  { score: number; percentage: number; details: string };
  };
  recruiterVisibility: {
    searchRankScore: number;
    missingKeywords: string[];
    topRecommendations: string[];
  };
  contentIntelligence: {
    headlineSuggestion: string;
    aboutSuggestion: string;
    impactWords: string[];
  };
  careerAlignment: {
    roleMatch: number;
    targetRole: string;
    alignmentTips: string[];
  };
  profileFixData: {
    headline: string;
    summary: string;
    about: string;
    experience: string;
    education: string;
    skills: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const LinkedInSchema: Schema = new Schema(
  {
username:      { type: String, required: true, trim: true },
    fullName:      { type: String, default: '' },
    email:         { type: String, default: '' },
    linkedinUrl:   { type: String, default: null },
    targetRole:    { type: String, default: null },
    linkedinScore: { type: Number, required: true, min: 0, max: 100 },
    profileStrength: { type: String, required: true },
    userData:        { type: Schema.Types.Mixed, required: true, default: {} },
    detailedReport:  { type: Schema.Types.Mixed, required: true, default: {} },
    recruiterVisibility: { type: Schema.Types.Mixed, default: {} },
    contentIntelligence: { type: Schema.Types.Mixed, default: {} },
    careerAlignment:     { type: Schema.Types.Mixed, default: {} },
    profileFixData:      { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const LinkedIn = mongoose.model<ILinkedIn>('LinkedIn', LinkedInSchema, 'linkedins');
export default LinkedIn;