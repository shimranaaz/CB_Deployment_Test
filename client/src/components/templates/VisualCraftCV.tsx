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

interface VisualCraftCVProps {
  data: ResumeData;
  accentColor: string;
}

const VisualCraftCV: React.FC<VisualCraftCVProps> = ({ data, accentColor = '#4A3F49' }) => {
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

  return (
    <div className="flex max-w-5xl mx-auto bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Left Sidebar */}
      <div className="w-2/5 text-white px-8 py-8" style={{ backgroundColor: accentColor }}>
        {/* Profile Photo */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg group">
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
              <label className="w-full h-full bg-gray-300 flex flex-col items-center justify-center text-gray-600 cursor-pointer hover:bg-gray-400 transition-colors">
                <i className="fas fa-camera text-3xl mb-1.5"></i>
                <span className="text-xs font-medium">Upload Photo</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* About Me Section */}
        {data.professional_summary && (
          <section className="mb-6">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <i className="fas fa-user"></i>
              About Me
            </h2>
            <p className="text-xs leading-relaxed text-justify">
              {data.professional_summary}
            </p>
          </section>
        )}

        {/* Contact Section */}
        <section className="mb-6">
          <h2 className="text-base font-bold mb-3 flex items-center gap-2">
            <i className="fas fa-address-book"></i>
            Contact
          </h2>
          <div className="space-y-2 text-xs">
            {data.personal_info?.phone && (
              <div className="flex items-start gap-3">
                <i className="fas fa-phone mt-1"></i>
                <span>{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.email && (
              <div className="flex items-start gap-3">
                <i className="fas fa-envelope mt-1"></i>
                <span className="break-all">{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info?.location && (
              <div className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt mt-1"></i>
                <span>{data.personal_info.location}</span>
              </div>
            )}
          </div>
        </section>

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <i className="fas fa-cog"></i>
              Skills
            </h2>
            <ul className="space-y-1.5 text-xs">
              {data.skills.map((skill, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span>•</span> {skill}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Language Section */}
        {data.additional_info?.languages && (
          <section className="mb-6">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <i className="fas fa-language"></i>
              Language
            </h2>
            {renderBrList(data.additional_info.languages, "inherit")}
          </section>
        )}

        {/* Certifications Section */}
        {data.additional_info?.certifications && (
          <section className="mb-6">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <i className="fas fa-certificate"></i>
              Certifications
            </h2>
            {renderBrList(data.additional_info.certifications, "inherit")}
          </section>
        )}

        {/* Interests Section */}
        {data.additional_info?.interests && (
          <section>
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <i className="fas fa-heart"></i>
              Interests
            </h2>
            {renderBrList(data.additional_info.interests, "inherit")}
          </section>
        )}
      </div>

      {/* Right Content Area */}
      <div className="w-3/5 bg-white px-10 py-8 relative">

        {/* Header */}
        <header className="mb-8 relative z-10">
          <h1 className="text-5xl font-bold mb-1" style={{ color: accentColor }}>
            {data.personal_info?.full_name?.split(' ')[0] || 'First Name'}
          </h1>
          <h1 className="text-5xl font-bold mb-2" style={{ color: accentColor }}>
            {data.personal_info?.full_name?.split(' ').slice(1).join(' ') || 'Last Name'}
          </h1>
          <p className="text-lg text-gray-800">
            {data.personal_info?.title || 'Designation'}
          </p>
        </header>

        {/* Education Section */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: accentColor }}>
            <i className="fas fa-graduation-cap"></i>
            Education
          </h2>
          <div className="relative pl-8 space-y-4">
            <div className="absolute left-0 top-2 bottom-2 w-0.5" style={{ backgroundColor: accentColor }}></div>

            {data.education && data.education.length > 0 && data.education.map((edu, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[37px] top-1 w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }}></div>
                <p className="text-sm font-bold mb-1" style={{ color: accentColor }}>
                  ({formatDate(edu.start_date)} - {formatDate(edu.end_date)})
                </p>
                <h3 className="text-base font-bold mb-1 uppercase" style={{ color: accentColor }}>
                  {edu.institution}
                </h3>
                <p className="text-sm text-gray-700">
                  {edu.degree}{edu.field && ` ${edu.field}`}
                </p>
                {edu.gpa && <p className="text-sm text-gray-700">{edu.gpa}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Work Experience Section */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: accentColor }}>
            <i className="fas fa-briefcase"></i>
            Work Experience
          </h2>
          <div className="relative pl-8 space-y-4">
            <div className="absolute left-0 top-2 bottom-2 w-0.5" style={{ backgroundColor: accentColor }}></div>

            {data.experience && data.experience.length > 0 && data.experience.map((exp, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[37px] top-1 w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }}></div>
                <p className="text-sm font-bold mb-1" style={{ color: accentColor }}>
                  ({formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)})
                </p>
                <h3 className="text-base font-bold mb-1 uppercase" style={{ color: accentColor }}>
                  {exp.position}
                </h3>
                <p className="text-sm text-gray-700 mb-2">{exp.company}</p>
                <div className="ml-2 mt-2">
                  {renderBullets(exp.description, "inherit")}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: accentColor }}>
              <i className="fas fa-folder-open"></i>
              Projects
            </h2>
            <div className="relative pl-8 space-y-4">
              <div className="absolute left-0 top-2 bottom-2 w-0.5" style={{ backgroundColor: accentColor }}></div>

              {data.projects.map((proj: Project, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[37px] top-1 w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }}></div>
                  <h3 className="text-base font-bold mb-1 uppercase" style={{ color: accentColor }}>
                    {proj.name}
                  </h3>
                  <div className="ml-2 mt-2">
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

export default VisualCraftCV;