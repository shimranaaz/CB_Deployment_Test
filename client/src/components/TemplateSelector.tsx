import { Check, X, Crown, Search } from 'lucide-react';
import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import api from '../configs/api';

interface Template {
  id: string;
  name: string;
  preview: string;
  image: string;
  isPremium: boolean;
  category: string;
}

interface TemplateSelectorProps {
  selectedTemplate: string;
  onChange: (templateId: string) => void;
  onClose?: () => void;
}

interface RootState {
  auth: {
    user: any;
    token?: string;
  };
}

const CATEGORIES = ["All", "Simple", "Word", "Picture", "ATS", "Two-column"] as const;
type Category = typeof CATEGORIES[number];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onChange,
  onClose
}) => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All'); // ← ADDED

  const templates: Template[] = [
    { id: "digital-pro", name: "Simple Foundation", preview: "Modern two-column layout", image: "/templates/digital-pro-preview.jpeg", isPremium: false, category: "Simple" },
    { id: "modern-two-column", name: "Simple Resume Core", preview: "Professional two-column layout", image: "/templates/modern-two-column-preview.jpeg", isPremium: false, category: "Simple" },

    { id: "classic", name: "Executive Classic", preview: "A clean, traditional resume format", image: "/templates/classic-preview.jpg", isPremium: true, category: "Word" },
    { id: "minimal", name: "Pure Minimal", preview: "Ultra-clean design", image: "/templates/minimal-preview.jpg", isPremium: true, category: "Word" },
    { id: "modern", name: "Modern Edge", preview: "Sleek design with color", image: "/templates/modern-preview.jpg", isPremium: true, category: "Word" },
    { id: "minimal-image", name: "Profile Minimal", preview: "Minimal design with image", image: "/templates/minimal-image-preview.jpg", isPremium: true, category: "Two-column" },

    { id: "geometric-blue", name: "Pro ATS", preview: "Professional blue geometric", image: "/templates/geometric-blue.webp", isPremium: true, category: "ATS" },
    { id: "geometric", name: "Geometry Elite", preview: "Professional geometric design", image: "/templates/geometric-preview.jpg", isPremium: true, category: "Two-column" },

    { id: "modern-sidebar", name: "Sidebar Professional", preview: "Contemporary two-column", image: "/templates/modern-sidebar-preview.jpg", isPremium: true, category: "Two-column" },
    { id: "stylish", name: "Stylish Executive", preview: "Elegant two-column design", image: "/templates/stylish-preview.jpg", isPremium: true, category: "Two-column" },

    { id: "clean-modern", name: "Clean ATS Pro", preview: "Professional two-column", image: "/templates/clean-modern-preview.jpg", isPremium: true, category: "ATS" },
    { id: "soft-minimal", name: "Soft ATS Pro", preview: "Clean two-column layout", image: "/templates/soft-minimal-preview.jpg", isPremium: true, category: "ATS" },

    { id: "professional-resume", name: "Prime Professional", preview: "Elegant professional resume", image: "/templates/professional-resume-preview.jpeg", isPremium: true, category: "Two-column" },
    { id: "professional-modern", name: "Modern Profile", preview: "Modern resume with diagonal", image: "/templates/professional-modern-preview.jpeg", isPremium: true, category: "Picture" },
    { id: "professional-resume-template", name: "Professional Prime", preview: "Clean two-column resume", image: "/templates/professional-resume-template-preview.jpeg", isPremium: true, category: "Picture" },

    { id: "soft-stylish", name: "Stylish Soft Pro", preview: "Clean centered layout", image: "/templates/soft-stylish-preview.jpeg", isPremium: true, category: "Word" },
    { id: "professional", name: "Corporate Professional", preview: "Classic two-column", image: "/templates/professional-preview.jpeg", isPremium: true, category: "Word" },
    { id: "creative", name: "Creative Professional", preview: "Modern two-column design", image: "/templates/creative-preview.jpeg", isPremium: true, category: "Word" },

    { id: "executive", name: "Executive Prime", preview: "Clean professional layout", image: "/templates/executive-preview.jpeg", isPremium: true, category: "Word" },
    { id: "tech", name: "Tech ATS Pro", preview: "Modern professional layout", image: "/templates/tech-preview.jpeg", isPremium: true, category: "ATS" },

    { id: "technical", name: "Technical Visual", preview: "Modern two-column", image: "/templates/technical-preview.jpeg", isPremium: true, category: "Picture" },
    { id: "elite", name: "Elite Visual", preview: "Professional two-column", image: "/templates/elite-preview.jpeg", isPremium: true, category: "Picture" },
    { id: "profile", name: "Profile Executive", preview: "Modern layout with photo", image: "/templates/profile-preview.jpeg", isPremium: true, category: "Picture" },

    { id: "ember-creative", name: "Creative Ember", preview: "Bold creative design", image: "/templates/ember-creative-preview.jpeg", isPremium: true, category: "Word" },
    { id: "smart-resume", name: "Smart Professional", preview: "Modern layout", image: "/templates/smart-resume-preview.jpeg", isPremium: true, category: "Word" },

    { id: "minimal-cv", name: "Minimal Professional CV", preview: "Two-column layout", image: "/templates/minimal-cv-preview.jpeg", isPremium: true, category: "Two-column" },
    { id: "prime-edge", name: "Prime Edge", preview: "Two-column with sidebar", image: "/templates/prime-edge-preview.jpeg", isPremium: true, category: "Two-column" },

    { id: "elitecraft-cv", name: "EliteCraft", preview: "Modern two-column", image: "/templates/elitecraft-cv-preview.jpeg", isPremium: true, category: "Two-column" },
    { id: "executive-cv", name: "Executive Visual CV", preview: "Professional two-column", image: "/templates/executive-cv-preview.jpeg", isPremium: true, category: "Picture" },

    { id: "pureform-resume", name: "PureForm ATS", preview: "Clean professional", image: "/templates/pureform-resume-preview.jpeg", isPremium: true, category: "ATS" },
    { id: "meridian-cv", name: "Meridian Visual CV", preview: "Professional layout", image: "/templates/meridian-cv-preview.jpeg", isPremium: true, category: "Picture" },

    { id: "elevare-cv", name: "Elevare ATS", preview: "Clean single-column", image: "/templates/elevare-cv-preview.jpeg", isPremium: true, category: "ATS" },
    { id: "talentra-cv", name: "Talentra Visual", preview: "Professional two-column", image: "/templates/talentra-cv-preview.jpeg", isPremium: true, category: "Picture" },

    { id: "boardline-cv", name: "Boardline Visual", preview: "Professional layout", image: "/templates/boardline-cv-preview.jpeg", isPremium: true, category: "Picture" },
    { id: "apex-resume", name: "Apex Visual", preview: "Modern two-column", image: "/templates/apex-resume-preview.jpeg", isPremium: true, category: "Picture" },

    { id: "blueprint-resume", name: "Blueprint Professional", preview: "Clean two-column", image: "/templates/blueprint-resume-preview.jpeg", isPremium: true, category: "Word" },
    { id: "technexa-resume", name: "TechNexa", preview: "Modern layout", image: "/templates/technexa-resume-preview.jpeg", isPremium: true, category: "Two-column" },

    { id: "stackpro-cv", name: "StackPro ATS", preview: "Elegant serif design", image: "/templates/stackpro-cv-preview.jpeg", isPremium: true, category: "ATS" },
    { id: "visualcraft-cv", name: "VisualCraft Pro", preview: "Modern creative", image: "/templates/visualcraft-cv-preview.jpeg", isPremium: true, category: "Picture" },

    { id: "designflux-resume", name: "DesignFlux Professional", preview: "Elegant two-column", image: "/templates/designflux-resume-preview.jpeg", isPremium: true, category: "Word" },
    { id: "elitepath-cv", name: "ElitePath Visual", preview: "Executive design", image: "/templates/elitepath-cv-preview.jpeg", isPremium: true, category: "Picture" },

    { id: "imperial-cv", name: "Imperial Professional", preview: "Professional layout", image: "/templates/imperial-cv-preview.jpeg", isPremium: true, category: "Two-column" },
    { id: "corporate-atlas", name: "Corporate Atlas", preview: "Modern professional", image: "/templates/corporate-atlas-preview.jpeg", isPremium: true, category: "Picture" },

    { id: "executive_cv", name: "Executive Minimal", preview: "Clean minimalist", image: "/templates/executive-cv-preview-img.jpeg", isPremium: true, category: "Word" },
    { id: "artistry-resume", name: "Artistry Professional", preview: "Elegant centered", image: "/templates/artistry-resume-preview.jpeg", isPremium: true, category: "Word" },

    { id: "pixel-aura", name: "PixelAura", preview: "Modern two-column", image: "/templates/pixel-aura-preview.jpeg", isPremium: true, category: "Two-column" },
    { id: "beginner-pro", name: "Beginner Professional", preview: "Clean minimalist", image: "/templates/beginner-pro-preview.jpeg", isPremium: false, category: "Word" },

    { id: "design-smart", name: "DesignSmart Professional", preview: "Bold rounded border", image: "/templates/design-smart-preview.jpeg", isPremium: true, category: "Word" },
    { id: "career-elite", name: "Career Elite", preview: "Elegant layout", image: "/templates/career-elite-preview.jpeg", isPremium: true, category: "Picture" },

    { id: "codepro-resume", name: "CodePro", preview: "Clean professional", image: "/templates/codepro-resume-preview.jpeg", isPremium: true, category: "Two-column" }
  ];
  const filteredTemplates = useMemo(() => {
    let result = selectedCategory === 'All'
      ? templates
      : templates.filter(t => t.category === selectedCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.preview.toLowerCase().includes(query) ||
        (template.isPremium ? 'premium'.includes(query) : 'free'.includes(query))
      );
    }

    return result;
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    if (user && token) {
      loadUserAccess();
    }
  }, [user, token]);

  const loadUserAccess = async () => {
    if (!token) {
      console.log('No authentication token available');
      return;
    }

    try {
      const { data } = await api.get('/users/data', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.user) {
        console.log('User data loaded:', data.user);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error("Authentication failed - please log in again");
      } else if (error.response?.status === 403) {
        console.error("Access forbidden");
      } else {
        console.error("Error loading user access:", error.message);
      }
    }
  };

  const handleTemplateClick = (templateId: string) => {
    onChange(templateId);
    setSearchQuery('');
    if (onClose) onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    if (onClose) onClose();
  };

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50">

      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-gray-900">Templates</h2>
        <button onClick={handleClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <X size={20} className="text-gray-600" />
        </button>
      </div>
      <div className="px-4 pt-4 pb-3 border-b border-gray-200 bg-white sticky top-[65px] z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-9 py-2.5 text-sm border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-2 focus:ring-[#2c2a63]/20 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200"
                style={
                  isActive
                    ? { backgroundColor: '#2c2a63', color: '#EDC9AF' }
                    : { backgroundColor: '#f3f4f6', color: '#4b5563' }
                }
              >
                {cat}
              </button>
            );
          })}
        </div>

        {(searchQuery || selectedCategory !== 'All') && (
          <p className="mt-2 text-xs text-gray-500">
            Showing {filteredTemplates.length} of {templates.length} templates
          </p>
        )}
      </div>
      <div className="overflow-y-auto h-[calc(100vh-185px)] px-4 py-4">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-600 mb-1">No templates found</p>
            <p className="text-xs text-gray-400">Try different search terms or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredTemplates.map((template) => {
              const isSelected = selectedTemplate === template.id;

              return (
                <div
                  key={template.id}
                  onClick={() => handleTemplateClick(template.id)}
                  className={`relative cursor-pointer group transition-all ${isSelected ? "rounded-lg" : ""}`}
                  style={isSelected ? {
                    border: `2px solid #2c2a63`,
                    padding: '2px'
                  } : {}}
                >
                  <div
                    className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow"
                    style={{ border: `1px solid #2c2a63` }}
                  >
                    <img src={template.image} alt={template.name} className="w-full h-full object-cover" />

                    {template.isPremium && (
                      <div className="absolute top-2 right-2 z-10">
                        <Crown className="w-5 h-5 text-yellow-500 drop-shadow-lg" fill="currentColor" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                    {isSelected && (
                      <div className="absolute top-2 left-2 z-10">
                        <div className="size-6 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#2c2a63' }}>
                          <Check className="w-4 h-4 text-[#EDC9AF]" strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 px-1">
                    <h3 className={`text-sm font-medium transition-colors flex items-center gap-1 ${isSelected ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"}`}>
                      {template.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSelector;