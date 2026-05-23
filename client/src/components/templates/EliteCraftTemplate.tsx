import React from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface EliteCraftTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const EliteCraftTemplate: React.FC<EliteCraftTemplateProps> = ({ data, accentColor }) => {
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
        {/* Header Section */}
        <div className="px-12 py-10" style={{ backgroundColor: transparentAccent, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <div className="grid grid-cols-2 gap-8">
            {/* Left: Name and Title */}
            <div>
              <h1 className="text-5xl font-light tracking-widest mb-3 uppercase" style={{ color: '#6b7280' }}>
                {data.personal_info?.full_name?.split(' ')[0] || 'FIRST'}
              </h1>
              <h1 className="text-5xl font-light tracking-widest mb-6 uppercase" style={{ color: '#6b7280' }}>
                {data.personal_info?.full_name?.split(' ').slice(1).join(' ') || 'LAST'}
              </h1>
              <h2 className="text-lg tracking-widest uppercase" style={{ color: '#9ca3af' }}>
                {data.personal_info?.title || 'Your Title'}
              </h2>
            </div>

            {/* Right: Contact Info */}
            <div className="flex flex-col justify-center space-y-3 text-sm" style={{ color: '#6b7280' }}>
              {data.personal_info?.phone && (
                <div className="flex items-center gap-3">
                  <i className="fas fa-phone w-5"></i>
                  <span>{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-center gap-3">
                  <i className="fas fa-envelope w-5"></i>
                  <span>{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-center gap-3">
                  <i className="fas fa-map-marker-alt w-5"></i>
                  <span>{data.personal_info.location}</span>
                </div>
              )}
              {data.personal_info?.website && (
                <div className="flex items-center gap-3">
                  <i className="fas fa-globe w-5"></i>
                  <span>{data.personal_info.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-5 gap-0">
          {/* Left Column - 2/5 width */}
          <div className="col-span-2 bg-gray-50 px-8 py-10" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
            {/* Profile/Summary */}
            {data.professional_summary && (
              <section className="mb-8">
                <h3 className="text-sm font-bold tracking-widest mb-4 uppercase" style={{ color: '#6b7280' }}>
                  PROFILE
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: '#6b7280', textAlign: 'justify' }}>
                  {data.professional_summary}
                </p>
              </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section className="mb-8">
                <h3 className="text-sm font-bold tracking-widest mb-4 uppercase" style={{ color: '#6b7280' }}>
                  EDUCATION
                </h3>
                <div className="space-y-5">
                  {data.education.map((edu, index) => (
                    <div key={index}>
                      <div className="text-xs font-bold mb-1" style={{ color: '#6b7280' }}>
                        {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "Present" : formatDate(edu.end_date)}
                      </div>
                      <div className="text-xs font-bold mb-1 uppercase" style={{ color: '#374151' }}>
                        {edu.institution}
                      </div>
                      <div className="text-xs mb-2" style={{ color: '#6b7280' }}>
                        {edu.degree} {edu.field && `of ${edu.field}`}
                      </div>
                      {edu.gpa && (
                        <div className="text-xs" style={{ color: '#6b7280' }}>
                          • GPA: {edu.gpa}
                        </div>
                      )}
                      {edu.additional_info && (
                        <div className="text-xs space-y-1 mt-1" style={{ color: '#6b7280' }}>
                          {edu.additional_info.split('\n').filter(line => line.trim()).map((line, i) => (
                            <div key={i}>• {line.trim().replace(/^[•\-]\s*/, '')}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section className="mb-8">
                <h3 className="text-sm font-bold tracking-widest mb-4 uppercase" style={{ color: '#6b7280' }}>
                  SKILLS
                </h3>
                <ul className="space-y-2">
                  {data.skills.map((skill, index) => (
                    <li key={index} className="text-xs flex items-start gap-2" style={{ color: '#6b7280' }}>
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
                <h3 className="text-sm font-bold tracking-widest mb-4 uppercase" style={{ color: '#6b7280' }}>
                  LANGUAGES
                </h3>
                <div className="text-xs" style={{ color: '#6b7280' }}>
                  {renderBrList(data.additional_info.languages, "inherit")}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - 3/5 width */}
          <div className="col-span-3 px-8 py-10">
            {/* Work Experience with Timeline */}
            {data.experience && data.experience.length > 0 && (
              <section className="mb-10">
                <h3 className="text-sm font-bold tracking-widest mb-6 uppercase" style={{ color: '#6b7280' }}>
                  WORK EXPERIENCE
                </h3>
                <div className="relative">
                  {/* Timeline line */}
                  <div
                    className="absolute left-0 top-2 bottom-2 w-0.5"
                    style={{ backgroundColor: '#d1d5db', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                  ></div>

                  <div className="space-y-8">
                    {data.experience.map((exp, index) => (
                      <div key={index} className="relative pl-8">
                        {/* Timeline dot */}
                        <div
                          className="absolute top-1 w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: accentColor,
                            left: '-3px'
                          }}
                        ></div>

                        <div className="text-xs font-bold mb-1 uppercase" style={{ color: '#6b7280' }}>
                          {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "PRESENT" : formatDate(exp.end_date).toUpperCase()}
                        </div>
                        {exp.company && (
                          <div className="text-xs mb-1" style={{ color: '#9ca3af' }}>
                            {exp.company}
                          </div>
                        )}
                        <h4 className="text-sm font-bold mb-3" style={{ color: '#374151' }}>
                          {exp.position}
                        </h4>
                        <div className="ml-5 mt-2">
                          {renderBullets(exp.description, "inherit")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
              <section className="mb-10">
                <h3 className="text-sm font-bold tracking-widest mb-6 uppercase" style={{ color: '#6b7280' }}>
                  PROJECTS
                </h3>
                <div className="space-y-5">
                  {data.projects.map((proj, index) => (
                    <div key={index}>
                      <h4 className="text-sm font-bold mb-2" style={{ color: '#374151' }}>
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

            {/* Certifications & Interests */}
            {data.additional_info && (data.additional_info.certifications || data.additional_info.interests) && (
              <section>
                {data.additional_info.certifications && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold tracking-widest mb-4 uppercase" style={{ color: '#6b7280' }}>
                      CERTIFICATIONS
                    </h3>
                    <div className="text-xs" style={{ color: '#6b7280' }}>
                      {renderBrList(data.additional_info.certifications, "inherit")}
                    </div>
                  </div>
                )}
                {data.additional_info.interests && (
                  <div>
                    <h3 className="text-sm font-bold tracking-widest mb-4 uppercase" style={{ color: '#6b7280' }}>
                      INTERESTS
                    </h3>
                    <div className="text-xs" style={{ color: '#6b7280' }}>
                      {renderBrList(data.additional_info.interests, "inherit")}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EliteCraftTemplate;