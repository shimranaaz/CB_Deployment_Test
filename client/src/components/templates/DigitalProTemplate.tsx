import React from "react";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
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
  skills?: string[];
  experience?: Experience[];
  projects?: Project[];
  education?: Education[];
  additional_info?: AdditionalInfo;
}

interface DigitalProTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const DigitalProTemplate: React.FC<DigitalProTemplateProps> = ({ data, accentColor }) => {
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
    <div className="max-w-4xl mx-auto bg-white text-gray-800">
      {/* Print styles */}
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Header */}
      <header className="text-center py-8 px-8" style={{
        backgroundColor: hexToRgba(accentColor, 0.1),
        borderBottom: `2px solid ${accentColor}`
      }}>
        <h1 className="text-5xl font-bold mb-2 tracking-widest" style={{ color: accentColor }}>
          {data.personal_info?.full_name?.toUpperCase() || "YOUR NAME"}
        </h1>
        <h2 className="text-base tracking-widest text-gray-600">
          {data.personal_info?.title?.toUpperCase() || "YOUR TITLE"}
        </h2>
      </header>

      {/* Contact Info Bar */}
      <div className="py-3 px-8 flex justify-center items-center flex-wrap gap-4 text-xs text-gray-700" style={{ borderBottom: `2px solid ${accentColor}` }}>
        {data.personal_info?.email && (
          <span className="flex items-center gap-1">
            <Mail size={12} /> {data.personal_info.email}
          </span>
        )}
        {data.personal_info?.website && (
          <span className="flex items-center gap-1">
            <Globe size={12} /> {data.personal_info.website}
          </span>
        )}
        {data.personal_info?.phone && (
          <span className="flex items-center gap-1">
            <Phone size={12} /> {data.personal_info.phone}
          </span>
        )}
        {data.personal_info?.location && (
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {data.personal_info.location}
          </span>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="flex">
        {/* Left Column - 35% */}
        <div className="w-2/5 p-8 space-y-6" style={{ backgroundColor: hexToRgba(accentColor, 0.08) }}>
          {/* About/Summary */}
          {data.professional_summary && (
            <section>
              <h3 className="text-sm font-bold mb-3 pb-1 tracking-wide" style={{ borderBottom: `1px solid ${accentColor}`, color: accentColor }}>
                ABOUT
              </h3>
              <p className="text-xs leading-relaxed text-gray-700">
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h3 className="text-sm font-bold mb-3 pb-1 tracking-wide" style={{ borderBottom: `1px solid ${accentColor}`, color: accentColor }}>
                SKILLS
              </h3>
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

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <h3 className="text-sm font-bold mb-3 pb-1 tracking-wide" style={{ borderBottom: `1px solid ${accentColor}`, color: accentColor }}>
                EDUCATION
              </h3>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h4 className="text-xs font-bold text-gray-800 uppercase">
                      {edu.position || edu.degree}
                    </h4>
                    <p className="text-xs text-gray-700 mt-1">
                      {edu.field && `${edu.degree}, major in ${edu.field}`}
                      {!edu.field && edu.degree}
                    </p>
                    <p className="text-xs text-gray-600 italic mt-1">
                      {edu.institution} | {edu.start_date && formatDate(edu.start_date)}
                      {edu.start_date && " - "}
                      {isCurrentlyStudying(edu) ? "Present" : edu.end_date ? formatDate(edu.end_date) : ""}
                    </p>
                    {edu.gpa && (
                      <p className="text-xs text-gray-700 mt-1">GPA: {edu.gpa}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.additional_info?.languages && (
            <section>
              <h3 className="text-sm font-bold mb-3 pb-1 tracking-wide" style={{ borderBottom: `1px solid ${accentColor}`, color: accentColor }}>
                LANGUAGES
              </h3>
              <div className="text-xs text-gray-700">
                {renderBrList(data.additional_info.languages, "inherit")}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.additional_info?.certifications && (
            <section>
              <h3 className="text-sm font-bold mb-3 pb-1 tracking-wide" style={{ borderBottom: `1px solid ${accentColor}`, color: accentColor }}>
                CERTIFICATIONS
              </h3>
              <div className="text-xs text-gray-700">
                {renderBrList(data.additional_info.certifications, "inherit")}
              </div>
            </section>
          )}

          {/* Interests */}
          {data.additional_info?.interests && (
            <section>
              <h3 className="text-sm font-bold mb-3 pb-1 tracking-wide" style={{ borderBottom: `1px solid ${accentColor}`, color: accentColor }}>
                INTERESTS
              </h3>
              <div className="text-xs text-gray-700">
                {renderBrList(data.additional_info.interests, "inherit")}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - 65% */}
        <div className="w-3/5 p-8 space-y-6">
          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <h3 className="text-sm font-bold mb-4 pb-1 tracking-wide" style={{ borderBottom: `1px solid ${accentColor}`, color: accentColor }}>
                EXPERIENCE
              </h3>
              <div className="space-y-5">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <h4 className="text-sm font-bold text-gray-800 uppercase">
                      {exp.position}
                    </h4>
                    <p className="text-xs text-gray-700 font-semibold mt-1">
                      {exp.company} {formatDate(exp.start_date)}-{isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                    </p>
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
            <section>
              <h3 className="text-sm font-bold mb-4 pb-1 tracking-wide" style={{ borderBottom: `1px solid ${accentColor}`, color: accentColor }}>
                PROJECTS
              </h3>
              <div className="space-y-4">
                {data.projects.map((proj, index) => (
                  <div key={index}>
                    <h4 className="text-sm font-bold text-gray-800">{proj.name}</h4>
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
  );
};

export default DigitalProTemplate;