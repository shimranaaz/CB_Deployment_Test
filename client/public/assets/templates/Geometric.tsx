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

interface GeometricTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const GeometricTemplate: React.FC<GeometricTemplateProps> = ({ data, accentColor }) => {
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
    <div className="min-h-screen bg-white">
      <style>
        {`
          @media print {
            .geometric-header {
              background: linear-gradient(135deg, ${accentColor || '#5b8fb9'} 0%, ${accentColor || '#5b8fb9'}dd 100%) !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .geometric-accent {
              color: ${accentColor || '#5b8fb9'} !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .geometric-divider::before,
            .geometric-divider::after {
              background-color: ${accentColor || '#5b8fb9'} !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .geometric-circle {
              border-color: ${accentColor || '#5b8fb9'} !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}
      </style>

      {/* Header with geometric design */}
      <header 
        className="geometric-header relative py-16 text-white text-center"
        style={{ 
          background: `linear-gradient(135deg, ${accentColor || '#5b8fb9'} 0%, ${accentColor || '#5b8fb9'}dd 100%)`,
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-32 bg-white/40"></div>
            <div className="w-3 h-3 rounded-full bg-white mx-4"></div>
            <div className="h-px w-32 bg-white/40"></div>
          </div>
          
          <h1 className="text-5xl font-bold tracking-wider mb-2 uppercase">
            {data.personal_info?.full_name || "YOUR NAME"}
          </h1>
          
          <h2 className="text-xl tracking-widest font-light">
            {data.personal_info?.title || "Your Professional Title"}
          </h2>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-0">
        {/* Left Sidebar */}
        <aside className="col-span-1 bg-gray-50 p-8 border-r border-gray-200">
          {/* Contact Section */}
          <section className="mb-8">
            <h2 
              className="geometric-accent text-xl font-bold mb-6 tracking-wider uppercase relative"
              style={{ color: accentColor || '#5b8fb9' }}
            >
              CONTACT
            </h2>
            <div className="space-y-4 text-sm text-gray-700">
              {data.personal_info?.phone && (
                <div className="flex items-start gap-3">
                  <span style={{ color: accentColor || '#5b8fb9' }}>📞</span>
                  <span>{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-start gap-3">
                  <span style={{ color: accentColor || '#5b8fb9' }}>✉️</span>
                  <span className="break-words">{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-start gap-3">
                  <span style={{ color: accentColor || '#5b8fb9' }}>📍</span>
                  <span>{data.personal_info.location}</span>
                </div>
              )}
              {data.personal_info?.website && (
                <div className="flex items-start gap-3">
                  <span style={{ color: accentColor || '#5b8fb9' }}>🌐</span>
                  <span className="break-words">{data.personal_info.website}</span>
                </div>
              )}
            </div>
          </section>

          {/* Divider with circle */}
          <div className="geometric-divider relative flex items-center justify-center my-8">
            <div className="absolute left-0 right-0 h-px" style={{ backgroundColor: accentColor || '#5b8fb9', opacity: 0.3 }}></div>
            <div 
              className="geometric-circle relative w-3 h-3 rounded-full bg-white border-2 z-10"
              style={{ borderColor: accentColor || '#5b8fb9' }}
            ></div>
          </div>

          {/* Education Section */}
          {Array.isArray(data.education) && data.education.length > 0 && (
            <section className="mb-8">
              <h2 
                className="geometric-accent text-xl font-bold mb-6 tracking-wider uppercase"
                style={{ color: accentColor || '#5b8fb9' }}
              >
                EDUCATION
              </h2>
              <div className="space-y-6 text-sm">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-semibold text-gray-800 mb-1">
                      {edu.start_date && formatDate(edu.start_date).split(" ")[1]}
                      {edu.start_date && " - "}
                      {isCurrentlyStudying(edu) 
                        ? "Present" 
                        : edu.end_date ? formatDate(edu.end_date).split(" ")[1] : ""}
                    </p>
                    <h3 className="font-bold text-gray-900 uppercase mb-1">
                      {edu.institution}
                    </h3>
                    <p className="text-gray-700">
                      {edu.degree} {edu.field && `of ${edu.field}`}
                    </p>
                    {edu.gpa && (
                      <p className="text-gray-600 mt-1">GPA: {edu.gpa}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Divider with circle */}
          <div className="geometric-divider relative flex items-center justify-center my-8">
            <div className="absolute left-0 right-0 h-px" style={{ backgroundColor: accentColor || '#5b8fb9', opacity: 0.3 }}></div>
            <div 
              className="geometric-circle relative w-3 h-3 rounded-full bg-white border-2 z-10"
              style={{ borderColor: accentColor || '#5b8fb9' }}
            ></div>
          </div>

          {/* Skills Section */}
          {Array.isArray(data.skills) && data.skills.length > 0 && (
            <section className="mb-8">
              <h2 
                className="geometric-accent text-xl font-bold mb-6 tracking-wider uppercase"
                style={{ color: accentColor || '#5b8fb9' }}
              >
                SKILLS
              </h2>
              <ul className="space-y-2 text-sm text-gray-700">
                {data.skills.map((skill, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span style={{ color: accentColor || '#5b8fb9' }}>●</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Divider with circle */}
          <div className="geometric-divider relative flex items-center justify-center my-8">
            <div className="absolute left-0 right-0 h-px" style={{ backgroundColor: accentColor || '#5b8fb9', opacity: 0.3 }}></div>
            <div 
              className="geometric-circle relative w-3 h-3 rounded-full bg-white border-2 z-10"
              style={{ borderColor: accentColor || '#5b8fb9' }}
            ></div>
          </div>

          {/* Languages Section */}
          {data.additional_info?.languages && (
            <section>
              <h2 
                className="geometric-accent text-xl font-bold mb-6 tracking-wider uppercase"
                style={{ color: accentColor || '#5b8fb9' }}
              >
                LANGUAGES
              </h2>
              <div className="text-sm text-gray-700">
                {data.additional_info.languages.split(',').map((lang, index) => (
                  <div key={index} className="mb-2">
                    <span>{lang.trim()}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* Right Content */}
        <main className="col-span-2 p-8 bg-white">
          {/* Profile Summary Section */}
          {data.professional_summary && (
            <section className="mb-10">
              <h2 
                className="geometric-accent text-2xl font-bold mb-6 tracking-wider uppercase relative pb-3"
                style={{ color: accentColor || '#5b8fb9' }}
              >
                PROFILE SUMMARY
                <div 
                  className="absolute bottom-0 left-0 h-1 w-16" 
                  style={{ backgroundColor: accentColor || '#5b8fb9' }}
                ></div>
              </h2>
              <p className="text-gray-700 text-justify leading-relaxed">
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* Work Experience Section */}
          {Array.isArray(data.experience) && data.experience.length > 0 && (
            <section className="mb-10">
              <h2 
                className="geometric-accent text-2xl font-bold mb-6 tracking-wider uppercase relative pb-3"
                style={{ color: accentColor || '#5b8fb9' }}
              >
                WORK EXPERIENCE
                <div 
                  className="absolute bottom-0 left-0 h-1 w-16" 
                  style={{ backgroundColor: accentColor || '#5b8fb9' }}
                ></div>
              </h2>
              <div className="space-y-8">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-gray-200">
                    <div 
                      className="absolute -left-2 top-0 w-4 h-4 rounded-full border-2 bg-white"
                      style={{ borderColor: accentColor || '#5b8fb9' }}
                    ></div>
                    
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{exp.company}</h3>
                        <p className="font-semibold text-gray-700">{exp.position}</p>
                      </div>
                      <span 
                        className="text-sm font-semibold whitespace-nowrap ml-4"
                        style={{ color: accentColor || '#5b8fb9' }}
                      >
                        {formatDate(exp.start_date).split(" ")[1]} - {" "}
                        {isCurrentlyWorking(exp) ? "PRESENT" : formatDate(exp.end_date).split(" ")[1]}
                      </span>
                    </div>
                    
                    {exp.description && (
                      <div className="text-gray-700 text-justify leading-relaxed">
                        {exp.description.split("\n").map((line, i) => {
                          const trimmedLine = line.trim();
                          if (!trimmedLine) return null;
                          
                          if (trimmedLine.startsWith("•") || trimmedLine.startsWith("-")) {
                            return (
                              <div key={i} className="flex gap-2 mb-2">
                                <span style={{ color: accentColor || '#5b8fb9' }}>●</span>
                                <span>{trimmedLine.substring(1).trim()}</span>
                              </div>
                            );
                          }
                          return <p key={i} className="mb-2">{trimmedLine}</p>;
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {Array.isArray(data.project) && data.project.length > 0 && (
            <section className="mb-10">
              <h2 
                className="geometric-accent text-2xl font-bold mb-6 tracking-wider uppercase relative pb-3"
                style={{ color: accentColor || '#5b8fb9' }}
              >
                PROJECTS
                <div 
                  className="absolute bottom-0 left-0 h-1 w-16" 
                  style={{ backgroundColor: accentColor || '#5b8fb9' }}
                ></div>
              </h2>
              <div className="space-y-6">
                {data.project.map((proj, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{proj.name}</h3>
                    <p className="text-gray-700 text-justify leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Additional Info Section */}
          {data.additional_info && 
            (data.additional_info.certifications || 
             data.additional_info.interests) && (
            <section>
              <h2 
                className="geometric-accent text-2xl font-bold mb-6 tracking-wider uppercase relative pb-3"
                style={{ color: accentColor || '#5b8fb9' }}
              >
                ADDITIONAL INFORMATION
                <div 
                  className="absolute bottom-0 left-0 h-1 w-16" 
                  style={{ backgroundColor: accentColor || '#5b8fb9' }}
                ></div>
              </h2>
              {data.additional_info.certifications && (
                <div className="mb-4">
                  <span className="font-bold text-gray-900">Certifications:</span>{" "}
                  <span className="text-gray-700">{data.additional_info.certifications}</span>
                </div>
              )}
              {data.additional_info.interests && (
                <div>
                  <span className="font-bold text-gray-900">Interests:</span>{" "}
                  <span className="text-gray-700">{data.additional_info.interests}</span>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default GeometricTemplate;