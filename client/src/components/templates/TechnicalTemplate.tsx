import React from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface TechnicalTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const TechnicalTemplate: React.FC<TechnicalTemplateProps> = ({ data, accentColor }) => {
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
          .print-bg-accent-medium {
            background-color: ${hexToRgba(accentColor, 0.3)} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-border-accent {
            border-color: ${accentColor} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-border-bottom-accent {
            border-bottom-color: ${accentColor} !important;
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
        .print-bg-accent-medium {
          background-color: ${hexToRgba(accentColor, 0.3)};
        }
        .print-border-accent {
          border-color: ${accentColor};
        }
        .print-border-bottom-accent {
          border-bottom-color: ${accentColor};
        }
      `}</style>
      <div className="max-w-4xl mx-auto bg-white text-gray-700">
        {/* Header with Photo */}
        <header className="grid grid-cols-2 gap-0 mb-8">
          {/* Left side - Name and Title */}
          <div className="py-12 px-8 print-bg-accent-light" style={{ backgroundColor: hexToRgba(accentColor, 0.15) }}>
            <h1 className="text-5xl font-bold text-gray-700 tracking-wide mb-2">
              {data.personal_info?.full_name?.toUpperCase().split(' ')[0] || "FIRST"}
            </h1>
            <h1 className="text-5xl font-bold text-gray-700 tracking-wide mb-6">
              {data.personal_info?.full_name?.toUpperCase().split(' ').slice(1).join(' ') || "LAST"}
            </h1>
            <div className="w-24 h-0.5 bg-gray-700 mb-4"></div>
            <h2 className="text-lg font-light tracking-widest text-gray-600 uppercase">
              {data.personal_info?.title || "Your Title"}
            </h2>
          </div>

          {/* Right side - Photo Circle */}
          <div className="relative flex items-center justify-center py-12 print-bg-accent" style={{ backgroundColor: accentColor }}>
            <div
              className="w-48 h-48 rounded-full bg-gray-200 border-2 border-gray-300 flex flex-col items-center justify-center overflow-hidden relative cursor-pointer"
              onClick={() => document.getElementById('photo-upload')?.click()}
            >
              {data.personal_info?.image ? (
                <img
                  src={
                    typeof data.personal_info.image === "string"
                      ? data.personal_info.image
                      : URL.createObjectURL(data.personal_info.image)
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm">Upload Photo</span>
                </div>
              )}
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && data.personal_info) {
                    console.log("Photo selected:", file);
                  }
                }}
              />
            </div>
          </div>
        </header>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-3 gap-0">
          {/* Left Column - Sidebar */}
          <div className="col-span-1 px-8 py-8 space-y-8 border-4 print-border-accent" style={{ borderColor: accentColor }}>
            {/* About Me */}
            {data.professional_summary && (
              <section>
                <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase">About Me</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {data.professional_summary}
                </p>
              </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase">Skill</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {data.skills.map((skill, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ✅ CHANGED: Languages — renderBrList replacing inline split/map */}
            {data.additional_info?.languages && (
              <section>
                <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase">Language</h3>
                <div className="ml-1">
                  {renderBrList(data.additional_info.languages, "inherit")}
                </div>
              </section>
            )}

            {/* Contact */}
            <section>
              <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase">Contact</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {data.personal_info?.phone && (
                  <p className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{data.personal_info.phone}</span>
                  </p>
                )}
                {data.personal_info?.email && (
                  <p className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="break-all">{data.personal_info.email}</span>
                  </p>
                )}
                {data.personal_info?.website && (
                  <p className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="break-all">{data.personal_info.website}</span>
                  </p>
                )}
                {data.personal_info?.location && (
                  <p className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{data.personal_info.location}</span>
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Main Content */}
          <div className="col-span-2 px-8 py-8 space-y-8">
            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase pb-2 border-b-2 print-border-bottom-accent" style={{ borderBottomColor: accentColor }}>
                  Education
                </h3>
                <div className="space-y-5">
                  {data.education.map((edu, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">
                        {edu.degree} {edu.field && `(${edu.field}), Major in ${edu.field}`}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">{edu.institution}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Graduated: {edu.end_date && !isCurrentlyStudying(edu) ? formatDate(edu.end_date) : "Present"}
                      </p>
                      {edu.additional_info && (
                        <div className="text-sm text-gray-600">
                          {edu.additional_info.split("\n").filter(line => line.trim()).map((line, i) => (
                            <p key={i} className="mb-1">{line.trim()}</p>
                          ))}
                        </div>
                      )}
                      {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase pb-2 border-b-2 print-border-bottom-accent" style={{ borderBottomColor: accentColor }}>
                  Experience
                </h3>
                <div className="space-y-5">
                  {data.experience.map((exp, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">{exp.position}</h4>
                      <p className="text-sm text-gray-600 mb-1">{exp.company}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                      </p>
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
                <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase pb-2 border-b-2 print-border-bottom-accent" style={{ borderBottomColor: accentColor }}>
                  Projects
                </h3>
                <div className="space-y-4">
                  {data.projects.map((proj, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">{proj.name}</h4>
                      {proj.date && <p className="text-sm text-gray-600 mb-1">{proj.date}</p>}
                      {/* ✅ CHANGED: renderBullets for projects */}
                      <div className="ml-2 mt-1">
                        {renderBullets(proj.description, "inherit")}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ✅ CHANGED: Certifications — renderBrList replacing inline split/map */}
            {data.additional_info?.certifications && (
              <section>
                <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase pb-2 border-b-2 print-border-bottom-accent" style={{ borderBottomColor: accentColor }}>
                  Certifications
                </h3>
                <div className="ml-1">
                  {renderBrList(data.additional_info.certifications, "inherit")}
                </div>
              </section>
            )}

            {/* ✅ ADDED: Interests */}
            {data.additional_info?.interests && (
              <section>
                <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase pb-2 border-b-2 print-border-bottom-accent" style={{ borderBottomColor: accentColor }}>
                  Interests
                </h3>
                <div className="ml-1">
                  {renderBrList(data.additional_info.interests, "inherit")}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Footer Strip - Two Colors */}
        <div className="grid grid-cols-3 gap-0">
          <div className="col-span-1 h-8 print-bg-accent" style={{ backgroundColor: accentColor }}></div>
          <div className="col-span-2 h-8 print-bg-accent-medium" style={{ backgroundColor: hexToRgba(accentColor, 0.3) }}></div>
        </div>
      </div>
    </>
  );
};

export default TechnicalTemplate;