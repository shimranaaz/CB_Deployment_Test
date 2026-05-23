import React from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface ArtistryResumeProps {
  data: ResumeData;
  accentColor: string;
}

const ArtistryResume: React.FC<ArtistryResumeProps> = ({ data, accentColor }) => {
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
    <div className="max-w-4xl mx-auto p-12 bg-white text-gray-900" style={{ colorAdjust: 'exact', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-5xl font-normal tracking-widest mb-3" style={{ letterSpacing: "0.3em" }}>
          {data.personal_info?.full_name?.toUpperCase() || "YOUR NAME"}
        </h1>
        <h2 className="text-lg font-normal tracking-widest text-gray-700 mb-6" style={{ letterSpacing: "0.2em" }}>
          {data.personal_info?.title?.toUpperCase() || "YOUR TITLE"}
        </h2>
        
        {/* Contact Bar */}
        <div 
          className="flex justify-center items-center gap-8 py-4 text-sm text-white"
          style={{ backgroundColor: accentColor || "#E8D5C4" }}
        >
          {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
          {data.personal_info?.email && <span>{data.personal_info.email}</span>}
          {data.personal_info?.location && <span>{data.personal_info.location}</span>}
        </div>
      </header>

      {/* Professional Summary */}
      {data.professional_summary && (
        <section className="mb-8">
          <h2 className="text-sm font-bold tracking-widest mb-4 pb-2 border-b-2 border-gray-900" style={{ letterSpacing: "0.15em" }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-sm leading-relaxed text-justify">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold tracking-widest mb-4 pb-2 border-b-2 border-gray-900" style={{ letterSpacing: "0.15em" }}>
            EXPERIENCE
          </h2>

          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-base">{exp.company || "Company Name"}</h3>
                    <p className="italic text-sm text-gray-700">{exp.position}</p>
                  </div>
                  <span className="text-sm text-gray-700 whitespace-nowrap ml-4">
                    {formatDate(exp.start_date)}-{isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                {/* ✅ replaced manual split/map with shared renderBullets */}
                <div className="ml-5 mt-2">
                  {renderBullets(exp.description, "inherit")}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold tracking-widest mb-4 pb-2 border-b-2 border-gray-900" style={{ letterSpacing: "0.15em" }}>
            EDUCATION
          </h2>

          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-base">{edu.institution}</h3>
                    <p className="italic text-sm text-gray-700">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </p>
                  </div>
                  <span className="text-sm text-gray-700 whitespace-nowrap ml-4">
                    {edu.start_date && formatDate(edu.start_date)}
                    {edu.start_date && "-"}
                    {isCurrentlyStudying(edu) ? "Present" : edu.end_date ? formatDate(edu.end_date) : ""}
                  </span>
                </div>
                {(edu.additional_info || edu.gpa) && (
                  <ul className="list-disc ml-5 space-y-1 text-sm mt-1">
                    {edu.additional_info &&
                      edu.additional_info
                        .split("\n")
                        .filter((line) => line.trim())
                        .map((line, i) => (
                          <li key={i}>{line.trim().replace(/^[•\-]\s*/, "")}</li>
                        ))}
                    {edu.gpa && <li>GPA: {edu.gpa}</li>}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold tracking-widest mb-4 pb-2 border-b-2 border-gray-900" style={{ letterSpacing: "0.15em" }}>
            SKILLS
          </h2>
          <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-sm">
            {data.skills.map((skill, index) => (
              <div key={index}>{skill}</div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold tracking-widest mb-4 pb-2 border-b-2 border-gray-900" style={{ letterSpacing: "0.15em" }}>
            PROJECTS
          </h2>

          <div className="space-y-4">
            {data.projects.map((proj, index) => (
              <div key={index}>
                <h3 className="font-bold text-base">{proj.name}</h3>
                <p className="text-sm">{proj.description}</p>
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
          <section className="mb-8">
            <h2 className="text-sm font-bold tracking-widest mb-4 pb-2 border-b-2 border-gray-900" style={{ letterSpacing: "0.15em" }}>
              ADDITIONAL INFORMATION
            </h2>
            <div className="space-y-2 text-sm">
              {data.additional_info.certifications && (
                <div>
                  <span className="font-bold">Certifications:</span>{" "}
                  {/* ✅ replaced plain text with renderBrList */}
                  {renderBrList(data.additional_info.certifications, "inherit")}
                </div>
              )}
              {data.additional_info.languages && (
                <div>
                  <span className="font-bold">Languages:</span>{" "}
                  {/* ✅ replaced plain text with renderBrList */}
                  {renderBrList(data.additional_info.languages, "inherit")}
                </div>
              )}
              {data.additional_info.interests && (
                <div>
                  <span className="font-bold">Interests:</span>{" "}
                  {/* ✅ replaced plain text with renderBrList */}
                  {renderBrList(data.additional_info.interests, "inherit")}
                </div>
              )}
            </div>
          </section>
        )}
    </div>
  );
};

export default ArtistryResume;