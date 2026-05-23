import React, { useState } from 'react';
import { X, FilePenLineIcon, Check } from 'lucide-react';

interface CoverLetter {
  _id: string;
  title: string;
  updatedAt: string;
  header_color?: string;
}

interface CoverLetterSidebarProps {
  coverLetters: CoverLetter[];
  isLoading: boolean;
  onClose: () => void;
  onSelect: (coverLetterId: string) => void;
  onCreate: (title: string) => void;
}

const CoverLetterSidebar: React.FC<CoverLetterSidebarProps> = ({
  coverLetters,
  isLoading,
  onClose,
  onSelect,
  onCreate
}) => {
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleCreateClick = () => {
    setShowCreatePopup(true);
  };

  const handleCreateSubmit = () => {
    if (newTitle.trim()) {
      onCreate(newTitle.trim());
      setNewTitle('');
      setShowCreatePopup(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-900">Cover Letters</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2c2a63]"></div>
            </div>
          ) : coverLetters.length === 0 ? (
            <div className="text-center py-12">
              <FilePenLineIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No cover letters created yet</h3>
              <p className="text-gray-500 mb-6 text-sm">Create your first cover letter to get started</p>
              <button
                onClick={handleCreateClick}
                className="px-6 py-3 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#1f1d4a] transition-colors font-semibold"
              >
                Create Cover Letter
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {coverLetters.map((coverLetter) => {
                  const themeColors = ["#2c2a63", "#EDC9AF", "#5b8fb9", "#c9a77c", "#3d5a80"];
                  const baseColor = coverLetter.header_color || themeColors[0];

                  return (
                    <button
                      key={coverLetter._id}
                      onClick={() => onSelect(coverLetter._id)}
                      className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#2c2a63] hover:shadow-md transition-all group text-left"
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${baseColor}20` }}
                      >
                        <FilePenLineIcon
                          className="w-6 h-6"
                          style={{ color: baseColor }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#2c2a63]">
                          {coverLetter.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Updated {new Date(coverLetter.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <Check className="w-5 h-5 text-[#2c2a63] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleCreateClick}
                className="w-full py-3 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#1f1d4a] transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <span className="text-xl">+</span> Create New Cover Letter
              </button>
            </>
          )}
        </div>
      </div>

      {/* Create Popup */}
      {showCreatePopup && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowCreatePopup(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
              <button
                onClick={() => setShowCreatePopup(false)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <h2 className="text-2xl font-bold text-[#2c2a63] mb-6">Create a Cover Letter</h2>

              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter cover letter title"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-2 focus:ring-[#2c2a63]/20 outline-none transition-all mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateSubmit()}
              />

              <button
                onClick={handleCreateSubmit}
                disabled={!newTitle.trim()}
                className="w-full py-3 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#1f1d4a] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Cover Letter
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CoverLetterSidebar;