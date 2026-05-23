import React from "react";
import { useNavigate } from "react-router-dom";

const ResumeBanner: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateResume = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/app");
    } else {
      navigate("/login");
    }
  };
  return (
    <section className="w-full flex justify-center px-4 py-7">
      <div
        className="w-full max-w-6xl rounded-3xl flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-10 px-6 md:px-5 py-8 md:py-5"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        {/* LEFT CONTENT */}
        <div className="flex-1 text-center lg:text-left w-full">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#2c2a63] leading-tight">
            Build the resume that finally gets a{" "}
            <span className="font-bold" style={{ color: "#0d9e63" }}>
              yes.
            </span>
          </h2>

          <p className="text-gray-600 mt-3 text-sm md:text-base">
            Start in minutes, tailor with AI, and send applications you’re proud of
          </p>

          <button
            onClick={handleCreateResume}
            className="mt-6 px-6 py-3 rounded-lg font-semibold transition hover:opacity-90 text-sm md:text-base"
            style={{ backgroundColor: "#2c2a63", color: "#EDC9AF" }}
          >
            Create my resume now
          </button>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 relative flex justify-center w-full">
          {/* MAIN IMAGE */}
          <div className="relative rounded-3xl overflow-hidden w-full max-w-md lg:max-w-lg h-64 md:h-72 lg:h-80 shadow-lg">
            <img
              src="/assets/Services/resume-banner.jpg"
              alt="Resume preview"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeBanner;