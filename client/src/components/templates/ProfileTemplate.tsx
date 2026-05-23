import React, { useState } from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface ProfileTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const ProfileTemplate: React.FC<ProfileTemplateProps> = ({ data, accentColor }) => {
  const [profileImage, setProfileImage] = useState<string>("");
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";

    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    const month = parts[1] ? parseInt(parts[1]) - 1 : 0;

    const date = new Date(year, month);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
    });
  };

  const isCurrentlyWorking = (exp: Experience): boolean => {
    return exp.is_current || !exp.end_date;
  };

  const isCurrentlyStudying = (edu: Education): boolean => {
    return edu.is_current || !edu.end_date;
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900">
      <style>{`
        @media print {
          .upload-button {
            display: none !important;
          }
          .hover-overlay {
            display: none !important;
          }
        }
      `}</style>

      {/* Header with Profile Image */}
      <div
        className="relative pt-8 pb-24 bg-cover bg-center"
        style={{
          backgroundColor: backgroundImage ? 'transparent' : '#1a1a1a',
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact'
        }}
      >
        {/* Background Image Upload Button */}
        <label className="upload-button absolute top-2 right-2 bg-white text-black px-3 py-1 rounded cursor-pointer text-xs hover:bg-gray-100 z-50 shadow-lg">
          <i className="fas fa-image mr-1"></i>
          Background Image
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundImageUpload}
            className="hidden"
          />
        </label>

        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-4 right-4 w-32 h-32 border border-white"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 border border-white"></div>
        </div>

        <div className="relative flex flex-col items-center">
          {/* Profile Image Circle with Upload */}
          <div className="relative w-48 h-48 rounded-full bg-white overflow-hidden border-8 border-white mb-6 group">
            {profileImage || (data.personal_info?.image && typeof data.personal_info.image === 'string') ? (
              <img
                src={profileImage || (data.personal_info?.image as string)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : data.personal_info?.image && typeof data.personal_info.image === 'object' ? (
              <img
                src={URL.createObjectURL(data.personal_info.image)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-6xl font-bold">
                {data.personal_info?.full_name?.charAt(0) || "U"}
              </div>
            )}
            <label className="hover-overlay absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <i className="fas fa-camera text-white text-2xl"></i>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Name and Title */}
          <h1 className="text-4xl font-bold text-white mb-2">
            {data.personal_info?.full_name?.toUpperCase() || "YOUR NAME"}
          </h1>
          <h2 className="text-xl font-bold text-white tracking-wider">
            {data.personal_info?.title?.toUpperCase() || "YOUR TITLE"}
          </h2>
        </div>
      </div>

      {/* Contact Info Bar */}
      <div
        className="bg-white py-4 -mt-20 relative z-10 mx-12"
        style={{
          borderTop: `2px solid ${accentColor}`,
          borderBottom: `2px solid ${accentColor}`,
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact'
        }}
      >
        <div className="flex justify-center items-center gap-8 text-sm flex-wrap text-black">
          {data.personal_info?.email && (
            <div className="flex items-center gap-2">
              <i className="fas fa-envelope"></i>
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-2">
              <i className="fas fa-phone"></i>
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-2">
              <i className="fas fa-globe"></i>
              <span>{data.personal_info.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 py-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-1 space-y-6">
            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section>
                <h2
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: accentColor, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
                >
                  <span className="text-2xl">◆</span> EDUCATION
                </h2>
                <div className="mb-4" style={{ borderTop: `2px solid ${accentColor}`, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}></div>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-sm">{edu.degree}</h3>
                      {edu.field && <p className="text-sm">{edu.field}</p>}
                      <p className="text-sm">{edu.institution}</p>
                      <p className="text-sm">
                        {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "Present" : formatDate(edu.end_date)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills/Expertise */}
            {data.skills && data.skills.length > 0 && (
              <section>
                <h2
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: accentColor, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
                >
                  <span className="text-2xl">◆</span> EXPERTISE
                </h2>
                <div className="mb-4" style={{ borderTop: `2px solid ${accentColor}`, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}></div>
                <div className="space-y-2">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="text-sm">{skill}</div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {data.additional_info?.languages && (
              <section>
                <h2
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: accentColor, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
                >
                  <span className="text-2xl">◆</span> LANGUAGES
                </h2>
                <div className="mb-4" style={{ borderTop: `2px solid ${accentColor}`, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}></div>
                {renderBrList(data.additional_info.languages, '#111827')}
              </section>
            )}

            {/* Certifications */}
            {data.additional_info?.certifications && (
              <section>
                <h2
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: accentColor, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
                >
                  <span className="text-2xl">◆</span> CERTIFICATIONS
                </h2>
                <div className="mb-4" style={{ borderTop: `2px solid ${accentColor}`, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}></div>
                {renderBrList(data.additional_info.certifications, '#111827')}
              </section>
            )}

            {/* Interests */}
            {data.additional_info?.interests && (
              <section>
                <h2
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: accentColor, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
                >
                  <span className="text-2xl">◆</span> INTERESTS
                </h2>
                <div className="mb-4" style={{ borderTop: `2px solid ${accentColor}`, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}></div>
                {renderBrList(data.additional_info.interests, '#111827')}
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-2 space-y-6">
            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <section>
                <h2
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: accentColor, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
                >
                  <span className="text-2xl">◆</span> EXPERIENCE
                </h2>
                <div className="mb-4" style={{ borderTop: `2px solid ${accentColor}`, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}></div>
                <div className="space-y-6">
                  {data.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold">{exp.company || "Company"}</h3>
                      </div>
                      <p className="font-bold text-sm mb-1">{exp.position}</p>
                      <p className="text-sm mb-2">
                        {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                      </p>
                      {renderBullets(exp.description, '#111827')}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            <div className="grid grid-cols-2 gap-6">
              {data.projects && data.projects.length > 0 && (
                <section>
                  <h2
                    className="text-lg font-bold mb-4 flex items-center gap-2"
                    style={{ color: accentColor, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
                  >
                    <span className="text-2xl">◆</span> REFERENCE
                  </h2>
                  <div className="mb-4" style={{ borderTop: `2px solid ${accentColor}`, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}></div>
                  <div className="space-y-2 text-sm">
                    {data.projects.map((proj, index) => (
                      <div key={index}>
                        <p className="font-bold">{proj.name}</p>
                        {renderBullets(proj.description, '#111827')}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="h-8"
        style={{ backgroundColor: accentColor, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
      ></div>

      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </div>
  );
};

export default ProfileTemplate;