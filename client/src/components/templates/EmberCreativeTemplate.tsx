import React from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface EmberCreativeTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const EmberCreativeTemplate: React.FC<EmberCreativeTemplateProps> = ({ data, accentColor }) => {
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
    });
  };

  const isCurrentlyWorking = (exp: Experience): boolean => {
    return exp.is_current || !exp.end_date;
  };

  const isCurrentlyStudying = (edu: Education): boolean => {
    return edu.is_current || !edu.end_date;
  };

  const renderSectionHeader = (title: string) => (
    <div className="flex items-center gap-4 mb-4">
      <h2
        className="text-lg font-bold uppercase tracking-wider whitespace-nowrap"
        style={{ color: accentColor }}
      >
        {title}
      </h2>
      <div className="flex-1 border-b-2" style={{ borderColor: accentColor }}></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-12 bg-white text-gray-900">
      {/* Header */}
      <header className="mb-8">
        <h1
          className="text-5xl font-bold mb-2 uppercase tracking-wide"
          style={{ color: accentColor }}
        >
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <h2 className="text-2xl font-light text-gray-800 mb-6 uppercase tracking-wide">
          {data.personal_info?.title || "Your Title"}
        </h2>

        <div className="flex flex-col items-end gap-1 text-sm text-gray-700">
          {data.personal_info?.email && (
            <>
              <div>{data.personal_info.email}</div>
              <div className="w-64 border-t-2" style={{ borderColor: accentColor }}></div>
            </>
          )}
          {data.personal_info?.location && (
            <>
              <div>{data.personal_info.location}</div>
              <div className="w-64 border-t-2" style={{ borderColor: accentColor }}></div>
            </>
          )}
          {data.personal_info?.phone && (
            <>
              <div>{data.personal_info.phone}</div>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.professional_summary && (
        <section className="mb-8">
          {renderSectionHeader("Summary")}
          <p className="text-gray-700 text-sm leading-relaxed">{data.professional_summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          {renderSectionHeader("Experience")}
          <div className="space-y-5">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 uppercase text-sm">
                      {exp.company && `${exp.company} - ANY CITY`}
                    </h3>
                    <p className="text-gray-800 text-sm">{exp.position}</p>
                  </div>
                  <span className="text-sm text-gray-700 italic whitespace-nowrap ml-4">
                    ({formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "present" : formatDate(exp.end_date)})
                  </span>
                </div>
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
          {renderSectionHeader("Projects")}
          <div className="space-y-5">
            {data.projects.map((proj, index) => (
              <div key={index}>
                <h3 className="font-bold text-gray-900 uppercase text-sm">
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

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          {renderSectionHeader("Education")}
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900 uppercase text-sm">
                      {edu.institution} ({edu.start_date && formatDate(edu.start_date).split(' ')[1]} - {isCurrentlyStudying(edu) ? "present" : edu.end_date ? formatDate(edu.end_date).split(' ')[1] : ""})
                    </h3>
                    <p className="text-gray-800 text-sm">{edu.degree}{edu.field && ` of ${edu.field}`}</p>
                  </div>
                  {edu.gpa && (
                    <span className="text-sm text-gray-700 italic whitespace-nowrap ml-4">
                      GPA {edu.gpa}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.additional_info?.certifications && (
        <section className="mb-8">
          {renderSectionHeader("Certification")}
          <div className="ml-5">
            {renderBrList(data.additional_info.certifications, "inherit")}
          </div>
        </section>
      )}

      {/* Languages */}
      {data.additional_info?.languages && (
        <section className="mb-8">
          {renderSectionHeader("Languages")}
          <div className="ml-5">
            {renderBrList(data.additional_info.languages, "inherit")}
          </div>
        </section>
      )}

      {/* Interests */}
      {data.additional_info?.interests && (
        <section className="mb-8">
          {renderSectionHeader("Interests")}
          <div className="ml-5">
            {renderBrList(data.additional_info.interests, "inherit")}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          {renderSectionHeader("Skills")}
          <ul className="list-disc ml-5 grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-700">
            {data.skills.map((skill, index) => (
              <li key={index} className="italic">{skill}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default EmberCreativeTemplate;