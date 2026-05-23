import React from 'react';
import careerImg from '/assets/Services/careercoachpromo.png'; 

const CareerPromo: React.FC = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={{ background: '#ffffff' }}
    >
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-xs sm:text-sm"
          style={{
            background: '#2c2a63',
            color: '#EDC9AF',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="sm:w-5 sm:h-5"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Back to Home</span>
        </button>
      </div>

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
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center relative z-10 mt-16 sm:mt-0">
        
        {/* Left Content */}
        <div className="space-y-6 text-center md:text-left px-2">
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight"
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
          <div className="relative z-10 bg-white/50 backdrop-blur-sm rounded-3xl p-3 shadow-2xl max-w-md mx-auto h-[320px] sm:h-[400px] md:h-[480px] overflow-hidden flex items-center justify-center">

            <img
              src={careerImg}
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
  );
};

export default CareerPromo;
