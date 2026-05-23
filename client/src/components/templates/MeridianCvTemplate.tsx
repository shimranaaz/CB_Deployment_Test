import React, { useState } from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface MeridianCvTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const MeridianCvTemplate: React.FC<MeridianCvTemplateProps> = ({ data, accentColor }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [skillLevels, setSkillLevels] = useState<{ [key: string]: number }>({});

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    return year.toString();
  };

  const isCurrentlyWorking = (exp: Experience): boolean => {
    return exp.is_current || !exp.end_date;
  };

  const isCurrentlyStudying = (edu: Education): boolean => {
    return edu.is_current || !edu.end_date;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSkillLevel = (skillName: string): number => {
    return skillLevels[skillName] ?? 71;
  };

  const handleDotClick = (skillName: string, dotIndex: number) => {
    const newLevel = Math.round(((dotIndex + 1) / 7) * 100);
    setSkillLevels({ ...skillLevels, [skillName]: newLevel });
  };

  const renderSkillLevel = (skillName: string) => {
    const percentage = getSkillLevel(skillName);
    const filledDots = Math.round((percentage / 100) * 7);

    return (
      <div className="relative group">
        <div className="flex gap-1 mt-1">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              onClick={() => handleDotClick(skillName, i)}
              className="w-3 h-3 rounded-full cursor-pointer transition-transform hover:scale-125"
              style={{
                backgroundColor: i < filledDots ? accentColor : "#d1d5db",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
              }}
            />
          ))}
        </div>
        <div className="absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {percentage}%
        </div>
      </div>
    );
  };

  const renderSectionHeader = (icon: string, title: string) => (
    <div
      className="inline-block py-2 px-6 rounded-full mb-4"
      style={{
        backgroundColor: accentColor,
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      <div className="flex items-center gap-2 text-white">
        <i className={`${icon} text-lg`}></i>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
    </div>
  );

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

      <div className="flex max-w-5xl mx-auto bg-white text-gray-800 min-h-screen">
        {/* Left Column */}
        <div className="w-2/5 bg-gray-50 p-8">
          {/* Profile Photo */}
          <div className="mb-8">
            <div className="relative w-52 h-52 mx-auto bg-white shadow-lg">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-50 transition-colors">
                  <i className="fas fa-user text-6xl text-gray-300 mb-4"></i>
                  <span className="text-sm text-gray-500 text-center px-4">
                    Click to upload photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Name and Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-3">
              {data.personal_info?.full_name?.toUpperCase() || "YOUR NAME"}
            </h1>
            <p className="text-sm italic">{data.personal_info?.title || "Designation"}</p>
          </div>

          {/* Contact Section */}
          <div
            className="mb-8 py-3 px-4 rounded-full"
            style={{
              backgroundColor: accentColor,
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            <div className="flex items-center gap-2 text-white">
              <i className="fas fa-address-book text-xl"></i>
              <h2 className="text-lg font-semibold">Contact</h2>
            </div>
          </div>

          <div className="space-y-4 mb-8 pl-4">
            {data.personal_info?.location && (
              <div className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt text-xl mt-1"></i>
                <span className="text-sm">{data.personal_info.location}</span>
              </div>
            )}
            {data.personal_info?.phone && (
              <div className="flex items-start gap-3">
                <i className="fas fa-phone text-xl mt-1"></i>
                <span className="text-sm">{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.website && (
              <div className="flex items-start gap-3">
                <i className="fas fa-laptop text-xl mt-1"></i>
                <span className="text-sm">{data.personal_info.website}</span>
              </div>
            )}
            {data.personal_info?.email && (
              <div className="flex items-start gap-3">
                <i className="fas fa-envelope text-xl mt-1"></i>
                <span className="text-sm">{data.personal_info.email}</span>
              </div>
            )}
          </div>

          {/* Skills Section */}
          {data.skills && data.skills.length > 0 && (
            <>
              <div
                className="mb-6 py-3 px-4 rounded-full"
                style={{
                  backgroundColor: accentColor,
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                <div className="flex items-center gap-2 text-white">
                  <i className="fas fa-cog text-xl"></i>
                  <h2 className="text-lg font-semibold">Skills</h2>
                </div>
              </div>

              <div className="space-y-4 pl-4">
                {data.skills.map((skill, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-base mb-1">{skill}</h3>
                    {renderSkillLevel(skill)}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Languages Section */}
          {data.additional_info?.languages && (
            <div className="mt-8">
              <div
                className="mb-4 py-3 px-4 rounded-full"
                style={{
                  backgroundColor: accentColor,
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                <div className="flex items-center gap-2 text-white">
                  <i className="fas fa-language text-xl"></i>
                  <h2 className="text-lg font-semibold">Languages</h2>
                </div>
              </div>
              <div className="pl-4 ml-1">
                {renderBrList(data.additional_info.languages, "inherit")}
              </div>
            </div>
          )}

          {/* Certifications Section */}
          {data.additional_info?.certifications && (
            <div className="mt-8">
              <div
                className="mb-4 py-3 px-4 rounded-full"
                style={{
                  backgroundColor: accentColor,
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                <div className="flex items-center gap-2 text-white">
                  <i className="fas fa-certificate text-xl"></i>
                  <h2 className="text-lg font-semibold">Certifications</h2>
                </div>
              </div>
              <div className="pl-4 ml-1">
                {renderBrList(data.additional_info.certifications, "inherit")}
              </div>
            </div>
          )}

          {/* Interests Section */}
          {data.additional_info?.interests && (
            <div className="mt-8">
              <div
                className="mb-4 py-3 px-4 rounded-full"
                style={{
                  backgroundColor: accentColor,
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                <div className="flex items-center gap-2 text-white">
                  <i className="fas fa-heart text-xl"></i>
                  <h2 className="text-lg font-semibold">Interests</h2>
                </div>
              </div>
              <div className="pl-4 ml-1">
                {renderBrList(data.additional_info.interests, "inherit")}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="w-3/5 p-8 pl-12">
          {/* About Me */}
          {data.professional_summary && (
            <section className="mb-10">
              {renderSectionHeader("fas fa-user", "About Me")}
              <p className="text-sm leading-relaxed text-gray-700">
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section className="mb-10">
              {renderSectionHeader("fas fa-graduation-cap", "Education")}
              <div className="relative border-l-2 border-gray-800 ml-3 space-y-8">
                {data.education.map((edu, index) => (
                  <div key={index} className="relative pl-8">
                    <div
                      className="absolute -left-2 top-0 w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: accentColor,
                        WebkitPrintColorAdjust: "exact",
                        printColorAdjust: "exact",
                      }}
                    ></div>
                    <h3 className="font-bold text-base mb-1">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "Present" : formatDate(edu.end_date)}
                    </p>
                    <p className="text-sm italic text-gray-700">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Work Experience */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-10">
              {renderSectionHeader("fas fa-briefcase", "Work Experience")}
              <div className="relative border-l-2 border-gray-800 ml-3 space-y-8">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-8">
                    <div
                      className="absolute -left-2 top-0 w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: accentColor,
                        WebkitPrintColorAdjust: "exact",
                        printColorAdjust: "exact",
                      }}
                    ></div>
                    <h3 className="font-bold text-base mb-1">{exp.company || "Company Name"}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {formatDate(exp.start_date)}-{isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                    </p>
                    <h4 className="font-semibold text-base mb-2">{exp.position}</h4>
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
            <section className="mb-10">
              {renderSectionHeader("fas fa-project-diagram", "Projects")}
              <div className="space-y-4">
                {data.projects.map((proj, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-base mb-1">{proj.name}</h3>
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

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </>
  );
};

export default MeridianCvTemplate;