import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="py-12" style={{ backgroundColor: "#2c2a63" }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Company Info */}
          <div className="text-sm md:text-base">
            <Link to='/'>
              <h3 className="text-xl font-bold mb-4 cursor-pointer" style={{ color: "#EDC9AF" }}>
                Career Blueprint
              </h3>
            </Link>

            <p className="text-white/80 mb-2">Chennai</p>
            <p className="text-white/80 mb-2">Tamil Nadu, India</p>
            <p className="text-white/80 mb-2">
              <span className="font-semibold">Phone:</span> +91 81244 94755
            </p>
            <p className="text-white/80">
              <span className="font-semibold">Email:</span>{" "}
              infinityjob.job@gmail.com
            </p>
          </div>

          {/* Useful Links */}
          <div className="text-sm md:text-base">
            <h3 className="text-xl font-bold mb-4" style={{ color: "#EDC9AF" }}>
              Useful Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-white/80 hover:text-accent transition-colors">
                  Home
                </a>
              </li>
              <li>
                <Link to="/missionSection" className="text-white/80 hover:text-accent transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <a href="#offer" className="text-white/80 hover:text-accent transition-colors">
                  What We Offer
                </a>
              </li>
              <li>
                <a href="#resume" className="text-white/80 hover:text-accent transition-colors">
                  Resume template
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-white/80 hover:text-accent transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-sm md:text-base">
            <h3 className="text-xl font-bold mb-4" style={{ color: "#EDC9AF" }}>
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-white/80 hover:text-accent transition-colors">
                  Legal & Policy Center
                </Link>
              </li>
              <li>
                <Link to="/Contact" className="text-white/80 hover:text-accent transition-colors">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="text-sm md:text-base">
            <h3 className="text-xl font-bold mb-4" style={{ color: "#EDC9AF" }}>
              Follow Us
            </h3>
            <div className="flex space-x-4">

              <a
                href="https://www.facebook.com/people/Careers-Blueprint/61578394427960/?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ backgroundColor: "#EDC9AF", color: "#2c2a63" }}
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>

              <a
                href="https://www.instagram.com/careers_blueprint/?igsh=MXhoazNienZpc2U0Yw%3D%3D#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ backgroundColor: "#EDC9AF", color: "#2c2a63" }}
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>

              <a
                href="https://www.linkedin.com/company/careers-blueprint/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ backgroundColor: "#EDC9AF", color: "#2c2a63" }}
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>

              <a
                href="https://wa.me/918124494755"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ backgroundColor: "#EDC9AF", color: "#2c2a63" }}
              >
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>

            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="pt-6 text-center"
          style={{ borderTop: "1px solid #EDC9AF" }}
        >
          <p className="text-white/80 text-sm md:text-base">
            © 2026{" "}
            <span style={{ color: "#EDC9AF", fontWeight: "600" }}>
              Career Blueprint
            </span>
            . All Rights Reserved
          </p>
        </div>
      </div>

      {/* Fixed WhatsApp Button */}
      <a
        href="https://wa.me/918124494755"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-50"
        style={{ backgroundColor: "#25D366" }}
      >
        <FontAwesomeIcon icon={faWhatsapp} className="text-white text-2xl" />
      </a>
    </footer>
  );
};

export default Footer;