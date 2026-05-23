import React from 'react';
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface PersonalInfo {
  full_name?: string;
  title?: string;
  phone?: string;
  email?: string;
  location?: string;
  website?: string;
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

interface TechNexaResumeProps {
  data: ResumeData;
  accentColor: string;
}

const TechNexaResume: React.FC<TechNexaResumeProps> = ({ data, accentColor = '#4A4A4A' }) => {
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

  const lighterAccent = `${accentColor}15`;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header Section */}
      <div className="bg-white-100 px-12 py-8">
        <h1 className="text-5xl font-bold mb-2" style={{ color: accentColor }}>
          {data.personal_info?.full_name || 'Your Name'}
        </h1>
        <p className="text-xl text-gray-600 tracking-wide">
          {data.personal_info?.title || 'Designation'}
        </p>
      </div>

      {/* Contact Bar */}
      <div className="px-12 py-5" style={{ backgroundColor: lighterAccent }}>
        <div className="flex flex-wrap gap-8 text-sm text-gray-700">
          {data.personal_info?.phone && (
            <div className="flex items-center gap-2">
              <i className="fas fa-phone" style={{ color: accentColor }}></i>
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.email && (
            <div className="flex items-center gap-2">
              <i className="fas fa-envelope" style={{ color: accentColor }}></i>
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-2">
              <i className="fas fa-map-marker-alt" style={{ color: accentColor }}></i>
              <span>{data.personal_info.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="flex px-12 py-10 gap-12">
        {/* Left Column */}
        <div className="w-1/3">
          {/* Education Section */}
          <div className="mb-10">
            <h2 className="text-lg font-bold mb-4 tracking-wide" style={{ color: accentColor }}>
              EDUCATION
            </h2>
            <div className="space-y-5">
              {data.education && data.education.length > 0 && data.education.map((edu: Education, index: number) => (
                <div key={index}>
                  <h3 className="text-sm font-bold mb-1" style={{ color: accentColor }}>
                    {edu.degree}{edu.field && ` ${edu.field}`}
                  </h3>
                  <p className="text-sm mb-1 text-gray-700">{edu.institution}</p>
                  <p className="text-sm text-gray-600">
                    ({edu.start_date && formatDate(edu.start_date).split(' ')[1]}
                    {edu.start_date && " - "}
                    {isCurrentlyStudying(edu) ? "Present" : edu.end_date ? formatDate(edu.end_date).split(' ')[1] : ""})
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-10">
            <h2 className="text-lg font-bold mb-4 tracking-wide" style={{ color: accentColor }}>
              SKILLS
            </h2>
            <ul className="space-y-2">
              {data.skills && data.skills.length > 0 && data.skills.map((skill: string, index: number) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ CHANGED: Languages — renderBrList replacing inline split/map */}
          {data.additional_info?.languages && (
            <div className="mb-10">
              <h2 className="text-lg font-bold mb-4 tracking-wide" style={{ color: accentColor }}>
                LANGUAGE
              </h2>
              <div className="ml-1">
                {renderBrList(data.additional_info.languages, "inherit")}
              </div>
            </div>
          )}

          {/* ✅ ADDED: Certifications */}
          {data.additional_info?.certifications && (
            <div className="mb-10">
              <h2 className="text-lg font-bold mb-4 tracking-wide" style={{ color: accentColor }}>
                CERTIFICATIONS
              </h2>
              <div className="ml-1">
                {renderBrList(data.additional_info.certifications, "inherit")}
              </div>
            </div>
          )}

          {/* ✅ ADDED: Interests */}
          {data.additional_info?.interests && (
            <div className="mb-10">
              <h2 className="text-lg font-bold mb-4 tracking-wide" style={{ color: accentColor }}>
                INTERESTS
              </h2>
              <div className="ml-1">
                {renderBrList(data.additional_info.interests, "inherit")}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="w-2/3 border-l-2 border-gray-300 pl-12">
          {/* Profile/Summary Section */}
          {data.professional_summary && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 tracking-wide" style={{ color: accentColor }}>
                PROFILE
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {data.professional_summary}
              </p>
            </div>
          )}

          {/* Work Experience Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 tracking-wide" style={{ color: accentColor }}>
              WORK EXPERIENCE
            </h2>
            <div className="space-y-6">
              {data.experience && data.experience.length > 0 && data.experience.map((exp: Experience, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold" style={{ color: accentColor }}>
                      {exp.company}
                    </h3>
                    <span className="text-sm font-semibold text-gray-700 whitespace-nowrap ml-4">
                      {formatDate(exp.start_date).split(' ')[1]} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date).split(' ')[1]}
                    </span>
                  </div>
                  <p className="text-sm mb-2 text-gray-700 font-semibold">
                    {exp.position}
                  </p>
                  {/* ✅ CHANGED: renderBullets for experience */}
                  <div className="ml-2 mt-1">
                    {renderBullets(exp.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          {data.projects && data.projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 tracking-wide" style={{ color: accentColor }}>
                PROJECTS
              </h2>
              <div className="space-y-6">
                {data.projects.map((proj: Project, index: number) => (
                  <div key={index}>
                    <h3 className="text-base font-bold mb-1" style={{ color: accentColor }}>
                      {proj.name}
                    </h3>
                    {/* ✅ CHANGED: renderBullets for projects */}
                    <div className="ml-2 mt-1">
                      {renderBullets(proj.description, "inherit")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References Section */}
          {data.references && data.references.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-4 tracking-wide" style={{ color: accentColor }}>
                REFERENCES
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {data.references.map((ref: Reference, index: number) => (
                  <div key={index}>
                    <h3 className="text-base font-bold mb-1" style={{ color: accentColor }}>
                      {ref.name}
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">
                      {ref.company} / {ref.title}
                    </p>
                    {ref.phone && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Phone:</span> {ref.phone}
                      </p>
                    )}
                    {ref.email && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Email:</span> {ref.email}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
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

export default TechNexaResume;