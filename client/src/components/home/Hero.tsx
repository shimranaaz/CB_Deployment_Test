import React from 'react'
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";


const HERO_IMAGES = [
  '/assets/Services/resume.png',
  '/assets/Services/professional-modern-preview.jpeg',
  '/assets/Services/boardline-cv-preview.jpeg',
];

const CenterImage: React.FC = () => {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActiveIdx(prev => (prev + 1) % HERO_IMAGES.length);
        setAnimating(false);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes heroImgFadeIn{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);}}
        @keyframes heroImgFadeOut{from{opacity:1;transform:translateX(0);}to{opacity:0;transform:translateX(-20px);}}
        .hero-img-enter{animation:heroImgFadeIn 0.4s ease forwards;}
        .hero-img-exit{animation:heroImgFadeOut 0.4s ease forwards;}
      `}</style>
      <img
        key={activeIdx}
        src={HERO_IMAGES[activeIdx]}
        alt="Resume template center"
        className={`relative w-[250px] sm:w-[260px] lg:w-[330px] aspect-[3/4] object-cover shadow-2xl ${animating ? 'hero-img-exit' : 'hero-img-enter'}`}
        style={{ zIndex: 0 }}
      />
    </>
  );
};

const Hero = () => {
  const navigate = useNavigate();

  const handleCreateResume = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/app");
    } else {
      navigate("/login");
    }
  };

  const handleUploadResume = () => {
    navigate("/ats-checker");
  };

  return (
    <section
      id="home"
      className="bg-white"
      style={{ paddingTop: "120px", paddingBottom: "10px" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* HERO MAIN SECTION */}
        <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-2 mb-8 lg:mb-17">

          {/* LEFT IMAGES - 3 Floating Images with 1 Static Center */}
          <div className="w-full lg:w-1/2 order-1 lg:order-1">
            <div className="relative h-[380px] lg:h-[400px] flex items-center justify-center"
              style={{ zIndex: "1" }}>
              {/* Top Left Floating Image */}
              <img
                src="/assets/Services/left.png"
                alt="Resume template 1"
                className="absolute top-[80px] left-[40px] w-24 lg:w-36 shadow-2xl floating-up-1"
                style={{ zIndex: 1 }}
              />

              {/* Top Right Floating Image */}
              <img
                src="/assets/Services/right.png"
                alt="Resume template 2"
                className="
                  absolute
                  top-[10px] sm:top-[15px] lg:top-[20px]
                  right-[10px] sm:right-[40px] lg:right-[80px]
                  w-20 sm:w-24 lg:w-36
                  shadow-2xl
                  floating-down-1
                "
                style={{ zIndex: 1 }}
              />

              {/* Center Auto-Scroll Image */}
              <CenterImage />

              {/* Bottom Center Floating Image */}
              <img
                src="/assets/Services/left1.png"
                alt="Resume template 3"
                className="absolute bottom-[5px] left-[80%] 
                  transform -translate-x-1/2 w-28 lg:w-40 floating-up-2"
                style={{ zIndex: 1 }}
              />
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="w-full lg:w-[45%] order-1 lg:order-1 mb-[10px] space-y-4 sm:space-y-5">

            {/* Heading */}
            <h1
              className="text-2xl sm:text-3xl font-bold leading-snug"
              style={{ color: "#333" }}
            >
              Get 3x More Interview Calls with <br></br>ATS Resume
            </h1>

            {/* Subtext */}
            <p
              className="text-sm sm:text-base font-bold leading-relaxed"
              style={{ color: "#333" }}
            >
              Built for Indian job market | 50+ templates | AI optimized
            </p>

            {/* Stats */}
            <div className="space-y-1">
              <p
                className="text-xs sm:text-sm font-bold flex items-center gap-2"
                style={{ color: "#2c2a63" }}
              >
                <span
                  className="flex items-center justify-center w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#1db954" }}
                >
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </span>
                AI-Powered Optimizer-Approved Designs
              </p>

              <p
                className="text-xs sm:text-sm font-bold flex items-center gap-2"
                style={{ color: "#2c2a63" }}
              >
                <span
                  className="flex items-center justify-center w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#1db954" }}
                >
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </span>
                Professional Templates & Led Career Guidance
              </p>
            </div>

            <div className="flex flex-row gap-3">
              <button
                onClick={handleCreateResume}
                className="inline-block px-4 py-2 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-md"
                style={{ backgroundColor: "#2c2a63", color: "#EDC9AF", fontSize: "clamp(8px, 2.2vw, 14px)" }}
              >
                Create My FREE Resume
              </button>

              <button
                onClick={handleUploadResume}
                className="inline-block px-4 py-2 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-md"
                style={{ backgroundColor: "#2c2a63", color: "#EDC9AF", fontSize: "clamp(8px, 2.2vw, 14px)" }}
              >
                Check Free ATS Score
              </button>
            </div>

            <div className="flex items-center mt-3">
              <div className="flex -space-x-3 pr-3">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[1]" />
                <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="user1" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-2" />
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="user2" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[3]" />
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[4]" />
                <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="user5" className="size-8 rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[5]" />
              </div>

              <div>
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-transparent fill-green-600" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-700">
                  Used by <strong>Sarah, David, Aisha</strong>, and <strong>10,000+</strong> users
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-4 mb-4">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-center" style={{ color: "rgb(44, 42, 99)" }}>
              How our AI resume maker works
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-center mt-1" style={{ color: "#333" }}>
              Create a professional resume in minutes with 4 simple steps
            </p>
          </div>


          <div className="hidden md:block">
            <div className="flex justify-center items-center gap-0">

              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-32 h-32 flex items-center justify-center mb-3">
                  <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: "#2c2a63" }}></div>
                  <div className="absolute inset-[5px] rounded-full border-4" style={{ borderColor: "#EDC9AF" }}></div>
                  <div className="absolute inset-[10px] rounded-full border-4" style={{ borderColor: "#2c2a63" }}></div>
                  <div className="absolute inset-[15px] rounded-full bg-white"></div>
                  <div className="relative z-10">
                    <img src="/assets/Services/ruler-and-pen.png" alt="faPencilAlt" className="w-12 h-12" />
                  </div>
                </div>
                <p className="text-sm font-extrabold uppercase tracking-wide text-center" style={{ color: "#2c2a63" }}>
                  1. CHOOSE &amp; CUSTOMIZE
                  <br /><span className="text-xs font-semibold normal-case">(Find Your Style)</span>
                </p>
              </div>


              <div className="flex-shrink-0" style={{ width: "80px", marginBottom: "60px" }}>
                <div
                  className="border-t-4 border-dotted"
                  style={{ borderColor: "#2c2a63", marginLeft: "-23px", marginRight: "-38px" }}
                ></div>
              </div>


              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-32 h-32 flex items-center justify-center mb-3">
                  <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: "#2c2a63" }}></div>
                  <div className="absolute inset-[5px] rounded-full border-4" style={{ borderColor: "#EDC9AF" }}></div>
                  <div className="absolute inset-[10px] rounded-full border-4" style={{ borderColor: "#2c2a63" }}></div>
                  <div className="absolute inset-[15px] rounded-full bg-white"></div>
                  <div className="relative z-10">
                    <img src="/assets/Services/computer.png" alt="laptop" className="w-12 h-12" />
                  </div>
                </div>
                <p className="text-sm font-extrabold uppercase tracking-wide text-center" style={{ color: "#2c2a63" }}>
                  2. ADD DETAILS &amp; GET AI TIPS
                  <br /><span className="text-xs font-semibold normal-case">(Enhance Content)</span>
                </p>
              </div>


              <div className="flex-shrink-0" style={{ width: "80px", marginBottom: "60px" }}>
                <div
                  className="border-t-4 border-dotted"
                  style={{ borderColor: "#2c2a63", marginLeft: "-38px", marginRight: "-9px" }}
                ></div>
              </div>


              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-32 h-32 flex items-center justify-center mb-3">
                  <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: "#2c2a63" }}></div>
                  <div className="absolute inset-[5px] rounded-full border-4" style={{ borderColor: "#EDC9AF" }}></div>
                  <div className="absolute inset-[10px] rounded-full border-4" style={{ borderColor: "#2c2a63" }}></div>
                  <div className="absolute inset-[15px] rounded-full bg-white"></div>
                  <div className="relative z-10">
                    <img src="/assets/Services/ai-search.png" alt="faRobot" className="w-12 h-12" />
                  </div>
                </div>
                <p className="text-sm font-extrabold uppercase tracking-wide text-center" style={{ color: "#2c2a63" }}>
                  3. OPTIMIZE FOR ATS
                  <br /><span className="text-xs font-semibold normal-case">(Perfect Your Score)</span>
                </p>
              </div>


              <div className="flex-shrink-0" style={{ width: "80px", marginBottom: "60px" }}>
                <div
                  className="border-t-4 border-dotted"
                  style={{ borderColor: "#2c2a63", marginLeft: "-9px", marginRight: "-53px" }}
                ></div>
              </div>


              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-32 h-32 flex items-center justify-center mb-3">
                  <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: "#2c2a63" }}></div>
                  <div className="absolute inset-[5px] rounded-full border-4" style={{ borderColor: "#EDC9AF" }}></div>
                  <div className="absolute inset-[10px] rounded-full border-4" style={{ borderColor: "#2c2a63" }}></div>
                  <div className="absolute inset-[15px] rounded-full bg-white"></div>
                  <div className="relative z-10">
                    <img src="/assets/Services/download-from-cloud.png" alt="Download" className="w-12 h-12" />
                  </div>
                </div>
                <p className="text-sm font-extrabold uppercase tracking-wide text-center" style={{ color: "#2c2a63" }}>
                  4. DOWNLOAD &amp; START APPLYING
                  <br /><span className="text-xs font-semibold normal-case">(Take Action)</span>
                </p>
              </div>
            </div>
          </div>

          <div className="md:hidden flex flex-row justify-center items-start gap-1">


            <div className="flex flex-col items-center flex-1">
              <div className="relative w-16 h-16 flex items-center justify-center mb-1">
                <div className="absolute inset-0 rounded-full" style={{ borderColor: "#2c2a63", borderWidth: "2px", borderStyle: "solid" }}></div>
                <div className="absolute inset-[3px] rounded-full" style={{ borderColor: "#EDC9AF", borderWidth: "2px", borderStyle: "solid" }}></div>
                <div className="absolute inset-[6px] rounded-full" style={{ borderColor: "#2c2a63", borderWidth: "2px", borderStyle: "solid" }}></div>
                <div className="absolute inset-[9px] rounded-full bg-white"></div>
                <div className="relative z-10 w-7 h-7 flex items-center justify-center">
                  <img src="/assets/Services/ruler-and-pen.png" alt="faPencilAlt" className="w-full h-full object-contain" />
                </div>
              </div>
              <p style={{ fontSize: "9px", color: "#2c2a63" }} className="font-extrabold uppercase tracking-tight text-center leading-tight">
                1. CHOOSE & EDIT
              </p>
              <p style={{ fontSize: "8px", color: "#2c2a63" }} className="font-semibold normal-case text-center leading-tight">
                (Find Your Style)
              </p>
            </div>

            <div className="flex flex-col items-center flex-1">
              <div className="relative w-16 h-16 flex items-center justify-center mb-1">
                <div className="absolute inset-0 rounded-full" style={{ borderColor: "#2c2a63", borderWidth: "2px", borderStyle: "solid" }}></div>
                <div className="absolute inset-[3px] rounded-full" style={{ borderColor: "#EDC9AF", borderWidth: "2px", borderStyle: "solid" }}></div>
                <div className="absolute inset-[6px] rounded-full" style={{ borderColor: "#2c2a63", borderWidth: "2px", borderStyle: "solid" }}></div>
                <div className="absolute inset-[9px] rounded-full bg-white"></div>
                <div className="relative z-10 w-7 h-7 flex items-center justify-center">
                  <img src="/assets/Services/computer.png" alt="laptop" className="w-full h-full object-contain" />
                </div>
              </div>
              <p style={{ fontSize: "9px", color: "#2c2a63" }} className="font-extrabold uppercase tracking-tight text-center leading-tight">
                2. PERSONALIZE
              </p>
              <p style={{ fontSize: "8px", color: "#2c2a63" }} className="font-semibold normal-case text-center leading-tight">
                (Enhance Content)
              </p>
            </div>


            <div className="flex flex-col items-center flex-1">
              <div className="relative w-16 h-16 flex items-center justify-center mb-1">
                <div className="absolute inset-0 rounded-full" style={{ borderColor: "#2c2a63", borderWidth: "2px", borderStyle: "solid" }}></div>
                <div className="absolute inset-[3px] rounded-full" style={{ borderColor: "#EDC9AF", borderWidth: "2px", borderStyle: "solid" }}></div>
                <div className="absolute inset-[6px] rounded-full" style={{ borderColor: "#2c2a63", borderWidth: "2px", borderStyle: "solid" }}></div>
                <div className="absolute inset-[9px] rounded-full bg-white"></div>
                <div className="relative z-10 w-7 h-7 flex items-center justify-center">
                  <img src="/assets/Services/ai-search.png" alt="faRobot" className="w-full h-full object-contain" />
                </div>
              </div>
              <p style={{ fontSize: "9px", color: "#2c2a63" }} className="font-extrabold uppercase tracking-tight text-center leading-tight">
                3. OPTIMIZE AI
              </p>
              <p style={{ fontSize: "8px", color: "#2c2a63" }} className="font-semibold normal-case text-center leading-tight">
                (Perfect Your Score)
              </p>
            </div>


            <div className="flex flex-col items-center flex-1">
              <div className="relative w-16 h-16 flex items-center justify-center mb-1">
                <div className="absolute inset-0 rounded-full" style={{ borderColor: "#2c2a63", borderWidth: "2px", borderStyle: "solid" }}></div>
                <div className="absolute inset-[3px] rounded-full" style={{ borderColor: "#EDC9AF", borderWidth: "2px", borderStyle: "solid" }}></div>
                <div className="absolute inset-[6px] rounded-full" style={{ borderColor: "#2c2a63", borderWidth: "2px", borderStyle: "solid" }}></div>
                <div className="absolute inset-[9px] rounded-full bg-white"></div>
                <div className="relative z-10 w-7 h-7 flex items-center justify-center">
                  <img src="/assets/Services/download-from-cloud.png" alt="Download" className="w-full h-full object-contain" />
                </div>
              </div>
              <p style={{ fontSize: "9px", color: "#2c2a63" }} className="font-extrabold uppercase tracking-tight text-center leading-tight">
                4. DOWNLOAD
              </p>
              <p style={{ fontSize: "8px", color: "#2c2a63" }} className="font-semibold normal-case text-center leading-tight">
                (Take Action)
              </p>
            </div>

          </div>
        </div>

{/* WHAT YOU GET WITH PREMIUM SECTION */}
<div className="relative mt-16 mb-8">
  <div className="flex flex-col items-center mb-8">
    <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-center" style={{ color: "rgb(44, 42, 99)" }}>
      What You Get with Premium
    </h2>
    <p className="text-xs sm:text-sm md:text-base text-center mt-2" style={{ color: "#555" }}>
      Everything you need to land your dream job
    </p>
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">

    {/* Card 1 */}
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-2 hover:scale-[1.02] transition-transform duration-200"
      style={{ boxShadow: "0 8px 30px rgba(44,42,99,0.13), 0 2px 8px rgba(44,42,99,0.07)" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#ede9fe" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v13" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 12l4 4 4-4" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm sm:text-base font-bold leading-tight" style={{ color: "#2c2a63" }}>Download in PDF & Word</p>
      <p className="text-xs sm:text-sm" style={{ color: "#888" }}>High-quality PDF and editable Word file</p>
    </div>

    {/* Card 2 */}
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-2 hover:scale-[1.02] transition-transform duration-200"
      style={{ boxShadow: "0 8px 30px rgba(44,42,99,0.13), 0 2px 8px rgba(44,42,99,0.07)" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#dcfce7" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="2" width="16" height="20" rx="2" stroke="#16a34a" strokeWidth="2" />
          <line x1="8" y1="7" x2="16" y2="7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="11" x2="16" y2="11" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="15" x2="13" y2="15" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm sm:text-base font-bold leading-tight" style={{ color: "#2c2a63" }}>50+ Premium Templates</p>
      <p className="text-xs sm:text-sm" style={{ color: "#888" }}>Access our recruiter-approved templates</p>
    </div>

    {/* Card 3 */}
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-2 hover:scale-[1.02] transition-transform duration-200"
      style={{ boxShadow: "0 8px 30px rgba(44,42,99,0.13), 0 2px 8px rgba(44,42,99,0.07)" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#fff7ed" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="text-sm sm:text-base font-bold leading-tight" style={{ color: "#2c2a63" }}>AI Resume Enhancer</p>
      <p className="text-xs sm:text-sm" style={{ color: "#888" }}>Advanced AI rewrite & content improvement</p>
    </div>

    {/* Card 4 */}
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-2 hover:scale-[1.02] transition-transform duration-200"
      style={{ boxShadow: "0 8px 30px rgba(44,42,99,0.13), 0 2px 8px rgba(44,42,99,0.07)" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#ede9fe" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#7c3aed" strokeWidth="2" />
          <circle cx="12" cy="12" r="5" stroke="#7c3aed" strokeWidth="2" />
          <circle cx="12" cy="12" r="2" fill="#7c3aed" />
        </svg>
      </div>
      <p className="text-sm sm:text-base font-bold leading-tight" style={{ color: "#2c2a63" }}>Live ATS Score Tracking</p>
      <p className="text-xs sm:text-sm" style={{ color: "#888" }}>Track and improve your ATS score in real-time</p>
    </div>

    {/* Card 5 */}
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-2 hover:scale-[1.02] transition-transform duration-200"
      style={{ boxShadow: "0 8px 30px rgba(44,42,99,0.13), 0 2px 8px rgba(44,42,99,0.07)" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#dbeafe" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="15" width="20" height="5" rx="1.5" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
          <rect x="2" y="9.5" width="20" height="5" rx="1.5" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
          <rect x="2" y="4" width="20" height="5" rx="1.5" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm sm:text-base font-bold leading-tight" style={{ color: "#2c2a63" }}>One Resume, Multiple Outputs</p>
      <p className="text-xs sm:text-sm" style={{ color: "#888" }}>One resume, multiple ATS-optimized versions</p>
    </div>

    {/* Card 6 */}
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-2 hover:scale-[1.02] transition-transform duration-200"
      style={{ boxShadow: "0 8px 30px rgba(44,42,99,0.13), 0 2px 8px rgba(44,42,99,0.07)" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#dbeafe" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="3" stroke="#0a66c2" strokeWidth="2" />
          <path d="M7 10v7M7 7v.01" stroke="#0a66c2" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M11 17v-4a2 2 0 014 0v4M11 13v4" stroke="#0a66c2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="text-sm sm:text-base font-bold leading-tight" style={{ color: "#2c2a63" }}>LinkedIn Profile Review</p>
      <p className="text-xs sm:text-sm" style={{ color: "#888" }}>Detailed LinkedIn optimization guide</p>
    </div>

  </div>
</div>

      </div>


      <style>{`
        @keyframes floatUp1 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }

        @keyframes floatDown1 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(25px);
          }
        }

        @keyframes floatUp2 {
          0%, 100% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, -18px);
          }
        }

        @keyframes floatDown2 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(20px);
          }
        }

        .floating-up-1 {
          animation: floatUp1 4s ease-in-out infinite;
        }

        .floating-down-1 {
          animation: floatDown1 3.5s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .floating-up-2 {
          animation: floatUp2 4s ease-in-out infinite;
          animation-delay: 1s;
        }

        .floating-down-2 {
          animation: floatDown2 4.2s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </section>
  );
};

export default Hero;