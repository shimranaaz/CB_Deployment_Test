import React from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface PrimeEdgeTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const PrimeEdgeTemplate: React.FC<PrimeEdgeTemplateProps> = ({ data, accentColor }) => {
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

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const transparentAccent = hexToRgba(accentColor, 0.1);

  return (
    <>
      <style>
        {`
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          }
        `}
      </style>
      <div className="max-w-5xl mx-auto bg-white text-gray-800" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div className="px-10 py-8 border-b-4" style={{ borderColor: accentColor }}>
          <h1 className="text-5xl font-bold mb-2" style={{ color: '#374151' }}>
            {data.personal_info?.full_name?.toUpperCase() || 'YOUR NAME'}
          </h1>
          <h2 className="text-xl font-normal" style={{ color: '#6b7280' }}>
            {data.personal_info?.title?.toUpperCase() || 'YOUR TITLE'}
          </h2>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-10 gap-0">
          {/* Left Sidebar - 3/10 width */}
          <div className="col-span-3 px-6 py-8" style={{ backgroundColor: transparentAccent, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
            {/* Contact */}
            <section className="mb-8">
              <h3 className="text-base font-bold mb-4 pb-2 border-b-2" style={{ color: '#374151', borderColor: accentColor }}>
                CONTACT
              </h3>
              <div className="space-y-3">
                {data.personal_info?.phone && (
                  <div className="flex items-start gap-3 text-xs" style={{ color: '#4b5563' }}>
                    <i className="fas fa-phone mt-0.5"></i>
                    <span>{data.personal_info.phone}</span>
                  </div>
                )}
                {data.personal_info?.email && (
                  <div className="flex items-start gap-3 text-xs" style={{ color: '#4b5563' }}>
                    <i className="fas fa-envelope mt-0.5"></i>
                    <span className="break-all">{data.personal_info.email}</span>
                  </div>
                )}
                {data.personal_info?.location && (
                  <div className="flex items-start gap-3 text-xs" style={{ color: '#4b5563' }}>
                    <i className="fas fa-map-marker-alt mt-0.5"></i>
                    <span>{data.personal_info.location}</span>
                  </div>
                )}
                {data.personal_info?.website && (
                  <div className="flex items-start gap-3 text-xs" style={{ color: '#4b5563' }}>
                    <i className="fas fa-globe mt-0.5"></i>
                    <span className="break-all">{data.personal_info.website}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section className="mb-8">
                <h3 className="text-base font-bold mb-4 pb-2 border-b-2" style={{ color: '#374151', borderColor: accentColor }}>
                  SKILLS
                </h3>
                <ul className="space-y-2">
                  {data.skills.map((skill, index) => (
                    <li key={index} className="text-xs flex items-start gap-2" style={{ color: '#4b5563' }}>
                      <span>•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Languages */}
            {data.additional_info?.languages && (
              <section className="mb-8">
                <h3 className="text-base font-bold mb-4 pb-2 border-b-2" style={{ color: '#374151', borderColor: accentColor }}>
                  LANGUAGES
                </h3>
                {renderBrList(data.additional_info.languages, '#4b5563')}
              </section>
            )}

            {/* Certifications */}
            {data.additional_info?.certifications && (
              <section className="mb-8">
                <h3 className="text-base font-bold mb-4 pb-2 border-b-2" style={{ color: '#374151', borderColor: accentColor }}>
                  CERTIFICATIONS
                </h3>
                {renderBrList(data.additional_info.certifications, '#4b5563')}
              </section>
            )}

            {/* Interests */}
            {data.additional_info?.interests && (
              <section className="mb-8">
                <h3 className="text-base font-bold mb-4 pb-2 border-b-2" style={{ color: '#374151', borderColor: accentColor }}>
                  INTERESTS
                </h3>
                {renderBrList(data.additional_info.interests, '#4b5563')}
              </section>
            )}
          </div>

          {/* Right Column - 7/10 width */}
          <div className="col-span-7 px-8 py-8">
            <div className="relative">
              {/* Vertical Timeline */}
              <div
                className="absolute left-5 top-0 bottom-0 w-0.5"
                style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
              ></div>

              {/* Profile Section */}
              {data.professional_summary && (
                <section className="mb-10 relative pl-16">
                  <div
                    className="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                  >
                    <i className="fas fa-user text-sm"></i>
                  </div>
                  <div
                    className="absolute left-5 top-10 w-0.5 h-6"
                    style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                  ></div>

                  <h3 className="text-lg font-bold mb-3 pb-2 border-b" style={{ color: '#374151', borderColor: '#e5e7eb' }}>
                    PROFILE
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#4b5563', textAlign: 'justify' }}>
                    {data.professional_summary}
                  </p>
                </section>
              )}

              {/* Work Experience Section */}
              {data.experience && data.experience.length > 0 && (
                <section className="mb-10 relative pl-16">
                  <div
                    className="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                  >
                    <i className="fas fa-briefcase text-sm"></i>
                  </div>
                  <div
                    className="absolute left-5 top-10 w-0.5"
                    style={{
                      backgroundColor: accentColor,
                      height: 'calc(100% - 2.5rem)',
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact'
                    }}
                  ></div>

                  <h3 className="text-lg font-bold mb-6 pb-2 border-b" style={{ color: '#374151', borderColor: '#e5e7eb' }}>
                    WORK EXPERIENCE
                  </h3>

                  <div className="space-y-6 relative">
                    {data.experience.map((exp, index) => (
                      <div key={index} className="relative">
                        <div
                          className="absolute w-3 h-3 rounded-full border-2 border-white"
                          style={{
                            backgroundColor: accentColor,
                            left: '-49px',
                            top: '2px',
                            WebkitPrintColorAdjust: 'exact',
                            printColorAdjust: 'exact'
                          }}
                        ></div>

                        <div className="mb-2">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-bold" style={{ color: '#1f2937' }}>
                              {exp.company || 'Company Name'}
                            </h4>
                            <span className="text-xs whitespace-nowrap ml-4" style={{ color: '#6b7280' }}>
                              {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "PRESENT" : formatDate(exp.end_date)}
                            </span>
                          </div>
                          <p className="text-xs mb-3" style={{ color: '#6b7280' }}>
                            {exp.position}
                          </p>
                        </div>

                        {renderBullets(exp.description, '#4b5563')}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education Section */}
              {data.education && data.education.length > 0 && (
                <section className="mb-10 relative pl-16">
                  <div
                    className="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                  >
                    <i className="fas fa-graduation-cap text-sm"></i>
                  </div>
                  <div
                    className="absolute left-5 top-10 w-0.5"
                    style={{
                      backgroundColor: accentColor,
                      height: 'calc(100% - 2.5rem)',
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact'
                    }}
                  ></div>

                  <h3 className="text-lg font-bold mb-6 pb-2 border-b" style={{ color: '#374151', borderColor: '#e5e7eb' }}>
                    EDUCATION
                  </h3>

                  <div className="space-y-5 relative">
                    {data.education.map((edu, index) => (
                      <div key={index} className="relative">
                        <div
                          className="absolute w-3 h-3 rounded-full border-2 border-white"
                          style={{
                            backgroundColor: accentColor,
                            left: '-49px',
                            top: '2px',
                            WebkitPrintColorAdjust: 'exact',
                            printColorAdjust: 'exact'
                          }}
                        ></div>

                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-bold" style={{ color: '#1f2937' }}>
                            {edu.degree} {edu.field && `of ${edu.field}`}
                          </h4>
                          <span className="text-xs whitespace-nowrap ml-4" style={{ color: '#6b7280' }}>
                            {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "Present" : formatDate(edu.end_date)}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: '#6b7280' }}>
                          {edu.institution}
                        </p>
                        {edu.gpa && (
                          <p className="text-xs mt-1" style={{ color: '#4b5563' }}>
                            GPA: {edu.gpa}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects Section */}
              {data.projects && data.projects.length > 0 && (
                <section className="mb-10 relative pl-16">
                  <div
                    className="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                  >
                    <i className="fas fa-folder-open text-sm"></i>
                  </div>
                  <div
                    className="absolute left-5 top-10 w-0.5"
                    style={{
                      backgroundColor: accentColor,
                      height: 'calc(100% - 2.5rem)',
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact'
                    }}
                  ></div>

                  <h3 className="text-lg font-bold mb-6 pb-2 border-b" style={{ color: '#374151', borderColor: '#e5e7eb' }}>
                    PROJECTS
                  </h3>

                  <div className="space-y-5 relative">
                    {data.projects.map((proj, index) => (
                      <div key={index} className="relative">
                        <div
                          className="absolute w-3 h-3 rounded-full border-2 border-white"
                          style={{
                            backgroundColor: accentColor,
                            left: '-49px',
                            top: '2px',
                            WebkitPrintColorAdjust: 'exact',
                            printColorAdjust: 'exact'
                          }}
                        ></div>
                        <h4 className="text-sm font-bold mb-1" style={{ color: '#1f2937' }}>
                          {proj.name}
                        </h4>
                        {renderBullets(proj.description, '#4b5563')}
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrimeEdgeTemplate;