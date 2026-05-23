import React, { useState, useEffect } from 'react';
import { Crown, X } from 'lucide-react';

const ProStatusManager: React.FC = () => {
  const [isPro, setIsPro] = useState(false);
  const [showManager, setShowManager] = useState(false);

  useEffect(() => {
    // Check pro status on mount
    const proStatus = localStorage.getItem('isPro') === 'true';
    setIsPro(proStatus);
  }, []);

  const activatePro = () => {
    localStorage.setItem('isPro', 'true');
    localStorage.setItem('proExpiresAt', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
    setIsPro(true);
    alert('Pro status activated! Reload the page to see changes.');
  };

  const deactivatePro = () => {
    localStorage.removeItem('isPro');
    localStorage.removeItem('proExpiresAt');
    setIsPro(false);
    alert('Pro status deactivated! Reload the page to see changes.');
  };

  const clearAllUnlocks = () => {
    localStorage.removeItem('unlockedTemplates');
    alert('All template unlocks cleared! Reload the page to see changes.');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setShowManager(!showManager)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all z-50 ${
          isPro
            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
            : 'bg-gradient-to-br from-gray-600 to-gray-700'
        } text-white hover:scale-110`}
        title="Pro Status Manager (Testing Tool)"
      >
        <Crown className="w-6 h-6" />
      </button>

      {/* Manager Panel */}
      {showManager && (
        <div className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl p-6 w-80 z-50 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Pro Status Manager</h3>
            <button
              onClick={() => setShowManager(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Current Status */}
            <div className={`p-3 rounded-lg ${
              isPro ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50 border border-gray-200'
            }`}>
              <p className="text-sm font-medium">
                Status: {isPro ? (
                  <span className="text-purple-600">👑 PRO Active</span>
                ) : (
                  <span className="text-gray-600">Free Plan</span>
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {!isPro ? (
                <button
                  onClick={activatePro}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Activate Pro (Test)
                </button>
              ) : (
                <button
                  onClick={deactivatePro}
                  className="w-full py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-all"
                >
                  Deactivate Pro
                </button>
              )}

              <button
                onClick={clearAllUnlocks}
                className="w-full py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
              >
                Clear All Unlocks
              </button>
            </div>

            {/* Info */}
            <div className="text-xs text-gray-500 mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <strong>Testing Tool:</strong> This uses localStorage. Remove this component in production!
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProStatusManager;