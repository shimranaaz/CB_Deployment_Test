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
    image?: string | File;
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

interface SoftMinimalTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const SoftMinimalTemplate: React.FC<SoftMinimalTemplateProps> = ({ data, accentColor }) => {
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

  return (
    <>
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .soft-minimal-accent-text {
            color: ${accentColor} !important;
          }
          .soft-minimal-accent-bg {
            background-color: ${accentColor} !important;
          }
          .soft-minimal-accent-border {
            border-color: ${accentColor} !important;
          }
          .soft-minimal-icon {
            color: ${accentColor} !important;
          }
          .soft-minimal-dot {
            background-color: ${accentColor} !important;
          }
        }
      `}</style>
      <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800">
        {/* Header with Profile Image */}
        <header className="mb-8 relative">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="soft-minimal-accent-text text-5xl font-bold mb-2" style={{ color: accentColor }}>
                {data.personal_info?.full_name || "Your Name"}
              </h1>
              <h2 className="text-xl text-gray-600 mb-4">
                {data.personal_info?.title || "Your Title"}
              </h2>
              
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                {data.personal_info?.phone && (
                  <div className="flex items-center gap-2">
                    <svg className="soft-minimal-icon w-4 h-4" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>{data.personal_info.phone}</span>
                  </div>
                )}
                {data.personal_info?.location && (
                  <div className="flex items-center gap-2">
                    <svg className="soft-minimal-icon w-4 h-4" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{data.personal_info.location}</span>
                  </div>
                )}
                {data.personal_info?.email && (
                  <div className="flex items-center gap-2">
                    <svg className="soft-minimal-icon w-4 h-4" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>{data.personal_info.email}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile image */}
            <div className="ml-8">
              {data.personal_info?.image ? (
                <img 
                  src={typeof data.personal_info.image === 'string' ? data.personal_info.image : URL.createObjectURL(data.personal_info.image)}
                  alt="Profile"
                  className="soft-minimal-accent-border w-32 h-32 rounded-full object-cover border-4"
                  style={{ borderColor: accentColor }}
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="soft-minimal-accent-bg mt-6 h-1" style={{ backgroundColor: accentColor }}></div>
        </header>

        {/* About Me / Summary */}
        {data.professional_summary && (
          <section className="mb-8">
            <h2 className="soft-minimal-accent-text text-xl font-bold mb-3" style={{ color: accentColor }}>ABOUT ME</h2>
            <p className="text-sm text-gray-700 leading-relaxed text-justify">
              {data.professional_summary}
            </p>
            <div className="soft-minimal-accent-bg mt-4 h-1" style={{ backgroundColor: accentColor }}></div>
          </section>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-1 space-y-8">
            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section>
                <h2 className="soft-minimal-accent-text text-xl font-bold mb-4" style={{ color: accentColor }}>EDUCATION</h2>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index} className="relative pl-4 border-l-2 border-gray-400">
                      <div className="soft-minimal-dot absolute -left-[5px] top-0 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                      <h3 className="font-bold text-sm text-gray-900">
                        {edu.institution || "University Name"}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "Present" : formatDate(edu.end_date)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section>
                <div className="soft-minimal-accent-bg h-1 mb-4" style={{ backgroundColor: accentColor }}></div>
                <h2 className="soft-minimal-accent-text text-xl font-bold mb-4" style={{ color: accentColor }}>SKILL</h2>
                <ul className="space-y-2">
                  {data.skills.map((skill, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Additional Info */}
            {data.additional_info && (
              <section>
                <div className="soft-minimal-accent-bg h-1 mb-4" style={{ backgroundColor: accentColor }}></div>
                <h2 className="soft-minimal-accent-text text-xl font-bold mb-4" style={{ color: accentColor }}>ADDITIONAL INFO</h2>
                <div className="space-y-3 text-sm text-gray-700">
                  {/* ✅ CHANGED: renderBrList for certifications */}
                  {data.additional_info.certifications && (
                    <div>
                      <span className="font-bold">Certifications:</span>
                      <div className="ml-1 mt-1">
                        {renderBrList(data.additional_info.certifications, "inherit")}
                      </div>
                    </div>
                  )}
                  {/* ✅ CHANGED: renderBrList for languages */}
                  {data.additional_info.languages && (
                    <div>
                      <span className="font-bold">Languages:</span>
                      <div className="ml-1 mt-1">
                        {renderBrList(data.additional_info.languages, "inherit")}
                      </div>
                    </div>
                  )}
                  {/* ✅ CHANGED: renderBrList for interests */}
                  {data.additional_info.interests && (
                    <div>
                      <span className="font-bold">Interests:</span>
                      <div className="ml-1 mt-1">
                        {renderBrList(data.additional_info.interests, "inherit")}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-2 space-y-8">
            {/* Work Experience */}
            {data.experience && data.experience.length > 0 && (
              <section>
                <h2 className="soft-minimal-accent-text text-xl font-bold mb-4" style={{ color: accentColor }}>WORK EXPERIENCE</h2>
                <div className="space-y-6">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="relative pl-4 border-l-2 border-gray-400">
                      <div className="soft-minimal-dot absolute -left-[5px] top-0 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-sm text-gray-900">
                          {exp.company} - {exp.position}
                        </h3>
                        <span className="text-sm font-bold text-gray-900 whitespace-nowrap ml-4">
                          {formatDate(exp.start_date)}-{isCurrentlyWorking(exp) ? "NOW" : formatDate(exp.end_date).split(' ')[1]}
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

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
              <section>
                <div className="soft-minimal-accent-bg h-1 mb-4" style={{ backgroundColor: accentColor }}></div>
                <h2 className="soft-minimal-accent-text text-xl font-bold mb-4" style={{ color: accentColor }}>PROJECTS</h2>
                <div className="grid grid-cols-2 gap-6">
                  {data.projects.map((project, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-sm text-gray-900 mb-1">
                        {project.name || "Project Name"}
                      </h3>
                      {/* ✅ CHANGED: renderBullets for projects */}
                      <div className="ml-2">
                        {renderBullets(project.description, "inherit")}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SoftMinimalTemplate;