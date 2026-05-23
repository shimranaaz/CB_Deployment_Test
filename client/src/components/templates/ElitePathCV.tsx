import React, { useState } from 'react';
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface PersonalInfo {
  full_name?: string;
  title?: string;
  phone?: string;
  email?: string;
  location?: string;
  website?: string;
  facebook?: string;
  photo?: string;
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

interface Reference {
  name?: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
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
  references?: Reference[];
  additional_info?: AdditionalInfo;
}

interface ElitePathCVProps {
  data: ResumeData;
  accentColor: string;
}

const ElitePathCV: React.FC<ElitePathCVProps> = ({ data, accentColor = '#5B6FA8' }) => {
  const [profileImage, setProfileImage] = useState<string | null>(
    data.personal_info?.photo || null
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

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

  const getTransparentColor = (): string => {
    return `${accentColor}15`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="relative" style={{ background: `linear-gradient(to bottom, ${getTransparentColor()} 0%, ${getTransparentColor()} 100%)` }}>
        <div className="flex items-start justify-between px-12 pt-10 pb-6">
          <div className="flex-1">
            <h1 className="text-5xl font-bold tracking-wide mb-3" style={{ color: accentColor }}>
              {data.personal_info?.full_name?.toUpperCase() || 'YOUR NAME'}
            </h1>
            <div className="w-48 h-1 mb-4" style={{ backgroundColor: accentColor }}></div>
            <p className="text-xl" style={{ color: '#7B8DB8' }}>
              {data.personal_info?.title || 'Designation'}
            </p>
          </div>

          {/* Profile Photo */}
          <div className="relative flex-shrink-0 -mb-16" style={{ width: '192px', height: '192px' }}>
            <div className="absolute inset-0 rounded-full bg-white shadow-2xl" style={{ padding: '8px' }}>
              <div className="relative w-full h-full rounded-full overflow-hidden group">
                {profileImage ? (
                  <>
                    <img src={profileImage} alt={data.personal_info?.full_name || "Profile"} className="w-full h-full object-cover" />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Remove photo"
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors rounded-full">
                    <i className="fas fa-user text-4xl mb-2"></i>
                    <span className="text-xs font-medium">Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* White space for overlap */}
      <div className="h-16 bg-white"></div>

      {/* Two column layout */}
      <div className="flex px-12 py-8 gap-12">
        {/* Left Column */}
        <div className="w-1/2 space-y-8">
          {/* Core Competencies */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 uppercase" style={{ color: accentColor }}>
                CORE COMPETENCIES
              </h2>
              <ul className="space-y-2 text-sm" style={{ color: '#7B8DB8' }}>
                {data.skills.map((skill, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">-</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Work Experience */}
          <section>
            <h2 className="text-xl font-bold mb-4 uppercase" style={{ color: accentColor }}>
              WORK EXPERIENCE
            </h2>
            <div className="space-y-6">
              {data.experience && data.experience.length > 0 && data.experience.map((exp, index) => (
                <div key={index}>
                  <h3 className="text-base font-bold mb-1" style={{ color: accentColor }}>
                    {exp.position}
                  </h3>
                  <p className="text-sm font-bold mb-2 uppercase" style={{ color: accentColor }}>
                    {exp.company} | {formatDate(exp.start_date).toUpperCase()} TO {isCurrentlyWorking(exp) ? "PRESENT" : formatDate(exp.end_date).toUpperCase()}
                  </p>
                  <div className="ml-5 mt-2">
                    {renderBullets(exp.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 uppercase" style={{ color: accentColor }}>
                PROJECTS
              </h2>
              <div className="space-y-6">
                {data.projects.map((proj: Project, index: number) => (
                  <div key={index}>
                    <h3 className="text-base font-bold mb-1" style={{ color: accentColor }}>
                      {proj.name}
                    </h3>
                    <div className="ml-5 mt-2">
                      {renderBullets(proj.description, "inherit")}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Academic History */}
          <section>
            <h2 className="text-xl font-bold mb-4 uppercase" style={{ color: accentColor }}>
              ACADEMIC HISTORY
            </h2>
            <div className="space-y-4">
              {data.education && data.education.length > 0 && data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="text-base font-bold mb-1" style={{ color: accentColor }}>
                    {edu.institution}
                  </h3>
                  <p className="text-sm font-bold mb-2 uppercase" style={{ color: accentColor }}>
                    {edu.degree}{edu.field && `, ${edu.field}`}, CLASS OF {formatDate(edu.end_date).split(' ')[1] || ''}
                  </p>
                  {edu.additional_info && (
                    <ul className="space-y-1.5 text-sm" style={{ color: '#7B8DB8' }}>
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
                  {edu.gpa && <p className="text-sm" style={{ color: '#7B8DB8' }}>GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="w-1/2 space-y-8">
          {/* Career Overview */}
          {data.professional_summary && (
            <section className="p-6 rounded-lg" style={{ backgroundColor: getTransparentColor() }}>
              <h2 className="text-xl font-bold mb-4 uppercase text-center" style={{ color: accentColor }}>
                CAREER OVERVIEW
              </h2>
              <p className="text-sm text-center italic leading-relaxed" style={{ color: '#7B8DB8' }}>
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* Contact Info */}
          <section className="p-6 rounded-lg" style={{ backgroundColor: getTransparentColor() }}>
            <h2 className="text-xl font-bold mb-4 uppercase text-center" style={{ color: accentColor }}>
              CONTACT INFO
            </h2>
            <div className="space-y-3 text-sm" style={{ color: '#7B8DB8' }}>
              {data.personal_info?.phone && (
                <p><span className="font-bold">Personal Phone:</span> {data.personal_info.phone}</p>
              )}
              {data.personal_info?.email && (
                <p><span className="font-bold">Email:</span> {data.personal_info.email}</p>
              )}
              {data.personal_info?.location && (
                <p><span className="font-bold">Address:</span> {data.personal_info.location}</p>
              )}
              {data.personal_info?.facebook && (
                <p><span className="font-bold">Facebook:</span> {data.personal_info.facebook}</p>
              )}
            </div>
          </section>

          {/* Additional Information */}
          {data.additional_info && (data.additional_info.certifications || data.additional_info.languages || data.additional_info.interests) && (
            <section className="p-6 rounded-lg" style={{ backgroundColor: getTransparentColor() }}>
              <h2 className="text-xl font-bold mb-4 uppercase text-center" style={{ color: accentColor }}>
                ADDITIONAL INFORMATION
              </h2>
              <div className="space-y-3 text-sm" style={{ color: '#7B8DB8' }}>
                {data.additional_info.certifications && (
                  <div>
                    <p className="font-bold mb-1" style={{ color: accentColor }}>Certifications:</p>
                    {renderBrList(data.additional_info.certifications, "inherit")}
                  </div>
                )}
                {data.additional_info.languages && (
                  <div>
                    <p className="font-bold mb-1" style={{ color: accentColor }}>Languages:</p>
                    {renderBrList(data.additional_info.languages, "inherit")}
                  </div>
                )}
                {data.additional_info.interests && (
                  <div>
                    <p className="font-bold mb-1" style={{ color: accentColor }}>Interests:</p>
                    {renderBrList(data.additional_info.interests, "inherit")}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

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

export default ElitePathCV;