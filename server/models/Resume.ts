import mongoose, { Document, Schema, Model } from "mongoose";

export interface PersonalInfo {
  image: string;
  full_name: string;
  title: string;
  profession: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface Experience {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
  is_current: boolean;
}

export interface Project {
  name: string;
  type: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  start_date?: string;
  end_date?: string;
  gpa?: string;
  additional_info?: string;
  is_current?: boolean;
}

export interface AdditionalInfo {
  certifications: string;
  languages: string;
  interests: string;
}

export interface IResume extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  public: boolean;
  template: string;
  accent_color: string;
  professional_summary: string;
  skills: string[];
  personal_info: PersonalInfo;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  additional_info: AdditionalInfo;
  deletedUserInfo?: {
    name: string;
    email: string;
    mobile: string;
  };

  hasBeenDownloaded: boolean;
  firstDownloadDate?: Date;
adminUploadedPdf?: string;
  status?: 'draft' | 'published';
  adminCreated?: boolean;
   createdByRole?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema<IResume> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled Resume" },
    public: { type: Boolean, default: false },
   template: { type: String, default: "geometric-blue" },
    accent_color: { type: String, default: "#2c2a63" },
    professional_summary: { type: String, default: "" },
    skills: [{ type: String }],
    personal_info: {
      image: { type: String, default: "" },
      full_name: { type: String, default: "" },
      title: { type: String, default: "" },
      profession: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    experience: [
      {
        company: { type: String },
        position: { type: String },
        start_date: { type: String },
        end_date: { type: String },
        description: { type: String },
        is_current: { type: Boolean },
      },
    ],
    projects: [
      {
        name: { type: String },
        type: { type: String },
        description: { type: String },
      },
    ],
    education: [
      {
        institution: { type: String, default: "" },
        degree: { type: String, default: "" },
        field: { type: String, default: "" },
        start_date: { type: String, default: "" },
        end_date: { type: String, default: "" },
        gpa: { type: String, default: "" },
        additional_info: { type: String, default: "" },
        is_current: { type: Boolean, default: false },
      },
    ],
    additional_info: {
      certifications: { type: String, default: "" },
      languages: { type: String, default: "" },
      interests: { type: String, default: "" },
    },
    deletedUserInfo: {
      name: { type: String },
      email: { type: String },
      mobile: { type: String }
    },

    hasBeenDownloaded: {
      type: Boolean,
      default: false
    },
    firstDownloadDate: {
      type: Date
    },

adminUploadedPdf: {
      type: String,
      default: ''
    },

  status: {
  type: String,
  enum: ['draft', 'published'],
  default: 'draft',      
},
 adminCreated: {
      type: Boolean,
      default: false,
    },
    createdByRole: {
      type: String,
      enum: ['user', 'admin', 'sales'],
      default: 'user',
    },

  },
  { timestamps: true, minimize: false }
);

const Resume: Model<IResume> = mongoose.model<IResume>("Resume", ResumeSchema);

export default Resume;