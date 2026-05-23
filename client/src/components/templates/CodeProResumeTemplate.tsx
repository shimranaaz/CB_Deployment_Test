import React from "react";
import { Phone, Mail, Globe } from "lucide-react";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface PersonalInfo {
  full_name?: string;
  title?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
}

interface Experience {
  position: string;
  company?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
}

interface Education {
  degree: string;
  field?: string;
  institution: string;
  position?: string;
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
  certifications?: string;
  languages?: string;
  interests?: string;
  achievements?: string;
}

interface ResumeData {
  personal_info?: PersonalInfo;
  professional_summary?: string;
  skills?: string[];
  experience?: Experience[];
  projects?: Project[];
  education?: Education[];
  additional_info?: AdditionalInfo;
}

interface CodeProResumeTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const CodeProResumeTemplate: React.FC<CodeProResumeTemplateProps> = ({ data, accentColor }) => {
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

  const isCurrentlyStudying = (edu: Education): boolean => {
    return edu.is_current || !edu.end_date;
  };

  const isCurrentlyWorking = (exp: Experience): boolean => {
    return exp.is_current || !exp.end_date;
  };

  return (
    <div
      className="max-w-4xl mx-auto bg-white text-gray-900 p-10 relative"
      style={{
        colorAdjust: 'exact',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact'
      }}
    >
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          @page {
            margin: 0.5in;
            size: letter;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Center vertical line */}
      <div
        className="absolute"
        style={{
          backgroundColor: accentColor,
          width: '2px',
          left: '50%',
          transform: 'translateX(-50%)',
          top: '503px',
          bottom: 0,
          colorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}
      />

      {/* Header */}
      <header
        className="text-center mb-6 pb-6 relative"
        style={{
          borderBottom: `2px solid ${accentColor}`,
          colorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}
      >
        <div
          className="absolute"
          style={{
            backgroundColor: accentColor,
            width: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '-40px',
            height: '40px',
            colorAdjust: 'exact',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact'
          }}
        />
        <h1 className="text-5xl font-bold mb-2 tracking-wide text-gray-900">
          {data.personal_info?.full_name?.toUpperCase() || "YOUR NAME"}
        </h1>
        <h2 className="text-base tracking-wider text-gray-700">
          {data.personal_info?.title || "Designation"}
        </h2>
      </header>

      {/* About Me and Contact Row */}
      <div
        className="mb-6 pb-6 relative"
        style={{
          borderBottom: `2px solid ${accentColor}`,
          colorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}
      >
        <div className="flex">
          <div className="w-1/2 pr-12">
            <h3 className="text-base font-bold mb-3 uppercase tracking-wide text-gray-900">
              ABOUT ME
            </h3>
            {data.professional_summary && (
              <p className="text-sm leading-relaxed text-gray-800">
                {data.professional_summary}
              </p>
            )}
          </div>
          <div className="w-1/2 pl-12">
            <div className="space-y-2">
              {data.personal_info?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={18} style={{ color: accentColor }} />
                  <span className="text-sm text-gray-800">{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-center gap-2">
                  <Mail size={18} style={{ color: accentColor }} />
                  <span className="text-sm text-gray-800">{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.website && (
                <div className="flex items-center gap-2">
                  <Globe size={18} style={{ color: accentColor }} />
                  <span className="text-sm text-gray-800">{data.personal_info.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section Headers */}
      <div
        className="flex mb-6 pb-4"
        style={{
          borderBottom: `2px solid ${accentColor}`,
          colorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}
      >
        <div className="w-1/2 pr-12">
          <h3 className="text-base font-bold uppercase tracking-wide text-gray-900">
            EDUCATION
          </h3>
        </div>
        <div className="w-1/2 pl-12">
          <h3 className="text-base font-bold uppercase tracking-wide text-gray-900">
            WORK EXPERIENCE
          </h3>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="flex">
        {/* Left Column - Education + Skills */}
        <div className="w-1/2 pr-12 space-y-8">
          {data.education && data.education.length > 0 && (
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h4 className="text-sm font-bold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h4>
                  <p className="text-xs text-gray-700 mb-2">
                    {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "Present" : formatDate(edu.end_date)}
                  </p>
                  {edu.institution && (
                    <ul className="space-y-1">
                      <li className="flex items-start text-xs text-gray-800">
                        <span className="mr-2">•</span>
                        <span>{edu.institution}</span>
                      </li>
                    </ul>
                  )}
                  {edu.additional_info && (
                    <ul className="mt-1 space-y-1">
                      {edu.additional_info
                        .split("\n")
                        .filter((line) => line.trim())
                        .map((line, i) => (
                          <li key={i} className="flex items-start text-xs text-gray-800">
                            <span className="mr-2">•</span>
                            <span>{line.trim().replace(/^[•\-]\s*/, "")}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {data.skills && data.skills.length > 0 && (
            <section>
              <h3 className="text-base font-bold mb-3 uppercase tracking-wide text-gray-900">
                SKILLS
              </h3>
              <ul className="space-y-1">
                {data.skills.map((skill, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-800">
                    <span className="mr-2">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ADDITIONAL INFORMATION */}
          {data.additional_info &&
            (data.additional_info.languages ||
              data.additional_info.certifications ||
              data.additional_info.interests) && (
              <section>
                <h3 className="text-base font-bold mb-3 uppercase tracking-wide text-gray-900">
                  ADDITIONAL INFORMATION
                </h3>
                <div className="space-y-3 text-sm text-gray-800">
                  {data.additional_info.certifications && (
                    <div>
                      <span className="font-semibold">Certifications: </span>
                      {renderBrList(data.additional_info.certifications, "inherit")}
                    </div>
                  )}
                  {data.additional_info.languages && (
                    <div>
                      <span className="font-semibold">Languages: </span>
                      {renderBrList(data.additional_info.languages, "inherit")}
                    </div>
                  )}
                  {data.additional_info.interests && (
                    <div>
                      <span className="font-semibold">Interests: </span>
                      {renderBrList(data.additional_info.interests, "inherit")}
                    </div>
                  )}
                </div>
              </section>
            )}
        </div>

        {/* Right Column - Experience + Projects */}
        <div className="w-1/2 pl-12 space-y-6">
          {data.experience && data.experience.length > 0 && (
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-gray-900">{exp.company}</h4>
                    <span className="text-xs text-gray-700 whitespace-nowrap ml-2">
                      {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-sm italic text-gray-700 mb-2">{exp.position}</p>
                  <div className="ml-5 mt-2">
                    {renderBullets(exp.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <h3 className="text-base font-bold mb-3 uppercase tracking-wide text-gray-900">
                PROJECTS
              </h3>
              <div className="space-y-4">
                {data.projects.map((proj: Project, index: number) => (
                  <div key={index}>
                    <p className="text-sm font-bold text-gray-900 mb-1">{proj.name}</p>
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
    </div>
  );
};

export default CodeProResumeTemplate;