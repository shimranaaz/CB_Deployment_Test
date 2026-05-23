import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const serviceDetails = {
  "interview-prep": {
    title: "Interview Preparation",
    description: "Master the art of interviewing with our comprehensive preparation program",
    features: [
      "Mock sessions with real-time feedback",
      "Body language & communication mastery",
      "Answers to common & tough questions",
      "Industry-specific interview strategies",
      "Confidence building techniques",
      "Post-interview follow-up guidance",
    ],
  },
  "career-coaching": {
    title: "Career Coaching",
    description: "Get personalized guidance to achieve your career goals",
    features: [
      "1:1 personalized career coaching",
      "Strength & skill assessment",
      "Clear roadmap to your dream role",
      "Goal setting and action planning",
      "Career transition support",
      "Ongoing mentorship and support",
    ],
  },
  "resume-building": {
    title: "Resume Review & Building",
    description: "Transform your resume into a powerful career tool",
    features: [
      "ATS-friendly formatting & design",
      "Highlight achievements & strengths",
      "Detailed expert feedback & revisions",
      "Industry-specific keywords optimization",
      "Multiple format options",
      "Cover letter writing assistance",
    ],
  },
  "networking": {
    title: "Networking Tips & Strategies",
    description: "Build meaningful professional connections",
    features: [
      "Proven LinkedIn & networking hacks",
      "Tips to connect with HRs & recruiters",
      "Build strong, lasting professional ties",
      "Personal branding strategies",
      "Elevator pitch development",
      "Networking event preparation",
    ],
  },
};

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const service = serviceId ? serviceDetails[serviceId as keyof typeof serviceDetails] : null;

  if (!service) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold">Service not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="py-16 md:py-24 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in-up">
              {service.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-12 animate-fade-in-up">
              {service.description}
            </p>

            <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-foreground mb-6">What You'll Get:</h2>
              <ul className="space-y-4">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-secondary text-xl mt-1 flex-shrink-0"
                    />
                    <span className="text-lg text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-navy text-accent px-8 py-4 rounded-lg font-semibold hover:bg-navy/90 transition-all duration-300 transform hover:scale-105">
                  Get Started
                </button>
                <button className="flex-1 border-2 border-navy text-navy px-8 py-4 rounded-lg font-semibold hover:bg-navy hover:text-accent transition-all duration-300">
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;