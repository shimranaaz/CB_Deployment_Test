import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faQuoteLeft, faQuoteRight, faTimes } from "@fortawesome/free-solid-svg-icons";

const services = [
  {
    title: "Interview Preparation",
    status: "Coming Soon",
    subtitle: "Practice, polish, and perform like a pro in every interview.",
    description: [
      "Mock sessions with real-time feedback",
      "Body language & communication mastery",
      "Answers to common & tough questions"
    ],
    images: [
      "/assets/Services/Interview prep.jpeg",
      "/assets/Services/Code.png",
      "/assets/Services/interviewtips.png",
      "/assets/Services/Instantly.png",
      "/assets/Services/Analyze.png",
      "/assets/Services/feedback.png"
    ],
    path: "/interviewprep",
    buttonText: "Start Free Demo",
    modalType: "interview"
  },
  {
    title: "Career Coaching",
    status: "Coming Soon",
    subtitle: "Get expert guidance to discover your path and reach your goals.",
    description: [
      "1:1 personalized career coaching",
      "Strength & skill assessment",
      "Clear roadmap to your dream role"
    ],
    images: [
      "/assets/Services/Career coaching.jpeg",
      "/assets/Services/careercoaching.jpg",
      "/assets/Services/coaching.jpg",
      "/assets/Services/coach.jpg"
    ],
    path: "/career-coaching",
    buttonText: "Book Free Consultation",
    modalType: "career"
  },
  {
    title: "AI-Powered LinkedIn Profile Analysis",
    subtitle: "Know exactly how recruiters see your profile — and how to improve it.",
    description: [
      "Real-time LinkedIn profile scoring",
      "Keyword & visibility optimization insights",
      "Actionable recommendations to boost profile performance"
    ],
    images: [
      "/assets/Services/Network building.jpeg",
      "/assets/Services/networking1.png",
      "/assets/Services/networking2.png",
      "/assets/Services/networking3.png"
    ],
    path: "/networking-strategies",
    buttonText: "Check My LinkedIn Score (Free)",
    modalType: "networking"
  },
];

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number[]>(services.map(() => 0));
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev.map((index, cardIndex) => (index + 1) % services[cardIndex].images.length)
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeModal]);

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const renderModalContent = () => {
    if (activeModal === "interview") {
      return (
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6 items-center relative z-10">
          <div className="space-y-4 text-center md:text-left px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight" style={{ color: '#2c2a63' }}>
              Interview Preparation Coming Soon.
            </h1>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0" style={{ color: '#2c2a63' }}>
              Get ready to ace your interviews with expert guidance. Launching soon!
            </p>
          </div>
          <div className="relative px-4 sm:px-0">
            <div className="relative z-10 bg-white/50 backdrop-blur-sm rounded-2xl p-2 shadow-2xl max-w-sm mx-auto h-[250px] sm:h-[300px] md:h-[350px] overflow-hidden flex items-center justify-center">
              <img src="/assets/Services/interviewpromo.png" alt="Professional interview" className="h-full w-auto object-cover rounded-xl" />
            </div>
            <div className="text-center mt-4 z-20 relative">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: '#2c2a63' }}>Interview</h2>
            </div>
          </div>
        </div>
      );
    } else if (activeModal === "career") {
      return (
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6 items-center relative z-10">
          <div className="space-y-4 text-center md:text-left px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight" style={{ color: '#2c2a63' }}>
              Career Coach Coming Soon
            </h1>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0" style={{ color: '#2c2a63' }}>
              Personalized career coaching to help you achieve your goals. Launching soon!
            </p>
          </div>
          <div className="relative px-4 sm:px-0">
            <div className="relative z-10 bg-white/50 backdrop-blur-sm rounded-2xl p-2 shadow-2xl max-w-sm mx-auto h-[250px] sm:h-[300px] md:h-[350px] overflow-hidden flex items-center justify-center">
              <img src="/assets/Services/careercoachpromo.png" alt="Career coaching consultation" className="h-full w-auto object-cover rounded-xl" />
            </div>
            <div className="text-center mt-4 z-20 relative">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: '#2c2a63' }}>CareerCoach</h2>
            </div>
          </div>
        </div>
      );
    } else if (activeModal === "networking") {
      return (
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6 items-center relative z-10">
          <div className="space-y-4 text-center md:text-left px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight" style={{ color: '#2c2a63' }}>
              Networking Coming Soon
            </h1>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0" style={{ color: '#2c2a63' }}>
              Build meaningful connections, grow your professional network, and unlock new career opportunities. Launching soon!
            </p>
          </div>
          <div className="relative px-4 sm:px-0">
            <div className="relative z-10 bg-white/50 backdrop-blur-sm rounded-2xl p-2 shadow-2xl max-w-sm mx-auto h-[250px] sm:h-[300px] md:h-[350px] overflow-hidden flex items-center justify-center">
              <img src="/assets/Services/networkingpromo.png" alt="Professional networking" className="h-full w-auto object-cover rounded-xl" />
            </div>
            <div className="text-center mt-4 z-20 relative">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: '#2c2a63' }}>Networking</h2>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <section ref={sectionRef} className="py-10 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className={`text-left mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-start gap-2" style={{ color: "#2c2a63" }}>
              <FontAwesomeIcon icon={faQuoteLeft} className="text-2xl mt-1" style={{ color: "#2c2a63" }} />
              <span className="flex-1" id="offer">
                Every tool you need is here...
                <FontAwesomeIcon icon={faQuoteRight} className="text-2xl ml-2" style={{ color: "#2c2a63" }} />
              </span>
            </h2>
            <p className="text-lg font-semibold max-w-3xl leading-relaxed" style={{ color: "#4a4a4a" }}>
              Comprehensive career services designed to empower your professional journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {services.map((service, index) => (
              <div
                key={index}
                className={`w-full max-w-sm bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-0"></div>
                {service.status && (
  <span
    className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full shadow-sm z-10 ${
      service.status === "Active"
        ? "bg-[#2c2a63] text-[#EDC9AF]"
        : "bg-[#EDC9AF] text-[#2c2a63]"
    }`}
  >
    {service.status}
  </span>
)}
                  {service.images.map((img, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={img}
                      alt={`${service.title} ${imgIndex + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        currentImageIndex[index] === imgIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="w-12 h-1 mb-3" style={{ backgroundColor: "#1db954" }}></div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#333" }}>{service.title}</h3>
                  <p className="mb-4 font-medium text-sm" style={{ color: "#333" }}>
                    {service.subtitle}
                  </p>
                  <ul className="space-y-2 text-sm mb-6 flex-grow" style={{ color: "#4a4a4a" }}>
                    {service.description.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-1.5 h-1.5 rounded-full mt-2 mr-2 flex-shrink-0" style={{ backgroundColor: "#1db954" }}></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-2 mt-auto">
                    <a href="/linkedin-checker" className="w-full">
                      <button className="w-full text-sm px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2" style={{ backgroundColor: "#2c2a63", color: "#EDC9AF" }}>
                        {service.buttonText} 
                        <FontAwesomeIcon icon={faArrowRight} />
                      </button>
                    </a>
               
{service.modalType === "networking" ? (
  <a href="/linkedin-checker" className="w-full">
    <button 
      className="w-full text-sm px-6 py-3 rounded-lg font-bold border-2 transition-all hover:bg-gray-50 flex items-center justify-center gap-2" 
      style={{ borderColor: "#2c2a63", color: "#2c2a63" }}
    >
      Explore 
      <FontAwesomeIcon icon={faArrowRight} />
    </button>
  </a>
) : (
  <button 
    onClick={() => openModal(service.modalType)}
    className="w-full text-sm px-6 py-3 rounded-lg font-bold border-2 transition-all hover:bg-gray-50 flex items-center justify-center gap-2" 
    style={{ borderColor: "#2c2a63", color: "#2c2a63" }}
  >
    Explore 
    <FontAwesomeIcon icon={faArrowRight} />
  </button>
)}

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)'
          }}
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 z-50 w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-110"
              style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>

            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-1/4 w-16 h-16 bg-[#2c2a63]/15 rounded-full blur-lg"></div>
              <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-[#2c2a63]/20 rounded-full blur-xl"></div>
              <div className="absolute top-1/3 left-12 w-12 h-12 bg-[#2c2a63]/20 rotate-45"></div>
              <div className="absolute bottom-1/4 right-12 w-6 h-6 bg-[#2c2a63]/25 rounded-full"></div>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 lg:p-10 flex items-center justify-center min-h-[450px]">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Services;