import React, { useState } from "react";
import { Mail, Phone, MapPin, Upload, Camera } from "lucide-react";
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

interface ModernTwoColumnTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const ModernTwoColumnTemplate: React.FC<ModernTwoColumnTemplateProps> = ({ data, accentColor }) => {
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
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
      <div className="max-w-4xl mx-auto bg-white text-gray-800 min-h-screen p-8">
        {/* Header Section with Photo */}
        <div className="rounded-t-3xl overflow-hidden mb-8 p-8 relative" style={{ backgroundColor: accentColor }}>
          <div className="flex items-center gap-8">
            {/* Profile Photo */}
            <div className="relative w-48 h-48 flex-shrink-0">
              <div className="w-full h-full bg-white rounded-full overflow-hidden border-8 border-white shadow-lg">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center">
                    <Upload className="w-16 h-16 text-gray-400 mb-2" strokeWidth={1.5} />
                    <span className="text-gray-500 text-sm">Upload Photo</span>
                  </div>
                )}
              </div>
              <div
                onClick={triggerFileInput}
                className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-full"
              >
                <Camera className="w-10 h-10 text-white mb-2" strokeWidth={2} />
                <span className="text-white text-sm font-semibold">Upload Photo</span>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Name and Title */}
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-2">
                {data.personal_info?.full_name || "Your Name"}
              </h1>
              <h2 className="text-2xl font-light opacity-90">
                {data.personal_info?.title || "Your Title"}
              </h2>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-5 gap-8">
          {/* Left Column */}
          <div className="col-span-2 space-y-8">
            {/* About Me */}
            {data.professional_summary && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>
                  About Me
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {data.professional_summary}
                </p>
              </div>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>
                  Experience
                </h2>
                <div className="space-y-6">
                  {data.experience.map((exp, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-gray-700 text-base mb-1">
                        {exp.company || "Company Name"}
                      </h3>
                      <p className="text-sm text-gray-600 italic mb-2">
                        {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                      </p>
                      <div className="ml-5 mt-2">
                        {renderBullets(exp.description, "inherit")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {data.additional_info &&
              (data.additional_info.certifications ||
                data.additional_info.languages ||
                data.additional_info.interests ||
                data.additional_info.awards) && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>
                  Additional Info
                </h2>
                <div className="space-y-4 text-sm text-gray-700">
                  {data.additional_info.languages && (
                    <div>
                      <p className="font-semibold mb-1">Languages</p>
                      {renderBrList(data.additional_info.languages, "inherit")}
                    </div>
                  )}
                  {data.additional_info.certifications && (
                    <div>
                      <p className="font-semibold mb-1">Certifications</p>
                      {renderBrList(data.additional_info.certifications, "inherit")}
                    </div>
                  )}
                  {data.additional_info.interests && (
                    <div>
                      <p className="font-semibold mb-1">Interests</p>
                      {renderBrList(data.additional_info.interests, "inherit")}
                    </div>
                  )}
                  {data.additional_info.awards && (
                    <div>
                      <p className="font-semibold mb-1">Awards</p>
                      {renderBrList(data.additional_info.awards, "inherit")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-3 space-y-8">
            {/* Education */}
            {data.education && data.education.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>
                  Education
                </h2>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-gray-700 text-base">
                        {edu.institution}
                      </h3>
                      <p className="text-sm text-gray-600 italic">
                        {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "Present" : formatDate(edu.end_date)}
                      </p>
                      <p className="text-sm text-gray-700 italic mt-1">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>
                  Skills
                </h2>
                <ul className="space-y-2">
                  {data.skills.map((skill, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>
                Contact
              </h2>
              <div className="space-y-3 text-sm text-gray-700">
                {data.personal_info?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4" style={{ color: accentColor }} />
                    <span>{data.personal_info.phone}</span>
                  </div>
                )}
                {data.personal_info?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4" style={{ color: accentColor }} />
                    <span className="break-all">{data.personal_info.email}</span>
                  </div>
                )}
                {data.personal_info?.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4" style={{ color: accentColor }} />
                    <span>{data.personal_info.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>
                  Projects
                </h2>
                <div className="space-y-4">
                  {data.projects.map((proj, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-gray-700 text-sm">{proj.name}</h3>
                      <div className="ml-5 mt-2">
                        {renderBullets(proj.description, "inherit")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModernTwoColumnTemplate;