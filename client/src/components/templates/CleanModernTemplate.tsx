import React from "react";
import { ResumeData } from "../../types/resume";
import { Mail, Phone, MapPin } from "lucide-react";
import { renderBullets, renderBrList } from "@/utils/resumeHelpers";

interface Reference {
  name: string;
  position?: string;
  phone?: string;
  social?: string;
}

interface ExtendedResumeData extends ResumeData {
  references?: Reference[];
}

interface CleanModernTemplateProps {
  data: ExtendedResumeData;
  accentColor: string;
}

const CleanModernTemplate: React.FC<CleanModernTemplateProps> = ({ data, accentColor }) => {
  const formatDate = (date?: string) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { year: "numeric" });
  };

  const divider = (
    <div
      className="w-full my-3"
      style={{ borderTop: `2px solid ${accentColor}` }}
    />
  );

  return (
    <div className="max-w-3xl mx-auto p-10 rounded-md bg-white font-sans text-gray-900">
      <div
        className="w-full mb-6"
        style={{ borderTop: `2px solid ${accentColor}` }}
      ></div>

      {/* HEADER */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-extrabold tracking-wide uppercase">
          {data.personal_info?.full_name}
        </h1>

        <p className="text-lg tracking-wide text-gray-700 font-semibold">
          {data.personal_info?.title}
        </p>

        <div className="w-full flex justify-center mt-4 gap-10 text-sm text-gray-700 items-center font-medium">
          {data.personal_info?.phone && (
            <div className="flex items-center gap-2">
              <Phone size={16} color={accentColor} />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} color={accentColor} />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.email && (
            <div className="flex items-center gap-2">
              <Mail size={16} color={accentColor} />
              <span>{data.personal_info.email}</span>
            </div>
          )}
        </div>

        {divider}
      </header>

      {/* ABOUT ME */}
      {data.professional_summary && (
        <section className="mb-6">
          <h3
            className="text-xl font-extrabold uppercase tracking-wide mb-1"
            style={{ color: accentColor }}
          >
            About Me
          </h3>

          {divider}

          <p className="text-sm leading-relaxed text-gray-800 font-medium">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* EDUCATION */}
      {data.education?.length ? (
        <section className="mb-6">
          <h3
            className="text-xl font-extrabold uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            Education
          </h3>

          {divider}

          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <div key={i}>
                <div className="text-sm font-bold">
                  {formatDate(edu.start_date)} -{" "}
                  {edu.is_current ? "Present" : formatDate(edu.end_date)}
                </div>
                <div className="font-semibold text-gray-900 text-base">
                  {edu.degree}
                </div>
                <div className="text-gray-700 text-sm mb-1">
                  {edu.institution}
                </div>
                {edu.additional_info && (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {edu.additional_info}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* EXPERIENCE */}
      {data.experience?.length ? (
        <section className="mb-6">
          <h3
            className="text-xl font-extrabold uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            Experience
          </h3>

          {divider}

          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="text-sm font-bold">
                  {formatDate(exp.start_date)} -{" "}
                  {exp.is_current ? "Present" : formatDate(exp.end_date)}
                </div>
                <div className="font-semibold text-gray-900 text-base">
                  {exp.position}
                </div>
                <div className="text-gray-700 text-sm mb-1">{exp.company}</div>
                <div className="ml-5 mt-2">
                  {renderBullets(exp.description, "inherit")}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* PROJECTS */}
      {data.projects?.length ? (
        <section className="mb-6">
          <h3
            className="text-xl font-extrabold uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            Projects
          </h3>

          {divider}

          <div className="space-y-4">
            {data.projects.map((proj, i) => (
              <div key={i}>
                <div className="font-semibold text-gray-900 text-base">
                  {proj.name}
                </div>
                {proj.description && (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* SKILLS */}
      {data.skills?.length ? (
        <section className="mb-6">
          <h3
            className="text-xl font-extrabold uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            Skills
          </h3>

          {divider}

          <div className="grid grid-cols-3 text-sm text-gray-700 gap-y-3">
            {data.skills.map((skill, i) => (
              <p key={i} className="font-medium">
                <span style={{ color: accentColor, fontWeight: "bold" }}>•</span>{" "}
                {skill}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      {/* ADDITIONAL INFORMATION */}
      {data.additional_info &&
        (data.additional_info.languages ||
          data.additional_info.certifications ||
          data.additional_info.interests) && (
          <section className="mb-6">
            <h3
              className="text-xl font-extrabold uppercase tracking-wide"
              style={{ color: accentColor }}
            >
              Additional Information
            </h3>

            {divider}

            <div className="space-y-3 text-sm text-gray-700">
              {data.additional_info.certifications && (
                <div>
                  <span className="font-semibold">Certifications: </span>
                  {renderBrList(data.additional_info.certifications, "inherit")}
                </div>
              )}
              {data.additional_info.languages && (
                <div>
                  <span className="font-semibold">Languages: </span>
                  {renderBrList(data.additional_info.languages, "inherit")}
                </div>
              )}
              {data.additional_info.interests && (
                <div>
                  <span className="font-semibold">Interests: </span>
                  {renderBrList(data.additional_info.interests, "inherit")}
                </div>
              )}
            </div>
          </section>
        )}

      {/* REFERENCES */}
      {Array.isArray(data.references) && data.references.length > 0 && (
        <section className="mb-4">
          <h3
            className="text-xl font-extrabold uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            References
          </h3>

          {divider}

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            {data.references.map((ref: Reference, i: number) => (
              <div key={i}>
                <p className="font-bold text-gray-900">{ref.name}</p>
                {ref.position && <p>{ref.position}</p>}
                {ref.phone && <p>Phone: {ref.phone}</p>}
                {ref.social && <p>Social: {ref.social}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CleanModernTemplate;