export interface ContactInfo {
  full_name?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  date?: string;
}

export interface RecipientInfo {
  manager_name?: string;
  job_title?: string;
  company_name?: string;
  company_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
}

export interface Opening {
  greeting?: string;
  position_title?: string;
  how_found?: string;
  summary?: string;
}

export interface Body {
  skill_1?: string;
  skill_2?: string;
  experience_summary?: string;
  why_company?: string;
}

export interface Closing {
  enthusiasm?: string;
  next_step?: string;
  sign_off?: string;
}

export interface CoverLetterData {
  _id?: string;
  user_id?: string;
  title?: string;
  contact_info?: ContactInfo;
  recipient_info?: RecipientInfo;
  opening?: Opening;
  body?: Body;
  closing?: Closing;
  header_color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CoverLetterResponse {
  coverLetter: CoverLetterData;
  message?: string;
}