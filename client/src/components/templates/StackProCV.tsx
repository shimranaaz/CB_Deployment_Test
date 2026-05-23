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

interface StackProCVProps {
  data: ResumeData;
  accentColor: string;
}

const StackProCV: React.FC<StackProCVProps> = ({ data, accentColor = '#8B7355' }) => {
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    return year.toString();
  };

  const isCurrentlyWorking = (exp: Experience): boolean => {
    return exp.is_current || !exp.end_date;
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white px-12 py-10" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-5xl font-bold mb-2" style={{ color: accentColor }}>
          {data.personal_info?.full_name || 'Your Name'}
        </h1>
        <p className="text-2xl italic text-gray-700 mb-6">
          {data.personal_info?.title || 'Designation'}
        </p>

        {/* Contact Info Bar */}
        <div className="border-2 border-gray-800 px-6 py-4 flex flex-wrap gap-8">
          {data.personal_info?.email && (
            <div className="flex items-center gap-2 text-sm">
              <i className="fas fa-envelope" style={{ color: accentColor }}></i>
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-2 text-sm">
              <i className="fas fa-phone" style={{ color: accentColor }}></i>
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-2 text-sm">
              <i className="fas fa-globe" style={{ color: accentColor }}></i>
              <span>{data.personal_info.website}</span>
            </div>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {data.professional_summary && (
        <section className="mb-8">
          <p className="text-sm leading-relaxed text-gray-700">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold mr-4" style={{ color: accentColor }}>
              Experience
            </h2>
            <div className="flex-grow border-t-2" style={{ borderColor: accentColor }}></div>
          </div>

          <div className="relative pl-8">
            <div className="absolute left-0 top-2 bottom-2 w-0.5" style={{ backgroundColor: accentColor }}></div>

            <div className="space-y-8">
              {data.experience.map((exp: Experience, index: number) => (
                <div key={index} className="relative">
                  <div
                    className="absolute -left-[37px] top-1 w-3 h-3 rounded-full border-2 border-white"
                    style={{ backgroundColor: accentColor }}
                  ></div>

                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-base font-bold" style={{ color: accentColor }}>
                      {exp.position}
                    </h3>
                    <span className="text-sm italic text-gray-600 whitespace-nowrap ml-4">
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
          </div>
        </section>
      )}

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold mr-4" style={{ color: accentColor }}>
              Education
            </h2>
            <div className="flex-grow border-t-2" style={{ borderColor: accentColor }}></div>
          </div>

          <div className="relative pl-8">
            <div className="absolute left-0 top-2 bottom-2 w-0.5" style={{ backgroundColor: accentColor }}></div>

            <div className="space-y-6">
              {data.education.map((edu: Education, index: number) => (
                <div key={index} className="relative">
                  <div
                    className="absolute -left-[37px] top-1 w-3 h-3 rounded-full border-2 border-white"
                    style={{ backgroundColor: accentColor }}
                  ></div>

                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-base font-bold" style={{ color: accentColor }}>
                      {edu.institution}
                    </h3>
                    <span className="text-sm italic text-gray-600 whitespace-nowrap ml-4">
                      {formatDate(edu.start_date)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700">
                    {edu.degree}{edu.field && `, ${edu.field}`}
                  </p>
                  {edu.gpa && (
                    <p className="text-sm text-gray-700">GPA: {edu.gpa}</p>
                  )}
                  {edu.additional_info && (
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                      {edu.additional_info
                        .split("\n")
                        .filter((line) => line.trim())
                        .map((line, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{line.trim().replace(/^[•\-]\s*/, "")}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold mr-4" style={{ color: accentColor }}>
              Projects
            </h2>
            <div className="flex-grow border-t-2" style={{ borderColor: accentColor }}></div>
          </div>

          <div className="relative pl-8">
            <div className="absolute left-0 top-2 bottom-2 w-0.5" style={{ backgroundColor: accentColor }}></div>

            <div className="space-y-6">
              {data.projects.map((proj: Project, index: number) => (
                <div key={index} className="relative">
                  <div
                    className="absolute -left-[37px] top-1 w-3 h-3 rounded-full border-2 border-white"
                    style={{ backgroundColor: accentColor }}
                  ></div>

                  <h3 className="text-base font-bold mb-1" style={{ color: accentColor }}>
                    {proj.name}
                  </h3>

                  {/* ✅ CHANGED: renderBullets for projects */}
                  <div className="ml-2">
                    {renderBullets(proj.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold mr-4" style={{ color: accentColor }}>
              Skills
            </h2>
            <div className="flex-grow border-t-2" style={{ borderColor: accentColor }}></div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-2">
            {data.skills.map((skill: string, index: number) => (
              <div key={index} className="flex items-start text-sm text-gray-700">
                <span className="mr-2">•</span>
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ✅ ADDED: Languages */}
      {data.additional_info?.languages && (
        <section className="mb-8">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold mr-4" style={{ color: accentColor }}>
              Languages
            </h2>
            <div className="flex-grow border-t-2" style={{ borderColor: accentColor }}></div>
          </div>
          <div className="ml-2">
            {renderBrList(data.additional_info.languages, "inherit")}
          </div>
        </section>
      )}

      {/* ✅ ADDED: Certifications */}
      {data.additional_info?.certifications && (
        <section className="mb-8">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold mr-4" style={{ color: accentColor }}>
              Certifications
            </h2>
            <div className="flex-grow border-t-2" style={{ borderColor: accentColor }}></div>
          </div>
          <div className="ml-2">
            {renderBrList(data.additional_info.certifications, "inherit")}
          </div>
        </section>
      )}

      {/* ✅ ADDED: Interests */}
      {data.additional_info?.interests && (
        <section className="mb-8">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold mr-4" style={{ color: accentColor }}>
              Interests
            </h2>
            <div className="flex-grow border-t-2" style={{ borderColor: accentColor }}></div>
          </div>
          <div className="ml-2">
            {renderBrList(data.additional_info.interests, "inherit")}
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

export default StackProCV;