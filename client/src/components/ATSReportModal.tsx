import React from 'react';
import { X, FileText } from 'lucide-react';

interface ATSSubmission {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  resumePath: string;
  atsScore: number;
  detailedReport?: {
    keywordsMatch?: { score: number; percentage: number };
    skillsSection?: { score: number; percentage: number };
    experienceRelevance?: { score: number; percentage: number };
    educationCertifications?: { score: number; percentage: number };
    resumeFormatting?: { score: number; percentage: number };
    projectsAchievements?: { score: number; percentage: number };
    content?: {
      score: number;
      atsParseRate: number;
      quantifyingImpact: number;
      repetition: number;
      spellingGrammar: number;
    };
    sections?: {
      score: number;
      issues: string[];
    };
    atsEssentials?: {
      score: number;
      issues: string[];
    };
    tailoring?: {
      score: number;
      issues: string[];
    };
  };
  feedback?: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
  createdAt: string;
}

interface Props {
  submission: ATSSubmission;
  onClose: () => void;
}

const ATSReportModal: React.FC<Props> = ({ submission, onClose }) => {
  const getScoreColor = (score: number): string => {
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 75) return 'Excellent';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[80] overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col">
          
          {/* Header with Logo */}
          <div className="bg-gradient-to-r from-[#2c2a63] to-[#443d7c] px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img 
                src="/Logo.png" 
                alt="Logo" 
                className="h-10 w-auto"
              />
              <div className="text-white">
                <h3 className="text-xl font-bold">ATS Resume Analysis Report</h3>
                <p className="text-xs text-gray-300 mt-0.5">{submission.fullName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} className="text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="grid lg:grid-cols-5 gap-4 p-4">
              
              {/* Left Sidebar - Score */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-5 sticky top-4">
                  
                  {/* Circular Score */}
                  <div className="text-center mb-4">
                    <div className="relative w-40 h-40 mx-auto mb-3">
                      <svg width="160" height="160" className="transform -rotate-90">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth={14} />
                        <circle 
                          cx="80" 
                          cy="80" 
                          r="70" 
                          fill="none" 
                          stroke={getScoreColor(submission.atsScore)}
                          strokeWidth={14}
                          strokeDasharray={`${2 * Math.PI * 70}`}
                          strokeDashoffset={`${2 * Math.PI * 70 * (1 - submission.atsScore / 100)}`}
                          className="transition-all duration-1000"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div 
                          className="text-5xl font-bold" 
                          style={{ color: getScoreColor(submission.atsScore) }}
                        >
                          {submission.atsScore}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">ATS Score</div>
                      </div>
                    </div>
                    <div 
                      className="text-sm font-bold px-3 py-1.5 rounded-full inline-block"
                      style={{ 
                        backgroundColor: submission.atsScore >= 75 ? '#d1fae5' : submission.atsScore >= 50 ? '#fef3c7' : '#fee2e2',
                        color: submission.atsScore >= 75 ? '#065f46' : submission.atsScore >= 50 ? '#92400e' : '#991b1b'
                      }}
                    >
                      {getScoreLabel(submission.atsScore)}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mb-3">
                    <h4 className="font-bold text-[#2c2a63] text-sm">Resume Strength</h4>
                  </div>

                  {/* Score Breakdown */}
                  <div className="space-y-1 mb-4">
                    <h5 className="font-bold text-gray-800 text-xs mb-2">Score Breakdown</h5>
                    {submission.detailedReport && [
                      { label: 'Keywords', data: submission.detailedReport.keywordsMatch, color: '#3b82f6' },
                      { label: 'Skills', data: submission.detailedReport.skillsSection, color: '#10b981' },
                      { label: 'Experience', data: submission.detailedReport.experienceRelevance, color: '#8b5cf6' },
                      { label: 'Education', data: submission.detailedReport.educationCertifications, color: '#f59e0b' },
                      { label: 'Formatting', data: submission.detailedReport.resumeFormatting, color: '#14b8a6' },
                      { label: 'Projects', data: submission.detailedReport.projectsAchievements, color: '#ef4444' }
                    ].filter(item => item.data).map((item, idx) => (
                      <div key={idx} className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                          <span className="text-xs font-bold" style={{ color: item.color }}>
                            {item.data!.percentage}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-1000"
                            style={{ 
                              width: `${item.data!.score}%`,
                              backgroundColor: item.color
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Contact Info */}
                  <div className="pt-3 border-t border-gray-200 space-y-1.5 text-xs">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-semibold text-[#2c2a63] break-all text-xs">{submission.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Mobile:</span>
                      <p className="font-semibold text-[#2c2a63]">{submission.mobile}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Submitted:</span>
                      <p className="font-semibold text-[#2c2a63]">{formatDate(submission.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - PDF Preview */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={18} className="text-[#2c2a63]" />
                    <h4 className="text-base font-bold text-[#2c2a63]">Resume Preview</h4>
                  </div>
                  
                  {submission.resumePath ? (
                    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-inner" style={{ height: '68vh' }}>
                      <iframe
                        src={`http://localhost:5000/${submission.resumePath.replace(/\\/g, '/')}`}
                        className="w-full h-full border-0"
                        title="Resume PDF Preview"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                      <div className="text-center">
                        <FileText size={48} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Resume preview not available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 px-6 py-3 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#2c2a63] text-white rounded-lg hover:bg-[#1f1d4f] transition-colors font-semibold text-sm"
            >
              Close Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSReportModal;