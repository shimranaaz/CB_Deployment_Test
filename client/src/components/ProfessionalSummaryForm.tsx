import { Loader2, Sparkles } from 'lucide-react';
import React, { useState, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';
import { ResumeData } from '../types/resume';

interface ProfessionalSummaryFormProps {
  data: string;
  onChange: (value: string) => void;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

interface RootState {
  auth: {
    token: string;
  };
}

interface EnhanceProfessionalSummaryResponse {
  enhancedContent: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

const ProfessionalSummaryForm: React.FC<ProfessionalSummaryFormProps> = ({
  data,
  onChange,
  setResumeData
}) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const MAX_CHARACTERS = 2000;
  const charCount = data?.length || 0;
  const isOverLimit = charCount > MAX_CHARACTERS;

  const generateSummary = async (): Promise<void> => {
    try {
      setIsGenerating(true);
      const prompt = `enhance my professional summary "${data}"`;
      const response = await api.post<EnhanceProfessionalSummaryResponse>(
        '/ai/enhance-pro-sum',
        { userContent: prompt },
        { headers: { Authorization: token } }
      );
      setResumeData(prev => ({
        ...prev,
        professional_summary: response.data.enhancedContent
      }));
      toast.success('Summary enhanced successfully!');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || apiError.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const newValue = e.target.value;

    if (newValue.length <= MAX_CHARACTERS) {
      onChange(newValue);
    } else {
      toast.error('More than 2000 characters not allowed');
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
            Professional Summary
          </h3>
          <p className='text-sm text-gray-500'>Add summary for your resume here</p>
        </div>

        <button
          type="button"
          disabled={isGenerating || !data?.trim()}
          onClick={generateSummary}
          className='flex items-center gap-2 px-3 py-1 text-sm bg-[#EDC9AF] text-[#2c2a63] rounded hover:bg-[#e0b89f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium'
        >
          {isGenerating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {isGenerating ? "Enhancing..." : "AI Enhance"}
        </button>
      </div>

      <div className="mt-6">
        <div className="relative">
          <textarea
            value={data || ""}
            onChange={handleChange}
            rows={7}
            className={`w-full p-3 px-4 border text-sm rounded-lg outline-none transition-all resize-none ${isOverLimit
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : charCount > 0
                  ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            placeholder='Write a compelling professional summary that highlights your key strengths and career objectives...'
          />

          {/* Character Counter */}
          <div className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded ${isOverLimit ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            }`}>
            {charCount}/{MAX_CHARACTERS}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSummaryForm;