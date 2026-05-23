import { useEffect, useRef, useState } from "react";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const companies = [
  { name: "Amazon", logo: "/assets/Companies/Amazon.png" },
  { name: "Freshworks", logo: "/assets/Companies/freshworks.png" },
  { name: "HCL", logo: "/assets/Companies/HCL.png" },
  { name: "Oracle", logo: "/assets/Companies/oracle.png" },
  { name: "TCS", logo: "/assets/Companies/tcs.png" },
  { name: "Tech Mahindra", logo: "/assets/Companies/Tech-mahindra.png" },
  { name: "Wipro", logo: "/assets/Companies/Wipro.png" },
  { name: "Zoho", logo: "/assets/Companies/Zoho.png" },
];

const Companies = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  return (
    <>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
      
      <section ref={sectionRef} id="companies" className="py-6 md:py-8 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className={`text-left mb-6 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h2 className="text-2xl md:text-4xl font-bold flex items-start gap-2" style={{ color: "#2c2a63" }}>
              <FontAwesomeIcon icon={faQuoteLeft} className="text-2xl mt-1" style={{ color: "#2c2a63" }} />
              <span className="flex-1">
                Get hired at top companies — <span style={{ color: "rgb(29, 185, 84)" }}>76% faster</span>
                <FontAwesomeIcon icon={faQuoteRight} className="text-2xl ml-2" style={{ color: "#2c2a63" }} />
              </span>
            </h2>
          </div>

          {/* Infinite Scroll Container */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll min-w-max">
              {companies.map((company, index) => (
                <div
                  key={`first-${index}`}
                  className="flex-shrink-0 w-48 h-24 mx-8 flex items-center justify-center hover:scale-110 transition-all duration-300"
                >
                  <img src={company.logo} alt={company.name} className="max-w-full max-h-full object-contain" />
                </div>
              ))}

              {companies.map((company, index) => (
                <div
                  key={`second-${index}`}
                  className="flex-shrink-0 w-48 h-24 mx-8 flex items-center justify-center hover:scale-110 transition-all duration-300"
                >
                  <img src={company.logo} alt={company.name} className="max-w-full max-h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Companies;