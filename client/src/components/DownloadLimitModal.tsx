import React from 'react';
import { X, AlertCircle, TrendingUp } from 'lucide-react';

interface DownloadLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  userPlan: string;
  downloadCount: number;
  downloadLimit: number;
  previousResumeId?: string;
  hasEditCreditsRemaining?: boolean;
  onEditPreviousResume?: () => void;
}

const DownloadLimitModal: React.FC<DownloadLimitModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  userPlan,
  downloadCount,
  downloadLimit,
  previousResumeId,
  hasEditCreditsRemaining,
  onEditPreviousResume
}) => {
  if (!isOpen) return null;

  const displayCount = downloadCount >= downloadLimit ? downloadLimit : downloadCount;


  const showEditButton = previousResumeId && hasEditCreditsRemaining && onEditPreviousResume;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Download Limit Reached
        </h3>

        {/* Description */}
        <p className="text-center text-gray-600 mb-4">
          Your download limit for the <span className="font-semibold text-[#2c2a63]">{userPlan}</span> plan has been exceeded.
        </p>

        {/* Download Count - FIXED */}
        <p className="text-center text-sm text-gray-500 mb-6">
          You've used <span className="font-bold text-red-600">{displayCount}/{downloadLimit}</span> downloads
        </p>

        {/* Info Box */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#2c2a63] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 font-medium">
              Upgrade to explore more templates and increase your download limits!
            </p>
          </div>
          <ul className="text-sm text-gray-600 space-y-1 ml-7">
            <li>• Advanced Plan: <span className="font-semibold">3 downloads</span></li>
            <li>• Professional Plan: <span className="font-semibold">5 downloads</span></li>
          </ul>
        </div>

        {/* Buttons - Two-row Layout */}
        <div className="space-y-3">
          {/* First Row - Upgrade and Edit (if available) */}
          <div className={`flex gap-3 ${showEditButton ? 'flex-row' : ''}`}>
            {/* Upgrade Button */}
            <button
              onClick={onUpgrade}
              className={`${showEditButton ? 'flex-1' : 'w-full'} bg-[#2c2a63] text-[#EDC9AF] py-3 px-6 rounded-lg font-semibold hover:bg-[#1f1d4a] transition-all shadow-md hover:shadow-lg`}
            >
              Upgrade Now
            </button>

            {/* Edit Previous Resume Button (Conditional) */}
            {showEditButton && (
              <button
                onClick={onEditPreviousResume}
                className="flex-1 bg-[#EDC9AF] text-[#2c2a63] py-3 px-6 rounded-lg font-semibold hover:bg-[#e0b89f] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Previous
              </button>
            )}
          </div>


          <button
            onClick={onClose}
            className="w-full bg-[#2c2a63] border-2 border-[#2c2a63] text-[#EDC9AF] py-3 px-6 rounded-lg font-medium hover:bg-[#1f1d4f] hover:border-[#1f1d4f] transition-all"
          >
            Cancel
          </button>

        </div>
      </div>
    </div>
  );
};

export default DownloadLimitModal;