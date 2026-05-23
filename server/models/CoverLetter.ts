import mongoose, { Schema, Document } from 'mongoose';

export interface ICoverLetter extends Document {
  user_id: mongoose.Types.ObjectId;
  title: string;
  contact_info?: {
    full_name?: string;
    phone?: string;
    email?: string;
    linkedin?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    date?: string;
  };
  recipient_info?: {
    manager_name?: string;
    job_title?: string;
    company_name?: string;
    company_address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
  opening?: {
      greeting: String,
    position_title?: string;
    how_found?: string;
    summary?: string;
  };
  body?: {
    skill_1?: string;
    skill_2?: string;
    experience_summary?: string;
    why_company?: string;
  };
  closing?: {
    enthusiasm?: string;
    next_step?: string;
    sign_off?: string;
  };
  header_color?: string;
}

const coverLetterSchema = new Schema<ICoverLetter>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'Untitled Cover Letter'
  },
  contact_info: {
    full_name: String,
    phone: String,
    email: String,
    linkedin: String,
    city: String,
    state: String,
    postal_code: String,
    date: String
  },
  recipient_info: {
    manager_name: String,
    job_title: String,
    company_name: String,
    company_address: String,
    city: String,
    state: String,
    postal_code: String
  },
  opening: {
    position_title: String,
    how_found: String,
    summary: String
  },
  body: {
    skill_1: String,
    skill_2: String,
    experience_summary: String,
    why_company: String
  },
  closing: {
    enthusiasm: String,
    next_step: String,
    sign_off: String
  },
  header_color: {
    type: String,
    default: '#2c2a63'
  }
}, {
  timestamps: true
});

const CoverLetter = mongoose.model<ICoverLetter>('CoverLetter', coverLetterSchema);

export default CoverLetter;