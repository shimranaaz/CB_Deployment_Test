import React from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { Phone, Mail, Home, Globe } from "lucide-react";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface ExecutiveTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const ExecutiveTemplate: React.FC<ExecutiveTemplateProps> = ({ data, accentColor }) => {
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
    <h3
      className="text-sm font-bold tracking-wider mb-4 px-4 py-2 print-bg-accent-light"
      style={{ backgroundColor: hexToRgba(accentColor, 0.2), color: '#666' }}
    >
      {title}
    </h3>
  );

  return (
    <>
      <style>{`
        @media print {
          .print-bg-accent-light {
            background-color: ${hexToRgba(accentColor, 0.2)} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        .print-bg-accent-light {
          background-color: ${hexToRgba(accentColor, 0.2)};
        }
      `}</style>
      <div className="max-w-4xl mx-auto p-12 bg-white text-gray-700">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-light tracking-widest text-gray-600 mb-3">
            {data.personal_info?.full_name?.toUpperCase() || "YOUR NAME"}
          </h1>
          <h2 className="text-xl font-light tracking-wide text-gray-600 mb-8">
            {data.personal_info?.title || "Your Title"}
          </h2>
        </header>

        {/* Contact Info Section */}
        <section className="mb-8">
          {renderSectionHeader("CONTACT INFO")}
          <div className="grid grid-cols-2 gap-x-12 gap-y-3 px-4 text-sm text-gray-600">
            {data.personal_info?.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <span>{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <span>{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info?.location && (
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-gray-600" />
                <span>{data.personal_info.location}</span>
              </div>
            )}
            {data.personal_info?.website && (
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <span>{data.personal_info.website}</span>
              </div>
            )}
          </div>
        </section>

        {/* Profile/Summary */}
        {data.professional_summary && (
          <section className="mb-8">
            {renderSectionHeader("PROFILE")}
            <p className="px-4 text-sm text-gray-600 leading-relaxed">
              {data.professional_summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            {renderSectionHeader("EXPERIENCE")}
            <div className="px-4 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-700 text-sm">
                        {exp.position}
                      </h4>
                      <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                        {formatDate(exp.start_date)}-{isCurrentlyWorking(exp) ? formatDate(new Date().toISOString()) : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <p className="font-bold text-gray-700 text-sm mb-2">{exp.company}</p>
                    <div className="ml-5 mt-2">
                      {renderBullets(exp.description, "inherit")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Two Column Layout for Education and Skills */}
        <div className="grid grid-cols-2 gap-8">
          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section className="mb-8">
              {renderSectionHeader("EDUCATION")}
              <div className="px-4 space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-700 text-sm">
                        {edu.degree}
                      </h4>
                      <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                        {formatDate(edu.start_date)}-{isCurrentlyStudying(edu) ? formatDate(new Date().toISOString()) : formatDate(edu.end_date)}
                      </span>
                    </div>
                    <p className="font-bold text-gray-700 text-sm mb-2">{edu.institution}</p>
                    {edu.additional_info && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {edu.additional_info.split("\n").filter(line => line.trim()).join(" ")}
                      </p>
                    )}
                    {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section className="mb-8">
              {renderSectionHeader("SKILL")}
              <ul className="px-4 space-y-2 text-sm text-gray-600">
                {data.skills.map((skill, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-8">
            {renderSectionHeader("PROJECTS")}
            <div className="px-4 space-y-4">
              {data.projects.map((proj, index) => (
                <div key={index}>
                  <h4 className="font-bold text-gray-700 text-sm mb-1">{proj.name}</h4>
                  <div className="ml-5 mt-2">
                    {renderBullets(proj.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.additional_info?.certifications && (
          <section className="mb-8">
            {renderSectionHeader("CERTIFICATIONS")}
            <div className="px-4 ml-1">
              {renderBrList(data.additional_info.certifications, "inherit")}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.additional_info?.languages && (
          <section className="mb-8">
            {renderSectionHeader("LANGUAGES")}
            <div className="px-4 ml-1">
              {renderBrList(data.additional_info.languages, "inherit")}
            </div>
          </section>
        )}

        {/* Interests */}
        {data.additional_info?.interests && (
          <section className="mb-8">
            {renderSectionHeader("INTERESTS")}
            <div className="px-4 ml-1">
              {renderBrList(data.additional_info.interests, "inherit")}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default ExecutiveTemplate;