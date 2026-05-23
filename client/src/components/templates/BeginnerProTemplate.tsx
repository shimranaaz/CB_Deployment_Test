import React, { useState } from "react";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface PersonalInfo {
  full_name?: string;
  title?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
}

interface Experience {
  position: string;
  company?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
}

interface Education {
  degree: string;
  field?: string;
  institution: string;
  position?: string;
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

interface AdditionalInfo {
  certifications?: string;
  languages?: string;
  interests?: string;
}

interface ResumeData {
  personal_info?: PersonalInfo;
  professional_summary?: string;
  skills?: string[] | Array<{ name: string; level?: number }>;
  experience?: Experience[];
  projects?: Project[];
  education?: Education[];
  additional_info?: AdditionalInfo;
}

interface BeginnerProTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const BeginnerProTemplate: React.FC<BeginnerProTemplateProps> = ({ data, accentColor }) => {
  const [skillLevels, setSkillLevels] = useState<{ [key: number]: number }>({});

  const hexToRgba = (hex: string, alpha: number): string => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    return year.toString();
  };

  const isCurrentlyStudying = (edu: Education): boolean => {
    return edu.is_current || !edu.end_date;
  };

  const getSkillName = (skill: string | { name: string; level?: number }): string => {
    return typeof skill === 'string' ? skill : skill.name;
  };

  const getSkillLevel = (skill: string | { name: string; level?: number }, index: number): number => {
    if (skillLevels[index] !== undefined) {
      return skillLevels[index];
    }
    if (typeof skill === 'string') {
      const defaultLevels = [85, 75, 80, 90, 70, 95];
      return defaultLevels[index % defaultLevels.length];
    }
    return skill.level || 80;
  };

  const handleSkillLevelChange = (index: number, level: number) => {
    setSkillLevels(prev => ({ ...prev, [index]: level }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800">
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          input[type="range"] {
            pointer-events: none;
          }
        }
      `}</style>

      {/* Header */}
      <header className="mb-0">
        <div className="py-8 px-8 text-center" style={{ backgroundColor: hexToRgba(accentColor, 0.2) }}>
          <h1 className="text-5xl font-light tracking-widest mb-2 text-gray-900">
            {data.personal_info?.full_name?.toUpperCase() || "YOUR NAME"}
          </h1>
          <p className="text-xs tracking-widest text-gray-600">
            • {data.personal_info?.title?.toLowerCase() || "Designation"} •
          </p>
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="flex gap-0 px-12 py-8">
        {/* Left Column */}
        <div className="w-1/2 pr-12 space-y-8">
          {/* About Me */}
          {data.professional_summary && (
            <section>
              <h2 className="text-lg font-bold mb-4 tracking-wide text-gray-900">
                ABOUT ME
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-4 tracking-wide text-gray-900">
                EDUCATION
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <p className="text-sm text-gray-700">
                      {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? formatDate(new Date().toISOString()) : formatDate(edu.end_date)}
                      {" • "}
                      {edu.institution}
                    </p>
                    <p className="text-sm text-gray-900 font-medium mt-1">
                      {edu.degree}{edu.field && `, ${edu.field}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Additional Info */}
          {data.additional_info &&
            (data.additional_info.languages ||
              data.additional_info.certifications ||
              data.additional_info.interests) && (
            <section className="space-y-4">
              {data.additional_info.certifications && (
                <div>
                  <h2 className="text-lg font-bold mb-2 tracking-wide text-gray-900">CERTIFICATIONS</h2>
                  {/* ✅ renderBrList for <br> between items */}
                  {renderBrList(data.additional_info.certifications, "inherit")}
                </div>
              )}
              {data.additional_info.languages && (
                <div>
                  <h2 className="text-lg font-bold mb-2 tracking-wide text-gray-900">LANGUAGES</h2>
                  {/* ✅ renderBrList for <br> between items */}
                  {renderBrList(data.additional_info.languages, "inherit")}
                </div>
              )}
              {data.additional_info.interests && (
                <div>
                  <h2 className="text-lg font-bold mb-2 tracking-wide text-gray-900">INTERESTS</h2>
                  {/* ✅ renderBrList for <br> between items */}
                  {renderBrList(data.additional_info.interests, "inherit")}
                </div>
              )}
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="w-1/2 space-y-8">
          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-4 tracking-wide text-gray-900">
                EXPERIENCE
              </h2>
              <div className="space-y-5">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <p className="text-sm font-bold text-gray-900 mb-1">{formatDate(exp.start_date)}</p>
                    <h3 className="text-base font-bold text-gray-900">{exp.company}</h3>
                    <p className="text-sm text-gray-700 italic mt-1">{exp.position}</p>
                    {/* ✅ replaced manual split/map with shared renderBullets */}
                    <div className="mt-2">
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
              <h2 className="text-lg font-bold mb-4 tracking-wide text-gray-900">
                PROJECTS
              </h2>
              <div className="space-y-5">
                {data.projects.map((proj: Project, index: number) => (
                  <div key={index}>
                    <h3 className="text-base font-bold text-gray-900">{proj.name}</h3>
                    {/* ✅ replaced manual split/map with shared renderBullets */}
                    <div className="mt-2">
                      {renderBullets(proj.description, "inherit")}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Skills Section - Full Width */}
      {data.skills && data.skills.length > 0 && (
        <section className="px-12 pb-8">
          <h2 className="text-lg font-bold mb-6 tracking-wide text-gray-900">
            SKILLS
          </h2>
          <div className="grid grid-cols-2 gap-x-16 gap-y-3">
            {data.skills.map((skill, index) => {
              const skillName = getSkillName(skill);
              const skillLevel = getSkillLevel(skill, index);
              return (
                <div key={index} className="relative group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-900">{skillName}</span>
                    <span className="text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {skillLevel}%
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300 rounded-full"
                        style={{
                          width: `${skillLevel}%`,
                          backgroundColor: hexToRgba(accentColor, 0.6),
                        }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skillLevel}
                      onChange={(e) => handleSkillLevelChange(index, parseInt(e.target.value))}
                      className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
                      style={{ margin: 0 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer with contact */}
      <footer className="mt-4 pt-4 pb-8 px-12" style={{ borderTop: `3px solid ${hexToRgba(accentColor, 0.3)}` }}>
        <div className="flex justify-center items-center flex-wrap gap-3 text-sm text-gray-700">
          {data.personal_info?.phone && (
            <span>{data.personal_info.phone}</span>
          )}
          {data.personal_info?.email && (
            <span>• {data.personal_info.email}</span>
          )}
          {data.personal_info?.website && (
            <span>• {data.personal_info.website}</span>
          )}
        </div>
      </footer>
    </div>
  );
};

export default BeginnerProTemplate;