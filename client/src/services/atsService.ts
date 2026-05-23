const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://deployment-careerblueprint.onrender.com/api';

export interface ATSAnalysisResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    atsScore: number;
    detailedReport: {
      content: {
        score: number;
        atsParseRate: number;
        quantifyingImpact: number;
        repetition: number;
        spellingGrammar: number;
      };
      sections: {
        score: number;
        issues: string[];
      };
      atsEssentials: {
        score: number;
        issues: string[];
      };
      tailoring: {
        score: number;
        issues: string[];
      };
    };
  };
}

export const uploadAndAnalyzeResume = async (
  file: File,
  fullName: string,
  email: string,
  mobile: string
): Promise<ATSAnalysisResponse> => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('fullName', fullName);
  formData.append('email', email);
  formData.append('mobile', mobile);

  try {
    const response = await fetch(`${API_BASE_URL}/ats/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to analyze resume');
    }

    return await response.json();
  } catch (error) {
    console.error('ATS Upload Error:', error);
    throw error;
  }
};

export const getATSReport = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ats/report/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch ATS report');
    }

    return await response.json();
  } catch (error) {
    console.error('Get ATS Report Error:', error);
    throw error;
  }
};