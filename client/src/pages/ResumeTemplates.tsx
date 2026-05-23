import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Crown, Loader2, Filter, Home } from 'lucide-react';
import { Card, CardContent } from "../components/ui/card";
import api from "../configs/api";
import toast from "react-hot-toast";
import Navbar from '../components/home/Navbar';
import Footer from "../components/home/Footer";

interface Template {
  id: string;
  name: string;
  image: string;
  isPremium: boolean;
  category: string;
}

interface RootState {
  auth: {
    token: string | null;
    user: {
      name: string;
      email: string;
      id: string;
    } | null;
    loading: boolean;
  };
}

interface CreateResumeResponse {
  resume: {
    _id: string;
    title: string;
    template: string;
  };
  message: string;
}

const templates: Template[] = [
  { id: "modern-two-column", name: "Simple Resume Core", image: "/templates/modern-two-column-preview.jpeg", isPremium: false, category: "Simple" },
  { id: "digital-pro", name: "Simple Foundation", image: "/templates/digital-pro-preview.jpeg", isPremium: false, category: "Simple" },
  { id: "modern", name: "Modern Edge", image: "/templates/modern-preview.jpg", isPremium: true, category: "Word" },
  { id: "minimal-image", name: "Profile Minimal", image: "/templates/minimal-image-preview.jpg", isPremium: true, category: "Two-column" },
  { id: "minimal", name: "Pure Minimal", image: "/templates/minimal-preview.jpg", isPremium: true, category: "Word" },
  { id: "geometric-blue", name: "Pro ATS", image: "/templates/geometric-blue.webp", isPremium: true, category: "ATS" },
  { id: "classic", name: "Executive Classic", image: "/templates/classic-preview.jpg", isPremium: true, category: "Word" },
  { id: "geometric", name: "Geometry Elite", image: "/templates/geometric-preview.jpg", isPremium: true, category: "Two-column" },
  { id: "modern-sidebar", name: "Sidebar Professional", image: "/templates/modern-sidebar-preview.jpg", isPremium: true, category: "Two-column" },
  { id: "stylish", name: "Stylish Executive", image: "/templates/stylish-preview.jpg", isPremium: true, category: "Two-column" },
  { id: "clean-modern", name: "Clean ATS Pro", image: "/templates/clean-modern-preview.jpg", isPremium: true, category: "ATS" },
  { id: "soft-minimal", name: "Soft ATS Pro", image: "/templates/soft-minimal-preview.jpg", isPremium: true, category: "ATS" },
  { id: "professional-resume", name: "Prime Professional", image: "/templates/professional-resume-preview.jpeg", isPremium: true, category: "Two-column" },
  { id: "professional-modern", name: "Modern Profile", image: "/templates/professional-modern-preview.jpeg", isPremium: true, category: "Picture" },
  { id: "professional-resume-template", name: "Professional Prime", image: "/templates/professional-resume-template-preview.jpeg", isPremium: true, category: "Picture" },
  { id: "soft-stylish", name: "Stylish Soft Pro", image: "/templates/soft-stylish-preview.jpeg", isPremium: true, category: "Word" },
  { id: "professional", name: "Corporate Professional", image: "/templates/professional-preview.jpeg", isPremium: true, category: "Word" },
  { id: "creative", name: "Creative Professional", image: "/templates/creative-preview.jpeg", isPremium: true, category: "Word" },
  { id: "executive", name: "Executive Prime", image: "/templates/executive-preview.jpeg", isPremium: true, category: "Word" },
  { id: "tech", name: "Tech ATS Pro", image: "/templates/tech-preview.jpeg", isPremium: true, category: "ATS" },
  { id: "technical", name: "Technical Visual", image: "/templates/technical-preview.jpeg", isPremium: true, category: "Picture" },
  { id: "elite", name: "Elite Visual", image: "/templates/elite-preview.jpeg", isPremium: true, category: "Picture" },
  { id: "profile", name: "Profile Executive", image: "/templates/profile-preview.jpeg", isPremium: true, category: "Picture" },
  { id: "ember-creative", name: "Creative Ember", image: "/templates/ember-creative-preview.jpeg", isPremium: true, category: "Word" },
  { id: "smart-resume", name: "Smart Professional", image: "/templates/smart-resume-preview.jpeg", isPremium: true, category: "Word" },
  { id: "minimal-cv", name: "Minimal Professional CV", image: "/templates/minimal-cv-preview.jpeg", isPremium: true, category: "Two-column" },
  { id: "prime-edge", name: "Prime Edge", image: "/templates/prime-edge-preview.jpeg", isPremium: true, category: "Two-column" },
  { id: "elitecraft-cv", name: "EliteCraft", image: "/templates/elitecraft-cv-preview.jpeg", isPremium: true, category: "Two-column" },
  { id: "executive-cv", name: "Executive Visual CV", image: "/templates/executive-cv-preview.jpeg", isPremium: true, category: "Picture" },
  { id: "pureform-resume", name: "PureForm ATS", image: "/templates/pureform-resume-preview.jpeg", isPremium: true, category: "ATS" },
  { id: "meridian-cv", name: "Meridian Visual CV", image: "/templates/meridian-cv-preview.jpeg", isPremium: true, category: "Picture" },
  { id: "elevare-cv", name: "Elevare ATS", image: "/templates/elevare-cv-preview.jpeg", isPremium: true, category: "ATS" },
  { id: "talentra-cv", name: "Talentra Visual", image: "/templates/talentra-cv-preview.jpeg", isPremium: true, category: "Picture" },
  { id: "boardline-cv", name: "Boardline Visual", image: "/templates/boardline-cv-preview.jpeg", isPremium: true, category: "Picture" },
  { id: "apex-resume", name: "Apex Visual", image: "/templates/apex-resume-preview.jpeg", isPremium: true, category: "Picture" },
  { id: "blueprint-resume", name: "Blueprint Professional", image: "/templates/blueprint-resume-preview.jpeg", isPremium: true, category: "Word" },
  { id: "technexa-resume", name: "TechNexa", image: "/templates/technexa-resume-preview.jpeg", isPremium: true, category: "Two-column" },
  { id: "stackpro-cv", name: "StackPro ATS", image: "/templates/stackpro-cv-preview.jpeg", isPremium: true, category: "ATS" },
  { id: "visualcraft-cv", name: "VisualCraft Pro", image: "/templates/visualcraft-cv-preview.jpeg", isPremium: true, category: "Picture" },
  { id: "designflux-resume", name: "DesignFlux Professional", image: "/templates/designflux-resume-preview.jpeg", isPremium: true, category: "Word" },
  { id: "elitepath-cv", name: "ElitePath Visual", image: "/templates/elitepath-cv-preview.jpeg", isPremium: true, category: "Picture" },
  { id: "imperial-cv", name: "Imperial Professional", image: "/templates/imperial-cv-preview.jpeg", isPremium: true, category: "Two-column" },
  { id: "corporate-atlas", name: "Corporate Atlas", image: "/templates/corporate-atlas-preview.jpeg", isPremium: true, category: "Picture" },
  { id: "executive_cv", name: "Executive Minimal", image: "/templates/executive-cv-preview-img.jpeg", isPremium: true, category: "Word" },
  { id: "artistry-resume", name: "Artistry Professional", image: "/templates/artistry-resume-preview.jpeg", isPremium: true, category: "Word" },
  { id: "pixel-aura", name: "PixelAura", image: "/templates/pixel-aura-preview.jpeg", isPremium: true, category: "Two-column" },
  { id: "beginner-pro", name: "Beginner Professional", image: "/templates/beginner-pro-preview.jpeg", isPremium: false, category: "Word" },
  { id: "design-smart", name: "DesignSmart Professional", image: "/templates/design-smart-preview.jpeg", isPremium: true, category: "Word" },
  { id: "career-elite", name: "Career Elite", image: "/templates/career-elite-preview.jpeg", isPremium: true, category: "Picture" },
  { id: "codepro-resume", name: "CodePro", image: "/templates/codepro-resume-preview.jpeg", isPremium: true, category: "Two-column" },
];

