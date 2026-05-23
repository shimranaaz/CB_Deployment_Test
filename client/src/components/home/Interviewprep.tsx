import { Check, ArrowUp, Home, X } from "lucide-react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faQuoteRight, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../home/Interviewprep.css";

// Modal Component
const InterviewPromoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
          style={{ background: '#2c2a63', color: '#EDC9AF' }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="min-h-[600px] flex items-center justify-center p-6 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-1/4 w-16 h-16 bg-[#2c2a63]/15 rounded-full blur-lg"></div>
            <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-[#2c2a63]/20 rounded-full blur-xl"></div>
            <div className="absolute top-1/3 left-12 w-12 h-12 bg-[#2c2a63]/20 rotate-45"></div>
            <div className="absolute bottom-1/4 right-12 w-6 h-6 bg-[#2c2a63]/25 rounded-full"></div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center relative z-10">
            {/* Left Content */}
            <div className="space-y-6 text-center md:text-left px-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight" style={{ color: '#2c2a63' }}>
                Interview Preparation Coming Soon.
              </h1>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed max-w-md mx-auto md:mx-0" style={{ color: '#2c2a63' }}>
                Get ready to ace your interviews with expert guidance. Launching soon!
              </p>
            </div>

            {/* Right Illustration */}
            <div className="relative px-4 sm:px-0">
              <div className="relative z-10 bg-white/50 backdrop-blur-sm rounded-3xl p-3 shadow-2xl max-w-md mx-auto h-[320px] sm:h-[400px] md:h-[480px] overflow-hidden flex items-center justify-center">
                <img src="/assets/Services/interviewpromo.png" alt="Professional interview" className="w-full h-full object-contain rounded-2xl" />
              </div>
              <div className="text-center mt-6 z-20 relative">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: '#2c2a63' }}>
                  Interview
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroSection = ({ openModal }: { openModal: () => void }) => {
  const words = ["Confident", "Sharp", "Unstoppable", "Ready"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 500);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-[80vh] bg-background py-10 pt-20 lg:pt-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto mb-4">
        <button
          onClick={() => window.location.href = '/'}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
          style={{
            background: '#F1F1F1',
            color: '#2c2a63'
          }}
        >
          <Home className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="space-y-5">
          <h1 className="text-3xl lg:text-4xl font-semibold" style={{ color: "#333" }}>
            Practice Like It's Real Perform Like a{" "}
            <span className="relative inline-block h-[1.2em] w-[320px] align-bottom overflow-hidden">
              <span className={`absolute inset-0 transition-all duration-500 ${isAnimating ? "translate-y-[-100%] opacity-0" : "translate-y-0 opacity-100"}`} style={{ color: "#2c2a63" }}>
                {words[currentWordIndex]}
              </span>
            </span>
            <br />Pro.
          </h1>
          <div className="flex flex-wrap gap-3 text-sm font-medium" style={{ color: "#333" }}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <span>Mock Interviews</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <span>Live Feedback</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <span>Real-Time Coaching</span>
            </div>
          </div>
          <p className="text-lg font-medium" style={{ color: "#333" }}>Step into a professional setup that prepares you for the toughest interviews.</p>
          <div className="space-y-2 font-medium" style={{ color: "#333" }}>
            <div className="flex items-center gap-3">
              <ArrowUp className="text-green-500 w-6 h-6" strokeWidth={2.5} />
              <span>30% higher chance of getting a job‡</span>
            </div>
            <div className="flex items-center gap-3">
              <ArrowUp className="text-green-500 w-6 h-6" strokeWidth={2.5} />
              <span>42% higher response rate from recruiters‡</span>
            </div>
          </div>
          <button onClick={openModal} className="rounded-full px-8 py-3 bg-[#2c2a63] text-[#EDC9AF] hover:bg-[#2c2a63]/90 font-medium text-lg">
            Book Your Free Call
          </button>
        </div>
        <div className="w-full">
          <video src="/assets/Services/interview.mp4" autoPlay loop muted playsInline className="rounded-2xl shadow-2xl w-full h-auto object-covered" />
        </div>
      </div>
    </section>
  );
};

