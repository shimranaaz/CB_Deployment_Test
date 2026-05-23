import React from "react";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface ResumeData {
  personal_info?: {
    full_name?: string;
    title?: string;
    location?: string;
    phone?: string;
    email?: string;
    website?: string;
    photo_url?: string;
    image?: string | File;
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

interface ProfessionalResumeTemplateProps {
  data: ResumeData;
  accentColor: string;
  onPhotoUpload?: (base64: string) => void;
}

const ProfessionalResumeTemplate: React.FC<ProfessionalResumeTemplateProps> = ({
  data,
  accentColor,
  onPhotoUpload,
}) => {
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    return year.toString();
  };

  const isCurrentlyWorking = (exp: Experience): boolean => exp.is_current || !exp.end_date;
  const isCurrentlyStudying = (edu: Education): boolean => edu.is_current || !edu.end_date;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onPhotoUpload) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onPhotoUpload(result);
      };
      reader.onerror = () => {
        alert('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const getPhotoUrl = () => {
    if (data.personal_info?.photo_url) return data.personal_info.photo_url;
    if (data.personal_info?.image && typeof data.personal_info.image === 'string') return data.personal_info.image;
    return null;
  };

  const photoUrl = getPhotoUrl();

  return (
    <>
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .prt-left-sidebar {
            background-color: ${accentColor} !important;
          }
          .prt-accent-text {
            color: ${accentColor} !important;
          }
          .prt-accent-bg {
            background-color: ${accentColor} !important;
          }
          .prt-skill-dot {
            background-color: white !important;
          }
          .prt-timeline-line {
            background-color: ${accentColor} !important;
          }
          .prt-timeline-dot {
            background-color: ${accentColor} !important;
          }
          .prt-section-icon {
            color: ${accentColor} !important;
          }
        }
      `}</style>
      <div className="max-w-5xl mx-auto bg-white text-gray-800 shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
        <div className="grid grid-cols-5 gap-0">
          {/* Left Column */}
          <div className="prt-left-sidebar col-span-2 p-8 space-y-8 text-white" style={{ backgroundColor: accentColor }}>
            {/* Photo */}
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-white shadow-lg">
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {onPhotoUpload && (
                <div className="mt-4">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} id="photo-upload" className="hidden" />
                  <label htmlFor="photo-upload" className="px-4 py-2 bg-white text-gray-800 rounded cursor-pointer hover:bg-gray-100 transition text-sm font-medium inline-block">
                    Upload Photo
                  </label>
                </div>
              )}
            </div>

            {/* About Me */}
            {data.professional_summary && (
              <section>
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <h2 className="text-xl font-bold">About Me</h2>
                </div>
                <p className="text-sm leading-relaxed text-justify">{data.professional_summary}</p>
              </section>
            )}

            {/* Contact */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
                <h2 className="text-xl font-bold">Contact</h2>
              </div>
              <ul className="space-y-3 text-sm">
                {data.personal_info?.phone && (
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>{data.personal_info.phone}</span>
                  </li>
                )}
                {data.personal_info?.email && (
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>{data.personal_info.email}</span>
                  </li>
                )}
                {data.personal_info?.location && (
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{data.personal_info.location}</span>
                  </li>
                )}
              </ul>
            </section>

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <h2 className="text-xl font-bold">Skills</h2>
                </div>
                <ul className="space-y-2 text-sm">
                  {data.skills.map((skill, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="prt-skill-dot w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Languages */}
            {data.additional_info?.languages && (
              <section>
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                  </svg>
                  <h2 className="text-xl font-bold">Languages</h2>
                </div>
                {renderBrList(data.additional_info.languages, 'white')}
              </section>
            )}

            {/* Certifications */}
            {data.additional_info?.certifications && (
              <section>
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <h2 className="text-xl font-bold">Certifications</h2>
                </div>
                {renderBrList(data.additional_info.certifications, 'white')}
              </section>
            )}

            {/* Interests */}
            {data.additional_info?.interests && (
              <section>
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <h2 className="text-xl font-bold">Interests</h2>
                </div>
                {renderBrList(data.additional_info.interests, 'white')}
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-3 p-8 space-y-8 bg-gray-50">
            {/* Name and Title */}
            <header>
              <h1 className="prt-accent-text text-5xl font-bold mb-2" style={{ color: accentColor, letterSpacing: '0.02em' }}>
                {data.personal_info?.full_name || "YOUR NAME"}
              </h1>
              <h2 className="text-xl text-gray-600 font-normal">
                {data.personal_info?.title || "Your Title"}
              </h2>
            </header>

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <svg className="prt-section-icon w-7 h-7" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  <h2 className="prt-accent-text text-2xl font-bold" style={{ color: accentColor }}>Education</h2>
                </div>
                <div className="space-y-6 relative ml-3">
                  {data.education.map((edu, index) => (
                    <div key={index} className="relative pl-8">
                      <div
                        className="prt-timeline-line absolute left-0 top-0 w-0.5"
                        style={{ backgroundColor: accentColor, bottom: index === data.education!.length - 1 ? '-0.5rem' : '0' }}
                      ></div>
                      <div
                        className="prt-timeline-dot absolute left-0 top-0 w-4 h-4 rounded-full border-4 border-white"
                        style={{ backgroundColor: accentColor, transform: 'translateX(-6px)' }}
                      ></div>
                      <div className="prt-accent-text text-sm font-semibold mb-1" style={{ color: accentColor }}>
                        ({formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "Present" : formatDate(edu.end_date)})
                      </div>
                      <h3 className="prt-accent-text font-bold text-base mb-1" style={{ color: accentColor }}>{edu.institution}</h3>
                      <p className="text-sm text-gray-700 mb-1">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                      {edu.gpa && <p className="text-sm text-gray-600">{edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Professional Experience */}
            {data.experience && data.experience.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <svg className="prt-section-icon w-7 h-7" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                  <h2 className="prt-accent-text text-2xl font-bold" style={{ color: accentColor }}>Professional Experience</h2>
                </div>
                <div className="space-y-6 relative ml-3">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="relative pl-8">
                      <div
                        className="prt-timeline-line absolute left-0 top-0 w-0.5"
                        style={{ backgroundColor: accentColor, bottom: index === data.experience!.length - 1 ? '-0.5rem' : '0' }}
                      ></div>
                      <div
                        className="prt-timeline-dot absolute left-0 top-0 w-4 h-4 rounded-full border-4 border-white"
                        style={{ backgroundColor: accentColor, transform: 'translateX(-6px)' }}
                      ></div>
                      <div className="prt-accent-text text-sm font-semibold mb-1" style={{ color: accentColor }}>
                        ({formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)})
                      </div>
                      <h3 className="prt-accent-text font-bold text-base mb-1" style={{ color: accentColor }}>{exp.position}</h3>
                      <p className="text-sm font-medium text-gray-700 mb-2">{exp.company}</p>
                      {renderBullets(exp.description, '#374151')}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <svg className="prt-section-icon w-7 h-7" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                  </svg>
                  <h2 className="prt-accent-text text-2xl font-bold" style={{ color: accentColor }}>Projects</h2>
                </div>
                <div className="space-y-6 relative ml-3">
                  {data.projects.map((proj, index) => (
                    <div key={index} className="relative pl-8">
                      <div
                        className="prt-timeline-line absolute left-0 top-0 w-0.5"
                        style={{ backgroundColor: accentColor, bottom: index === data.projects!.length - 1 ? '-0.5rem' : '0' }}
                      ></div>
                      <div
                        className="prt-timeline-dot absolute left-0 top-0 w-4 h-4 rounded-full border-4 border-white"
                        style={{ backgroundColor: accentColor, transform: 'translateX(-6px)' }}
                      ></div>
                      <h3 className="prt-accent-text font-bold text-base mb-1" style={{ color: accentColor }}>{proj.name}</h3>
                      {renderBullets(proj.description, '#374151')}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessionalResumeTemplate;