import React, { useState } from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, Upload, X } from "lucide-react";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface Language {
  name: string;
  proficiency: number;
}

interface StylishTemplateProps {
  data: any;
  accentColor: string;
  onDataChange?: (data: any) => void;
}

const StylishTemplate: React.FC<StylishTemplateProps> = ({ data, accentColor, onDataChange }) => {
  const [profileImage, setProfileImage] = useState<string | null>(
    data.personal_info?.photo || null
  );

  const parseLanguages = (): Language[] => {
    if (!data.additional_info?.languages) return [];
    return data.additional_info.languages.split(",").map((lang: string, index: number) => ({
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
            personal_info: { ...data.personal_info, photo: imageUrl }
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (onDataChange) {
      const updatedInfo = { ...data.personal_info };
      delete updatedInfo.photo;
      onDataChange({ ...data, personal_info: updatedInfo });
    }
  };

  const updateLanguageProficiency = (index: number, newProficiency: number) => {
    const updated = [...languages];
    updated[index].proficiency = newProficiency;
    setLanguages(updated);
    if (onDataChange) {
      const languageString = updated.map((l) => l.name).join(", ");
      onDataChange({
        ...data,
        additional_info: { ...data.additional_info, languages: languageString }
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

  const isCurrentlyWorking = (exp: any): boolean => exp?.is_current || !exp?.end_date;
  const isCurrentlyStudying = (edu: any): boolean => edu?.is_current || !edu?.end_date;

  const education = data.education || [];
  const skills = data.skills || [];
  const experience = data.experience || [];
  const projects = data.projects || [];

  return (
    <div className="flex max-w-5xl mx-auto bg-white text-gray-800">

      {/* PRINT CSS */}
      <style>
        {`
          @media print {
            .print-bg-sidebar {
              background-color: ${accentColor} !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          }
        `}
      </style>

      {/* LEFT SIDEBAR */}
      <div
        className="w-2/5 p-8 text-white print-bg-sidebar"
        style={{ backgroundColor: accentColor }}
      >
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
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* CONTACT */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 uppercase tracking-wider pb-2" style={{ borderBottom: "2px solid white" }}>
            CONTACT
          </h2>
          <div className="space-y-3 text-sm">
            {data.personal_info?.phone && (
              <div className="flex items-start gap-2">
                <Phone className="size-4 mt-0.5" />
                <span>{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.email && (
              <div className="flex items-start gap-2">
                <Mail className="size-4 mt-0.5" />
                <span className="break-all">{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info?.location && (
              <div className="flex items-start gap-2">
                <MapPin className="size-4 mt-0.5" />
                <span>{data.personal_info.location}</span>
              </div>
            )}
            {data.personal_info?.linkedin && (
              <div className="flex items-start gap-2">
                <Linkedin className="size-4 mt-0.5" />
                <span className="break-all">{data.personal_info.linkedin}</span>
              </div>
            )}
            {data.personal_info?.website && (
              <div className="flex items-start gap-2">
                <Globe className="size-4 mt-0.5" />
                <span className="break-all">{data.personal_info.website}</span>
              </div>
            )}
          </div>
        </section>

        {/* EDUCATION */}
        {education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-wider pb-2" style={{ borderBottom: "2px solid white" }}>
              EDUCATION
            </h2>
            <div className="space-y-4 text-sm">
              {education.map((edu: any, index: number) => (
                <div key={index}>
                  <h3 className="font-bold">{edu.institution}</h3>
                  <p>{edu.degree} {edu.field && `in ${edu.field}`}</p>
                  <p className="text-xs opacity-90 mt-1">
                    {edu.start_date && formatDate(edu.start_date)} -{" "}
                    {isCurrentlyStudying(edu) ? "Present" : edu.end_date ? formatDate(edu.end_date) : ""}
                  </p>
                  {edu.gpa && <p className="text-xs opacity-90">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-wider pb-2" style={{ borderBottom: "2px solid white" }}>
              SKILLS
            </h2>
            <ul className="space-y-2 text-sm">
              {skills.map((skill: string, i: number) => (
                <li key={i} className="flex items-center">
                  <span className="mr-2">•</span> {skill}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* LANGUAGES — kept as-is (custom proficiency bar UI) */}
        {languages.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-wider pb-2" style={{ borderBottom: "2px solid white" }}>
              LANGUAGE
            </h2>
            <div className="space-y-4 text-sm">
              {languages.map((lang, index) => (
                <div key={index}>
                  <p className="font-semibold">{lang.name}</p>
                  <div
                    className="relative mt-1"
                    onMouseEnter={() => setHoveredLanguage(index)}
                    onMouseLeave={() => setHoveredLanguage(null)}
                  >
                    <div className="w-full bg-transparent h-2 rounded">
                      <div className="h-2 rounded bg-white transition-all" style={{ width: `${lang.proficiency}%` }}></div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lang.proficiency}
                      onChange={(e) => updateLanguageProficiency(index, +e.target.value)}
                      className="absolute top-0 w-full h-2 opacity-0 cursor-pointer print:hidden"
                    />
                    {hoveredLanguage === index && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs print:hidden">
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

      {/* RIGHT CONTENT AREA */}
      <div className="w-3/5 p-8 bg-white">

        {/* HEADER */}
        <header className="mb-8 pb-4" style={{ borderBottom: "3px solid #333" }}>
          <h1 className="text-5xl font-bold uppercase tracking-wide text-gray-900">
            {data.personal_info?.full_name?.split(" ")[0] || "FIRST NAME"}
          </h1>
          <h1 className="text-5xl font-bold mb-3 uppercase tracking-wide text-gray-900">
            {data.personal_info?.full_name?.split(" ").slice(1).join(" ") || "LAST NAME"}
          </h1>
          <h2 className="text-lg text-gray-700">{data.personal_info?.title || "Designation"}</h2>
        </header>

        {/* ABOUT */}
        {data.professional_summary && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 uppercase tracking-wider text-gray-900">ABOUT ME</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{data.professional_summary}</p>
          </section>
        )}

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 uppercase tracking-wider text-gray-900">EXPERIENCE</h2>
            <div className="space-y-6">
              {experience.map((exp: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold">{exp.position}</h3>
                    <span className="text-sm text-gray-600">
                      {formatDate(exp.start_date)} -{" "}
                      {isCurrentlyWorking(exp) ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-800 mb-2">{exp.company}</p>
                  {/* ✅ CHANGED: renderBullets for experience */}
                  <div className="ml-2 mt-1">
                    {renderBullets(exp.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider text-gray-900">PROJECTS</h2>
            <div className="space-y-4">
              {projects.map((proj: any, index: number) => (
                <div key={index}>
                  <h3 className="font-bold text-gray-900">{proj.name}</h3>
                  {/* ✅ CHANGED: renderBullets for projects */}
                  <div className="ml-2 mt-1">
                    {renderBullets(proj.description, "inherit")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {data.additional_info?.certifications && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider text-gray-900">CERTIFICATIONS</h2>
            {/* ✅ CHANGED: renderBrList for certifications */}
            <div className="ml-2">
              {renderBrList(data.additional_info.certifications, "inherit")}
            </div>
          </section>
        )}

        {/* INTERESTS */}
        {data.additional_info?.interests && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider text-gray-900">INTERESTS</h2>
            {/* ✅ CHANGED: renderBrList for interests */}
            <div className="ml-2">
              {renderBrList(data.additional_info.interests, "inherit")}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default StylishTemplate;