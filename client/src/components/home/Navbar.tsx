import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  faHome,
  faInfoCircle,
  faBriefcase,
  faFileAlt,
  faDollarSign,
  faBars,
  faTimes,
  faClipboardCheck
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import "./Hero.css";

interface NavItem {
  name: string;
  path?: string;
  hash: string;
  icon: any;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = useSelector((state: any) => state.auth?.user?.role);

  const navItems: NavItem[] = [
    { name: "Home", path: "/", hash: "#home", icon: faHome },
    { name: "Free ATS Score", path: "/ats-checker", hash: "#freeatsscore", icon: faClipboardCheck },
    isLoggedIn
      ? {
        name: "Dashboard",
        path: userRole === "sales" ? "/sales/ats-checker" : "/UserProfile",
        hash: "",
        icon: faInfoCircle,
      }
      : { name: "Blueprint", hash: "#blueprint", icon: faInfoCircle },
    { name: "What We Offer", hash: "#offer", icon: faBriefcase },
    { name: "Resume", hash: "#resume", icon: faFileAlt },
    { name: "Pricing", hash: "#pricing", icon: faDollarSign },
  ];

  const socialIcons = [
    {
      icon: faInstagram,
      href: "https://www.instagram.com/careers_blueprint/?igsh=MXhoazNienZpc2U0Yw%3D%3D#",
    },
    {
      icon: faFacebook,
      href: "https://www.facebook.com/people/Careers-Blueprint/61578394427960/?utm_source=ig&utm_medium=social&utm_content=link_in_bio",
    },
    {
      icon: faWhatsapp,
      href: "https://wa.me/918124494755",
    },
    {
      icon: faLinkedin,
      href: "https://www.linkedin.com/company/careers-blueprint/posts/?feedView=all",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    e.preventDefault();
    if (item.path && item.path !== window.location.pathname) {
      navigate(item.path);
      setTimeout(() => {
        if (item.hash) {
          setActiveLink(item.hash);
          const el = document.querySelector(item.hash);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else if (item.hash) {
      setActiveLink(item.hash);
      const el = document.querySelector(item.hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "shadow-lg" : ""
        }`}
      style={{ backgroundColor: "#1e1c55" }}
    >
      <div
        className="w-full px-3 md:px-5 lg:px-6 flex items-center justify-between"
        style={{ height: "70px" }}
      >
        <div className="flex items-center" style={{ marginTop: "18px" }}>
          <Link to="/">
            <img
              src="/Logo.png"
              alt="Career Logo"
              className="object-cover"
              style={{ height: "60px", width: "230px", marginTop: "-15px" }}
            />
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={(e) => handleNavClick(e, item)}
              className={`nav-link ${(item.path && location.pathname === item.path) ||
                  (!item.path && activeLink === item.hash)
                  ? "active" : ""
                }`}
            >
              {item.name}
            </button>
          ))}
          <Link
            to={isLoggedIn ? "/UserProfile" : "/login"}
            className="px-6 py-2 hover:bg-white hover:text-[#1e1c55] active:scale-95 transition-all rounded-full text-white"
            style={{ border: "2px solid white" }}
          >
            {isLoggedIn ? "My Profile" : "Login"}
          </Link>
        </div>

        <div className="lg:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)}>
            <FontAwesomeIcon
              icon={isOpen ? faTimes : faBars}
              className="w-7 h-7 text-white"
            />
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        style={{
          width: "65%",
          background: "rgba(30, 28, 85, 0.65)",
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
          borderRadius: "0 15px 15px 0",
          maxHeight: "530px",
          height: "auto",
        }}
      >
        <div className="flex flex-col justify-between h-full py-10 px-6">
          <div className="flex flex-col gap-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={(e) => {
                  setIsOpen(false);
                  handleNavClick(e, item);
                }}
                className="flex items-center font-medium text-white hover:text-[#EDC9AF] gap-3 text-left"
              >
                <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                {item.name}
              </button>
            ))}

            <Link
              to={isLoggedIn ? "/UserProfile" : "/login"}
              onClick={() => setIsOpen(false)}
              className="flex items-center font-medium text-white hover:bg-white hover:text-[#1e1c55] gap-3 mt-4 px-4 py-2 rounded-full justify-center transition-all"
              style={{ border: "2px solid white" }}
            >
              {isLoggedIn ? "My Profile" : "Login"}
            </Link>
          </div>

          <div className="flex gap-4 justify-start mt-8">
            {socialIcons.map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 text-white hover:bg-white hover:bg-opacity-20"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                }}
              >
                <FontAwesomeIcon icon={social.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;