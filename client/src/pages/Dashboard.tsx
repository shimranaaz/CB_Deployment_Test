import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
  Crown,
  Loader2,
  Filter
} from 'lucide-react';
import React, { useEffect, useState, FormEvent, ChangeEvent, MouseEvent, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent } from "../components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faQuoteRight, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import api from '../configs/api';
import toast from 'react-hot-toast';
import pdfToText from 'react-pdftotext';
import PricingModal from '../components/home/PricingModal';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { faHome } from "@fortawesome/free-solid-svg-icons";

interface CoverLetter {
  _id: string;
  title: string;
  updatedAt: string;
  createdAt?: string;
  header_color?: string;
}

interface GetCoverLettersResponse {
  coverLetters: CoverLetter[];
}

interface CreateCoverLetterResponse {
  coverLetter: CoverLetter;
}

interface User {
  name: string;
  email?: string;
  id?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

interface RootState {
  auth: AuthState;
}

interface Resume {
  _id: string;
  title: string;
  updatedAt: string;
  createdAt?: string;
  template?: string;
  accent_color?: string;
  adminCreated?: boolean;
}

interface Template {
  id: string;
  name: string;
  image: string;
  category: string;
  isPremium: boolean;
}

interface CreateResumeResponse {
  resume: Resume;
}

interface UploadResumeResponse {
  resumeId: string;
}

interface UpdateResumeResponse {
  message: string;
}

interface DeleteResumeResponse {
  message: string;
}

interface GetResumesResponse {
  resumes: Resume[];
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

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

const templatePreviews: Record<string, string> = {
  'classic': '/templates/classic-preview.jpg',
  'modern': '/templates/modern-preview.jpg',
  'minimal': '/templates/minimal-preview.jpg',
  'geometric-blue': '/templates/geometric-blue.webp',
  'minimal-image': '/templates/minimal-image-preview.jpg',
  'modern-sidebar': '/templates/modern-sidebar-preview.jpg',
  'geometric': '/templates/geometric-preview.jpg',
  'stylish': '/templates/stylish-preview.jpg',
  'clean-modern': '/templates/clean-modern-preview.jpg',
  'soft-minimal': '/templates/soft-minimal-preview.jpg',
  'professional-resume': '/templates/professional-resume-preview.jpeg',
  'professional-modern': '/templates/professional-modern-preview.jpeg',
  'professional-resume-template': '/templates/professional-resume-template-preview.jpeg',
  'soft-stylish': '/templates/soft-stylish-preview.jpeg',
  'modern-two-column': '/templates/modern-two-column-preview.jpeg',
  'professional': '/templates/professional-preview.jpeg',
  'creative': '/templates/creative-preview.jpeg',
  'executive': '/templates/executive-preview.jpeg',
  'tech': '/templates/tech-preview.jpeg',
  'technical': '/templates/technical-preview.jpeg',
  'elite': '/templates/elite-preview.jpeg',
  'profile': '/templates/profile-preview.jpeg',
  'ember-creative': '/templates/ember-creative-preview.jpeg',
  'smart-resume': '/templates/smart-resume-preview.jpeg',
  'minimal-cv': '/templates/minimal-cv-preview.jpeg',
  'prime-edge': '/templates/prime-edge-preview.jpeg',
  'elitecraft-cv': '/templates/elitecraft-cv-preview.jpeg',
  'executive-cv': '/templates/executive-cv-preview.jpeg',
  'pureform-resume': '/templates/pureform-resume-preview.jpeg',
  'meridian-cv': '/templates/meridian-cv-preview.jpeg',
  'elevare-cv': '/templates/elevare-cv-preview.jpeg',
  'talentra-cv': '/templates/talentra-cv-preview.jpeg',
  'boardline-cv': '/templates/boardline-cv-preview.jpeg',
  'apex-resume': '/templates/apex-resume-preview.jpeg',
  'blueprint-resume': '/templates/blueprint-resume-preview.jpeg',
  'technexa-resume': '/templates/technexa-resume-preview.jpeg',
  'stackpro-cv': '/templates/stackpro-cv-preview.jpeg',
  'visualcraft-cv': '/templates/visualcraft-cv-preview.jpeg',
  'designflux-resume': '/templates/designflux-resume-preview.jpeg',
  'elitepath-cv': '/templates/elitepath-cv-preview.jpeg',
  'imperial-cv': '/templates/imperial-cv-preview.jpeg',
  'corporate-atlas': '/templates/corporate-atlas-preview.jpeg',
  'executive_cv': '/templates/executive-cv-preview-img.jpeg',
  'artistry-resume': '/templates/artistry-resume-preview.jpeg',
  'pixel-aura': '/templates/pixel-aura-preview.jpeg',
  'digital-pro': '/templates/digital-pro-preview.jpeg',
  'beginner-pro': '/templates/beginner-pro-preview.jpeg',
  'design-smart': '/templates/design-smart-preview.jpeg',
  'career-elite': '/templates/career-elite-preview.jpeg',
  'codepro-resume': '/templates/codepro-resume-preview.jpeg',
};

const templates: Template[] = [
  { id: "modern-two-column", name: "Simple Resume Core", image: "/templates/modern-two-column-preview.jpeg", category: "Simple", isPremium: false },
  { id: "digital-pro", name: "Simple Foundation", image: "/templates/digital-pro-preview.jpeg", category: "Simple", isPremium: false },
  { id: "modern", name: "Modern Edge", image: "/templates/modern-preview.jpg", category: "Word", isPremium: true },
  { id: "minimal-image", name: "Profile Minimal", image: "/templates/minimal-image-preview.jpg", category: "Two-column", isPremium: true },
  { id: "minimal", name: "Pure Minimal", image: "/templates/minimal-preview.jpg", category: "Word", isPremium: true },
  { id: "geometric-blue", name: "Pro ATS", image: "/templates/geometric-blue.webp", category: "ATS", isPremium: true },
  { id: "classic", name: "Executive Classic", image: "/templates/classic-preview.jpg", category: "Word", isPremium: true },
  { id: "geometric", name: "Geometry Elite", image: "/templates/geometric-preview.jpg", category: "Two-column", isPremium: true },
  { id: "modern-sidebar", name: "Sidebar Professional", image: "/templates/modern-sidebar-preview.jpg", category: "Two-column", isPremium: true },
  { id: "stylish", name: "Stylish Executive", image: "/templates/stylish-preview.jpg", category: "Two-column", isPremium: true },
  { id: "clean-modern", name: "Clean ATS Pro", image: "/templates/clean-modern-preview.jpg", category: "ATS", isPremium: true },
  { id: "soft-minimal", name: "Soft ATS Pro", image: "/templates/soft-minimal-preview.jpg", category: "ATS", isPremium: true },
  { id: "professional-resume", name: "Prime Professional", image: "/templates/professional-resume-preview.jpeg", category: "Two-column", isPremium: true },
  { id: "professional-modern", name: "Modern Profile", image: "/templates/professional-modern-preview.jpeg", category: "Picture", isPremium: true },
  { id: "professional-resume-template", name: "Professional Prime", image: "/templates/professional-resume-template-preview.jpeg", category: "Picture", isPremium: true },
  { id: "soft-stylish", name: "Stylish Soft Pro", image: "/templates/soft-stylish-preview.jpeg", category: "Word", isPremium: true },
  { id: "professional", name: "Corporate Professional", image: "/templates/professional-preview.jpeg", category: "Word", isPremium: true },
  { id: "creative", name: "Creative Professional", image: "/templates/creative-preview.jpeg", category: "Word", isPremium: true },
  { id: "executive", name: "Executive Prime", image: "/templates/executive-preview.jpeg", category: "Word", isPremium: true },
  { id: "tech", name: "Tech ATS Pro", image: "/templates/tech-preview.jpeg", category: "ATS", isPremium: true },
  { id: "technical", name: "Technical Visual", image: "/templates/technical-preview.jpeg", category: "Picture", isPremium: true },
  { id: "elite", name: "Elite Visual", image: "/templates/elite-preview.jpeg", category: "Picture", isPremium: true },
  { id: "profile", name: "Profile Executive", image: "/templates/profile-preview.jpeg", category: "Picture", isPremium: true },
  { id: "ember-creative", name: "Creative Ember", image: "/templates/ember-creative-preview.jpeg", category: "Word", isPremium: true },
  { id: "smart-resume", name: "Smart Professional", image: "/templates/smart-resume-preview.jpeg", category: "Word", isPremium: true },
  { id: "minimal-cv", name: "Minimal Professional CV", image: "/templates/minimal-cv-preview.jpeg", category: "Two-column", isPremium: true },
  { id: "prime-edge", name: "Prime Edge", image: "/templates/prime-edge-preview.jpeg", category: "Two-column", isPremium: true },
  { id: "elitecraft-cv", name: "EliteCraft", image: "/templates/elitecraft-cv-preview.jpeg", category: "Two-column", isPremium: true },
  { id: "executive-cv", name: "Executive Visual CV", image: "/templates/executive-cv-preview.jpeg", category: "Picture", isPremium: true },
  { id: "pureform-resume", name: "PureForm ATS", image: "/templates/pureform-resume-preview.jpeg", category: "ATS", isPremium: true },
  { id: "meridian-cv", name: "Meridian Visual CV", image: "/templates/meridian-cv-preview.jpeg", category: "Picture", isPremium: true },
  { id: "elevare-cv", name: "Elevare ATS", image: "/templates/elevare-cv-preview.jpeg", category: "ATS", isPremium: true },
  { id: "talentra-cv", name: "Talentra Visual", image: "/templates/talentra-cv-preview.jpeg", category: "Picture", isPremium: true },
  { id: "boardline-cv", name: "Boardline Visual", image: "/templates/boardline-cv-preview.jpeg", category: "Picture", isPremium: true },
  { id: "apex-resume", name: "Apex Visual", image: "/templates/apex-resume-preview.jpeg", category: "Picture", isPremium: true },
  { id: "blueprint-resume", name: "Blueprint Professional", image: "/templates/blueprint-resume-preview.jpeg", category: "Word", isPremium: true },
  { id: "technexa-resume", name: "TechNexa", image: "/templates/technexa-resume-preview.jpeg", category: "Two-column", isPremium: true },
  { id: "stackpro-cv", name: "StackPro ATS", image: "/templates/stackpro-cv-preview.jpeg", category: "ATS", isPremium: true },
  { id: "visualcraft-cv", name: "VisualCraft Pro", image: "/templates/visualcraft-cv-preview.jpeg", category: "Picture", isPremium: true },
  { id: "designflux-resume", name: "DesignFlux Professional", image: "/templates/designflux-resume-preview.jpeg", category: "Word", isPremium: true },
  { id: "elitepath-cv", name: "ElitePath Visual", image: "/templates/elitepath-cv-preview.jpeg", category: "Picture", isPremium: true },
  { id: "imperial-cv", name: "Imperial Professional", image: "/templates/imperial-cv-preview.jpeg", category: "Two-column", isPremium: true },
  { id: "corporate-atlas", name: "Corporate Atlas", image: "/templates/corporate-atlas-preview.jpeg", category: "Picture", isPremium: true },
  { id: "executive_cv", name: "Executive Minimal", image: "/templates/executive-cv-preview-img.jpeg", category: "Word", isPremium: true },
  { id: "artistry-resume", name: "Artistry Professional", image: "/templates/artistry-resume-preview.jpeg", category: "Word", isPremium: true },
  { id: "pixel-aura", name: "PixelAura", image: "/templates/pixel-aura-preview.jpeg", category: "Two-column", isPremium: true },
  { id: "beginner-pro", name: "Beginner Professional", image: "/templates/beginner-pro-preview.jpeg", category: "Word", isPremium: false },
  { id: "design-smart", name: "DesignSmart Professional", image: "/templates/design-smart-preview.jpeg", category: "Word", isPremium: true },
  { id: "career-elite", name: "Career Elite", image: "/templates/career-elite-preview.jpeg", category: "Picture", isPremium: true },
  { id: "codepro-resume", name: "CodePro", image: "/templates/codepro-resume-preview.jpeg", category: "Two-column", isPremium: true }
];

const Dashboard: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);


