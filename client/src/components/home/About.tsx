import React from "react";
interface TitleProps {
  title: string;
  description: string;
}

const Title: React.FC<TitleProps> = ({ title, description }) => (
  <div className="text-center max-w-3xl mx-auto mt-6 mb-8 px-4">
    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
      {title}
    </h2>
    <p className="text-slate-600 text-base md:text-lg">
      {description}
    </p>
  </div>
);

const AboutCareerBlueprint: React.FC = () => {
  return (
    <div
      id="features"
      className="flex flex-col items-center my-6 md:my-10 scroll-mt-5 px-4"
    >
      <Title
        title="Build your resume"
        description="Our streamlined process helps you create a professional resume in minutes with intelligent AI-powered tools and features."
      />

      <div className="flex flex-col lg:flex-row items-center lg:items-start mt-6 md:mt-8 gap-6 md:gap-16 w-full max-w-6xl mb-6 md:mb-10">

        {/* LEFT - IMAGE */}
        <div className="w-full lg:w-1/2 relative mb-12 lg:mb-0">
          <div className="w-full shadow-2xl">

            <img
              src="/assets/Services/aboutus.png"
              alt="Resume builder preview"
              className="w-full h-auto object-contain rounded-none
    max-h-[360px] md:max-h-[420px] lg:max-h-[480px]"
            />
          </div>
        </div>

        {/* RIGHT - FEATURE CARDS */}
        <div className="w-full lg:w-1/2 space-y-8 md:space-y-12 px-4 md:px-0">

          <div className="flex items-start gap-4 md:gap-6">
            <img
              src="/assets/Services/idea.png"
              className="w-16 h-16 md:w-20 md:h-18 flex-shrink-0 object-contain"
              alt="idea"
            />
            <div>
              <h3 className="text-base font-semibold text-slate-700">
                Smart AI Resume Studio
              </h3>
              <p className="text-sm text-slate-600">
                Upload your details once, then instantly create stunning multi-color resumes with any template, any style, and live preview before you download.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 md:gap-6">
            <img
              src="/assets/Services/retweet.png"
              className="w-16 h-16 md:w-20 md:h-18 flex-shrink-0 object-contain"
              alt="retweet"
            />
            <div>
              <h3 className="text-base font-semibold text-slate-700">
                One Profile, Endless Resumes
              </h3>
              <p className="text-sm text-slate-600">
                Fill your info a single time and switch between modern templates, color themes, and layouts with a single click from your smart dashboard.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 md:gap-6">
            <img
              src="/assets/Services/file.png"
              className="w-16 h-16 md:w-20 md:h-18 flex-shrink-0 object-contain"
              alt="file"
            />
            <div>
              <h3 className="text-base font-semibold text-slate-700">
                Click. Customize. Download
              </h3>
              <p className="text-sm text-slate-600">
                Instantly preview your AI-crafted resume online, choose your favorite design, and export in high-quality PDF—everything managed from one powerful dashboard.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutCareerBlueprint;