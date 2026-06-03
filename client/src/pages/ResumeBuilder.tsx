import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faPalette, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {
   ChevronLeft, ChevronRight, DownloadIcon,
  EyeIcon, EyeOffIcon, Share2Icon, LucideIcon,
  Briefcase, FileText, FolderIcon, GraduationCap, Sparkles, User,
  Check, X, ChevronRight as ChevronRightIcon, Lock
} from 'lucide-react';
import PersonalInfoForm from '../components/PersonalInfoForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import ColorPicker from '../components/ColorPicker';
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm';
import ExperienceForm from '../components/ExperienceForm';
import EducationForm from '../components/EducationForm';
import ProjectForm from '../components/ProjectForm';
import SkillsForm from '../components/SkillsForm';
import AdditionalInfoForm from '../components/AdditionalInfoForm';
import PricingModal from '../components/home/PricingModal';
import DownloadLimitModal from '../components/DownloadLimitModal';
import ProgressBar from '../components/ProgressBar';
import { useSelector } from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';
import { PersonalInfo, Experience, Education, Project, AdditionalInfo, ResumeData } from '../types/resume';


interface Section {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface RootState {
  auth: {
    token: string;
    user: any;
  };
}

interface ResumeResponse {
  resume: ResumeData;
  message?: string;
  personalInfoLocked?: boolean;
  personalInfoEditCount?: number;
}

interface ValidationError {
  field: string;
  message: string;
}

// ── Download Unlock Modal ──────────────────────────────────────────────────────
interface DownloadUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockPlan: (planKey: string, price: number, planName: string) => void;
  onSeeAllPlans: () => void;
  userAtsScore?: number | null;
  isFreeTemplate?: boolean;
  onContinueWithFree?: () => void;
}

const DownloadUnlockModal: React.FC<DownloadUnlockModalProps> = ({
  isOpen,
  onClose,
  onUnlockPlan,
  onSeeAllPlans,
  userAtsScore,
  isFreeTemplate,
  onContinueWithFree,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('power');
  const [animatedBefore, setAnimatedBefore] = useState(0);
  const [animatedAfter, setAnimatedAfter] = useState(0);
  

const [fallbackScore] = useState(() => Math.floor(Math.random() * 5) + 37); // 37–41, stable
const beforeScore = userAtsScore ?? fallbackScore;
const afterScore = 85;

  useEffect(() => {
    if (!isOpen) return;
    setAnimatedBefore(0);
    setAnimatedAfter(0);
    const duration = 1200;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedBefore(Math.round(ease * beforeScore));
      setAnimatedAfter(Math.round(ease * afterScore));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isOpen, beforeScore, afterScore]);

  const plans = [
    {
      key: 'starter',
      name: 'Premium Monthly',
      subtitle: '1 Month',
      price: 399,
      originalPrice: 599,
      savePct: '33%',
      billing: 'Billed monthly. Cancel anytime.',
      popular: false,
      perMonth: null,
    },
    {
      key: 'power',
      name: 'Premium 3 Months',
      subtitle: '3 Months',
      price: 499,
      originalPrice: 1497,
      savePct: '40%',
      billing: '₹166/month • Billed every 3 months',
      popular: true,
      perMonth: '₹166/month',
    },
    {
      key: 'pro',
      name: 'Premium Yearly',
      subtitle: '1 Year',
      price: 999,
      originalPrice: 3588,
      savePct: '44%',
      billing: '₹83/month • Billed annually',
      popular: false,
      perMonth: '₹83/month',
    },
  ];
 const features = [
    {
      bg: '#ede9fe',
      title: 'Download in PDF & Word',
      desc: 'High-quality PDF and editable Word file',
      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3v13" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/><path d="M8 12l4 4 4-4" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/></svg>
    },
    {
      bg: '#fff7ed',
      title: 'AI Resume Enhancer',
      desc: 'Advanced AI rewrite & content improvement',
      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    },
    {
      bg: '#dcfce7',
      title: '50+ Premium Templates',
      desc: 'Access our recruiter-approved templates',
      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="2" width="16" height="20" rx="2" stroke="#16a34a" strokeWidth="2"/><line x1="8" y1="7" x2="16" y2="7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="11" x2="16" y2="11" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="15" x2="13" y2="15" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/></svg>
    },
    {
      bg: '#ede9fe',
      title: 'Live ATS Score Tracking',
      desc: 'Track and improve your ATS score in real-time',
      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#7c3aed" strokeWidth="2"/><circle cx="12" cy="12" r="5" stroke="#7c3aed" strokeWidth="2"/><circle cx="12" cy="12" r="2" fill="#7c3aed"/></svg>
    },
    {
      bg: '#dbeafe',
      title: 'LinkedIn Profile Review',
      desc: 'Detailed LinkedIn optimization guide',
      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" stroke="#0a66c2" strokeWidth="2"/><path d="M7 10v7M7 7v.01" stroke="#0a66c2" strokeWidth="2.2" strokeLinecap="round"/><path d="M11 17v-4a2 2 0 014 0v4M11 13v4" stroke="#0a66c2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    },
    {
      bg: '#dbeafe',
      title: 'Interview Guide eBook',
      desc: '100+ interview Q&A and expert tips',
      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round"/><line x1="9" y1="7" x2="15" y2="7" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round"/><line x1="9" y1="11" x2="15" y2="11" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round"/></svg>
    },
    {
      bg: '#fff7ed',
      title: 'Priority Support',
      desc: 'Get expert help whenever you need',
      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 18v-6a9 9 0 0118 0v6" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"/><rect x="16" y="14" width="5" height="6" rx="2" stroke="#ea580c" strokeWidth="2"/><rect x="3" y="14" width="5" height="6" rx="2" stroke="#ea580c" strokeWidth="2"/></svg>
    },
    {
      bg: '#ffe4e6',
      title: 'One Time Payment',
      desc: 'Lifetime access, no recurring charges',
      svg: <svg width="22" height="14" viewBox="0 0 30 18" fill="none"><path d="M15 9C13 5.5 10 3 6.5 3a6 6 0 000 12C10 15 13 12.5 15 9z" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 9c2 3.5 5 6 8.5 6a6 6 0 000-12C20 3 17 5.5 15 9z" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    },
  ];
  const beforeColor = beforeScore >= 70 ? '#10b981' : beforeScore >= 50 ? '#f59e0b' : '#ef4444';
  const selectedPlanData = plans.find(p => p.key === selectedPlan) ?? plans[1];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl relative"
        style={{ border: '2px solid #2c2a63' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:opacity-80"
          style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
        >
          <X size={16} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Lock size={22} style={{ color: '#2c2a63' }} />
              <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: '#2c2a63' }}>
                Unlock Your Optimized Resume
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Download your resume and unlock premium features to boost your job chances.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ── LEFT COLUMN ── */}
            <div>
              {/* Before / After Score Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6 relative">
                {/* Before */}
                <div
                  className="rounded-xl p-4 border-2"
                  style={{ borderColor: '#fca5a5', backgroundColor: '#fff5f5' }}
                >
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#fca5a5', color: '#7f1d1d' }}
                  >
                    Before Enhancement
                  </span>
                  <p className="text-xs text-gray-500 mt-3 mb-1">ATS Score</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black" style={{ color: '#ef4444' }}>
                      {animatedBefore}
                    </span>
                    <span className="text-sm text-gray-400 font-semibold">/100</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${animatedBefore}%`, backgroundColor: beforeColor }}
                    />
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {['Missing important keywords', 'Poor resume structure', 'Low chances of shortlist'].map((item) => (
                      <li key={item} className="flex items-center gap-1.5 text-[11px] text-red-500">
                        <X size={10} className="flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow between cards */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center z-10 shadow-md"
                  style={{ backgroundColor: '#2c2a63' }}
                >
                  <i className="fa-solid fa-arrow-right text-[#EDC9AF]" style={{ fontSize: '10px' }} />
                </div>

                {/* After */}
                <div
                  className="rounded-xl p-4 border-2"
                  style={{ borderColor: '#6ee7b7', backgroundColor: '#f0fdf4' }}
                >
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#6ee7b7', color: '#064e3b' }}
                  >
                    After Enhancement
                  </span>
                  <p className="text-xs text-gray-500 mt-3 mb-1">ATS Score</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black" style={{ color: '#10b981' }}>
                      {animatedAfter}
                    </span>
                    <span className="text-sm text-gray-400 font-semibold">/100</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${animatedAfter}%`, backgroundColor: '#10b981' }}
                    />
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {['Keywords optimized', 'ATS-friendly structure', 'High chances of shortlist'].map((item) => (
                      <li key={item} className="flex items-center gap-1.5 text-[11px] text-emerald-600">
                        <Check size={10} className="flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* What You Get */}
              <div className="mb-5">
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: '#2c2a63' }}>
                  What You Get with Premium
                  <i className="fa-solid fa-crown text-yellow-500 text-sm" />
                </h3>
        
          <div className="grid grid-cols-2 gap-2.5">
                  {features.map((f) => (
                    <div
                      key={f.title}
                      className="flex items-start gap-2.5 p-3 rounded-xl"
                      style={{ backgroundColor: '#fff', border: '1px solid #f0f0f0' }}
                    >
                      <div
                        className="flex items-center justify-center flex-shrink-0 rounded-lg mt-0.5"
                        style={{ width: 40, height: 40, backgroundColor: f.bg, minWidth: 40 }}
                      >
                        {f.svg}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold leading-tight" style={{ color: '#2c2a63' }}>
                          {f.title}
                        </p>
                        <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badge */}
              <div
                className="flex items-center gap-3 p-3.5 rounded-xl"
                style={{ backgroundColor: '#f8f7ff', border: '1px solid #ede9ff' }}
              >
                <i className="fa-solid fa-shield-halved text-lg flex-shrink-0" style={{ color: '#2c2a63' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold" style={{ color: '#2c2a63' }}>
                    Trusted by 50,000+ Job Seekers
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Join thousands who got more interviews with our optimized resumes.
                  </p>
                </div>
                <div className="flex items-center ml-auto flex-shrink-0">
                  {[
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=60',
                    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=60',
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=60',
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border-2 border-white"
                      style={{ marginLeft: i === 0 ? 0 : '-8px' }}
                    />
                  ))}
                  <span className="ml-1.5 text-[10px] font-bold" style={{ color: '#2c2a63' }}>
                    50K+
                  </span>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="flex flex-col">
              <h3 className="font-bold text-base mb-4" style={{ color: '#2c2a63' }}>
                Choose Your Plan
              </h3>

              {/* Plan Cards */}
              <div className="space-y-3 mb-5">
                {plans.map((plan) => (
                  <div
                    key={plan.key}
                    onClick={() => setSelectedPlan(plan.key)}
                    className="relative rounded-xl p-4 cursor-pointer transition-all"
                    style={{
                      border: selectedPlan === plan.key ? '2px solid #2c2a63' : '2px solid #e5e7eb',
                      backgroundColor: selectedPlan === plan.key ? '#f8f7ff' : '#fff',
                    }}
                  >
                    {plan.popular && (
                      <span
                        className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap"
                        style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
                      >
                        Most Popular
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      {/* Radio */}
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          borderColor: selectedPlan === plan.key ? '#2c2a63' : '#d1d5db',
                          backgroundColor: selectedPlan === plan.key ? '#2c2a63' : 'transparent',
                        }}
                      >
                        {selectedPlan === plan.key && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>

                      {/* Plan info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm" style={{ color: '#2c2a63' }}>
                            {plan.name}
                          </span>
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: '#dcfce7', color: '#166534' }}
                          >
                            Save {plan.savePct}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">{plan.billing}</p>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl font-extrabold" style={{ color: '#2c2a63' }}>
                          ₹{plan.price}
                        </div>
                        <p className="text-[11px] text-gray-400 line-through">₹{plan.originalPrice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security badges */}
              <div
                className="flex items-center justify-center gap-4 mb-5 py-3 px-4 rounded-xl flex-wrap"
                style={{ backgroundColor: '#f8f7ff', border: '1px solid #ede9ff' }}
              >
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                  <i className="fa-solid fa-lock text-xs" style={{ color: '#2c2a63' }} />
                  SSL Secured
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                  <i className="fa-solid fa-circle-check text-xs" style={{ color: '#2c2a63' }} />
                  Secure Payments
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                  <i className="fa-solid fa-rotate-left text-xs" style={{ color: '#2c2a63' }} />
                  Money Back Guarantee
                </span>
              </div>

              {/* CTA */}
              <button
                onClick={() =>
                  onUnlockPlan(selectedPlanData.key, selectedPlanData.price, selectedPlanData.name)
                }
                className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg mb-3"
                style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
              >
            <i className="fa-solid fa-lock text-sm" />
                Unlock Premium Now
              </button>

             {/* See All Plans */}
              <button
                onClick={onSeeAllPlans}
                className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 transition-all hover:opacity-80 mb-3"
                style={{ backgroundColor: '#EDC9AF', color: '#2c2a63' }}
              >
                See All Plans
                <ChevronRightIcon size={15} />
              </button>

              {/* Continue with Free — only for free templates */}
              {isFreeTemplate && onContinueWithFree && (
                <button
                  onClick={onContinueWithFree}
                  className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 transition-all hover:opacity-80 mb-4"
                  style={{ backgroundColor: '#f0fdf4', color: '#065f46', border: '1.5px solid #6ee7b7' }}
                >
                  <i className="fa-solid fa-file-arrow-down text-sm" />
                  Continue with Free
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// ──────────────────────────────────────────────────────────────────────────────

const ResumeBuilder: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const formTopRef = useRef<HTMLDivElement>(null);

  // ── Print blocking ─────────────────────────────────────────────────────────
  const resumeDataRef = useRef<ResumeData | null>(null);
  const isDownloadingRef = useRef<boolean>(false);
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);
  const freeTemplates = ['digital-pro', 'modern-two-column'];
  // ──────────────────────────────────────────────────────────────────────────

  // ── Download Unlock Modal state ──────────────────────────────────────
  const [showDownloadUnlockModal, setShowDownloadUnlockModal] = useState<boolean>(false);
  const [userAtsScore, setUserAtsScore] = useState<number | null>(null);
  // ──────────────────────────────────────────────────────────────────────────

 const [resumeData, setResumeData] = useState<ResumeData>({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    additional_info: {},
   template: "geometric-blue",
  accent_color: "#2c2a63",
    public: false,
    status: 'draft',
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [removeBackground, setRemoveBackground] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const [userPlan, setUserPlan] = useState<string>("Free");
  const [showDisabledButton, setShowDisabledButton] = useState<boolean>(false);
  const [unlockedTemplates, setUnlockedTemplates] = useState<string[]>([]);
  const [downloadCount, setDownloadCount] = useState<number>(0);
  const [downloadLimit, setDownloadLimit] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [personalInfoLocked, setPersonalInfoLocked] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isAdminCreated, setIsAdminCreated] = useState<boolean>(false);
  const [, setResumeOwnerId] = useState<string>('');
  const [isSendingToUser, setIsSendingToUser] = useState<boolean>(false);

  const personalInfoToastShownRef = useRef(false);
  const isAdminModeRef = useRef(false);

  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);


  const [showPersonalInfoLimitModal, setShowPersonalInfoLimitModal] = useState<boolean>(false);

  const [previousResumeId, setPreviousResumeId] = useState<string>('');
  const [hasEditCreditsRemaining, setHasEditCreditsRemaining] = useState<boolean>(false);

  const [globalEditUsed, setGlobalEditUsed] = useState<boolean>(false);
const [userRole, setUserRole] = useState<string>('user');

  // ── Keep refs in sync ──────────────────────────────────────────────────────
  useEffect(() => { resumeDataRef.current = resumeData; }, [resumeData]);
  useEffect(() => { isDownloadingRef.current = isDownloading; }, [isDownloading]);
  // ──────────────────────────────────────────────────────────────────────────

  // ── Block Ctrl+P / browser print (allow only download button) ─────────────
  useEffect(() => {
    const handlePrintAttempt = (): boolean => {
      if (isDownloadingRef.current) return true;

      const currentTemplate = resumeDataRef.current?.template || 'geometric-blue';
      const isFreeTemplate = freeTemplates.includes(currentTemplate);

      if (isFreeTemplate) {
        setShowPremiumModal(true);
        return false;
      }

      setShowPremiumModal(true);
      return false;
    };

    const blockPrint = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        const allowed = handlePrintAttempt();
        if (!allowed) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
    };

    const blockBeforePrint = () => {
      if (isDownloadingRef.current) return;
      const style = document.createElement('style');
      style.id = 'print-block-style';
      style.innerHTML = `
        @media print {
          html, body, * { display: none !important; visibility: hidden !important; }
        }
      `;
      document.head.appendChild(style);
      setShowPremiumModal(true);
    };

    const unblockAfterPrint = () => {
      const style = document.getElementById('print-block-style');
      if (style) style.remove();
    };

    document.addEventListener('keydown', blockPrint, { capture: true });
    window.addEventListener('beforeprint', blockBeforePrint);
    window.addEventListener('afterprint', unblockAfterPrint);

    return () => {
      document.removeEventListener('keydown', blockPrint, { capture: true });
      window.removeEventListener('beforeprint', blockBeforePrint);
      window.removeEventListener('afterprint', unblockAfterPrint);
    };
  }, []);
  // ──────────────────────────────────────────────────────────────────────────

  const sections: Section[] = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
    { id: "additional", name: "Additional Info", icon: FileText },
  ];

  const activeSection = sections[activeSectionIndex];

 
 


  const loadUserAccess = async (): Promise<void> => {
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      const { data } = await api.get('/users/data', {
        headers: { Authorization: token }
      });
      if (data.user) {
        setUserPlan(data.user.plan || "Free");
        setUnlockedTemplates(data.user.unlockedTemplates || []);
        setDownloadCount(data.user.downloadCount || 0);
        setDownloadLimit(data.user.downloadLimit || 0);

        if (data.user.atsScore) {
          setUserAtsScore(data.user.atsScore);
        }

        const planLimits: { [key: string]: number } = {
          'Advanced': 3,
          'Professional': 5,
          'Free': 0
        };
        const maxEdits = planLimits[data.user.plan] || 0;
        const editCount = data.user.personalInfoEditCount || 0;

        setPersonalInfoLocked(data.user.personalInfoLocked || false);
        setGlobalEditUsed(editCount > 0);

        const hasCreditsRemaining = editCount < maxEdits && !data.user.personalInfoLocked;
        setHasEditCreditsRemaining(hasCreditsRemaining);

        console.log('🔐 Lock states loaded:', {
          editCount,
          maxEdits,
          locked: data.user.personalInfoLocked,
          hasCreditsRemaining
        });
      }
    } catch (error: any) {
      console.error('Error loading user access:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load user data';
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const checkDevice = () => {
      const isMobileOrTablet = window.innerWidth < 1024;
      const toastShown = localStorage.getItem('mobileToastShown');

      if (isMobileOrTablet && !toastShown) {
        toast('For the best experience, please use a laptop or desktop', {
          duration: 5000,
          icon: '💻',
          style: {
            background: '#FFFFFF',
            color: '#2c2a63',
            border: '2px solid #2c2a63',
            fontWeight: '500',
            fontSize: '14px',
          }
        });
        localStorage.setItem('mobileToastShown', 'true');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    setShowDisabledButton(false);
    setShowLimitModal(false);
  }, [resumeId]);

  const loadExistingResume = async (): Promise<void> => {
    if (!resumeId || resumeId === 'undefined' || resumeId === 'null') {
      toast.error('Invalid resume ID. Please check the URL.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const [userResponse, resumeResponse] = await Promise.all([
        api.get('/users/data', { headers: { Authorization: token } }),
        api.get<ResumeResponse>(`/resumes/get/${resumeId}`, { headers: { Authorization: token } })
      ]);

      if (userResponse.data.user) {
        const u = userResponse.data.user;
        const globalLock = u.personalInfoLocked || false;
        const globalEditCount = u.personalInfoEditCount || 0;

        setPersonalInfoLocked(globalLock);
        setGlobalEditUsed(globalEditCount >= 1);
        setUserPlan(u.plan || "Free");
        setUserRole(u.role || 'user');
        setUnlockedTemplates(u.unlockedTemplates || []);
        setDownloadCount(u.downloadCount || 0);
        setDownloadLimit(u.downloadLimit || 0);

        if (u.atsScore) {
          setUserAtsScore(u.atsScore);
        }

        const resumeUserId = (resumeResponse.data.resume as any).userId?.toString() || '';
        const loggedInUserId = u._id?.toString() || '';
        const adminRole = u.role === 'admin' || u.role === 'sales';

        if (adminRole && resumeUserId && resumeUserId !== loggedInUserId) {
          setIsAdminMode(true);
          isAdminModeRef.current = true;
          setResumeOwnerId(resumeUserId);
          console.log('👑 Admin mode activated for resume:', resumeId);
        } else {
          setIsAdminMode(false);
          isAdminModeRef.current = false;
          setResumeOwnerId('');
        }
      }

      if (resumeResponse.data.resume) {
        const r = resumeResponse.data.resume as any;

        const loadedResume: ResumeData = {
          _id: r._id || '',
          title: r.title || 'Untitled Resume',
          personal_info: {
            image: r.personal_info?.image || '',
            full_name: r.personal_info?.full_name || '',
            title: r.personal_info?.title || '',
            profession: r.personal_info?.profession || '',
            email: r.personal_info?.email || '',
            phone: r.personal_info?.phone || '',
            location: r.personal_info?.location || '',
            linkedin: r.personal_info?.linkedin || '',
            website: r.personal_info?.website || '',
          },
          professional_summary: r.professional_summary || '',
          experience: Array.isArray(r.experience) ? r.experience : [],
          education: Array.isArray(r.education) ? r.education : [],
          projects: Array.isArray(r.projects) ? r.projects : [],
          skills: Array.isArray(r.skills) ? r.skills : [],
          additional_info: {
            certifications: r.additional_info?.certifications || '',
            languages: r.additional_info?.languages || '',
            interests: r.additional_info?.interests || '',
          },
        template: r.template || 'geometric-blue',
          accent_color: r.accent_color || '#2c2a63',
          public: r.public || false,
          status: r.status || 'draft',
          hasBeenDownloaded: r.hasBeenDownloaded || false,
          firstDownloadDate: r.firstDownloadDate,
          personalInfoEditCount: r.personalInfoEditCount || 0,
          personalInfoLocked: r.personalInfoLocked || false,
        };

        setResumeData(loadedResume);
        document.title = loadedResume.title || 'Resume Builder';

        if (r.adminCreated) {
          setIsAdminCreated(true);
        }
      }

    } catch (error: any) {
      console.error('Error loading resume:', error);
      toast.error(error.response?.data?.message || 'Failed to load resume data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error('Please login to continue');
      return;
    }
    if (resumeId && resumeId !== 'undefined' && resumeId !== 'null') {
      loadExistingResume();
    } else {
      toast.error('Invalid resume ID in URL');
      setIsLoading(false);
    }
  }, [resumeId, token]);

  const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatPhoneNumber = (phone: string): string => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length === 10) return `+91 ${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5)}`;
    if (digitsOnly.length >= 11 && digitsOnly.startsWith('91')) {
      const number = digitsOnly.slice(2);
      return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
    }
    if (digitsOnly.length > 10) {
      const countryCode = digitsOnly.slice(0, digitsOnly.length - 10);
      const number = digitsOnly.slice(-10);
      return `+${countryCode} ${number.slice(0, 5)} ${number.slice(5)}`;
    }
    return phone;
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true;
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };

  const checkResumeHasContent = (): boolean => {
    const hasPersonalInfo = resumeData.personal_info?.full_name?.trim() ||
      resumeData.personal_info?.email?.trim();
    const hasSummary = resumeData.professional_summary?.trim();
    const hasExperience = (resumeData.experience?.length || 0) > 0;
    const hasEducation = (resumeData.education?.length || 0) > 0;
    const hasProjects = (resumeData.projects?.length || 0) > 0;
    const hasSkills = (resumeData.skills?.length || 0) > 0;
    return !!(hasPersonalInfo || hasSummary || hasExperience || hasEducation || hasProjects || hasSkills);
  };

  const validatePersonalInfo = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    if (!resumeData.personal_info?.full_name?.trim()) {
      errors.push({ field: 'full_name', message: 'Full name is required' });
    }
    if (!resumeData.personal_info?.email?.trim()) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!validateEmail(resumeData.personal_info.email)) {
      errors.push({ field: 'email', message: 'Please provide a valid email address' });
    }
    if (resumeData.personal_info?.phone && !validatePhone(resumeData.personal_info.phone)) {
      errors.push({ field: 'phone', message: 'Phone number should contain 10-15 digits' });
    }
    return errors;
  };

  const scrollToTop = (): void => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const showValidationErrors = (): void => {
    scrollToTop();
    setActiveSectionIndex(0);
    toast.error('Please fill in required details');
  };

  const changeResumeVisibility = async (): Promise<void> => {
    try {
      if (!resumeId || resumeId === 'undefined' || resumeId === 'null') {
        toast.error('Invalid resume ID');
        return;
      }
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify({ public: !resumeData.public }));
      const { data } = await api.put<ResumeResponse>('/resumes/update', formData, {
        headers: { Authorization: token }
      });
      setResumeData({ ...resumeData, public: !resumeData.public });
      toast.success(data.message || 'Visibility updated');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update visibility');
    }
  };

  const handleShare = (): void => {
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = `${frontendUrl}/view/${resumeId}`;
    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume" });
    } else {
      navigator.clipboard.writeText(resumeUrl).then(() => {
        toast.success('Link copied to clipboard!');
      }).catch(() => {
        alert(`Share this link: ${resumeUrl}`);
      });
    }
  };

  const checkDownloadAccess = (): boolean => {
    if (freeTemplates.includes(resumeData.template || '')) return true;
    if (userPlan !== "Free") return true;
    if (unlockedTemplates.includes(resumeData.template || '')) return true;
    return false;
  };

 const downloadResume = async (): Promise<void> => {
    try {
      if (!checkResumeHasContent()) {
        toast.error('Please fill in your resume details before downloading', { duration: 4000 });
        return;
      }
      const errors = validatePersonalInfo();
      if (errors.length > 0) { showValidationErrors(); return; }

      // Admin and sales users bypass all paywalls — download any template directly
      const isPrivilegedUser = userRole === 'admin' || userRole === 'sales';
      if (isPrivilegedUser) {
        setIsDownloading(true);
        isDownloadingRef.current = true;
        await performDownloadInternal();
        return;
      }

      const isFreeTemplate = freeTemplates.includes(resumeData.template || '');

      if (!isFreeTemplate && !checkDownloadAccess()) {
        setShowDownloadUnlockModal(true);
        return;
      }

    if (isFreeTemplate) {
        setShowDownloadUnlockModal(true);
        return;
      }

      setIsDownloading(true);
      isDownloadingRef.current = true;

      if (resumeData.hasBeenDownloaded) {
        await performDownloadInternal();
        return;
      }

      try {
        const { data } = await api.post('/payments/track-download',
          { resumeId, template: resumeData.template },
          { headers: { Authorization: token } }
        );
        if (data.success) {
          if (data.personalInfoLocked !== undefined) setPersonalInfoLocked(data.personalInfoLocked);
          if (data.personalInfoEditCount !== undefined) setGlobalEditUsed(data.personalInfoEditCount >= 1);
          await loadUserAccess();
          setResumeData(prev => ({ ...prev, hasBeenDownloaded: true }));
        }
      } catch (error: any) {
        if (error.response?.status === 403) {
          const reason = error.response?.data?.reason;
          if (reason === 'limit-exceeded') {
            setPreviousResumeId(error.response?.data?.previouslyDownloadedResumeId || '');
            setHasEditCreditsRemaining(error.response?.data?.hasEditCreditsRemaining || false);
            setShowLimitModal(true);
          } else {
            toast.error(error.response?.data?.message || 'Download limit reached');
          }
        } else {
          toast.error('Failed to process download');
        }
        setIsDownloading(false);
        isDownloadingRef.current = false;
        return;
      }

      await performDownloadInternal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to download resume');
      setIsDownloading(false);
      isDownloadingRef.current = false;
    }
  };

const performDownloadInternal = async (): Promise<void> => {
    try {
      await saveResume().catch(() => {});
      await new Promise(resolve => setTimeout(resolve, 500));

      const style = document.createElement('style');
      style.id = 'print-styles';
      style.textContent = `
        @media print {
          @page { size: A4; margin: 0; }
          body * { visibility: hidden; }
          .resume-preview, .resume-preview * { visibility: visible; }
          .resume-preview { position: absolute; left: 0; top: 0; width: 100%; }
          button, .no-print { display: none !important; }
        }
      `;
      document.head.appendChild(style);

      window.print();

      setTimeout(() => {
        const printStyle = document.getElementById('print-styles');
        if (printStyle) printStyle.remove();
        isDownloadingRef.current = false;
        toast.success('Resume downloaded successfully!', { duration: 3000 });
        setIsDownloading(false);
      }, 1000);
    } catch (error: any) {
      console.error('Error performing download:', error);
      toast.error(error.response?.data?.message || 'Failed to download resume');
      setIsDownloading(false);
      isDownloadingRef.current = false;
    }
  };

const handleContinueWithFree = async (): Promise<void> => {
    setShowDownloadUnlockModal(false);
    setIsDownloading(true);
    isDownloadingRef.current = true;
    await performDownloadInternal();
  };

  const handleFreeDownload = async (): Promise<void> => {
    setShowPricingModal(false);
    setIsDownloading(true);
    isDownloadingRef.current = true;
    await performDownloadInternal();
  };

  const handleLimitModalCancel = () => {
    setShowLimitModal(false);
    setShowDisabledButton(true);
  };

  const handleDisabledButtonClick = () => {
    setShowDownloadUnlockModal(true);
  };

  const handleUpgradeFromLimit = () => {
    setShowLimitModal(false);
    setShowDownloadUnlockModal(true);
  };

  const handleEditPreviousResume = () => {
    setShowLimitModal(false);
    navigate("/app");
  };

  // ── Handle plan selection from DownloadUnlockModal ────────────────────────
  const handleUnlockPlan = (planKey: string, price: number, planName: string) => {
    setShowDownloadUnlockModal(false);
    navigate('/payment', {
      state: {
        type: 'pro-plan',
        price,
        plan: planKey,
        planName,
        returnUrl: window.location.pathname,
      }
    });
  };

  const handleSeeAllPlans = () => {
    setShowDownloadUnlockModal(false);
    setShowPricingModal(true);
  };
  // ──────────────────────────────────────────────────────────────────────────

  const saveResume = async (): Promise<ResumeResponse> => {
    try {
      console.log('🔵 saveResume called:', {
        activeSectionIndex,
        projects: resumeData.projects,
        hasContent: checkResumeHasContent(),
        personalInfo: resumeData.personal_info,
      });

      if (!resumeId || resumeId === 'undefined' || resumeId === 'null') {
        toast.error('Invalid resume ID');
        throw new Error('Invalid resume ID');
      }

      if (!checkResumeHasContent() && !isAdminMode && !isAdminModeRef.current && !isAdminCreated) {
        toast.error('Please fill in your resume details before saving');
        throw new Error('Resume is empty');
      }
      if (activeSectionIndex === 0 && !isAdminMode && !isAdminModeRef.current && !isAdminCreated) {
        const errors = validatePersonalInfo();
        if (errors.length > 0) {
          showValidationErrors();
          throw new Error('Validation failed');
        }
      }

      let updatedResumeData: ResumeData = {
        ...resumeData,
        personal_info: { ...resumeData.personal_info },
        experience: [...(resumeData.experience || [])],
        education: [...(resumeData.education || [])],
        projects: [...(resumeData.projects || [])],
        skills: [...(resumeData.skills || [])],
        additional_info: { ...resumeData.additional_info }
      };

      if (updatedResumeData.personal_info?.phone) {
        updatedResumeData.personal_info.phone = formatPhoneNumber(updatedResumeData.personal_info.phone);
      }

      updatedResumeData.education = (updatedResumeData.education || []).map(ed => ({
        ...ed,
        end_date: ed.is_current ? undefined : (ed.end_date || undefined),
        is_current: ed.is_current || false
      }));

      updatedResumeData.experience = (updatedResumeData.experience || []).map(exp => ({
        ...exp,
        end_date: exp.is_current ? undefined : (exp.end_date || undefined),
        is_current: exp.is_current || false
      }));

      const formData = new FormData();
      formData.append("resumeId", resumeId);

      const dataToSend = { ...updatedResumeData };
      const imageFile = resumeData.personal_info?.image;

      if (imageFile && imageFile instanceof File) {
        const { image, ...personalInfoWithoutImage } = dataToSend.personal_info || {};
        dataToSend.personal_info = personalInfoWithoutImage;
        formData.append("image", imageFile);
      }

      formData.append('resumeData', JSON.stringify(dataToSend));

      if (removeBackground) {
        formData.append("removeBackground", "yes");
      }

      const { data } = await api.put<ResumeResponse>(
        '/resumes/update',
        formData,
        { headers: { Authorization: token } }
      );

      if (data.resume) {
        const savedResume: ResumeData = {
          ...data.resume,
          projects: Array.isArray(data.resume.projects) ? data.resume.projects : [],
          skills: Array.isArray(data.resume.skills) ? data.resume.skills : [],
          additional_info: data.resume.additional_info || {},
        };
        setResumeData(savedResume);
      }

      const { data: userData } = await api.get('/users/data', {
        headers: { Authorization: token }
      });

      if (userData.user) {
        setPersonalInfoLocked(userData.user.personalInfoLocked || false);
        setGlobalEditUsed((userData.user.personalInfoEditCount || 0) >= 1);
      }

      if (
        data.message &&
        data.message.includes('⚠️') &&
        !personalInfoToastShownRef.current
      ) {
        personalInfoToastShownRef.current = true;
        toast.success(data.message, {
          duration: 4000,
          style: {
            background: '#FFFFFF',
            color: '#2c2a63',
            border: '2px solid #EDC9AF',
            fontSize: '14px',
            fontWeight: '500',
          }
        });
      } else {
        if (!isDownloading && !data.message?.includes('⚠️')) {
          toast.success(data.message || 'Resume saved successfully!');
        }
      }

      return data;
    } catch (error: any) {
      console.error("Error saving resume:", error);

      if (error.response?.status === 403) {
        console.log('🚨 403 ERROR DETECTED - Opening modal');

        try {
          const { data: userData } = await api.get('/users/data', {
            headers: { Authorization: token }
          });

          if (userData.user) {
            setPersonalInfoLocked(userData.user.personalInfoLocked || false);
            setGlobalEditUsed((userData.user.personalInfoEditCount || 0) >= 1);
          }
        } catch (e) {
          console.error('Failed to reload user data:', e);
        }

        setShowPersonalInfoLimitModal(true);

        toast.error(error.response?.data?.message || 'Personal info is locked', {
          duration: 5000,
          style: {
            background: '#FFFFFF',
            color: '#dc2626',
            border: '2px solid #dc2626',
            fontSize: '14px',
            fontWeight: '500',
          }
        });

        throw error;
      }

      if (error.message === 'Resume is empty' ||
        error.message === 'Validation failed' ||
        error.message === 'Invalid resume ID') {
        throw error;
      }

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.message) {
        toast.error(error.message);
      }

      throw error;
    }
  };

  const isFreeTemplate = freeTemplates.includes(resumeData.template || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!resumeId || resumeId === 'undefined' || resumeId === 'null') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Invalid resume ID in URL</p>
          <Link to="/app" className="text-blue-600 hover:underline">
            Go back to dashboard
          </Link>
        </div>
      </div>
    );
  }

