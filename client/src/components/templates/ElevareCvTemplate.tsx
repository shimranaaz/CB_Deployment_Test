import React from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface ElevareCvTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const ElevareCvTemplate: React.FC<ElevareCvTemplateProps> = ({ data, accentColor }) => {
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    return year.toString();
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
        }
      `}</style>

      <div className="max-w-4xl mx-auto p-12 bg-white text-gray-700">
        {/* Header */}
        <header className="text-center mb-8">
          <h1
            className="text-5xl font-bold tracking-widest mb-3"
            style={{ color: accentColor }}
          >
            {data.personal_info?.full_name?.toUpperCase() || "YOUR NAME"}
          </h1>
          <h2 className="text-xl tracking-widest mb-6" style={{ color: '#6b7280' }}>
            {data.personal_info?.title?.toUpperCase() || "YOUR TITLE"}
          </h2>

          {/* Contact Info Bar */}
          <div
            className="flex justify-center items-center gap-3 py-2 px-4 border-2 text-sm"
            style={{ borderColor: accentColor }}
          >
            {data.personal_info?.phone && (
              <div className="flex items-center gap-1">
                <i className="fas fa-phone"></i>
                <span>{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.phone && data.personal_info?.website && <span>|</span>}
            {data.personal_info?.website && (
              <div className="flex items-center gap-1">
                <i className="fas fa-globe"></i>
                <span>{data.personal_info.website}</span>
              </div>
            )}
            {data.personal_info?.website && data.personal_info?.email && <span>|</span>}
            {data.personal_info?.email && (
              <div className="flex items-center gap-1">
                <i className="fas fa-envelope"></i>
                <span>{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info?.email && data.personal_info?.location && <span>|</span>}
            {data.personal_info?.location && (
              <div className="flex items-center gap-1">
                <i className="fas fa-map-marker-alt"></i>
                <span>{data.personal_info.location}</span>
              </div>
            )}
          </div>
        </header>

        {/* Summary */}
        {data.professional_summary && (
          <section className="mb-8">
            <h3
              className="text-xl font-bold tracking-wider mb-3"
              style={{ color: accentColor }}
            >
              SUMMARY
            </h3>
            <div className="border-t-2 mb-4" style={{ borderColor: '#d1d5db' }}></div>
            <p className="text-sm leading-relaxed text-justify">
              {data.professional_summary}
            </p>
          </section>
        )}

        {/* Professional Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-8">
            <h3
              className="text-xl font-bold tracking-wider mb-3"
              style={{ color: accentColor }}
            >
              PROFESSIONAL SKILLS
            </h3>
            <div className="border-t-2 mb-4" style={{ borderColor: '#d1d5db' }}></div>

            <div className="grid grid-cols-2 gap-3">
              {data.skills.map((skill, index) => (
                <div
                  key={index}
                  className="py-2 px-4 text-center text-sm font-medium text-white italic"
                  style={{
                    backgroundColor: accentColor,
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact'
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h3
              className="text-xl font-bold tracking-wider mb-3"
              style={{ color: accentColor }}
            >
              WORK EXPERIENCE
            </h3>
            <div className="border-t-2 mb-4" style={{ borderColor: '#d1d5db' }}></div>

            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4
                        className="text-base font-bold mb-1"
                        style={{ color: accentColor }}
                      >
                        {exp.position?.toUpperCase() || "POSITION"}
                      </h4>
                      <p className="text-sm" style={{ color: '#6b7280' }}>
                        {exp.company || "Company Name"}
                      </p>
                    </div>
                    <span className="text-sm whitespace-nowrap ml-4" style={{ color: '#6b7280' }}>
                      ( {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)} )
                    </span>
                  </div>
                  <div className="ml-5 mt-2">
                    {renderBullets(exp.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-8">
            <h3
              className="text-xl font-bold tracking-wider mb-3"
              style={{ color: accentColor }}
            >
              PROJECTS
            </h3>
            <div className="border-t-2 mb-4" style={{ borderColor: '#d1d5db' }}></div>

            <div className="space-y-4">
              {data.projects.map((proj, index) => (
                <div key={index}>
                  <h4 className="text-base font-bold mb-1" style={{ color: accentColor }}>
                    {proj.name}
                  </h4>
                  <div className="ml-5 mt-2">
                    {renderBullets(proj.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education and Certification */}
        {data.education && data.education.length > 0 && (
          <section className="mb-8">
            <h3
              className="text-xl font-bold tracking-wider mb-3"
              style={{ color: accentColor }}
            >
              EDUCATION AND CERTIFICATION
            </h3>
            <div className="border-t-2 mb-4" style={{ borderColor: '#d1d5db' }}></div>

            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4
                        className="text-base font-bold mb-1"
                        style={{ color: accentColor }}
                      >
                        {edu.degree?.toUpperCase()} {edu.field && `IN ${edu.field.toUpperCase()}`}
                      </h4>
                      <p className="text-sm" style={{ color: '#6b7280' }}>
                        {edu.institution}
                      </p>
                    </div>
                    <span className="text-sm whitespace-nowrap ml-4" style={{ color: '#6b7280' }}>
                      ( {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "Present" : formatDate(edu.end_date)} )
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Additional Certifications */}
        {data.additional_info?.certifications && (
          <section className="mb-8">
            <h3
              className="text-xl font-bold tracking-wider mb-3"
              style={{ color: accentColor }}
            >
              CERTIFICATIONS
            </h3>
            <div className="border-t-2 mb-4" style={{ borderColor: '#d1d5db' }}></div>
            <div className="text-sm">
              {renderBrList(data.additional_info.certifications, "inherit")}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.additional_info?.languages && (
          <section className="mb-8">
            <h3
              className="text-xl font-bold tracking-wider mb-3"
              style={{ color: accentColor }}
            >
              LANGUAGES
            </h3>
            <div className="border-t-2 mb-4" style={{ borderColor: '#d1d5db' }}></div>
            <div className="text-sm">
              {renderBrList(data.additional_info.languages, "inherit")}
            </div>
          </section>
        )}

        {/* Interests */}
        {data.additional_info?.interests && (
          <section className="mb-8">
            <h3
              className="text-xl font-bold tracking-wider mb-3"
              style={{ color: accentColor }}
            >
              INTERESTS
            </h3>
            <div className="border-t-2 mb-4" style={{ borderColor: '#d1d5db' }}></div>
            <div className="text-sm">
              {renderBrList(data.additional_info.interests, "inherit")}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default ElevareCvTemplate;