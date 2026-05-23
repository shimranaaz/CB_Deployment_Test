import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faQuoteLeft, faQuoteRight, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Loader2 } from "lucide-react";
import api from "../configs/api";
import toast from "react-hot-toast";

interface Template {
  id: string;
  name: string;
  image: string;
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
  { id: "professional-modern", name: "Professional Modern", image: "/templates/professional-modern-preview.jpeg" },
  { id: "professional-resume", name: "Professional Resume", image: "/templates/professional-resume-preview.jpeg" },
  { id: "soft-minimal", name: "Soft Minimal", image: "/templates/soft-minimal-preview.jpg" },
  { id: "modern-sidebar", name: "Modern Sidebar", image: "/templates/modern-sidebar-preview.jpg" },
  { id: "pureform-resume", name: "PureForm Resume", image: "/templates/pureform-resume-preview.jpeg" },
];

const templateMeta: Record<string, { description: string; users: number }> = {
  "professional-modern": { description: "Modern picture resume that makes a strong first impression.", users: 36000 },
  "professional-resume": { description: "Premium two-column layout for ambitious professionals.", users: 31000 },
  "soft-minimal": { description: "Soft tones and clean lines for an approachable ATS resume.", users: 54000 },
  "modern-sidebar": { description: "Sidebar layout that highlights skills and contact info.", users: 25000 },
  "pureform-resume": { description: "Pure structured ATS resume with zero formatting noise.", users: 55000 },
};

const categoryDots: string[] = ["#2E7D32", "#8B0000", "#1E3A8A", "#6A1B9A"];

const Templates = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const [isVisible, setIsVisible] = useState(false);
  const [isCreatingResume, setIsCreatingResume] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleTemplateClick = async (template: Template) => {
    if (isCreatingResume) return;

    if (!token) {
      toast('Please login to use this template', {
        icon: '🔐',
        duration: 3000,
      });

      navigate(`/login?template=${template.id}&templateName=${encodeURIComponent(template.name)}`);
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
        },
        {
          headers: { Authorization: token as string }
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollPosition = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <section ref={sectionRef} id="resume" className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#2c2a63' }}>
              <FontAwesomeIcon icon={faQuoteLeft} className="mr-2 text-2xl" style={{ color: '#2c2a63' }} />
              Elevate Your Application with Premium Templates
              <FontAwesomeIcon icon={faQuoteRight} className="ml-2 text-2xl" style={{ color: '#2c2a63' }} />
            </h2>
            <p className="max-w-3xl mx-auto leading-relaxed font-semibold" style={{ color: '#333' }}>
              Professionally designed, recruiter-approved, and ready for instant download.
            </p>
          </div>

          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
              aria-label="Scroll left"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
            </button>

            {/* Templates Carousel */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-10"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {templates.map((template, index) => {
                const meta = templateMeta[template.id];
                return (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateClick(template)}
                    className="flex-shrink-0 w-[280px] md:w-64"
                    style={{
                      cursor: isCreatingResume ? 'not-allowed' : 'pointer',
                      opacity: isCreatingResume && selectedTemplateId !== template.id ? 0.5 : 1
                    }}
                  >
                    <Card
                      className={`overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group relative ${
                        isVisible ? "animate-fade-in-up" : "opacity-0"
                      } ${isCreatingResume && selectedTemplateId !== template.id ? 'pointer-events-none' : ''}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-0">
                        {/* FIX: wrap image in a fixed-height container with overflow-hidden,
                            use object-cover with object-top so the resume shows from the top
                            instead of being centre-cropped and cutting off the header */}
                        <div className="relative overflow-hidden" style={{ height: "288px" }}>
                          <img
                            src={template.image}
                            alt={template.name}
                            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                          />

                          {/* Loading Overlay */}
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

                          {/* Hover Overlay */}
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
                        <div className="p-4">
                          {/* Color Dots */}
                          <div className="flex items-center gap-1.5 mb-2">
                            {categoryDots.map((color, i) => (
                              <span
                                key={i}
                                className="w-3 h-3 rounded-full inline-block"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>

                          {/* Name */}
                          <h3 className="font-bold text-left mb-1" style={{ color: '#2c2a63' }}>
                            {template.name}
                          </h3>

                          {/* Description */}
                          <p className="text-xs text-left mb-3" style={{ color: '#333' }}>
                            {meta?.description ?? "A professionally designed resume template."}
                          </p>

                          {/* PDF Badge */}
                          <div className="flex items-center justify-end mt-2">
                            <span
                              className="text-xs font-bold px-3 py-1 rounded"
                              style={{ backgroundColor: '#6B7280', color: 'white' }}
                            >
                              PDF
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
              aria-label="Scroll right"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
            </button>
          </div>

          <div
            className={`text-center mt-6 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
            style={{ animationDelay: "0.5s" }}
          >
            <Button
              size="lg"
              className="hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
              onClick={() => navigate('/resume/templates')}
              disabled={isCreatingResume}
            >
              Explore All Resume Templates <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default Templates;