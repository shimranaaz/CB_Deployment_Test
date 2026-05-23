import React from "react";
import { Upload } from "lucide-react";
import { ResumeData, Experience, Education } from "../../types/resume";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface Reference {
  name: string;
  position?: string;
  phone?: string;
  email?: string;
  social?: string;
}

interface ExtendedResumeData extends ResumeData {
  references?: Reference[];
}

interface Props {
  data: ExtendedResumeData;
  accentColor: string;
  onPhotoUpload?: (base64: string) => void;
}

const ProfessionalResume: React.FC<Props> = ({ data, accentColor, onPhotoUpload }) => {
  const formatDate = (date?: string) => {
    if (!date) return "";
    const [y, m] = date.split("-");
    return new Date(Number(y), Number(m || 1) - 1).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const isCurrent = (item: Experience | Education) =>
    item.is_current || !item.end_date;

  const getProfileImage = () => {
    if (data.personal_info?.photo_url) return data.personal_info.photo_url;
    if (typeof data.personal_info?.image === "string")
      return data.personal_info.image;
    return null;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onPhotoUpload) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoUpload(reader.result as string);
      };
      reader.onerror = () => {
        alert('Failed to read image file');
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
          .prof-accent-text {
            color: ${accentColor} !important;
          }
          .prof-accent-bg {
            background-color: ${accentColor} !important;
          }
          .prof-accent-border {
            border-color: ${accentColor} !important;
          }
          .prof-photo-ring {
            background-color: ${accentColor} !important;
          }
          .prof-skill-dot {
            background-color: ${accentColor} !important;
          }
          .prof-timeline-dot {
            background-color: ${accentColor} !important;
          }
        }
      `}</style>
      <div className="max-w-5xl mx-auto bg-white grid grid-cols-[32%_68%] min-h-[1120px]">

        {/* LEFT SIDEBAR */}
        <aside className="px-8 py-10 border-r">

          {/* PHOTO */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div
                className="prof-photo-ring w-40 h-40 rounded-full p-1"
                style={{ backgroundColor: accentColor }}
              >
                <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  {getProfileImage() ? (
                    <img
                      src={getProfileImage()!}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">Photo</span>
                  )}
                </div>
              </div>

              {onPhotoUpload && (
                <div className="print:hidden absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label className="cursor-pointer bg-white/90 hover:bg-white text-gray-700 rounded-full p-3 shadow-lg">
                    <Upload className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* NAME */}
          <h1 className="prof-accent-text text-2xl font-bold text-center" style={{ color: accentColor }}>
            {data.personal_info?.full_name || "Your Name"}
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {data.personal_info?.title || "Your Title"}
          </p>

          {/* CONTACT */}
          {(data.personal_info?.phone || data.personal_info?.email || data.personal_info?.location) && (
            <section className="mb-8">
              <h3 className="font-bold mb-3 text-gray-700">Contact</h3>
              <div className="prof-accent-border border-b-2 mb-4" style={{ borderColor: accentColor }}></div>
              <div className="text-sm space-y-2 text-gray-600">
                {data.personal_info?.phone && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <p>{data.personal_info.phone}</p>
                  </div>
                )}
                {data.personal_info?.email && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <p className="break-words">{data.personal_info.email}</p>
                  </div>
                )}
                {data.personal_info?.location && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <p>{data.personal_info.location}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ABOUT */}
          {data.professional_summary && (
            <section className="mb-8">
              <h3 className="font-bold mb-3 text-gray-700">About Me</h3>
              <div className="prof-accent-border border-b-2 mb-4" style={{ borderColor: accentColor }}></div>
              <p className="text-sm text-gray-600 leading-relaxed text-justify">
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* SKILLS */}
          {data.skills && data.skills.length > 0 && (
            <section className="mb-8">
              <h3 className="font-bold mb-3 text-gray-700">Skills</h3>
              <div className="prof-accent-border border-b-2 mb-4" style={{ borderColor: accentColor }}></div>
              <ul className="space-y-2">
                {data.skills.map((skill, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <span
                      className="prof-skill-dot w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    ></span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* LANGUAGES */}
          {data.additional_info?.languages && (
            <section className="mb-8">
              <h3 className="font-bold mb-3 text-gray-700">Languages</h3>
              <div className="prof-accent-border border-b-2 mb-4" style={{ borderColor: accentColor }}></div>
              {renderBrList(data.additional_info.languages, '#4b5563')}
            </section>
          )}

          {/* CERTIFICATIONS */}
          {data.additional_info?.certifications && (
            <section className="mb-8">
              <h3 className="font-bold mb-3 text-gray-700">Certifications</h3>
              <div className="prof-accent-border border-b-2 mb-4" style={{ borderColor: accentColor }}></div>
              {renderBrList(data.additional_info.certifications, '#4b5563')}
            </section>
          )}

          {/* INTERESTS */}
          {data.additional_info?.interests && (
            <section className="mb-8">
              <h3 className="font-bold mb-3 text-gray-700">Interests</h3>
              <div className="prof-accent-border border-b-2 mb-4" style={{ borderColor: accentColor }}></div>
              {renderBrList(data.additional_info.interests, '#4b5563')}
            </section>
          )}
        </aside>

        {/* RIGHT CONTENT */}
        <main className="px-10 py-10">

          {/* EDUCATION */}
          {data.education && data.education.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-2 text-gray-700">Education</h2>
              <div className="prof-accent-border border-b-2 mb-6" style={{ borderColor: accentColor }}></div>

              <div className="space-y-8">
                {data.education.map((edu, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-300" />
                    <span
                      className="prof-timeline-dot absolute left-[-7px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: accentColor }}
                    />
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-800">
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </h3>
                      <p className="text-sm text-gray-500 whitespace-nowrap ml-4">
                        {formatDate(edu.start_date)} - {isCurrent(edu) ? "Present" : formatDate(edu.end_date)}
                      </p>
                    </div>
                    <p className="text-sm italic text-gray-600 mb-2">{edu.institution}</p>
                    {(edu.additional_info || edu.gpa) && (
                      <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                        {edu.gpa && <p><span className="font-semibold">GPA:</span> {edu.gpa}</p>}
                        {edu.additional_info && <p>{edu.additional_info}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EXPERIENCE */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-2 text-gray-700">Experience</h2>
              <div className="prof-accent-border border-b-2 mb-6" style={{ borderColor: accentColor }}></div>

              <div className="space-y-8">
                {data.experience.map((exp, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-300" />
                    <span
                      className="prof-timeline-dot absolute left-[-7px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: accentColor }}
                    />
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-800">{exp.position}</h3>
                      <p className="text-sm text-gray-500 whitespace-nowrap ml-4">
                        {formatDate(exp.start_date)} - {isCurrent(exp) ? "Present" : formatDate(exp.end_date)}
                      </p>
                    </div>
                    {exp.company && <p className="text-sm italic text-gray-600 mb-2">{exp.company}</p>}
                    {renderBullets(exp.description, '#4b5563')}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PROJECTS */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-2 text-gray-700">Projects</h2>
              <div className="prof-accent-border border-b-2 mb-6" style={{ borderColor: accentColor }}></div>

              <div className="space-y-8">
                {data.projects.map((proj, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-300" />
                    <span
                      className="prof-timeline-dot absolute left-[-7px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: accentColor }}
                    />
                    <h3 className="font-semibold text-gray-800">{proj.name}</h3>
                    {renderBullets(proj.description, '#4b5563')}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* REFERENCES */}
          {data.references && data.references.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-2 text-gray-700">References</h2>
              <div className="prof-accent-border border-b-2 mb-6" style={{ borderColor: accentColor }}></div>

              <div className="grid grid-cols-2 gap-8">
                {data.references.map((ref: Reference, index: number) => (
                  <div key={index}>
                    <h3 className="font-bold text-gray-800 mb-1">{ref.name}</h3>
                    {(ref.position || ref.social) && (
                      <p className="text-sm text-gray-600 mb-2">
                        {[ref.position, ref.social].filter(Boolean).join(' / ')}
                      </p>
                    )}
                    <div className="space-y-1 text-sm text-gray-600">
                      {ref.phone && (
                        <p><span className="font-semibold">Phone:</span> {ref.phone}</p>
                      )}
                      {ref.email && (
                        <p className="break-words">
                          <span className="font-semibold">Email:</span> {ref.email}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default ProfessionalResume;