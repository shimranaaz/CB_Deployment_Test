import React from "react";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface ResumeData {
  personal_info?: {
    full_name?: string;
    title?: string;
    location?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  professional_summary?: string;
  skills?: string[];
  experience?: Experience[];
  projects?: Project[];
  education?: Education[];
  additional_info?: {
    certifications?: string;
    languages?: string;
    interests?: string;
    awards?: string;
  };
}

interface Experience {
  position: string;
  company?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
}

interface Project {
  name: string;
  description?: string;
  date?: string;
}

interface Education {
  degree: string;
  field?: string;
  institution: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  additional_info?: string;
  gpa?: string;
}

interface SoftStylishTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const SoftStylishTemplate: React.FC<SoftStylishTemplateProps> = ({ data, accentColor }) => {
  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

  const isCurrentlyWorking = (exp: Experience): boolean => exp.is_current || !exp.end_date;
  const isCurrentlyStudying = (edu: Education): boolean => edu.is_current || !edu.end_date;

  return (
    <>
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .sst-accent-bg {
            background-color: ${accentColor}33 !important;
          }
          .sst-accent-text {
            color: ${accentColor} !important;
          }
          .sst-accent-dot {
            background-color: ${accentColor} !important;
          }
        }
      `}</style>
      <div className="max-w-4xl mx-auto bg-white text-gray-800 p-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3 tracking-wide uppercase">
            {data.personal_info?.full_name || "YOUR NAME"}
          </h1>
          <div className="text-sm text-gray-600 mb-3">
            {data.personal_info?.location && <span>{data.personal_info.location}</span>}
            {data.personal_info?.email && <span> | {data.personal_info.email}</span>}
            {data.personal_info?.website && <span> | {data.personal_info.website}</span>}
          </div>
          <h2 className="text-2xl font-bold tracking-widest uppercase">
            {data.personal_info?.title || "Designation"}
          </h2>
        </header>

        {/* Technical Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-8">
            <div className="sst-accent-bg py-3 px-4 mb-4" style={{ backgroundColor: hexToRgba(accentColor, 0.2) }}>
              <h2 className="sst-accent-text text-lg font-bold tracking-widest uppercase" style={{ color: accentColor }}>TECHNICAL SKILLS</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 px-4">
              {data.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="sst-accent-dot w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-8">
            <div className="sst-accent-bg py-3 px-4 mb-4" style={{ backgroundColor: hexToRgba(accentColor, 0.2) }}>
              <h2 className="sst-accent-text text-lg font-bold tracking-widest uppercase" style={{ color: accentColor }}>PROJECTS</h2>
            </div>
            <div className="space-y-4 px-4">
              {data.projects.map((proj, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-base">{proj.name}</h3>
                    <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                      {proj.date || ""}
                    </span>
                  </div>
                  {/* ✅ CHANGED: renderBullets for projects */}
                  <div className="ml-2">
                    {renderBullets(proj.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="mb-8">
            <div className="sst-accent-bg py-3 px-4 mb-4" style={{ backgroundColor: hexToRgba(accentColor, 0.2) }}>
              <h2 className="sst-accent-text text-lg font-bold tracking-widest uppercase" style={{ color: accentColor }}>EDUCATION</h2>
            </div>
            <div className="space-y-4 px-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-base">
                      {edu.degree} {edu.field && `${edu.field}`}
                    </h3>
                    <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                      {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "present" : formatDate(edu.end_date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{edu.institution}</p>
                  {edu.additional_info && (
                    <ul className="space-y-1 text-sm text-gray-700 mt-2">
                      {edu.additional_info.split("\n").filter(line => line.trim()).map((line, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5">•</span>
                          <span>{line.trim().replace(/^[•\-]\s*/, "")}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {edu.gpa && (
                    <div className="flex items-start gap-2 text-sm text-gray-700 mt-1">
                      <span className="mt-1.5">•</span>
                      <span>GPA: {edu.gpa}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <div className="sst-accent-bg py-3 px-4 mb-4" style={{ backgroundColor: hexToRgba(accentColor, 0.2) }}>
              <h2 className="sst-accent-text text-lg font-bold tracking-widest uppercase" style={{ color: accentColor }}>WORK EXPERIENCE</h2>
            </div>
            <div className="space-y-4 px-4">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-base">
                      {exp.position} | {exp.company}
                    </h3>
                    <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                      {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  {/* ✅ CHANGED: renderBullets for experience */}
                  <div className="ml-2 mt-1">
                    {renderBullets(exp.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.additional_info?.certifications && (
          <section className="mb-8">
            <div className="sst-accent-bg py-3 px-4 mb-4" style={{ backgroundColor: hexToRgba(accentColor, 0.2) }}>
              <h2 className="sst-accent-text text-lg font-bold tracking-widest uppercase" style={{ color: accentColor }}>CERTIFICATIONS</h2>
            </div>
            {/* ✅ CHANGED: renderBrList for certifications */}
            <div className="px-4">
              {renderBrList(data.additional_info.certifications, "inherit")}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.additional_info?.languages && (
          <section className="mb-8">
            <div className="sst-accent-bg py-3 px-4 mb-4" style={{ backgroundColor: hexToRgba(accentColor, 0.2) }}>
              <h2 className="sst-accent-text text-lg font-bold tracking-widest uppercase" style={{ color: accentColor }}>LANGUAGES</h2>
            </div>
            {/* ✅ CHANGED: renderBrList for languages */}
            <div className="px-4">
              {renderBrList(data.additional_info.languages, "inherit")}
            </div>
          </section>
        )}

        {/* Interests */}
        {data.additional_info?.interests && (
          <section className="mb-8">
            <div className="sst-accent-bg py-3 px-4 mb-4" style={{ backgroundColor: hexToRgba(accentColor, 0.2) }}>
              <h2 className="sst-accent-text text-lg font-bold tracking-widest uppercase" style={{ color: accentColor }}>INTERESTS</h2>
            </div>
            {/* ✅ CHANGED: renderBrList for interests */}
            <div className="px-4">
              {renderBrList(data.additional_info.interests, "inherit")}
            </div>
          </section>
        )}

        {/* Awards & Achievements */}
        {data.additional_info?.awards && (
          <section className="mb-8">
            <div className="sst-accent-bg py-3 px-4 mb-4" style={{ backgroundColor: hexToRgba(accentColor, 0.2) }}>
              <h2 className="sst-accent-text text-lg font-bold tracking-widest uppercase" style={{ color: accentColor }}>AWARDS & ACHIEVEMENTS</h2>
            </div>
            {/* ✅ CHANGED: renderBrList for awards */}
            <div className="px-4">
              {renderBrList(data.additional_info.awards, "inherit")}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default SoftStylishTemplate;