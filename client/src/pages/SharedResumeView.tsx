import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import api from '../configs/api';
import ResumePreview from '../components/ResumePreview';
import PricingModal from '../components/home/PricingModal';
import { ResumeData } from '../types/resume';

const FREE_TEMPLATES = ['modern-two-column', 'digital-pro'];

const SharedResumeView: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const resumeDataRef = useRef(resumeData);
  useEffect(() => { resumeDataRef.current = resumeData; }, [resumeData]);


  useEffect(() => {
    const handlePrintAttempt = (): boolean => {
      const currentTemplate = resumeDataRef.current?.template || 'geometric-blue';
      const isFreeTemplate = FREE_TEMPLATES.includes(currentTemplate);

      if (isFreeTemplate) {
        return true;
      }
      setShowPremiumModal(true);
      return false;
    };

    const blockPrint = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        const allowed = handlePrintAttempt();
        if (!allowed) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
    };

    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const blockBeforePrint = () => {
      const allowed = handlePrintAttempt();
      if (!allowed) {
        const style = document.createElement('style');
        style.id = 'print-block-style';
        style.innerHTML = `
          @media print {
            html, body, * { display: none !important; visibility: hidden !important; }
          }
        `;
        document.head.appendChild(style);
      }
    };

    const unblockAfterPrint = () => {
      const style = document.getElementById('print-block-style');
      if (style) style.remove();
    };

    document.addEventListener('keydown', blockPrint, { capture: true });
    document.addEventListener('contextmenu', blockContextMenu);
    window.addEventListener('beforeprint', blockBeforePrint);
    window.addEventListener('afterprint', unblockAfterPrint);

    return () => {
      document.removeEventListener('keydown', blockPrint, { capture: true });
      document.removeEventListener('contextmenu', blockContextMenu);
      window.removeEventListener('beforeprint', blockBeforePrint);
      window.removeEventListener('afterprint', unblockAfterPrint);
    };
  }, []);


  useEffect(() => {
    const fetchPublicResume = async () => {
      if (!resumeId) {
        setError('Invalid resume ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data } = await api.get(`/resumes/public/${resumeId}`);

        if (data.resume && data.resume.public) {
          setResumeData(data.resume);
        } else {
          setError('This resume is not public or does not exist');
        }
      } catch (error: any) {
        console.error('Error fetching public resume:', error);
        if (error.response?.status === 404) {
          setError('Resume not found');
        } else if (error.response?.status === 403) {
          setError('This resume is private');
        } else {
          setError('Failed to load resume');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicResume();
  }, [resumeId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c2a63] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
            <p className="text-red-600 mb-6 text-lg">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#2c2a63] text-[#EDC9AF] px-6 py-3 rounded-lg hover:bg-[#1f1d4a] transition-colors font-medium"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">No resume data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-white text-[#2c2a63] px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all font-medium border border-gray-200"
        >
          <Home className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ResumePreview
            data={resumeData}
            template={resumeData.template || 'geometric-blue'}
            accentColor={resumeData.accent_color || '#2c2a63'}
          />
        </div>
      </div>

      {showPremiumModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 relative">

            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mx-auto mb-5">
              <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-center text-[#2c2a63] mb-2">
              Premium Template
            </h2>

            <p className="text-center text-gray-500 text-sm mb-6 leading-relaxed">
              This is a <span className="font-semibold text-[#2c2a63]">premium template</span>.
              To use this template you need to upgrade your plan.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowPremiumModal(false);
                  setShowPricingModal(true);
                }}
                className="w-full py-3 rounded-xl font-semibold text-[#EDC9AF] bg-[#2c2a63] hover:bg-[#1f1d4a] transition-all shadow-md"
              >
                Upgrade Plan
              </button>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="w-full py-3 rounded-xl font-semibold text-[#2c2a63] border-2 border-[#2c2a63] hover:bg-[#2c2a63] hover:text-[#EDC9AF] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />

    </div>
  );
};

export default SharedResumeView;