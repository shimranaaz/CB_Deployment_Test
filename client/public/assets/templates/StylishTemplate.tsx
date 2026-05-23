import React, { useState } from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, Upload, X } from "lucide-react";

// Define interfaces to match your project structure
interface PersonalInfo {
  full_name?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  profession?: string;
  linkedin?: string;
  website?: string;
  photo?: string;
  image?: File | string;
}

interface Experience {
  company?: string;
  position?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  is_current?: boolean;
}

interface Education {
  institution?: string;
  degree?: string;
  field?: string;
  start_date?: string;
  end_date?: string;
  gpa?: string;
  is_current?: boolean;
  graduation_date?: string;
  additional_info?: string;
}

interface Project {
  name?: string;
  type?: string;
  description?: string;
}

interface Reference {
  name?: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
}

interface ResumeData {
  personal_info?: PersonalInfo;
  professional_summary?: string;
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  project?: Project[];
  skills?: string[];
  additional_info?: {
    certifications?: string;
    languages?: string;
    interests?: string;
  };
  references?: Reference[];
  [key: string]: any;
}

interface Language {
  name: string;
  proficiency: number;
}

interface StylishTemplateProps {
  data: ResumeData;
  accentColor: string;
  onDataChange?: (data: ResumeData) => void;
}

const StylishTemplate: React.FC<StylishTemplateProps> = ({ data, accentColor, onDataChange }) => {
  const [profileImage, setProfileImage] = useState<string | null>(
    (data.personal_info as any)?.photo || null
  );
  
  const parseLanguages = (): Language[] => {
    if (!data.additional_info?.languages) return [];
    return data.additional_info.languages.split(',').map((lang, index) => ({
      name: lang.trim(),
      proficiency: index === 0 ? 90 : 60
    }));
  };

  const [languages, setLanguages] = useState<Language[]>(parseLanguages());
  const [hoveredLanguage, setHoveredLanguage] = useState<number | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setProfileImage(imageUrl);
        
        if (onDataChange) {
          onDataChange({
            ...data,
            personal_info: {
              ...data.personal_info,
              photo: imageUrl
            } as any
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    
    if (onDataChange) {
      const updatedInfo = { ...data.personal_info } as any;
      delete updatedInfo.photo;
      onDataChange({
        ...data,
        personal_info: updatedInfo
      });
    }
  };

  const updateLanguageProficiency = (index: number, newProficiency: number) => {
    const updated = [...languages];
    updated[index].proficiency = newProficiency;
    setLanguages(updated);

    if (onDataChange) {
      const languageString = updated.map(l => l.name).join(', ');
      onDataChange({
        ...data,
        additional_info: {
          ...data.additional_info,
          languages: languageString
        }
      });
    }
  };

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    const month = parts[1] ? parseInt(parts[1]) - 1 : 0;
    const date = new Date(year, month);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const isCurrentlyWorking = (exp: Experience): boolean => {
    return exp.is_current === true || !exp.end_date || exp.end_date.trim() === "";
  };

  const isCurrentlyStudying = (edu: Education): boolean => {
    return edu.is_current === true || !edu.end_date || edu.end_date.trim() === "";
  };

  // Handle both 'projects' and 'project' field names
  const projectsList = data.projects || data.project || [];

  return (
    <div className="flex max-w-5xl mx-auto bg-white text-gray-800">
      {/* Left Sidebar - Dynamic Background Color */}
      <div className="w-2/5 p-8 text-white" style={{ backgroundColor: accentColor }}>
        {/* Profile Photo */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg group">
            {profileImage ? (
              <>
                <img 
                  src={profileImage} 
                  alt={data.personal_info?.full_name || "Profile"} 
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 print:hidden"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <label className="w-full h-full bg-gray-300 flex flex-col items-center justify-center text-gray-600 cursor-pointer hover:bg-gray-400 transition-colors">
                <Upload className="w-12 h-12 mb-2" />
                <span className="text-sm font-medium">Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <section className="mb-8">
          <h2 
            className="text-lg font-bold mb-4 uppercase tracking-wider pb-2" 
            style={{ borderBottom: `2px solid white` }}
          >
            CONTACT
          </h2>
          <div className="space-y-3 text-sm">
            {data.personal_info?.phone && (
              <div className="flex items-start gap-2">
                <Phone className="size-4 mt-0.5 flex-shrink-0" />
                <span>{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.email && (
              <div className="flex items-start gap-2">
                <Mail className="size-4 mt-0.5 flex-shrink-0" />
                <span className="break-all">{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info?.location && (
              <div className="flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                <span>{data.personal_info.location}</span>
              </div>
            )}
            {data.personal_info?.linkedin && (
              <div className="flex items-start gap-2">
                <Linkedin className="size-4 mt-0.5 flex-shrink-0" />
                <span className="break-all">{data.personal_info.linkedin}</span>
              </div>
            )}
            {data.personal_info?.website && (
              <div className="flex items-start gap-2">
                <Globe className="size-4 mt-0.5 flex-shrink-0" />
                <span className="break-all">{data.personal_info.website}</span>
              </div>
            )}
          </div>
        </section>

        {/* Education Section */}
        {data.education && data.education.length > 0 && (
          <section className="mb-8">
            <h2 
              className="text-lg font-bold mb-4 uppercase tracking-wider pb-2" 
              style={{ borderBottom: `2px solid white` }}
            >
              EDUCATION
            </h2>
            <div className="space-y-4">
              {data.education.map((edu: Education, index: number) => (
                <div key={index} className="text-sm">
                  <h3 className="font-bold">{edu.institution}</h3>
                  <p>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </p>
                  <p className="text-xs mt-1 opacity-90">
                    {edu.start_date && formatDate(edu.start_date)}
                    {edu.start_date && " - "}
                    {isCurrentlyStudying(edu) ? "Present" : edu.end_date ? formatDate(edu.end_date) : ""}
                  </p>
                  {edu.gpa && <p className="text-xs opacity-90">GPA: {edu.gpa}</p>}
                  {edu.additional_info && (
                    <div className="text-xs mt-1 space-y-1 opacity-90">
                      {edu.additional_info
                        .split("\n")
                        .filter((line: string) => line.trim())
                        .map((line: string, i: number) => (
                          <p key={i}>{line.trim().replace(/^[•\-]\s*/, "")}</p>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-8">
            <h2 
              className="text-lg font-bold mb-4 uppercase tracking-wider pb-2" 
              style={{ borderBottom: `2px solid white` }}
            >
              SKILLS
            </h2>
            <ul className="space-y-2 text-sm">
              {data.skills.map((skill: string, index: number) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages with Editable Progress Bars */}
        {languages.length > 0 && (
          <section className="mb-8">
            <h2 
              className="text-lg font-bold mb-4 uppercase tracking-wider pb-2" 
              style={{ borderBottom: `2px solid white` }}
            >
              LANGUAGE
            </h2>
            <div className="space-y-3 text-sm">
              {languages.map((lang, index) => (
                <div key={index}>
                  <p className="font-semibold">{lang.name}</p>
                  <div 
                    className="relative mt-1"
                    onMouseEnter={() => setHoveredLanguage(index)}
                    onMouseLeave={() => setHoveredLanguage(null)}
                  >
                    <div className="w-full bg-white/10 h-2 rounded">
                      <div 
                        className="h-2 rounded transition-all bg-white"
                        style={{ width: `${lang.proficiency}%` }}
                      ></div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lang.proficiency}
                      onChange={(e) => updateLanguageProficiency(index, parseInt(e.target.value))}
                      className="absolute top-0 w-full h-2 opacity-0 cursor-pointer print:hidden"
                      title={`${lang.proficiency}%`}
                    />
                    {hoveredLanguage === index && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium print:hidden whitespace-nowrap">
                        {lang.proficiency}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Right Content Area */}
      <div className="w-3/5 p-8 bg-white">
        {/* Header with Name */}
        <header className="mb-8 pb-4" style={{ borderBottom: `3px solid #333` }}>
          <h1 className="text-5xl font-bold mb-2 uppercase tracking-wide text-gray-900">
            {data.personal_info?.full_name?.split(' ')[0] || "First Name"}
          </h1>
          <h1 className="text-5xl font-bold mb-3 uppercase tracking-wide text-gray-900">
            {data.personal_info?.full_name?.split(' ').slice(1).join(' ') || "Last Name"}
          </h1>
          <h2 className="text-lg text-gray-800">
            {data.personal_info?.title || "Fullstack developer"}
          </h2>
        </header>

        {/* About Me */}
        {data.professional_summary && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 uppercase tracking-wider text-gray-900">
              ABOUT ME
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {data.professional_summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider text-gray-900">
              EXPERIENCE
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp: Experience, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                      {formatDate(exp.start_date)} - {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-800 mb-2">{exp.company}</p>
                  {exp.description && (
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projectsList && projectsList.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider text-gray-900">
              PROJECTS
            </h2>
            <div className="space-y-4">
              {projectsList.map((proj: Project, index: number) => (
                <div key={index}>
                  <h3 className="font-bold text-gray-900">{proj.name}</h3>
                  <p className="text-sm text-gray-700">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.additional_info?.certifications && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider text-gray-900">
              CERTIFICATIONS
            </h2>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {data.additional_info.certifications}
            </div>
          </section>
        )}

        {/* Interests */}
        {data.additional_info?.interests && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider text-gray-900">
              INTERESTS
            </h2>
            <p className="text-sm text-gray-700">{data.additional_info.interests}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default StylishTemplate;