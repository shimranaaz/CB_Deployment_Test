import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../app/features/authSlice';
import api from '../configs/api';
import toast from 'react-hot-toast';
import PricingModal from '../components/home/PricingModal';

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserType { name: string; email?: string; id?: string; role?: string; plan?: string; planExpiresAt?: string; mobile?: string; }
interface AuthState { user: UserType | null; token: string | null; }
interface RootState { auth: AuthState; }
interface Resume { _id: string; title: string; updatedAt: string; template?: string; accent_color?: string; adminCreated?: boolean; }
interface CoverLetter { _id: string; title: string; updatedAt: string; header_color?: string; }
interface UserData {
  plan: string; planExpiresAt?: string; linkedinOptimizationCount?: number;
  linkedinPaid?: boolean; role?: string; downloadCount?: number; downloadLimit?: number;
  name?: string; email?: string; mobile?: string;
  atsScore?: number | null;
  linkedinScore?: number | null;
}
interface Ebook {
  _id: string; title: string; description: string; coverImage: string;
  pdfUrl: string; fileSize: string; isFree: boolean; color: string;
  order: number; isActive: boolean;
}
type ActiveSection =
  | 'home' | 'my-resumes' | 'my-cover-letters' | 'resume-templates'
  | 'ats-score' | 'linkedin-score' | 'ebooks' | 'settings'
  | 'profile' | 'change-password' | 'billing' | 'delete-account';

// ─── Constants ────────────────────────────────────────────────────────────────
const BRAND = '#2c2a63';
const SAND = '#EDC9AF';
const SAND_LIGHT = '#f9f0e8';

const DOT_COLORS = ['#2E7D32', '#8B0000', '#1E3A8A', '#6A1B9A'];

const templatePreviews: Record<string, string> = {
  classic: '/templates/classic-preview.jpg', modern: '/templates/modern-preview.jpg',
  minimal: '/templates/minimal-preview.jpg', 'geometric-blue': '/templates/geometric-blue.webp',
  'minimal-image': '/templates/minimal-image-preview.jpg', 'modern-sidebar': '/templates/modern-sidebar-preview.jpg',
  geometric: '/templates/geometric-preview.jpg', stylish: '/templates/stylish-preview.jpg',
  'clean-modern': '/templates/clean-modern-preview.jpg', 'soft-minimal': '/templates/soft-minimal-preview.jpg',
  'professional-resume': '/templates/professional-resume-preview.jpeg',
  'professional-modern': '/templates/professional-modern-preview.jpeg',
  'professional-resume-template': '/templates/professional-resume-template-preview.jpeg',
  'soft-stylish': '/templates/soft-stylish-preview.jpeg',
  'modern-two-column': '/templates/modern-two-column-preview.jpeg',
  professional: '/templates/professional-preview.jpeg', creative: '/templates/creative-preview.jpeg',
  executive: '/templates/executive-preview.jpeg', tech: '/templates/tech-preview.jpeg',
  technical: '/templates/technical-preview.jpeg', elite: '/templates/elite-preview.jpeg',
  profile: '/templates/profile-preview.jpeg', 'digital-pro': '/templates/digital-pro-preview.jpeg',
  'beginner-pro': '/templates/beginner-pro-preview.jpeg',
  'ember-creative': '/templates/ember-creative-preview.jpeg',
  'smart-resume': '/templates/smart-resume-preview.jpeg',
  'minimal-cv': '/templates/minimal-cv-preview.jpeg', 'prime-edge': '/templates/prime-edge-preview.jpeg',
  'elitecraft-cv': '/templates/elitecraft-cv-preview.jpeg',
  'executive-cv': '/templates/executive-cv-preview.jpeg',
  'pureform-resume': '/templates/pureform-resume-preview.jpeg',
  'meridian-cv': '/templates/meridian-cv-preview.jpeg', 'elevare-cv': '/templates/elevare-cv-preview.jpeg',
  'talentra-cv': '/templates/talentra-cv-preview.jpeg', 'boardline-cv': '/templates/boardline-cv-preview.jpeg',
  'apex-resume': '/templates/apex-resume-preview.jpeg',
  'blueprint-resume': '/templates/blueprint-resume-preview.jpeg',
  'technexa-resume': '/templates/technexa-resume-preview.jpeg',
  'stackpro-cv': '/templates/stackpro-cv-preview.jpeg',
  'visualcraft-cv': '/templates/visualcraft-cv-preview.jpeg',
  'designflux-resume': '/templates/designflux-resume-preview.jpeg',
  'elitepath-cv': '/templates/elitepath-cv-preview.jpeg',
  'imperial-cv': '/templates/imperial-cv-preview.jpeg',
  'corporate-atlas': '/templates/corporate-atlas-preview.jpeg',
  executive_cv: '/templates/executive-cv-preview-img.jpeg',
  'artistry-resume': '/templates/artistry-resume-preview.jpeg',
  'pixel-aura': '/templates/pixel-aura-preview.jpeg', 'design-smart': '/templates/design-smart-preview.jpeg',
  'career-elite': '/templates/career-elite-preview.jpeg',
  'codepro-resume': '/templates/codepro-resume-preview.jpeg',
};

