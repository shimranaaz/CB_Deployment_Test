import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface PendingEditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditPrevious: () => void;
  onUpgrade: () => void;
  userPlan: string;
  pendingEditsCount: number;
}

const PendingEditsModal: React.FC<PendingEditsModalProps> = ({
  isOpen,
  onClose,
  onEditPrevious,
  onUpgrade,
  userPlan,
  pendingEditsCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-yellow-600" />
        </div>

        <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Personal Info Edit Limit Reached
        </h3>

        <p className="text-center text-gray-600 mb-4">
          You've reached your <span className="font-semibold text-[#2c2a63]">{userPlan}</span> plan limit with {pendingEditsCount} personal info edit chance{pendingEditsCount > 1 ? 's' : ''} remaining.
        </p>

        <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-800">
              You can still edit: Experience, Education, Skills, Projects, and Additional Info freely.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {pendingEditsCount > 0 && (
            <button
              onClick={onEditPrevious}
              className="w-full bg-white border-2 border-[#2c2a63] text-[#2c2a63] py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Your Previous Resume
            </button>
          )}

          <button
            onClick={onUpgrade}
            className="w-full bg-[#2c2a63] text-[#EDC9AF] py-3 px-6 rounded-lg font-semibold hover:bg-[#1f1d4a] transition-all"
          >
            Upgrade Plan
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-all"
          >
            Continue Editing Other Sections
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingEditsModal;