import React from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets } from "@/utils/resumeHelpers";

interface PixelAuraProps {
  data: ResumeData;
  accentColor: string;
}

const PixelAura: React.FC<PixelAuraProps> = ({ data, accentColor }) => {
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";

    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    const month = parts[1] ? parseInt(parts[1]) - 1 : 0;

    const date = new Date(year, month);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
    });
  };

  const isCurrentlyWorking = (exp: Experience): boolean => {
    return exp.is_current || !exp.end_date;
  };

  const isCurrentlyStudying = (edu: Education): boolean => {
    return edu.is_current || !edu.end_date;
  };

  return (
    <div 
      className="max-w-4xl mx-auto bg-white text-gray-900" 
      style={{ colorAdjust: 'exact', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
    >
      {/* Header */}
      <header className="p-8 pb-6">
   <h1 className="text-5xl font-bold mb-2" style={{ color: accentColor }}>
  <span className="font-black">{data.personal_info?.full_name?.split(' ')[0] || "FIRST"}</span>{" "}
  <span className="font-light">{data.personal_info?.full_name?.split(' ').slice(1).join(' ') || "LAST"}</span>
</h1>
        <h2 className="text-xl font-normal tracking-wide mb-6">
          {data.personal_info?.title?.toUpperCase() || "YOUR TITLE"}
        </h2>
      </header>

      <div className="grid grid-cols-3 gap-8 px-8 pb-8">
        {/* Left Column */}
        <div className="col-span-1 space-y-6">
          {/* Contact */}
          <section>
            <h3 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ borderColor: accentColor, color: accentColor }}>CONTACT</h3>
            <div className="space-y-2 text-sm">
              {data.personal_info?.phone && (
                <div className="flex items-start gap-2">
                  <i className="fas fa-phone mt-1 w-4" style={{ color: accentColor }}></i>
                  <span>{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-start gap-2">
                  <i className="fas fa-envelope mt-1 w-4" style={{ color: accentColor }}></i>
                  <span className="break-all">{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-start gap-2">
                  <i className="fas fa-map-marker-alt mt-1 w-4" style={{ color: accentColor }}></i>
                  <span>{data.personal_info.location}</span>
                </div>
              )}
              {data.personal_info?.website && (
                <div className="flex items-start gap-2">
                  <i className="fas fa-globe mt-1 w-4" style={{ color: accentColor }}></i>
                  <span className="break-all">{data.personal_info.website}</span>
                </div>
              )}
            </div>
          </section>

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ borderColor: accentColor, color: accentColor }}>EDUCATION</h3>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-bold mb-1 flex items-start gap-2" style={{ color: accentColor }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }}></span>
                      <span>
                        {edu.start_date && formatDate(edu.start_date)}
                        {edu.start_date && " - "}
                        {isCurrentlyStudying(edu) ? "Present" : edu.end_date ? formatDate(edu.end_date) : ""}
                      </span>
                    </p>
                    <p className="font-bold uppercase mb-1">{edu.institution}</p>
                    <p className="mb-1">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </p>
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    {edu.additional_info && (
                      <ul className="list-disc ml-4 mt-1 space-y-1">
                        {edu.additional_info
                          .split("\n")
                          .filter((line) => line.trim())
                          .map((line, i) => (
                            <li key={i}>{line.trim().replace(/^[•\-]\s*/, "")}</li>
                          ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ borderColor: accentColor, color: accentColor }}>SKILLS</h3>
              <ul className="space-y-1 text-sm">
                {data.skills.map((skill, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }}></span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages */}
          {data.additional_info?.languages && (
            <section>
              <h3 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ borderColor: accentColor, color: accentColor }}>LANGUAGES</h3>
              <ul className="space-y-1 text-sm">
                {data.additional_info.languages.split(',').map((lang, index) => (
                  <li key={index}>{lang.trim()}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Additional Info */}
          {(data.additional_info?.certifications || data.additional_info?.interests) && (
            <section>
              <h3 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ borderColor: accentColor, color: accentColor }}>ADDITIONAL</h3>
              <div className="space-y-2 text-sm">
                {data.additional_info.certifications && (
                  <div>
                    <p className="font-bold mb-1">Certifications:</p>
                    <p>{data.additional_info.certifications}</p>
                  </div>
                )}
                {data.additional_info.interests && (
                  <div>
                    <p className="font-bold mb-1">Interests:</p>
                    <p>{data.additional_info.interests}</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-2 space-y-6">
          {/* Profile/Summary */}
          {data.professional_summary && (
            <section>
              <h3 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ borderColor: accentColor, color: accentColor }}>PROFILE</h3>
              <p className="text-sm text-justify leading-relaxed">{data.professional_summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ borderColor: accentColor, color: accentColor }}>WORK EXPERIENCE</h3>
              
              <div className="relative">
                {/* Timeline line */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-900"
                ></div>

                <div className="space-y-6 pl-6">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="relative">
                      {/* Timeline dot */}
                      <div 
                        className="absolute -left-7 top-0 w-3 h-3 rounded-full border-2 bg-white"
                        style={{ borderColor: accentColor || "#333" }}
                      ></div>

                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-base">{exp.company || "Company Name"}</h4>
                        <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                          {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "PRESENT" : formatDate(exp.end_date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{exp.position}</p>

                      <div className="ml-5 mt-2">
                        {renderBullets(exp.description, "inherit")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ borderColor: accentColor, color: accentColor }}>PROJECTS</h3>
              <div className="space-y-4">
                {data.projects.map((proj, index) => (
                  <div key={index}>
                    <h4 className="font-bold text-base mb-1">{proj.name}</h4>
                    <div className="ml-5 mt-2">
                      {renderBullets(proj.description, "inherit")}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </div>
  );
};

export default PixelAura;