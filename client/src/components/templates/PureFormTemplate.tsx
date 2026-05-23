import React from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface PureFormTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const PureFormTemplate: React.FC<PureFormTemplateProps> = ({ data, accentColor }) => {
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
    <>
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto p-12 bg-white text-gray-800">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 tracking-wide" style={{ color: accentColor }}>
            {data.personal_info?.full_name?.toUpperCase() || "YOUR NAME"}
          </h1>
          <h2 className="text-lg mb-6 text-gray-700">
            {data.personal_info?.title || "Your Title"}
          </h2>
          
          <div className="flex justify-center items-center gap-6 text-sm text-gray-700 flex-wrap">
            {data.personal_info?.phone && (
              <div className="flex items-center gap-2">
                <i className="fas fa-phone"></i>
                <span>{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.location && (
              <div className="flex items-center gap-2">
                <i className="fas fa-map-marker-alt"></i>
                <span>{data.personal_info.location}</span>
              </div>
            )}
            {data.personal_info?.website && (
              <div className="flex items-center gap-2">
                <i className="fas fa-globe"></i>
                <span>{data.personal_info.website}</span>
              </div>
            )}
            {data.personal_info?.email && (
              <div className="flex items-center gap-2">
                <i className="fas fa-envelope"></i>
                <span>{data.personal_info.email}</span>
              </div>
            )}
          </div>
        </header>

        {/* About Me / Summary */}
        {data.professional_summary && (
          <section className="mb-8">
            <div 
              className="text-center py-3 mb-4" 
              style={{ 
                backgroundColor: accentColor,
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact'
              }}
            >
              <h2 className="text-white font-bold italic tracking-wider">ABOUT ME</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-700 text-justify">
              {data.professional_summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <div 
              className="text-center py-3 mb-4" 
              style={{ 
                backgroundColor: accentColor,
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact'
              }}
            >
              <h2 className="text-white font-bold italic tracking-wider">WORK EXPERIENCE</h2>
            </div>

            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900" style={{ color: accentColor }}>
                      {exp.company && `${exp.company} - `}{exp.position}
                    </h3>
                    <span className="text-sm font-bold text-gray-900 whitespace-nowrap ml-4">
                      {formatDate(exp.start_date).toUpperCase()}-
                      {isCurrentlyWorking(exp) ? "NOW" : formatDate(exp.end_date).toUpperCase()}
                    </span>
                  </div>

                  {/* ✅ CHANGED: replaced inline ul logic with renderBullets */}
                  <div className="ml-2 mt-1">
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
            <div 
              className="text-center py-3 mb-4" 
              style={{ 
                backgroundColor: accentColor,
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact'
              }}
            >
              <h2 className="text-white font-bold italic tracking-wider">EDUCATION</h2>
            </div>

            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900" style={{ color: accentColor }}>
                      {edu.institution?.toUpperCase()}
                    </h3>
                    <span className="text-sm text-gray-900 whitespace-nowrap ml-4">
                      {edu.start_date && formatDate(edu.start_date)}-
                      {isCurrentlyStudying(edu) ? "Present" : edu.end_date ? formatDate(edu.end_date) : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </p>
                  {(edu.additional_info || edu.gpa) && (
                    <div className="text-sm text-gray-700 mt-1">
                      {edu.additional_info && <p>{edu.additional_info}</p>}
                      {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-8">
            <div 
              className="text-center py-3 mb-4" 
              style={{ 
                backgroundColor: accentColor,
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact'
              }}
            >
              <h2 className="text-white font-bold italic tracking-wider">SKILL</h2>
            </div>
            <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-sm">
              {data.skills.map((skill, index) => (
                <div key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span className="text-gray-700">{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-8">
            <div 
              className="text-center py-3 mb-4" 
              style={{ 
                backgroundColor: accentColor,
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact'
              }}
            >
              <h2 className="text-white font-bold italic tracking-wider">PROJECTS</h2>
            </div>

            <div className="space-y-4">
              {data.projects.map((proj, index) => (
                <div key={index}>
                  <h3 className="font-bold text-gray-900 mb-1" style={{ color: accentColor }}>
                    {proj.name}
                  </h3>
                  {/* ✅ CHANGED: replaced <p> with renderBullets */}
                  <div className="ml-2">
                    {renderBullets(proj.description, "inherit")}
                  </div>
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
              <div 
                className="text-center py-3 mb-4" 
                style={{ 
                  backgroundColor: accentColor,
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact'
                }}
              >
                <h2 className="text-white font-bold italic tracking-wider">ADDITIONAL INFORMATION</h2>
              </div>
              {/* ✅ CHANGED: replaced inline text with renderBrList */}
              <div className="space-y-2 text-sm text-gray-700">
                {data.additional_info.certifications && (
                  <div>
                    <span className="font-bold">Certifications: </span>
                    {renderBrList(data.additional_info.certifications, "inherit")}
                  </div>
                )}
                {data.additional_info.languages && (
                  <div>
                    <span className="font-bold">Languages: </span>
                    {renderBrList(data.additional_info.languages, "inherit")}
                  </div>
                )}
                {data.additional_info.interests && (
                  <div>
                    <span className="font-bold">Interests: </span>
                    {renderBrList(data.additional_info.interests, "inherit")}
                  </div>
                )}
              </div>
            </section>
          )}
      </div>
    </>
  );
};

export default PureFormTemplate;