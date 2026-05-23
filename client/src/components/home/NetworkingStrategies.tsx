import { Check, ArrowUp, X, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faQuoteRight, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../home/Interviewprep.css";

const NetworkingPromoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-all duration-300"
          style={{ background: '#2c2a63', color: '#EDC9AF' }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight" style={{ color: '#2c2a63' }}>
                Networking Coming Soon.
              </h1>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed" style={{ color: '#2c2a63' }}>
                Unlock <span className="font-bold">powerful connections</span> and career opportunities. Our networking hub is launching soon!
              </p>
            </div>

            {/* Right Illustration */}
            <div className="relative">
              <div className="relative z-10 bg-white/50 backdrop-blur-sm rounded-3xl p-3 shadow-2xl max-w-md mx-auto h-[320px] sm:h-[400px] overflow-hidden flex items-center justify-center">
                <img
                  src="/assets/Services/networkingpromo.png"
                  alt="Professional networking"
                  className="h-full w-auto object-cover rounded-2xl"
                />

              </div>

              {/* Networking text below image */}
              <div className="text-center mt-6 z-20 relative">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: '#2c2a63' }}>
                  Networking
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/4 w-16 h-16 bg-[#2c2a63]/15 rounded-full blur-lg"></div>
          <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-[#2c2a63]/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/3 left-12 w-12 h-12 bg-[#2c2a63]/20 rotate-45"></div>
          <div className="absolute bottom-1/4 right-12 w-6 h-6 bg-[#2c2a63]/25 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const HeroSection = ({ onOpenModal }: { onOpenModal: () => void }) => {
  const words = ["Meaningful", "Strategic", "Lasting", "Valuable"];
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
      {/* Back to Home Button */}
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
            Connections That Open{" "}
            <span className="relative inline-block h-[1.2em] w-[320px] align-bottom overflow-hidden">
              <span className={`absolute inset-0 transition-all duration-500 ${isAnimating ? "translate-y-[-100%] opacity-0" : "translate-y-0 opacity-100"}`} style={{ color: "#2c2a63" }}>
                {words[currentWordIndex]}
              </span>
            </span>
            <br />Doors.
          </h1>
          <div className="flex flex-wrap gap-3 text-sm font-medium" style={{ color: "#333" }}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <span>LinkedIn & Naukri Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <span>Recruiter Outreach</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <span>Growth Hacks</span>
            </div>
          </div>
          <p className="text-lg font-medium" style={{ color: "#333" }}>Build a professional presence that gets noticed — and remembered.</p>
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
          <button
            onClick={onOpenModal}
            className="rounded-full px-8 py-3 bg-[#2c2a63] text-[#EDC9AF] hover:bg-[#2c2a63]/90 font-medium text-lg"
          >
            Book Your Free Call
          </button>
        </div>
        <div className="w-full">
          <img
            src="/assets/Services/hero.png"
            alt="Professional networking event"
            className="rounded-2xl shadow-2xl w-full h-auto object-cover"
          />
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
        <h2 style={{ color: "#2c2a63", fontSize: "22px" }}>
          <FontAwesomeIcon icon={faQuoteLeft} className="me-2" />
          Personalized Career Guidance
          <FontAwesomeIcon icon={faQuoteRight} className="ms-2" />
        </h2>

        <p>We connect you with valuable industry insights and networking tips. From profile optimization to outreach guidance, we help you grow the connections that open new opportunities.</p>
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
    { question: "Why is networking important for my career?", answer: "Networking opens doors to hidden job opportunities, mentorship, and industry insights.", avatar: avatar1 },
    { question: "Do you teach how to use LinkedIn effectively?", answer: "Yes, we guide you on optimizing your profile, connecting with professionals, and engaging meaningfully.", avatar: avatar2 },
    { question: "What if I'm shy or introverted?", answer: "We provide strategies for building confidence and networking effectively even as an introvert.", avatar: avatar3 },
    { question: "Will you help me practice networking conversations?", answer: "Definitely. We role-play real networking scenarios so you feel prepared.", avatar: avatar4 },
    { question: "Can networking really help me land a job?", answer: "Yes—studies show a large percentage of jobs are filled through networking rather than job boards.", avatar: avatar5 },
  ];

  return (
    <section className="py-20 px-6 lg:px-12 bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            {/* Heading */}
            <h2 className="text-[30px] font-bold text-start">
              <FontAwesomeIcon icon={faQuoteLeft} className="mr-2 text-[#2c2a63]" />
              Frequently Asked Questions
              <FontAwesomeIcon icon={faQuoteRight} className="ml-2 text-[#2c2a63]" />
            </h2>

            {/* Paragraph */}
            <p className="text-lg mt-4 font-medium" style={{ color: "#333" }}>
              Not sure how networking can open doors for you? Explore our FAQs to see how profile optimization, smart strategies, and long-term visibility can help you build meaningful connections and advance your career.
            </p>

            {/* Image - Shown on mobile after paragraph, hidden on desktop in this position */}
            <div className="rounded-2xl overflow-hidden w-full mt-6 lg:hidden" style={{ backgroundColor: "rgba(237, 201, 175, 0.55)" }}>
              <img src="/assets/img/faq-img.png" alt="FAQ Illustration" className="w-full object-contain h-[300px]" />
            </div>

            {/* FAQ Questions */}
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
                    <img
                      src={faq.avatar}
                      alt={`Person ${index + 1}`}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <span className="flex-1">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
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

          {/* Image - Shown only on desktop in second column */}
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

const NetworkingStrategies = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar />

      <HeroSection onOpenModal={() => setIsModalOpen(true)} />

      <section className="py-6 sm:py-16 px-6 lg:px-12 bg-[#f8f8f8]">
        <div className="max-w-4xl mx-auto space-y-6 text-start lg:text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#2c2a63]">Be Seen. Be Connected. Be Hired.</h2>
          <p className="text-xl font-semibold">Transform Connections Into Career Opportunities.</p>
          <p className="text-lg leading-relaxed" style={{ color: "#333", fontWeight: "500" }}>The right connections can open doors no job board ever will. We don't just tell you to network—we guide you step by step, helping you optimize your profiles, connect with the right people, and turn conversations into career opportunities</p>
        </div>
      </section>

      <section className="py-6 sm:py-16 px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto">
          <div className="lg:w-1/2">
            <img src="/assets/Services/networking1.png" alt="Professional Networking" className="rounded-2xl shadow-2xl w-full object-covered" style={{ aspectRatio: '4/3' }} />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Profile Setup & Optimization</h2>
            <p className="text-lg leading-relaxed" style={{ color: "#333", fontWeight: "500" }}>Learn proven strategies to identify and connect with the right people who can open doors to your dream career opportunities.</p>
            <ul className="space-y-2 text-lg" style={{ color: "#333" }}>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Create and polish LinkedIn, Naukri, and other platform profiles</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Craft a compelling summary that instantly attracts recruiters</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Highlight your skills and achievements with the right keywords</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Format your profile for ATS-friendly visibility and higher reach</span></li>
            </ul>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-colors"
              style={{ backgroundColor: "#2c2a63", color: "#EDC9AF" }}
            >
              Optimize My Profile
            </button>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-16 px-6 lg:px-12">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 max-w-7xl mx-auto">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Strategic Networking Guidance</h2>
            <p className="text-lg leading-relaxed" style={{ color: "#333", fontWeight: "500" }}>Transform from awkward small talk to confident conversations that leave lasting impressions and create valuable connections.</p>
            <ul className="space-y-2 text-lg" style={{ color: "#333" }}>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Learn how to reach out to HRs, recruiters, and industry leaders</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Use proven messaging templates that get replies (without being pushy)</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Master engagement—posting, commenting, and building presence</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Follow outreach strategies that grow your network with purpose</span></li>
            </ul>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-colors"
              style={{ backgroundColor: "#2c2a63", color: "#EDC9AF" }}
            >
              Guide My Networking
            </button>
          </div>
          <div className="lg:w-1/2">
            <img src="/assets/Services/networking3.png" alt="Professional Events" className="rounded-2xl shadow-2xl w-full object-cover" style={{ aspectRatio: '4/3' }} />
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-16 px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto">
          <div className="lg:w-1/2">
            <img src="/assets/Services/feedback3.png" alt="LinkedIn Strategy" className="rounded-2xl shadow-2xl w-full object-contain" style={{ aspectRatio: '4/3' }} />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Long-Term Visibility & Career Growth</h2>
            <p className="text-lg leading-relaxed" style={{ color: "#333", fontWeight: "500" }}>Turn LinkedIn from a digital resume into a powerful networking tool that attracts opportunities and builds your professional brand.</p>
            <ul className="space-y-2 text-lg" style={{ color: "#333" }}>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Build a consistent professional presence across platforms</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Leverage groups, events, and industry communities to get noticed</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Turn connections into referrals and real job opportunities</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Get continuous tips to keep your profile fresh and relevant</span></li>
            </ul>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-colors"
              style={{ backgroundColor: "#2c2a63", color: "#EDC9AF" }}
            >
              Grow My Career
            </button>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-20 px-6 lg:px-12 bg-[#f8f8f8]">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 max-w-7xl mx-auto">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold whitespace-nowrap">
              Analyze your <span style={{ color: '#1db954' }}>performance</span>
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: "#333", fontWeight: "500" }}>Expand your network with smart connections, showcase your expertise, and unlock opportunities by engaging with the right professionals.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-colors"
              style={{ backgroundColor: "#2c2a63", color: "#EDC9AF" }}
            >
              Get My Analysis
            </button>
          </div>
          <div className="lg:w-1/2">
            <img src="/assets/Services/Analyze.png" alt="Professional Relationships" className="rounded-2xl shadow-2xl w-full object-covered" style={{ aspectRatio: '4/3' }} />
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-20 px-6 lg:px-12 bg-background">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 max-w-7xl mx-auto">
          <div className="lg:w-1/2">
            <img src="/assets/Services/networking2.png" alt="Strategic Connections" className="rounded-2xl shadow-2xl w-full object-covered" style={{ aspectRatio: '4/3' }} />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Get <span style={{ color: "#1db954" }}>Expert-Guided</span> interview feedback</h2>
            <p className="text-lg leading-relaxed" style={{ color: "#333", fontWeight: "500" }}>Receive personalized evaluation of your LinkedIn profile. Get scored on visibility, connections, and engagement — along with actionable insights to grow your professional network.</p>
            <ul className="space-y-2 text-lg" style={{ color: "#333" }}>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Detailed review of profile strength, keywords, and headline impact</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Actionable tips to attract recruiters and industry peers</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span><span>Expert guidance to boost visibility and expand your connections</span></li>
            </ul>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-colors"
              style={{ backgroundColor: "#2c2a63", color: "#EDC9AF" }}
            >
              Unlock Expert Feedback
            </button>
          </div>
        </div>
      </section>

      <ProcessSection />
      <FAQSection />
      <Footer />

      {/* Modal */}
      <NetworkingPromoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default NetworkingStrategies;