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
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
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

interface ExecutiveCVProps {
  data: ResumeData;
  accentColor: string;
}

const ExecutiveCV: React.FC<ExecutiveCVProps> = ({ data, accentColor = '#7FA99B' }) => {
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    const month = parts[1] ? parseInt(parts[1]) - 1 : 0;
    const date = new Date(year, month);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatYearOnly = (dateStr?: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    return parts[0];
  };

  const isCurrentlyWorking = (exp: Experience): boolean => {
    return exp.is_current || !exp.end_date;
  };

  const getTransparentColor = (): string => {
    return `${accentColor}40`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white px-12 py-10" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header className="text-center mb-8">
        <div className="border-t-2 border-b-2 border-gray-300 py-4">
          <h1 className="text-4xl font-bold mb-2 uppercase tracking-wide text-gray-800">
            {data.personal_info?.full_name || 'YOUR NAME'} | {data.personal_info?.title || 'Designation'}
          </h1>
          <div className="text-sm text-gray-700">
            {data.personal_info?.location && <span>{data.personal_info.location}</span>}
            {data.personal_info?.location && (data.personal_info?.phone || data.personal_info?.email) && <span> | </span>}
            {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
            {data.personal_info?.phone && data.personal_info?.email && <span> | </span>}
            {data.personal_info?.email && <span>{data.personal_info.email}</span>}
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {data.professional_summary && (
        <section className="mb-8">
          <div className="inline-block px-6 py-2 mb-4" style={{ backgroundColor: getTransparentColor() }}>
            <h2 className="text-lg font-bold uppercase tracking-wide text-gray-800">
              PROFESSIONAL SUMMARY
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-700">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* Core Competencies */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <div className="inline-block px-6 py-2 mb-4" style={{ backgroundColor: getTransparentColor() }}>
            <h2 className="text-lg font-bold uppercase tracking-wide text-gray-800">
              CORE COMPETENCIES
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-3">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-3 text-sm text-gray-700">
                <i className="fas fa-check-circle" style={{ color: accentColor }}></i>
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      <section className="mb-8">
        <div className="inline-block px-6 py-2 mb-4" style={{ backgroundColor: getTransparentColor() }}>
          <h2 className="text-lg font-bold uppercase tracking-wide text-gray-800">
            PROFESSIONAL EXPERIENCE
          </h2>
        </div>
        <div className="space-y-6">
          {data.experience && data.experience.length > 0 && data.experience.map((exp, index) => (
            <div key={index}>
              <h3 className="text-base font-bold text-gray-800 mb-1">
                {exp.company}
              </h3>
              <p className="text-sm mb-3 text-gray-700">
                {exp.position} | {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
              </p>
              <div className="ml-5 mt-2">
                {renderBullets(exp.description, "inherit")}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-8">
        <div className="inline-block px-6 py-2 mb-4" style={{ backgroundColor: getTransparentColor() }}>
          <h2 className="text-lg font-bold uppercase tracking-wide text-gray-800">
            EDUCATION
          </h2>
        </div>
        <div className="space-y-2">
          {data.education && data.education.length > 0 && data.education.map((edu, index) => (
            <div key={index}>
              <p className="text-sm font-bold text-gray-800">
                {formatYearOnly(edu.start_date)} - {formatYearOnly(edu.end_date)} | {edu.institution}
              </p>
              <p className="text-sm text-gray-700">
                {edu.degree}{edu.field && ` - ${edu.field}`}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <div className="inline-block px-6 py-2 mb-4" style={{ backgroundColor: getTransparentColor() }}>
            <h2 className="text-lg font-bold uppercase tracking-wide text-gray-800">
              PROJECTS
            </h2>
          </div>
          <div className="space-y-6">
            {data.projects.map((proj, index) => (
              <div key={index}>
                <h3 className="text-base font-bold text-gray-800 mb-1">
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

      {/* Additional Information */}
      {data.additional_info && (data.additional_info.certifications || data.additional_info.languages || data.additional_info.interests) && (
        <section>
          <div className="inline-block px-6 py-2 mb-4" style={{ backgroundColor: getTransparentColor() }}>
            <h2 className="text-lg font-bold uppercase tracking-wide text-gray-800">
              ADDITIONAL INFORMATION
            </h2>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            {data.additional_info.certifications && (
              <div className="flex gap-2">
                <span className="font-bold">Certifications:</span>
                {renderBrList(data.additional_info.certifications, "inherit")}
              </div>
            )}
            {data.additional_info.languages && (
              <div className="flex gap-2">
                <span className="font-bold">Languages:</span>
                {renderBrList(data.additional_info.languages, "inherit")}
              </div>
            )}
            {data.additional_info.interests && (
              <div className="flex gap-2">
                <span className="font-bold">Interests:</span>
                {renderBrList(data.additional_info.interests, "inherit")}
              </div>
            )}
          </div>
        </section>
      )}

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

export default ExecutiveCV;