const templateMeta: Record<string, { description: string; users: number }> = {
  "modern-two-column": { description: "A clean starting point for freshers entering the job market.", users: 8200 },
  "digital-pro": { description: "Simple and straightforward layout for your first resume.", users: 7400 },
  "modern": { description: "Sharp modern design with bold section dividers.", users: 21000 },
  "minimal-image": { description: "Two-column layout with a sleek minimal profile section.", users: 19500 },
  "minimal": { description: "Distraction-free word-style resume for any industry.", users: 23000 },
  "geometric-blue": { description: "Geometry-accented ATS-friendly resume built to pass filters.", users: 61000 },
  "classic": { description: "Timeless executive layout trusted by senior professionals.", users: 34000 },
  "geometric": { description: "Elite two-column design with geometric visual accents.", users: 27000 },
  "modern-sidebar": { description: "Sidebar layout that highlights skills and contact info.", users: 25000 },
  "stylish": { description: "Bold executive style with a refined two-column structure.", users: 29000 },
  "clean-modern": { description: "Ultra-clean ATS resume optimized for recruiter screening.", users: 58000 },
  "soft-minimal": { description: "Soft tones and clean lines for an approachable ATS resume.", users: 54000 },
  "professional-resume": { description: "Premium two-column layout for ambitious professionals.", users: 31000 },
  "professional-modern": { description: "Modern picture resume that makes a strong first impression.", users: 36000 },
  "professional-resume-template": { description: "Prime picture layout combining style with readability.", users: 33000 },
  "soft-stylish": { description: "Soft professional word resume with elegant typography.", users: 22000 },
  "professional": { description: "Corporate-grade word resume for business professionals.", users: 26000 },
  "creative": { description: "Creative word layout that balances style and substance.", users: 24000 },
  "executive": { description: "Prime executive word resume for leadership roles.", users: 28000 },
  "tech": { description: "ATS-optimized resume designed for tech industry roles.", users: 63000 },
  "technical": { description: "Visual resume tailored for technical and engineering roles.", users: 38000 },
  "elite": { description: "Elite picture resume that commands attention instantly.", users: 41000 },
  "profile": { description: "Executive picture resume with a strong profile section.", users: 39000 },
  "ember-creative": { description: "Warm creative word resume with a distinctive ember tone.", users: 20000 },
  "smart-resume": { description: "Smart and structured word resume for versatile careers.", users: 23500 },
  "minimal-cv": { description: "Minimal two-column CV for a focused professional image.", users: 30000 },
  "prime-edge": { description: "Edge-cutting two-column layout for top-tier candidates.", users: 28500 },
  "elitecraft-cv": { description: "Craftfully designed two-column resume for elite roles.", users: 27500 },
  "executive-cv": { description: "Visual CV with executive polish and picture placement.", users: 37000 },
  "pureform-resume": { description: "Pure structured ATS resume with zero formatting noise.", users: 55000 },
  "meridian-cv": { description: "Meridian visual CV with a balanced picture-led layout.", users: 35000 },
  "elevare-cv": { description: "Elevated ATS resume designed for high-impact applications.", users: 57000 },
  "talentra-cv": { description: "Talent-forward picture resume for creative professionals.", users: 40000 },
  "boardline-cv": { description: "Board-level visual resume for executive picture profiles.", users: 42000 },
  "apex-resume": { description: "Apex-tier picture resume for peak career performance.", users: 44000 },
  "blueprint-resume": { description: "Blueprint-style word resume with structured precision.", users: 25500 },
  "technexa-resume": { description: "Next-gen two-column resume for tech-forward professionals.", users: 32000 },
  "stackpro-cv": { description: "Stack-optimized ATS resume for developers and engineers.", users: 60000 },
  "visualcraft-cv": { description: "Visually crafted picture resume with artistic flair.", users: 43000 },
  "designflux-resume": { description: "Flux-inspired word resume with dynamic design energy.", users: 21500 },
  "elitepath-cv": { description: "Path-to-elite picture resume for ambitious job seekers.", users: 45000 },
  "imperial-cv": { description: "Imperial two-column resume with commanding presence.", users: 29500 },
  "corporate-atlas": { description: "Atlas-level corporate picture resume for global roles.", users: 46000 },
  "executive_cv": { description: "Minimal word CV stripped down to executive essentials.", users: 26500 },
  "artistry-resume": { description: "Artistry word resume for creative and design careers.", users: 22500 },
  "pixel-aura": { description: "Pixel-perfect two-column resume with an aura of style.", users: 31500 },
  "beginner-pro": { description: "Beginner-friendly word resume to kick-start your career.", users: 9500 },
  "design-smart": { description: "Smart design word resume for design-savvy professionals.", users: 23000 },
  "career-elite": { description: "Elite picture resume crafted for career-defining moments.", users: 47000 },
  "codepro-resume": { description: "Code-clean two-column resume for software professionals.", users: 33500 },
};

