

export interface PersonalInfo {
  full_name?: string;
  title?: string;
  email?: string;
  phone?: string;

  location?: string;
  profession?: string;
  linkedin?: string;
  website?: string;
  image?: File | string;
  mobile?: string;
  photo?: string;
  photo_url?: string;
}

export interface Reference {
  name: string;
  phone?: string;
  email?: string;
  position?: string;
  social?: string;
}

export interface Experience {
  company?: string;
  position: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  is_current?: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  start_date?: string;
  end_date?: string;
  gpa?: string;
  is_current?: boolean;
  graduation_date?: string;
  additional_info?: string;
}

export interface Project {
  name: string;
  type?: string;
  description?: string;
  date?: string;
}

export interface AdditionalInfo {
  certifications?: string;
  languages?: string;
  interests?: string;
  awards?: string;
}

export interface ResumeData {
  _id: string;
  title: string;
  personal_info: PersonalInfo;
  professional_summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  additional_info: AdditionalInfo;
  template: string;
  accent_color: string;
  public: boolean;
  

  hasBeenDownloaded?: boolean;
  firstDownloadDate?: Date;
 personalInfoEditCount?: number;
  personalInfoLocked?: boolean;
  status?: 'draft' | 'published';
  adminCreated?: boolean;
}