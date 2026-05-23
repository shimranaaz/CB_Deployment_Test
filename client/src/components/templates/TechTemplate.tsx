import React from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface TechTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const TechTemplate: React.FC<TechTemplateProps> = ({ data, accentColor }) => {
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";

    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    const month = parts[1] ? parseInt(parts[1]) - 1 : 0;

    const date = new Date(year, month);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isCurrentlyWorking = (exp: Experience): boolean => {
    return exp.is_current || !exp.end_date;
  };

  const isCurrentlyStudying = (edu: Education): boolean => {
    return edu.is_current || !edu.end_date;
  };

  return (
    <div className="max-w-4xl mx-auto p-12 bg-white text-gray-800">
      {/* Header */}
      <header className="mb-8 pb-6 border-b-2" style={{ borderColor: accentColor }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold tracking-wide" style={{ color: accentColor }}>
            {data.personal_info?.full_name?.toUpperCase() || "YOUR NAME"}
          </h1>
          <div className="h-0.5 flex-grow ml-6" style={{ backgroundColor: accentColor }}></div>
        </div>
        <h2 className="text-xl font-normal mb-3" style={{ color: accentColor }}>
          {data.personal_info?.title || "Your Title"}
        </h2>
        <div className="text-sm text-gray-700">
          {data.personal_info?.location && <span>{data.personal_info.location}</span>}
          {data.personal_info?.phone && <span> | {data.personal_info.phone}</span>}
          {data.personal_info?.email && <span> | {data.personal_info.email}</span>}
          {data.personal_info?.website && <span> | {data.personal_info.website}</span>}
        </div>
      </header>

      {/* Career Summary */}
      {data.professional_summary && (
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-3 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
            CAREER SUMMARY:
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* Work Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-3 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
            WORK EXPERIENCE:
          </h3>
          <div className="space-y-5">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <h4 className="font-bold text-gray-800 text-sm mb-1">
                  {exp.company}
                </h4>
                <p className="text-sm text-gray-700 mb-2">
                  {exp.position} | {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
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
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-3 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
            RELEVANT PROJECTS:
          </h3>
          <div className="space-y-5">
            {data.projects.map((proj, index) => (
              <div key={index}>
                <h4 className="font-bold text-gray-800 text-sm mb-1">
                  {proj.name}
                </h4>
                {proj.date && (
                  <p className="text-sm text-gray-700 mb-2">
                    Freelance Web Developer | {proj.date}
                  </p>
                )}
                <div className="ml-5 mt-2">
                  {renderBullets(proj.description, "inherit")}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-3 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
            EDUCATION:
          </h3>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <p className="text-sm text-gray-700 mb-1">
                  {edu.start_date && formatDate(edu.start_date).split(',')[1]}
                  {edu.start_date && edu.end_date && " - "}
                  {edu.end_date && !isCurrentlyStudying(edu) && formatDate(edu.end_date).split(',')[1]}
                  {isCurrentlyStudying(edu) && " - Present"}
                  {edu.institution && ` | ${edu.institution}`}
                </p>
                <p className="text-sm text-gray-700 font-semibold">
                  {edu.degree} {edu.field && `- ${edu.field}`}
                </p>
                {edu.additional_info && (
                  <div className="mt-2 text-sm text-gray-700">
                    {edu.additional_info.split("\n").filter(line => line.trim()).map((line, i) => (
                      <p key={i} className="mb-1">{line.trim().replace(/^[•\-]\s*/, "")}</p>
                    ))}
                  </div>
                )}
                {edu.gpa && <p className="text-sm text-gray-700 mt-1">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-3 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
            SKILLS:
          </h3>
          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
            {data.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Certifications */}
      {data.additional_info?.certifications && (
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-3 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
            CERTIFICATIONS:
          </h3>
          {renderBrList(data.additional_info.certifications, "inherit")}
        </section>
      )}

      {/* Languages */}
      {data.additional_info?.languages && (
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-3 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
            LANGUAGES:
          </h3>
          {renderBrList(data.additional_info.languages, "inherit")}
        </section>
      )}

      {/* Interests */}
      {data.additional_info?.interests && (
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-3 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
            INTERESTS:
          </h3>
          {renderBrList(data.additional_info.interests, "inherit")}
        </section>
      )}
    </div>
  );
};

export default TechTemplate;