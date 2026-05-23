import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";

const ContactInformation = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl bg-white shadow-xl rounded-xl p-8">
          {/* Header Badge */}
          <div className="inline-block bg-amber-100 text-amber-900 font-semibold px-4 py-2 rounded-md mb-4">
            Contact Information
          </div>

          {/* Last Updated */}
          <p className="text-gray-500 italic mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
              Contact Information
            </h2>
            <p className="text-gray-600 mb-6">
              For any questions, reach out to us at{" "}
              <span className="font-semibold text-[#2c2a63]">
                support@careerblueprint.com
              </span>{" "}
              or call{" "}
              <span className="font-semibold text-[#2c2a63]">
                +91 81244 94755
              </span>
              .
            </p>
            <p className="text-gray-600 mb-6">
              You can also connect with us through our social media channels
              for updates, announcements, and support.
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Twitter: @careerblueprint</li>
              <li>LinkedIn: Career Blueprint Official</li>
              <li>Instagram: @careerblueprint</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactInformation;
