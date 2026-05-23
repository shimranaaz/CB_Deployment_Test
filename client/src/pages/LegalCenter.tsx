import { useState } from "react";
import React from "react";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";

const sections = [
  "Terms of Service",
  "Privacy Policy",
  "Data Collection",
  "User Rights",
  "Subscription Terms",
  "Contact Information",
] as const;

type Section = typeof sections[number];

const contentMap: Record<Section, React.ReactNode> = {
  "Terms of Service": (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Terms of Service</h2>
      <p className="text-gray-600 mb-6">
        By accessing and using Career Blueprint's services, you accept and agree to be bound by the terms and provision of this agreement.
      </p>
      <p className="text-gray-600 mb-6">
        Our services are provided for career development and professional advancement purposes. You agree to use our services in compliance with all applicable laws and regulations.
      </p>
    </>
  ),
  "Privacy Policy": (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Privacy Policy</h2>
      <p className="text-gray-600 mb-6">
        We value your privacy. This policy outlines how we collect, use, and protect your personal information.
      </p>
    </>
  ),
  "Data Collection": (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Collection</h2>
      <p className="text-gray-600 mb-6">
        We collect data to improve our services. This includes usage patterns, contact details, and resume content.
      </p>
    </>
  ),
  "User Rights": (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User Rights</h2>
      <p className="text-gray-600 mb-6">
        You have the right to access, modify, and delete your personal data. Contact us for any requests.
      </p>
    </>
  ),
  "Subscription Terms": (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Subscription Terms</h2>
      <p className="text-gray-600 mb-6">
        Subscriptions are billed monthly or annually. You may cancel anytime, but refunds are not guaranteed.
      </p>
    </>
  ),
  "Contact Information": (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
      <p className="text-gray-600 mb-6">
        For any questions, reach out to us at{" "}
        <span className="font-semibold text-[#2c2a63]">support@careerblueprint.com</span> or call{" "}
        <span className="font-semibold text-[#2c2a63]">+91 81244 94755</span>.
      </p>
    </>
  ),
};

const LegalCenter = () => {
  const [activeSection, setActiveSection] = useState<Section>("Terms of Service");

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-1/3">
            <div className="bg-white shadow-lg rounded-xl border-l-4 border-[#EDC9AF] p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Legal Navigation</h3>
              <ul className="space-y-3">
                {sections.map((section) => (
                  <li key={section}>
                    <button
                      onClick={() => setActiveSection(section)}
                      className={`w-full text-left px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
                        activeSection === section
                          ? "bg-[#2c2a63] text-[#EDC9AF]"
                          : "bg-amber-100 text-amber-900 hover:bg-[#2c2a63] hover:text-[#EDC9AF]"
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
            <div className="bg-white shadow-xl rounded-xl p-8">
              <div className="inline-block bg-[#EDC9AF] text-[#2c2a63] font-semibold px-4 py-2 rounded-md mb-4">
                {activeSection}
              </div>
              <p className="text-gray-500 italic mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <div className="prose prose-lg max-w-none">
                {contentMap[activeSection]}
              </div>
            </div>
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LegalCenter;
