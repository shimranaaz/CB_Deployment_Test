import React from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface CreativeTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ data, accentColor }) => {
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

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <>
      <style>{`
        @media print {
          .print-bg-accent {
            background-color: ${accentColor} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-bg-accent-light {
            background-color: ${hexToRgba(accentColor, 0.15)} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-color-accent {
            color: ${accentColor} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        .print-bg-accent {
          background-color: ${accentColor};
        }
        .print-bg-accent-light {
          background-color: ${hexToRgba(accentColor, 0.15)};
        }
        .print-color-accent {
          color: ${accentColor};
        }
      `}</style>
      <div className="max-w-4xl mx-auto bg-white text-gray-700">
        {/* Header */}
        <header className="py-12 text-center print-bg-accent" style={{ backgroundColor: accentColor }}>
          <h1 className="text-4xl font-bold text-white tracking-widest mb-2">
            {data.personal_info?.full_name?.toUpperCase() || "YOUR NAME"}
          </h1>
          <p className="text-lg italic text-white">
            {data.personal_info?.title || "Designation"}
          </p>
        </header>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-3 gap-0">
          {/* Left Column - Sidebar */}
          <div className="col-span-1 px-8 py-10 space-y-8 print-bg-accent-light" style={{ backgroundColor: hexToRgba(accentColor, 0.15) }}>
            {/* Profile/Summary */}
            {data.professional_summary && (
              <section>
                <h2 className="text-xl font-bold text-gray-700 mb-4 uppercase">Profile</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {data.professional_summary}
                </p>
              </section>
            )}

            {/* Decorative Dots */}
            <div className="flex justify-center space-x-1 py-4">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full print-bg-accent" style={{ backgroundColor: accentColor }}></div>
              ))}
            </div>

            {/* Contact Info */}
            <section>
              <h2 className="text-xl font-bold text-gray-700 mb-4 uppercase">Contact Me</h2>
              <div className="space-y-3">
                {data.personal_info?.phone && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 print-color-accent" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                    <span className="text-sm">{data.personal_info.phone}</span>
                  </div>
                )}
                {data.personal_info?.email && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 print-color-accent" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <span className="text-sm break-all">{data.personal_info.email}</span>
                  </div>
                )}
                {data.personal_info?.location && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 print-color-accent" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm">{data.personal_info.location}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Languages */}
            {data.additional_info?.languages && (
              <section>
                <h2 className="text-xl font-bold text-gray-700 mb-4 uppercase flex items-center gap-2">
                  <span className="text-2xl print-color-accent" style={{ color: accentColor }}>▶</span> Language
                </h2>
                <div className="text-sm">
                  {renderBrList(data.additional_info.languages, "inherit")}
                </div>
              </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-700 mb-4 uppercase flex items-center gap-2">
                  <span className="text-2xl print-color-accent" style={{ color: accentColor }}>▶</span> Computer Skills
                </h2>
                <div className="space-y-2 text-sm">
                  {data.skills.map((skill, index) => (
                    <p key={index}>{skill}</p>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Main Content */}
          <div className="col-span-2 px-10 py-10 space-y-8">
            {/* Work Experience */}
            {data.experience && data.experience.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-700 mb-4 uppercase flex items-center gap-2">
                  <span className="text-2xl print-color-accent" style={{ color: accentColor }}>▶</span> Work Experience
                </h2>
                <div className="space-y-5">
                  {data.experience.map((exp, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-gray-800 uppercase text-sm mb-1">
                        {exp.company || exp.position}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "present" : formatDate(exp.end_date)}
                      </p>
                      <p className="text-sm text-gray-700">{exp.position}</p>
                      <div className="ml-5 mt-2">
                        {renderBullets(exp.description, "inherit")}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-700 mb-4 uppercase flex items-center gap-2">
                  <span className="text-2xl print-color-accent" style={{ color: accentColor }}>▶</span> Education
                </h2>
                <div className="space-y-5">
                  {data.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-gray-800 uppercase text-sm mb-1">
                        {edu.institution}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "present" : formatDate(edu.end_date)}
                      </p>
                      <p className="text-sm italic text-gray-700">
                        {edu.degree} {edu.field && `${edu.field}, in progress`}
                      </p>
                      {edu.additional_info && (
                        <div className="mt-2 text-sm text-gray-700">
                          {edu.additional_info.split("\n").filter(line => line.trim()).map((line, i) => (
                            <p key={i} className="mb-1">{line.trim().replace(/^[•\-]\s*/, "")}</p>
                          ))}
                        </div>
                      )}
                      {edu.gpa && <p className="text-sm text-gray-700 mt-1">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-700 mb-4 uppercase flex items-center gap-2">
                  <span className="text-2xl print-color-accent" style={{ color: accentColor }}>▶</span> Volunteer Experience
                </h2>
                <div className="space-y-5">
                  {data.projects.map((proj, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-gray-800 uppercase text-sm mb-1">
                        {proj.name}
                      </h3>
                      {proj.date && <p className="text-sm text-gray-600 mb-1">{proj.date}</p>}
                      {proj.description && (
                        <p className="text-sm text-gray-700">{proj.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.additional_info?.certifications && (
              <section>
                <h2 className="text-xl font-bold text-gray-700 mb-4 uppercase flex items-center gap-2">
                  <span className="text-2xl print-color-accent" style={{ color: accentColor }}>▶</span> Certifications
                </h2>
                <div className="text-sm">
                  {renderBrList(data.additional_info.certifications, "inherit")}
                </div>
              </section>
            )}

            {/* Interests */}
            {data.additional_info?.interests && (
              <section>
                <h2 className="text-xl font-bold text-gray-700 mb-4 uppercase flex items-center gap-2">
                  <span className="text-2xl print-color-accent" style={{ color: accentColor }}>▶</span> Interests
                </h2>
                <div className="text-sm">
                  {renderBrList(data.additional_info.interests, "inherit")}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreativeTemplate;