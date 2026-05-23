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

interface SoftMinimalTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const SoftMinimalTemplate: React.FC<SoftMinimalTemplateProps> = ({ data, accentColor }) => {
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
      {/* Header with Profile Image */}
      <header className="mb-8 relative">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-2 text-gray-900">
              {data.personal_info?.full_name || "Your Name"}
            </h1>
            <h2 className="text-xl text-gray-600 mb-4">
              {data.personal_info?.title || "Your Title"}
            </h2>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              {data.personal_info?.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-lg" style={{ color: accentColor }}>📞</span>
                  <span>{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-center gap-2">
                  <span className="text-lg" style={{ color: accentColor }}>📍</span>
                  <span>{data.personal_info.location}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-center gap-2">
                  <span className="text-lg" style={{ color: accentColor }}>✉️</span>
                  <span>{data.personal_info.email}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Profile image placeholder */}
          <div className="ml-8">
            <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-gray-300"></div>
          </div>
        </div>
        
        <div className="mt-6 h-1" style={{ backgroundColor: accentColor }}></div>
      </header>

      {/* About Me / Summary */}
      {data.professional_summary && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3" style={{ color: accentColor }}>ABOUT ME</h2>
          <p className="text-sm text-gray-700 leading-relaxed text-justify">
            {data.professional_summary}
          </p>
          <div className="mt-4 h-1" style={{ backgroundColor: accentColor }}></div>
        </section>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-1 space-y-8">
          {/* Education */}
          {Array.isArray(data.education) && data.education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>EDUCATION</h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="relative pl-4 border-l-2 border-gray-400">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                    <h3 className="font-bold text-sm text-gray-900">
                      {edu.institution || "University Name"}
                    </h3>
                    <p className="text-xs text-gray-600 mb-1">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "Present" : formatDate(edu.end_date)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {Array.isArray(data.skills) && data.skills.length > 0 && (
            <section>
              <div className="h-1 mb-4" style={{ backgroundColor: accentColor }}></div>
              <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>SKILL</h2>
              <ul className="space-y-2">
                {data.skills.map((skill, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Additional Info - Reference section */}
          {data.additional_info && (
            (data.additional_info.certifications || data.additional_info.languages || data.additional_info.interests) && (
              <section>
                <div className="h-1 bg-gray-300 mb-4"></div>
                <h2 className="text-xl font-bold mb-4 text-gray-900">REFERENCE</h2>
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

        {/* Right Column */}
        <div className="col-span-2 space-y-8">
          {/* Work Experience */}
          {Array.isArray(data.experience) && data.experience.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>WORK EXPERIENCE</h2>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-4 border-l-2 border-gray-400">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-sm text-gray-900">
                        {exp.company} - {exp.position}
                      </h3>
                      <span className="text-sm font-bold text-gray-900 whitespace-nowrap ml-4">
                        {formatDate(exp.start_date)}-{isCurrentlyWorking(exp) ? "NOW" : formatDate(exp.end_date).split(' ')[1]}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-gray-700 text-justify leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects - Achievement section */}
          {Array.isArray(data.project) && data.project.length > 0 && (
            <section>
              <div className="h-1 bg-gray-300 mb-4"></div>
              <h2 className="text-xl font-bold mb-4 text-gray-900">ACHIEVEMENT</h2>
              <div className="grid grid-cols-2 gap-6">
                {data.project.map((proj, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-sm text-gray-900 mb-1">
                      {proj.name || "Project Name"}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {proj.type || "Project Type"}
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {proj.description || "Project description goes here."}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoftMinimalTemplate;