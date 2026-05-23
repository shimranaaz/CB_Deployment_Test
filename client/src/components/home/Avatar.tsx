import React, { useState } from "react";

const Avatar: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <>
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-6xl rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 px-6 py-6 bg-[#F5F5F5] mb-8">

          {/* LEFT - AVATARS */}
          <div className="flex items-center">
            {Array(1)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className={`w-50 h-14 overflow-hidden ${index !== 0 ? "-ml-4" : ""
                    }`}
                >
                  <img
                    src="/assets/Services/avatar.jpg"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
          </div>

          {/* CENTER - TEXT */}
          <div className="text-center md:text-left flex-1">
            <h3 className="text-lg font-semibold text-[#2c2a63]">
              Need some advice?
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              98% of our coaching clients receive a job offer within 12 weeks.
            </p>
          </div>

          {/* RIGHT - BUTTON */}
          <div>
            <button
              onClick={openPopup}
              className="px-6 py-3 rounded-lg font-semibold transition hover:opacity-90"
              style={{
                backgroundColor: "#2c2a63",
                color: "#EDC9AF",
              }}
            >
              Find your coach
            </button>
          </div>
        </div>
      </div>

      {/* POPUP MODAL */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={closePopup}
        >
          <div
            className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all"
              style={{ color: '#2c2a63' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Popup Content */}
            <div className="min-h-[500px] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-white">
              {/* Decorative Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-1/4 w-16 h-16 bg-[#2c2a63]/15 rounded-full blur-lg"></div>
                <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-[#2c2a63]/20 rounded-full blur-xl"></div>
                <div className="absolute top-1/3 left-12 w-12 h-12 bg-[#2c2a63]/20 rotate-45"></div>
                <div className="absolute bottom-1/4 right-12 w-6 h-6 bg-[#2c2a63]/25 rounded-full"></div>
                <div className="absolute top-16 right-1/3 text-2xl font-light" style={{ color: '#2c2a63', opacity: 0.3 }}>+</div>
                <div className="absolute bottom-1/3 left-1/4 text-3xl font-light" style={{ color: '#2c2a63', opacity: 0.25 }}>×</div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2">
                  <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-[#2c2a63]/25"></div>
                    ))}
                  </div>
                </div>
                <div className="absolute top-12 right-12">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#2c2a63" opacity="0.2">
                    <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                  </svg>
                </div>
              </div>

              {/* Main Content */}
              <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center relative z-10">

                {/* Left Content */}
                <div className="space-y-6 text-center md:text-left px-2">
                  <h1
                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
                    style={{ color: '#2c2a63' }}
                  >
                    Career Coach Coming Soon
                  </h1>

                  <p
                    className="text-base sm:text-lg md:text-xl leading-relaxed max-w-md mx-auto md:mx-0"
                    style={{ color: '#2c2a63' }}
                  >
                    Personalized career coaching to help you achieve your goals. Launching soon!
                  </p>
                </div>

                {/* Right Image */}
                <div className="relative px-4 sm:px-0">
                  <div className="relative z-10 bg-white/50 backdrop-blur-sm rounded-3xl p-3 shadow-2xl max-w-md mx-auto h-[280px] sm:h-[320px] md:h-[380px] overflow-hidden flex items-center justify-center">
                    <img
                      src="/assets/Services/careercoachpromo.png"
                      alt="Career coaching consultation"
                      className="h-full w-auto object-cover rounded-2xl"
                    />
                  </div>

                  <div className="text-center mt-6 z-20 relative">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: '#2c2a63' }}>
                      CareerCoach
                    </h2>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Avatar;