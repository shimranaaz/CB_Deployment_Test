import React from "react";
import { useNavigate } from "react-router-dom";
import notfoundImg from "/assets/Services/notfound.png";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-12">
      <div className="max-w-6xl w-full flex flex-col items-center">

        {/* Top Section: Image + Text */}
     <div className="flex flex-col lg:flex-row items-center justify-center gap-14 mb-6 w-full">


          {/* Left Illustration */}
          <div className="flex justify-center">
            <img
              src={notfoundImg}
              alt="404 Not Found"
              className="w-80 md:w-96 lg:w-[420px] object-contain"
            />
          </div>

          {/* Right Text */}
          <div className="text-center lg:text-left">
            <h1 className="text-[110px] md:text-[140px] font-extrabold text-neutral-900 leading-none">
              404
            </h1>

            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mt-2">
              Page Not Found
            </h2>

            <p className="text-gray-500 text-lg md:text-xl mt-4 max-w-md">
              Oops! We can’t seem to find the page you’re looking for.
            </p>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 w-full max-w-3xl justify-center">

          {/* Home Button */}
          <button
            onClick={() => navigate("/")}
            className="flex-1 px-8 py-4 border-2 rounded-full font-semibold text-lg
                       border-[#2c2a63] text-[#2c2a63]
                       hover:bg-[#2c2a63] hover:text-[#EDC9AF] transition-all"
          >
            Go to Home Page
          </button>

          {/* Explore Templates Button */}
          <button
            onClick={() => navigate("/")}
            className="flex-1 px-8 py-4 rounded-full font-semibold text-lg 
                       bg-[#2c2a63] text-[#EDC9AF]
                       hover:opacity-90 transition-all"
          >
            Explore Templates
          </button>

          {/* Visit Help Center Button */}
          <button
            onClick={() => navigate("/contact")}
            className="flex-1 px-8 py-4 border-2 rounded-full font-semibold text-lg
                       border-[#2c2a63] text-[#2c2a63]
                       hover:bg-[#2c2a63] hover:text-[#EDC9AF] transition-all"
          >
            Visit Help Center
          </button>

        </div>
      </div>
    </div>
  );
};

export default NotFound;