const allTemplates = [
  { id: 'modern-two-column', name: 'Simple Resume Core', image: '/templates/modern-two-column-preview.jpeg', category: 'Simple', isPremium: false },
  { id: 'digital-pro', name: 'Simple Foundation', image: '/templates/digital-pro-preview.jpeg', category: 'Simple', isPremium: false },
  { id: 'beginner-pro', name: 'Beginner Professional', image: '/templates/beginner-pro-preview.jpeg', category: 'Word', isPremium: false },
  { id: 'modern', name: 'Modern Edge', image: '/templates/modern-preview.jpg', category: 'Word', isPremium: true },
  { id: 'minimal-image', name: 'Profile Minimal', image: '/templates/minimal-image-preview.jpg', category: 'Two-column', isPremium: true },
  { id: 'minimal', name: 'Pure Minimal', image: '/templates/minimal-preview.jpg', category: 'Word', isPremium: true },
  { id: 'geometric-blue', name: 'Pro ATS', image: '/templates/geometric-blue.webp', category: 'ATS', isPremium: true },
  { id: 'classic', name: 'Executive Classic', image: '/templates/classic-preview.jpg', category: 'Word', isPremium: true },
  { id: 'geometric', name: 'Geometry Elite', image: '/templates/geometric-preview.jpg', category: 'Two-column', isPremium: true },
  { id: 'modern-sidebar', name: 'Sidebar Professional', image: '/templates/modern-sidebar-preview.jpg', category: 'Two-column', isPremium: true },
  { id: 'stylish', name: 'Stylish Executive', image: '/templates/stylish-preview.jpg', category: 'Two-column', isPremium: true },
  { id: 'clean-modern', name: 'Clean ATS Pro', image: '/templates/clean-modern-preview.jpg', category: 'ATS', isPremium: true },
  { id: 'soft-minimal', name: 'Soft ATS Pro', image: '/templates/soft-minimal-preview.jpg', category: 'ATS', isPremium: true },
  { id: 'professional-resume', name: 'Prime Professional', image: '/templates/professional-resume-preview.jpeg', category: 'Two-column', isPremium: true },
  { id: 'professional-modern', name: 'Modern Profile', image: '/templates/professional-modern-preview.jpeg', category: 'Picture', isPremium: true },
  { id: 'professional-resume-template', name: 'Professional Prime', image: '/templates/professional-resume-template-preview.jpeg', category: 'Picture', isPremium: true },
  { id: 'soft-stylish', name: 'Stylish Soft Pro', image: '/templates/soft-stylish-preview.jpeg', category: 'Word', isPremium: true },
  { id: 'professional', name: 'Corporate Professional', image: '/templates/professional-preview.jpeg', category: 'Word', isPremium: true },
  { id: 'creative', name: 'Creative Professional', image: '/templates/creative-preview.jpeg', category: 'Word', isPremium: true },
  { id: 'executive', name: 'Executive Prime', image: '/templates/executive-preview.jpeg', category: 'Word', isPremium: true },
  { id: 'tech', name: 'Tech ATS Pro', image: '/templates/tech-preview.jpeg', category: 'ATS', isPremium: true },
  { id: 'technical', name: 'Technical Visual', image: '/templates/technical-preview.jpeg', category: 'Picture', isPremium: true },
  { id: 'elite', name: 'Elite Visual', image: '/templates/elite-preview.jpeg', category: 'Picture', isPremium: true },
  { id: 'profile', name: 'Profile Executive', image: '/templates/profile-preview.jpeg', category: 'Picture', isPremium: true },
  { id: 'ember-creative', name: 'Creative Ember', image: '/templates/ember-creative-preview.jpeg', category: 'Word', isPremium: true },
  { id: 'smart-resume', name: 'Smart Professional', image: '/templates/smart-resume-preview.jpeg', category: 'Word', isPremium: true },
  { id: 'minimal-cv', name: 'Minimal Professional CV', image: '/templates/minimal-cv-preview.jpeg', category: 'Two-column', isPremium: true },
  { id: 'prime-edge', name: 'Prime Edge', image: '/templates/prime-edge-preview.jpeg', category: 'Two-column', isPremium: true },
  { id: 'elitecraft-cv', name: 'EliteCraft', image: '/templates/elitecraft-cv-preview.jpeg', category: 'Two-column', isPremium: true },
  { id: 'executive-cv', name: 'Executive Visual CV', image: '/templates/executive-cv-preview.jpeg', category: 'Picture', isPremium: true },
  { id: 'pureform-resume', name: 'PureForm ATS', image: '/templates/pureform-resume-preview.jpeg', category: 'ATS', isPremium: true },
  { id: 'meridian-cv', name: 'Meridian Visual CV', image: '/templates/meridian-cv-preview.jpeg', category: 'Picture', isPremium: true },
  { id: 'elevare-cv', name: 'Elevare ATS', image: '/templates/elevare-cv-preview.jpeg', category: 'ATS', isPremium: true },
  { id: 'talentra-cv', name: 'Talentra Visual', image: '/templates/talentra-cv-preview.jpeg', category: 'Picture', isPremium: true },
  { id: 'boardline-cv', name: 'Boardline Visual', image: '/templates/boardline-cv-preview.jpeg', category: 'Picture', isPremium: true },
  { id: 'apex-resume', name: 'Apex Visual', image: '/templates/apex-resume-preview.jpeg', category: 'Picture', isPremium: true },
  { id: 'blueprint-resume', name: 'Blueprint Professional', image: '/templates/blueprint-resume-preview.jpeg', category: 'Word', isPremium: true },
  { id: 'technexa-resume', name: 'TechNexa', image: '/templates/technexa-resume-preview.jpeg', category: 'Two-column', isPremium: true },
  { id: 'stackpro-cv', name: 'StackPro ATS', image: '/templates/stackpro-cv-preview.jpeg', category: 'ATS', isPremium: true },
  { id: 'visualcraft-cv', name: 'VisualCraft Pro', image: '/templates/visualcraft-cv-preview.jpeg', category: 'Picture', isPremium: true },
  { id: 'designflux-resume', name: 'DesignFlux Professional', image: '/templates/designflux-resume-preview.jpeg', category: 'Word', isPremium: true },
  { id: 'elitepath-cv', name: 'ElitePath Visual', image: '/templates/elitepath-cv-preview.jpeg', category: 'Picture', isPremium: true },
  { id: 'imperial-cv', name: 'Imperial Professional', image: '/templates/imperial-cv-preview.jpeg', category: 'Two-column', isPremium: true },
  { id: 'corporate-atlas', name: 'Corporate Atlas', image: '/templates/corporate-atlas-preview.jpeg', category: 'Picture', isPremium: true },
  { id: 'executive_cv', name: 'Executive Minimal', image: '/templates/executive-cv-preview-img.jpeg', category: 'Word', isPremium: true },
  { id: 'artistry-resume', name: 'Artistry Professional', image: '/templates/artistry-resume-preview.jpeg', category: 'Word', isPremium: true },
  { id: 'pixel-aura', name: 'PixelAura', image: '/templates/pixel-aura-preview.jpeg', category: 'Two-column', isPremium: true },
  { id: 'design-smart', name: 'DesignSmart Professional', image: '/templates/design-smart-preview.jpeg', category: 'Word', isPremium: true },
  { id: 'career-elite', name: 'Career Elite', image: '/templates/career-elite-preview.jpeg', category: 'Picture', isPremium: true },
  { id: 'codepro-resume', name: 'CodePro', image: '/templates/codepro-resume-preview.jpeg', category: 'Two-column', isPremium: true },
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

const navItems = [
  { key: 'home', label: 'Home', icon: 'fa-solid fa-house' },
  { key: 'my-resumes', label: 'My Resume', icon: 'fa-solid fa-file-lines' },
  { key: 'my-cover-letters', label: 'My Cover Letters', icon: 'fa-solid fa-envelope' },
  { key: 'resume-templates', label: 'Resume Template', icon: 'fa-solid fa-layer-group' },
  { key: 'ats-score', label: 'ATS Score', icon: 'fa-solid fa-chart-bar' },
  { key: 'linkedin-score', label: 'LinkedIn Score', icon: 'fa-brands fa-linkedin' },
  { key: 'ebooks', label: 'E-Books', icon: 'fa-solid fa-book-open' },
  { key: 'profile', label: 'My Profile', icon: 'fa-solid fa-user' }, // ← ADD THIS
  { key: 'settings', label: 'Settings', icon: 'fa-solid fa-gear' },
];

const isPaidPlan = (p: string) => ['Trial', 'Basic', 'Advanced', 'Professional'].includes(p);
const getUpgradeAdPlan = (p: string) => {
  if (p === 'Free' || p === 'Trial') return { name: 'Basic', price: 399, desc: 'Unlock 1 premium resume download + all templates for 1 month' };
  if (p === 'Basic') return { name: 'Advanced', price: 499, desc: 'Get 3 resume downloads + priority support for 3 months' };
  if (p === 'Advanced') return { name: 'Professional', price: 999, desc: 'Unlock 5 downloads + 1 year access + all premium features' };
  return null;
};
const scoreColor = (s: number) => s >= 70 ? '#10b981' : s >= 50 ? '#f59e0b' : s >= 30 ? '#fb923c' : '#ef4444';
const scoreLabel = (s: number) => s >= 70 ? 'Excellent' : s >= 60 ? 'Good' : s >= 45 ? 'Average' : s >= 30 ? 'Below Average' : 'Needs Improvement';

// ─── Admin / Sales Profile ────────────────────────────────────────────────────
type AdminSection = 'profile' | 'dashboard' | 'billing' | 'delete-account';


const SimpleProfile: React.FC<{ user: UserType; onLogout: () => void }> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState<AdminSection>('profile');
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePwd, setShowDeletePwd] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCreateResumeModal, setShowCreateResumeModal] = useState(false);

  const saveProfile = async () => {
    if (!nameInput.trim()) { toast.error('Name required'); return; }
    if (!emailInput.trim()) { toast.error('Email required'); return; }
    setSavingProfile(true);
    try {
      const { data } = await api.put('/users/update-profile', { name: nameInput.trim(), email: emailInput.trim() });
      toast.success(data.message || 'Updated!');
      setIsEditingName(false); setIsEditingEmail(false);
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed'); }
    finally { setSavingProfile(false); }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword) { toast.error('Enter current password'); return; }
    if (passwordData.newPassword.length < 6) { toast.error('Min 6 chars'); return; }
    if (passwordData.newPassword !== passwordData.confirmPassword) { toast.error("Don't match"); return; }
    setChangingPassword(true);
    try {
      await api.put('/users/change-password', { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      toast.success('Changed! Logging out…');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => { dispatch(logout()); navigate('/login'); }, 1500);
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed'); }
    finally { setChangingPassword(false); }
  };

  const confirmDelete = async () => {
    setShowDeleteConfirmModal(false); setDeletingAccount(true);
    try {
      await api.delete('/users/delete-account', { data: { password: deletePassword } });
      toast.success('Deleted'); dispatch(logout()); navigate('/login');
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed'); }
    finally { setDeletingAccount(false); }
  };

  const handleDashboardNav = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'sales') {
      navigate('/sales/ats-checker');
    }
  };

  const sidebarLinks: { key: AdminSection; label: string; isExternal?: boolean }[] = [
    { key: 'profile', label: 'My Profile' },
    { key: 'dashboard', label: 'My Dashboard', isExternal: true },
    { key: 'billing', label: 'Subscription & Billing' },
    { key: 'delete-account', label: 'Delete Account' },
  ];




  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f8', fontFamily: 'inherit' }}>
      <style>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
      .sp-nav-btn:hover { background: #EDC9AF !important; color: #2c2a63 !important; }
        .sp-nav-btn-active:hover { background: #2c2a63 !important; color: #EDC9AF !important; }
      @media(max-width:768px) {
          .sp-header-title { font-size: 16px !important; }
          .sp-btn-home { padding: 6px 10px !important; font-size: 11px !important; gap: 4px !important; }
          .sp-btn-logout { padding: 6px 10px !important; font-size: 11px !important; gap: 4px !important; }
        }
        @media(max-width:600px) {
          .sp-header { flex-wrap: nowrap !important; gap: 8px !important; padding: 10px 12px !important; }
          .sp-header-title { font-size: 14px !important; }
          .sp-btn-home { padding: 5px 8px !important; font-size: 10px !important; }
          .sp-btn-logout { padding: 5px 8px !important; font-size: 10px !important; }
          .sp-layout { flex-direction: column !important; padding: 14px !important; }
          .sp-sidebar { width: 100% !important; }
          .sp-content { min-width: 0 !important; }
        }
        @media(max-width:400px) {
          .sp-header-title { display: none !important; }
          .sp-btn-home span { display: none; }
          .sp-btn-logout span { display: none; }
          .sp-btn-home { padding: 7px !important; }
          .sp-btn-logout { padding: 7px !important; }
        }
      `}</style>

      {/* Header */}
      <header className="sp-header" style={{ background: '#fff', borderBottom: 'none', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="sp-btn-home" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: BRAND, color: SAND, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
            <i className="fa-solid fa-house" style={{ fontSize: 12 }} /> Back to Home
          </button>
          <span className="sp-header-title" style={{ fontSize: 22, fontWeight: 800, color: BRAND }}>User Profile Settings</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button className="sp-btn-logout" onClick={() => setShowLogoutModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: BRAND, color: SAND, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
            <i className="fa-solid fa-right-from-bracket" style={{ fontSize: 12 }} /> Logout
          </button>
        </div>
      </header>

      <div className="sp-layout" style={{ display: 'flex', gap: 24, padding: '28px 32px', maxWidth: 1400, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

        {/* Left Sidebar */}
        <div className="sp-sidebar" style={{ width: 280, flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EDC9AF', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            {/* Avatar + name */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: BRAND, margin: '0 0 2px' }}>{user?.name}</p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 10px' }}>{user?.email}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 8, background: BRAND }}>
                <i className="fa-solid fa-crown" style={{ fontSize: 10, color: SAND }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: SAND }}>{isAdmin ? 'Admin' : 'Sales User'}</span>
              </div>
            </div>
            {/* Nav links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {sidebarLinks.map(({ key, label, isExternal }) => (
                <button key={key}
                  className={activeTab === key ? 'sp-nav-btn sp-nav-btn-active' : 'sp-nav-btn'}
                  onClick={() => isExternal ? handleDashboardNav() : setActiveTab(key)}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: activeTab === key ? 700 : 500, background: activeTab === key ? BRAND : 'transparent', color: activeTab === key ? SAND : '#374151', border: 'none', cursor: 'pointer', transition: 'background 0.15s', display: 'flex', alignItems: 'center' }}>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="sp-content" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EDC9AF', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>

            {/* ── MY PROFILE ── */}
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: BRAND, margin: '0 0 22px' }}>Personal Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {([
                    { label: 'Full Name', val: nameInput, setVal: setNameInput, isEdit: isEditingName, setEdit: setIsEditingName, reset: () => { setIsEditingName(false); setNameInput(user?.name || ''); }, type: 'text' },
                    { label: 'Email Address', val: emailInput, setVal: setEmailInput, isEdit: isEditingEmail, setEdit: setIsEditingEmail, reset: () => { setIsEditingEmail(false); setEmailInput(user?.email || ''); }, type: 'email' },
                  ] as any[]).map(({ label, val, setVal, isEdit, setEdit, reset, type }) => (
                    <div key={label}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}>{label}</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type={type} value={val} onChange={(e: any) => setVal(e.target.value)} readOnly={!isEdit}
                          style={{ flex: 1, padding: '11px 14px', borderRadius: 10, fontSize: 14, border: `1.5px solid ${isEdit ? BRAND : '#e5e7eb'}`, background: isEdit ? '#fff' : '#fafafa', outline: 'none', color: '#111' }} />
                        {!isEdit
                          ? <button onClick={() => setEdit(true)} style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid #e5e7eb', background: SAND_LIGHT, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <i className="fa-solid fa-pen" style={{ fontSize: 13, color: BRAND }} />
                          </button>
                          : <>
                            <button onClick={saveProfile} disabled={savingProfile} style={{ width: 38, height: 38, borderRadius: 10, border: 'none', background: '#d1fae5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <i className="fa-solid fa-check" style={{ fontSize: 13, color: '#059669' }} />
                            </button>
                            <button onClick={reset} style={{ width: 38, height: 38, borderRadius: 10, border: 'none', background: '#fee2e2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <i className="fa-solid fa-xmark" style={{ fontSize: 13, color: '#ef4444' }} />
                            </button>
                          </>}
                      </div>
                    </div>
                  ))}

                  {/* Mobile */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}>Mobile Number</label>
                    <input type="text" value={user?.mobile || 'Not provided'} readOnly
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, border: '1.5px solid #e5e7eb', background: '#fafafa', color: '#6b7280', boxSizing: 'border-box' }} />
                  </div>

                  {/* Change Password button */}
                  <div style={{ paddingTop: 8, borderTop: '1px solid #f5f5f5' }}>
                    <button onClick={() => setActiveTab('dashboard')}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
                      <i className="fa-solid fa-lock" style={{ fontSize: 12 }} /> Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── MY DASHBOARD (Change Password) ── */}
            {activeTab === 'dashboard' && (
              <div style={{ width: '100%' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: BRAND, margin: '0 0 22px' }}>Change Password</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {([
                    { label: 'Current Password', key: 'currentPassword', show: showCurrentPwd, toggle: () => setShowCurrentPwd(p => !p) },
                    { label: 'New Password', key: 'newPassword', show: showNewPwd, toggle: () => setShowNewPwd(p => !p) },
                    { label: 'Confirm New Password', key: 'confirmPassword', show: showConfirmPwd, toggle: () => setShowConfirmPwd(p => !p) },
                  ] as any[]).map(({ label, key, show, toggle }) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}>{label}</label>
                      <div style={{ position: 'relative' }}>
                        <input type={show ? 'text' : 'password'} value={(passwordData as any)[key]}
                          onChange={(e: any) => setPasswordData(p => ({ ...p, [key]: e.target.value }))}
                          placeholder={`Enter ${label.toLowerCase()}`}
                          style={{ width: '100%', padding: '11px 42px 11px 14px', borderRadius: 10, fontSize: 14, border: '1.5px solid #e5e7eb', outline: 'none', boxSizing: 'border-box' }} />
                        <button type="button" onClick={toggle} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                          <i className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'}`} style={{ fontSize: 14 }} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button onClick={handlePasswordChange} disabled={changingPassword}
                    style={{ padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer', opacity: changingPassword ? 0.6 : 1 }}>
                    {changingPassword ? 'Updating…' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}

            {/* ── SUBSCRIPTION & BILLING ── */}
            {activeTab === 'billing' && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: BRAND, margin: '0 0 22px' }}>Subscription & Billing</h2>
                <div style={{ background: '#f8f0ff', borderRadius: 16, border: '1px solid #e9d5ff', padding: '32px', textAlign: 'center', width: '100%' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <i className="fa-solid fa-crown" style={{ fontSize: 28, color: SAND }} />
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: BRAND, margin: '0 0 8px' }}>
                    {isAdmin ? 'Administrator Account' : 'Sales Account'}
                  </h3>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
                    {isAdmin
                      ? 'You have full access to all features and the admin dashboard.'
                      : 'You have access to the ATS Checker dashboard.'}
                  </p>
                </div>
              </div>
            )}

            {/* ── DELETE ACCOUNT ── */}
            {activeTab === 'delete-account' && (
              <div style={{ width: '100%' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: BRAND, margin: '0 0 22px' }}>Delete Account</h2>
                <div style={{ background: '#fff5f5', borderRadius: 16, border: '2px solid #fecaca', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 22 }}>
                    <div style={{ width: 48, height: 48, background: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: 20, color: '#fff' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: BRAND, marginBottom: 6 }}>Permanently Delete Your Account?</h3>
                      <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>This action is irreversible. All your resumes, data, personal data and subscription history will be permanently erased and you will lose access to all features.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, cursor: 'pointer' }}>
                      <input type="checkbox" checked={deleteConfirmed} onChange={e => setDeleteConfirmed(e.target.checked)} style={{ marginTop: 2, width: 15, height: 15, accentColor: '#ef4444' }} />
                      <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>I understand and want to permanently delete my account</span>
                    </label>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}>Enter your password to confirm</label>
                      <div style={{ position: 'relative' }}>
                        <input type={showDeletePwd ? 'text' : 'password'} value={deletePassword} onChange={e => setDeletePassword(e.target.value)} placeholder="Enter your password"
                          style={{ width: '100%', padding: '11px 42px 11px 14px', borderRadius: 10, fontSize: 14, border: '1.5px solid #fca5a5', outline: 'none', background: '#fff', boxSizing: 'border-box', color: '#111' }} />
                        <button onClick={() => setShowDeletePwd(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                          <i className={`fa-solid ${showDeletePwd ? 'fa-eye-slash' : 'fa-eye'}`} style={{ fontSize: 14 }} />
                        </button>
                      </div>
                    </div>

                    <>
                      <style>{`
    .delete-btn-row { display: flex; gap: 10px; }
    @media (max-width: 600px) {
      .delete-btn-row { flex-direction: column; }
      .delete-btn-row button { width: 100% !important; }
    }
  `}</style>
                      <div className="delete-btn-row">
                        <button onClick={() => { if (!deleteConfirmed || !deletePassword) { toast.error('Please confirm and enter password'); return; } setShowDeleteConfirmModal(true); }}
                          disabled={!deleteConfirmed || !deletePassword || deletingAccount}
                          style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: deleteConfirmed && deletePassword ? '#ef4444' : '#d1d5db', color: '#fff', border: 'none', cursor: deleteConfirmed && deletePassword ? 'pointer' : 'not-allowed', opacity: deletingAccount ? 0.6 : 1 }}>
                          {deletingAccount ? 'Deleting…' : 'Delete My Account Permanently'}
                        </button>
                        <button onClick={() => { setDeleteConfirmed(false); setDeletePassword(''); }}
                          style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: '#e5e7eb', color: '#374151', border: 'none', cursor: 'pointer' }}>
                          Cancel
                        </button>
                      </div>
                    </>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Create Resume Modal */}
      {showCreateResumeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 420, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, background: SAND_LIGHT, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <i className="fa-solid fa-file-lines" style={{ fontSize: 24, color: BRAND }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: BRAND, margin: '0 0 8px' }}>Create Your Resume</h3>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>Start fresh or upload an existing resume to get started.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <button
                onClick={() => { setShowCreateResumeModal(false); navigate('/app'); }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderRadius: 14, background: BRAND, color: SAND, border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(237,201,175,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: 18, color: SAND }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: SAND }}>Create from Scratch</p>
                  <p style={{ fontSize: 11, margin: 0, color: `${SAND}cc`, marginTop: 2 }}>Build a new resume using our builder</p>
                </div>
              </button>
              <button
                onClick={() => { setShowCreateResumeModal(false); navigate('/app?upload=true'); }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderRadius: 14, background: SAND_LIGHT, color: BRAND, border: `1.5px solid ${SAND}`, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: SAND, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="fa-solid fa-file-arrow-up" style={{ fontSize: 18, color: BRAND }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: BRAND }}>Upload Existing Resume</p>
                  <p style={{ fontSize: 11, margin: 0, color: '#6b7280', marginTop: 2 }}>Import your existing resume file</p>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowCreateResumeModal(false)}
              style={{ width: '100%', padding: '11px', borderRadius: 12, fontSize: 13, fontWeight: 600, background: '#f3f4f6', color: '#374151', border: 'none', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirm Modal */}
      {showLogoutModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 340, padding: 26, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <div style={{ width: 56, height: 56, background: SAND_LIGHT, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <i className="fa-solid fa-right-from-bracket" style={{ fontSize: 24, color: BRAND }} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: BRAND, marginBottom: 7 }}>Are you sure you want to logout?</h3>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>You will be redirected to the login page.</p>
            </div>
            <div style={{ display: 'flex', gap: 9 }}>
              <button onClick={onLogout}
                style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
                Yes, Logout
              </button>
              <button onClick={() => setShowLogoutModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: '#e5e7eb', color: '#374151', border: 'none', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirmModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 340, padding: 26, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <div style={{ width: 56, height: 56, background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: 24, color: '#ef4444' }} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: BRAND, marginBottom: 7 }}>Are you absolutely sure?</h3>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>This cannot be undone. All your data will be permanently removed.</p>
            </div>
            <div style={{ display: 'flex', gap: 9 }}>
              <button onClick={confirmDelete} style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}>Yes, Delete</button>
              <button onClick={() => setShowDeleteConfirmModal(false)} style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: '#e5e7eb', color: '#374151', border: 'none', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// ─── Main Component ───────────────────────────────────────────────────────────
