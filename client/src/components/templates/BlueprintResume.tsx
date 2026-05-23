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
  additional_info?: AdditionalInfo;
}

interface BlueprintResumeProps {
  data: ResumeData;
  accentColor: string;
}

const BlueprintResume: React.FC<BlueprintResumeProps> = ({ data, accentColor = '#5A5A5A' }) => {
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
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="px-12 py-6 flex justify-center" style={{ backgroundColor: accentColor }}>
        <div className="border-4 border-gray-900 px-8 py-2 bg-white -mb-12">
          <h1 className="text-3xl font-bold mb-1" style={{ color: accentColor }}>
            {data.personal_info?.full_name || 'Your Name'}
          </h1>
          <p className="text-lg tracking-widest" style={{ color: accentColor, opacity: 0.6 }}>
            {data.personal_info?.title || 'Designation'}
          </p>
        </div>
      </div>

      {/* Summary Section */}
      {data.professional_summary && (
        <div className="px-12 pt-16 pb-6">
          <h2 className="text-base font-bold mb-3 pb-2 border-b-2 tracking-widest" style={{ color: accentColor, borderColor: accentColor }}>
            SUMMARY
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">
            {data.professional_summary}
          </p>
        </div>
      )}

      {/* Main Content - Two Columns */}
      <div className="flex px-12 pb-10" style={{ paddingTop: data.professional_summary ? '0' : '4rem' }}>
        {/* Left Column */}
        <div className="w-5/12 pr-8">
          {/* Contact Section */}
          <div className="mb-8">
            <h2 className="text-base font-bold mb-4 pb-2 border-b-2 tracking-widest" style={{ color: accentColor, borderColor: accentColor }}>
              CONTACT
            </h2>
            <div className="space-y-3">
              {data.personal_info?.phone && (
                <div className="flex items-start">
                  <span className="font-bold text-sm mr-2" style={{ color: accentColor }}>Phone:</span>
                  <span className="text-sm text-gray-700">{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-start">
                  <span className="font-bold text-sm mr-2" style={{ color: accentColor }}>Email:</span>
                  <span className="text-sm text-gray-700 break-all">{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-start">
                  <span className="font-bold text-sm mr-2" style={{ color: accentColor }}>Address:</span>
                  <span className="text-sm text-gray-700">{data.personal_info.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8">
            <h2 className="text-base font-bold mb-4 pb-2 border-b-2 tracking-widest" style={{ color: accentColor, borderColor: accentColor }}>
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

          {/* Education Section */}
          <div className="mb-8">
            <h2 className="text-base font-bold mb-4 pb-2 border-b-2 tracking-widest" style={{ color: accentColor, borderColor: accentColor }}>
              EDUCATION
            </h2>
            <div className="space-y-5">
              {data.education && data.education.length > 0 && data.education.map((edu: Education, index: number) => (
                <div key={index}>
                  <h3 className="text-sm font-bold mb-1" style={{ color: accentColor }}>
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </h3>
                  <p className="text-sm mb-1 text-gray-700">{edu.institution}</p>
                  <p className="text-sm text-gray-700">
                    {edu.start_date && formatDate(edu.start_date)}
                    {edu.start_date && " - "}
                    {isCurrentlyStudying(edu) ? "Present" : edu.end_date ? formatDate(edu.end_date) : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Languages Section */}
          {data.additional_info?.languages && (
            <div className="mb-8">
              <h2 className="text-base font-bold mb-4 pb-2 border-b-2 tracking-widest" style={{ color: accentColor, borderColor: accentColor }}>
                LANGUAGES
              </h2>
              {/* ✅ replaced manual split(',').map with renderBrList */}
              {renderBrList(data.additional_info.languages, "inherit")}
            </div>
          )}

          {/* Certifications Section */}
          {data.additional_info?.certifications && (
            <div className="mb-8">
              <h2 className="text-base font-bold mb-4 pb-2 border-b-2 tracking-widest" style={{ color: accentColor, borderColor: accentColor }}>
                CERTIFICATIONS
              </h2>
              {/* ✅ renderBrList for <br> between items */}
              {renderBrList(data.additional_info.certifications, "inherit")}
            </div>
          )}

          {/* Interests Section */}
          {data.additional_info?.interests && (
            <div className="mb-8">
              <h2 className="text-base font-bold mb-4 pb-2 border-b-2 tracking-widest" style={{ color: accentColor, borderColor: accentColor }}>
                INTERESTS
              </h2>
              {/* ✅ renderBrList for <br> between items */}
              {renderBrList(data.additional_info.interests, "inherit")}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="w-7/12">
          {/* Experience Section */}
          <div className="mb-8">
            <h2 className="text-base font-bold mb-4 pb-2 border-b-2 tracking-widest" style={{ color: accentColor, borderColor: accentColor }}>
              EXPERIENCE
            </h2>
            <div className="space-y-6">
              {data.experience && data.experience.length > 0 && data.experience.map((exp: Experience, index: number) => (
                <div key={index}>
                  <h3 className="text-sm font-bold mb-1" style={{ color: accentColor }}>
                    {exp.position}
                  </h3>
                  <p className="text-sm mb-1 text-gray-700">
                    {exp.company} • {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "recent" : formatDate(exp.end_date)}
                  </p>
                  {/* ✅ replaced manual split/map with shared renderBullets */}
                  <div className="mt-2">
                    {renderBullets(exp.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          {data.projects && data.projects.length > 0 && (
            <div>
              <h2 className="text-base font-bold mb-4 pb-2 border-b-2 tracking-widest" style={{ color: accentColor, borderColor: accentColor }}>
                PROJECTS
              </h2>
              <div className="space-y-6">
                {data.projects.map((proj: Project, index: number) => (
                  <div key={index}>
                    <h3 className="text-sm font-bold mb-1" style={{ color: accentColor }}>
                      {proj.name}
                    </h3>
                    {/* ✅ replaced manual split/map with shared renderBullets */}
                    <div className="mt-2">
                      {renderBullets(proj.description, "inherit")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

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

export default BlueprintResume;