import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react';
import React, { useState, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';
import { Experience } from '../types/resume';

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

interface RootState {
  auth: {
    token: string;
  };
}

interface EnhanceJobDescResponse {
  enhancedContent: string;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ data, onChange }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [generatingIndex, setGeneratingIndex] = useState<number>(-1);

  const addExperience = (): void => {
    const newExperience: Experience = {
      company: "",
      position: "",
      start_date: "",
      end_date: undefined,
      description: "",
      is_current: false
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (index: number): void => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const getTodayYYYYMM = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | boolean): void => {
    const updated = [...data];

    if (field === "is_current") {
      updated[index] = {
        ...updated[index],
        is_current: value as boolean,
        end_date: (value as boolean) ? undefined : updated[index].end_date
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }

    onChange(updated);
  };

  const generateDescription = async (index: number): Promise<void> => {
    setGeneratingIndex(index);
    const experience = data[index];
    const prompt = `enhance this job description ${experience.description} for the position of ${experience.position} at ${experience.company}.`;

    try {
      const response = await api.post<EnhanceJobDescResponse>(
        '/ai/enhance-job-desc',
        { userContent: prompt },
        { headers: { Authorization: token } }
      );
      updateExperience(index, "description", response.data.enhancedContent);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An error occurred');
      }
    } finally {
      setGeneratingIndex(-1);
    }
  };

  const formatDateDisplay = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const [year, month] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
            Professional Experience
          </h3>
          <p className='text-sm text-gray-500'>Add your job experience</p>
        </div>
        {/* ✅ UPDATED - Add Experience button with Navy background and Sandle text */}
        <button
          onClick={addExperience}
          type="button"
          className='flex items-center gap-2 px-3 py-1 text-sm bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#1f1d4a] transition-colors font-medium'
        >
          <Plus className="size-4" />
          Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No work experience added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {data.map((experience, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className='flex justify-between items-start'>
                <h4 className="font-medium text-gray-700">Experience #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className='text-red-500 hover:text-red-700 transition-colors'
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className='grid md:grid-cols-2 gap-3'>
                <input
                  value={experience.company || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateExperience(index, "company", e.target.value)
                  }
                  type="text"
                  placeholder="Company Name"
                  className="px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />

                <input
                  value={experience.position || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateExperience(index, "position", e.target.value)
                  }
                  type="text"
                  placeholder="Job Title"
                  className="px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Start Date <span className="text-gray-400">(MM/YYYY)</span>
                  </label>
                  <input
                    value={experience.start_date || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateExperience(index, "start_date", e.target.value)
                    }
                    type="month"
                    max={getTodayYYYYMM()}
                    className="px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    End Date <span className="text-gray-400">(MM/YYYY)</span>
                    {experience.is_current && <span className="text-green-600 font-medium ml-1">(Present)</span>}
                  </label>
                  <input
                    value={experience.is_current ? "" : (experience.end_date || "")}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateExperience(index, "end_date", e.target.value)
                    }
                    type="month"
                    min={experience.start_date || undefined}
                    max={getTodayYYYYMM()}
                    disabled={experience.is_current}
                    className={`px-3 py-2 text-sm border rounded-lg w-full outline-none ${experience.is_current
                        ? "bg-gray-100 cursor-not-allowed text-gray-500"
                        : "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                  />
                </div>
              </div>

              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type="checkbox"
                  checked={experience.is_current || false}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    updateExperience(index, "is_current", e.target.checked);
                  }}
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer'
                />
                <span className='text-sm text-gray-700'>Currently working here</span>
              </label>

              <div className="space-y-2">
                <div className='flex items-center justify-between'>
                  <label className='text-sm font-medium text-gray-700'>Job Description</label>

                  <button
                    type="button"
                    onClick={() => generateDescription(index)}
                    disabled={generatingIndex === index || !experience.position || !experience.company}
                    className='flex items-center gap-1 px-2 py-1 text-xs bg-[#EDC9AF] text-[#2c2a63] rounded hover:bg-[#e0b89f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium'
                  >
                    {generatingIndex === index ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className='w-3 h-3' />
                    )}
                    Enhance with AI
                  </button>
                </div>
                <textarea
                  value={experience.description || ""}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    updateExperience(index, "description", e.target.value)
                  }
                  rows={4}
                  maxLength={2000}
                  className="w-full text-sm px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Describe your key responsibilities and achievements..."
                />
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Keep it concise and highlight achievements</span>
                  <span className={(experience.description?.length ?? 0) > 1900 ? 'text-orange-600 font-medium' : ''}>
                    {experience.description?.length ?? 0}/2000
                  </span>
                </div>
              </div>

              {/* Preview */}
              {(experience.company || experience.position || experience.start_date) && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Preview:</p>
                  <div className="text-sm text-gray-700">
                    {experience.position && (
                      <p className="font-medium">{experience.position}</p>
                    )}
                    {experience.company && (
                      <p className="text-gray-600">{experience.company}</p>
                    )}
                    {(experience.start_date || experience.end_date || experience.is_current) && (
                      <p className="text-gray-500 text-xs mt-1">
                        {experience.start_date ? formatDateDisplay(experience.start_date) : "Start"} - {" "}
                        {experience.is_current ? "Present" : (experience.end_date ? formatDateDisplay(experience.end_date) : "End")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;