const categoryDots: Record<string, string[]> = {
  "Simple": ["#2E7D32", "#8B0000", "#1E3A8A", "#6A1B9A"],
  "Word": ["#2E7D32", "#8B0000", "#1E3A8A", "#6A1B9A"],
  "Picture": ["#2E7D32", "#8B0000", "#1E3A8A", "#6A1B9A"],
  "ATS": ["#2E7D32", "#8B0000", "#1E3A8A", "#6A1B9A"],
  "Two-column": ["#2E7D32", "#8B0000", "#1E3A8A", "#6A1B9A"],
};

// ── Inline ResumeBanner ──────────────────────────────────────────────────────
const ResumeBanner: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateResume = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/app" : "/login");
  };

  const handleUploadResume = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/app" : "/login");
  };

  return (
    <section className="w-full flex justify-center px-4 py-7">
      <div className="w-full max-w-6xl rounded-3xl flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-10 px-6 md:px-5 py-8 md:py-5">

        {/* LEFT CONTENT */}
        <div className="flex-1 text-center lg:text-left w-full">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#2c2a63] leading-tight">
            Build a Resume That Gets{" "}
            <span className="font-bold" style={{ color: "#0d9e63" }}>
              Interviews
            </span>
          </h2>
          <p className="text-gray-600 mt-3 text-sm md:text-base font-semibold">
            Stop sending resumes. Start getting callbacks.
          </p>
          <div className="mt-3 text-left">
            <p className="text-sm font-semibold text-[#2c2a63] mb-2 text-center lg:text-left">
              Why this AI Resume Builder stands out:
            </p>
            <div className="text-sm text-gray-700 space-y-1.5">
              <p className="text-xs text-gray-600">
                <span style={{ color: "#0d9e63" }}>✔</span> Smart, tailored content — not generic
              </p>
              <p className="text-xs text-gray-600">
                <span style={{ color: "#0d9e63" }}>✔</span> Optimized with recruiter-friendly keywords
              </p>
              <p className="text-xs text-gray-600">
                <span style={{ color: "#0d9e63" }}>✔</span> ATS score with instant improvement tips
              </p>
              <p className="text-xs text-gray-600">
                <span style={{ color: "#0d9e63" }}>✔</span> Highlights your real strengths
              </p>
              <p className="text-xs text-gray-600">
                <span style={{ color: "#0d9e63" }}>✔</span> Clean, professional PDF in seconds
              </p>
            </div>
            <p className="text-sm font-bold text-[#2c2a63] mt-3 text-center lg:text-left">
              Your next interview starts with a better resume.
            </p>
          </div>

          {/* ── Buttons: forced row on ALL screen sizes, no wrapping ── */}
          <div className="mt-6 flex flex-row items-center gap-2 justify-center lg:justify-start">
            <button
              onClick={handleCreateResume}
              className="flex-1 lg:flex-none px-3 lg:px-6 py-3 rounded-lg font-semibold transition hover:opacity-90 text-xs sm:text-sm md:text-base text-center whitespace-nowrap"
              style={{ backgroundColor: "#2c2a63", color: "#EDC9AF" }}
            >
              Create my resume now
            </button>
            <button
              onClick={handleUploadResume}
              className="flex-1 lg:flex-none px-3 lg:px-6 py-3 rounded-lg font-semibold transition hover:opacity-90 text-xs sm:text-sm md:text-base text-center whitespace-nowrap"
              style={{ backgroundColor: "#2c2a63", color: "#EDC9AF" }}
            >
              Upload Existing Resume
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 relative flex justify-center w-full">
          <div className="relative rounded-3xl overflow-hidden w-full max-w-md lg:max-w-lg shadow-lg">
            <img
              src="/assets/Services/resume-banner.jpg"
              alt="Resume preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
// ────────────────────────────────────────────────────────────────────────────

const ResumeTemplates: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const [isCreatingResume, setIsCreatingResume] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");


  const filteredTemplates = selectedCategory === "All"
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const handleTemplateClick = async (template: Template) => {
    if (isCreatingResume) return;

    const localToken = localStorage.getItem('token');
    const isAuthenticated = token && localToken;

    if (!isAuthenticated) {
      toast('Please login to use this template', {
        icon: '🔐',
        duration: 3000,
      });
      localStorage.setItem('selectedTemplate', template.id);
      localStorage.setItem('selectedTemplateName', template.name);
      navigate('/login');
      return;
    }

    await createResumeWithTemplate(template);
  };

  const createResumeWithTemplate = async (template: Template) => {
    setIsCreatingResume(true);
    setSelectedTemplateId(template.id);

    try {
      const { data } = await api.post<CreateResumeResponse>(
        '/resumes/create',
        {
          title: `${template.name} Resume`,
          template: template.id
        }
      );
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error: any) {
      setIsCreatingResume(false);
      setSelectedTemplateId(null);
      toast.error(error?.response?.data?.message || 'Failed to create resume');
      console.error('Error creating resume:', error);
    }
  };



  const renderCard = (template: Template, index: number, isMobile = false) => {
    const meta = templateMeta[template.id];
    const dots = categoryDots[template.category] ?? ["#9E9E9E", "#BDBDBD", "#E0E0E0"];

    return (
      <div
        key={template.id}
        onClick={() => handleTemplateClick(template)}
        className={isMobile ? "flex-shrink-0 w-64" : ""}
        style={{
          cursor: isCreatingResume ? 'not-allowed' : 'pointer',
          opacity: isCreatingResume && selectedTemplateId !== template.id ? 0.5 : 1
        }}
      >
        <Card
          className={`overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fade-in-up relative flex flex-col ${isCreatingResume && selectedTemplateId !== template.id ? 'pointer-events-none' : ''
            }`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <CardContent className="p-0 flex flex-col flex-1">

            {/* Image Section */}
            <div className="relative overflow-hidden h-44 md:h-80">
              <img
                src={template.image}
                alt={template.name}
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
              />

              {template.isPremium && (
                <div className="absolute top-2 right-2 z-10">
                  <Crown className="w-5 h-5 text-yellow-500 drop-shadow-lg" fill="currentColor" />
                </div>
              )}

              {isCreatingResume && selectedTemplateId === template.id && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  style={{ backgroundColor: 'rgba(44, 42, 99, 0.9)' }}
                >
                  <Loader2 className="size-10 animate-spin" style={{ color: '#EDC9AF' }} />
                  <span className="font-semibold text-sm" style={{ color: '#EDC9AF' }}>
                    Creating your resume...
                  </span>
                </div>
              )}

              {(!isCreatingResume || selectedTemplateId !== template.id) && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2"
                  style={{ backgroundColor: 'rgba(237, 201, 175, 0.95)' }}
                >
                  <button
                    className="px-6 py-2 rounded-lg font-semibold text-sm transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
                  >
                    Use Template
                  </button>
                  <p className="text-xs font-semibold" style={{ color: '#2c2a63' }}>
                    {(meta?.users ?? 10000).toLocaleString()}+ users chose this template
                  </p>
                </div>
              )}
            </div>

            {/* Card Bottom */}
            <div className="p-3 flex flex-col flex-1">
              <div className="flex items-center gap-1 mb-1">
                {dots.map((color, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <h3 className="font-bold text-left text-sm mb-1" style={{ color: '#2c2a63' }}>
                {template.name}
              </h3>

              <p className="text-xs text-left flex-1" style={{ color: '#333' }}>
                {meta?.description ?? "A professionally designed resume template."}
              </p>

              <div className="flex items-center justify-end mt-2">
                <span className="text-xs font-bold px-3 py-1 rounded bg-gray-500 text-white">
                  PDF
                </span>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Navbar */}
      <Navbar />

      {/* ── pt-[86px] mobile, pt-[90px] desktop — breathing room below fixed navbar ── */}
      <section className="pt-[86px] md:pt-[90px] pb-16 md:pb-24">

        {/* Back to Home — same color as banner buttons: bg #2c2a63, text #EDC9AF */}
        <div className="max-w-7xl mx-auto px-6 mb-4">
          <button
            onClick={() => window.location.href = '/'}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-semibold hover:opacity-90"
            style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
          >
            <Home className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="container mx-auto px-4">

          {/* ResumeBanner */}
          <div className="mb-8 animate-fade-in-up">
            <ResumeBanner />
          </div>

          {/* Filter Row */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
            <div className="flex items-center gap-2" style={{ color: '#2c2a63' }}>
              <Filter className="w-4 h-4" />
              <span className="font-semibold text-sm">Filter by Category:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 font-semibold focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: '#2c2a63',
                color: '#2c2a63',
                backgroundColor: 'white'
              }}
            >
              <option value="All">All Templates</option>
              <option value="Simple">Simple</option>
              <option value="Word">Word</option>
              <option value="Picture">Picture</option>
              <option value="ATS">ATS</option>
              <option value="Two-column">Two-column</option>
            </select>
            <span
              className="px-4 py-2 rounded-lg font-semibold text-sm"
              style={{ backgroundColor: '#EDC9AF', color: '#2c2a63' }}
            >
              {filteredTemplates.length} Templates
            </span>
          </div>

          {/* ── MOBILE: 2-column vertical grid ── */}
          <div className="md:hidden grid grid-cols-2 gap-3 px-1">
            {filteredTemplates.map((template, index) => renderCard(template, index, false))}
          </div>

          {/* ── DESKTOP: Grid View (unchanged) ── */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredTemplates.map((template, index) => renderCard(template, index, false))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ResumeTemplates;