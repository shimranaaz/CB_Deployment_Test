import React from 'react';
import { Check } from 'lucide-react';

interface FeatureItem {
  title?: string;
  text: string;
}

interface FeatureSection {
  image: string;
  title: string;
  description: string;
  features: FeatureItem[];
  imageOnLeft: boolean;
}


const Features: React.FC = () => {
  const featureSections: FeatureSection[] = [
    {
      image: '/assets/Services/typo_error.png',
      title: 'Let AI fight every typo, so you can fight for better offers',
      description: 'A built-in checker cleans up grammar, clichés, and clarity before a recruiter ever sees your resume.',
      features: [
        {
          title: "Wording & readability radar",
          text: "that spots confusing lines and dull phrases in real time."
        },
        {
          title: "Error and typo wipe-out",
          text: "so your resume feels polished, confident, and interview-ready."
        },
        {
          title: "Smart, job-aware suggestions",
          text: "tailored to your role, industry, and experience—not generic grammar tips."
        }
      ],
      imageOnLeft: true
    },
    {
      image: '/assets/Services/card1.png',
      title: 'Tailor your resume to any job in one click.',
      description: 'Paste the job description once—your AI assistant rewrites your resume around it, so every line speaks the language of that role.',
      features: [
        { text: 'Instantly rebuild sections so your summary, experience, and skills mirror what the job is actually asking for.' },
        { text: 'Smart suggestions for job‑relevant skills and powerful action verbs that boost your match score and ATS visibility.' },
        { text: 'Perfect title and bullet alignment for each role, so every version feels custom—not like a copy‑paste template' },
      ],
      imageOnLeft: false
    },
    {
      image: '/assets/Services/card2.png',
      title: 'Design your story with 15+ powerful resume sections.',
      description: 'Show more than dates and job titles. Mix classic career blocks with modern, personality-driven sections so recruiters see the full version of you—not a generic template.',
      features: [
        {
          title: "Professional foundation:",
          text: "Experience, Skills, Summary, and Education laid out in clean, recruiter-approved formats."
        },
        {
          title: "Personality that stands out:",
          text: "Add Strengths, Quotes, Books, Interests, and My Time to turn a plain resume into a memorable profile."
        },
        {
          title: "Extra proof of impact:",
          text: "Showcase Certifications, Awards, Achievements, Languages, and Projects in dedicated sections that highlight what makes you different."
        }
      ],
      imageOnLeft: true
    },
    {
      image: '/assets/Services/ats_score_imae.png',
      title: 'Make sure your resume beats the bots, not just the humans.',
      description: 'An ATS-aware scan checks your resume the way recruiter software does, so it arrives in the “yes” pile exactly as you designed it.',
      features: [
        {
          title: "Spot real keyword and content gaps",
          text: "between your resume and the job description, including missing skills, tools, and role-specific phrases."
        },
        {
          title: "Get clear, actionable fixes",
          text: "to pass AI scans and recruiter bots—formatting tips, keyword placement, and structure tweaks that lift your match score."
        }
      ],
      imageOnLeft: false
    }
  ];

  return (
    <div className="min-h-screen py-4 md:py-8 px-4" id='blueprint'>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#2c2a63' }}>
          How CareerBlueprint helps the modern job seeker
        </h1>

        {/* Feature Sections */}
        <div className="space-y-16">
          {featureSections.map((section, index) => (
            <div
              key={index}
              className={`flex flex-col ${section.imageOnLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-8 lg:gap-12 items-center`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2 scale-90">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#2c2a63' }}>
                  {section.title}
                </h2>
                <p className="text-base text-gray-600 leading-relaxed">
                  {section.description}
                </p>


                <div className="space-y-3 pt-2">
                  {section.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5 bg-emerald-500 rounded-full p-1">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {feature.title && (
                          <strong className="font-bold text-gray-900">
                            {feature.title}
                          </strong>
                        )}{" "}
                        {feature.text}
                      </p>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;