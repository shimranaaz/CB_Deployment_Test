import React, { useState } from "react";
import { Mail, Phone, MapPin, GraduationCap, Briefcase, Award, Upload } from "lucide-react";
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

interface ProfessionalModernProps {
  data: ResumeData;
  accentColor: string;
}

const ProfessionalModernProps: React.FC<ProfessionalModernProps> = ({ data, accentColor }) => {
  const [profileImage, setProfileImage] = useState<string>(data.personal_info?.photo || "");

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

  const triggerFileInput = () => {
    document.getElementById('image-upload')?.click();
  };

  return (
    <>
      <style>{`
  @media print {
    @page {
      size: A4;
      margin: 0;
    }
    
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    body {
      margin: 0 !important;
      padding: 0 !important;
    }
    
    .flex.flex-col.md\\:flex-row {
      min-height: 100vh !important;
      display: flex !important;
      flex-direction: row !important;
      max-width: 100% !important;
      margin: 0 !important;
    }
    
    .prof-modern-sidebar {
      background-color: ${accentColor} !important;
      width: 41.666667% !important;
      flex-shrink: 0 !important;
      padding: 2rem !important;
      page-break-inside: avoid !important;
    }
    
    .w-full.md\\:w-7\\/12 {
      width: 58.333333% !important;
      padding: 2rem !important;
      background-color: #f9fafb !important;
      page-break-inside: avoid !important;
    }
    
    .prof-modern-timeline-dot {
      background-color: ${accentColor} !important;
    }
    
    h1 {
      font-size: 3rem !important;
      line-height: 1.2 !important;
    }
    
    h2 {
      font-size: 1.5rem !important;
      line-height: 1.3 !important;
    }
    
    p, li, span, div {
      font-size: 0.875rem !important;
      line-height: 1.5 !important;
    }
    
    input[type="file"],
    .cursor-pointer {
      cursor: default !important;
    }
    
    img {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
`}</style>
      <div className="flex flex-col md:flex-row max-w-5xl mx-auto bg-white text-gray-800 min-h-screen">
        {/* Left Sidebar */}
        <div className="prof-modern-sidebar w-full md:w-5/12 text-white p-6 md:p-8 relative" style={{ backgroundColor: accentColor }}>
          {/* Profile Image */}
          <div className="mb-6 md:mb-8">
            <div
              onClick={triggerFileInput}
              className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-4 cursor-pointer group"
            >
              {profileImage ? (
                <div className="w-full h-full rounded-sm overflow-hidden">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-white flex flex-col items-center justify-center rounded-sm hover:bg-gray-50 transition-all">
                  <Upload className="w-8 h-8 md:w-12 md:h-12 text-gray-500 mb-2 md:mb-3" strokeWidth={2} />
                  <span className="text-gray-600 text-xs md:text-sm font-semibold">Upload Photo</span>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <Phone className="w-4 h-4 md:w-5 md:h-5 text-white" />
              <h2 className="text-lg md:text-xl font-bold text-white">Contact</h2>
            </div>
            <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
              {data.personal_info?.email && (
                <div className="flex items-start gap-2">
                  <Mail className="w-3 h-3 md:w-4 md:h-4 text-white flex-shrink-0 mt-0.5" />
                  <span className="break-words">{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 md:w-4 md:h-4 text-white flex-shrink-0" />
                  <span>{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4 text-white flex-shrink-0 mt-0.5" />
                  <span>{data.personal_info.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-white" />
                <h2 className="text-lg md:text-xl font-bold text-white">Education</h2>
              </div>
              <div className="space-y-3 md:space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="text-xs md:text-sm">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-white mt-1">●</span>
                      <div>
                        <h3 className="font-bold text-white">{edu.institution}</h3>
                        <p className="italic opacity-90">{edu.degree} {edu.field && `${edu.field}`}</p>
                        <p className="text-xs opacity-75 mt-1">
                          Completed in {edu.end_date ? new Date(edu.end_date).getFullYear() : isCurrentlyStudying(edu) ? "Present" : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-white" />
                <h2 className="text-lg md:text-xl font-bold text-white">Skill</h2>
              </div>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                {data.skills.map((skill, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-xs text-white">●</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Awards */}
          {data.additional_info?.awards && (
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <Award className="w-4 h-4 md:w-5 md:h-5 text-white" />
                <h2 className="text-lg md:text-xl font-bold text-white">Awards</h2>
              </div>
              {renderBrList(data.additional_info.awards, 'white')}
            </div>
          )}

          {/* Languages */}
          {data.additional_info?.languages && (
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-bold text-white">Languages</h2>
              </div>
              {renderBrList(data.additional_info.languages, 'white')}
            </div>
          )}

          {/* Certifications */}
          {data.additional_info?.certifications && (
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-bold text-white">Certifications</h2>
              </div>
              {renderBrList(data.additional_info.certifications, 'white')}
            </div>
          )}

          {/* Interests */}
          {data.additional_info?.interests && (
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-bold text-white">Interests</h2>
              </div>
              {renderBrList(data.additional_info.interests, 'white')}
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="w-full md:w-7/12 p-6 md:p-8 bg-gray-50">
          {/* Header */}
          <header className="mb-6 md:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-gray-900">
              {data.personal_info?.full_name || "Your Name"}
            </h1>
            <h2 className="text-base sm:text-lg md:text-xl text-gray-600 mb-4">
              {data.personal_info?.title || "Your Title"}
            </h2>
          </header>

          {/* Profile/Summary */}
          {data.professional_summary && (
            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-gray-900">Profile</h2>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed text-justify">
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-900">Work Experience</h2>
              <div className="space-y-4 md:space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-4 md:pl-6 border-l-2 border-gray-300">
                    <div
                      className="prof-modern-timeline-dot absolute -left-1.5 md:-left-2 top-0 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 md:border-4 border-white"
                      style={{ backgroundColor: accentColor }}
                    ></div>
                    <div className="text-xs text-gray-500 mb-1">
                      {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mb-1">
                      {exp.company} | {exp.position}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">{exp.position}</h3>
                    {renderBullets(exp.description, '#374151')}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-900">Projects</h2>
              <div className="space-y-3 md:space-y-4">
                {data.projects.map((proj, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-gray-900 text-xs md:text-sm mb-1">{proj.name}</h3>
                    {renderBullets(proj.description, '#374151')}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfessionalModernProps;