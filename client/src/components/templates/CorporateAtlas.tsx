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

interface CorporateAtlasProps {
  data: ResumeData;
  accentColor: string;
}

const CorporateAtlas: React.FC<CorporateAtlasProps> = ({ data, accentColor = '#0066CC' }) => {
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

  const parseLanguages = () => {
    if (!data.additional_info?.languages) return [];
    return data.additional_info.languages.split(',').map(lang => lang.trim());
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-50 px-12 py-10" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header Section */}
      <div className="flex items-start gap-8 mb-10">
        {/* Profile Photo */}
        <div className="relative flex-shrink-0" style={{ width: '180px', height: '180px' }}>
          <div className="absolute inset-0 rounded-full" style={{ border: `8px solid ${accentColor}`, padding: '6px' }}>
            <div className="relative w-full h-full rounded-full overflow-hidden group bg-white">
              {profileImage ? (
                <>
                  <img src={profileImage} alt={data.personal_info?.full_name || "Profile"} className="w-full h-full object-cover" />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Remove photo"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                </>
              ) : (
                <label className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors rounded-full">
                  <i className="fas fa-user text-4xl mb-2"></i>
                  <span className="text-xs font-medium">Upload Photo</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Name and Contact Info */}
        <div className="flex-1 pt-4">
          <h1 className="text-3xl font-bold mb-2 uppercase tracking-wide whitespace-nowrap" style={{ color: accentColor }}>
            {data.personal_info?.full_name || 'YOUR NAME'}
          </h1>
          <p className="text-2xl text-gray-600 mb-6">
            {data.personal_info?.title || 'Designation'}
          </p>
          <div className="w-full h-0.5 mb-4" style={{ backgroundColor: accentColor }}></div>
          <div className="flex items-center gap-3 text-sm text-gray-700 flex-nowrap">
            {data.personal_info?.email && (
              <>
                <span className="whitespace-nowrap">{data.personal_info.email}</span>
                {(data.personal_info?.phone || data.personal_info?.location) && (
                  <span className="text-gray-400 flex-shrink-0">|</span>
                )}
              </>
            )}
            {data.personal_info?.phone && (
              <>
                <span className="whitespace-nowrap">{data.personal_info.phone}</span>
                {data.personal_info?.location && (
                  <span className="text-gray-400 flex-shrink-0 hidden sm:inline">|</span>
                )}
              </>
            )}
            {data.personal_info?.location && (
              <span className="whitespace-nowrap hidden sm:inline">{data.personal_info.location}</span>
            )}
          </div>
        </div>
      </div>

      {/* Profile Summary Section */}
      {data.professional_summary && (
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-bold uppercase tracking-wide whitespace-nowrap" style={{ color: accentColor }}>
              PROFILE SUMMARY
            </h2>
            <div className="flex-1 h-0.5" style={{ backgroundColor: accentColor }}></div>
          </div>
          <p className="text-sm leading-relaxed text-gray-700 text-justify">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* Education Section */}
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wide whitespace-nowrap" style={{ color: accentColor }}>
            EDUCATION
          </h2>
          <div className="flex-1 h-0.5" style={{ backgroundColor: accentColor }}></div>
        </div>
        <div className="space-y-4">
          {data.education && data.education.length > 0 && data.education.map((edu, index) => (
            <div key={index} className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-800 mb-1">
                  {edu.institution}
                </h3>
                <ul className="text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{edu.degree}{edu.field && ` ${edu.field}`}</span>
                  </li>
                </ul>
              </div>
              <p className="text-sm italic ml-4 whitespace-nowrap" style={{ color: accentColor }}>
                {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Work Experience Section */}
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wide whitespace-nowrap" style={{ color: accentColor }}>
            WORK EXPERIENCE
          </h2>
          <div className="flex-1 h-0.5" style={{ backgroundColor: accentColor }}></div>
        </div>
        <div className="space-y-6">
          {data.experience && data.experience.length > 0 && data.experience.map((exp, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-bold text-gray-800">
                  {exp.position} | {exp.company}
                </h3>
                <p className="text-sm italic ml-4 whitespace-nowrap" style={{ color: accentColor }}>
                  {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "PRESENT" : formatDate(exp.end_date)}
                </p>
              </div>
              <div className="ml-5 mt-2">
                {renderBullets(exp.description, "inherit")}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-bold uppercase tracking-wide whitespace-nowrap" style={{ color: accentColor }}>
              PROJECTS
            </h2>
            <div className="flex-1 h-0.5" style={{ backgroundColor: accentColor }}></div>
          </div>
          <div className="space-y-6">
            {data.projects.map((proj: Project, index: number) => (
              <div key={index}>
                <h3 className="text-base font-bold text-gray-800 mb-1">
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

      {/* Skills and Languages Section */}
      <div className="flex gap-12">
        {data.skills && data.skills.length > 0 && (
          <section className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-bold uppercase tracking-wide whitespace-nowrap" style={{ color: accentColor }}>
                PROFESSIONAL SKILL
              </h2>
              <div className="flex-1 h-0.5" style={{ backgroundColor: accentColor }}></div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
              {data.skills.map((skill, index) => (
                <div key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {parseLanguages().length > 0 && (
          <section className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-bold uppercase tracking-wide whitespace-nowrap" style={{ color: accentColor }}>
                LANGUAGES
              </h2>
              <div className="flex-1 h-0.5" style={{ backgroundColor: accentColor }}></div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
              {parseLanguages().map((lang, index) => (
                <div key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{lang}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Certifications & Interests */}
      {data.additional_info &&
        (data.additional_info.certifications || data.additional_info.interests) && (
          <section className="mt-8">
            <div className="flex gap-12">
              {data.additional_info.certifications && (
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-xl font-bold uppercase tracking-wide whitespace-nowrap" style={{ color: accentColor }}>
                      CERTIFICATIONS
                    </h2>
                    <div className="flex-1 h-0.5" style={{ backgroundColor: accentColor }}></div>
                  </div>
                  {renderBrList(data.additional_info.certifications, "inherit")}
                </div>
              )}
              {data.additional_info.interests && (
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-xl font-bold uppercase tracking-wide whitespace-nowrap" style={{ color: accentColor }}>
                      INTERESTS
                    </h2>
                    <div className="flex-1 h-0.5" style={{ backgroundColor: accentColor }}></div>
                  </div>
                  {renderBrList(data.additional_info.interests, "inherit")}
                </div>
              )}
            </div>
          </section>
        )}

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

export default CorporateAtlas;