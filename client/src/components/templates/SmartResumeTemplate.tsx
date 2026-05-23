import React from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface SmartResumeTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const SmartResumeTemplate: React.FC<SmartResumeTemplateProps> = ({ data, accentColor }) => {
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";

    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    const month = parts[1] ? parseInt(parts[1]) - 1 : 0;

    const date = new Date(year, month);
    if (isNaN(date.getTime())) return "";

    return year.toString();
  };

  const isCurrentlyWorking = (exp: Experience): boolean => {
    return exp.is_current || !exp.end_date;
  };

  const isCurrentlyStudying = (edu: Education): boolean => {
    return edu.is_current || !edu.end_date;
  };

  return (
    <div className="max-w-5xl mx-auto bg-white text-gray-800 relative">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Decorative Corner Elements */}
      <div 
        className="absolute top-0 left-0 w-40 h-40 border-l-4 border-t-4" 
        style={{ borderColor: accentColor }}
      ></div>
      <div 
        className="absolute bottom-0 right-0 w-64 h-1" 
        style={{ backgroundColor: accentColor }}
      ></div>

      <div className="px-16 py-12 relative z-10">
        {/* Header */}
        <header className="text-center mb-8 relative">
          <h1 className="text-5xl font-bold text-gray-700 tracking-widest mb-3">
            {data.personal_info?.full_name?.split(' ').map((word: string) => word.toUpperCase()).join(' ') || "YOUR NAME"}
          </h1>
          <div 
            className="w-48 h-1 ml-auto mb-4" 
            style={{ backgroundColor: accentColor }}
          ></div>
          <h2 className="text-xl text-gray-600 mb-8 font-light">
            {data.personal_info?.title || "Designation"}
          </h2>

          {/* Contact Bar */}
          <div 
            className="flex justify-center items-center gap-12 py-4 px-8 text-white text-sm font-light"
            style={{ backgroundColor: accentColor }}
          >
            {data.personal_info?.location && (
              <div className="flex items-center gap-2">
                <i className="fas fa-map-marker-alt"></i>
                <span>{data.personal_info.location}</span>
              </div>
            )}
            {data.personal_info?.website && (
              <div className="flex items-center gap-2">
                <i className="fas fa-globe"></i>
                <span>{data.personal_info.website}</span>
              </div>
            )}
            {data.personal_info?.email && (
              <div className="flex items-center gap-2">
                <i className="fas fa-envelope"></i>
                <span>{data.personal_info.email}</span>
              </div>
            )}
          </div>
        </header>

        {/* Profile Info / Summary */}
        {data.professional_summary && (
          <section className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-base font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                Profile Info
              </h2>
              <div className="flex-1 h-px" style={{ backgroundColor: accentColor }}></div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {data.professional_summary}
            </p>
          </section>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-12">
          {/* Left Column - 2/3 width */}
          <div className="col-span-2 space-y-10 bg-white">
            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-base font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Experience
                  </h2>
                  <div className="flex-1 h-px" style={{ backgroundColor: accentColor }}></div>
                </div>

                <div className="space-y-6">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l-2" style={{ borderColor: accentColor }}>
                      <div 
                        className="absolute -left-2 top-0 w-3 h-3 rounded-full" 
                        style={{ backgroundColor: accentColor }}
                      ></div>
                      
                      <div className="mb-2">
                        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-1">
                          {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "PRESENT" : formatDate(exp.end_date)}
                        </h3>
                        <p className="text-gray-600 text-xs mb-2">
                          {exp.company} | 123 Anywhere St., Any City
                        </p>
                        <h4 className="font-bold text-gray-800 text-base mb-2">
                          {exp.position}
                        </h4>
                      </div>

                      {/* ✅ renderBullets for experience */}
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
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-base font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Projects
                  </h2>
                  <div className="flex-1 h-px" style={{ backgroundColor: accentColor }}></div>
                </div>

                <div className="space-y-6">
                  {data.projects.map((proj, index) => (
                    <div key={index} className="relative pl-6 border-l-2" style={{ borderColor: accentColor }}>
                      <div
                        className="absolute -left-2 top-0 w-3 h-3 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      ></div>
                      <h4 className="font-bold text-gray-800 text-base mb-2">
                        {proj.name}
                      </h4>
                      {/* ✅ renderBullets for projects */}
                      <div className="ml-2">
                        {renderBullets(proj.description, "inherit")}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-10 py-8 px-6 -mr-16 relative border-l-2" style={{ backgroundColor: `${accentColor}15`, borderColor: accentColor }}>

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-base font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Education
                  </h2>
                  <div className="flex-1 h-px" style={{ backgroundColor: accentColor }}></div>
                </div>

                <div className="space-y-5">
                  {data.education.map((edu, index) => (
                    <div key={index}>
                      <p className="text-xs text-gray-600 mb-1">
                        {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "present" : formatDate(edu.end_date)} | {edu.institution}
                      </p>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {edu.degree}{edu.field && ` of ${edu.field}`}
                      </h3>
                      {edu.additional_info && (
                        <p className="text-xs text-gray-700 mt-1">{edu.additional_info}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-base font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Skills
                  </h2>
                  <div className="flex-1 h-px" style={{ backgroundColor: accentColor }}></div>
                </div>

                <ul className="space-y-2 text-sm text-gray-700">
                  {data.skills.map((skill, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-xs mt-1">•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Languages */}
            {data.additional_info?.languages && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-base font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Languages
                  </h2>
                  <div className="flex-1 h-px" style={{ backgroundColor: accentColor }}></div>
                </div>
                {/* ✅ renderBrList for languages */}
                <div className="ml-2">
                  {renderBrList(data.additional_info.languages, "inherit")}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.additional_info?.certifications && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-base font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Certifications
                  </h2>
                  <div className="flex-1 h-px" style={{ backgroundColor: accentColor }}></div>
                </div>
                {/* ✅ renderBrList for certifications */}
                <div className="ml-2">
                  {renderBrList(data.additional_info.certifications, "inherit")}
                </div>
              </section>
            )}

            {/* Interests */}
            {data.additional_info?.interests && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-base font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Interests
                  </h2>
                  <div className="flex-1 h-px" style={{ backgroundColor: accentColor }}></div>
                </div>
                {/* ✅ renderBrList for interests */}
                <div className="ml-2">
                  {renderBrList(data.additional_info.interests, "inherit")}
                </div>
              </section>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartResumeTemplate;