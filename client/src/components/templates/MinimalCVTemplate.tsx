import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets } from "@/utils/resumeHelpers";

interface MinimalCVTemplateProps {
  data: ResumeData;
  accentColor: string;
}

const MinimalCVTemplate: React.FC<MinimalCVTemplateProps> = ({ data, accentColor }) => {
  const [profileImage, setProfileImage] = useState<string>("");

  // Load image from data.personal_info.image
  useEffect(() => {
    console.log('MinimalCV - personal_info.image:', data.personal_info?.image);
    
    if (data.personal_info?.image) {
      // Handle both string URLs and File objects
      if (typeof data.personal_info.image === 'string') {
        console.log('MinimalCV - Loading image as string URL');
        setProfileImage(data.personal_info.image);
      } else if (data.personal_info.image instanceof File) {
        console.log('MinimalCV - Loading image as File');
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImage(e.target?.result as string);
        };
        reader.readAsDataURL(data.personal_info.image);
      }
    } else {
      console.log('MinimalCV - No image in data');
      setProfileImage("");
    }
  }, [data.personal_info?.image]);

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";

    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    const month = parts[1] ? parseInt(parts[1]) - 1 : 0;

    const date = new Date(year, month);
    if (isNaN(date.getTime())) return "";

    return date.getFullYear().toString();
  };

  const isCurrentlyWorking = (exp: Experience): boolean => {
    return exp.is_current || !exp.end_date;
  };

  const isCurrentlyStudying = (edu: Education): boolean => {
    return edu.is_current || !edu.end_date;
  };

  return (
    <div className="flex bg-white text-gray-800 min-h-screen p-6 gap-6 max-w-[1200px] mx-auto">
      {/* Print styles to ensure colors show */}
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
      {/* Left Sidebar */}
      <div className="w-2/5 flex flex-col gap-5">
        {/* Profile Card with Photo, Name, Title */}
        <div className="border-4 rounded-3xl p-6 flex flex-col items-center" style={{ borderColor: accentColor, maxWidth: '380px' }}>
          {/* Profile Photo */}
          <div className="mb-6 flex justify-center">
            <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <Camera className="w-12 h-12 mb-2" />
                  <span className="text-xs text-center px-2">Upload Photo</span>
                </div>
              )}
            </div>
          </div>

          {/* Name and Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 uppercase tracking-wider text-gray-900 leading-tight">
              {data.personal_info?.full_name?.replace(" ", "\n").split("\n").map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i === 0 && <br />}
                </React.Fragment>
              )) || "Your Name"}
            </h1>
            <p className="text-base text-gray-600 mt-3">
              {data.personal_info?.title || "Your Title"}
            </p>
          </div>
        </div>

        {/* Contact Card */}
        <div className="border-4 rounded-3xl p-6" style={{ borderColor: accentColor, maxWidth: '380px' }}>
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900">
              Contact
            </h2>
            <div className="w-12 h-1 mx-auto mt-2" style={{ backgroundColor: accentColor }}></div>
          </div>
          <div className="space-y-3 mt-4 text-sm text-gray-700">
            {data.personal_info?.phone && (
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.email && (
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <span className="break-all">{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info?.location && (
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{data.personal_info.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* About Me Card */}
        {data.professional_summary && (
          <div className="border-4 rounded-3xl p-6" style={{ borderColor: accentColor, maxWidth: '380px' }}>
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900">
                About Me
              </h2>
              <div className="w-12 h-1 mx-auto mt-2" style={{ backgroundColor: accentColor }}></div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed text-justify mt-4">
              {data.professional_summary}
            </p>
          </div>
        )}

        {/* Skills Card */}
        {data.skills && data.skills.length > 0 && (
          <div className="border-4 rounded-3xl p-6" style={{ borderColor: accentColor, maxWidth: '380px' }}>
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900">
                Skills
              </h2>
              <div className="w-12 h-1 mx-auto mt-2" style={{ backgroundColor: accentColor }}></div>
            </div>
            <div className="space-y-2 text-center mt-4">
              {data.skills.map((skill, index) => (
                <div key={index} className="text-sm text-gray-700">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content Area */}
      <div className="w-3/5 flex flex-col gap-6">
        {/* Education Section */}
        {data.education && data.education.length > 0 && (
          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-900">
                Education
              </h2>
              <div className="h-1 mt-2" style={{ backgroundColor: accentColor }}></div>
            </div>

            <div className="space-y-6 relative">
              {/* Vertical line connecting all dots */}
              <div className="absolute left-1.5 top-2 bottom-2 w-0.5" style={{ backgroundColor: accentColor }}></div>
              
              {data.education.map((edu, index) => (
                <div key={index} className="relative pl-6">
                  <div 
                    className="absolute left-0 top-2 w-3 h-3 rounded-full" 
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {edu.degree} {edu.field && `of ${edu.field}`}
                    </h3>
                    <p className="text-sm italic text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {edu.start_date && formatDate(edu.start_date)}
                      {edu.start_date && " - "}
                      {isCurrentlyStudying(edu) ? "Present" : edu.end_date ? formatDate(edu.end_date) : ""}
                    </p>
                  </div>

                  {edu.additional_info && (
                    <p className="text-sm text-gray-700 leading-relaxed text-justify mt-2">
                      {edu.additional_info}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-900">
                Experience
              </h2>
              <div className="h-1 mt-2" style={{ backgroundColor: accentColor }}></div>
            </div>

            <div className="space-y-6 relative">
              {/* Vertical line connecting all dots */}
              <div className="absolute left-1.5 top-2 bottom-2 w-0.5" style={{ backgroundColor: accentColor }}></div>
              
              {data.experience.map((exp, index) => (
                <div key={index} className="relative pl-6">
                  <div 
                    className="absolute left-0 top-2 w-3 h-3 rounded-full" 
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {exp.position}
                    </h3>
                    <p className="text-sm italic text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                    </p>
                  </div>

                  <div className="ml-5 mt-2">
                    {renderBullets(exp.description, "inherit")}
                  </div>
                </div>
          ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-900">
                Projects
              </h2>
              <div className="h-1 mt-2" style={{ backgroundColor: accentColor }}></div>
            </div>

            <div className="space-y-6 relative">
              <div className="absolute left-1.5 top-2 bottom-2 w-0.5" style={{ backgroundColor: accentColor }}></div>

              {data.projects.map((proj, index) => (
                <div key={index} className="relative pl-6">
                  <div
                    className="absolute left-0 top-2 w-3 h-3 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{proj.name}</h3>
                  </div>
                  <div className="ml-5 mt-2">
                    {renderBullets(proj.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default MinimalCVTemplate;