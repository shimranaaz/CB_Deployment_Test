import { useState, useEffect } from "react";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import { Home, Loader2 } from 'lucide-react';
import './Terms.css';

const sections = [
  "Terms of Service",
  "Privacy & Data Protection Policy",
  "Information Collection & Usage",
  "Your Rights & Control Over Data",
  "Subscription & Billing Terms",
  "Support & Contact Details",
  "Cancellation & Refund Policy",
  "Digital Delivery Policy",
  "AI & Data Privacy Commitment",
] as const;

type Section = typeof sections[number];

interface TermsData {
  _id: string;
  section: string;
  content: string;
  lastUpdated: string;
  updatedBy?: string;
}

const Terms = () => {
  const [activeSection, setActiveSection] = useState<Section>("Terms of Service");
  const [termsData, setTermsData] = useState<Record<string, TermsData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch terms from backend API
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        // Adjust this URL to match your backend - could be /api/terms or /terms
        const response = await fetch('https://deployment-careerblueprint.onrender.com/api/terms');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched terms data:', data); // For debugging

        // Convert array to object with section as key for easy lookup
        const termsMap: Record<string, TermsData> = {};
        if (data.success && data.terms && Array.isArray(data.terms)) {
          data.terms.forEach((term: TermsData) => {
            termsMap[term.section] = term;
          });
        }
        
        setTermsData(termsMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching terms:', err);
        setError('Failed to load terms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []); // Empty dependency array = fetch only once on mount

  // Format content - split by newlines and handle lists
  const formatContent = (content: string) => {
    if (!content) return <p>No content available.</p>;
    
    // Split content into lines
    const lines = content.split('\n').filter(line => line.trim());
    
    return (
      <div className="space-y-4 text-[#2c2a63]">
        {lines.map((line, index) => {
          const trimmedLine = line.trim();
          
          // Check for bullet points or list items
          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            return (
              <ul key={index} className="list-disc pl-6">
                <li>{trimmedLine.replace(/^[•\-*]\s*/, '')}</li>
              </ul>
            );
          }
          
          // Regular paragraph
          return <p key={index}>{trimmedLine}</p>;
        })}
      </div>
    );
  };

  // Get current section content from fetched data
  const currentContent = termsData[activeSection];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <section className="py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="mt-2 sm:mt-4 ml-3 sm:ml-4 md:ml-6 z-50 mb-3 sm:mb-5">
          <button
            onClick={() => window.location.href = '/'}
            className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-semibold bg-white border border-[#EDC9AF] text-xs sm:text-sm md:text-base"
            style={{ color: '#2c2a63' }}
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back to Home</span>
          </button>
        </div>
        
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#EDC9AF]">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">Legal Navigation</h3>
              <ul className="space-y-2 sm:space-y-3">
                {sections.map((section) => (
                  <li key={section}>
                    <button
                      onClick={() => setActiveSection(section)}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm md:text-base ${
                        activeSection === section
                          ? "bg-[#2c2a63] text-[#EDC9AF] shadow-sm"
                          : "bg-transparent text-[#2c2a63] hover:bg-[#EDC9AF] hover:text-[#2c2a63]"
                      }`}
                    >
                      {section}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Content */}
          <main className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-[#EDC9AF] text-[#2c2a63]">
              {/* Section heading */}
              <div className="inline-block bg-[#EDC9AF] text-[#2c2a63] font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-md mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                {activeSection}
              </div>

              {/* Loading state */}
              {loading && (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-[#2c2a63]" />
                  <span className="ml-2 sm:ml-3 text-base sm:text-lg">Loading terms...</span>
                </div>
              )}

              {/* Error state */}
              {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                  <p className="text-red-600 text-sm sm:text-base">{error}</p>
                  <p className="text-xs sm:text-sm text-red-500 mt-2">
                    Please check if your backend server is running on http://localhost:5000
                  </p>
                </div>
              )}

              {/* Content - Show from database if available */}
              {!loading && !error && currentContent && (
                <>
                  <p className="italic text-xs sm:text-sm mb-4 sm:mb-6">
                    Last updated: {new Date(currentContent.lastUpdated).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                  <div className="Terms-content text-sm sm:text-base">
                    {formatContent(currentContent.content)}
                  </div>
                </>
              )}

              {/* Fallback if no data for this section */}
              {!loading && !error && !currentContent && (
                <div className="py-6 sm:py-8">
                  <p className="text-gray-500 text-center text-sm sm:text-base">
                    No content available for "{activeSection}" yet.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 text-center mt-2">
                    Please add content via the admin dashboard.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Terms;