return (
    <div className="flex h-screen overflow-hidden bg-white">
      
      {/* ── LEFT STATIC SIDEBAR (Template + Color) ── */}
      <div className="hidden lg:flex flex-col no-print" style={{ width: 280, minWidth: 280, background: '#fff', borderRight: '1px solid #e5e7eb', height: '100vh', overflow: 'hidden' }}>
        
        {/* Sidebar Tabs */}
        <div className="flex border-b border-gray-200" style={{ flexShrink: 0 }}>
          <button
            onClick={() => setShowColorPicker(false)}
            className="flex-1 py-3 text-xs font-bold transition-all"
            style={{
              color: !showColorPicker ? '#2c2a63' : '#9ca3af',
              borderBottom: !showColorPicker ? '2px solid #2c2a63' : '2px solid transparent',
              background: 'none'
            }}
          >
            <FontAwesomeIcon icon={faFileAlt} className="mr-1.5" />
            Templates
          </button>
          <button
            onClick={() => setShowColorPicker(true)}
            className="flex-1 py-3 text-xs font-bold transition-all"
            style={{
              color: showColorPicker ? '#2c2a63' : '#9ca3af',
              borderBottom: showColorPicker ? '2px solid #2c2a63' : '2px solid transparent',
              background: 'none'
            }}
          >
            <FontAwesomeIcon icon={faPalette} className="mr-1.5" />
            Accent
          </button>
        </div>

        {/* Sidebar Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {!showColorPicker ? (
            /* Template Panel */
            <TemplateSelector
              selectedTemplate={resumeData.template || 'geometric-blue'}
              onChange={(template: string) => {
                setResumeData(prev => ({ ...prev, template }));
              }}
              onClose={() => {}}
              inline={true}
            />
          ) : (
            /* Color Panel */
            <ColorPicker
              selectedColor={resumeData.accent_color || '#2c2a63'}
              onChange={(color: string) => {
                setResumeData(prev => ({ ...prev, accent_color: color }));
              }}
              onClose={() => {}}
              inline={true}
            />
          )}
        </div>
      </div>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 no-print flex items-center justify-center"
        style={{ background: '#fff', borderTop: '1px solid #f0f0f0', boxShadow: '0 -2px 12px rgba(0,0,0,0.06)', height: 60 }}
      >
        <div className="flex items-center gap-0" style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #f0f0f0' }}>
          <button
            onClick={() => { setShowTemplateModal(true); setShowColorPicker(false); }}
            className="flex flex-col items-center gap-1 px-8 py-2.5 transition-all active:scale-95 hover:bg-gray-50 border-r border-gray-100"
          >
            <FontAwesomeIcon icon={faFileAlt} className="text-xl" style={{ color: '#2c2a63' }} />
            <span className="text-[11px] font-bold" style={{ color: '#2c2a63' }}>Template</span>
          </button>
          <button
            onClick={() => { setShowTemplateModal(true); setShowColorPicker(true); }}
            className="flex flex-col items-center gap-1 px-8 py-2.5 transition-all active:scale-95 hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faPalette} className="text-xl" style={{ color: '#2c2a63' }} />
            <span className="text-[11px] font-bold" style={{ color: '#2c2a63' }}>Accent</span>
          </button>
        </div>
      </div>

      {/* ── MOBILE MODAL (template + color) ── */}
      {showTemplateModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 no-print" onClick={() => setShowTemplateModal(false)} />
          <div className="fixed bottom-16 left-0 right-0 bg-white z-50 no-print rounded-t-2xl shadow-2xl" style={{ maxHeight: '70vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Mobile modal tabs */}
            <div className="flex border-b border-gray-200" style={{ flexShrink: 0 }}>
              <button
                onClick={() => setShowColorPicker(false)}
                className="flex-1 py-3 text-xs font-bold"
                style={{ color: !showColorPicker ? '#2c2a63' : '#9ca3af', borderBottom: !showColorPicker ? '2px solid #2c2a63' : '2px solid transparent', background: 'none' }}
              >
                <FontAwesomeIcon icon={faFileAlt} className="mr-1.5" /> Templates
              </button>
              <button
                onClick={() => setShowColorPicker(true)}
                className="flex-1 py-3 text-xs font-bold"
                style={{ color: showColorPicker ? '#2c2a63' : '#9ca3af', borderBottom: showColorPicker ? '2px solid #2c2a63' : '2px solid transparent', background: 'none' }}
              >
                <FontAwesomeIcon icon={faPalette} className="mr-1.5" /> Accent
              </button>
              <button onClick={() => setShowTemplateModal(false)} className="px-4 text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
              {!showColorPicker ? (
                <TemplateSelector
                  selectedTemplate={resumeData.template || 'geometric-blue'}
                  onChange={(template: string) => {
                    setResumeData(prev => ({ ...prev, template }));
                    setShowTemplateModal(false);
                  }}
                  onClose={() => setShowTemplateModal(false)}
                  inline={true}
                />
              ) : (
                <ColorPicker
                  selectedColor={resumeData.accent_color || '#2c2a63'}
                  onChange={(color: string) => {
                    setResumeData(prev => ({ ...prev, accent_color: color }));
                  }}
                  onClose={() => {}}
                  inline={true}
                />
              )}
            </div>
          </div>
        </>
      )}

    {/* ── MAIN CONTENT AREA ── */}
    <div className="flex flex-col flex-1 overflow-hidden pb-16 lg:pb-0">
        
        {/* Top bar with back button + action buttons */}
      <div className="no-print flex items-center justify-between px-4 py-2" style={{ flexShrink: 0, background: 'transparent' }}>
         <button
            onClick={() => navigate(isAdminMode
              ? (userRole === 'admin' ? '/admin/dashboard' : '/sales/ats-checker')
              : '/UserProfile'
            )}
            className='inline-flex gap-2 items-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:opacity-80'
            style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            {isAdminMode
              ? (userRole === 'admin' ? 'Back to Admin Dashboard' : 'Back to Sales Dashboard')
              : 'Back to Dashboard'
            }
          </button>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
          {resumeData.public && (
              <button
                onClick={handleShare}
                className="flex items-center px-3 py-2 gap-1 text-xs rounded-lg transition-colors font-medium hover:opacity-80"
                style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
              >
                <Share2Icon className="size-3" /> Share
              </button>
            )}
            <button
              onClick={changeResumeVisibility}
              className='flex items-center px-3 py-2 gap-1 text-xs rounded-lg transition-colors font-medium hover:opacity-80'
              style={{ backgroundColor: '#EDC9AF', color: '#2c2a63' }}
            >
              {resumeData.public ? <EyeIcon className="size-3" /> : <EyeOffIcon className="size-3" />}
              {resumeData.public ? 'Public' : 'Private'}
            </button>
            {isAdminMode && (
              <button
                onClick={async () => {
                  setIsSendingToUser(true);
                  try {
                    await saveResume();
                    await api.put(`/admin/resumes/${resumeId}/publish`);
                    toast.success(
                      resumeData.status === 'published'
                        ? 'Modified changes sent to user!'
                        : 'Resume sent to user dashboard!',
                      { duration: 4000 }
                    );
                    setResumeData(prev => ({ ...prev, status: 'published' }));
                  } catch (error: any) {
                    if (error?.response?.data?.message) {
                      toast.error(error.response.data.message);
                    }
                  } finally {
                    setIsSendingToUser(false);
                  }
                }}
                disabled={isSendingToUser}
                className='flex items-center gap-1 px-3 py-2 text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium hover:opacity-80'
                style={{ backgroundColor: '#EDC9AF', color: '#2c2a63' }}
              >
                {isSendingToUser ? (
                  <>
                    <div className='w-3 h-3 border-2 border-[#2c2a63] border-t-transparent rounded-full animate-spin' />
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                    </svg>
                    {(resumeData as any).status === 'published' ? 'Send Modified Changes' : 'Send to User'}
                  </>
                )}
              </button>
            )}
            {showDisabledButton ? (
              <button
                onClick={handleDisabledButtonClick}
                className='flex items-center gap-1 px-3 py-2 text-xs rounded-lg transition-colors font-medium hover:opacity-80'
                style={{ backgroundColor: '#EDC9AF', color: '#2c2a63' }}
              >
                <DownloadIcon className='size-3' /> Limit Exceeded - Upgrade
              </button>
          ) : (
              <button
                onClick={downloadResume}
                disabled={isDownloading}
                className='flex items-center gap-1 px-3 py-2 text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium hover:opacity-80'
                style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
              >
                <DownloadIcon className='size-3' />
                {isDownloading ? 'Preparing...' : 'Download'}
              </button>
            )}
          </div>
        </div>

        {/* Main grid */}
        <div className="flex-1 overflow-y-auto">
          <div className='max-w-7xl mx-auto px-4 py-6'>
            <div className='grid lg:grid-cols-12 gap-8'>
              
              {/* Left Form Panel */}
              <div className='relative lg:col-span-5 rounded-lg overflow-hidden no-print'>
                <div ref={formTopRef} className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
                  <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
                  <hr
                    className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#2c2a63] to-[#2c2a63] border-none transition-all duration-2000"
                    style={{ width: `${activeSectionIndex * 100 / (sections.length - 1)}%` }}
                  />

                  <div className="mt-4">
                    <ProgressBar resumeData={resumeData} />
                  </div>

                  <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-3 mt-4">
                    <div className='flex items-center gap-3'>
                      {activeSectionIndex !== 0 && (
                        <button
                          onClick={() => setActiveSectionIndex(prev => Math.max(prev - 1, 0))}
                          className='flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-[#2c2a63] bg-[#EDC9AF] hover:bg-[#e0b89f] transition-all'
                        >
                          <ChevronLeft className="size-4" /> Previous
                        </button>
                      )}
                      <button
                        onClick={() => setActiveSectionIndex(prev => Math.min(prev + 1, sections.length - 1))}
                        disabled={activeSectionIndex === sections.length - 1}
                        className='flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-[#EDC9AF] bg-[#2c2a63] hover:bg-[#1f1d4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        Next <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className='space-y-6'>
                    {activeSection.id === 'personal' && (
                      <PersonalInfoForm
                        key={`personal-${personalInfoLocked}-${globalEditUsed}-${resumeData.hasBeenDownloaded}`}
                        data={resumeData.personal_info || {}}
                        onChange={(data: PersonalInfo) => {
                          setResumeData(prev => ({ ...prev, personal_info: data }));
                        }}
                        removeBackground={removeBackground}
                        setRemoveBackground={setRemoveBackground}
                        personalInfoLocked={
                          resumeData.hasBeenDownloaded
                            ? (personalInfoLocked || globalEditUsed)
                            : false
                        }
                        globalEditUsed={
                          resumeData.hasBeenDownloaded
                            ? globalEditUsed
                            : false
                        }
                      />
                    )}
                    {activeSection.id === 'summary' && (
                      <ProfessionalSummaryForm
                        data={resumeData.professional_summary || ''}
                        onChange={(data: string) =>
                          setResumeData(prev => ({ ...prev, professional_summary: data }))
                        }
                        setResumeData={setResumeData}
                      />
                    )}
                    {activeSection.id === 'experience' && (
                      <ExperienceForm
                        data={resumeData.experience || []}
                        onChange={(data: Experience[]) =>
                          setResumeData(prev => ({ ...prev, experience: data }))
                        }
                      />
                    )}
                    {activeSection.id === 'education' && (
                      <EducationForm
                        data={resumeData.education || []}
                        onChange={(data: Education[]) =>
                          setResumeData(prev => ({ ...prev, education: data }))
                        }
                      />
                    )}
                    {activeSection.id === 'projects' && (
                      <ProjectForm
                        data={resumeData.projects || []}
                        onChange={(data: Project[]) =>
                          setResumeData(prev => ({ ...prev, projects: data }))
                        }
                      />
                    )}
                    {activeSection.id === 'skills' && (
                      <SkillsForm
                        data={resumeData.skills || []}
                        onChange={(data: string[]) =>
                          setResumeData(prev => ({ ...prev, skills: data }))
                        }
                      />
                    )}
                    {activeSection.id === 'additional' && (
                      <AdditionalInfoForm
                        data={resumeData.additional_info || {}}
                        onChange={(data: AdditionalInfo) =>
                          setResumeData(prev => ({ ...prev, additional_info: data }))
                        }
                      />
                    )}
                  </div>

                  <button
                    onClick={() => { saveResume().catch(() => { }); }}
                    className='bg-[#2c2a63] text-[#EDC9AF] hover:bg-[#1f1d4a] transition-all rounded-md px-6 py-2 mt-6 text-sm font-medium'
                  >
                    Save Changes
                  </button>
                </div>
              </div>

{/* Right Resume Preview */}
              <div className='lg:col-span-7 max-lg:mt-6'>
                <div className='resume-preview'>
                  <ResumePreview
                    data={resumeData}
                    template={resumeData.template || 'geometric-blue'}
                    accentColor={resumeData.accent_color || '#2c2a63'}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── ALL MODALS (unchanged) ── */}
      <DownloadUnlockModal
        isOpen={showDownloadUnlockModal}
        onClose={() => setShowDownloadUnlockModal(false)}
        onUnlockPlan={handleUnlockPlan}
        onSeeAllPlans={handleSeeAllPlans}
        userAtsScore={userAtsScore}
        isFreeTemplate={isFreeTemplate}
        onContinueWithFree={handleContinueWithFree}
      />

      {showPersonalInfoLimitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={() => setShowPersonalInfoLimitModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Info Edit Limit Reached</h3>
              <p className="text-gray-600 mb-4">You've reached your <span className="font-semibold text-[#2c2a63]">{userPlan}</span> plan limit.</p>
              <p className="text-sm text-gray-500 mb-6">✅ You can still edit: Experience, Education, Skills, Projects, and Additional Info freely.</p>
            </div>
            <div className="space-y-3">
              <button onClick={() => { setShowPersonalInfoLimitModal(false); setShowDownloadUnlockModal(true); }} className="w-full bg-gradient-to-r from-[#2c2a63] to-[#1f1d4a] text-[#EDC9AF] py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all">Upgrade Plan</button>
              <button onClick={() => setShowPersonalInfoLimitModal(false)} className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-all">Continue Editing Other Sections</button>
            </div>
          </div>
        </div>
      )}

      {showPremiumModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm no-print">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 relative">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mx-auto mb-5">
              <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-[#2c2a63] mb-2">Premium Template</h2>
            <p className="text-center text-gray-500 text-sm mb-6 leading-relaxed">To download this resume, please use the <span className="font-semibold text-[#2c2a63]">Download button</span> or upgrade your plan.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setShowPremiumModal(false); setShowDownloadUnlockModal(true); }} className="w-full py-3 rounded-xl font-semibold text-[#EDC9AF] bg-[#2c2a63] hover:bg-[#1f1d4a] transition-all shadow-md">Upgrade Plan</button>
              <button onClick={() => setShowPremiumModal(false)} className="w-full py-3 rounded-xl font-semibold text-[#2c2a63] border-2 border-[#2c2a63] hover:bg-[#2c2a63] hover:text-[#EDC9AF] transition-all">Close</button>
            </div>
          </div>
        </div>
      )}

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        showFreeOption={isFreeTemplate}
        onFreeDownload={handleFreeDownload}
      />

      <DownloadLimitModal
        isOpen={showLimitModal}
        onClose={handleLimitModalCancel}
        onUpgrade={handleUpgradeFromLimit}
        userPlan={userPlan}
        downloadCount={downloadCount}
        downloadLimit={downloadLimit}
        previousResumeId={previousResumeId}
        hasEditCreditsRemaining={hasEditCreditsRemaining}
        onEditPreviousResume={handleEditPreviousResume}
      />
    </div>
  );
  };

export default ResumeBuilder;