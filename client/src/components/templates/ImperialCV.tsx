import React, { useState } from 'react';
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface PersonalInfo {
  full_name?: string;
  title?: string;
  phone?: string;
  email?: string;
  location?: string;
  website?: string;
  photo?: string;
}

interface Experience {
  position?: string;
  company?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
}

interface Education {
  degree?: string;
  institution?: string;
  field?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  gpa?: string;
  additional_info?: string;
}

interface Project {
  name: string;
  description?: string;
}

interface AdditionalInfo {
  languages?: string;
  certifications?: string;
  interests?: string;
}

interface ResumeData {
  personal_info?: PersonalInfo;
  professional_summary?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  projects?: Project[];
  additional_info?: AdditionalInfo;
}

interface ImperialCVProps {
  data: ResumeData;
  accentColor: string;
}

const ImperialCV: React.FC<ImperialCVProps> = ({ data, accentColor = '#1E7A9E' }) => {
  const [profileImage, setProfileImage] = useState<string | null>(
    data.personal_info?.photo || null
  );

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

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    return year.toString();
  };

  const isCurrentlyWorking = (exp: Experience): boolean => {
    return exp.is_current || !exp.end_date;
  };

  const getTransparentColor = (): string => {
    return `${accentColor}15`;
  };

  return (
    <div className="flex max-w-5xl mx-auto bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Left Sidebar */}
      <div className="w-2/5 px-10 py-12" style={{ backgroundColor: getTransparentColor() }}>
        {/* Profile Photo */}
        <div className="mb-10 flex justify-center">
          <div className="relative" style={{ width: '200px', height: '200px' }}>
            <div className="absolute inset-0 rounded-full" style={{ border: `4px solid ${accentColor}`, padding: '8px' }}>
              <div className="relative w-full h-full rounded-full overflow-hidden group bg-white">
                {profileImage ? (
                  <>
                    <img src={profileImage} alt={data.personal_info?.full_name || "Profile"} className="w-full h-full object-cover" />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Remove photo"
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors rounded-full">
                    <i className="fas fa-user text-5xl mb-2"></i>
                    <span className="text-sm font-medium">Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-5 uppercase tracking-wide" style={{ color: accentColor }}>
            CONTACT
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            {data.personal_info?.phone && (
              <div className="flex items-start gap-3">
                <i className="fas fa-phone mt-1" style={{ color: accentColor }}></i>
                <span>{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.email && (
              <div className="flex items-start gap-3">
                <i className="fas fa-envelope mt-1" style={{ color: accentColor }}></i>
                <span className="break-all">{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info?.location && (
              <div className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt mt-1" style={{ color: accentColor }}></i>
                <span>{data.personal_info.location}</span>
              </div>
            )}
            {data.personal_info?.website && (
              <div className="flex items-start gap-3">
                <i className="fas fa-globe mt-1" style={{ color: accentColor }}></i>
                <span className="break-all">{data.personal_info.website}</span>
              </div>
            )}
          </div>
        </section>

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-5 uppercase tracking-wide" style={{ color: accentColor }}>
              SKILLS
            </h2>
            <ul className="space-y-3 text-sm text-gray-700">
              {data.skills.map((skill, index) => (
                <li key={index} className="flex items-start gap-3">
                  <i className="fas fa-circle text-xs mt-1.5" style={{ color: accentColor }}></i>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages Section */}
        {data.additional_info?.languages && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-5 uppercase tracking-wide" style={{ color: accentColor }}>
              LANGUAGES
            </h2>
            <div className="ml-1">
              {renderBrList(data.additional_info.languages, "inherit")}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {data.additional_info?.certifications && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-5 uppercase tracking-wide" style={{ color: accentColor }}>
              CERTIFICATIONS
            </h2>
            <div className="ml-1">
              {renderBrList(data.additional_info.certifications, "inherit")}
            </div>
          </section>
        )}

        {/* Interests Section */}
        {data.additional_info?.interests && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-5 uppercase tracking-wide" style={{ color: accentColor }}>
              INTERESTS
            </h2>
            <div className="ml-1">
              {renderBrList(data.additional_info.interests, "inherit")}
            </div>
          </section>
        )}

        {/* Education Section */}
        <section>
          <h2 className="text-xl font-bold mb-5 uppercase tracking-wide" style={{ color: accentColor }}>
            EDUCATION
          </h2>
          <div className="relative pl-6 space-y-6">
            <div className="absolute left-[3px] top-2 bottom-2 w-0.5" style={{ backgroundColor: accentColor }}></div>

            {data.education && data.education.length > 0 && data.education.map((edu, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[24px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                <p className="text-sm font-bold mb-1" style={{ color: accentColor }}>
                  {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                </p>
                <h3 className="text-sm font-bold mb-1 uppercase text-gray-800">
                  {edu.institution}
                </h3>
                <p className="text-sm text-gray-700">
                  {edu.degree}{edu.field && ` ${edu.field}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Content Area */}
      <div className="w-3/5 px-12 py-12 bg-white">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 uppercase tracking-wide" style={{ color: accentColor }}>
            {data.personal_info?.full_name || 'YOUR NAME'}
          </h1>
          <div className="w-32 h-1 mb-4" style={{ backgroundColor: accentColor }}></div>
          <p className="text-xl text-gray-600">
            {data.personal_info?.title || 'Designation'}
          </p>
        </header>

        {/* Personal Profile Section */}
        {data.professional_summary && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide" style={{ color: accentColor }}>
              PERSONAL PROFILE
            </h2>
            <p className="text-sm leading-relaxed text-gray-700 text-justify">
              {data.professional_summary}
            </p>
          </section>
        )}

        {/* Work Experience Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6 uppercase tracking-wide" style={{ color: accentColor }}>
            WORK EXPERIENCE
          </h2>
          <div className="relative pl-6 space-y-8">
            <div className="absolute left-[3px] top-2 bottom-2 w-0.5" style={{ backgroundColor: accentColor }}></div>

            {data.experience && data.experience.length > 0 && data.experience.map((exp, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[24px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                <div className="mb-2">
                  <h3 className="text-base font-bold inline uppercase" style={{ color: '#2B2B2B' }}>
                    {exp.position}
                  </h3>
                  <span className="text-base font-bold mx-2">|</span>
                  <span className="text-base font-bold" style={{ color: '#2B2B2B' }}>
                    {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "NOW" : formatDate(exp.end_date)}
                  </span>
                </div>
                <p className="text-sm mb-3 text-gray-700">{exp.company}</p>
                <div className="ml-5 mt-2">
                  {renderBullets(exp.description, "inherit")}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6 uppercase tracking-wide" style={{ color: accentColor }}>
              PROJECTS
            </h2>
            <div className="relative pl-6 space-y-8">
              <div className="absolute left-[3px] top-2 bottom-2 w-0.5" style={{ backgroundColor: accentColor }}></div>

              {data.projects.map((proj: Project, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[24px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                  <h3 className="text-base font-bold mb-2 uppercase" style={{ color: '#2B2B2B' }}>
                    {proj.name}
                  </h3>
                  <div className="ml-5 mt-2">
                    {renderBullets(proj.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Font Awesome CSS */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Print Styles */}
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ImperialCV;