const ProcessSection = () => {
  const steps = [
    { number: "01", label: "Select Job Role & Share JD", side: "left" },
    { number: "02", label: "Schedule Mock Interview (with Expert)", side: "right" },
    { number: "03", label: "Live Mock Interview Session", side: "left" },
    { number: "04", label: "Feedback Report + Improvement Plan", side: "right" },
  ];

  return (
    <section className="roadmap">
      <div className="roadmap-left">
        <h2 className="text-[19px] lg:text-[20px]" style={{ color: "#2c2a63" }}>
          <FontAwesomeIcon icon={faQuoteLeft} className="me-2" />
          Preparing You for Every Question
          <FontAwesomeIcon icon={faQuoteRight} className="ms-2" />
        </h2>
        <p>We assess your career goals, conduct mock interviews, and share feedback so you build confidence. Our process ensures you're ready to impress in real interviews.</p>
        <button className="flex items-center gap-2 font-bold" style={{ background: "#EDC9AF", color: "#2c2a63", borderRadius: "6px", padding: "10px 20px", border: "none", cursor: "pointer" }}>
          Contact Us <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      <div className="roadmap-right">
        <svg className="roadmap-svg" viewBox="0 0 100 800" preserveAspectRatio="none">
          <path d="M50 0 Q100 100, 50 200 Q0 300, 50 400 Q100 500, 50 600 Q0 700, 50 800" stroke="#2c2a63" strokeWidth="5" strokeDasharray="4,8" fill="none" />
        </svg>
        {steps.map((step, index) => (
          <div key={index} className={`roadmap-step ${step.side}`}>
            <div className={`step-content ${step.number === "02" || step.number === "04" ? "special-step" : ""}`} style={{ background: step.side === "left" ? "#EDC9AF" : "#2c2a63", color: step.side === "left" ? "#2c2a63" : "#EDC9AF" }}>
              {step.label}
            </div>
            <div className={`step-number ${step.side}`}>
              <span>STEP</span>{step.number}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const avatar1 = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80";
  const avatar2 = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80";
  const avatar3 = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80";
  const avatar4 = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80";
  const avatar5 = "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&q=80";

  const faqs = [
    { question: "How are the mock interviews conducted?", answer: "We conduct them virtually or in-person, depending on your preference, simulating real interview settings.", avatar: avatar1 },
    { question: "Will I get feedback after each session?", answer: "Yes, you'll receive personalized feedback highlighting your strengths and areas to improve.", avatar: avatar2 },
    { question: "Do you cover technical as well as HR questions?", answer: "Absolutely. We customize the session to focus on technical, HR, or behavioral interviews based on your career goals.", avatar: avatar3 },
    { question: "How many sessions do I need before an actual interview?", answer: "Most users benefit from 2–3 sessions, but we adjust depending on your confidence level and job type.", avatar: avatar4 },
    { question: "Can I record my mock interview?", answer: "Yes, you can request a recording to review your performance later.", avatar: avatar5 },
  ];

  return (
    <section className="py-20 px-6 lg:px-12 bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold text-start">
              <FontAwesomeIcon icon={faQuoteLeft} className="mr-2 text-[#2c2a63]" />
              Frequently Asked Questions
              <FontAwesomeIcon icon={faQuoteRight} className="ml-2 text-[#2c2a63]" />
            </h2>

            <p className="text-lg mt-4 font-medium" style={{ color: "#333" }}>
              Still have questions? We've got answers. Explore our most common queries to see how Interview Preparation can help you feel confident, prepared, and ready to succeed in every interview.
            </p>

            <div className="rounded-2xl overflow-hidden w-full mt-6 lg:hidden" style={{ backgroundColor: "rgba(237, 201, 175, 0.55)" }}>
              <img src="/assets/img/faq-img.png" alt="FAQ Illustration" className="w-full object-contain h-[300px]" />
            </div>

            <div className="mt-8 space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-lg px-4 border-none"
                  style={{ background: "rgba(237, 201, 175, 0.55)", boxShadow: "0px 5px 25px rgba(0,0,0,0.1)" }}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                    className="text-left font-semibold py-3 w-full flex gap-3 items-center"
                    style={{ color: "#2c2a63" }}
                  >
                    <img src={faq.avatar} alt={`Person ${index + 1}`} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <span className="flex-1">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openIndex === index && (
                    <div className="pb-3 pl-[68px] pr-9 leading-relaxed" style={{ color: "#333", fontWeight: 500 }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-2xl overflow-hidden w-full" style={{ backgroundColor: "rgba(237, 201, 175, 0.55)" }}>
              <img src="/assets/img/faq-img.png" alt="FAQ Illustration" className="w-full object-contain h-[700px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Interviewprep = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <HeroSection openModal={() => setIsModalOpen(true)} />

      <section className="py-6 sm:py-16 px-6 lg:px-12 bg-[#f8f8f8]">
        <div className="max-w-4xl mx-auto space-y-6 text-start lg:text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#2c2a63]">High-Level Unique Version</h2>
          <p className="text-xl font-semibold">Step Beyond Preparation — Into Performance.</p>
          <p className="text-lg leading-relaxed" style={{ color: "#333", fontWeight: "500" }}>Don't just get ready for interviews—learn to shine in them. Our immersive interview prep sessions simulate real-world interview settings, helping you practice, gain confidence, and deliver answers that leave a lasting impression.</p>
        </div>
      </section>

      <section className="py-6 sm:py-16 px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto">
          <div className="lg:w-1/2">
            <img src="/assets/Services/Code.png" alt="Coding" className="rounded-2xl shadow-2xl w-full h-full object-covered" style={{ aspectRatio: '4/3' }} />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Code in Real-World Conditions</h2>
            <p className="text-lg leading-relaxed" style={{ color: "#333", fontWeight: "500" }}>Solve coding challenges in a clean, professional editor with tools that mirror real company environments. Sharpen your logic with problems designed for real tests, not just practice sheets.</p>
            <ul className="space-y-2 text-lg" style={{ color: "#333" }}>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Solve coding challenges in a clean, professional editor</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Work with tools that mirror real company environments</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Sharpen your logic with problems designed for real tests</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Experience the pressure and pace of actual technical rounds</span></li>
            </ul>
            <button onClick={() => setIsModalOpen(true)} className="px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-colors" style={{ backgroundColor: "#2c2a63", color: "#EDC9AF" }}>Start Practicing Now</button>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-16 px-6 lg:px-12">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 max-w-7xl mx-auto">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Your Interview, As Real As It Gets</h2>
            <p className="text-lg leading-relaxed" style={{ color: "#333", fontWeight: "500" }}>Practice with crisp video and audio for a seamless experience. Zero technical hassle—just focus on performing.</p>
            <ul className="space-y-2 text-lg" style={{ color: "#333" }}>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Crisp video and audio for a seamless experience</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Zero technical hassle—just focus on performing</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Unique replay option to review and improve instantly</span></li>
            </ul>
            <button onClick={() => setIsModalOpen(true)} className="px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-colors" style={{ backgroundColor: "#2c2a63", color: "#EDC9AF" }}>Book a Mock Interview</button>
          </div>
          <div className="lg:w-1/2">
            <img src="/assets/Services/interviewtips.png" alt="Interview" className="rounded-2xl shadow-2xl w-full h-full object-covered" style={{ aspectRatio: '4/3' }} />
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-16 px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto">
          <div className="lg:w-1/2">
            <img src="/assets/Services/Instantly.png" alt="Design" className="rounded-2xl shadow-2xl w-full h-full object-covered" style={{ aspectRatio: '4/3' }} />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Where Ideas Take Shape — Instantly</h2>
            <p className="text-lg leading-relaxed" style={{ color: "#333", fontWeight: "500" }}>Sketch, draw, or map out system designs live during your interview. Brainstorm solutions in an interactive space.</p>
            <ul className="space-y-2 text-lg" style={{ color: "#333" }}>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Sketch, draw, or map out system designs live</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Brainstorm solutions in an interactive space</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Collaborate smoothly during discussions</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Save and revisit your solutions to track growth</span></li>
            </ul>
            <button onClick={() => setIsModalOpen(true)} className="px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-colors" style={{ backgroundColor: "#2c2a63", color: "#EDC9AF" }}>Practice Instantly</button>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-20 px-6 lg:px-12 bg-[#f8f8f8]">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 max-w-7xl mx-auto">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Analyze your <span style={{ color: '#1db954' }}>performance</span>
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: "#333", fontWeight: "500" }}>Go through your mock interview results, understand your strengths, and identify areas to improve. Get clear insights to boost your confidence for the real interview.</p>
            <button onClick={() => setIsModalOpen(true)} className="px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-colors" style={{ backgroundColor: "#2c2a63", color: "#EDC9AF" }}>Get My Analysis</button>
          </div>
          <div className="lg:w-1/2">
            <img src="/assets/Services/Analyze.png" alt="Success" className="rounded-2xl shadow-2xl w-full h-full object-covered" style={{ aspectRatio: '4/3' }} />
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-20 px-6 lg:px-12 bg-background">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 max-w-7xl mx-auto">
          <div className="lg:w-1/2">
            <img src="/assets/Services/feedback.png" alt="Feedback" className="rounded-2xl shadow-2xl w-full h-full object-covered" style={{ aspectRatio: '4/3' }} />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Get <span style={{ color: "#1db954" }}>Expert-Guided</span> interview feedback</h2>
            <p className="text-lg leading-relaxed" style={{ color: "#333", fontWeight: "500" }}>Receive personalized evaluation from experienced interview coaches. Get scored on clarity, confidence, tone, and impact — along with actionable insights to sharpen your responses and deliver your best performance.</p>
            <button onClick={() => setIsModalOpen(true)} className="px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-colors" style={{ backgroundColor: "#2c2a63", color: "#EDC9AF" }}>Unlock Expert Feedback</button>
          </div>
        </div>
      </section>

      <ProcessSection />
      <FAQSection />

      <InterviewPromoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <Footer />
    </div>
  );
};

export default Interviewprep;