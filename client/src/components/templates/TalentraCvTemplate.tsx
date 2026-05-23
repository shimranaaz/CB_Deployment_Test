import React, { useState } from 'react';
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface PersonalInfo {
  full_name?: string;
  title?: string;
  phone?: string;
  email?: string;
  location?: string;
  website?: string;
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

interface TalentraCvTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const TalentraCvTemplate: React.FC<TalentraCvTemplateProps> = ({ data, accentColor = '#3D2520' }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

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

  return (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header Section */}
      <div className="flex items-start bg-[#E8E3DD] p-8">
        <div className="flex-shrink-0 mr-8">
          <div className="relative w-40 h-40 rounded-full border-8 overflow-hidden bg-gray-100" style={{ borderColor: accentColor }}>
            {profileImage ? (
              <>
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                <label className="absolute inset-0 flex items-center justify-center cursor-pointer group">
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity"></div>
                  <i className="fas fa-camera text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity relative z-10"></i>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer group">
                <i className="fas fa-user text-5xl mb-2" style={{ color: accentColor, opacity: 0.3 }}></i>
                <span className="text-xs font-semibold text-center px-4" style={{ color: accentColor, opacity: 0.5 }}>Click to Upload</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div className="flex-grow">
          <div className="border-4 px-6 py-4 inline-block" style={{ borderColor: accentColor, backgroundColor: '#E8E3DD' }}>
            <h1 className="text-4xl font-bold mb-1" style={{ color: accentColor }}>
              {data.personal_info?.full_name || 'YOUR NAME'}
            </h1>
            <p className="text-xl font-semibold" style={{ color: accentColor }}>
              {data.personal_info?.title || 'Designation'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-2/5 p-8 text-white" style={{ backgroundColor: accentColor }}>

          {/* Contact Information */}
          <div className="mb-8 space-y-4">
            {data.personal_info?.phone && (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0">
                  <i className="fas fa-phone-alt text-sm" style={{ color: accentColor }}></i>
                </div>
                <span className="text-sm">{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.email && (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0">
                  <i className="fas fa-envelope text-sm" style={{ color: accentColor }}></i>
                </div>
                <span className="text-sm break-all">{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info?.location && (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0">
                  <i className="fas fa-map-marker-alt text-sm" style={{ color: accentColor }}></i>
                </div>
                <span className="text-sm">{data.personal_info.location}</span>
              </div>
            )}
            {data.personal_info?.website && (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0">
                  <i className="fas fa-globe text-sm" style={{ color: accentColor }}></i>
                </div>
                <span className="text-sm break-all">{data.personal_info.website}</span>
              </div>
            )}
          </div>

          {/* Education Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-white pb-2">EDUCATION</h2>
            <div className="space-y-6">
              {data.education && data.education.length > 0 && data.education.map((edu: Education, index: number) => (
                <div key={index}>
                  <h3 className="text-base font-bold mb-2">{edu.degree}</h3>
                  <p className="font-semibold mb-1 text-sm">{edu.institution}</p>
                  <p className="text-sm">
                    {edu.start_date && formatDate(edu.start_date)}
                    {edu.start_date && " - "}
                    {isCurrentlyStudying(edu) ? "Present" : edu.end_date ? formatDate(edu.end_date) : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-white pb-2">SKILLS</h2>
            {data.skills && data.skills.length > 0 && (
              <ul className="space-y-2">
                {data.skills.map((skill: string, index: number) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="mr-2">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ✅ ADDED: Languages */}
          {data.additional_info?.languages && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 border-b-2 border-white pb-2">LANGUAGES</h2>
              <div className="ml-1">
                {renderBrList(data.additional_info.languages, "white")}
              </div>
            </div>
          )}

          {/* ✅ ADDED: Certifications */}
          {data.additional_info?.certifications && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 border-b-2 border-white pb-2">CERTIFICATIONS</h2>
              <div className="ml-1">
                {renderBrList(data.additional_info.certifications, "white")}
              </div>
            </div>
          )}

          {/* ✅ CHANGED: Interests — renderBrList replacing inline split/map */}
          {data.additional_info?.interests && (
            <div>
              <h2 className="text-2xl font-bold mb-6 border-b-2 border-white pb-2">MY HOBBY</h2>
              <div className="ml-1">
                {renderBrList(data.additional_info.interests, "white")}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="w-3/5 p-8 bg-[#E8E3DD]">

          {/* About Me Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 border-b-2 pb-2" style={{ color: accentColor, borderColor: accentColor }}>
              ABOUT ME
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              {data.professional_summary}
            </p>
          </div>

          {/* Work Experience Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 border-b-2 pb-2" style={{ color: accentColor, borderColor: accentColor }}>
              WORK EXPERIENCE
            </h2>
            <div className="space-y-6">
              {data.experience && data.experience.length > 0 && data.experience.map((exp: Experience, index: number) => (
                <div key={index}>
                  <h3 className="text-lg font-bold mb-1" style={{ color: accentColor }}>
                    {exp.position}
                  </h3>
                  <p className="font-semibold mb-1 text-sm text-gray-800">{exp.company}</p>
                  <p className="text-sm text-gray-600 mb-3">
                    {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                  </p>
                  {/* ✅ CHANGED: renderBullets for experience */}
                  <div className="ml-2 mt-1">
                    {renderBullets(exp.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          {data.projects && data.projects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 border-b-2 pb-2" style={{ color: accentColor, borderColor: accentColor }}>
                PROJECTS
              </h2>
              <div className="space-y-6">
                {data.projects.map((proj: Project, index: number) => (
                  <div key={index}>
                    <h3 className="text-lg font-bold mb-1" style={{ color: accentColor }}>
                      {proj.name}
                    </h3>
                    {/* ✅ CHANGED: renderBullets for projects */}
                    <div className="ml-2 mt-1">
                      {renderBullets(proj.description, "inherit")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FontAwesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </div>
  );
};

export default TalentraCvTemplate;