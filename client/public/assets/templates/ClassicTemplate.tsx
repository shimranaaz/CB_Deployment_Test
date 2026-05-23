import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
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
  field?: string;
  start_date: string;
  end_date?: string;
  gpa?: string;
  is_current?: boolean;
  graduation_date?: string;
  additional_info?: string;
}

interface Project {
  name: string;
  type: string;
  description: string;
}

interface ResumeData {
  personal_info?: PersonalInfo;
  professional_summary?: string;
  experience?: Experience[];
  education?: Education[];
  project?: Project[];
  skills?: string[];
  additional_info?: {
    certifications?: string;
    languages?: string;
    interests?: string;
  };
  [key: string]: any;
}

interface ClassicTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data, accentColor }) => {
  // --- FIXED DATE FUNCTION ---
  const formatDate = (dateStr: string): string => {
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
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800 leading-relaxed">
      {/* Header */}
      <header className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: accentColor }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: accentColor }}>
          {data.personal_info?.full_name || "Your Name"}
        </h1>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {data.personal_info?.email && (
            <div className="flex items-center gap-1">
              <Mail className="size-4" />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="size-4" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="size-4" />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="size-4" />
              <span className="break-all">{data.personal_info.linkedin}</span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-1">
              <Globe className="size-4" />
              <span className="break-all">{data.personal_info.website}</span>
            </div>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {data.professional_summary && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3" style={{ color: accentColor }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.professional_summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
            PROFESSIONAL EXPERIENCE
          </h2>

          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-3 pl-4" style={{ borderColor: accentColor }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>
                      {formatDate(exp.start_date)} -{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </p>
                  </div>
                </div>
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
      {data.project && data.project.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
            PROJECTS
          </h2>

          <ul className="space-y-3">
            {data.project.map((proj, index) => (
              <div
                key={index}
                className="flex justify-between items-start border-l-3 border-gray-300 pl-6"
              >
                <div>
                  <li className="font-semibold text-gray-800">{proj.name}</li>
                  <p className="text-gray-600">{proj.description}</p>
                </div>
              </div>
            ))}
          </ul>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
            EDUCATION
          </h2>

          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-gray-700">{edu.institution}</p>
                  {(edu.additional_info || edu.gpa) && (
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
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
                <div className="text-sm text-gray-600 whitespace-nowrap ml-4">
                  <p>
                    {edu.start_date && formatDate(edu.start_date)}
                    {edu.start_date && " - "}
                    {isCurrentlyStudying(edu) ? "Present" : edu.end_date ? formatDate(edu.end_date) : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
            CORE SKILLS
          </h2>

          <div className="flex gap-4 flex-wrap">
            {data.skills.map((skill, index) => (
              <div key={index} className="text-gray-700">
                • {skill}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;