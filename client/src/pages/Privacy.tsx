import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl bg-white shadow-xl rounded-xl p-8">
          <div className="inline-block bg-amber-100 text-amber-900 font-semibold px-4 py-2 rounded-md mb-4">
            Privacy Policy
          </div>
          <p className="text-gray-500 italic mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Privacy Policy</h2>
            <p className="text-gray-600 mb-6">
              We value your privacy. This policy outlines how we collect, use, and protect your personal information.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Privacy;
