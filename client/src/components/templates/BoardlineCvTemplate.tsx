import React, { useState } from "react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface BoardlineCvTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const BoardlineCvTemplate: React.FC<BoardlineCvTemplateProps> = ({ data, accentColor }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

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

      <div className="flex max-w-5xl mx-auto bg-white min-h-screen">
        {/* Left Content Area */}
        <div className="w-3/5 p-12 bg-white">
          {/* Header */}
          <header className="mb-10">
            <h1 className="text-5xl font-light mb-2" style={{ color: '#4a4a4a', letterSpacing: '0.05em' }}>
              {data.personal_info?.full_name?.toUpperCase() || "YOUR NAME"}
            </h1>
            <h2 className="text-xl mb-6" style={{ color: '#6b6b6b' }}>
              {data.personal_info?.title || "Designation"}
            </h2>
            <div className="border-t" style={{ borderColor: '#d1d5db' }}></div>
          </header>

          {/* Summary */}
          {data.professional_summary && (
            <section className="mb-10">
              <div 
                className="inline-block px-6 py-2 mb-6"
                style={{ 
                  backgroundColor: accentColor,
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact'
                }}
              >
                <h3 className="text-white font-bold tracking-widest">SUMMARY</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#5d5d5d' }}>
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-10">
              <div 
                className="inline-block px-6 py-2 mb-6"
                style={{ 
                  backgroundColor: accentColor,
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact'
                }}
              >
                <h3 className="text-white font-bold tracking-widest">EXPERIENCE</h3>
              </div>

              <div className="space-y-8">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <p className="text-sm mb-1" style={{ color: '#6b6b6b' }}>
                      {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                    </p>
                    <h4 className="text-lg font-bold mb-1" style={{ color: '#3d3d3d' }}>
                      {exp.position || "Position"}
                    </h4>
                    <p className="text-sm mb-3" style={{ color: '#6b6b6b' }}>
                      {exp.company || "Company Name"}
                    </p>
                    {/* ✅ replaced manual split/map with shared renderBullets */}
                    <div className="mt-2">
                      {renderBullets(exp.description, '#5d5d5d')}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-10">
              <div 
                className="inline-block px-6 py-2 mb-6"
                style={{ 
                  backgroundColor: accentColor,
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact'
                }}
              >
                <h3 className="text-white font-bold tracking-widest">PROJECTS</h3>
              </div>

              <div className="space-y-6">
                {data.projects.map((proj, index) => (
                  <div key={index}>
                    <h4 className="text-lg font-bold mb-2" style={{ color: '#3d3d3d' }}>
                      {proj.name}
                    </h4>
                    <p className="text-sm" style={{ color: '#5d5d5d' }}>
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar */}
        <div 
          className="w-2/5 p-10 text-white"
          style={{
            backgroundColor: accentColor,
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact'
          }}
        >
          {/* Profile Photo */}
          <div className="flex justify-center mb-10 mt-6">
            <div className="relative w-44 h-44">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              ) : (
                <label 
                  htmlFor="profile-upload-boardline" 
                  className="flex flex-col items-center justify-center w-full h-full rounded-full cursor-pointer hover:bg-gray-100 transition-colors bg-white"
                >
                  <i className="fas fa-camera text-5xl text-gray-400 mb-2"></i>
                  <span className="text-xs text-gray-500 text-center px-6">
                    Click to upload photo
                  </span>
                </label>
              )}
              <input
                id="profile-upload-boardline"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Contact */}
          <section className="mb-10">
            <div className="border-2 border-white px-6 py-2 mb-5 text-center">
              <h3 className="font-bold tracking-widest">CONTACT</h3>
            </div>

            <div className="space-y-3 text-sm text-center">
              {data.personal_info?.phone && (
                <p>{data.personal_info.phone}</p>
              )}
              {data.personal_info?.email && (
                <p className="break-all">{data.personal_info.email}</p>
              )}
              {data.personal_info?.location && (
                <p>{data.personal_info.location}</p>
              )}
              {data.personal_info?.website && (
                <p className="break-all">{data.personal_info.website}</p>
              )}
            </div>
          </section>

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section className="mb-10">
              <div className="border-2 border-white px-6 py-2 mb-5 text-center">
                <h3 className="font-bold tracking-widest">EDUCATION</h3>
              </div>

              <div className="space-y-6 text-sm text-center">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h4 className="font-bold mb-1">
                      {edu.institution}
                    </h4>
                    <p className="mb-1">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </p>
                    <p className="opacity-90">
                      {formatDate(edu.start_date)} - {isCurrentlyStudying(edu) ? "Present" : formatDate(edu.end_date)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section className="mb-10">
              <div className="border-2 border-white px-6 py-2 mb-5 text-center">
                <h3 className="font-bold tracking-widest">SKILLS</h3>
              </div>

              <div className="space-y-2 text-sm text-center">
                {data.skills.map((skill, index) => (
                  <p key={index}>{skill}</p>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.additional_info?.languages && (
            <section className="mb-10">
              <div className="border-2 border-white px-6 py-2 mb-5 text-center">
                <h3 className="font-bold tracking-widest">LANGUAGE</h3>
              </div>
              {/* ✅ replaced manual split(',').map with renderBrList */}
              <div className="text-sm text-center">
                {renderBrList(data.additional_info.languages, 'white')}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.additional_info?.certifications && (
            <section className="mb-10">
              <div className="border-2 border-white px-6 py-2 mb-5 text-center">
                <h3 className="font-bold tracking-widest">CERTIFICATIONS</h3>
              </div>
              {/* ✅ replaced manual split('\n').map with renderBrList */}
              <div className="text-sm text-center">
                {renderBrList(data.additional_info.certifications, 'white')}
              </div>
            </section>
          )}

          {/* Interests */}
          {data.additional_info?.interests && (
            <section className="mb-10">
              <div className="border-2 border-white px-6 py-2 mb-5 text-center">
                <h3 className="font-bold tracking-widest">INTERESTS</h3>
              </div>
              {/* ✅ added missing Interests section with renderBrList */}
              <div className="text-sm text-center">
                {renderBrList(data.additional_info.interests, 'white')}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default BoardlineCvTemplate;