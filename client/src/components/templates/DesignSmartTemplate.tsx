import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
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

interface DesignSmartTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const DesignSmartTemplate: React.FC<DesignSmartTemplateProps> = ({ data, accentColor }) => {
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
    <div className="max-w-4xl mx-auto bg-white text-gray-900 p-8">
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

      {/* Rounded border container */}
      <div className="border-4 rounded-3xl p-10" style={{ borderColor: accentColor }}>
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-5xl font-black mb-2 text-gray-900">
            {data.personal_info?.full_name?.toUpperCase() || "YOUR NAME"}
          </h1>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {data.personal_info?.title?.toUpperCase() || "Designation"}
          </h2>

          {/* Contact Info with Icons */}
          <div className="space-y-2">
            {data.personal_info?.phone && (
              <div className="flex items-center gap-2">
                <Phone size={18} style={{ color: accentColor }} />
                <span className="text-sm">{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.email && (
              <div className="flex items-center gap-2">
                <Mail size={18} style={{ color: accentColor }} />
                <span className="text-sm">{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info?.location && (
              <div className="flex items-center gap-2">
                <MapPin size={18} style={{ color: accentColor }} />
                <span className="text-sm">{data.personal_info.location}</span>
              </div>
            )}
          </div>
        </header>

        {/* Two Column Layout */}
        <div className="flex gap-8">
          {/* Left Column - 40% */}
          <div className="w-2/5 space-y-8">
            {/* Summary */}
            {data.professional_summary && (
              <section>
                <h3 className="text-lg font-bold mb-4 tracking-wide uppercase" style={{ color: accentColor }}>
                  Summary
                </h3>
                <p className="text-sm leading-relaxed text-gray-800">
                  {data.professional_summary}
                </p>
              </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section>
                <h3 className="text-lg font-bold mb-4 tracking-wide uppercase" style={{ color: accentColor }}>
                  Education
                </h3>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index}>
                      <h4 className="text-sm font-bold text-gray-900 uppercase">
                        {edu.degree}
                      </h4>
                      <p className="text-sm text-gray-800 mt-1">{edu.institution}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "Present" : formatDate(edu.end_date)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section>
                <h3 className="text-lg font-bold mb-4 tracking-wide uppercase" style={{ color: accentColor }}>
                  Skills
                </h3>
                <div className="space-y-2">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="text-sm text-gray-800">
                      {skill}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Additional Information */}
            {data.additional_info &&
              (data.additional_info.languages ||
                data.additional_info.certifications ||
                data.additional_info.interests) && (
              <section>
                <h3 className="text-lg font-bold mb-4 tracking-wide uppercase" style={{ color: accentColor }}>
                  Additional Info
                </h3>
                <div className="space-y-3 text-sm text-gray-800">
                  {data.additional_info.certifications && (
                    <div>
                      <span className="font-semibold">Certifications: </span>
                      {renderBrList(data.additional_info.certifications, "inherit")}
                    </div>
                  )}
                  {data.additional_info.languages && (
                    <div>
                      <span className="font-semibold">Languages: </span>
                      {renderBrList(data.additional_info.languages, "inherit")}
                    </div>
                  )}
                  {data.additional_info.interests && (
                    <div>
                      <span className="font-semibold">Interests: </span>
                      {renderBrList(data.additional_info.interests, "inherit")}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - 60% */}
          <div className="w-3/5 space-y-8">
            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <section>
                <h3 className="text-lg font-bold mb-4 tracking-wide uppercase" style={{ color: accentColor }}>
                  Experience
                </h3>
                <div className="space-y-6">
                  {data.experience.map((exp, index) => (
                    <div key={index}>
                      <h4 className="text-base font-bold text-gray-900 uppercase">
                        {exp.position}
                      </h4>
                      <p className="text-sm text-gray-800 mt-1">{exp.company}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
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
                <h3 className="text-lg font-bold mb-4 tracking-wide uppercase" style={{ color: accentColor }}>
                  Projects
                </h3>
                <div className="space-y-4">
                  {data.projects.map((proj, index) => (
                    <div key={index}>
                      <h4 className="text-base font-bold text-gray-900 uppercase">
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
    </div>
  );
};

export default DesignSmartTemplate;