const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s: RootState) => s.auth);

  const [activeSection, setActiveSection] = useState<ActiveSection>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const [allResumes, setAllResumes] = useState<Resume[]>([]);
  const [allCoverLetters, setAllCoverLetters] = useState<CoverLetter[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [linkedinScore, setLinkedinScore] = useState<number | null>(null);

  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [ebooksLoading, setEbooksLoading] = useState(false);
  const [premiumEbook, setPremiumEbook] = useState<Ebook | null>(null);
  const [showEbookUnlock, setShowEbookUnlock] = useState(false);

  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCreateResumeModal, setShowCreateResumeModal] = useState(false);

  const [showCreateCoverLetterModal, setShowCreateCoverLetterModal] = useState(false);
  const [showUploadResumeModal, setShowUploadResumeModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [newCoverLetterTitle, setNewCoverLetterTitle] = useState('');


  const [editResumeId, setEditResumeId] = useState('');
  const [editResumeTitle, setEditResumeTitle] = useState('');
  const [editCoverLetterId, setEditCoverLetterId] = useState('');
  const [editCoverLetterTitle, setEditCoverLetterTitle] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('All');

  const [nameInput, setNameInput] = useState(user?.name || '');
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [showDeletePwd, setShowDeletePwd] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // ── Bootstrap ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!document.getElementById('fa-cdn')) {
      const l = document.createElement('link');
      l.id = 'fa-cdn'; l.rel = 'stylesheet';
      l.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
      document.head.appendChild(l);
    }
    loadAll();
  }, []);

  useEffect(() => {
    if (activeSection === 'ebooks' && ebooks.length === 0) loadEbooks();
  }, [activeSection]);

  const loadEbooks = async () => {
    setEbooksLoading(true);
    try {
      const { data } = await api.get('/ebooks');
      setEbooks(data.ebooks || []);
    } catch { }
    finally { setEbooksLoading(false); }
  };

  const loadAll = async () => {
    setLoadingData(true);
    try {
      const [rr, cr, ur] = await Promise.allSettled([
        api.get('/users/resumes'), api.get('/cover-letters/all'), api.get('/users/data'),
      ]);
      if (rr.status === 'fulfilled') setAllResumes(rr.value.data.resumes || []);
      if (cr.status === 'fulfilled') setAllCoverLetters(cr.value.data.coverLetters || []);
      if (ur.status === 'fulfilled' && ur.value.data.user) {
        const u = ur.value.data.user;
        setUserData(u);
        setNameInput(u.name || '');
        setEmailInput(u.email || '');
        const dbAts = u.atsScore ?? u.lastAtsScore ?? null;
        if (dbAts !== null && dbAts !== undefined && !isNaN(Number(dbAts))) setAtsScore(Number(dbAts));
        const dbLi = u.linkedinScore ?? u.lastLinkedinScore ?? null;
        if (dbLi !== null && dbLi !== undefined && !isNaN(Number(dbLi))) setLinkedinScore(Number(dbLi));
      }
    } catch { }
    finally { setLoadingData(false); }
  };

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node))
        setProfileDropdown(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const currentPlan = userData?.plan || user?.plan || 'Free';
  const isPaid = isPaidPlan(currentPlan);
  const upgradeAd = getUpgradeAdPlan(currentPlan);
  const firstName = (user?.name || 'User').split(' ')[0].toUpperCase();
  const avatarLetters = (user?.name || 'U').slice(0, 2).toUpperCase();

  const filteredTemplates = selectedCategory === 'All'
    ? allTemplates
    : allTemplates.filter(t => t.category === selectedCategory);

  // ── Actions ──────────────────────────────────────────────────────────────────
  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    toast.success('Logged out successfully!');
    navigate('/login', { replace: true });
  };

  const nav = (key: string) => {
    setActiveSection(key as ActiveSection);
    setSidebarOpen(false);
  };

  const deleteResume = async (id: string) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await api.delete(`/resumes/delete/${id}`);
      setAllResumes(p => p.filter(r => r._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const updateResumeTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/resumes/update', { resumeId: editResumeId, resumeData: { title: editResumeTitle } });
      setAllResumes(p => p.map(r => r._id === editResumeId ? { ...r, title: editResumeTitle } : r));
      setEditResumeId('');
      toast.success('Updated');
    } catch { toast.error('Failed'); }
  };

  const deleteCoverLetter = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete?')) return;
    try {
      await api.delete(`/cover-letters/${id}`);
      setAllCoverLetters(p => p.filter(c => c._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const updateCoverLetterTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/cover-letters/${editCoverLetterId}`, { title: editCoverLetterTitle });
      setAllCoverLetters(p => p.map(c => c._id === editCoverLetterId ? { ...c, title: editCoverLetterTitle } : c));
      setEditCoverLetterId('');
      toast.success('Updated');
    } catch { toast.error('Failed'); }
  };

  const saveProfile = async () => {
    if (!nameInput.trim()) { toast.error('Name required'); return; }
    if (!emailInput.trim()) { toast.error('Email required'); return; }
    setSavingProfile(true);
    try {
      const { data } = await api.put('/users/update-profile', { name: nameInput.trim(), email: emailInput.trim() });
      toast.success(data.message || 'Updated!');
      setIsEditingName(false); setIsEditingEmail(false);
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed'); }
    finally { setSavingProfile(false); }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword) { toast.error('Enter current password'); return; }
    if (passwordData.newPassword.length < 6) { toast.error('Min 6 chars'); return; }
    if (passwordData.newPassword !== passwordData.confirmPassword) { toast.error("Don't match"); return; }
    setChangingPassword(true);
    try {
      await api.put('/users/change-password', { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      toast.success('Changed! Logging out…');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => { dispatch(logout()); navigate('/login'); }, 1500);
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed'); }
    finally { setChangingPassword(false); }
  };

  const confirmDelete = async () => {
    setShowDeleteConfirmModal(false); setDeletingAccount(true);
    try {
      await api.delete('/users/delete-account', { data: { password: deletePassword } });
      toast.success('Deleted'); dispatch(logout()); navigate('/login');
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed'); }
    finally { setDeletingAccount(false); }
  };

  const handleEbookOpen = (ebook: Ebook) => {
    if (ebook.isFree || isPaid) { window.open(ebook.pdfUrl, '_blank'); }
    else { setPremiumEbook(ebook); setShowEbookUnlock(true); }
  };

  // ── Admin / Sales guard ───────────────────────────────────────────────────────
  if (user?.role === 'admin' || user?.role === 'sales') {
    return <SimpleProfile user={user as UserType} onLogout={confirmLogout} />;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SIDEBAR
  // ─────────────────────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <aside style={{ width: 240, height: '100vh', background: BRAND, display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
      {/* Logo row */}
      <div style={{ padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', flexShrink: 0 }}>
        <button onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
          <img src="/Logo.png" alt="Career Logo" style={{ height: '50px', width: '180px', objectFit: 'cover' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
        </button>
        <button className="ub-close" onClick={() => setSidebarOpen(false)}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 6, display: 'none' }}>
          <i className="fa-solid fa-xmark" style={{ fontSize: 18 }} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto', minHeight: 0 }}>
        {navItems.map(({ key, label, icon }) => {
          const active = activeSection === key;
          return (
            <button key={key} onClick={() => nav(key)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 22px', fontSize: 13, fontWeight: active ? 700 : 500, background: active ? SAND : 'transparent', color: active ? BRAND : 'rgba(255,255,255,0.65)', border: 'none', borderRight: active ? `3px solid rgba(44,42,99,0.3)` : '3px solid transparent', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}>
              <i className={icon} style={{ fontSize: 14, width: 17 }} />{label}
            </button>
          );
        })}
      </nav>

      {/* Upgrade ad */}
      {upgradeAd && (
        <div style={{ margin: '0 12px 10px', borderRadius: 12, border: '1px solid rgba(237,201,175,0.25)', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ padding: '12px', background: 'rgba(237,201,175,0.1)' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: SAND, margin: '0 0 3px' }}>🚀 Boost Your Career</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: '0 0 8px', lineHeight: 1.4 }}>{upgradeAd.desc}</p>
            <button onClick={() => setShowPricingModal(true)}
              style={{ width: '100%', padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, background: SAND, color: BRAND, border: 'none', cursor: 'pointer' }}>
              Upgrade to {upgradeAd.name}
            </button>
          </div>
        </div>
      )}

      {/* Logout */}
      <button onClick={handleLogout}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 22px', width: '100%', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)', background: 'none', border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', flexShrink: 0 }}>
        <i className="fa-solid fa-right-from-bracket" style={{ fontSize: 13 }} />Logout
      </button>
    </aside>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // HEADER
  // ─────────────────────────────────────────────────────────────────────────────
  const Header = () => (
    <header style={{ position: 'sticky', top: 0, zIndex: 30, background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Hamburger */}
        <button className="ub-menu" onClick={() => setSidebarOpen(true)}
          style={{ padding: 8, borderRadius: 10, background: 'none', border: '1px solid #eee', cursor: 'pointer', display: 'none', flexShrink: 0 }}>
          <i className="fa-solid fa-bars" style={{ fontSize: 16, color: BRAND }} />
        </button>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 800, color: BRAND, margin: 0 }}>Welcome back, {firstName}! 👋</h1>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Here's your career journey today.</p>
        </div>
      </div>

      {/* Profile dropdown */}
      <div ref={profileDropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
        <button onClick={() => setProfileDropdown(p => !p)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px 6px 6px', borderRadius: 12, background: 'none', border: '1px solid #eee', cursor: 'pointer' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: SAND, flexShrink: 0 }}>{avatarLetters}</div>
          <div className="ub-hname">
            <p style={{ fontSize: 13, fontWeight: 700, color: BRAND, margin: 0 }}>{(user?.name || 'User').toUpperCase()}</p>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{user?.email || ''}</p>
          </div>
          <i className="fa-solid fa-chevron-down" style={{ fontSize: 11, color: '#9ca3af', transition: 'transform 0.2s', transform: profileDropdown ? 'rotate(180deg)' : 'none' }} />
        </button>

        {profileDropdown && (
          <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 200, background: '#fff', borderRadius: 14, boxShadow: '0 8px 28px rgba(0,0,0,0.12)', border: '1px solid #f0f0f0', padding: '8px 0', zIndex: 50 }}>
            <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid #f5f5f5', textAlign: 'center' }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: SAND, margin: '0 auto 8px' }}>{avatarLetters}</div>
              <p style={{ fontSize: 13, fontWeight: 700, color: BRAND, margin: 0 }}>{user?.name?.toUpperCase()}</p>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>{user?.email}</p>
            </div>
            {[
              { label: 'View Profile', icon: 'fa-solid fa-user', section: 'profile' },
              { label: 'Change Password', icon: 'fa-solid fa-lock', section: 'change-password' },
            ].map(({ label, icon, section }) => (
              <button key={label} onClick={() => { setActiveSection(section as ActiveSection); setProfileDropdown(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', fontSize: 13, color: '#374151', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <i className={icon} style={{ fontSize: 13, color: BRAND, width: 16 }} />{label}
              </button>
            ))}
            <div style={{ borderTop: '1px solid #f5f5f5', marginTop: 4 }}>
              <button onClick={handleLogout}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', fontSize: 13, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <i className="fa-solid fa-right-from-bracket" style={{ fontSize: 13, width: 16 }} />Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
  // ─────────────────────────────────────────────────────────────────────────────
  // HOME
  // ─────────────────────────────────────────────────────────────────────────────
  const HomeSection = () => {
    const stats = [
      { label: 'Total Resumes', val: String(allResumes.length), icon: 'fa-solid fa-file-lines', sub: 'Resumes created' },
      { label: 'ATS Score', val: atsScore !== null ? String(atsScore) : '—', icon: 'fa-solid fa-chart-bar', sub: atsScore !== null ? scoreLabel(atsScore) : 'Not checked yet' },
      { label: 'LinkedIn Score', val: linkedinScore !== null ? String(linkedinScore) : '—', icon: 'fa-brands fa-linkedin', sub: linkedinScore !== null ? scoreLabel(linkedinScore) : 'Not checked yet' },
      { label: 'E-Books', val: String(ebooks.length || 0), icon: 'fa-solid fa-book-open', sub: isPaid ? 'Keep Learning' : 'Some free, some premium' },
    ];
    const quick = [
      { label: 'My Resume', icon: 'fa-solid fa-file-lines', s: 'my-resumes', d: 'View & edit your resumes' },
      { label: 'Cover Letters', icon: 'fa-solid fa-envelope', s: 'my-cover-letters', d: 'Create & manage cover letters' },
      { label: 'Templates', icon: 'fa-solid fa-layer-group', s: 'resume-templates', d: 'Choose from 50+ templates' },
      { label: 'ATS Score', icon: 'fa-solid fa-chart-bar', s: 'ats-score', d: 'Check your ATS score' },
      { label: 'LinkedIn Score', icon: 'fa-brands fa-linkedin', s: 'linkedin-score', d: 'Analyze your LinkedIn' },
      { label: 'E-Books', icon: 'fa-solid fa-book-open', s: 'ebooks', d: 'Read & grow your career' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Stats */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {stats.map(({ label, val, icon, sub }) => (
            <div key={label} style={{ background: '#fff', borderRadius: 16, padding: '16px', border: '1px solid #f0f0f0' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: SAND_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <i className={icon} style={{ fontSize: 18, color: BRAND }} />
              </div>
              <p style={{ fontSize: 28, fontWeight: 900, color: BRAND, margin: 0, lineHeight: 1 }}>{val}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', margin: '4px 0 2px' }}>{label}</p>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Quick Access */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px', border: '1px solid #f0f0f0' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: BRAND, margin: '0 0 12px' }}>Quick Access</h2>
          <div className="quick-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
            {quick.map(({ label, icon, s, d }) => (
              <button key={label} onClick={() => nav(s)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 6px', borderRadius: 14, background: '#fff', border: '1px solid #f0f0f0', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: SAND_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={icon} style={{ fontSize: 18, color: BRAND }} />
                </div>
                <p style={{ fontSize: 12, fontWeight: 600, color: BRAND, margin: 0 }}>{label}</p>
                <p style={{ fontSize: 10, color: '#9ca3af', margin: 0, lineHeight: 1.3 }}>{d}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Banner */}
        <div style={{ borderRadius: 16, padding: '12px 22px', background: '#fff', border: '1px solid #e8f0fe', display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: `${BRAND}80`, marginBottom: 4 }}>Career Growth</p>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: BRAND, margin: '0 0 6px' }}>Unlock Your Dream Job ✨</h3>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 16px', lineHeight: 1.6 }}>Get expert resources, proven strategies and AI tools to stand out.</p>
            <button onClick={() => navigate('/')}
              style={{ padding: '9px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
              Explore Now
            </button>
          </div>
          <img src="/assets/Services/resume-banner.jpg" alt="" style={{ width: 180, height: 180, objectFit: 'contain', opacity: 0.9, flexShrink: 0 }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
        </div>

        {/* Upgrade ad */}
        {upgradeAd && (
          <div style={{ borderRadius: 16, padding: '18px 22px', background: BRAND, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <i className="fa-solid fa-crown" style={{ fontSize: 28, color: SAND, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 160 }}>
              <p style={{ fontWeight: 800, color: '#fff', margin: 0, fontSize: 15 }}>Upgrade to {upgradeAd.name} Plan</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: '3px 0 0' }}>{upgradeAd.desc}</p>
            </div>
            <button onClick={() => setShowPricingModal(true)}
              style={{ padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: SAND, color: BRAND, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              Upgrade — ₹{upgradeAd.price}
            </button>
          </div>
        )}
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RESUME CARD
  // ─────────────────────────────────────────────────────────────────────────────
  const ResumeCard = ({ resume, onEdit, onDelete }: { resume: Resume; onEdit: () => void; onDelete: () => void; }) => {
    const preview = resume.template
      ? (templatePreviews[resume.template] || templatePreviews['digital-pro'])
      : templatePreviews['digital-pro'];
    const dateStr = new Date(resume.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
      <div className="rc" onClick={() => navigate(`/app/builder/${resume._id}`)}
        style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #e8eaf0', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
        <div style={{ height: 200, overflow: 'hidden', background: '#f8f9fb' }}>
          <img src={preview} alt={resume.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.3s' }} />
        </div>
        <div style={{ padding: '8px 12px 0', display: 'flex', gap: 4 }}>
          {DOT_COLORS.map(c => <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, display: 'inline-block' }} />)}
        </div>
        <div style={{ padding: '5px 12px 12px' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: BRAND, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resume.title}</p>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 8px' }}>Updated on {dateStr}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: 7 }}>
              {!resume.adminCreated && <>
                <button onClick={onEdit}
                  style={{ width: 30, height: 30, borderRadius: 8, background: SAND_LIGHT, border: `1px solid ${SAND}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-pen" style={{ fontSize: 11, color: BRAND }} />
                </button>
                <button onClick={onDelete}
                  style={{ width: 30, height: 30, borderRadius: 8, background: SAND_LIGHT, border: `1px solid ${SAND}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-trash" style={{ fontSize: 11, color: BRAND }} />
                </button>
              </>}
            </div>
            <button onClick={e => { e.stopPropagation(); navigate(`/app/builder/${resume._id}`); }}
              style={{ padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
              PDF
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // COVER LETTER CARD
  // ─────────────────────────────────────────────────────────────────────────────
  const CoverLetterCard = ({ cl, onEdit, onDelete }: { cl: CoverLetter; onEdit: () => void; onDelete: () => void; }) => {
    const dateStr = new Date(cl.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
      <div className="rc" onClick={() => navigate(`/app/cover-letter/builder/${cl._id}`)}
        style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #e8eaf0', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
        <div style={{ height: 200, overflow: 'hidden', background: '#f8f9fb' }}>
          <img src="/assets/Services/cover-letter-preview.jpeg" alt={cl.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        </div>
        <div style={{ padding: '8px 12px 0', display: 'flex', gap: 4 }}>
          {DOT_COLORS.map(c => <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, display: 'inline-block' }} />)}
        </div>
        <div style={{ padding: '5px 12px 12px' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: BRAND, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cl.title}</p>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 8px' }}>Updated on {dateStr}</p>
          <div style={{ display: 'flex', gap: 7 }} onClick={e => e.stopPropagation()}>
            <button onClick={onEdit}
              style={{ width: 30, height: 30, borderRadius: 8, background: SAND_LIGHT, border: `1px solid ${SAND}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-pen" style={{ fontSize: 11, color: BRAND }} />
            </button>
            <button onClick={onDelete}
              style={{ width: 30, height: 30, borderRadius: 8, background: SAND_LIGHT, border: `1px solid ${SAND}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-trash" style={{ fontSize: 11, color: BRAND }} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // MY RESUMES
  // ─────────────────────────────────────────────────────────────────────────────
  const MyResumesSection = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: BRAND, margin: 0 }}>My Resumes</h2>
        <button onClick={() => setShowCreateResumeModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
          <i className="fa-solid fa-plus" /> Create New
        </button>
      </div>

      {allResumes.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 18, border: `2px dashed ${SAND}`, padding: '56px 24px', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: SAND_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <i className="fa-solid fa-file-lines" style={{ fontSize: 26, color: BRAND }} />
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: BRAND, marginBottom: 7 }}>No resumes yet</h3>
          <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 20 }}>Create your first resume to get started on your career journey</p>
          <button onClick={() => setShowCreateResumeModal(true)}
            style={{ padding: '10px 22px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
            <i className="fa-solid fa-plus" style={{ marginRight: 6 }} />Start from Scratch
          </button>
        </div>
      ) : (
        <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(175px,1fr))', gap: 16 }}>
          {allResumes.map(r => (
            <ResumeCard key={r._id} resume={r}
              onEdit={() => { setEditResumeId(r._id); setEditResumeTitle(r.title); }}
              onDelete={() => deleteResume(r._id)} />
          ))}
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // MY COVER LETTERS
  // ─────────────────────────────────────────────────────────────────────────────
  const MyCoverLettersSection = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: BRAND, margin: 0 }}>My Cover Letters</h2>
        <button onClick={() => setShowCreateCoverLetterModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
          <i className="fa-solid fa-plus" /> Create New
        </button>
      </div>

      {allCoverLetters.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 18, border: `2px dashed ${SAND}`, padding: '56px 24px', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: SAND_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <i className="fa-solid fa-envelope" style={{ fontSize: 26, color: BRAND }} />
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: BRAND, marginBottom: 7 }}>No cover letters yet</h3>
          <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 20 }}>Create a compelling cover letter to stand out from the crowd</p>
          <button onClick={() => setShowCreateCoverLetterModal(true)}
            style={{ padding: '10px 22px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
            <i className="fa-solid fa-plus" style={{ marginRight: 6 }} />Create Cover Letter
          </button>
        </div>
      ) : (
        <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(175px,1fr))', gap: 16 }}>
          {allCoverLetters.map(cl => (
            <CoverLetterCard key={cl._id} cl={cl}
              onEdit={() => { setEditCoverLetterId(cl._id); setEditCoverLetterTitle(cl.title); }}
              onDelete={() => deleteCoverLetter(cl._id)} />
          ))}
        </div>
      )}
    </div>
  );
  // ─────────────────────────────────────────────────────────────────────────────
  // RESUME TEMPLATES
  // ─────────────────────────────────────────────────────────────────────────────
  const ResumeTemplatesSection = () => {
    const cats = ['All', 'Simple', 'Word', 'ATS', 'Picture', 'Two-column'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: BRAND, margin: '0 0 4px' }}>Resume Templates</h2>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Choose from professionally designed templates.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
          <i className="fa-solid fa-filter" style={{ fontSize: 13, color: BRAND }} />
          {cats.map(c => (
            <button key={c} onClick={() => setSelectedCategory(c)}
              style={{ padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: selectedCategory === c ? BRAND : '#fff', color: selectedCategory === c ? SAND : '#6b7280', border: `1.5px solid ${selectedCategory === c ? BRAND : '#e5e7eb'}`, transition: 'all 0.15s' }}>
              {c}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9ca3af' }}>{filteredTemplates.length} templates</span>
        </div>
        <div className="tpl-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 }}>
          {filteredTemplates.map((t, index) => (
            <div key={t.id} className="rc"
              onClick={async () => {
                try {
                  const { data } = await api.post('/resumes/create', { title: `${t.name} Resume`, template: t.id });
                  navigate(`/app/builder/${data.resume._id}`);
                } catch { toast.error('Failed to create resume'); }
              }}
              style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #f0f0f0', cursor: 'pointer', animationDelay: `${index * 0.03}s` }}>
              <div style={{ position: 'relative', height: 190, background: '#f9f9f9' }}>
                <img src={t.image} alt={t.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.3s' }} />
                {t.isPremium && (
                  <div style={{ position: 'absolute', top: 7, right: 7, width: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
                    <i className="fa-solid fa-crown" style={{ fontSize: 12, color: '#D4AF37' }} />
                  </div>
                )}
                <div className="tpl-hover-overlay"
                  style={{ position: 'absolute', inset: 0, background: 'rgba(237,201,175,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: 0, transition: 'opacity 0.3s' }}>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        const { data } = await api.post('/resumes/create', { title: `${t.name} Resume`, template: t.id });
                        navigate(`/app/builder/${data.resume._id}`);
                      } catch { toast.error('Failed to create resume'); }
                    }}
                    style={{ padding: '7px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
                    Use Template
                  </button>
                  <p style={{ fontSize: 10, fontWeight: 600, color: BRAND, margin: 0 }}>
                    {(templateMeta[t.id]?.users ?? 10000).toLocaleString()}+ users
                  </p>
                </div>
              </div>
              <div style={{ padding: '7px 10px 0', display: 'flex', gap: 3 }}>
                {DOT_COLORS.map(c => <span key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c, display: 'inline-block' }} />)}
              </div>
              <div style={{ padding: '3px 10px 10px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: BRAND, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</p>
                <p style={{ fontSize: 10, color: '#333', margin: '0 0 3px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                  {templateMeta[t.id]?.description || t.category}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, color: '#9ca3af' }}>{t.category}</span>
                  <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: '#6B7280', color: '#fff', fontWeight: 700 }}>PDF</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // ATS SCORE SECTION
  // ─────────────────────────────────────────────────────────────────────────────
  const ATSScoreSection = () => {
    if (loadingData) return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 30, color: BRAND }} />
      </div>
    );

    if (atsScore === null) return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #f0f0f0', maxWidth: 680, width: '100%', overflow: 'hidden' }}>
          <div style={{ padding: '48px 40px', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ width: 160, height: 160, background: 'linear-gradient(135deg,#f0f4ff,#e8f0fe)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 88, height: 110, background: '#fff', borderRadius: 10, boxShadow: '0 6px 20px rgba(44,42,99,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 10px' }}>
                <div style={{ width: 52, height: 7, background: SAND, borderRadius: 4 }} />
                <div style={{ width: 40, height: 5, background: '#e5e7eb', borderRadius: 4 }} />
                <div style={{ width: 46, height: 5, background: '#e5e7eb', borderRadius: 4 }} />
                <div style={{ width: 36, height: 5, background: '#e5e7eb', borderRadius: 4 }} />
                <div style={{ width: 44, height: 5, background: '#e5e7eb', borderRadius: 4 }} />
                <div style={{ width: 38, height: 5, background: '#e5e7eb', borderRadius: 4 }} />
              </div>
              <div style={{ position: 'absolute', bottom: -10, right: -10, width: 44, height: 44, borderRadius: '50%', background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(44,42,99,0.3)' }}>
                <i className="fa-solid fa-magnifying-glass" style={{ fontSize: 18, color: SAND }} />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: BRAND, marginBottom: 8 }}>Check Your ATS Score</h3>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, margin: '0 0 20px' }}>Get a detailed analysis of your resume and find out how well it performs in Applicant Tracking Systems.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {[
                  { icon: 'fa-solid fa-bolt', label: 'Instant Analysis', desc: 'Get your ATS score within seconds' },
                  { icon: 'fa-solid fa-file-lines', label: 'Detailed Report', desc: "See what's good and what can be improved" },
                  { icon: 'fa-solid fa-arrow-trend-up', label: 'Improve Your Chances', desc: 'Optimize your resume and get more interviews' },
                ].map(({ icon, label, desc }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: SAND_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={icon} style={{ fontSize: 15, color: BRAND }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: BRAND, margin: 0 }}>{label}</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/ats-checker')}
                style={{ padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
                <i className="fa-solid fa-chart-bar" style={{ marginRight: 8 }} />Check My ATS Score
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    const sc = scoreColor(atsScore);
    const sl = scoreLabel(atsScore);
    const circ = 2 * Math.PI * 54;
    const fill = (atsScore / 100) * circ;

    const breakdown = [
      { label: 'Format', desc: 'Proper formatting, headings, bullet points, etc.', val: Math.min(100, atsScore + 5), color: '#10b981', icon: 'fa-solid fa-align-left' },
      { label: 'Keywords', desc: 'Relevant keywords matching the job description.', val: Math.min(100, atsScore + 8), color: '#10b981', icon: 'fa-solid fa-key' },
      { label: 'Skills', desc: 'Technical and soft skills match.', val: Math.max(50, atsScore - 5), color: '#f59e0b', icon: 'fa-solid fa-star' },
      { label: 'Content', desc: 'Quality, relevance and clarity of content.', val: Math.max(50, atsScore - 3), color: '#3b82f6', icon: 'fa-solid fa-file-lines' },
      { label: 'Experience', desc: 'Work experience relevance and impact.', val: Math.min(100, atsScore + 3), color: '#10b981', icon: 'fa-solid fa-briefcase' },
    ];

    const getScoreTag = (v: number) => v >= 80 ? 'Excellent' : v >= 60 ? 'Good' : 'Average';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: BRAND, margin: '0 0 2px' }}>ATS Score Report</h2>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>See how well your resume is optimized for Applicant Tracking Systems.</p>
        </div>

        {/* Top summary */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #f5f5f5', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: SAND_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="fa-solid fa-file-lines" style={{ fontSize: 20, color: BRAND }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: BRAND, margin: 0 }}>Your Resume</p>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>Last checked: Recently</p>
              </div>
            </div>
            <button onClick={() => navigate('/ats-checker')}
              style={{ padding: '8px 20px', borderRadius: 10, fontSize: 12, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              Re-check Score
            </button>
          </div>

          {/* Sub-scores */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr) auto', alignItems: 'center', padding: '16px 20px', gap: 12, overflowX: 'auto' }}>
            {breakdown.slice(0, 4).map(b => (
              <div key={b.label} style={{ textAlign: 'center', minWidth: 80 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 4 }}>
                  <i className={b.icon} style={{ fontSize: 12, color: b.color }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280' }}>{b.label}</span>
                </div>
                <p style={{ fontSize: 22, fontWeight: 900, color: b.color, margin: '0 0 2px', lineHeight: 1 }}>
                  {b.val}<span style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af' }}>/100</span>
                </p>
                <span style={{
                  display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                  background: b.val >= 80 ? '#d1fae5' : b.val >= 60 ? '#fef3c7' : '#fee2e2',
                  color: b.val >= 80 ? '#059669' : b.val >= 60 ? '#d97706' : '#dc2626'
                }}>
                  {getScoreTag(b.val)}
                </span>
              </div>
            ))}
            {/* Overall */}
            <div style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: 20, textAlign: 'center', minWidth: 90, flexShrink: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', margin: '0 0 4px' }}>Overall Score</p>
              <p style={{ fontSize: 30, fontWeight: 900, color: sc, margin: '0 0 2px', lineHeight: 1 }}>
                {atsScore}<span style={{ fontSize: 14, fontWeight: 500, color: '#9ca3af' }}>/100</span>
              </p>
              <span style={{
                display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 4,
                background: atsScore >= 70 ? '#d1fae5' : atsScore >= 50 ? '#fef3c7' : '#fee2e2', color: sc
              }}>
                {sl}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom 3 panels */}
        <div className="ats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>

          {/* Donut */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #f0f0f0' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: BRAND, margin: '0 0 16px' }}>Score Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative', width: 130, height: 130 }}>
                <svg width="130" height="130" viewBox="0 0 130 130">
                  <circle cx="65" cy="65" r="54" fill="none" stroke="#f3f4f6" strokeWidth="11" />
                  <circle cx="65" cy="65" r="54" fill="none" stroke={sc} strokeWidth="11" strokeLinecap="round"
                    strokeDasharray={`${circ}`} strokeDashoffset={circ - fill}
                    style={{ transformOrigin: '65px 65px', transform: 'rotate(-90deg)', transition: 'stroke-dashoffset 0.8s ease' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: BRAND, lineHeight: 1 }}>{atsScore}</span>
                  <span style={{ fontSize: 11, color: sc, fontWeight: 700 }}>{sl}</span>
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
                Your resume is {atsScore >= 70 ? 'well-optimized' : 'partially optimized'} for ATS systems.
              </p>
              {atsScore >= 70 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: '#d1fae5' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: '#059669', fontSize: 13 }} />
                  <span style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>You're in the top 20% of users!</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: '#fef3c7' }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ color: '#d97706', fontSize: 13 }} />
                  <span style={{ fontSize: 12, color: '#d97706', fontWeight: 700 }}>Keep improving to rank higher!</span>
                </div>
              )}
            </div>
          </div>

          {/* Breakdown bars */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #f0f0f0' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: BRAND, margin: '0 0 16px' }}>Score Breakdown</h3>
            {breakdown.map(({ label, desc, val, color }) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: 0 }}>{label}</p>
                    <p style={{ fontSize: 10, color: '#9ca3af', margin: '1px 0 0', lineHeight: 1.3 }}>{desc}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color, flexShrink: 0, marginLeft: 8 }}>
                    {val}<span style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af' }}>/100</span>
                  </span>
                </div>
                <div style={{ height: 6, background: '#f3f4f6', borderRadius: 999 }}>
                  <div style={{ height: '100%', borderRadius: 999, background: color, width: `${val}%`, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-regular fa-lightbulb" style={{ fontSize: 16, color: '#f59e0b' }} />
              </div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: BRAND, margin: 0 }}>Top Suggestions</h3>
            </div>
            {[
              'Add more industry-specific keywords from the job description.',
              'Quantify your achievements with numbers and metrics.',
              'Include more relevant skills to increase your score.',
              'Ensure consistent formatting throughout your resume.',
              'Use action verbs to make your experience more impactful.',
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: SAND_LIGHT, border: `1px solid ${SAND}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: BRAND }}>{i + 1}</span>
                </div>
                <p style={{ fontSize: 12, color: '#374151', margin: 0, lineHeight: 1.55 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // LINKEDIN SCORE SECTION
  // ─────────────────────────────────────────────────────────────────────────────
  const LinkedInScoreSection = () => {
    if (loadingData) return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 30, color: BRAND }} />
      </div>
    );

    if (linkedinScore === null) return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #f0f0f0', maxWidth: 680, width: '100%', overflow: 'hidden' }}>
          <div style={{ padding: '48px 40px', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ width: 160, height: 160, background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 88, height: 88, borderRadius: 16, background: '#fff', boxShadow: '0 6px 20px rgba(44,42,99,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-brands fa-linkedin" style={{ fontSize: 48, color: BRAND }} />
              </div>
              <div style={{ position: 'absolute', bottom: -10, right: -10, width: 44, height: 44, borderRadius: '50%', background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(44,42,99,0.3)' }}>
                <i className="fa-solid fa-magnifying-glass" style={{ fontSize: 18, color: SAND }} />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: BRAND, marginBottom: 8 }}>Check Your LinkedIn Score</h3>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, margin: '0 0 20px' }}>Get a detailed analysis of your LinkedIn profile and find out how well it performs with recruiters.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {[
                  { icon: 'fa-solid fa-bolt', label: 'Instant Analysis', desc: 'Get your LinkedIn score within seconds' },
                  { icon: 'fa-solid fa-chart-pie', label: 'Detailed Report', desc: 'See each section individually analyzed' },
                  { icon: 'fa-solid fa-arrow-trend-up', label: 'Boost Visibility', desc: 'Optimize and get more recruiter views' },
                ].map(({ icon, label, desc }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: SAND_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={icon} style={{ fontSize: 15, color: BRAND }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: BRAND, margin: 0 }}>{label}</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/linkedin-checker')}
                style={{ padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
                <i className="fa-brands fa-linkedin" style={{ marginRight: 8 }} />Check My LinkedIn Score
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    const sc = scoreColor(linkedinScore);
    const sl = scoreLabel(linkedinScore);
    const circ = 2 * Math.PI * 54;
    const fill = (linkedinScore / 100) * circ;

    const breakdown2 = [
      { label: 'Profile', desc: 'All sections filled out and optimized.', val: Math.min(100, linkedinScore + 10), color: '#10b981', icon: 'fa-solid fa-user' },
      { label: 'Keywords', desc: 'Keywords that match recruiter searches.', val: Math.max(20, linkedinScore - 15), color: '#3b82f6', icon: 'fa-solid fa-magnifying-glass' },
      { label: 'Headline', desc: 'How compelling your headline is to recruiters.', val: Math.min(100, linkedinScore + 5), color: '#10b981', icon: 'fa-solid fa-heading' },
      { label: 'About', desc: 'Quality and depth of your summary.', val: Math.max(20, linkedinScore - 20), color: '#f59e0b', icon: 'fa-solid fa-align-left' },
      { label: 'Experience', desc: 'Clarity and impact of your work experience.', val: Math.min(100, linkedinScore + 3), color: '#10b981', icon: 'fa-solid fa-briefcase' },
    ];

    const getScoreTag = (v: number) => v >= 80 ? 'Excellent' : v >= 60 ? 'Good' : 'Average';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: BRAND, margin: '0 0 2px' }}>LinkedIn Score Report</h2>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>See how well your LinkedIn profile performs with recruiters.</p>
        </div>

        {/* Top summary */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #f5f5f5', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: SAND_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="fa-brands fa-linkedin" style={{ fontSize: 22, color: BRAND }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: BRAND, margin: 0 }}>Your LinkedIn Profile</p>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>Last checked: Recently</p>
              </div>
            </div>
            <button onClick={() => navigate('/linkedin-checker')}
              style={{ padding: '8px 20px', borderRadius: 10, fontSize: 12, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              Re-check Score
            </button>
          </div>

          {/* Sub-scores */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr) auto', alignItems: 'center', padding: '16px 20px', gap: 12, overflowX: 'auto' }}>
            {breakdown2.slice(0, 4).map(b => (
              <div key={b.label} style={{ textAlign: 'center', minWidth: 80 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 4 }}>
                  <i className={b.icon} style={{ fontSize: 12, color: b.color }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280' }}>{b.label}</span>
                </div>
                <p style={{ fontSize: 22, fontWeight: 900, color: b.color, margin: '0 0 2px', lineHeight: 1 }}>
                  {b.val}<span style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af' }}>/100</span>
                </p>
                <span style={{
                  display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                  background: b.val >= 80 ? '#d1fae5' : b.val >= 60 ? '#fef3c7' : '#fee2e2',
                  color: b.val >= 80 ? '#059669' : b.val >= 60 ? '#d97706' : '#dc2626'
                }}>
                  {getScoreTag(b.val)}
                </span>
              </div>
            ))}
            {/* Overall */}
            <div style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: 20, textAlign: 'center', minWidth: 90, flexShrink: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', margin: '0 0 4px' }}>Overall Score</p>
              <p style={{ fontSize: 30, fontWeight: 900, color: sc, margin: '0 0 2px', lineHeight: 1 }}>
                {linkedinScore}<span style={{ fontSize: 14, fontWeight: 500, color: '#9ca3af' }}>/100</span>
              </p>
              <span style={{
                display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 4,
                background: linkedinScore >= 70 ? '#d1fae5' : linkedinScore >= 50 ? '#fef3c7' : '#fee2e2', color: sc
              }}>
                {sl}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom 3 panels */}
        <div className="ats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>

          {/* Donut */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #f0f0f0' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: BRAND, margin: '0 0 16px' }}>Score Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative', width: 130, height: 130 }}>
                <svg width="130" height="130" viewBox="0 0 130 130">
                  <circle cx="65" cy="65" r="54" fill="none" stroke="#f3f4f6" strokeWidth="11" />
                  <circle cx="65" cy="65" r="54" fill="none" stroke={sc} strokeWidth="11" strokeLinecap="round"
                    strokeDasharray={`${circ}`} strokeDashoffset={circ - fill}
                    style={{ transformOrigin: '65px 65px', transform: 'rotate(-90deg)', transition: 'stroke-dashoffset 0.8s ease' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: BRAND, lineHeight: 1 }}>{linkedinScore}</span>
                  <span style={{ fontSize: 11, color: sc, fontWeight: 700 }}>{sl}</span>
                </div>
              </div>
              <span style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#fff', background: sc }}>{sl}</span>
              {linkedinScore >= 70 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: '#d1fae5' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: '#059669', fontSize: 13 }} />
                  <span style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>Top 20% of users!</span>
                </div>
              )}
            </div>
          </div>

          {/* Breakdown bars */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #f0f0f0' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: BRAND, margin: '0 0 16px' }}>Profile Strength Breakdown</h3>
            {breakdown2.map(({ label, desc, val, color }) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: 0 }}>{label}</p>
                    <p style={{ fontSize: 10, color: '#9ca3af', margin: '1px 0 0', lineHeight: 1.3 }}>{desc}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color, flexShrink: 0, marginLeft: 8 }}>
                    {val}<span style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af' }}>/100</span>
                  </span>
                </div>
                <div style={{ height: 6, background: '#f3f4f6', borderRadius: 999 }}>
                  <div style={{ height: '100%', borderRadius: 999, background: color, width: `${val}%`, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-regular fa-lightbulb" style={{ fontSize: 16, color: '#f59e0b' }} />
              </div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: BRAND, margin: 0 }}>Top Suggestions</h3>
            </div>
            {[
              'Add a compelling headline with relevant keywords.',
              'Complete all profile sections for higher visibility.',
              'Add industry-specific skills to your profile.',
              'Request recommendations from colleagues or managers.',
              'Post regular content to boost profile engagement.',
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: SAND_LIGHT, border: `1px solid ${SAND}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: BRAND }}>{i + 1}</span>
                </div>
                <p style={{ fontSize: 12, color: '#374151', margin: 0, lineHeight: 1.55 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  // ─────────────────────────────────────────────────────────────────────────────
  // E-BOOKS SECTION
  // ─────────────────────────────────────────────────────────────────────────────
  const EBooksSection = () => {
    if (ebooksLoading) return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 30, color: BRAND }} />
      </div>
    );

    if (ebooks.length === 0) return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #f0f0f0', maxWidth: 480, width: '100%' }}>
          <div style={{ padding: '36px 24px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <i className="fa-solid fa-book-open" style={{ fontSize: 28, color: SAND }} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: BRAND, marginBottom: 7 }}>No E-Books Available</h3>
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: '0 auto', maxWidth: 340 }}>Career e-books will appear here once they're added. Check back soon!</p>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: BRAND, margin: '0 0 4px' }}>E-Books</h2>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Discover valuable guides to grow your career.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ebooks.map(ebook => {
            const canAccess = ebook.isFree || isPaid;
            const accentColor = ebook.color || BRAND;

            return (
              <div key={ebook._id} className="ebook-card"
                style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', display: 'flex', minHeight: 200 }}>

                {/* ── Left cover panel with circle bg ── */}
                <div className="ebook-cover"
                  style={{ width: 220, minWidth: 220, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', flexShrink: 0, background: `${accentColor}08`, overflow: 'hidden' }}>

                  {/* Circle decorative bg */}
                  <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: `${accentColor}15`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 0 }} />
                  <div style={{ position: 'absolute', width: 130, height: 130, borderRadius: '50%', background: `${accentColor}20`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 0 }} />

                  {/* Badge */}
                  <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 800, letterSpacing: '0.05em', padding: '4px 10px', borderRadius: 6,
                      background: ebook.isFree ? SAND : BRAND,
                      color: ebook.isFree ? BRAND : SAND
                    }}>
                      {!ebook.isFree && <i className="fa-solid fa-crown" style={{ fontSize: 9 }} />}
                      {ebook.isFree ? 'FREE' : 'PREMIUM'}
                    </span>
                  </div>

                  {/* Book mockup */}
                  <div style={{ position: 'relative', zIndex: 1, marginTop: 8 }}>
                    {ebook.coverImage ? (
                      <div style={{ position: 'relative' }}>
                        <img src={ebook.coverImage} alt={ebook.title}
                          style={{ width: 110, height: 140, objectFit: 'cover', borderRadius: 8, boxShadow: `4px 6px 20px rgba(0,0,0,0.18), -2px 0 0 ${accentColor}40` }} />
                        <div style={{ position: 'absolute', left: -6, top: 4, width: 10, height: 'calc(100% - 8px)', background: accentColor, borderRadius: '4px 0 0 4px', opacity: 0.7 }} />
                      </div>
                    ) : (
                      <div style={{ width: 110, height: 140, background: `linear-gradient(145deg, ${accentColor}, ${accentColor}cc)`, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, boxShadow: `4px 6px 20px rgba(0,0,0,0.18)`, position: 'relative' }}>
                        <div style={{ position: 'absolute', left: -6, top: 4, width: 10, height: 'calc(100% - 8px)', background: `${accentColor}cc`, borderRadius: '4px 0 0 4px' }} />
                        <i className="fa-solid fa-book-open" style={{ fontSize: 32, color: 'rgba(255,255,255,0.9)' }} />
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ height: 4, background: 'rgba(255,255,255,0.5)', borderRadius: 4 }} />
                          <div style={{ height: 3, background: 'rgba(255,255,255,0.3)', borderRadius: 4, width: '80%' }} />
                          <div style={{ height: 3, background: 'rgba(255,255,255,0.3)', borderRadius: 4, width: '90%' }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stacked books deco */}
                  <div style={{ position: 'absolute', bottom: 16, right: 14, opacity: 0.18, zIndex: 0 }}>
                    <div style={{ width: 40, height: 6, background: accentColor, borderRadius: 3, marginBottom: 3 }} />
                    <div style={{ width: 36, height: 6, background: BRAND, borderRadius: 3, marginBottom: 3 }} />
                    <div style={{ width: 44, height: 6, background: accentColor, borderRadius: 3 }} />
                  </div>
                </div>

                {/* ── Right info panel ── */}
                <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: BRAND, margin: '0 0 8px', lineHeight: 1.35 }}>{ebook.title}</h3>
                    <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.65 }}>{ebook.description}</p>

                    {/* Meta badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#6b7280', background: '#f5f5f5', padding: '5px 12px', borderRadius: 8, border: '1px solid #eee' }}>
                        <i className="fa-regular fa-file-pdf" style={{ color: accentColor, fontSize: 12 }} />PDF File
                      </span>
                      {ebook.fileSize && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#6b7280', background: '#f5f5f5', padding: '5px 12px', borderRadius: 8, border: '1px solid #eee' }}>
                          <i className="fa-solid fa-database" style={{ color: accentColor, fontSize: 10 }} />{ebook.fileSize}
                        </span>
                      )}
                    </div>

                    {/* Feature highlights */}
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      {[
                        { icon: 'fa-solid fa-certificate', label: 'Expertly Curated', sub: 'By industry experts' },
                        { icon: 'fa-solid fa-flask', label: 'Practical Content', sub: 'Real-world examples' },
                        { icon: 'fa-solid fa-stairs', label: 'Step-by-Step', sub: 'Easy to follow' },
                      ].map(({ icon, label, sub }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <i className={icon} style={{ fontSize: 14, color: accentColor }} />
                          <div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: BRAND, margin: 0 }}>{label}</p>
                            <p style={{ fontSize: 10, color: '#9ca3af', margin: 0 }}>{sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div style={{ marginTop: 16 }}>
                    {canAccess ? (
                      <a href={ebook.pdfUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, color: SAND, background: BRAND, textDecoration: 'none', cursor: 'pointer', boxShadow: `0 4px 14px ${BRAND}40` }}>
                        <i className="fa-solid fa-book-open" /> Open e-Book
                      </a>
                    ) : (
                      <button onClick={() => handleEbookOpen(ebook)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, color: SAND, background: BRAND, border: 'none', cursor: 'pointer', boxShadow: `0 4px 14px ${BRAND}40` }}>
                        <i className="fa-solid fa-lock" /> Unlock E-Book
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* More coming soon */}
        <div style={{ marginTop: 16, background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: SAND_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fa-solid fa-book-open" style={{ fontSize: 18, color: BRAND }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: BRAND, margin: 0 }}>More e-books coming soon!</p>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>We're working on adding more valuable resources for your career growth.</p>
          </div>
        </div>

        {/* Upgrade nudge */}
        {!isPaid && ebooks.some(e => !e.isFree) && (
          <div style={{ marginTop: 12, borderRadius: 16, padding: '18px 22px', background: BRAND, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <i className="fa-solid fa-crown" style={{ fontSize: 24, color: SAND, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 160 }}>
              <p style={{ fontWeight: 800, color: '#fff', margin: 0, fontSize: 14 }}>Unlock All Premium E-Books</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, margin: '3px 0 0' }}>Upgrade your plan to access all career guides and resources.</p>
            </div>
            <button onClick={() => setShowPricingModal(true)}
              style={{ padding: '9px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: SAND, color: BRAND, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              View Plans
            </button>
          </div>
        )}
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // SETTINGS
  // ─────────────────────────────────────────────────────────────────────────────
  const SettingsSection = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 480, textAlign: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 22, padding: '52px 36px', maxWidth: 520, width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
        <div style={{ width: 140, height: 140, margin: '0 auto 24px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', position: 'absolute' }} />
          <i className="fa-solid fa-gear" style={{ fontSize: 64, color: `${BRAND}25`, position: 'absolute', animation: 'spin-slow 8s linear infinite' }} />
          <i className="fa-solid fa-gear" style={{ fontSize: 32, color: BRAND, position: 'relative', zIndex: 1, opacity: 0.8 }} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: BRAND, marginBottom: 7 }}>We're Working on It! 🛠️</h2>
        <p style={{ fontSize: 14, fontWeight: 600, color: BRAND, marginBottom: 12, opacity: 0.7 }}>Settings is coming soon.</p>
        <p style={{ fontSize: 13, color: '#9ca3af', maxWidth: 380, margin: '0 auto 24px', lineHeight: 1.7 }}>We are working hard to bring you a better experience. Stay tuned!</p>
        <button onClick={() => toast.success("We'll notify you when settings is ready!")}
          className="settings-notify-btn"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: '#fff', color: BRAND, border: `1.5px solid ${BRAND}`, cursor: 'pointer' }}>
          <i className="fa-regular fa-bell" /> Notify Me When It's Ready
        </button>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // PROFILE
  // ─────────────────────────────────────────────────────────────────────────────
  const ProfileSection = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 580 }}>
      <div style={{ background: BRAND, borderRadius: 18, padding: '24px 24px 18px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 110, height: 110, borderRadius: '50%', background: `${SAND}18` }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
          <div style={{ width: 62, height: 62, borderRadius: 18, background: SAND, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: BRAND, flexShrink: 0 }}>{avatarLetters}</div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>{user?.name || 'User'}</h2>
            <p style={{ fontSize: 12, color: `${SAND}cc`, margin: '2px 0 0' }}>{user?.email || ''}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 7, padding: '3px 10px', borderRadius: 8, background: `${SAND}20` }}>
              {isPaid && <i className="fa-solid fa-crown" style={{ fontSize: 10, color: SAND }} />}
              <span style={{ fontSize: 11, fontWeight: 700, color: SAND }}>{currentPlan} Plan</span>
            </div>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 700, color: BRAND, margin: 0 }}>Personal Information</h3>
      <div style={{ background: '#fff', borderRadius: 18, padding: '22px', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {([
          { label: 'FULL NAME', val: nameInput, setVal: setNameInput, isEdit: isEditingName, setEdit: setIsEditingName, reset: () => { setIsEditingName(false); setNameInput(user?.name || ''); }, type: 'text' },
          { label: 'EMAIL ADDRESS', val: emailInput, setVal: setEmailInput, isEdit: isEditingEmail, setEdit: setIsEditingEmail, reset: () => { setIsEditingEmail(false); setEmailInput(user?.email || ''); }, type: 'email' },
        ] as any[]).map(({ label, val, setVal, isEdit, setEdit, reset, type }) => (
          <div key={label}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#9ca3af', marginBottom: 6, letterSpacing: '0.08em' }}>{label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <input type={type} value={val} onChange={(e: any) => setVal(e.target.value)} readOnly={!isEdit}
                style={{ flex: 1, padding: '10px 13px', borderRadius: 12, fontSize: 14, border: `1.5px solid ${isEdit ? BRAND : '#e5e7eb'}`, background: isEdit ? '#fff' : '#fafafa', outline: 'none', color: '#111' }} />
              {!isEdit
                ? <button onClick={() => setEdit(true)} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e5e7eb', background: SAND_LIGHT, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-pen" style={{ fontSize: 12, color: BRAND }} />
                </button>
                : <>
                  <button onClick={saveProfile} disabled={savingProfile} style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: '#d1fae5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-check" style={{ fontSize: 12, color: '#059669' }} />
                  </button>
                  <button onClick={reset} style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: '#fee2e2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-xmark" style={{ fontSize: 12, color: '#ef4444' }} />
                  </button>
                </>}
            </div>
          </div>
        ))}

        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#9ca3af', marginBottom: 6, letterSpacing: '0.08em' }}>MOBILE NUMBER</label>
          <input type="text" value={userData?.mobile || 'Not provided'} readOnly
            style={{ width: '100%', padding: '10px 13px', borderRadius: 12, fontSize: 14, border: '1.5px solid #e5e7eb', background: '#fafafa', color: '#6b7280', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#9ca3af', marginBottom: 6, letterSpacing: '0.08em' }}>CURRENT PLAN</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12, background: BRAND }}>
              {isPaid && <i className="fa-solid fa-crown" style={{ fontSize: 12, color: SAND }} />}
              <span style={{ fontSize: 13, fontWeight: 700, color: SAND }}>{currentPlan} Plan</span>
            </div>
            <button onClick={() => setActiveSection('billing')}
              style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, border: `1.5px solid ${BRAND}`, background: '#fff', color: BRAND, cursor: 'pointer' }}>
              Manage Plan
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4, borderTop: '1px solid #f5f5f5', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: BRAND, margin: 0 }}>Password</p>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>Update your account password</p>
          </div>
          <button onClick={() => setActiveSection('change-password')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
            <i className="fa-solid fa-lock" style={{ fontSize: 11 }} /> Change Password
          </button>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // CHANGE PASSWORD
  // ─────────────────────────────────────────────────────────────────────────────
  const ChangePasswordSection = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 440 }}>
      <button onClick={() => setActiveSection('profile')}
        style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: BRAND, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500 }}>
        <i className="fa-solid fa-chevron-left" style={{ fontSize: 10 }} /> Back to Profile
      </button>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: BRAND, margin: 0 }}>Change Password</h2>
      <div style={{ background: '#fff', borderRadius: 18, padding: '22px', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {([
          { label: 'CURRENT PASSWORD', key: 'currentPassword', show: showCurrentPwd, toggle: () => setShowCurrentPwd(p => !p) },
          { label: 'NEW PASSWORD', key: 'newPassword', show: showNewPwd, toggle: () => setShowNewPwd(p => !p) },
          { label: 'CONFIRM NEW PASSWORD', key: 'confirmPassword', show: showConfirmPwd, toggle: () => setShowConfirmPwd(p => !p) },
        ] as any[]).map(({ label, key, show, toggle }) => (
          <div key={key}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#9ca3af', marginBottom: 6, letterSpacing: '0.08em' }}>{label}</label>
            <div style={{ position: 'relative' }}>
              <input type={show ? 'text' : 'password'} value={(passwordData as any)[key]}
                onChange={(e: any) => setPasswordData(p => ({ ...p, [key]: e.target.value }))}
                placeholder={`Enter ${label.toLowerCase()}`}
                style={{ width: '100%', padding: '10px 42px 10px 13px', borderRadius: 12, fontSize: 14, border: '1.5px solid #e5e7eb', outline: 'none', boxSizing: 'border-box' }} />
              <button type="button" onClick={toggle}
                style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <i className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'}`} style={{ fontSize: 14 }} />
              </button>
            </div>
          </div>
        ))}
        <button onClick={handlePasswordChange} disabled={changingPassword}
          style={{ width: '100%', padding: '11px', borderRadius: 12, fontSize: 14, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer', opacity: changingPassword ? 0.6 : 1 }}>
          {changingPassword ? 'Updating…' : 'Update Password'}
        </button>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // BILLING
  // ─────────────────────────────────────────────────────────────────────────────
  const BillingSection = () => {
    const exp = userData?.planExpiresAt ? new Date(userData.planExpiresAt) : null;
    const expired = exp && new Date() > exp;
    const diffMs = exp ? exp.getTime() - Date.now() : null;
    const daysLeft = diffMs && diffMs > 0 ? Math.ceil(diffMs / 86400000) : null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 540 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: BRAND, margin: 0 }}>Subscription & Billing</h2>
        <div style={{ background: '#fff', borderRadius: 18, padding: '22px', border: '1px solid #f0f0f0' }}>
          {currentPlan === 'Free' ? (
            <div style={{ textAlign: 'center', padding: '28px 0' }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>📋</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: BRAND, marginBottom: 7 }}>No Active Plan</h3>
              <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 18 }}>You're on the free plan. Upgrade to unlock premium features.</p>
              <button onClick={() => setShowPricingModal(true)}
                style={{ padding: '10px 22px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
                View Plans
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-crown" style={{ fontSize: 24, color: SAND }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: BRAND, margin: 0 }}>{currentPlan} Plan</h3>
                  {exp && (
                    <p style={{ fontSize: 13, fontWeight: 500, margin: '3px 0 0', color: expired ? '#ef4444' : daysLeft && daysLeft <= 7 ? '#f97316' : '#10b981' }}>
                      {expired ? `Expired on ${exp.toLocaleDateString('en-IN')}` : `Expires: ${exp.toLocaleDateString('en-IN')} · ${daysLeft} days left`}
                    </p>
                  )}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
                {[
                  { label: 'Downloads Used', value: `${userData?.downloadCount || 0} / ${userData?.downloadLimit || 0}` },
                  { label: 'Plan Status', value: expired ? 'Expired' : 'Active' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding: '12px', borderRadius: 12, background: '#f9f9f9' }}>
                    <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 3px' }}>{label}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: BRAND, margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                <button onClick={() => setShowPricingModal(true)}
                  style={{ padding: '9px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
                  {expired ? 'Renew Plan' : 'Upgrade Plan'}
                </button>
                <button onClick={() => setShowPricingModal(true)}
                  style={{ padding: '9px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, border: '1.5px solid #e5e7eb', background: '#fff', color: BRAND, cursor: 'pointer' }}>
                  Change Plan
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // DELETE ACCOUNT
  // ─────────────────────────────────────────────────────────────────────────────
  const DeleteAccountSection = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 500 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: BRAND, margin: 0 }}>Delete Account</h2>
      <div style={{ background: '#fff5f5', borderRadius: 18, border: '2px solid #fecaca', padding: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 22 }}>
          <div style={{ width: 48, height: 48, background: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: 20, color: '#fff' }} />
          </div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: BRAND, marginBottom: 5 }}>Permanently Delete Your Account?</h3>
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>This action is irreversible. All your resumes, data, and subscription history will be permanently erased.</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, cursor: 'pointer' }}>
            <input type="checkbox" checked={deleteConfirmed} onChange={e => setDeleteConfirmed(e.target.checked)}
              style={{ marginTop: 2, width: 15, height: 15, accentColor: '#ef4444' }} />
            <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>I understand and want to permanently delete my account</span>
          </label>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#9ca3af', marginBottom: 7, letterSpacing: '0.08em' }}>ENTER YOUR PASSWORD TO CONFIRM</label>
            <div style={{ position: 'relative' }}>
              <input type={showDeletePwd ? 'text' : 'password'} value={deletePassword} onChange={e => setDeletePassword(e.target.value)} placeholder="Enter your password"
                style={{ width: '100%', padding: '11px 42px 11px 13px', borderRadius: 12, fontSize: 14, border: '1.5px solid #fca5a5', outline: 'none', background: '#fff', boxSizing: 'border-box', color: '#111' }} />
              <button onClick={() => setShowDeletePwd(p => !p)} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <i className={`fa-solid ${showDeletePwd ? 'fa-eye-slash' : 'fa-eye'}`} style={{ fontSize: 14 }} />
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
            <button
              onClick={() => { if (!deleteConfirmed || !deletePassword) { toast.error('Please confirm and enter password'); return; } setShowDeleteConfirmModal(true); }}
              disabled={!deleteConfirmed || !deletePassword || deletingAccount}
              style={{ flex: 1, minWidth: 0, padding: '12px 8px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: deleteConfirmed && deletePassword ? '#ef4444' : '#d1d5db', color: '#fff', border: 'none', cursor: deleteConfirmed && deletePassword ? 'pointer' : 'not-allowed', opacity: deletingAccount ? 0.6 : 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {deletingAccount ? 'Deleting…' : 'Delete Permanently'}
            </button>
            <button onClick={() => { setActiveSection('profile'); setDeleteConfirmed(false); setDeletePassword(''); }}
              style={{ flex: 1, minWidth: 100, padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: '#e5e7eb', color: '#374151', border: 'none', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER SECTION
  // ─────────────────────────────────────────────────────────────────────────────
  const renderSection = () => {
    if (loadingData && activeSection === 'home')
      return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280 }}><i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 30, color: BRAND }} /></div>;
    switch (activeSection) {
      case 'home': return <HomeSection />;
      case 'my-resumes': return <MyResumesSection />;
      case 'my-cover-letters': return <MyCoverLettersSection />;
      case 'resume-templates': return <ResumeTemplatesSection />;
      case 'ats-score': return <ATSScoreSection />;
      case 'linkedin-score': return <LinkedInScoreSection />;
      case 'ebooks': return <EBooksSection />;
      case 'settings': return <SettingsSection />;
      case 'profile': return <ProfileSection />;
      case 'change-password': return <ChangePasswordSection />;
      case 'billing': return <BillingSection />;
      case 'delete-account': return <DeleteAccountSection />;
      default: return <HomeSection />;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN RETURN
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f7f8fa', overflow: 'hidden' }}>
      <style>{`
        @keyframes spin-slow { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#e5e7eb; border-radius:4px; }

        .rc:hover { box-shadow:0 5px 20px rgba(0,0,0,0.09); }
        .rc:hover img { transform:scale(1.04); }
        .rc:hover .tpl-hover-overlay { opacity:1 !important; }

        /* Sidebar: desktop always visible, mobile off-canvas */
        .sidebar-el {
          position: fixed;
          inset-y: 0;
          left: 0;
          z-index: 40;
          transform: translateX(-100%);
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .sidebar-el.open { transform: translateX(0); }

        @media(min-width:1024px) {
          .sidebar-el {
            position: static !important;
            transform: none !important;
            flex-shrink: 0;
          }
          .ub-close { display:none !important; }
          .ub-menu  { display:none !important; }
        }
        @media(max-width:1023px) {
          .ub-menu  { display:flex !important; }
          .ub-close { display:flex !important; }
          .ub-hname { display:none; }
        }

        @media(max-width:900px)  { .ats-grid  { grid-template-columns:1fr 1fr !important; } }
        @media(max-width:560px)  { .ats-grid  { grid-template-columns:1fr !important; } }
        @media(max-width:1100px) { .tpl-grid  { grid-template-columns:repeat(4,1fr) !important; } }
        @media(max-width:860px)  { .tpl-grid  { grid-template-columns:repeat(3,1fr) !important; } }
        @media(max-width:600px)  { .tpl-grid  { grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:780px)  { .stats-grid{ grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:640px)  { .quick-grid{ grid-template-columns:repeat(3,1fr) !important; } }
        @media(max-width:380px)  { .quick-grid{ grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:420px)  { .card-grid { grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:600px)  { .main-content { padding:14px !important; } }
 @media(max-width:540px)  {
          .ebook-card  { flex-direction:column !important; }
          .ebook-cover { width:100% !important; min-width:unset !important; height:180px !important; }
        }
        @media(max-width:480px) {
          .settings-notify-btn { font-size:11px !important; padding:9px 14px !important; gap:5px !important; }
        }
        @media(max-width:360px) {
          .settings-notify-btn { font-size:10px !important; padding:8px 10px !important; }
        }
      `}</style>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 35 }} />
      )}

      {/* Sidebar */}
      <div className={`sidebar-el${sidebarOpen ? ' open' : ''}`}>
        <Sidebar />
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Header />

        {/* Sub-nav tabs for profile sections */}
        {['profile', 'change-password', 'billing', 'delete-account'].includes(activeSection) && (
          <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 16px', overflowX: 'auto' }}>
            <div style={{ display: 'flex' }}>
              {[
                { k: 'profile', l: 'My Profile' },
                { k: 'billing', l: 'Subscription & Billing' },
                { k: 'change-password', l: 'Change Password' },
                { k: 'delete-account', l: 'Delete Account' },
              ].map(({ k, l }) => (
                <button key={k} onClick={() => setActiveSection(k as ActiveSection)}
                  style={{ padding: '11px 14px', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', color: activeSection === k ? BRAND : '#9ca3af', borderBottom: `2px solid ${activeSection === k ? BRAND : 'transparent'}` }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        <main className="main-content" style={{ flex: 1, overflowY: 'auto', padding: '18px' }}>
          {renderSection()}
        </main>
      </div>

      {/* Pricing Modal */}
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} showFreeOption={false} />

      {/* Premium Ebook Unlock Popup */}
      {showEbookUnlock && premiumEbook && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 420, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="fa-solid fa-lock" style={{ fontSize: 24, color: SAND }} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: BRAND, textAlign: 'center', margin: '0 0 8px' }}>Premium E-Book</h3>
            <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', margin: '0 0 20px', lineHeight: 1.6 }}>
              <strong style={{ color: BRAND }}>{premiumEbook.title}</strong> is available for premium members only.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f9f9f9', borderRadius: 12, padding: '12px 14px', marginBottom: 20, border: '1px solid #f0f0f0' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: premiumEbook.color || BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="fa-solid fa-book-open" style={{ fontSize: 18, color: '#fff' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: BRAND, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{premiumEbook.title}</p>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>{premiumEbook.fileSize || 'PDF Guide'}</p>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: SAND_LIGHT, color: BRAND }}>PREMIUM</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
              {['Access all premium e-books', 'Download unlimited resumes', 'Priority support & more'].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="fa-solid fa-check" style={{ fontSize: 9, color: '#059669' }} />
                  </div>
                  <p style={{ fontSize: 12, color: '#374151', margin: 0 }}>{b}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setShowEbookUnlock(false); setPremiumEbook(null); }}
                style={{ flex: 1, padding: '11px', borderRadius: 12, fontSize: 13, fontWeight: 600, background: '#f3f4f6', color: '#374151', border: 'none', cursor: 'pointer' }}>
                Maybe Later
              </button>
              <button onClick={() => { setShowEbookUnlock(false); setPremiumEbook(null); setShowPricingModal(true); }}
                style={{ flex: 2, padding: '11px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
                <i className="fa-solid fa-crown" style={{ marginRight: 6 }} />Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Resume Modal */}

      {showCreateResumeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 380, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button onClick={() => { setShowCreateResumeModal(false); setNewResumeTitle(''); }}
              style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 20, lineHeight: 1 }}>✕</button>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: BRAND, margin: '0 0 18px' }}>Create a Resume</h3>
            <input
              type="text"
              placeholder="Enter resume title"
              value={newResumeTitle}
              onChange={e => setNewResumeTitle(e.target.value)}
              onKeyDown={async e => {
                if (e.key === 'Enter') {
                  if (!newResumeTitle.trim()) { toast.error('Enter a title'); return; }
                  try {
                    const { data } = await api.post('/resumes/create', { title: newResumeTitle.trim() });
                    setNewResumeTitle(''); setShowCreateResumeModal(false);
                    navigate(`/app/builder/${data.resume._id}`);
                  } catch { toast.error('Failed to create resume'); }
                }
              }}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, border: `1.5px solid ${SAND}`, outline: 'none', marginBottom: 14, boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={async () => {
                  if (!newResumeTitle.trim()) { toast.error('Enter a title'); return; }
                  try {
                    const { data } = await api.post('/resumes/create', { title: newResumeTitle.trim() });
                    setNewResumeTitle(''); setShowCreateResumeModal(false);
                    navigate(`/app/builder/${data.resume._id}`);
                  } catch { toast.error('Failed to create resume'); }
                }}
                style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
                Create Resume
              </button>
              <button
                onClick={() => { setShowCreateResumeModal(false); setNewResumeTitle(''); setShowUploadResumeModal(true); }}
                style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 600, background: '#f3f4f6', color: '#374151', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                <i className="fa-solid fa-file-arrow-up" style={{ fontSize: 12 }} /> Upload Existing Resume Instead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Resume Modal */}
      {showUploadResumeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 380, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button onClick={() => { setShowUploadResumeModal(false); setNewResumeTitle(''); setUploadFile(null); }}
              style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 20, lineHeight: 1 }}>✕</button>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: BRAND, margin: '0 0 18px' }}>Upload Resume</h3>
            <input
              type="text"
              placeholder="Enter resume title"
              value={newResumeTitle}
              onChange={e => setNewResumeTitle(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, border: `1.5px solid ${SAND}`, outline: 'none', marginBottom: 14, boxSizing: 'border-box' }}
            />
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Select resume file</label>
            <label htmlFor="upload-resume-input-main" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, border: `2px dashed ${SAND}`, borderRadius: 12, padding: '28px 16px', cursor: 'pointer', marginBottom: 14, background: '#fafafa' }}>
              {uploadFile
                ? <p style={{ fontSize: 13, fontWeight: 600, color: BRAND, margin: 0, textAlign: 'center', wordBreak: 'break-all' }}>{uploadFile.name}</p>
                : <>
                  <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: 32, color: SAND }} />
                  <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Upload resume (PDF only)</p>
                </>}
              <input id="upload-resume-input-main" type="file" accept=".pdf" hidden
                onChange={e => { const f = e.target.files?.[0]; if (f) setUploadFile(f); }} />
            </label>
            <button
              disabled={isUploading}
              onClick={async () => {
                if (!newResumeTitle.trim()) { toast.error('Enter a title'); return; }
                if (!uploadFile) { toast.error('Select a PDF file'); return; }
                setIsUploading(true);
                try {
                  const pdfToText = (await import('react-pdftotext')).default;
                  const resumeText = await pdfToText(uploadFile);
                  const { data } = await api.post('/ai/upload-resume', { title: newResumeTitle.trim(), resumeText });
                  toast.success('Resume uploaded successfully!');
                  setNewResumeTitle(''); setUploadFile(null); setShowUploadResumeModal(false);
                  navigate(`/app/builder/${data.resumeId}`);
                } catch { toast.error('Upload failed. Please try again.'); }
                finally { setIsUploading(false); }
              }}
              style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {isUploading && <i className="fa-solid fa-spinner fa-spin" />}
              {isUploading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </div>
        </div>
      )}


      {/* Create Cover Letter Modal */}
      {showCreateCoverLetterModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 380, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button onClick={() => { setShowCreateCoverLetterModal(false); setNewCoverLetterTitle(''); }}
              style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 20, lineHeight: 1 }}>✕</button>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: BRAND, margin: '0 0 18px' }}>Create a Cover Letter</h3>
            <input
              type="text"
              placeholder="Enter cover letter title"
              value={newCoverLetterTitle}
              onChange={e => setNewCoverLetterTitle(e.target.value)}
              onKeyDown={async e => {
                if (e.key === 'Enter') {
                  if (!newCoverLetterTitle.trim()) { toast.error('Enter a title'); return; }
                  try {
                    const { data } = await api.post('/cover-letters/create', { title: newCoverLetterTitle.trim() });
                    setNewCoverLetterTitle(''); setShowCreateCoverLetterModal(false);
                    navigate(`/app/cover-letter/builder/${data.coverLetter._id}`);
                  } catch { toast.error('Failed to create cover letter'); }
                }
              }}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, border: `1.5px solid ${SAND}`, outline: 'none', marginBottom: 14, boxSizing: 'border-box' }}
            />
            <button
              onClick={async () => {
                if (!newCoverLetterTitle.trim()) { toast.error('Enter a title'); return; }
                try {
                  const { data } = await api.post('/cover-letters/create', { title: newCoverLetterTitle.trim() });
                  setNewCoverLetterTitle(''); setShowCreateCoverLetterModal(false);
                  navigate(`/app/cover-letter/builder/${data.coverLetter._id}`);
                } catch { toast.error('Failed to create cover letter'); }
              }}
              style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
              Create Cover Letter
            </button>
          </div>
        </div>
      )}


      {/* Edit Resume Title Modal */}
      {editResumeId && (
        <form onSubmit={updateResumeTitle} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 360, padding: 22, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: BRAND, marginBottom: 14 }}>Edit Resume Title</h3>
            <input value={editResumeTitle} onChange={e => setEditResumeTitle(e.target.value)}
              style={{ width: '100%', padding: '10px 13px', borderRadius: 12, fontSize: 14, border: `2px solid ${SAND}`, outline: 'none', marginBottom: 14, boxSizing: 'border-box' }} required />
            <div style={{ display: 'flex', gap: 9 }}>
              <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>Update</button>
              <button type="button" onClick={() => setEditResumeId('')} style={{ flex: 1, padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 600, background: '#f3f4f6', color: '#374151', border: 'none', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </form>
      )}

      {/* Edit Cover Letter Title Modal */}
      {editCoverLetterId && (
        <form onSubmit={updateCoverLetterTitle} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 360, padding: 22, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: BRAND, marginBottom: 14 }}>Edit Cover Letter Title</h3>
            <input value={editCoverLetterTitle} onChange={e => setEditCoverLetterTitle(e.target.value)}
              style={{ width: '100%', padding: '10px 13px', borderRadius: 12, fontSize: 14, border: `2px solid ${SAND}`, outline: 'none', marginBottom: 14, boxSizing: 'border-box' }} required />
            <div style={{ display: 'flex', gap: 9 }}>
              <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>Update</button>
              <button type="button" onClick={() => setEditCoverLetterId('')} style={{ flex: 1, padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 600, background: '#f3f4f6', color: '#374151', border: 'none', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </form>
      )}

      {/* Logout Confirm Modal */}
      {showLogoutModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 340, padding: 26, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <div style={{ width: 56, height: 56, background: SAND_LIGHT, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <i className="fa-solid fa-right-from-bracket" style={{ fontSize: 24, color: BRAND }} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: BRAND, marginBottom: 7 }}>Are you sure you want to logout?</h3>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>You will be redirected to the login page.</p>
            </div>
            <div style={{ display: 'flex', gap: 9 }}>
              <button onClick={confirmLogout}
                style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: BRAND, color: SAND, border: 'none', cursor: 'pointer' }}>
                Yes, Logout
              </button>
              <button onClick={() => setShowLogoutModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: '#e5e7eb', color: '#374151', border: 'none', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirm Modal */}
      {showDeleteConfirmModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 340, padding: 26, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <div style={{ width: 56, height: 56, background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: 24, color: '#ef4444' }} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: BRAND, marginBottom: 7 }}>Are you absolutely sure?</h3>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>This cannot be undone. All your data will be permanently removed.</p>
            </div>
            <div style={{ display: 'flex', gap: 9 }}>
              <button onClick={confirmDelete} style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}>Yes, Delete</button>
              <button onClick={() => setShowDeleteConfirmModal(false)} style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: '#e5e7eb', color: '#374151', border: 'none', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;