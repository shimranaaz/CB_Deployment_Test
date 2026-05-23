import React from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { Phone, Mail, Home } from "lucide-react";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface ProfessionalTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({ data, accentColor }) => {
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
          .print-bg-accent {
            background-color: ${accentColor} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-color-accent {
            color: ${accentColor} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-border-accent {
            border-color: ${accentColor} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        .print-bg-accent {
          background-color: ${accentColor};
        }
        .print-color-accent {
          color: ${accentColor};
        }
        .print-border-accent {
          border-color: ${accentColor};
        }
      `}</style>
      <div className="max-w-4xl mx-auto bg-white text-gray-800">
        {/* Header */}
        <header className="mb-8 pb-6 px-8 pt-8 border-b-[20px] print-border-accent" style={{ borderBottomColor: accentColor }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2 print-color-accent" style={{ color: accentColor }}>
                {data.personal_info?.full_name || "YOUR NAME"}
              </h1>
              <h2 className="text-xl text-gray-600">
                {data.personal_info?.title || "Your Title"}
              </h2>
            </div>
            <div className="text-right text-sm text-gray-700 space-y-2">
              {data.personal_info?.phone && (
                <div className="flex items-center justify-end gap-2">
                  <span>{data.personal_info.phone}</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center print-bg-accent"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-center justify-end gap-2">
                  <span>{data.personal_info.email}</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center print-bg-accent"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-center justify-end gap-2">
                  <span>{data.personal_info.location}</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center print-bg-accent"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Home className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Summary */}
        {data.professional_summary && (
          <section className="mb-8 text-center">
            <div className="w-full mb-6 h-[3px] print-bg-accent" style={{ backgroundColor: accentColor }}></div>
            <div className="px-8">
              <h2 className="text-xl font-bold mb-4 tracking-wider text-gray-700 uppercase">
                Summary
              </h2>
              <div className="w-2/3 mx-auto mb-4 h-[3px] print-bg-accent" style={{ backgroundColor: accentColor }}></div>
              <p className="text-gray-700 text-sm leading-relaxed max-w-3xl mx-auto">
                {data.professional_summary}
              </p>
            </div>
          </section>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-8 relative px-8">
          {/* Center Vertical Line */}
          <div
            className="absolute left-1/3 top-0 bottom-0 w-[3px] print-bg-accent"
            style={{ backgroundColor: accentColor }}
          ></div>

          {/* Left Column */}
          <div className="col-span-1 space-y-6 pr-4">
            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-3 text-gray-700 uppercase">
                  Education
                </h2>
                <div className="w-full mb-4 h-[3px] print-bg-accent" style={{ backgroundColor: accentColor }}></div>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-sm text-gray-900">
                        {edu.institution}
                      </h3>
                      <p className="text-xs text-gray-700 mt-1">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {edu.start_date && formatDate(edu.start_date)}
                        {edu.start_date && " - "}
                        {isCurrentlyStudying(edu) ? "Present" : edu.end_date ? formatDate(edu.end_date) : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-3 text-gray-700 uppercase">
                  Skills
                </h2>
                <div className="w-full mb-4 h-[3px] print-bg-accent" style={{ backgroundColor: accentColor }}></div>
                <ul className="space-y-2 text-xs text-gray-700">
                  {data.skills.map((skill, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Certifications */}
            {data.additional_info?.certifications && (
              <section>
                <h2 className="text-lg font-bold mb-3 text-gray-700 uppercase">
                  Certifications
                </h2>
                <div className="w-full mb-4 h-[3px] print-bg-accent" style={{ backgroundColor: accentColor }}></div>
                {renderBrList(data.additional_info.certifications, '#374151')}
              </section>
            )}

            {/* Languages */}
            {data.additional_info?.languages && (
              <section>
                <h2 className="text-lg font-bold mb-3 text-gray-700 uppercase">
                  Languages
                </h2>
                <div className="w-full mb-4 h-[3px] print-bg-accent" style={{ backgroundColor: accentColor }}></div>
                {renderBrList(data.additional_info.languages, '#374151')}
              </section>
            )}

            {/* Interests */}
            {data.additional_info?.interests && (
              <section>
                <h2 className="text-lg font-bold mb-3 text-gray-700 uppercase">
                  Interests
                </h2>
                <div className="w-full mb-4 h-[3px] print-bg-accent" style={{ backgroundColor: accentColor }}></div>
                {renderBrList(data.additional_info.interests, '#374151')}
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-2 space-y-6 pl-4">
            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-3 text-gray-700 uppercase">
                  Professional Experience
                </h2>
                <div className="w-full mb-4 h-[3px] print-bg-accent" style={{ backgroundColor: accentColor }}></div>
                <div className="space-y-5">
                  {data.experience.map((exp, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-sm text-gray-900">
                        {exp.position}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {exp.company} | {formatDate(exp.start_date)} -{" "}
                        {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                      </p>
                      {renderBullets(exp.description, '#374151')}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-3 text-gray-700 uppercase">
                  Projects
                </h2>
                <div className="w-full mb-4 h-[3px] print-bg-accent" style={{ backgroundColor: accentColor }}></div>
                <div className="space-y-3">
                  {data.projects.map((proj, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-sm text-gray-900">{proj.name}</h3>
                      {renderBullets(proj.description, '#374151')}
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

export default ProfessionalTemplate;