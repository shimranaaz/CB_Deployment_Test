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

interface ModernSidebarTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const ModernSidebarTemplate: React.FC<ModernSidebarTemplateProps> = ({ data, accentColor }) => {
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
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-80 text-white p-8 flex-shrink-0" style={{ backgroundColor: accentColor || '#374151' }}>
        {/* Profile Photo */}
        <div className="mb-8">
          {data.personal_info?.image ? (
            <div className="w-48 h-48 rounded-full mx-auto overflow-hidden bg-white">
              <img
                src={typeof data.personal_info.image === 'string' 
                  ? data.personal_info.image 
                  : URL.createObjectURL(data.personal_info.image)}
                alt={data.personal_info?.full_name || "Profile"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-300 mx-auto overflow-hidden flex items-center justify-center">
              <span className="text-gray-500 text-sm">Photo</span>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 tracking-wide">CONTACT ME</h2>
          <div className="space-y-3 text-sm">
            {data.personal_info?.phone && (
              <div className="flex items-start gap-2">
                <span>📞</span>
                <span>{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.email && (
              <div className="flex items-start gap-2">
                <span>✉️</span>
                <span className="break-words">{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info?.website && (
              <div className="flex items-start gap-2">
                <span>🌐</span>
                <span className="break-words">{data.personal_info.website}</span>
              </div>
            )}
            {data.personal_info?.location && (
              <div className="flex items-start gap-2">
                <span>📍</span>
                <span>{data.personal_info.location}</span>
              </div>
            )}
          </div>
        </section>

        {/* Education */}
        {Array.isArray(data.education) && data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 tracking-wide">EDUCATION</h2>
            <div className="space-y-4 text-sm">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-bold mb-1">
                    {edu.degree} {edu.field && `of ${edu.field}`}
                  </h3>
                  <p className="font-semibold mb-1">{edu.institution}</p>
                  <p className="text-gray-300">
                    {edu.start_date && formatDate(edu.start_date).split(" ")[1]}
                    {edu.start_date && " - "}
                    {isCurrentlyStudying(edu) 
                      ? "Present" 
                      : edu.end_date ? formatDate(edu.end_date).split(" ")[1] : ""}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {Array.isArray(data.skills) && data.skills.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 tracking-wide">SKILLS</h2>
            <ul className="space-y-2 text-sm">
              {data.skills.map((skill, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-xs">●</span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 bg-gray-50">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-5xl font-bold mb-2 uppercase tracking-wider">
            {data.personal_info?.full_name?.split(" ")[0] || "FIRST"}
          </h1>
          <h1 className="text-5xl font-light mb-4 uppercase tracking-wider text-gray-600">
            {data.personal_info?.full_name?.split(" ").slice(1).join(" ") || "LAST"}
          </h1>
          <h2 className="text-xl text-gray-700 tracking-wide">
            {data.personal_info?.title || "Your Title"}
          </h2>
        </header>

        {/* Professional Summary */}
        {data.professional_summary && (
          <section className="mb-10">
            <p className="text-gray-700 leading-relaxed">{data.professional_summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {Array.isArray(data.experience) && data.experience.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide pb-2 border-b-2 border-gray-300">
              WORK EXPERIENCE
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{exp.position}</h3>
                    <span className="text-gray-600 font-semibold whitespace-nowrap ml-4">
                      {formatDate(exp.start_date).split(" ")[1]} - {" "}
                      {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date).split(" ")[1]}
                    </span>
                  </div>
                  {exp.company && (
                    <p className="font-semibold text-gray-700 mb-2">{exp.company}</p>
                  )}
                  {exp.description && (
                    <p className="text-gray-700 text-justify leading-relaxed">
                      {exp.description.split("\n").filter(line => line.trim()).join(" ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {Array.isArray(data.project) && data.project.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide pb-2 border-b-2 border-gray-300">
              PROJECTS
            </h2>
            <div className="space-y-4">
              {data.project.map((proj, index) => (
                <div key={index}>
                  <h3 className="font-bold text-lg mb-1">{proj.name}</h3>
                  <p className="text-gray-700">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Additional Info */}
        {data.additional_info && 
          (data.additional_info.certifications || 
           data.additional_info.languages || 
           data.additional_info.interests) && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide pb-2 border-b-2 border-gray-300">
              ADDITIONAL INFORMATION
            </h2>
            {data.additional_info.certifications && (
              <div className="mb-3">
                <span className="font-bold">Certifications:</span>{" "}
                <span className="text-gray-700">{data.additional_info.certifications}</span>
              </div>
            )}
            {data.additional_info.languages && (
              <div className="mb-3">
                <span className="font-bold">Languages:</span>{" "}
                <span className="text-gray-700">{data.additional_info.languages}</span>
              </div>
            )}
            {data.additional_info.interests && (
              <div>
                <span className="font-bold">Interests:</span>{" "}
                <span className="text-gray-700">{data.additional_info.interests}</span>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default ModernSidebarTemplate;