import React from 'react';
import { ResumeData } from '../types/resume';

interface ProgressBarProps {
  resumeData: ResumeData;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ resumeData }) => {
  // Calculate progress for each section
  const calculateProgress = (): number => {
    let totalProgress = 0;

    // Personal Info (15%)
    if (resumeData.personal_info?.full_name?.trim()) {
      totalProgress += 7.5;
    }
    if (resumeData.personal_info?.email?.trim()) {
      totalProgress += 7.5;
    }

    // Professional Summary (10%)
    if (resumeData.professional_summary?.trim()) {
      totalProgress += 10;
    }

    // Experience (20%)
    if (resumeData.experience && resumeData.experience.length > 0) {
      const validExperiences = resumeData.experience.filter(
        exp => exp.company?.trim() && exp.position?.trim()
      );
      if (validExperiences.length > 0) {
        totalProgress += 20;
      }
    }

    // Education (15%)
    if (resumeData.education && resumeData.education.length > 0) {
      const validEducation = resumeData.education.filter(
        edu => edu.institution?.trim() && edu.degree?.trim()
      );
      if (validEducation.length > 0) {
        totalProgress += 15;
      }
    }

    // Projects (15%)
    if (resumeData.projects && resumeData.projects.length > 0) {
      const validProjects = resumeData.projects.filter(
        proj => proj.name?.trim()
      );
      if (validProjects.length > 0) {
        totalProgress += 15;
      }
    }

    // Skills (15%)
    if (resumeData.skills && resumeData.skills.length > 0) {
      const validSkills = resumeData.skills.filter(
        skill => skill?.trim()
      );
      if (validSkills.length > 0) {
        totalProgress += 15;
      }
    }

    // Additional Info (10%)
    const additionalInfo = resumeData.additional_info || {};
    const hasAdditionalInfo = Object.keys(additionalInfo).some(key => {
      const value = additionalInfo[key as keyof typeof additionalInfo];
      return value && typeof value === 'string' && value.trim() !== '';
    });
    
    if (hasAdditionalInfo) {
      totalProgress += 10;
    }

    return Math.min(Math.round(totalProgress), 100);
  };

  const progress = calculateProgress();

  // Determine color based on progress
  const getProgressColor = (): string => {
    return '#2c2a63'; // Theme color for all progress levels
  };

  const progressColor = getProgressColor();

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-[#2c2a63]/5 to-[#EDC9AF]/10 rounded-lg border border-[#EDC9AF]/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ 
              backgroundColor: progressColor + '20',
              color: progressColor 
            }}
          >
            {progress}%
          </div>
          <div>
            <p className="text-sm font-semibold text-[#2c2a63]">Your resume score</p>
            <p className="text-xs text-gray-600">
              {progress < 30 && 'Add more details to improve'}
              {progress >= 30 && progress < 60 && 'Good start! Keep going'}
              {progress >= 60 && progress < 90 && 'Almost there!'}
              {progress >= 90 && progress < 100 && 'Excellent progress!'}
              {progress === 100 && 'Perfect! Resume complete'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">
            {progress < 100 ? `+${100 - progress}%` : '✓'} Complete
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2.5 bg-[#EDC9AF]/30 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: progressColor
          }}
        />
      </div>

      {/* Section Hints - Only show if progress < 100 */}
      {progress < 100 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {!resumeData.personal_info?.full_name && (
            <span className="text-xs px-2 py-1 bg-[#EDC9AF] text-[#2c2a63] rounded-full">
              + Add name
            </span>
          )}
          {!resumeData.professional_summary && (
            <span className="text-xs px-2 py-1 bg-[#EDC9AF] text-[#2c2a63] rounded-full">
              + Add summary
            </span>
          )}
          {(!resumeData.experience || resumeData.experience.length === 0) && (
            <span className="text-xs px-2 py-1 bg-[#EDC9AF] text-[#2c2a63] rounded-full">
              + Add experience
            </span>
          )}
          {(!resumeData.education || resumeData.education.length === 0) && (
            <span className="text-xs px-2 py-1 bg-[#EDC9AF] text-[#2c2a63] rounded-full">
              + Add education
            </span>
          )}
          {(!resumeData.skills || resumeData.skills.length === 0) && (
            <span className="text-xs px-2 py-1 bg-[#EDC9AF] text-[#2c2a63] rounded-full">
              + Add skills
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;