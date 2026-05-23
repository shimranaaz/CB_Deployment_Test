import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "./Faq.css";

const faqs = [
  {
    question: "What makes Career Blueprint different from other career services?",
    answer:
      "Unlike generic coaching, we offer <strong>practical, hands-on preparation</strong> — from building recruiter-ready resumes to conducting real-time mock interviews, career roadmaps, and LinkedIn/Naukri profile setups. Every service is designed to give you <strong>real-world results, not just theory.</strong>",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    question: "Do I need to purchase all services together, or can I choose only one?",
    answer:
      "You have the flexibility to choose. Many students and professionals start with <strong>Resume Building or Interview Prep,</strong> while others opt for <strong> Career Coaching or Networking strategies.</strong> You can pick <strong>individual services</strong> or combine them into a <strong>custom career package.</strong>",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    question: "Who are these services designed for?",
    answer: `
      <strong>Our services are tailored for:</strong>
      <ul>
        <li>Students preparing for placements</li>
        <li>Freshers entering the job market</li>
        <li>Working professionals aiming for job change/promotion</li>
        <li>Anyone who wants to build confidence and grow their career network</li>
      </ul>
    `,
    image: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    question: "How do the sessions work — online or offline?",
    answer:
      "All sessions are online to give you flexibility and convenience. Resume reviews, coaching calls, mock interviews, and LinkedIn/Naukri setup are done through <strong>virtual meetings & guided steps.</strong> You can attend from anywhere, anytime.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    question: "How soon can I see results after using your services?",
    answer:
      `Results depend on effort + consistency. Many clients see a difference <strong>2–4 weeks:</strong>
      <ul>
        <li><strong>Resumes</strong>  start getting more recruiter calls</li>
       <li><strong>Interview Prep</strong> boosts confidence after just a few mock sessions</li>
       <li><strong>Career Coaching</strong> provides clarity & strategy from Day 1</li>
       <li><strong>Networking</strong> setups lead to recruiter responses within weeks</li>
      </ul>
    `,
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div
      className="min-h-screen py-6 md:py-12 px-4 bg-white"
      style={{ minHeight: "105vh" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <h2
            className="text-xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 flex items-center gap-2 flex-wrap"
            style={{ color: "#2c2a63" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-5 h-5 md:w-7 md:h-7"
              style={{ fill: "#2c2a63" }}
            >
              <path d="M0 216C0 149.7 53.7 96 120 96h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V216zm256 0c0-66.3 53.7-120 120-120h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H320c-35.3 0-64-28.7-64-64V216z" />
            </svg>
            <span className="whitespace-nowrap">Frequently Asked Questions</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-5 h-5 md:w-7 md:h-7"
              style={{ fill: "#2c2a63" }}
            >
              <path d="M448 296c0 66.3-53.7 120-120 120h-8c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H320c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v136zm-256 0c0 66.3-53.7 120-120 120H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H64c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v136z" />
            </svg>
          </h2>
          <p
            className="text-sm md:text-lg leading-relaxed max-w-4xl font-semibold"
            style={{ color: "#333" }}
          >
            Our FAQ section is designed to provide quick and clear answers to
            common queries. Whether you’re curious about our services, pricing,
            or delivery times, you’ll find all the information you need right
            here.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
          {/* FAQ Image */}
          <div className="flex items-start justify-center order-2 lg:order-2 mb-4 lg:mb-0 lg:w-2/5">
            <div
              className="rounded-2xl overflow-hidden w-full"
              style={{ backgroundColor: "rgba(237, 201, 175, 0.55)" }}
            >
              <img
                src="/assets/img/faq-img.png"
                alt="FAQ Illustration"
                className="w-full object-contain h-200px] lg:h-[727px]"
              />
            </div>
          </div>

          {/* Accordion */}
          <div className="lg:w-3/5 flex-1 order-3 lg:order-1">
            <div className="space-y-4 md:space-y-5">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden shadow-sm"
                  style={{ backgroundColor: "rgba(237, 201, 175, 0.55)" }}
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:opacity-90 transition-opacity"
                  >
                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                      <img
                        src={faq.image}
                        alt={`Person ${index + 1}`}
                        className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-md object-cover flex-shrink-0"
                      />
                      <span
                        className="font-medium text-sm md:text-lg lg:text-xl pr-2"
                        style={{ color: "#2c2a63" }}
                      >
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                        }`}
                      style={{ color: "#2c2a63" }}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96" : "max-h-0"
                      }`}
                  >
                    <div className="px-4 md:px-5 pb-4 md:pb-5 pl-[4.5rem] md:pl-[5rem] lg:pl-[5.5rem]">
                      <div
                        className="faq-answer text-sm md:text-base lg:text-lg leading-relaxed"
                        style={{ color: "#333" }}
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
