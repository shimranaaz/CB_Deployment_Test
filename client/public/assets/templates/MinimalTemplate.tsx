import React from "react";

interface PersonalInfo {
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
}

interface Experience {
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  description?: string;
  is_current?: boolean;
}

interface Education {
  degree: string;
  field?: string;
  institution: string;
  start_date?: string;
  end_date?: string;
  graduation_date?: string;
  gpa?: string | number;
  is_current?: boolean;
  additional_info?: string;
}

interface Project {
  name: string;
  type?: string;
  description?: string;
}

interface MinimalTemplateProps {
  data: {
    personal_info?: PersonalInfo;
    professional_summary?: string;
    experience?: Experience[];
    education?: Education[];
    project?: Project[];
    skills?: string[];
  };
  accentColor: string;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data, accentColor }) => {
  // --- FIXED DATE FUNCTION ---
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";

    // handle "YYYY-MM" or "YYYY-MM-DD"
    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    const month = parts[1] ? parseInt(parts[1]) - 1 : 0;

    const date = new Date(year, month);
    if (isNaN(date.getTime())) return ""; // Prevent invalid date

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const isCurrentlyStudying = (edu: Education): boolean => {
    return edu.is_current === true || !edu.end_date;
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-light">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-thin mb-4 tracking-wide">
          {data?.personal_info?.full_name || "Your Name"}
        </h1>

        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          {data?.personal_info?.email && <span>{data.personal_info.email}</span>}
          {data?.personal_info?.phone && <span>{data.personal_info.phone}</span>}
          {data?.personal_info?.location && <span>{data.personal_info.location}</span>}
          {data?.personal_info?.linkedin && (
            <span className="break-all">{data.personal_info.linkedin}</span>
          )}
          {data?.personal_info?.website && (
            <span className="break-all">{data.personal_info.website}</span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {data?.professional_summary && (
        <section className="mb-10">
          <p className=" text-gray-700">{data.professional_summary}</p>
        </section>
      )}

      {/* Experience */}
      {data?.experience && data.experience.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: accentColor }}
          >
            Experience
          </h2>

          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-medium">{exp.position}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(exp.start_date)} -{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{exp.company}</p>
                {exp.description && (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data?.project && data.project.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: accentColor }}
          >
            Projects
          </h2>

          <div className="space-y-4">
            {data.project.map((proj, index) => (
              <div key={index} className="flex flex-col gap-2 justify-between items-baseline">
                <h3 className="text-lg font-medium ">{proj.name}</h3>
                <p className="text-gray-600">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data?.education && data.education.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: accentColor }}
          >
            Education
          </h2>

          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-medium">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  {(edu.additional_info || edu.gpa) && (
                    <div className="text-sm text-gray-500 mt-1 space-y-1">
                      {edu.additional_info &&
                        edu.additional_info
                          .split("\n")
                          .filter((line) => line.trim())
                          .map((line, i) => (
                            <p key={i}>{line.trim().replace(/^[•\-]\s*/, "")}</p>
                          ))}
                      {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                  {edu.start_date && formatDate(edu.start_date)}
                  {edu.start_date && " - "}
                  {isCurrentlyStudying(edu) ? "Present" : (edu.end_date || edu.graduation_date) ? formatDate(edu.end_date || edu.graduation_date) : ""}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data?.skills && data.skills.length > 0 && (
        <section>
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: accentColor }}
          >
            Skills
          </h2>

          <div className="text-gray-700">{data.skills.join(" • ")}</div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;