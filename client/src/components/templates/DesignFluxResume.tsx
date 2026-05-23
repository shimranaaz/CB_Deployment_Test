import React from 'react';
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

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

interface DesignFluxResumeProps {
  data: ResumeData;
  accentColor: string;
}

const DesignFluxResume: React.FC<DesignFluxResumeProps> = ({ data, accentColor = '#5A5A5A' }) => {
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    return year.toString();
  };

  const isCurrentlyWorking = (exp: Experience): boolean => {
    return exp.is_current || !exp.end_date;
  };

  const getInitials = (): string => {
    const name = data.personal_info?.full_name || 'Your Name';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return parts[0][0] || 'YN';
  };

  const getTransparentColor = (): string => {
    return `${accentColor}20`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header with watermark */}
      <div className="relative px-12 py-10 overflow-hidden">
        {/* Large watermark initials */}
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
          style={{
            fontSize: '140px',
            lineHeight: '1',
            color: `${accentColor}30`,
            fontFamily: 'Calligraphy, cursive',
            fontStyle: 'italic',
            fontWeight: '300'
          }}
        >
          {getInitials()}
        </div>

        {/* Name and title */}
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold tracking-widest mb-3" style={{ color: accentColor }}>
            {data.personal_info?.full_name?.toUpperCase() || 'YOUR NAME'}
          </h1>
          <p className="text-xl tracking-widest text-gray-600">
            {data.personal_info?.title?.toUpperCase() || 'DESIGNATION'}
          </p>
        </div>
      </div>

      {/* Two column layout */}
      <div className="flex">
        {/* Left sidebar */}
        <div className="w-2/5 px-10 py-8" style={{ backgroundColor: getTransparentColor() }}>
          {/* Contact Section */}
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-6 tracking-widest" style={{ color: accentColor }}>
              CONTACT
            </h2>
            <div className="space-y-4 text-sm" style={{ color: '#8B7B7B' }}>
              {data.personal_info?.phone && (
                <div className="flex items-start gap-3">
                  <i className="fas fa-phone mt-1" style={{ color: '#8B7B7B' }}></i>
                  <span>{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-start gap-3">
                  <i className="fas fa-envelope mt-1" style={{ color: '#8B7B7B' }}></i>
                  <span className="break-all">{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-start gap-3">
                  <i className="fas fa-map-marker-alt mt-1" style={{ color: '#8B7B7B' }}></i>
                  <span>{data.personal_info.location}</span>
                </div>
              )}
            </div>
          </section>

          {/* Education Section */}
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-6 tracking-widest" style={{ color: accentColor }}>
              EDUCATION
            </h2>
            <div className="space-y-6">
              {data.education && data.education.length > 0 && data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="text-sm font-bold mb-2 uppercase" style={{ color: accentColor }}>
                    {edu.degree}
                  </h3>
                  <p className="text-sm mb-1" style={{ color: '#8B7B7B' }}>
                    {edu.institution}
                  </p>
                  <p className="text-sm font-bold" style={{ color: accentColor }}>
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-6 tracking-widest" style={{ color: accentColor }}>
              SKILLS
            </h2>
            <div className="space-y-2 text-sm" style={{ color: '#8B7B7B' }}>
              {data.skills && data.skills.length > 0 && data.skills.map((skill, index) => (
                <div key={index}>{skill}</div>
              ))}
            </div>
          </section>

          {/* Additional Information */}
          {data.additional_info &&
            (data.additional_info.languages ||
              data.additional_info.certifications ||
              data.additional_info.interests) && (
            <section>
              <h2 className="text-lg font-bold mb-6 tracking-widest" style={{ color: accentColor }}>
                ADDITIONAL INFO
              </h2>
              <div className="space-y-4 text-sm" style={{ color: '#8B7B7B' }}>
                {data.additional_info.certifications && (
                  <div>
                    <p className="font-semibold mb-1" style={{ color: accentColor }}>Certifications</p>
                    {renderBrList(data.additional_info.certifications, "inherit")}
                  </div>
                )}
                {data.additional_info.languages && (
                  <div>
                    <p className="font-semibold mb-1" style={{ color: accentColor }}>Languages</p>
                    {renderBrList(data.additional_info.languages, "inherit")}
                  </div>
                )}
                {data.additional_info.interests && (
                  <div>
                    <p className="font-semibold mb-1" style={{ color: accentColor }}>Interests</p>
                    {renderBrList(data.additional_info.interests, "inherit")}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Right content area */}
        <div className="w-3/5 px-10 py-8">
          {/* Summary Section */}
          {data.professional_summary && (
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4 tracking-widest" style={{ color: accentColor }}>
                SUMMARY
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* Experience Section */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-6 tracking-widest" style={{ color: accentColor }}>
              EXPERIENCE
            </h2>
            <div className="space-y-8">
              {data.experience && data.experience.length > 0 && data.experience.map((exp, index) => (
                <div key={index}>
                  <h3 className="text-base font-bold mb-1 uppercase" style={{ color: accentColor }}>
                    {exp.position}
                  </h3>
                  <p className="text-sm mb-1" style={{ color: '#6B6B6B' }}>
                    {exp.company}
                  </p>
                  <p className="text-sm font-bold mb-3" style={{ color: accentColor }}>
                    {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                  </p>
                  <div className="ml-5 mt-2">
                    {renderBullets(exp.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-6 tracking-widest" style={{ color: accentColor }}>
                PROJECTS
              </h2>
              <div className="space-y-8">
                {data.projects.map((proj: Project, index: number) => (
                  <div key={index}>
                    <h3 className="text-base font-bold mb-1 uppercase" style={{ color: accentColor }}>
                      {proj.name}
                    </h3>
                    <div className="ml-5 mt-2">
                      {renderBullets(proj.description, "inherit")}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Font Awesome CSS */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

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

export default DesignFluxResume;