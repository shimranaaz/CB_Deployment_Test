import React from "react";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface ResumeData {
  personal_info?: {
    full_name?: string;
    title?: string;
    location?: string;
    phone?: string;
    email?: string;
    website?: string;
    photo?: string;
  };
  professional_summary?: string;
  skills?: string[];
  experience?: Experience[];
  projects?: Project[];
  education?: Education[];
  additional_info?: {
    certifications?: string;
    languages?: string;
    interests?: string;
    awards?: string;
  };
}

interface Experience {
  position: string;
  company?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
}

interface Project {
  name: string;
  description?: string;
}

interface Education {
  degree: string;
  field?: string;
  institution: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  additional_info?: string;
  gpa?: string;
}

interface GeometricTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const GeometricTemplate: React.FC<GeometricTemplateProps> = ({ data, accentColor }) => {
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
    <div className="min-h-screen bg-white">
      <style>
        {`
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .geometric-header {
              background: linear-gradient(135deg, ${accentColor || '#5b8fb9'} 0%, ${accentColor || '#5b8fb9'}dd 100%) !important;
            }
            .geometric-accent {
              color: ${accentColor || '#5b8fb9'} !important;
            }
            .geometric-divider-line {
              background-color: ${accentColor || '#5b8fb9'} !important;
            }
            .geometric-circle {
              border-color: ${accentColor || '#5b8fb9'} !important;
            }
            .geometric-underline {
              background-color: ${accentColor || '#5b8fb9'} !important;
            }
            .geometric-bullet {
              color: ${accentColor || '#5b8fb9'} !important;
            }
            .geometric-timeline-dot {
              border-color: ${accentColor || '#5b8fb9'} !important;
            }
            .geometric-date {
              color: ${accentColor || '#5b8fb9'} !important;
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
                  <Phone size={16} className="mt-0.5 flex-shrink-0" style={{ color: accentColor || '#5b8fb9' }} />
                  <span>{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-start gap-3">
                  <Mail size={16} className="mt-0.5 flex-shrink-0" style={{ color: accentColor || '#5b8fb9' }} />
                  <span className="break-words">{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: accentColor || '#5b8fb9' }} />
                  <span>{data.personal_info.location}</span>
                </div>
              )}
              {data.personal_info?.website && (
                <div className="flex items-start gap-3">
                  <Globe size={16} className="mt-0.5 flex-shrink-0" style={{ color: accentColor || '#5b8fb9' }} />
                  <span className="break-words">{data.personal_info.website}</span>
                </div>
              )}
            </div>
          </section>

          {/* Divider with circle */}
          <div className="relative flex items-center justify-center my-8">
            <div
              className="geometric-divider-line absolute left-0 right-0 h-px"
              style={{ backgroundColor: accentColor || '#5b8fb9', opacity: 0.3 }}
            ></div>
            <div
              className="geometric-circle relative w-3 h-3 rounded-full bg-white border-2 z-10"
              style={{ borderColor: accentColor || '#5b8fb9' }}
            ></div>
          </div>

          {/* Education Section */}
          {data.education && data.education.length > 0 && (
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
          <div className="relative flex items-center justify-center my-8">
            <div
              className="geometric-divider-line absolute left-0 right-0 h-px"
              style={{ backgroundColor: accentColor || '#5b8fb9', opacity: 0.3 }}
            ></div>
            <div
              className="geometric-circle relative w-3 h-3 rounded-full bg-white border-2 z-10"
              style={{ borderColor: accentColor || '#5b8fb9' }}
            ></div>
          </div>

          {/* Skills Section */}
          {data.skills && data.skills.length > 0 && (
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
                    <span className="geometric-bullet" style={{ color: accentColor || '#5b8fb9' }}>●</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Divider with circle */}
          <div className="relative flex items-center justify-center my-8">
            <div
              className="geometric-divider-line absolute left-0 right-0 h-px"
              style={{ backgroundColor: accentColor || '#5b8fb9', opacity: 0.3 }}
            ></div>
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
              <div className="ml-1">
                {renderBrList(data.additional_info.languages, "inherit")}
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
                  className="geometric-underline absolute bottom-0 left-0 h-1 w-16"
                  style={{ backgroundColor: accentColor || '#5b8fb9' }}
                ></div>
              </h2>
              <p className="text-gray-700 text-justify leading-relaxed">
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* Work Experience Section */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-10">
              <h2
                className="geometric-accent text-2xl font-bold mb-6 tracking-wider uppercase relative pb-3"
                style={{ color: accentColor || '#5b8fb9' }}
              >
                WORK EXPERIENCE
                <div
                  className="geometric-underline absolute bottom-0 left-0 h-1 w-16"
                  style={{ backgroundColor: accentColor || '#5b8fb9' }}
                ></div>
              </h2>
              <div className="space-y-8">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-gray-200">
                    <div
                      className="geometric-timeline-dot absolute -left-2 top-0 w-4 h-4 rounded-full border-2 bg-white"
                      style={{ borderColor: accentColor || '#5b8fb9' }}
                    ></div>

                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{exp.company}</h3>
                        <p className="font-semibold text-gray-700">{exp.position}</p>
                      </div>
                      <span
                        className="geometric-date text-sm font-semibold whitespace-nowrap ml-4"
                        style={{ color: accentColor || '#5b8fb9' }}
                      >
                        {formatDate(exp.start_date).split(" ")[1]} -{" "}
                        {isCurrentlyWorking(exp) ? "PRESENT" : formatDate(exp.end_date).split(" ")[1]}
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

          {/* Projects Section */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-10">
              <h2
                className="geometric-accent text-2xl font-bold mb-6 tracking-wider uppercase relative pb-3"
                style={{ color: accentColor || '#5b8fb9' }}
              >
                PROJECTS
                <div
                  className="geometric-underline absolute bottom-0 left-0 h-1 w-16"
                  style={{ backgroundColor: accentColor || '#5b8fb9' }}
                ></div>
              </h2>
              <div className="space-y-6">
                {data.projects.map((proj, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{proj.name}</h3>
                    <div className="ml-5 mt-2">
                      {renderBullets(proj.description, "inherit")}
                    </div>
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
                  className="geometric-underline absolute bottom-0 left-0 h-1 w-16"
                  style={{ backgroundColor: accentColor || '#5b8fb9' }}
                ></div>
              </h2>
              {data.additional_info.certifications && (
                <div className="flex gap-2 mb-4">
                  <span className="font-bold text-gray-900">Certifications:</span>
                  {renderBrList(data.additional_info.certifications, "inherit")}
                </div>
              )}
              {data.additional_info.interests && (
                <div className="flex gap-2">
                  <span className="font-bold text-gray-900">Interests:</span>
                  {renderBrList(data.additional_info.interests, "inherit")}
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