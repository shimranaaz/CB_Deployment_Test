import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Home } from 'lucide-react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import toast from 'react-hot-toast';
import api from '../../configs/api';
import {
  faEnvelope,
  faFileAlt,
  faPhone,
  faMapMarkerAlt,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
import {
  faWhatsapp,
  faLinkedin,
  faInstagram,
  faFacebook
} from '@fortawesome/free-brands-svg-icons';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/users/contact', formData);
      toast.success(response.data.message || 'Message sent successfully!');

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const primaryColor = '#2c2a63';
  const accentColor = '#EDC9AF';

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8 sm:py-12 md:py-16 px-3 sm:px-4 bg-gray-100 mt-12">
        <div className="top-4 left-4 sm:left-6 z-50">
          <button
            onClick={() => window.location.href = '/'}
            className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-semibold bg-white text-sm sm:text-base"
            style={{ color: '#2c2a63' }}
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Back to Home</span>
            <span className="xs:hidden">Back to Home</span>
          </button>
        </div>

        <div className="grid max-w-6xl mx-auto mt-8 sm:mt-0">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-25 mb-8 sm:mb-12 w-full justify-center items-center">
            {/* Left: Centered Heading + Form */}
            <div className="flex flex-col justify-center items-center text-center lg:text-left w-full lg:w-auto">
              <div className="mb-6 sm:mb-8 w-full max-w-md px-4 sm:px-0">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">Get In Touch</h1>
                <p className="text-sm sm:text-base text-gray-600">We're here to help! Fill out below or use another method.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 w-full max-w-md px-4 sm:px-0">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded border border-gray-300 bg-white 
                             focus:outline-none focus:border-[#2c2a63] focus:ring-2 focus:ring-[#2c2a63] disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded border border-gray-300 bg-white 
                             focus:outline-none focus:border-[#2c2a63] focus:ring-2 focus:ring-[#2c2a63] disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded border border-gray-300 bg-white 
                             focus:outline-none focus:border-[#2c2a63] focus:ring-2 focus:ring-[#2c2a63] disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Your Message"
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded border border-gray-300 bg-white resize-none 
                             focus:outline-none focus:border-[#2c2a63] focus:ring-2 focus:ring-[#2c2a63] disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded font-semibold transition-opacity duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: primaryColor,
                    color: accentColor
                  }}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Right: Icons + Contact Info */}
            <div className="w-full lg:w-auto px-4 sm:px-0">
              {/* Icons */}
              <div className="flex justify-center lg:justify-start gap-8 sm:gap-12 lg:gap-16 mb-8 sm:mb-12">
                <div className="text-center">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 border-2"
                    style={{ borderColor: primaryColor }}
                  >
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-2xl sm:text-3xl"
                      style={{ color: primaryColor }}
                    />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Innovation</p>
                </div>

                <div className="text-center">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 border-2"
                    style={{ borderColor: primaryColor }}
                  >
                    <FontAwesomeIcon
                      icon={faFileAlt}
                      className="text-2xl sm:text-3xl"
                      style={{ color: primaryColor }}
                    />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Email</p>
                </div>
              </div>

              {/* Contact Info */}
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 text-center lg:text-left">Other Ways to Connect</h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4 justify-center lg:justify-start">
                  <FontAwesomeIcon icon={faEnvelope} className="text-xl sm:text-2xl flex-shrink-0" style={{ color: primaryColor }} />
                  <span className="text-gray-700 text-sm sm:text-base break-all">infinityjob.ijob@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 justify-center lg:justify-start">
                  <FontAwesomeIcon icon={faPhone} className="text-xl sm:text-2xl flex-shrink-0" style={{ color: primaryColor }} />
                  <span className="text-gray-700 text-sm sm:text-base">+91 81244 94755</span>
                </div>
                <div className="flex items-start gap-3 sm:gap-4 justify-center lg:justify-start">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl sm:text-2xl mt-1 flex-shrink-0" style={{ color: primaryColor }} />
                  <div className="text-center lg:text-left">
                    <p className="text-gray-700 text-sm sm:text-base">Chennai, Tamil Nadu, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4 justify-center lg:justify-start">
                  <FontAwesomeIcon icon={faGlobe} className="text-xl sm:text-2xl mt-1 flex-shrink-0" style={{ color: primaryColor }} />
                  <div className="text-center lg:text-left">
                    <p className="text-gray-700 text-sm sm:text-base break-all">www.careerblueprint.co.in</p>
                  </div>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center lg:justify-start">
                <a
                  href="https://wa.me/918124494755"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-opacity duration-300 hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="text-lg sm:text-xl" style={{ color: accentColor }} />
                </a>
                <a
                  href="https://www.linkedin.com/company/careers-blueprint/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-opacity duration-300 hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  <FontAwesomeIcon icon={faLinkedin} className="text-lg sm:text-xl" style={{ color: accentColor }} />
                </a>
                <a
                  href="https://www.instagram.com/careers_blueprint/?igsh=MXhoazNienZpc2U0Yw%3D%3D#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-opacity duration-300 hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  <FontAwesomeIcon icon={faInstagram} className="text-lg sm:text-xl" style={{ color: accentColor }} />
                </a>
                <a
                  href="https://www.facebook.com/people/Careers-Blueprint/61578394427960/?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-opacity duration-300 hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  <FontAwesomeIcon icon={faFacebook} className="text-lg sm:text-xl" style={{ color: accentColor }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;