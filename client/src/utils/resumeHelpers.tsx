import React from 'react';

// ── Bullet points for Experience / Projects ──────────────────────────────────
export const renderBullets = (description: string | undefined, color: string) => {
  if (!description) return null;
  return (
    <ul className="space-y-1.5">
      {description
        .split('\n')
        .filter((line) => line.trim())
        .map((line, i) => (
          <li key={i} className="flex items-start text-sm" style={{ color }}>
            <span className="mr-2">•</span>
            <span>{line.trim().replace(/^[•\-]\s*/, '')}</span>
          </li>
        ))}
    </ul>
  );
};

// ── <br> separated list for Languages, Certifications, Interests ─────────────
export const renderBrList = (value: string | undefined, color: string) => {
  if (!value) return null;
  const items = value.split(/,|\n/).map((item) => item.trim()).filter(Boolean);
  return (
    <p className="text-sm" style={{ color }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {item}
          {i < items.length - 1 && <br />}
        </React.Fragment>
      ))}
    </p>
  );
};

// ── Additional Info block (Languages, Certifications, Interests) ─────────────
interface AdditionalInfo {
  languages?: string;
  certifications?: string;
  interests?: string;
}

export const renderAdditionalInfo = (
  additional_info: AdditionalInfo | undefined,
  options: { color: string; renderSectionHeader: (title: string) => React.ReactNode }
) => {
  if (!additional_info) return null;
  const { color, renderSectionHeader } = options;
  const sections = [
    { key: 'languages',      label: 'LANGUAGES'      },
    { key: 'certifications', label: 'CERTIFICATIONS' },
    { key: 'interests',      label: 'INTERESTS'      },
  ] as const;

  return (
    <>
      {sections.map(({ key, label }) => {
        const value = additional_info[key];
        if (!value) return null;
        return (
          <div key={key} className="mb-8">
            {renderSectionHeader(label)}
            {renderBrList(value, color)}
          </div>
        );
      })}
    </>
  );
};