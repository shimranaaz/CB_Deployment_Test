import React, { useState } from "react";
import { Phone, Mail, Globe, User } from "lucide-react";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface PersonalInfo {
  full_name?: string;
  title?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  profile_image?: string;
}

interface Experience {
  position: string;
  company?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
}

interface Education {
  degree: string;
  field?: string;
  institution: string;
  position?: string;
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
  certifications?: string;
  languages?: string;
  interests?: string;
}

interface ResumeData {
  personal_info?: PersonalInfo;
  professional_summary?: string;
  skills?: string[];
  experience?: Experience[];
  projects?: Project[];
  education?: Education[];
  additional_info?: AdditionalInfo;
}

interface CareerEliteTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const CareerEliteTemplate: React.FC<CareerEliteTemplateProps> = ({ data, accentColor }) => {
  const [profileImage, setProfileImage] = useState<string>(data.personal_info?.profile_image || "");
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-gray-50 text-gray-900 p-8">
      {/* Font Link */}
      <link href="https://fonts.googleapis.com/css2?family=Lobster+Two:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      
      {/* Print styles */}
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          input[type="file"] {
            display: none;
          }
          .bg-gray-50 {
            background-color: white !important;
          }
          @page {
            margin: 0.5in;
          }
        }
        
        .cursive-name {
          font-family: 'Lobster Two', sans-serif !important;
          font-weight: 400;
        }
      `}</style>

      {/* Header with name and photo */}
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-5xl mb-2 cursive-name" style={{ color: accentColor }}>
            {data.personal_info?.full_name || "YOUR NAME"}
          </h1>
          <h2 className="text-lg font-normal tracking-widest text-gray-800 uppercase">
            {data.personal_info?.title || "Designation"}
          </h2>
        </div>
        
        {/* Profile Photo Upload */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="profile-upload"
          />
          <label
            htmlFor="profile-upload"
            className={`block w-40 h-40 rounded-full overflow-hidden cursor-pointer border-4 ${
              isDragging ? 'border-blue-500' : 'border-gray-300'
            } transition-colors`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center">
                <User size={40} className="text-gray-400 mb-1" />
                <span className="text-xs text-gray-500 text-center px-4">
                  Click or drag image
                </span>
              </div>
            )}
          </label>
        </div>
      </header>

      {/* Two Column Layout with Divider */}
      <div className="flex gap-6 relative">
        {/* Vertical Divider */}
        <div 
          className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-gray-300"
          style={{ left: '37%' }}
        />

        {/* Left Column - 38% */}
        <div className="w-2/5 pr-6 space-y-8">
          {/* Contact */}
          <section>
            <h3 className="text-base font-bold mb-3 tracking-wide uppercase" style={{ color: accentColor }}>
              CONTACT
            </h3>
            <div className="space-y-3">
              {data.personal_info?.phone && (
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Phone size={16} className="text-white" />
                  </div>
                  <span className="text-sm">{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Mail size={16} className="text-white" />
                  </div>
                  <span className="text-sm">{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.website && (
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Globe size={16} className="text-white" />
                  </div>
                  <span className="text-sm">{data.personal_info.website}</span>
                </div>
              )}
            </div>
          </section>

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <h3 className="text-base font-bold mb-3 tracking-wide uppercase" style={{ color: accentColor }}>
                EDUCATION
              </h3>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(edu.start_date)}-{isCurrentlyStudying(edu) ? "Present" : formatDate(edu.end_date)}
                    </p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{edu.institution}</p>
                    <p className="text-sm text-gray-700 mt-1">
                      {edu.degree} {edu.field && `of ${edu.field}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h3 className="text-base font-bold mb-3 tracking-wide uppercase" style={{ color: accentColor }}>
                SKILLS
              </h3>
              <ul className="space-y-2">
                {data.skills.map((skill, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-800">
                    <span className="mr-2">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages */}
          {data.additional_info?.languages && (
            <section>
              <h3 className="text-base font-bold mb-3 tracking-wide uppercase" style={{ color: accentColor }}>
                LANGUAGES
              </h3>
              {/* ✅ renderBrList for <br> between items */}
              <div className="text-sm text-gray-800">
                {renderBrList(data.additional_info.languages, 'inherit')}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.additional_info?.certifications && (
            <section>
              <h3 className="text-base font-bold mb-3 tracking-wide uppercase" style={{ color: accentColor }}>
                CERTIFICATIONS
              </h3>
              {/* ✅ renderBrList for <br> between items */}
              <div className="text-sm text-gray-800">
                {renderBrList(data.additional_info.certifications, 'inherit')}
              </div>
            </section>
          )}

          {/* Interests */}
          {data.additional_info?.interests && (
            <section>
              <h3 className="text-base font-bold mb-3 tracking-wide uppercase" style={{ color: accentColor }}>
                INTERESTS
              </h3>
              {/* ✅ renderBrList for <br> between items */}
              <div className="text-sm text-gray-800">
                {renderBrList(data.additional_info.interests, 'inherit')}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - 62% */}
        <div className="w-3/5 pl-6 space-y-8">
          {/* Personal Statement */}
          {data.professional_summary && (
            <section>
              <h3 className="text-base font-bold mb-3 tracking-wide uppercase" style={{ color: accentColor }}>
                PERSONAL STATEMENT
              </h3>
              <p className="text-sm leading-relaxed text-gray-800">
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <h3 className="text-base font-bold mb-3 tracking-wide uppercase" style={{ color: accentColor }}>
                WORK EXPERIENCE
              </h3>
              <div className="space-y-5">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <h4 className="text-base font-bold text-gray-900">
                      {exp.position}
                    </h4>
                    <p className="text-sm text-gray-800 mt-1">
                      {exp.company} ({formatDate(exp.start_date)}-{isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)})
                    </p>
                    {/* ✅ replaced manual split/map with shared renderBullets */}
                    <div className="mt-3">
                      {renderBullets(exp.description, 'inherit')}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <h3 className="text-base font-bold mb-3 tracking-wide uppercase text-gray-900">
                PROJECTS
              </h3>
              <div className="space-y-4">
                {data.projects.map((proj, index) => (
                  <div key={index}>
                    <h4 className="text-base font-bold text-gray-900">{proj.name}</h4>
                    <p className="text-sm text-gray-800 mt-1">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerEliteTemplate;