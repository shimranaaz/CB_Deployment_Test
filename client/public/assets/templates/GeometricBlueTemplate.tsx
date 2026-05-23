import React from "react";

interface PersonalInfo {
  full_name?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  profession?: string;
  linkedin?: string;
  website?: string;
  image?: File | string;
}

interface Experience {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
  is_current: boolean;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  gpa: string;
  is_current: boolean;
  additional_info?: string;
}

interface Project {
  name: string;
  type: string;
  description: string;
}

interface AdditionalInfo {
  certifications?: string;
  languages?: string;
  interests?: string;
}

interface ResumeData {
  personal_info?: PersonalInfo;
  professional_summary?: string;
  experience?: Experience[];
  education?: Education[];
  project?: Project[];
  skills?: string[];
  additional_info?: AdditionalInfo;
  [key: string]: any;
}

interface GeometricBlueTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const GeometricBlueTemplate: React.FC<GeometricBlueTemplateProps> = ({ data, accentColor }) => {
  // Format date function
  const formatDate = (dateStr: string): string => {
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
    return exp.is_current === true || !exp.end_date || exp.end_date.trim() === "";
  };

  const isCurrentlyStudying = (edu: Education): boolean => {
    return edu.is_current === true || !edu.end_date || edu.end_date.trim() === "";
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold mb-2" style={{ color: accentColor }}>
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          {data.personal_info?.title || "Your Title"}
        </h2>
        <div className="flex flex-wrap gap-3 text-sm text-gray-700">
          {data.personal_info?.location && <span>{data.personal_info.location}</span>}
          {data.personal_info?.email && <span>| {data.personal_info.email}</span>}
          {data.personal_info?.website && <span>| {data.personal_info.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.professional_summary && (
        <section className="mt-6 mb-6">
          <div className="border-t-2 mb-2" style={{ borderColor: accentColor }}></div>
          <h2 className="text-sm font-bold mb-2 tracking-wide" style={{ color: accentColor }}>
            SUMMARY
          </h2>
          <div className="border-t-2 mb-3" style={{ borderColor: accentColor }}></div>
          <p className="text-gray-700 text-sm leading-relaxed">{data.professional_summary}</p>
        </section>
      )}

      {/* Skills */}
      {Array.isArray(data.skills) && data.skills.length > 0 && (
        <section className="mb-6">
          <div className="border-t-2 mb-2" style={{ borderColor: accentColor }}></div>
          <h2 className="text-sm font-bold mb-2 tracking-wide" style={{ color: accentColor }}>
            TECHNICAL SKILLS
          </h2>
          <div className="border-t-2 mb-3" style={{ borderColor: accentColor }}></div>
          <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-sm">
            {data.skills.map((skill, index) => (
              <div key={index} className="text-gray-700">{skill}</div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {Array.isArray(data.experience) && data.experience.length > 0 && (
        <section className="mb-6">
          <div className="border-t-2 mb-2" style={{ borderColor: accentColor }}></div>
          <h2 className="text-sm font-bold mb-2 tracking-wide" style={{ color: accentColor }}>
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="border-t-2 mb-3" style={{ borderColor: accentColor }}></div>

          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">
                    {exp.position}{exp.company && `, ${exp.company}`}
                  </h3>
                  <span className="text-sm text-gray-700 font-semibold whitespace-nowrap ml-4">
                    {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                {exp.description && (
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    {exp.description
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, i) => <li key={i}>{line.trim().replace(/^[•\-]\s*/, "")}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {Array.isArray(data.project) && data.project.length > 0 && (
        <section className="mb-6">
          <div className="border-t-2 mb-2" style={{ borderColor: accentColor }}></div>
          <h2 className="text-sm font-bold mb-2 tracking-wide" style={{ color: accentColor }}>
            PROJECTS
          </h2>
          <div className="border-t-2 mb-3" style={{ borderColor: accentColor }}></div>

          <div className="space-y-3">
            {data.project.map((proj, index) => (
              <div key={index}>
                <h3 className="font-bold text-gray-900 text-sm">{proj.name}</h3>
                <p className="text-gray-700 text-sm">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {Array.isArray(data.education) && data.education.length > 0 && (
        <section className="mb-6">
          <div className="border-t-2 mb-2" style={{ borderColor: accentColor }}></div>
          <h2 className="text-sm font-bold mb-2 tracking-wide" style={{ color: accentColor }}>
            EDUCATION
          </h2>
          <div className="border-t-2 mb-3" style={{ borderColor: accentColor }}></div>

          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <span className="text-sm text-gray-700 font-semibold whitespace-nowrap ml-4">
                    {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "Present" : formatDate(edu.end_date)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{edu.institution}</p>
                {(edu.additional_info || edu.gpa) && (
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700 mt-1">
                    {edu.additional_info &&
                      edu.additional_info
                        .split("\n")
                        .filter((line) => line.trim())
                        .map((line, i) => <li key={i}>{line.trim().replace(/^[•\-]\s*/, "")}</li>)
                    }
                    {edu.gpa && <li>GPA: {edu.gpa}</li>}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Additional Info */}
      {data.additional_info && (
        (data.additional_info.certifications || data.additional_info.languages || data.additional_info.interests) && (
          <section className="mb-6">
            <div className="border-t-2 mb-2" style={{ borderColor: accentColor }}></div>
            <h2 className="text-sm font-bold mb-2 tracking-wide" style={{ color: accentColor }}>
              ADDITIONAL INFORMATION
            </h2>
            <div className="border-t-2 mb-3" style={{ borderColor: accentColor }}></div>
            <div className="space-y-2 text-sm text-gray-700">
              {data.additional_info.certifications && (
                <div>
                  <span className="font-bold">Certifications:</span> {data.additional_info.certifications}
                </div>
              )}
              {data.additional_info.languages && (
                <div>
                  <span className="font-bold">Languages:</span> {data.additional_info.languages}
                </div>
              )}
              {data.additional_info.interests && (
                <div>
                  <span className="font-bold">Interests:</span> {data.additional_info.interests}
                </div>
              )}
            </div>
          </section>
        )
      )}
    </div>
  );
};

export default GeometricBlueTemplate;
