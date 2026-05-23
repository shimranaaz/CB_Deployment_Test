import { Lightbulb, Info, Heart, CheckCircle } from 'lucide-react';
import { Link } from "react-router-dom";
import { Home } from 'lucide-react';
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="py-8 md:py-12 lg:py-6 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-4 mt-16 md:mt-20">
          <div className="mb-5">
            <button
              onClick={() => window.location.href = '/'}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-semibold bg-white"
              style={{ color: '#2c2a63' }}
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 leading-tight" style={{ color: '#2c2a63' }}>
              Our Mission: Turning Confusing Job Hunts into Clear Career Wins
            </h1>
            <p className="text-sm md:text-base lg:text-lg max-w-4xl mx-auto leading-relaxed" style={{ color: '#2c2a63' }}>
              AI-powered resumes, real human guidance, and simple tools that help you move from "I don't know where to start" to "I just got the offer."
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Who Are We */}
          <div className="bg-[#f5f5f5] rounded-lg shadow-md p-5 md:p-6 lg:p-8 h-fit">

            <h2
              className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4"
              style={{ color: '#2c2a63' }}
            >
              Who We Are
            </h2>

            <p className="text-gray-600 leading-relaxed text-xs md:text-sm lg:text-base">
              Career Blueprint is a small, focused team of career coaches, designers, and tech builders obsessed with one thing: helping you stand out. From ATS-safe, modern resumes to interview prep and career clarity, everything is built so students and professionals can grow faster with less stress.
            </p>
          </div>


          {/* What Drives Us */}
          <div className="bg-[#f5f5f5] rounded-lg shadow-md p-5 md:p-6 lg:p-8">

            <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 md:mb-6" style={{ color: '#2c2a63' }}>
              What Drives Us
            </h2>
            <div className="space-y-4 md:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <div className="flex gap-2 md:gap-3">
                  <Lightbulb className="flex-shrink-0 mt-0.5" style={{ color: '#1db954' }} size={20} />
                  <div>
                    <h3 className="font-semibold mb-1 text-sm md:text-base" style={{ color: '#2c2a63' }}>
                      Innovation
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      Using smart AI and fresh design so your resume never feels generic.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 md:gap-3">
                  <Heart className="flex-shrink-0 mt-0.5" style={{ color: '#1db954' }} size={20} />
                  <div>
                    <h3 className="font-semibold mb-1 text-sm md:text-base" style={{ color: '#2c2a63' }}>
                      Guidance
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      Turning messy career questions into simple, step‑by‑step actions you can follow.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <div className="flex gap-2 md:gap-3">
                  <Info className="flex-shrink-0 mt-0.5" style={{ color: '#1db954' }} size={20} />
                  <div>
                    <h3 className="font-semibold mb-1 text-sm md:text-base" style={{ color: '#2c2a63' }}>
                      Clarity
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      Presenting your story in a way recruiters instantly understand and remember.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 md:gap-3">
                  <CheckCircle className="flex-shrink-0 mt-0.5" style={{ color: '#1db954' }} size={20} />
                  <div>
                    <h3 className="font-semibold mb-1 text-sm md:text-base" style={{ color: '#2c2a63' }}>
                      Results
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      Resumes, coaching, and tools all focused on one outcome: more interviews and better offers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-lg py-10 md:py-12 lg:py-8 px-4 md:px-6 text-center" style={{ backgroundColor: '#2c2a63' }}>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-6 md:mb-8">
            Join Our Community of Achievers
          </h2>
          <Link to="/">
            <button
              className="px-5 md:px-6 py-2.5 md:py-3 rounded-md font-medium transition-all hover:opacity-90 inline-flex items-center gap-2 text-sm md:text-base"
              style={{ backgroundColor: '#EDC9AF', color: '#2c2a63' }}
            >
              Explore Services
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="md:w-4 md:h-4"
              >
                <path
                  d="M6 3L11 8L6 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}