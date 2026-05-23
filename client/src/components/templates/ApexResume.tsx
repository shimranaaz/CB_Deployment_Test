import React, { useState } from 'react';
import { renderBullets, renderAdditionalInfo } from '@/utils/resumeHelpers';

interface PersonalInfo {
  full_name?: string;
  title?: string;
  phone?: string;
  email?: string;
  location?: string;
  website?: string;
}

interface Experience {
  position?: string;
  company?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
}

interface Education {
  degree?: string;
  institution?: string;
  field?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  gpa?: string;
  additional_info?: string;
}

interface Project {
  name: string;
  description?: string;
}

interface AdditionalInfo {
  languages?: string;
  certifications?: string;
  interests?: string;
}

interface ResumeData {
  personal_info?: PersonalInfo;
  professional_summary?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  projects?: Project[];
  additional_info?: AdditionalInfo;
}

interface ApexResumeProps {
  data: ResumeData;
  accentColor: string;
}

const ApexResume: React.FC<ApexResumeProps> = ({ data, accentColor = '#5B6B7D' }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    const month = parts[1] ? parseInt(parts[1]) - 1 : 0;
    const date = new Date(year, month);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const isCurrentlyWorking = (exp: Experience): boolean => {
    return exp.is_current || !exp.end_date;
  };

  const isCurrentlyStudying = (edu: Education): boolean => {
    return edu.is_current || !edu.end_date;
  };

  // ── Apex-specific section header style ──────────────────────────────────────
  // Pass this into renderAdditionalInfo so it uses the same pill header as the rest of the template
  const sectionHeader = (title: string) => (
    <div className="rounded-full px-6 py-2.5 mb-4 inline-block" style={{ backgroundColor: accentColor }}>
      <h2 className="text-base font-bold text-white">{title}</h2>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header Section */}
      <div className="flex items-center justify-between px-10 pt-10 pb-6 bg-[#F5F5F5]">
        <div className="flex-grow">
          <h1 className="text-5xl font-bold mb-2" style={{ color: accentColor }}>
            {data.personal_info?.full_name || 'YOUR NAME'}
          </h1>
          <p className="text-2xl" style={{ color: accentColor, opacity: 0.7 }}>
            {data.personal_info?.title || 'Designation'}
          </p>
        </div>

        <div className="flex-shrink-0 ml-8">
          <div className="relative w-44 h-44 rounded-full overflow-hidden bg-gray-300">
            {profileImage ? (
              <>
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                <label className="absolute inset-0 flex items-center justify-center cursor-pointer group">
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity"></div>
                  <i className="fas fa-camera text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity relative z-10"></i>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer group">
                <i className="fas fa-user text-5xl mb-2" style={{ color: accentColor, opacity: 0.4 }}></i>
                <span className="text-xs font-semibold text-center px-3" style={{ color: accentColor, opacity: 0.5 }}>Upload Photo</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex bg-white">
        {/* Left Sidebar */}
        <div className="w-5/12 pl-0 pr-6 pt-12 pb-10">
          {/* Contact Section */}
          <div className="mb-8 pl-10">
            {sectionHeader('CONTACT')}
            <div className="space-y-3">
              {data.personal_info?.phone && (
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: accentColor }}>
                    <i className="fas fa-phone-alt text-xs text-white"></i>
                  </div>
                  <span className="text-sm" style={{ color: accentColor }}>{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: accentColor }}>
                    <i className="fas fa-envelope text-xs text-white"></i>
                  </div>
                  <span className="text-sm break-all" style={{ color: accentColor }}>{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: accentColor }}>
                    <i className="fas fa-map-marker-alt text-xs text-white"></i>
                  </div>
                  <span className="text-sm" style={{ color: accentColor }}>{data.personal_info.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8 pl-10">
            {sectionHeader('SKILLS')}
            <div className="space-y-2">
              {data.skills && data.skills.length > 0 && data.skills.map((skill: string, index: number) => (
                <div key={index} className="text-sm" style={{ color: accentColor }}>{skill}</div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="pl-10">
            {sectionHeader('EDUCATION')}
            <div className="space-y-5">
              {data.education && data.education.length > 0 && data.education.map((edu: Education, index: number) => (
                <div key={index}>
                  <h3 className="text-sm font-bold mb-1" style={{ color: accentColor }}>{edu.degree}</h3>
                  <p className="text-sm mb-1" style={{ color: accentColor }}>{edu.institution}</p>
                  <p className="text-sm" style={{ color: accentColor }}>
                    {edu.start_date && formatDate(edu.start_date)}
                    {edu.start_date && " - "}
                    {isCurrentlyStudying(edu) ? "Present" : edu.end_date ? formatDate(edu.end_date) : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Additional Info — Languages, Certifications, Interests */}
          {/* Rendered from shared helper. Each section auto-skipped if data is empty. */}
          <div className="pl-10 mt-8">
            {renderAdditionalInfo(data.additional_info, {
              color: accentColor,
              renderSectionHeader: sectionHeader,
            })}
          </div>
        </div>

        {/* Right Content */}
        <div className="w-7/12 px-12 pt-6 pb-10 bg-white">
          {/* Profile Section */}
          <div className="mb-8">
            {sectionHeader('PROFILE')}
            <p className="text-sm leading-relaxed" style={{ color: accentColor }}>
              {data.professional_summary}
            </p>
          </div>

          {/* Experience Section */}
          <div className="mb-8">
            {sectionHeader('EXPERIENCE')}
            <div className="space-y-6">
              {data.experience && data.experience.length > 0 && data.experience.map((exp: Experience, index: number) => (
                <div key={index}>
                  <h3 className="text-sm font-bold mb-1" style={{ color: accentColor }}>{exp.position}</h3>
                  <p className="text-sm mb-1" style={{ color: accentColor }}>{exp.company}</p>
                  <p className="text-sm mb-3" style={{ color: accentColor }}>
                    {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                  </p>
                  {/* ✅ Bullets via shared helper */}
                  {renderBullets(exp.description, accentColor)}
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          {data.projects && data.projects.length > 0 && (
            <div>
              {sectionHeader('PROJECTS')}
              <div className="space-y-6">
                {data.projects.map((proj: Project, index: number) => (
                  <div key={index}>
                    <h3 className="text-sm font-bold mb-1" style={{ color: accentColor }}>{proj.name}</h3>
                    {/* ✅ Bullets via shared helper */}
                    {renderBullets(proj.description, accentColor)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FontAwesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      {/* Print Styles */}
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ApexResume;