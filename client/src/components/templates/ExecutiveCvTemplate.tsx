import React, { useState } from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface ExecutiveCvTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const ExecutiveCvTemplate: React.FC<ExecutiveCvTemplateProps> = ({ data, accentColor }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>
      <div className="max-w-5xl mx-auto bg-white text-gray-800" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div className="px-10 py-8 relative">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-lg tracking-widest mb-2 font-bold" style={{ color: '#6b7280', fontWeight: 'bold' }}>
                {data.personal_info?.full_name?.split(' ')[0]?.toUpperCase() || 'FIRST'}
              </h2>
              <h1 className="text-5xl font-bold mb-4" style={{ color: '#1f2937', fontWeight: 'bold' }}>
                {data.personal_info?.full_name?.split(' ').slice(1).join(' ')?.toUpperCase() || 'LAST'}
              </h1>
              <h2 className="text-lg tracking-widest font-bold" style={{ color: '#6b7280' }}>
                {data.personal_info?.title?.toUpperCase() || 'YOUR TITLE'}
              </h2>
            </div>

            {/* Profile Image */}
            <div className="ml-8">
              <label htmlFor="profile-image-upload" className="cursor-pointer block">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-2"
                    style={{ borderColor: '#d1d5db' }}
                  />
                ) : (
                  <div
                    className="w-32 h-32 rounded-full border-2 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors"
                    style={{ borderColor: '#d1d5db', backgroundColor: '#f9fafb' }}
                  >
                    <i className="fas fa-camera text-2xl mb-1" style={{ color: '#9ca3af' }}></i>
                    <span className="text-xs text-center px-2" style={{ color: '#6b7280' }}>
                      Upload Image
                    </span>
                  </div>
                )}
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Divider Line */}
          <div className="mt-6 border-t" style={{ borderColor: '#d1d5db' }}></div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-10 gap-8 px-10 pb-10">
          {/* Left Column - 4/10 width */}
          <div className="col-span-4">
            {/* Contact */}
            <section className="mb-8">
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1f2937' }}>
                CONTACT
              </h3>
              <div className="space-y-3">
                {data.personal_info?.phone && (
                  <div className="flex items-center gap-3 text-sm" style={{ color: '#4b5563' }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                    >
                      <i className="fas fa-phone text-white text-xs"></i>
                    </div>
                    <span>{data.personal_info.phone}</span>
                  </div>
                )}
                {data.personal_info?.email && (
                  <div className="flex items-center gap-3 text-sm" style={{ color: '#4b5563' }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                    >
                      <i className="fas fa-envelope text-white text-xs"></i>
                    </div>
                    <span className="break-all">{data.personal_info.email}</span>
                  </div>
                )}
                {data.personal_info?.location && (
                  <div className="flex items-center gap-3 text-sm" style={{ color: '#4b5563' }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                    >
                      <i className="fas fa-map-marker-alt text-white text-xs"></i>
                    </div>
                    <span>{data.personal_info.location}</span>
                  </div>
                )}
                {data.personal_info?.website && (
                  <div className="flex items-center gap-3 text-sm" style={{ color: '#4b5563' }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                    >
                      <i className="fas fa-globe text-white text-xs"></i>
                    </div>
                    <span className="break-all">{data.personal_info.website}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section className="mb-8">
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1f2937' }}>
                  SKILLS
                </h3>
                <div className="w-16 h-0.5 mb-4" style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}></div>
                <div className="mb-4">
                  <h4 className="text-sm font-bold mb-3" style={{ color: '#4b5563' }}>
                    PROFESSIONAL
                  </h4>
                  <ul className="space-y-2">
                    {data.skills.map((skill, index) => (
                      <li key={index} className="text-sm flex items-start gap-2" style={{ color: '#6b7280' }}>
                        <span>•</span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section className="mb-8">
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1f2937' }}>
                  EDUCATION
                </h3>
                <div className="w-16 h-0.5 mb-4" style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}></div>

                <div className="relative">
                  <div
                    className="absolute left-1 top-2 w-0.5"
                    style={{
                      backgroundColor: '#d1d5db',
                      height: 'calc(100% - 1rem)',
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact'
                    }}
                  ></div>

                  <div className="space-y-6">
                    {data.education.map((edu, index) => (
                      <div key={index} className="relative pl-6">
                        <div
                          className="absolute w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: accentColor,
                            left: '1px',
                            top: '4px',
                            WebkitPrintColorAdjust: 'exact',
                            printColorAdjust: 'exact'
                          }}
                        ></div>
                        <h4 className="text-sm font-bold mb-1" style={{ color: '#1f2937' }}>
                          {edu.degree}
                        </h4>
                        <p className="text-xs mb-1" style={{ color: '#6b7280' }}>
                          {edu.institution}
                        </p>
                        <p className="text-xs" style={{ color: '#9ca3af' }}>
                          {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "Present" : formatDate(edu.end_date)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Languages */}
            {data.additional_info?.languages && (
              <section className="mb-8">
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1f2937' }}>
                  LANGUAGES
                </h3>
                <div className="w-16 h-0.5 mb-4" style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}></div>
                <div className="ml-1">
                  {renderBrList(data.additional_info.languages, "inherit")}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.additional_info?.certifications && (
              <section className="mb-8">
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1f2937' }}>
                  CERTIFICATIONS
                </h3>
                <div className="w-16 h-0.5 mb-4" style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}></div>
                <div className="ml-1">
                  {renderBrList(data.additional_info.certifications, "inherit")}
                </div>
              </section>
            )}

            {/* Interests */}
            {data.additional_info?.interests && (
              <section className="mb-8">
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1f2937' }}>
                  INTERESTS
                </h3>
                <div className="w-16 h-0.5 mb-4" style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}></div>
                <div className="ml-1">
                  {renderBrList(data.additional_info.interests, "inherit")}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - 6/10 width */}
          <div className="col-span-6">
            {/* Summary */}
            {data.professional_summary && (
              <section className="mb-8">
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1f2937' }}>
                  SUMMARY
                </h3>
                <div className="w-16 h-0.5 mb-4" style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}></div>
                <p className="text-sm leading-relaxed" style={{ color: '#4b5563', textAlign: 'justify' }}>
                  {data.professional_summary}
                </p>
              </section>
            )}

            {/* Work Experience */}
            {data.experience && data.experience.length > 0 && (
              <section className="mb-8">
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1f2937' }}>
                  WORKING EXPERIENCE
                </h3>
                <div className="w-16 h-0.5 mb-4" style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}></div>

                <div className="relative">
                  <div
                    className="absolute left-1 top-2 w-0.5"
                    style={{
                      backgroundColor: '#d1d5db',
                      height: 'calc(100% - 1rem)',
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact'
                    }}
                  ></div>

                  <div className="space-y-8">
                    {data.experience.map((exp, index) => (
                      <div key={index} className="relative pl-6">
                        <div
                          className="absolute w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: accentColor,
                            left: '1px',
                            top: '4px',
                            WebkitPrintColorAdjust: 'exact',
                            printColorAdjust: 'exact'
                          }}
                        ></div>

                        <div className="mb-3">
                          <h4 className="text-base font-bold mb-1" style={{ color: '#1f2937' }}>
                            {exp.position?.toUpperCase() || 'POSITION'}
                          </h4>
                          <div className="flex items-center gap-2 text-xs mb-2" style={{ color: '#6b7280' }}>
                            <span className="font-semibold">{exp.company || 'Company Name'}</span>
                            <span>|</span>
                            <span>
                              {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                            </span>
                          </div>
                        </div>

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
              <section>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1f2937' }}>
                  PROJECTS
                </h3>
                <div className="w-16 h-0.5 mb-4" style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}></div>
                <div className="space-y-4">
                  {data.projects.map((proj, index) => (
                    <div key={index}>
                      <h4 className="text-sm font-bold mb-1" style={{ color: '#1f2937' }}>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ExecutiveCvTemplate;