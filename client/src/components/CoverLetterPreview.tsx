import React from 'react';
import { CoverLetterData } from '../types/coverLetter';

interface CoverLetterPreviewProps {
  data: CoverLetterData;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ data }) => {
  const headerColor = data.header_color || '#2c2a63';

  return (
    <div className="w-full bg-transparent">
      <div
        id="cover-letter-preview"
        className="cover-letter-preview bg-white shadow-lg rounded-lg overflow-hidden mx-auto print:shadow-none print:border-none"
        style={{ maxWidth: '21cm', width: '100%' }}
      >
        {/* Header */}
        <div 
          className="p-5 text-white"
          style={{ backgroundColor: headerColor }}
        >
          <h1 className="text-2xl font-bold mb-2">
            {data.contact_info?.full_name || 'Your Name'}
          </h1>
          <div className="space-y-0.5 text-sm leading-snug">
            {data.contact_info?.phone && (
              <p>{data.contact_info.phone}</p>
            )}
            {data.contact_info?.email && (
              <p>{data.contact_info.email}</p>
            )}
            {data.contact_info?.linkedin && (
              <p className="break-all">{data.contact_info.linkedin}</p>
            )}
            {(data.contact_info?.city || data.contact_info?.state || data.contact_info?.postal_code) && (
              <p>
                {[data.contact_info.city, data.contact_info.state, data.contact_info.postal_code]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-sm">
          {/* Recipient Info */}
          {(data.contact_info?.date || data.recipient_info?.manager_name || data.recipient_info?.job_title || 
            data.recipient_info?.company_name || data.recipient_info?.company_address ||
            data.recipient_info?.city || data.recipient_info?.state || data.recipient_info?.postal_code) && (
            <div className="space-y-0.5 leading-snug mb-4">
              {data.contact_info?.date && (
                <p className="text-xs mb-2">{data.contact_info.date}</p>
              )}
              {data.recipient_info?.manager_name && (
                <p className="font-semibold">{data.recipient_info.manager_name}</p>
              )}
              {data.recipient_info?.job_title && (
                <p>{data.recipient_info.job_title}</p>
              )}
              {data.recipient_info?.company_name && (
                <p>{data.recipient_info.company_name}</p>
              )}
              {data.recipient_info?.company_address && (
                <p>{data.recipient_info.company_address}</p>
              )}
              {(data.recipient_info?.city || data.recipient_info?.state || data.recipient_info?.postal_code) && (
                <p>
                  {[data.recipient_info.city, data.recipient_info.state, data.recipient_info.postal_code]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Salutation */}
          <p>
            {data.opening?.greeting || 'Dear Hiring Manager'},
          </p>

          {/* Opening Paragraph */}
          {(data.opening?.position_title || data.opening?.how_found || data.opening?.summary) && (
            <p className="leading-relaxed">
              {data.opening.position_title && data.opening.how_found && (
                <>I am applying for the {data.opening.position_title} position at{' '}
                {data.recipient_info?.company_name || 'your company'}, which I found through {data.opening.how_found}. </>
              )}
              {data.opening.summary}
            </p>
          )}

          {/* Body Paragraphs */}
          {(data.body?.skill_1 || data.body?.skill_2 || data.body?.experience_summary) && (
            <p className="leading-relaxed">
              {data.body.skill_1 && <>{data.body.skill_1} </>}
              {data.body.skill_2 && <>{data.body.skill_2} </>}
              {data.body.experience_summary && <>{data.body.experience_summary}</>}
            </p>
          )}

          {/* Why Company */}
          {data.body?.why_company && (
            <p className="leading-relaxed">
              {data.body.why_company}
            </p>
          )}

          {/* Closing */}
          {(data.closing?.enthusiasm || data.closing?.next_step) && (
            <p className="leading-relaxed">
              {data.closing.enthusiasm && <>{data.closing.enthusiasm} </>}
              {data.closing.next_step}
            </p>
          )}

          {/* Sign-off */}
          <div className="mt-4">
            <p>{data.closing?.sign_off || 'Best regards'},</p>
            <p className="mt-3 font-semibold">{data.contact_info?.full_name || 'Your Name'}</p>
          </div>
        </div>
      </div>

      <style>{`
        @page {
          size: letter;
          margin: 0;
        }
        @media print {
          html, body {
            width: 8.5in;
            height: 11in;
            overflow: hidden;
          }
          body * { 
            visibility: hidden; 
          }
          #cover-letter-preview, #cover-letter-preview * { 
            visibility: visible; 
          }
          #cover-letter-preview {
            position: absolute;
            left: 0; 
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
            max-width: 100% !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CoverLetterPreview;