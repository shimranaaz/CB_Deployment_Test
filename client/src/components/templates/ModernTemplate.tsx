import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { ResumeData, Experience, Education, Project } from "../../types/resume";
import { renderBullets } from "@/utils/resumeHelpers";

interface ModernTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({
  data,
  accentColor,
}) => {
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";

    const [yearStr, monthStr] = dateStr.split("-");
    const year = Number(yearStr);
    const month = monthStr ? Number(monthStr) - 1 : 0;

    const date = new Date(year, month);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const isCurrentlyStudying = (edu: Education): boolean => {
    return edu.is_current === true || !edu.end_date;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800">
      {/* ===== Header ===== */}
      <header
        className="p-8 text-white print:text-white"
        style={{
          backgroundColor: accentColor,
          WebkitPrintColorAdjust: "exact",
          colorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        <h1 className="text-4xl font-light mb-3">
          {data.personal_info?.full_name || "Your Name"}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {data.personal_info?.email && (
            <div className="flex items-center gap-2">
              <Mail className="size-4" />
              <span>{data.personal_info.email}</span>
            </div>
          )}

          {data.personal_info?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-4" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}

          {data.personal_info?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span>{data.personal_info.location}</span>
            </div>
          )}

          {data.personal_info?.linkedin && (
            
              <a href={data.personal_info.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Linkedin className="size-4" />
              <span className="break-all text-xs">
                {data.personal_info.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
              </span>
            </a>
          )}

          {data.personal_info?.website && (
            
              <a href={data.personal_info.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Globe className="size-4" />
              <span className="break-all text-xs">
                {data.personal_info.website.replace(/^https?:\/\//, "")}
              </span>
            </a>
          )}
        </div>
      </header>

      {/* ===== Body ===== */}
      <div className="p-8">
        {/* Summary */}
        {data.professional_summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 pb-2 border-b">
              Professional Summary
            </h2>
            <p className="text-gray-700">{data.professional_summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-light mb-6 pb-2 border-b">
              Experience
            </h2>

            <div className="space-y-6">
              {data.experience.map((exp: Experience, index: number) => (
                <div key={index} className="pl-6 border-l" style={{ borderLeftColor: accentColor }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-medium">{exp.position}</h3>
                      <p className="font-medium" style={{ color: accentColor }}>
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded">
                      {formatDate(exp.start_date)} –{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
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
            <h2 className="text-2xl font-light mb-4 pb-2 border-b">
              Projects
            </h2>

            <div className="space-y-6">
              {data.projects.map((p: Project, index: number) => (
                <div
                  key={index}
                  className="pl-6 border-l"
                  style={{ borderLeftColor: accentColor }}
                >
                  <h3 className="font-medium">{p.name}</h3>
                  <div className="ml-5 mt-2">
                    {renderBullets(p.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid sm:grid-cols-2 gap-8">
          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-2xl font-light mb-4 pb-2 border-b">
                Education
              </h2>

              <div className="space-y-4">
                {data.education.map((edu: Education, index: number) => (
                  <div key={index}>
                    <h3 className="font-semibold">
                      {edu.degree}
                      {edu.field && ` in ${edu.field}`}
                    </h3>
                    <p style={{ color: accentColor }}>{edu.institution}</p>

                    <p className="text-sm text-gray-600">
                      {formatDate(edu.start_date)} –{" "}
                      {isCurrentlyStudying(edu)
                        ? "Present"
                        : formatDate(edu.end_date || edu.graduation_date)}
                    </p>

                    {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-2xl font-light mb-4 pb-2 border-b">
                Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm text-white rounded-full"
                    style={{
                      backgroundColor: accentColor,
                      WebkitPrintColorAdjust: "exact",
                      colorAdjust: "exact",
                      printColorAdjust: "exact",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;