import React from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface EliteTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const EliteTemplate: React.FC<EliteTemplateProps> = ({ data, accentColor }) => {
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";

    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    const month = parts[1] ? parseInt(parts[1]) - 1 : 0;

    const date = new Date(year, month);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
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

  const renderSectionHeader = (title: string) => (
    <div className="relative mb-4" style={{ marginLeft: '-32px', marginRight: '-32px' }}>
      <h3 className="text-xl font-bold text-white relative print-bg-accent" style={{ backgroundColor: accentColor, padding: '12px 16px' }}>
        <span className="ml-8">{title}</span>
      </h3>
      <div
        className="absolute right-0 top-0 bottom-0 w-0 h-0"
        style={{
          borderTop: '24px solid transparent',
          borderBottom: '29px solid transparent',
          borderLeft: `16px solid ${accentColor}`,
          transform: 'translateX(100%)'
        }}
      ></div>
    </div>
  );

  return (
    <>
      <style>{`
        @media print {
          .print-bg-accent {
            background-color: ${accentColor} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-bg-accent-ultralight {
            background-color: ${hexToRgba(accentColor, 0.08)} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-bg-accent-light {
            background-color: ${hexToRgba(accentColor, 0.15)} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-border-accent-light {
            border-color: ${hexToRgba(accentColor, 0.3)} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-color-accent {
            color: ${accentColor} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-arrow-accent::after {
            border-left-color: ${accentColor} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        .print-bg-accent {
          background-color: ${accentColor};
        }
        .print-bg-accent-ultralight {
          background-color: ${hexToRgba(accentColor, 0.08)};
        }
        .print-bg-accent-light {
          background-color: ${hexToRgba(accentColor, 0.15)};
        }
        .print-border-accent-light {
          border-color: ${hexToRgba(accentColor, 0.3)};
        }
        .print-color-accent {
          color: ${accentColor};
        }
      `}</style>
      <div className="max-w-4xl mx-auto bg-white text-gray-800 grid grid-cols-3">
        {/* Left Sidebar */}
        <div className="col-span-1 p-8 space-y-8 print-bg-accent-ultralight" style={{ backgroundColor: hexToRgba(accentColor, 0.08) }}>
          {/* Photo Circle */}
          <div className="flex justify-center mb-6">
            <div className="w-40 h-40 rounded-full flex items-center justify-center overflow-hidden relative border-4 print-border-accent-light" style={{ borderColor: hexToRgba(accentColor, 0.3) }}>
              {data.personal_info?.image && typeof data.personal_info.image === 'string' ? (
                <img src={data.personal_info.image} alt="Profile" className="w-full h-full object-cover" />
              ) : data.personal_info?.image && typeof data.personal_info.image === 'object' ? (
                <img src={URL.createObjectURL(data.personal_info.image)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center print-bg-accent-light" style={{ backgroundColor: hexToRgba(accentColor, 0.15) }}>
                  <svg className="w-12 h-12 mb-2 print-color-accent" style={{ color: accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-xs font-medium print-color-accent" style={{ color: accentColor }}>Upload Photo</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Section */}
          <section className="relative">
            {renderSectionHeader("Contact")}
            <div className="space-y-3 text-sm text-gray-700">
              {data.personal_info?.phone && (
                <div>
                  <p className="font-bold text-gray-800 mb-1">Phone</p>
                  <p>{data.personal_info.phone}</p>
                </div>
              )}
              {data.personal_info?.email && (
                <div>
                  <p className="font-bold text-gray-800 mb-1">Email</p>
                  <p className="break-all">{data.personal_info.email}</p>
                </div>
              )}
              {data.personal_info?.location && (
                <div>
                  <p className="font-bold text-gray-800 mb-1">Address</p>
                  <p>{data.personal_info.location}</p>
                </div>
              )}
            </div>
          </section>

          {/* Education Section */}
          {data.education && data.education.length > 0 && (
            <section className="relative">
              {renderSectionHeader("Education")}
              <div className="space-y-4 text-sm">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-bold text-gray-800">{edu.degree}</p>
                    <p className="text-gray-700">{edu.institution}</p>
                    <p className="text-gray-600 text-xs">
                      {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? formatDate(new Date().toISOString()) : formatDate(edu.end_date)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills Section */}
          {data.skills && data.skills.length > 0 && (
            <section className="relative">
              {renderSectionHeader("Skills")}
              <ul className="space-y-2 text-sm text-gray-700">
                {data.skills.map((skill, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages Section */}
          {data.additional_info?.languages && (
            <section className="relative">
              {renderSectionHeader("Language")}
              <div className="ml-1">
                {renderBrList(data.additional_info.languages, "inherit")}
              </div>
            </section>
          )}

          {/* Certifications Section */}
          {data.additional_info?.certifications && (
            <section className="relative">
              {renderSectionHeader("Certifications")}
              <div className="ml-1">
                {renderBrList(data.additional_info.certifications, "inherit")}
              </div>
            </section>
          )}

          {/* Interests Section */}
          {data.additional_info?.interests && (
            <section className="relative">
              {renderSectionHeader("Interests")}
              <div className="ml-1">
                {renderBrList(data.additional_info.interests, "inherit")}
              </div>
            </section>
          )}
        </div>

        {/* Right Content Area */}
        <div className="col-span-2 p-8 space-y-8">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-2">
              {data.personal_info?.full_name?.toUpperCase() || "YOUR NAME"}
            </h1>
            <h2 className="text-xl text-gray-700 font-medium">
              {data.personal_info?.title || "Your Title"}
            </h2>
          </header>

          {/* Professional Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Professional Experience</h3>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="flex gap-6">
                      {/* Year Column */}
                      <div className="text-center" style={{ minWidth: '80px' }}>
                        <p className="text-lg font-bold text-gray-900">{formatDate(exp.start_date)}</p>
                        <p className="text-gray-600">–</p>
                        <p className="text-lg font-bold text-gray-900">{isCurrentlyWorking(exp) ? formatDate(new Date().toISOString()) : formatDate(exp.end_date)}</p>
                      </div>

                      {/* Vertical Line */}
                      <div className="w-[3px] bg-gray-300"></div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{exp.position}</h4>
                        <p className="text-sm text-gray-700 mb-2">{exp.company}</p>
                        <div className="ml-5 mt-2">
                          {renderBullets(exp.description, "inherit")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Projects</h3>
              <div className="space-y-4">
                {data.projects.map((proj, index) => (
                  <div key={index}>
                    <h4 className="font-bold text-gray-900">{proj.name}</h4>
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
    </>
  );
};

export default EliteTemplate;