  const [allResumes, setAllResumes] = useState<Resume[]>([]);
  const [showCreateResume, setShowCreateResume] = useState<boolean>(false);
  const [showUploadResume, setShowUploadResume] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [resume, setResume] = useState<File | null>(null);
  const [editResumeId, setEditResumeId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreatingResume, setIsCreatingResume] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [allCoverLetters, setAllCoverLetters] = useState<CoverLetter[]>([]);

  const [showCreateCoverLetter, setShowCreateCoverLetter] = useState<boolean>(false);
  const [coverLetterTitle, setCoverLetterTitle] = useState<string>('');

  const [showResumeLimitModal, setShowResumeLimitModal] = useState<boolean>(false);
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);
  const [resumeLimitData, setResumeLimitData] = useState({
    resumesUsed: 0,
    resumesLimit: 0,
    previousResumeId: '',
    hasEditCreditsRemaining: false,
    userPlan: 'Free'
  });

  const [selectedCategory, setSelectedCategory] = useState("All");
  const filteredTemplates = selectedCategory === "All"
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const loadAllCoverLetters = async (): Promise<void> => {
    try {
      const { data } = await api.get<GetCoverLettersResponse>('/cover-letters/all');
      setAllCoverLetters(data.coverLetters);
    } catch (error) {
      console.log('Cover letters not available yet');
    }
  };

  const loadAllResumes = async (): Promise<void> => {
    try {
      const { data } = await api.get<GetResumesResponse>('/users/resumes');
      setAllResumes(data.resumes);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || apiError.message);
    }
  };

  const createResume = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    try {
      event.preventDefault();

      try {
        const { data: limitCheck } = await api.get('/payments/check-resume-limit', {
          headers: { Authorization: token }
        });

        if (!limitCheck.canCreateResume) {
          setResumeLimitData({
            resumesUsed: limitCheck.resumesUsed || 0,
            resumesLimit: limitCheck.resumesLimit || 0,
            previousResumeId: limitCheck.previouslyDownloadedResumeId || '',
            hasEditCreditsRemaining: limitCheck.hasEditCreditsRemaining || false,
            userPlan: limitCheck.userPlan || 'Free'
          });
          setShowCreateResume(false);
          setShowResumeLimitModal(true);

          return;
        }
      } catch (limitError: any) {
        if (limitError.response?.status === 403) {
          const errorData = limitError.response.data;
          setResumeLimitData({
            resumesUsed: errorData.resumesUsed || 0,
            resumesLimit: errorData.resumesLimit || 0,
            previousResumeId: errorData.previouslyDownloadedResumeId || '',
            hasEditCreditsRemaining: errorData.hasEditCreditsRemaining || false,
            userPlan: errorData.userPlan || 'Free'
          });
          setShowCreateResume(false);
          setShowResumeLimitModal(true);
          return;
        }
      }

      const { data } = await api.post<CreateResumeResponse>('/resumes/create', { title });
      setAllResumes([...allResumes, data.resume]);
      setTitle('');
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || apiError.message);
    }
  };

  const uploadResume = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (!resume) {
        toast.error('Please select a resume file');
        setIsLoading(false);
        return;
      }

      const maxSize = 3 * 1024 * 1024;
      if (resume.size > maxSize) {
        toast.error('File size must be less than 3MB');
        setIsLoading(false);
        return;
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(resume.type)) {
        toast.error('Only PDF and Word documents are allowed');
        setIsLoading(false);
        return;
      }

      const resumeText = await pdfToText(resume);
      const { data } = await api.post<UploadResumeResponse & { aiUsed?: boolean; message?: string }>(
        '/ai/upload-resume',
        { title, resumeText }
      );

      if (data.aiUsed === false) {
        toast.success('Resume created! AI unavailable - please fill details manually.', { duration: 5000 });
      } else {
        toast.success('Your resume has been uploaded and processed successfully!');
      }

      setTitle('');
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || apiError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const editTitle = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    try {
      event.preventDefault();
      const { data } = await api.put<UpdateResumeResponse>(
        `/resumes/update`,
        { resumeId: editResumeId, resumeData: { title } }
      );
      setAllResumes(
        allResumes.map(resume =>
          resume._id === editResumeId ? { ...resume, title } : resume
        )
      );
      setTitle('');
      setEditResumeId('');
      toast.success(data.message);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || apiError.message);
    }
  };

  const deleteResume = async (resumeId: string): Promise<void> => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this resume?');
      if (confirm) {
        const { data } = await api.delete<DeleteResumeResponse>(`/resumes/delete/${resumeId}`);
        setAllResumes(allResumes.filter(resume => resume._id !== resumeId));
        toast.success(data.message);
      }
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || apiError.message);
    }
  };

  const createCoverLetter = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    try {
      event.preventDefault();
      const { data } = await api.post<CreateCoverLetterResponse>(
        '/cover-letters/create',
        { title: coverLetterTitle }
      );
      setAllCoverLetters([...allCoverLetters, data.coverLetter]);
      setCoverLetterTitle('');
      setShowCreateCoverLetter(false);
      navigate(`/app/cover-letter/builder/${data.coverLetter._id}`);
      toast.success('Cover letter created successfully!');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || apiError.message);
    }
  };

  const [editCoverLetterId, setEditCoverLetterId] = useState<string>('');

  const editCoverLetterTitle = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    try {
      event.preventDefault();
      await api.put<UpdateResumeResponse>(`/cover-letters/${editCoverLetterId}`, { title });
      setAllCoverLetters(
        allCoverLetters.map(coverLetter =>
          coverLetter._id === editCoverLetterId ? { ...coverLetter, title } : coverLetter
        )
      );
      setTitle('');
      setEditCoverLetterId('');
      toast.success('Cover letter title updated!');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || apiError.message);
    }
  };

  const deleteCoverLetter = async (coverLetterId: string): Promise<void> => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this cover letter?');
      if (confirm) {
        await api.delete(`/cover-letters/${coverLetterId}`);
        setAllCoverLetters(allCoverLetters.filter(cl => cl._id !== coverLetterId));
        toast.success('Cover letter deleted successfully!');
      }
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || apiError.message);
    }
  };

  const handleTemplateClick = async (template: Template) => {
    if (isCreatingResume) return;
    await createResumeWithTemplate(template);
  };

  const createResumeWithTemplate = async (template: Template) => {
    setIsCreatingResume(true);
    setSelectedTemplateId(template.id);

    try {
      try {
        const { data: limitCheck } = await api.get('/payments/check-resume-limit', {
          headers: { Authorization: token },
          params: { templateId: template.id }
        });

        if (!limitCheck.canCreateResume) {
          setResumeLimitData({
            resumesUsed: limitCheck.resumesUsed || 0,
            resumesLimit: limitCheck.resumesLimit || 0,
            previousResumeId: limitCheck.previouslyDownloadedResumeId || '',
            hasEditCreditsRemaining: limitCheck.hasEditCreditsRemaining || false,
            userPlan: limitCheck.userPlan || 'Free'
          });
          setShowResumeLimitModal(true);
          setIsCreatingResume(false);
          setSelectedTemplateId(null);
          return;
        }
      } catch (limitError: any) {
        if (limitError.response?.status === 403) {
          const errorData = limitError.response.data;
          setResumeLimitData({
            resumesUsed: errorData.resumesUsed || 0,
            resumesLimit: errorData.resumesLimit || 0,
            previousResumeId: errorData.previouslyDownloadedResumeId || '',
            hasEditCreditsRemaining: errorData.hasEditCreditsRemaining || false,
            userPlan: errorData.userPlan || 'Free'
          });
          setShowResumeLimitModal(true);
          setIsCreatingResume(false);
          setSelectedTemplateId(null);
          return;
        }
      }

      const response = await api.post<CreateResumeResponse>(
        '/resumes/create',
        { title: `${template.name} Resume`, template: template.id }
      );

      console.log('✅ Resume created with template:', template.id);
      navigate(`/app/builder/${response.data.resume._id}`);
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
      const newScrollLeft = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const renderTemplateCard = (template: Template, index: number, isMobile = false) => {
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
          className={`overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fade-in-up relative ${isCreatingResume && selectedTemplateId !== template.id ? 'pointer-events-none' : ''
            }`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <CardContent className="p-0">
            <div className="relative overflow-hidden h-72 bg-gray-50 flex items-center">
              <img
                src={template.image}
                alt={template.name}
                className="w-full h-72 object-cover object-top group-hover:scale-110 transition-transform duration-300"
              />

              {/* Premium crown — top right */}
              {template.isPremium && (
                <div className="absolute top-2 right-2 z-10">
                  <Crown className="w-5 h-5 text-yellow-500 drop-shadow-lg" fill="currentColor" />
                </div>
              )}

              {/* Loading overlay */}
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

              {/* Hover overlay */}
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

            {/* Card bottom — dots, name, description, PDF badge */}
            <div className="p-4">
              {/* Color dots */}
              <div className="flex items-center gap-1.5 mb-2">
                {dots.map((color, i) => (
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

              {/* PDF badge */}
              <div className="flex items-center justify-between mt-2">
                <div />
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
  };

  useEffect(() => {
    loadAllResumes();
    loadAllCoverLetters();
  }, [location.pathname]);

  useEffect(() => {
    const handleTemplateBasedCreation = async () => {
      const selectedTemplate = localStorage.getItem('selectedTemplate');
      const state = location.state as { createNewResume?: boolean; templateId?: string } | null;

      if ((state?.createNewResume && state?.templateId) || selectedTemplate) {
        const templateId = state?.templateId || selectedTemplate;

        try {
          const loadingToast = toast.loading('Creating resume with selected template...');
          const { data } = await api.post<CreateResumeResponse>(
            '/resumes/create',
            { title: 'Untitled Resume', template: templateId, accent_color: '#2c2a63' }
          );
          localStorage.removeItem('selectedTemplate');
          toast.dismiss(loadingToast);
          toast.success('Resume template selected successfully!');
          navigate(`/app/builder/${data.resume._id}`, { replace: true });
        } catch (error) {
          const apiError = error as ApiError;
          console.error('Error creating resume:', error);
          toast.error(apiError?.response?.data?.message || 'Failed to create resume');
          localStorage.removeItem('selectedTemplate');
        }
      }
    };

    if (token) {
      handleTemplateBasedCreation();
    }
  }, [location, navigate, token]);

  return (
    <div className="bg-white min-h-screen">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className='max-w-7xl mx-auto px-4 py-8'>

        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className='flex items-center gap-2 mb-4 px-4 py-2 rounded-full border-2 border-[#2c2a63] text-[#2c2a63] hover:bg-[#2c2a63] hover:text-[#EDC9AF] font-semibold transition-all'
        >
          <FontAwesomeIcon icon={faHome} />
          Back to Home
        </button>

        <p className='text-2xl font-medium mb-6 text-[#2c2a63] sm:hidden'>
          Welcome, {user?.name || 'User'}
        </p>
        {/* ── Action buttons ── */}
        <div className='flex gap-4 mb-8 flex-wrap'>
          <button
            onClick={() => setShowCreateResume(true)}
            className='w-full sm:max-w-[280px] h-40 flex flex-col items-center justify-center rounded-2xl gap-3 text-[#EDC9AF] bg-[#2c2a63] group hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden'
          >
            <div className='absolute inset-0 bg-gradient-to-br from-[#2c2a63] to-[#1a1847] opacity-90'></div>
            <div className='relative z-10 flex flex-col items-center gap-3'>
              <div className='size-16 flex items-center justify-center bg-[#EDC9AF]/20 backdrop-blur-sm rounded-full'>
                <PlusIcon className='size-8 text-[#EDC9AF]' />
              </div>
              <p className='text-base font-semibold text-[#EDC9AF]'>Start from Scratch</p>
            </div>
          </button>

          <button
            onClick={() => setShowUploadResume(true)}
            className='w-full sm:max-w-[280px] h-40 flex flex-col items-center justify-center rounded-2xl gap-3 text-[#2c2a63] bg-white border border-[#EDC9AF] group hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden'
          >
            <div className='relative z-10 flex flex-col items-center gap-1'>
              <div className='size-16 flex items-center justify-center bg-[#EDC9AF] rounded-full'>
                <UploadCloudIcon className='size-8 text-white' />
              </div>
              <p className='text-base font-semibold text-[#2c2a63]'>Upload Existing Resume/CV</p>
            </div>
            <div className='absolute bottom-1 right-4 flex gap-2'>
              <div className='size-7 flex items-center justify-center'>
                <UploadCloudIcon className='size-4 text-[#2c2a63]' />
              </div>
              <div className='size-7 flex items-center justify-center'>
                <FilePenLineIcon className='size-4 text-[#2c2a63]' />
              </div>
              <div className='size-7 flex items-center justify-center'>
                <PencilIcon className='size-4 text-[#2c2a63]' />
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowCreateCoverLetter(true)}
            className='w-full sm:max-w-[280px] h-40 flex flex-col items-center justify-center rounded-2xl gap-3 text-[#2c2a63] bg-white border border-[#EDC9AF] group hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden'
          >
            <div className='relative z-10 flex flex-col items-center gap-1'>
              <div className='size-16 flex items-center justify-center bg-[#EDC9AF] rounded-full'>
                <FilePenLineIcon className='size-8 text-white' />
              </div>
              <p className='text-base font-semibold text-[#2c2a63]'>Create Cover Letter</p>
            </div>
          </button>
        </div>

        <hr className='border-[#EDC9AF]/30 my-6 sm:w-[305px]' />

        {/* ── My Resumes ── */}
        {allResumes.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#2c2a63]">
                <FontAwesomeIcon icon={faQuoteLeft} className="mr-2 text-xl" style={{ color: '#2c2a63' }} />
                My Resumes
                <FontAwesomeIcon icon={faQuoteRight} className="ml-2 text-xl" style={{ color: '#2c2a63' }} />
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {allResumes.map((resume) => {
                  const templatePreview = resume.template
                    ? templatePreviews[resume.template] || templatePreviews['digital-pro']
                    : templatePreviews['digital-pro'];
                  const category = templates.find(t => t.id === resume.template)?.category || 'Simple';
                  const dots = categoryDots[category] ?? ["#9E9E9E", "#BDBDBD", "#E0E0E0"];

                  return (
                    <div
                      key={resume._id}
                      onClick={() => navigate(`/app/builder/${resume._id}`)}
                      style={{ cursor: 'pointer' }}
                      className="hover:scale-[1.02] transition-transform duration-300"
                    >
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group relative flex flex-col">
                        <CardContent className="p-0 flex flex-col flex-1">

                          {/* Image Section */}
                          <div className="relative overflow-hidden h-40 md:h-52">
                            <img
                              src={templatePreview}
                              alt={resume.title}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                            />

                            {/* Hover overlay */}
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2"
                              style={{ backgroundColor: 'rgba(237, 201, 175, 0.95)' }}
                            >
                              <button
                                className="px-6 py-2 rounded-lg font-semibold text-sm"
                                style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
                              >
                                Edit Resume
                              </button>
                            </div>
                          </div>

                          {/* Card Bottom */}
                          <div className="p-3 flex flex-col flex-1">

                            {/* Color dots */}
                            <div className="flex items-center gap-1 mb-1">
                              {dots.map((color, i) => (
                                <span
                                  key={i}
                                  className="w-2.5 h-2.5 rounded-full inline-block"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>

                            {/* Resume title */}
                            <h3 className="font-bold text-left text-sm mb-1" style={{ color: '#2c2a63' }}>
                              {resume.title}
                            </h3>

                            {/* Updated date */}
                            <p className="text-xs text-left flex-1" style={{ color: '#333' }}>
                              Updated on {new Date(resume.updatedAt).toLocaleDateString('en-US', {
                                month: '2-digit', day: '2-digit', year: 'numeric'
                              })}
                            </p>

                            {/* Bottom row: edit/delete + PDF badge */}
                            <div className="flex items-center justify-between mt-2">
                              <div
                                className="flex items-center gap-1"
                                onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                              >
                                {!resume.adminCreated && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditResumeId(resume._id);
                                      setTitle(resume.title);
                                    }}
                                    className="size-7 flex items-center justify-center bg-gray-100 hover:bg-[#2c2a63] hover:text-white rounded-md text-slate-600 transition-all"
                                    title="Edit title"
                                  >
                                    <PencilIcon className="size-3.5" />
                                  </button>
                                )}
                                {!resume.adminCreated && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteResume(resume._id);
                                    }}
                                    className="size-7 flex items-center justify-center bg-gray-100 hover:bg-red-500 hover:text-white rounded-md text-slate-600 transition-all"
                                    title="Delete"
                                  >
                                    <TrashIcon className="size-3.5" />
                                  </button>
                                )}
                              </div>

                              <span className="text-xs font-bold px-3 py-1 rounded bg-gray-500 text-white">
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


            </div>
            <hr className='border-[#EDC9AF]/30 my-8' />
          </>
        )}

        {/* ── My Cover Letters ── */}
        {allCoverLetters.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#2c2a63]">
                <FontAwesomeIcon icon={faQuoteLeft} className="mr-2 text-xl" style={{ color: '#2c2a63' }} />
                My Cover Letters
                <FontAwesomeIcon icon={faQuoteRight} className="ml-2 text-xl" style={{ color: '#2c2a63' }} />
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {allCoverLetters.map((coverLetter) => {
                  const dots = categoryDots["Simple"] ?? ["#9E9E9E", "#BDBDBD", "#E0E0E0"];

                  return (
                    <div
                      key={coverLetter._id}
                      onClick={() => navigate(`/app/cover-letter/builder/${coverLetter._id}`)}
                      className="hover:scale-[1.02] transition-transform duration-300"
                      style={{ cursor: 'pointer' }}
                    >
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group relative flex flex-col">
                        <CardContent className="p-0 flex flex-col flex-1">

                          {/* Image Section */}
                          <div className="relative overflow-hidden h-40 md:h-52">
                            <img
                              src="/assets/Services/cover-letter-preview.jpeg"
                              alt={coverLetter.title}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Hover overlay */}
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2"
                              style={{ backgroundColor: 'rgba(237, 201, 175, 0.95)' }}
                            >
                              <button
                                className="px-6 py-2 rounded-lg font-semibold text-sm"
                                style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
                              >
                                Edit Cover Letter
                              </button>
                            </div>
                          </div>

                          {/* Card Bottom */}
                          <div className="p-3 flex flex-col flex-1">

                            {/* Color dots */}
                            <div className="flex items-center gap-1 mb-1">
                              {dots.map((color, i) => (
                                <span
                                  key={i}
                                  className="w-2.5 h-2.5 rounded-full inline-block"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>

                            {/* Title */}
                            <h3 className="font-bold text-left text-sm mb-1" style={{ color: '#2c2a63' }}>
                              {coverLetter.title}
                            </h3>

                            {/* Updated date */}
                            <p className="text-xs text-left flex-1" style={{ color: '#333' }}>
                              Updated on {new Date(coverLetter.updatedAt).toLocaleDateString('en-US', {
                                month: '2-digit', day: '2-digit', year: 'numeric'
                              })}
                            </p>

                            {/* Bottom row: edit/delete buttons */}
                            <div className="flex items-center justify-between mt-2">
                              <div
                                className="flex items-center gap-1"
                                onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditCoverLetterId(coverLetter._id); setTitle(coverLetter.title); }}
                                  className="size-7 flex items-center justify-center bg-gray-100 hover:bg-[#2c2a63] hover:text-white rounded-md text-slate-600 transition-all"
                                  title="Edit title"
                                >
                                  <PencilIcon className="size-3.5" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); deleteCoverLetter(coverLetter._id); }}
                                  className="size-7 flex items-center justify-center bg-gray-100 hover:bg-red-500 hover:text-white rounded-md text-slate-600 transition-all"
                                  title="Delete"
                                >
                                  <TrashIcon className="size-3.5" />
                                </button>
                              </div>
                              <span className="text-xs font-bold px-3 py-1 rounded bg-gray-500 text-white">
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
            </div>
            <hr className='border-[#EDC9AF]/30 my-8' />
          </>
        )}

        {/* Edit Cover Letter Modal */}
        {editCoverLetterId && (
          <form
            onSubmit={editCoverLetterTitle}
            onClick={() => setEditCoverLetterId('')}
            className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center p-4'
          >
            <div
              onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              className='relative bg-white border-2 border-[#EDC9AF] shadow-xl rounded-2xl w-full max-w-sm p-6'
            >
              <h2 className='text-xl font-bold mb-4 text-[#2c2a63]'>Edit Cover Letter Title</h2>
              <input
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder='Enter cover letter title'
                className='w-full px-4 py-2 mb-4 border-2 border-[#EDC9AF] rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none'
                required
              />
              <button className='w-full py-2 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#1f1d4f] transition-colors font-semibold'>
                Update
              </button>
              <XIcon
                className='absolute top-4 right-4 text-slate-400 hover:text-[#2c2a63] cursor-pointer transition-colors'
                onClick={() => { setEditCoverLetterId(''); setTitle(''); }}
              />
            </div>
          </form>
        )}

        {/* ── Templates section ─────────────────────────────────────────────── */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#2c2a63' }}>
              <FontAwesomeIcon icon={faQuoteLeft} className="mr-2 text-xl" style={{ color: '#2c2a63' }} />
              {allResumes.length > 0 ? 'Create New Resume from Template' : 'Choose a Template to Get Started'}
              <FontAwesomeIcon icon={faQuoteRight} className="ml-2 text-xl" style={{ color: '#2c2a63' }} />
            </h2>
            <p className="max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: '#2c2a63' }}>
              Select from our professionally designed templates to create your perfect resume
            </p>
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
              style={{ borderColor: '#2c2a63', color: '#2c2a63', backgroundColor: 'white' }}
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

          {/* Mobile: Horizontal scroll with arrows */}
          <div className="md:hidden relative">
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: '#2c2a63' }}
              aria-label="Scroll left"
            >
              <FontAwesomeIcon icon={faChevronLeft} style={{ color: '#EDC9AF' }} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: '#2c2a63' }}
              aria-label="Scroll right"
            >
              <FontAwesomeIcon icon={faChevronRight} style={{ color: '#EDC9AF' }} />
            </button>
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto px-12 py-4 scrollbar-hide"
            >
              {filteredTemplates.map((template, index) => renderTemplateCard(template, index, true))}
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredTemplates.map((template, index) => renderTemplateCard(template, index, false))}
          </div>
        </div>

        {/* ── Modals ── */}

        {/* Create Resume Modal */}
        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center p-4'
          >
            <div
              onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              className='relative bg-white border-2 border-[#EDC9AF] shadow-xl rounded-2xl w-full max-w-sm p-6'
            >
              <h2 className='text-xl font-bold mb-4 text-[#2c2a63]'>Create a Resume</h2>
              <input
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder='Enter resume title'
                className='w-full px-4 py-2 mb-4 border-2 border-[#EDC9AF] rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none'
                required
              />
              <button className='w-full py-2 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#1f1d4f] transition-colors font-semibold'>
                Create Resume
              </button>
              <XIcon
                className='absolute top-4 right-4 text-slate-400 hover:text-[#2c2a63] cursor-pointer transition-colors'
                onClick={() => { setShowCreateResume(false); setTitle(''); }}
              />
            </div>
          </form>
        )}

        {/* Upload Resume Modal */}
        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center p-4'
          >
            <div
              onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              className='relative bg-white border-2 border-[#EDC9AF] shadow-xl rounded-2xl w-full max-w-sm p-6'
            >
              <h2 className='text-xl font-bold mb-4 text-[#2c2a63]'>Upload Resume</h2>
              <input
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder='Enter resume title'
                className='w-full px-4 py-2 mb-4 border-2 border-[#EDC9AF] rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none'
                required
              />
              <div>
                <label htmlFor="resume-input" className="block text-sm text-[#2c2a63] font-medium">
                  Select resume file
                  <div className='flex flex-col items-center justify-center gap-2 border-2 group text-[#EDC9AF] border-[#EDC9AF] border-dashed rounded-lg p-4 py-10 my-4 hover:border-[#2c2a63] hover:text-[#2c2a63] cursor-pointer transition-colors'>
                    {resume ? (
                      <p className='text-[#2c2a63] font-semibold'>{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className='size-14 stroke-1' />
                        <p>Upload resume</p>
                      </>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id='resume-input'
                  accept='.pdf'
                  hidden
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) setResume(file);
                  }}
                />
              </div>
              <button
                disabled={isLoading}
                className='w-full py-2 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#1f1d4f] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold'
              >
                {isLoading && <LoaderCircleIcon className='animate-spin size-4' />}
                {isLoading ? 'Uploading...' : 'Upload Resume'}
              </button>
              <XIcon
                className='absolute top-4 right-4 text-slate-400 hover:text-[#2c2a63] cursor-pointer transition-colors'
                onClick={() => { setShowUploadResume(false); setTitle(''); setResume(null); }}
              />
            </div>
          </form>
        )}

        {/* Create Cover Letter Modal */}
        {showCreateCoverLetter && (
          <form
            onSubmit={createCoverLetter}
            onClick={() => setShowCreateCoverLetter(false)}
            className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center p-4'
          >
            <div
              onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              className='relative bg-white border-2 border-[#EDC9AF] shadow-xl rounded-2xl w-full max-w-sm p-6'
            >
              <h2 className='text-xl font-bold mb-4 text-[#2c2a63]'>Create a Cover Letter</h2>
              <input
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCoverLetterTitle(e.target.value)}
                value={coverLetterTitle}
                type="text"
                placeholder='Enter cover letter title'
                className='w-full px-4 py-2 mb-4 border-2 border-[#EDC9AF] rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none'
                required
              />
              <button className='w-full py-2 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#1f1d4f] transition-colors font-semibold'>
                Create Cover Letter
              </button>
              <XIcon
                className='absolute top-4 right-4 text-slate-400 hover:text-[#2c2a63] cursor-pointer transition-colors'
                onClick={() => { setShowCreateCoverLetter(false); setCoverLetterTitle(''); }}
              />
            </div>
          </form>
        )}

        {/* Edit Resume Modal */}
        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeId('')}
            className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center p-4'
          >
            <div
              onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              className='relative bg-white border-2 border-[#EDC9AF] shadow-xl rounded-2xl w-full max-w-sm p-6'
            >
              <h2 className='text-xl font-bold mb-4 text-[#2c2a63]'>Edit Resume Title</h2>
              <input
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder='Enter resume title'
                className='w-full px-4 py-2 mb-4 border-2 border-[#EDC9AF] rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none'
                required
              />
              <button className='w-full py-2 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#1f1d4f] transition-colors font-semibold'>
                Update
              </button>
              <XIcon
                className='absolute top-4 right-4 text-slate-400 hover:text-[#2c2a63] cursor-pointer transition-colors'
                onClick={() => { setEditResumeId(''); setTitle(''); }}
              />
            </div>
          </form>
        )}
      </div>

      {/* Resume Limit Modal */}
      {showResumeLimitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowResumeLimitModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Resume Limit Reached</h3>
              <p className="text-gray-600 mb-4">
                You've reached your <span className="font-semibold text-[#2c2a63]">{resumeLimitData.userPlan}</span> plan limit
              </p>
              <p className="text-sm text-gray-500 mb-6">
                You've used <span className="font-bold text-red-600">{resumeLimitData.resumesUsed}/{resumeLimitData.resumesLimit}</span> resume slots
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-[#2c2a63] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 font-medium">Upgrade to unlock more resume slots!</p>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 ml-7">
                <li>• Basic Plan: <span className="font-semibold">1 resume slot</span></li>
                <li>• Advanced Plan: <span className="font-semibold">3 resume slots</span></li>
                <li>• Professional Plan: <span className="font-semibold">5 resume slots</span></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className={`flex gap-3 ${resumeLimitData.hasEditCreditsRemaining && resumeLimitData.previousResumeId ? 'flex-row' : ''}`}>
                <button
                  onClick={() => { setShowResumeLimitModal(false); setShowPricingModal(true); }}
                  className={`${resumeLimitData.hasEditCreditsRemaining && resumeLimitData.previousResumeId ? 'flex-1' : 'w-full'} bg-gradient-to-r from-[#2c2a63] to-[#1f1d4a] text-[#EDC9AF] py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all`}
                >
                  Upgrade Plan
                </button>

                {resumeLimitData.hasEditCreditsRemaining && resumeLimitData.previousResumeId && (
                  <button
                    onClick={() => { setShowResumeLimitModal(false); navigate(`/app/builder/${resumeLimitData.previousResumeId}`); }}
                    className="flex-1 bg-[#EDC9AF] text-[#2c2a63] py-3 px-6 rounded-lg font-semibold hover:bg-[#e0b89f] transition-all flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="w-5 h-5" />
                    Edit Previous
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowResumeLimitModal(false)}
                className="w-full bg-[#2c2a63] border-2 border-[#2c2a63] text-[#EDC9AF] py-3 px-6 rounded-lg font-medium hover:bg-[#1f1d4f] hover:border-[#1f1d4f] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </div>
  );
};

export default Dashboard;