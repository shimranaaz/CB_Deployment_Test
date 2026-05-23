import React, { useState, ChangeEvent, DragEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../configs/api';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';


interface DetailedReport {
  profileCompleteness?: { score: number; percentage: number; details: string };
  keywordOptimization?: { score: number; percentage: number; details: string };
  headlineStrength?: { score: number; percentage: number; details: string };
  aboutSection?: { score: number; percentage: number; details: string };
  experienceSection?: { score: number; percentage: number; details: string };
  skillsEndorsements?: { score: number; percentage: number; details: string };
}

interface RecruiterVisibility {
  searchRankScore: number;
  missingKeywords: string[];
  topRecommendations: string[];
}

interface ContentIntelligence {
  headlineSuggestion: string;
  aboutSuggestion: string;
  impactWords: string[];
}

interface CareerAlignment {
  roleMatch: number;
  targetRole: string;
  alignmentTips: string[];
}

interface ProfileFixData {
  summary?: string;
  about?: string;
  headline?: string;
  education?: string;
  experience?: string;
  skills?: string[];
  recommendations?: string[];
}

interface LinkedInData {
  linkedinScore: number;
  profileStrength: string;
  userData?: { fullName: string; username: string; headline: string; estimatedConnections: string };
  detailedReport: DetailedReport;
  recruiterVisibility: RecruiterVisibility;
  contentIntelligence: ContentIntelligence;
  careerAlignment: CareerAlignment;
  profileFixData?: ProfileFixData;
}

interface RootState {
  auth: {
    user: any;
    token?: string;
  };
}

type ScreenType = 'landing' | 'upload' | 'analyzing' | 'results' | 'fixedProfile';

const getScoreColor = (s: number) => {
  if (s >= 70) return '#10b981';
  if (s >= 50) return '#f59e0b';
  if (s >= 30) return '#fb923c';
  return '#ef4444';
};

const getRisk = (s: number) => {
  if (s >= 70) return { text: 'High Recruiter Visibility', bg: '#10b981', color: '#fff' };
  if (s >= 50) return { text: 'Medium Recruiter Visibility', bg: '#f59e0b', color: '#fff' };
  if (s >= 30) return { text: 'Low Recruiter Visibility', bg: '#fb923c', color: '#fff' };
  return { text: 'Very Low Recruiter Visibility', bg: '#ef4444', color: '#fff' };
};

const getScoreLabel = (s: number) => {
  if (s >= 70) return 'Excellent';
  if (s >= 60) return 'Good';
  if (s >= 45) return 'Average';
  if (s >= 30) return 'Below Average';
  return 'Needs Improvement';
};

const getMissedRecruiters = (s: number) => {
  if (s >= 70) return '2';
  if (s >= 50) return '5';
  if (s >= 30) return '7';
  return '9';
};


const isPaidPlanUser = (user: any): boolean => {
  if (!user) return false;
  try {
    return (
      user?.plan === 'Basic' || user?.plan === 'Advanced' || user?.plan === 'Professional' ||
      user?.plan === 'basic' || user?.plan === 'advanced' || user?.plan === 'professional' ||
      user?.planName === 'Basic Plan' || user?.planName === 'Advanced Plan' || user?.planName === 'Professional Plan' ||
      user?.subscription?.status === 'active'
    );
  } catch { return false; }
};

const hasLinkedInOnePay = (user: any): boolean => {
  if (!user) return false;
  return user?.linkedinPaid === true;
};

const getLinkedInUsageCount = (user: any): number => {
  if (!user) return 0;
  return typeof user.linkedinOptimizationCount === 'number' ? user.linkedinOptimizationCount : 0;
};

const MAX_LINKEDIN_USES = 3;
const UpgradePopup: React.FC<{ onClose: () => void; onUpgrade: () => void }> = ({ onClose, onUpgrade }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10002, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
    <div style={{ background: '#fff', borderRadius: '24px', padding: '36px 32px', maxWidth: '540px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(61,59,122,0.25)', position: 'relative' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#64748b' }}>
        <i className="fas fa-times"></i>
      </button>
      <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #1e1b4b, #3d3b7a)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <i className="fas fa-chart-line" style={{ fontSize: '28px', color: '#EDC9AF' }}></i>
      </div>
      <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1e1b4b', marginBottom: '10px' }}>You've Used All 3 LinkedIn Optimizations</h3>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', lineHeight: '1.6' }}>
        Upgrade your plan to get a fresh set of LinkedIn profile optimizations and unlock more premium features.
      </p>
      <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', margin: '18px 0', border: '1.5px solid #e2e8f0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['Fresh 3 LinkedIn optimization uses', 'AI-rewritten Headline & Summary', 'More premium resume downloads', 'Priority support'].map((feat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
              <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '14px', flexShrink: 0 }}></i>
              {feat}
            </div>
          ))}
        </div>
      </div>
      <button onClick={onUpgrade} style={{ width: '100%', background: 'linear-gradient(135deg, #1e1b4b, #3d3b7a)', color: '#EDC9AF', padding: '14px', fontSize: '15px', fontWeight: '700', border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(30,27,75,0.35)', transition: 'all 0.2s' }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
        <i className="fas fa-arrow-up" style={{ marginRight: '8px' }}></i>Upgrade My Plan
      </button>
      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>
        <i className="fas fa-shield-alt" style={{ marginRight: '4px' }}></i>Secure upgrade • Instant access
      </p>
    </div>
  </div>
);
const PaywallPopup: React.FC<{ onClose: () => void; onPay: () => void }> = ({ onClose, onPay }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10002, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
    <div style={{ background: '#fff', borderRadius: '24px', padding: '36px 32px', maxWidth: '560px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(61,59,122,0.25)', position: 'relative' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#64748b' }}>
        <i className="fas fa-times"></i>
      </button>
      <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #1e1b4b, #3d3b7a)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <i className="fas fa-lock" style={{ fontSize: '28px', color: '#EDC9AF' }}></i>
      </div>
      <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1e1b4b', marginBottom: '10px' }}>Unlock Full Profile Fix</h3>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', lineHeight: '1.6' }}>
        Get your complete AI-optimized LinkedIn profile — rewritten summary, headline, about section, and more.
      </p>
      <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', margin: '18px 0', border: '1.5px solid #e2e8f0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['AI-rewritten Headline & Summary', 'Optimized About section', 'Skill & keyword recommendations', 'Full career alignment report'].map((feat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
              <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '14px', flexShrink: 0 }}></i>
              {feat}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '18px' }}>
        <span style={{ fontSize: '32px', fontWeight: '900', color: '#1e1b4b' }}>₹199</span>
        <span style={{ fontSize: '14px', color: '#94a3b8', marginLeft: '6px' }}>one-time</span>
      </div>
      <button onClick={onPay} style={{ width: '100%', background: 'linear-gradient(135deg, #1e1b4b, #3d3b7a)', color: '#EDC9AF', padding: '14px', fontSize: '15px', fontWeight: '700', border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(30,27,75,0.35)', transition: 'all 0.2s' }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
        <i className="fas fa-bolt" style={{ marginRight: '8px' }}></i>Unlock for ₹199
      </button>
      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>
        <i className="fas fa-shield-alt" style={{ marginRight: '4px' }}></i>Secure payment • Instant access
      </p>
    </div>
  </div>
);
const CircularGauge: React.FC<{ score: number }> = ({ score }) => {
  const [animatedScore, setAnimatedScore] = React.useState(0);
  const radius = 44; const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const filled = (animatedScore / 100) * circumference;
  const scoreCol = getScoreColor(score);
  const risk = getRisk(score);
  const cx = 60; const cy = 60;

  React.useEffect(() => {
    let start: number | null = null;
    const duration = 1400;
    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      setAnimatedScore(Math.round(ease(prog) * score));
      if (prog < 1) requestAnimationFrame(animate);
    };
    const t = setTimeout(() => requestAnimationFrame(animate), 200);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', flexWrap: 'nowrap' }}>
      <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke={scoreCol} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={`${circumference}`} strokeDashoffset={circumference - filled}
            style={{ transformOrigin: `${cx}px ${cy}px`, transform: 'rotate(-90deg)', transition: 'stroke-dashoffset 0.05s linear' }} />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#1e1b4b', lineHeight: 1 }}>{animatedScore}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', lineHeight: 1.2 }}>/100</div>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: '160px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <i className="fas fa-search" style={{ fontSize: '16px', color: '#3d3b7a' }}></i>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1e1b4b' }}>
            LinkedIn Score: <span style={{ color: scoreCol }}>{score}%</span>
          </p>
        </div>
        <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '8px', background: risk.bg, color: risk.color, fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>
          {risk.text}
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
          <strong style={{ color: '#1e1b4b' }}>{getMissedRecruiters(score)} out of 10 recruiters</strong> are likely missing your profile.
        </p>
      </div>
    </div>
  );
};
const SectionCheckRow: React.FC<{ label: string; score: number }> = ({ label, score }) => {
  const isGood = score >= 60;
  const isMedium = score >= 30 && score < 60;
  const isBad = score < 30;
  const issues = isBad ? 3 : isMedium ? (score >= 45 ? 1 : 2) : 0;
  let bg = '#f0fdf4', border = '#bbf7d0', iconBg = '#10b981';
  let iconContent: React.ReactNode = (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (isMedium) {
    bg = '#fffbeb'; border = '#fde68a'; iconBg = '#f59e0b';
    iconContent = (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3L2 21h20L12 3z" stroke="white" strokeWidth="2.2" strokeLinejoin="round" /><line x1="12" y1="10" x2="12" y2="15" stroke="white" strokeWidth="2.2" strokeLinecap="round" /><circle cx="12" cy="18.5" r="1" fill="white" /></svg>);
  } else if (isBad) {
    bg = '#fff5f5'; border = '#fecaca'; iconBg = '#ef4444';
    iconContent = <span style={{ color: 'white', fontSize: '12px', fontWeight: '900', lineHeight: 1 }}>!</span>;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: '10px', marginBottom: '6px', background: bg, border: `1px solid ${border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{iconContent}</div>
        <span style={{ fontWeight: '600', fontSize: '13px', color: '#1e1b4b' }}>{label}</span>
      </div>
      {!isGood && issues > 0 && (
        <div style={{ minWidth: '24px', height: '24px', borderRadius: '50%', background: isMedium ? '#f59e0b' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900', color: '#fff', flexShrink: 0 }}>{issues}</div>
      )}
    </div>
  );
};
const quotes = [
  'Great LinkedIn profiles open great doors', 'Recruiters are searching for you right now',
  'Your digital first impression matters', 'Keyword-optimized = recruiter-ready',
  'Stand out from 900M+ LinkedIn profiles', 'Your dream job starts with a strong profile',
  'Let AI supercharge your LinkedIn presence', 'Be found before you even apply',
];

const QuoteRotator: React.FC = () => {
  const [idx, setIdx] = React.useState(0);
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % quotes.length); setVisible(true); }, 400);
    }, 3500);
    return () => clearInterval(t);
  }, []);
  return (
    <p style={{ fontSize: '14px', fontWeight: '700', color: '#3d3b7a', marginTop: '12px', marginBottom: '0', minHeight: '22px', textAlign: 'center', transition: 'opacity 0.4s ease, transform 0.4s ease', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}>
      {quotes[idx]}
    </p>
  );
};
const AnalyzingAnimation: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-4">
    <style>{`
      @keyframes liPulse { 0%,100%{transform:scale(1) rotate(-4deg);}50%{transform:scale(1.1) rotate(4deg);} }
      @keyframes liGlow { 0%,100%{filter:drop-shadow(0 4px 12px rgba(30,27,75,0.25));}50%{filter:drop-shadow(0 8px 24px rgba(30,27,75,0.55));} }
      @keyframes ripple { 0%{transform:scale(0.8);opacity:0.8;}100%{transform:scale(1.6);opacity:0;} }
      @keyframes mgBounce { 0%,100%{transform:translateY(0);}50%{transform:translateY(-14px);} }
      .li-anim { animation: liPulse 1.8s ease-in-out infinite, liGlow 1.8s ease-in-out infinite; display:inline-block; }
    `}</style>
    <div className="relative flex items-center justify-center mb-3" style={{ width: 100, height: 100 }}>
      {[0, 1].map(i => (<div key={i} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(30,27,75,0.25)', animation: `ripple 2s ease-out ${i * 0.7}s infinite` }} />))}
      <div className="li-anim">
        <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #1e1b4b, #3d3b7a)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fab fa-linkedin" style={{ fontSize: '42px', color: '#EDC9AF' }}></i>
        </div>
      </div>
    </div>
    <div className="flex gap-1.5 mb-3">
      {[0, 1, 2, 3].map(i => (<div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i % 2 === 0 ? '#3d3b7a' : '#1e1b4b', animation: `mgBounce 1.2s ease-in-out ${i * 0.18}s infinite` }} />))}
    </div>
    <QuoteRotator />
  </div>
);

const BusyPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
    <div style={{ background: '#fff', borderRadius: '20px', padding: '32px 28px', maxWidth: '360px', width: '100%', textAlign: 'center', border: '2px solid #3d3b7a', boxShadow: '0 8px 32px rgba(61,59,122,0.2)' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}><i className="fas fa-hourglass-half" style={{ color: '#3d3b7a' }}></i></div>
      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#3d3b7a', marginBottom: '10px' }}>Our server is a little busy right now</h3>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: '1.6' }}>Don't close this tab — your LinkedIn profile is still being analyzed.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        {[0, 1, 2].map(i => (<div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3d3b7a', animation: `busyDot 1.2s ease-in-out ${i * 0.3}s infinite` }} />))}
      </div>
      <style>{`@keyframes busyDot{0%,100%{opacity:0.2;transform:scale(0.8);}50%{opacity:1;transform:scale(1.2);}}`}</style>
      <button onClick={onClose} style={{ marginTop: '20px', background: 'transparent', border: '1.5px solid #3d3b7a', color: '#3d3b7a', padding: '8px 22px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Got it, I'll wait</button>
    </div>
  </div>
);
const BottomBanner: React.FC<{ onAnalyze: () => void }> = ({ onAnalyze }) => (
  <div style={{ maxWidth: '1100px', margin: '58px auto 0', padding: '0 16px 48px' }}>
    <div className="bottom-banner-inner" style={{ background: '#f1f0f8', borderRadius: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '32px 36px' }}>
      <div style={{ flex: '1', minWidth: '220px', maxWidth: '520px' }}>
        <h2 style={{ fontSize: 'clamp(18px, 2.4vw, 26px)', fontWeight: '800', color: '#2c2a63', marginBottom: '10px', lineHeight: '1.35' }}>Build the resume that finally gets a yes.</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: '1.65' }}>Start in minutes, tailor with AI, and send applications you're proud of</p>
        <button onClick={onAnalyze} style={{ background: '#2c2a63', color: '#EDC9AF', padding: '13px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(44,42,99,0.28)', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          Create my resume now
        </button>
      </div>
      <div style={{ flex: '1', minWidth: '220px', maxWidth: '300px', borderRadius: '16px', overflow: 'hidden', background: '#e8e5f8', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
        <img src="/assets/Services/resume-banner.jpg" alt="Resume" style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }} />
      </div>
    </div>
  </div>
);

const FixedProfileScreen: React.FC<{ data: LinkedInData; onBack: () => void }> = ({ data, onBack }) => {
  const fix = data.profileFixData;
  const sections = [
    { icon: 'fa-user', title: 'Optimized Headline', content: fix?.headline || data.contentIntelligence?.headlineSuggestion || 'No suggestion available.' },
    { icon: 'fa-file-alt', title: 'Rewritten Summary', content: fix?.summary || 'Your summary has been optimized for maximum recruiter visibility.' },
    { icon: 'fa-info-circle', title: 'About Section', content: fix?.about || data.contentIntelligence?.aboutSuggestion || 'No about suggestion available.' },
    { icon: 'fa-graduation-cap', title: 'Education Highlights', content: fix?.education || 'Include relevant coursework, certifications, and achievements.' },
    { icon: 'fa-briefcase', title: 'Experience Optimization', content: fix?.experience || 'Quantify achievements with metrics. Use action verbs to describe impact.' },
  ];
  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: '100px', paddingBottom: '60px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px' }}>
          <button onClick={onBack} style={{ background: '#3d3b7a', border: 'none', color: '#EDC9AF', fontSize: '15px', cursor: 'pointer', marginBottom: '28px', display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: '600', padding: '12px 24px', borderRadius: '50px', boxShadow: '0 2px 8px rgba(61,59,122,0.3)' }}>
            <i className="fas fa-arrow-left"></i><span>Back to Results</span>
          </button>
          <div style={{ background: 'linear-gradient(135deg, #3d3b7a, #0077B5)', borderRadius: '20px', padding: '32px', marginBottom: '28px', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-magic" style={{ fontSize: '24px', color: '#EDC9AF' }}></i>
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 4px' }}>Your AI-Optimized LinkedIn Profile</h2>
                <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{data.userData?.fullName || 'Your Profile'} • Score: {data.linkedinScore}/100</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {sections.map((sec, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#f0eeff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`fas ${sec.icon}`} style={{ fontSize: '18px', color: '#3d3b7a' }}></i>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e1b4b', margin: 0 }}>{sec.title}</h3>
                </div>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: 0, background: '#f8fafc', borderRadius: '10px', padding: '14px 16px', border: '1px solid #e2e8f0' }}>{sec.content}</p>
              </div>
            ))}
            {fix?.skills && fix.skills.length > 0 && (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#f0eeff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-star" style={{ fontSize: '18px', color: '#3d3b7a' }}></i>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e1b4b', margin: 0 }}>Recommended Skills</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {fix.skills.map((skill, i) => (<span key={i} style={{ background: '#3d3b7a', color: '#EDC9AF', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{skill}</span>))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const HERO_IMAGES = [
  '/assets/Services/linkedin.png',
  '/assets/Services/linkedin1.png',
  '/assets/Services/linkedin2.png',
];

const HeroVisual: React.FC<{ cardAnimated: boolean }> = ({ cardAnimated }) => {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActiveIdx(prev => (prev + 1) % HERO_IMAGES.length);
        setAnimating(false);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <style>{`
        @keyframes gaugeArcFill{from{stroke-dashoffset:220;}to{stroke-dashoffset:88;}}
        .gauge-arc-anim{stroke-dasharray:220;stroke-dashoffset:220;animation:gaugeArcFill 1.5s cubic-bezier(0.4,0,0.2,1) 0.6s forwards;}
        @keyframes fillBar{from{width:0%;}}
        .bar-anim{animation:fillBar 1.2s cubic-bezier(0.4,0,0.2,1) forwards;}
        @keyframes liCardSlideIn{from{opacity:0;transform:translateX(-24px);}to{opacity:1;transform:translateX(0);}}
        @keyframes liCardFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        @keyframes liLeft1Float{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
        @keyframes heroImgFadeIn{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);}}
        @keyframes heroImgFadeOut{from{opacity:1;transform:translateX(0);}to{opacity:0;transform:translateX(-20px);}}
        .hero-img-enter{animation:heroImgFadeIn 0.4s ease forwards;}
        .hero-img-exit{animation:heroImgFadeOut 0.4s ease forwards;}
        .li-score-card-anim{animation:liCardSlideIn 0.6s ease forwards, liCardFloat 3.5s ease-in-out 0.6s infinite;}
        .li-left1-anim{animation:liLeft1Float 4s ease-in-out 0.3s infinite;}
      `}</style>

      <div
        className="relative flex items-center justify-center"
        style={{ height: '380px', zIndex: 1 }}
      >
        {cardAnimated && (
          <div
            className="li-score-card-anim absolute bg-white shadow-2xl z-10"
            style={{
              top: '8px',
              left: '0px',
              width: '155px',
              borderRadius: '0px',
              padding: '12px',
              boxShadow: '0 10px 36px rgba(61,59,122,0.18)',
            }}
          >
            <p style={{ fontSize: '10px', fontWeight: '700', color: '#3d3b7a', margin: '0 0 6px', textAlign: 'center' }}>LinkedIn Profile Score</p>
            <div style={{ position: 'relative', width: '110px', height: '64px', margin: '0 auto 2px' }}>
              <svg width="110" height="64" viewBox="0 0 130 80" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="liGaugeGradHero" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#f87171" />
                  </linearGradient>
                </defs>
                <path d="M 12 75 A 53 53 0 0 1 118 75" fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" />
                <path className="gauge-arc-anim" d="M 12 75 A 53 53 0 0 1 118 75" fill="none" stroke="url(#liGaugeGradHero)" strokeWidth="12" strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: '900', color: '#4b351b', margin: 0, lineHeight: 1 }}>72%</p>
              </div>
            </div>
            <div style={{ margin: '4px 0 6px' }} />
            {[
              { label: 'Keyword Gaps', pct: 45, delay: '1.0s' },
              { label: 'Weak Headline', pct: 60, delay: '1.2s' },
              { label: 'Missing Skills', pct: 35, delay: '1.4s' },
            ].map((bar, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? '5px' : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '8px', fontWeight: '600', color: '#475569' }}>{bar.label}</span>
                  <span style={{ fontSize: '8px', fontWeight: '700', color: '#ef4444' }}>{bar.pct}%</span>
                </div>
                <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                  <div className="bar-anim" style={{ height: '100%', width: `${bar.pct}%`, background: '#ef4444', animationDelay: bar.delay, animationDuration: '1.2s' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        <img
          key={activeIdx}
          src={HERO_IMAGES[activeIdx]}
          alt="LinkedIn Profile"
          className={`relative shadow-2xl ${animating ? 'hero-img-exit' : 'hero-img-enter'}`}
          style={{
          width: 'clamp(220px, 55vw, 310px)',
aspectRatio: '3/4.4',
            objectFit: 'cover',
            zIndex: 2,
            borderRadius: '0px',
          }}
        />

        {cardAnimated && (
          <img
            src="/assets/Services/left1.png"
            alt="Analyze"
            className="li-left1-anim absolute z-10"
            style={{
              bottom: '0px',
              right: '0px',
              width: 'clamp(140px, 38vw, 200px)',
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 20px rgba(61,59,122,0.35))',
            }}
          />
        )}
      </div>
    </div>
  );
};

const LinkedInScoreChecker: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [targetRole, setTargetRole] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [linkedInData, setLinkedInData] = useState<LinkedInData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [showBusyPopup, setShowBusyPopup] = useState(false);
  const [cardAnimated, setCardAnimated] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [linkedinUrl] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (user?.email && !userEmail) {
      setUserEmail(user.email);
    }
  }, [user?.email]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useEffect(() => {
    const savedData = localStorage.getItem('linkedinAnalysisData');
    const returnIntent = localStorage.getItem('linkedinReturnIntent');
    if (returnIntent === 'fix' && savedData && token && user) {
      localStorage.removeItem('linkedinReturnIntent');
      const parsed = JSON.parse(savedData);
      setLinkedInData(parsed.linkedInData);
      setTargetRole(parsed.targetRole || '');
      if (isPaidPlanUser(user) || hasLinkedInOnePay(user)) { navigate('/linkedin-optimized'); }
      else { setCurrentScreen('results'); }
    }
  }, [token, user]);

  useEffect(() => {
    if (currentScreen === 'landing') { const t = setTimeout(() => setCardAnimated(true), 300); return () => clearTimeout(t); }
    else { setCardAnimated(false); }
  }, [currentScreen]);

  useEffect(() => {
    if (currentScreen !== 'analyzing') { setShowBusyPopup(false); return; }
    const t = setTimeout(() => setShowBusyPopup(true), 60000);
    return () => clearTimeout(t);
  }, [currentScreen]);

  useEffect(() => { if (currentScreen === 'results') setShowBusyPopup(false); }, [currentScreen]);

  const showToastMessage = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) { showToastMessage('Invalid file type. Only PDF, DOC, DOCX, and TXT allowed.', 'error'); return; }
    if (file.size > 2 * 1024 * 1024) { showToastMessage('File size must be less than 2MB', 'error'); return; }
    setUploadedFile(file);
    showToastMessage('LinkedIn PDF uploaded successfully! Ready to analyze your profile.', 'success');
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) { const fakeEvent = { target: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>; handleFileUpload(fakeEvent); }
  };


  const analyzeProfile = async () => {
  if (!uploadedFile) { showToastMessage('Please upload your resume to continue', 'error'); return; }
 
  setCurrentScreen('analyzing');
 
  try {
    const formData = new FormData();
    console.log('user email:', user?.email);
    if (targetRole.trim()) formData.append('targetRole', targetRole.trim());
    formData.append('resume', uploadedFile);
    if (userEmail.trim()) formData.append('email', userEmail.trim());
 
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 25;
      setAnalysisProgress(progress);
      if (progress >= 100) clearInterval(progressInterval);
    }, 800);
 
    const response = await api.post('/linkedin/analyze', formData);
 
    clearInterval(progressInterval);
    setAnalysisProgress(100);
 
    if (response.data.success) {
      const data = response.data.data;
 
      localStorage.setItem('linkedinProfileData', JSON.stringify(data));
      localStorage.setItem(
        'linkedinAnalysisData',
        JSON.stringify({ linkedInData: data, linkedinUrl: '', targetRole: targetRole.trim() })
      );
 
      setLinkedInData(data);
 
      // ✅ NEW: Save LinkedIn score to user profile (silent — never blocks UI)
      try {
        const token = localStorage.getItem('token');
        if (token && data.linkedinScore !== undefined && data.linkedinScore !== null) {
          await api.put(
            '/users/update-scores',
            { linkedinScore: data.linkedinScore },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('✅ LinkedIn score saved to profile:', data.linkedinScore);
        }
      } catch (saveError) {
        // Silent fail — score display still works, just won't persist to profile
        console.warn('⚠️ LinkedIn score save failed (non-blocking):', saveError);
      }
 
      setTimeout(() => setCurrentScreen('results'), 500);
    } else {
      showToastMessage('Analysis failed. Please try again.', 'error');
      setCurrentScreen('upload');
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to analyze. Please try again.';
    showToastMessage(msg, 'error');
    setCurrentScreen('upload');
    setAnalysisProgress(0);
  }
};


  const handleFixOrAnalyze = async () => {
    if (!token || !user) {
      if (linkedInData) {
        localStorage.setItem('linkedinAnalysisData', JSON.stringify({ linkedInData, linkedinUrl, targetRole }));
        localStorage.setItem('linkedinReturnIntent', 'fix');
      }
      localStorage.setItem('redirectAfterLogin', '/linkedin-checker');
      showToastMessage('Please login to continue', 'info');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    const usageCount = getLinkedInUsageCount(user);
    const onPaidPlan = isPaidPlanUser(user);
    const paidOneTime = hasLinkedInOnePay(user);

    if (onPaidPlan) {
      if (usageCount >= MAX_LINKEDIN_USES) {
        setShowUpgradePopup(true);
        return;
      }
      saveAnalysisToLocal();
      navigate('/linkedin-optimized');
      return;
    }
    if (paidOneTime) {
      if (usageCount >= MAX_LINKEDIN_USES) {
        setShowUpgradePopup(true);
        return;
      }

      saveAnalysisToLocal();
      navigate('/linkedin-optimized');
      return;
    }
    setShowPaywall(true);
  };

  const saveAnalysisToLocal = () => {
    if (linkedInData) {
      localStorage.setItem('linkedinProfileData', JSON.stringify(linkedInData));
      localStorage.setItem('linkedinAnalysisData', JSON.stringify({ linkedInData, linkedinUrl, targetRole }));
    }
  };

  const handlePaywallPay = () => {
    if (linkedInData) { localStorage.setItem('linkedinAnalysisData', JSON.stringify({ linkedInData, linkedinUrl, targetRole })); localStorage.setItem('linkedinReturnIntent', 'fix'); }
    setShowPaywall(false);
    navigate('/payment', { state: { type: 'linkedin-optimization', plan: 'linkedin', planName: 'LinkedIn Optimization', price: 199, returnUrl: '/linkedin-checker' } });
  };

  const handleBuildResume = () => {
    if (token) navigate('/app');
    else { localStorage.setItem('redirectAfterLogin', 'resume-builder'); showToastMessage('Please login to access resume builder', 'info'); setTimeout(() => navigate('/login'), 1000); }
  };

  const Toast = () => (
    <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ffffff', color: '#000', padding: '14px 24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', zIndex: 10000, display: 'flex', alignItems: 'center', gap: '12px', minWidth: '280px', maxWidth: '90vw' }}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      {toastType === 'success' && <i className="fas fa-check-circle" style={{ fontSize: '20px', color: '#10b981' }}></i>}
      {toastType === 'error' && <i className="fas fa-times-circle" style={{ fontSize: '20px', color: '#ef4444' }}></i>}
      {toastType === 'info' && <i className="fas fa-info-circle" style={{ fontSize: '20px', color: '#3b82f6' }}></i>}
      <span style={{ fontSize: '14px', fontWeight: '600', flex: 1 }}>{toastMessage}</span>
    </div>
  );

  if (currentScreen === 'fixedProfile' && linkedInData) {
    return <FixedProfileScreen data={linkedInData} onBack={() => setCurrentScreen('results')} />;
  }
  if (currentScreen === 'landing') {
    return (
      <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <style>{`
          @keyframes floatUpDown{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
          @keyframes floatLeftRight{0%,100%{transform:translateX(0);}50%{transform:translateX(8px);}}
          @keyframes slideInLeft{from{opacity:0;transform:translateX(-30px);}to{opacity:1;transform:translateX(0);}}
          @keyframes slideInRight{from{opacity:0;transform:translateX(30px);}to{opacity:1;transform:translateX(0);}}
          .feat-card{transition:transform 0.25s,box-shadow 0.25s;}
          .feat-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(61,59,122,0.14);}
          .mobile-back { display: none; }
@media (max-width: 768px) { .mobile-back { display: block; } }
          @media(max-width:1024px){
            .hero-grid{grid-template-columns:1fr!important;}
          }
          @media(max-width:640px){
          .bottom-banner-row{flex-direction:column-reverse!important;}
            .hero-grid{display:flex!important;flex-direction:column-reverse!important;}
            .hiw-steps-container{flex-direction:row!important;flex-wrap:nowrap!important;justify-content:center!important;}
            .hiw-step{flex:1!important;min-width:0!important;padding:0 2px!important;}
            .hiw-icon-wrap{width:60px!important;height:60px!important;margin-bottom:8px!important;}
            .hiw-inner{width:30px!important;height:30px!important;}
           .hiw-divider{display:none!important;}
.hiw-step h3{font-size:9px!important;}
            .hiw-step p{font-size:7.5px!important;}
            .bottom-banner-inner{flex-direction:column-reverse!important;}
            .why-section{flex-direction:column!important;}
            .why-image-block{max-width:100%!important;width:100%!important;}
            .optimize-section{flex-direction:column!important;}
            .optimize-image-block{max-width:100%!important;width:100%!important;}
          }
        `}</style>
        <Navbar />
        <div style={{ minHeight: '100vh', background: '#ffffff', paddingTop: '80px' }}>
          {showToast && <Toast />}
          {showBusyPopup && <BusyPopup onClose={() => setShowBusyPopup(false)} />}

          {/* ══ BACK BUTTON ══ */}
          <div className="mobile-back" style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 24px 0' }}>
            <button onClick={() => navigate(-1)}
              style={{ background: '#3d3b7a', border: 'none', color: '#EDC9AF', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '600', padding: '8px 16px', borderRadius: '50px', boxShadow: '0 2px 8px rgba(61,59,122,0.3)', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(61,59,122,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(61,59,122,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <i className="fas fa-home" style={{ fontSize: '12px' }}></i>
              <span>Back to Home</span>
            </button>
          </div>


          {/* ══ HERO ══ */}
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 24px' }}>
            <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
              {/* LEFT */}
              <div>
                <div style={{ display: 'inline-block', background: '#2c2a63', color: '#EDC9AF', padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '20px', letterSpacing: '0.5px', boxShadow: '0 2px 8px rgba(44,42,99,0.25)' }}>
                  LINKEDIN PROFILE CHECKER
                </div>
                <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 48px)', fontWeight: '800', color: '#3d3b7a', marginBottom: '16px', lineHeight: '1.15' }}>
                  Get a Free LinkedIn Profile Review & Start Getting Recruiter Calls
                </h1>
                <p style={{ fontSize: 'clamp(14px, 1.4vw, 17px)', color: '#64748b', marginBottom: '28px', lineHeight: '1.65' }}>
                  Your LinkedIn profile might be the reason you're not getting interview calls. Get an AI-powered analysis in seconds and discover exactly what to fix to stand out.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <button onClick={() => setCurrentScreen('upload')}
                    style={{ background: '#3d3b7a', color: '#EDC9AF', padding: '13px 26px', fontSize: '14px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(61,59,122,0.28)', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    Check My Free LinkedIn Score
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>No signup required • Instant results</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', maxWidth: '380px', marginTop: '8px', flexDirection: 'row-reverse', justifyContent: 'flex-end' }}>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Trusted by <strong style={{ color: '#3d3b7a' }}>10,000+</strong> job seekers</p>
                  <div style={{ display: 'flex' }}>
                    {['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200', 'https://randomuser.me/api/portraits/men/75.jpg'].map((src, i) => (
                      <img key={i} src={src} alt="user" style={{ width: '30px', height: '30px', borderRadius: '50%', border: '2px solid #fff', marginLeft: i === 0 ? 0 : '-9px', objectFit: 'cover' }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <HeroVisual cardAnimated={cardAnimated} />
            </div>
          </div>

          {/* ══ HOW IT WORKS ══ */}
          <div style={{ background: '#faf9ff', padding: '56px 24px' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '44px' }}>
                <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: '800', color: '#2c2a63', margin: '0 0 8px' }}>Get Your LinkedIn Score in 3 Easy Steps</h2>
                <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Get your Linkedin score in 3 easy steps</p>
              </div>
              <div className="hiw-steps-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', position: 'relative', zIndex: 0 }}>
                {[
                  { icon: 'fa-cloud-upload-alt', title: '1. Upload Your LinkedIn PDF', desc: 'Download your LinkedIn profile as a PDF and upload it instantly.' },
                  { icon: 'fa-chart-bar', title: '2. Get Profile Insights', desc: 'Receive your profile score with detailed insights in seconds.' },
                  { icon: 'fa-rocket', title: '3. Improve & Get Noticed', desc: 'Apply smart suggestions to boost visibility and attract recruiters.' },
                ].map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div
                      className="hiw-step"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        width: '210px',
                        padding: '0 10px'
                      }}
                    >
                      <div
                        className="hiw-icon-wrap"
                        style={{
                          position: 'relative',
                          width: 'clamp(70px, 15vw, 110px)',
                          height: 'clamp(70px, 15vw, 110px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '18px'
                        }}
                      >
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #2c2a63' }} />
                        <div style={{ position: 'absolute', inset: '7px', borderRadius: '50%', border: '3px solid #EDC9AF' }} />
                        <div style={{ position: 'absolute', inset: '14px', borderRadius: '50%', border: '3px solid #2c2a63' }} />
                        <div style={{ position: 'absolute', inset: '21px', borderRadius: '50%', background: '#fff' }} />
                        <div
                          className="hiw-inner"
                          style={{
                            position: 'relative',
                            zIndex: 1,
                            width: 'clamp(30px, 8vw, 50px)',
                            height: 'clamp(30px, 8vw, 50px)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <i
                            className={`fas ${step.icon}`}
                            style={{ fontSize: 'clamp(14px, 4vw, 22px)', color: '#2c2a63' }}
                          />
                        </div>
                      </div>

                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#2c2a63', marginBottom: '6px' }}>{step.title}</h3>
                      <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>{step.desc}</p>
                    </div>

                    {idx < 2 && (
                      <div
                        className="hiw-divider"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flex: 1,
                          paddingTop: '55px',
                          zIndex: 1,
                        }}
                      >
                        <svg
                          width="100%"
                          height="8"
                          viewBox="0 0 100 8"
                          preserveAspectRatio="none"
                          style={{ display: 'block' }}
                        >
                          <line
                            x1="0"
                            y1="4"
                            x2="120"
                            y2="4"
                            stroke="#2c2a63"
                            strokeWidth="3"
                            strokeDasharray="4"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    )}

                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* ══ AI OPTIMIZATION ENGINE ══ */}
          <div style={{ background: '#faf9ff', padding: '64px 24px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div style={{ background: 'linear-gradient(135deg, #2c2a63 0%, #3d3b7a 100%)', borderRadius: '20px', padding: '40px 44px', marginBottom: '36px', textAlign: 'center' }}>
                <h2 style={{ fontSize: 'clamp(18px, 2.5vw, 30px)', fontWeight: '800', color: '#fff', margin: '0 0 10px', lineHeight: '1.3' }}>AI-Powered LinkedIn Optimization Engine</h2>
                <p style={{ color: '#EDC9AF', fontSize: '15px', margin: 0 }}>Not just analysis — actionable insights to increase your recruiter visibility and job opportunities.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                {[
                  { icon: 'fa-chart-line', title: 'Visibility Score', items: ['How well your profile ranks in recruiter searches', 'Missing keywords affecting reach', 'Profile discoverability insights'] },
                  { icon: 'fa-brain', title: 'Content Intelligence', items: ['AI suggestions for headline & about section', 'Stronger, impact-driven wording', 'Remove low-performing content'] },
                  { icon: 'fa-bullseye', title: 'Career Alignment', items: ['Match your profile with target job roles', 'Optimize experience for relevance', 'Improve skill positioning'] },
                  { icon: 'fa-arrow-trend-up', title: 'Growth Signals', items: ['Profile strength & engagement factors', 'Trust & credibility boosters', 'Actionable improvement roadmap'] },
                ].map((card, idx) => (
                  <div key={idx} className="feat-card" style={{ background: '#fff', borderRadius: '16px', padding: '28px 24px', boxShadow: '0 4px 16px rgba(61,59,122,0.09)', border: '1px solid #ede9f8' }}>
                    <div style={{ width: '42px', height: '42px', background: '#f0eeff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                      <i className={`fas ${card.icon}`} style={{ fontSize: '19px', color: '#3d3b7a' }}></i>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#2c2a63', marginBottom: '12px' }}>{card.title}</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {card.items.map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#475569' }}>
                          <i className="fas fa-check-circle" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0, fontSize: '13px' }}></i>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══ WHY OPTIMIZE ══ */}
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 24px' }}>
            <div className="optimize-section" style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center' }}>
              <div className="optimize-image-block" style={{ flex: '1', minWidth: '260px', maxWidth: '420px' }}>
                <img src="/assets/Services/linkedin-profile.png" alt="LinkedIn Optimization" style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }} />
              </div>
              <div style={{ flex: '1', minWidth: '260px' }}>
                <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: '800', color: '#2c2a63', marginBottom: '8px' }}>Why Optimize Your LinkedIn Profile with AI?</h2>
                <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '28px', lineHeight: '1.65', fontWeight: '600' }}>Your LinkedIn profile is your digital first impression. Make sure it's optimized to get noticed by recruiters.</p>
                {[
                  { icon: 'fa-rocket', title: 'Built for Recruiter Visibility', desc: 'Recruiters actively search LinkedIn using specific keywords. Our AI analyzes your profile and ensures it matches what recruiters are looking for.' },
                  { icon: 'fa-star', title: 'Stand Out in a Competitive Market', desc: "With millions of professionals on LinkedIn, a basic profile isn't enough. Get AI-powered insights to make your profile stronger, sharper, and more impactful." },
                  { icon: 'fa-search', title: 'Increase Your Profile Visibility', desc: "If your profile isn't optimized, it won't appear in recruiter searches. Our AI identifies missing keywords and gaps that affect your reach." },
                  { icon: 'fa-bullseye', title: 'Unlock More Career Opportunities', desc: 'A well-optimized profile increases your chances of getting noticed and shortlisted. Get instant, actionable suggestions to improve and grow faster.' },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: '20px', display: 'flex', gap: '14px', alignItems: 'flex-start', paddingBottom: i < 3 ? '20px' : '0', borderBottom: i < 3 ? '1px solid #e2e8f0' : 'none' }}>
                    <div style={{ width: '40px', height: '40px', background: '#f0eeff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`fas ${item.icon}`} style={{ fontSize: '18px', color: '#3d3b7a' }}></i>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#2c2a63', marginBottom: '4px' }}>{item.title}</h3>
                      <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
                <button onClick={() => setCurrentScreen('upload')}
                  style={{ background: '#3d3b7a', color: '#EDC9AF', padding: '14px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(61,59,122,0.28)', transition: 'all 0.2s', marginTop: '8px' }}
                  onMouseOver={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <i className="fas fa-search" style={{ marginRight: '8px' }}></i>Analyze My LinkedIn Profile Now
                </button>
              </div>
            </div>
          </div>

          {/* ══ BOTTOM BANNER ══ */}
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 64px' }}>
            <div className="bottom-banner-row" style={{ background: '#f5f5f5', borderRadius: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '20px 24px' }}>
              <div style={{ flex: '1', minWidth: '240px' }}>
                <h2 style={{ fontSize: 'clamp(18px, 2.4vw, 28px)', fontWeight: '800', color: '#2c2a63', marginBottom: '10px', lineHeight: '1.35' }}>AI-Powered LinkedIn Profile Analysis for Career Success</h2>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: '1.65' }}>Check your LinkedIn score and get actionable insights to boost your recruiter visibility</p>
                <button onClick={() => setCurrentScreen('upload')}
                  style={{ background: '#2c2a63', color: '#EDC9AF', padding: '13px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(44,42,99,0.28)', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  Check My Free LinkedIn Score
                </button>
              </div>
              <div style={{ flex: '1', minWidth: '220px', maxWidth: '300px', borderRadius: '16px', overflow: 'hidden', background: '#e8e5f8', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                <img src="/assets/Services/ats-linkedin.jpeg" alt="LinkedIn" style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }} />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (currentScreen === 'upload' || currentScreen === 'analyzing') {
    const steps = [
      { label: 'Fetching LinkedIn profile data', progress: 25 },
      { label: 'Analyzing keywords & visibility', progress: 50 },
      { label: 'Scoring profile sections', progress: 75 },
      { label: 'Generating AI recommendations', progress: 100 },
    ];
    return (
      <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <style>{`
          @media(max-width:768px){
            .upload-card-grid{grid-template-columns:1fr!important;}
            .upload-centered-card{padding:24px!important;max-width:100%!important;}
          }
        `}</style>
        <Navbar />
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: '100px', paddingBottom: '80px' }}>
          {showToast && <Toast />}
          {showBusyPopup && <BusyPopup onClose={() => setShowBusyPopup(false)} />}
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <button onClick={() => setCurrentScreen('landing')}
              style={{ background: '#3d3b7a', border: 'none', color: '#EDC9AF', fontSize: '15px', cursor: 'pointer', marginBottom: '30px', display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: '600', padding: '12px 24px', borderRadius: '50px', boxShadow: '0 2px 8px rgba(61,59,122,0.3)', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(61,59,122,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(61,59,122,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <i className="fas fa-home" style={{ fontSize: '18px' }}></i><span>Back to Home</span>
            </button>
            <div className="upload-card-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
              <div className="upload-centered-card" style={{ background: '#fff', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', maxWidth: '480px', width: '100%', margin: '0 auto' }}>
                <h2 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: '800', color: '#1e1b4b', marginBottom: '6px', textAlign: 'center' }}>
                  {currentScreen === 'analyzing' ? 'Analyzing Your LinkedIn Profile' : 'Analyze Your LinkedIn Profile'}
                </h2>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px', textAlign: 'center' }}>
                  {currentScreen === 'analyzing' ? 'Please wait while we analyze your profile...' : 'Get personalized recommendations to land your dream job.'}
                </p>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e1b4b', marginBottom: '8px' }}>
                    <i className="fas fa-briefcase" style={{ color: '#3d3b7a', marginRight: '6px' }}></i>
                    Target Role <span style={{ background: '#e2e8f0', color: '#64748b', padding: '2px 7px', borderRadius: '6px', fontSize: '10px', fontWeight: '600', marginLeft: '4px' }}>OPTIONAL</span>
                  </label>


                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                      <i className="fas fa-briefcase" style={{ fontSize: '14px' }}></i>
                    </div>
                    <input type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="Product Manager" disabled={currentScreen === 'analyzing'}
                      style={{ width: '100%', padding: '13px 14px 13px 42px', fontSize: '14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit', boxSizing: 'border-box', background: currentScreen === 'analyzing' ? '#f8fafc' : '#fff', color: '#1e1b4b' }}
                      onFocus={e => e.currentTarget.style.borderColor = '#3d3b7a'}
                      onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
                  </div>
                </div>
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e1b4b', marginBottom: '8px' }}>
                    <i className="fas fa-file-upload" style={{ color: '#3d3b7a', marginRight: '6px' }}></i>Upload LinkedIn PDF
                  </label>
                  <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}
                    style={{ border: '2px dashed #EDC9AF', borderRadius: '10px', padding: '18px', textAlign: 'center', cursor: 'pointer', background: uploadedFile ? '#f0fdf4' : '#fafafa' }}>
                    <input type="file" id="fileUploadLI" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} style={{ display: 'none' }} disabled={currentScreen === 'analyzing'} />
                    <label htmlFor="fileUploadLI" style={{ cursor: 'pointer', display: 'block' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                        <i className="fas fa-cloud-upload-alt" style={{ fontSize: '24px', color: '#3d3b7a' }}></i>
                      </div>
                      {uploadedFile ? (
                        <div>
                          <i className="fas fa-check-circle" style={{ fontSize: '14px', color: '#10b981', marginRight: '6px' }}></i>
                          <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '600' }}>{uploadedFile.name}</span>
                          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>Click to replace</p>
                        </div>
                      ) : (
                        <>
                          <p style={{ fontSize: '13px', color: '#3d3b7a', marginBottom: '2px', fontWeight: '600' }}>Click or drag & drop your LinkedIn PDF</p>
                          <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Go to LinkedIn → More → Save to PDF → Upload here</p>
                          <p style={{ fontSize: '11px', color: '#94a3b8' }}>PDF only • Max 2MB</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <i className="fas fa-lock" style={{ color: '#3d3b7a' }}></i>Your data is private. Analysis may take a few moments.
                </p>
                {(currentScreen === 'upload' || currentScreen === 'analyzing') && (() => {
                  const canAnalyze = !!uploadedFile && currentScreen !== 'analyzing';
                  return (
                    <button onClick={analyzeProfile} disabled={!uploadedFile || currentScreen === 'analyzing'}
                      style={{ width: '100%', background: canAnalyze ? '#3d3b7a' : '#94a3b8', color: '#EDC9AF', padding: '14px', fontSize: '15px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: canAnalyze ? 'pointer' : 'not-allowed', boxShadow: canAnalyze ? '0 4px 12px rgba(61,59,122,0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: canAnalyze ? 1 : 0.65, transition: 'all 0.2s' }}>
                      {currentScreen === 'analyzing' ? <><i className="fas fa-spinner fa-pulse"></i> Analyzing...</> : uploadedFile ? <><i className="fas fa-chart-line"></i> Start Analysis</> : <><i className="fas fa-exclamation-circle"></i> Upload your LinkedIn PDF to continue</>}
                    </button>
                  );
                })()}
              </div>
              <div>
                {currentScreen === 'analyzing' && (
                  <div style={{ background: '#fff', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
                    <AnalyzingAnimation />
                  </div>
                )}
                <div style={{ background: '#fff', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#3d3b7a', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className={`fas ${currentScreen === 'analyzing' ? 'fa-spinner fa-pulse' : 'fa-list-check'}`} style={{ color: '#3d3b7a' }}></i>
                    {currentScreen === 'analyzing' ? 'Analyzing Your Profile...' : 'What We Analyze'}
                  </h3>
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
                    {currentScreen === 'analyzing' ? steps.map((step, idx) => (
                      <div key={idx} style={{ marginBottom: idx < steps.length - 1 ? '20px' : '0', display: 'flex', alignItems: 'center' }}>
                        {analysisProgress >= step.progress ? <i className="fas fa-check-circle" style={{ fontSize: '22px', color: '#10b981', marginRight: '12px' }}></i>
                          : analysisProgress >= step.progress - 24 ? <i className="fas fa-spinner fa-pulse" style={{ fontSize: '20px', color: '#3d3b7a', marginRight: '12px' }}></i>
                            : <div style={{ width: '22px', height: '22px', border: '3px solid #e2e8f0', borderRadius: '50%', marginRight: '12px', flexShrink: 0 }} />}
                        <span style={{ color: analysisProgress >= step.progress ? '#3d3b7a' : '#94a3b8', fontSize: '15px', fontWeight: analysisProgress >= step.progress ? '600' : '400' }}>{step.label}</span>
                      </div>
                    )) : (
                      <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.8' }}>
                        {[
                          { icon: 'fa-search', text: 'Recruiter visibility score' },
                          { icon: 'fa-key', text: 'Keyword optimization analysis' },
                          { icon: 'fa-heading', text: 'Headline & About section strength' },
                          { icon: 'fa-briefcase', text: 'Experience relevance & impact' },
                          { icon: 'fa-star', text: 'Skills & endorsements review' },
                          { icon: 'fa-lightbulb', text: 'Actionable improvement roadmap' },
                        ].map((item, idx) => (
                          <div key={idx} style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className={`fas ${item.icon}`} style={{ fontSize: '15px', color: '#3d3b7a', flexShrink: 0 }}></i>
                            <span>{item.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (currentScreen === 'results' && linkedInData) {
    const sectionRows = [
      { label: 'Profile Completeness', score: linkedInData.detailedReport.profileCompleteness?.score || 0 },
      { label: 'Keyword Optimization', score: linkedInData.detailedReport.keywordOptimization?.score || 0 },
      { label: 'Headline Strength', score: linkedInData.detailedReport.headlineStrength?.score || 0 },
      { label: 'About Section', score: linkedInData.detailedReport.aboutSection?.score || 0 },
      { label: 'Experience Section', score: linkedInData.detailedReport.experienceSection?.score || 0 },
      { label: 'Skills & Endorsements', score: linkedInData.detailedReport.skillsEndorsements?.score || 0 },
    ];
    const cardAccents = [
      { tape: '#2c2a63', subheading: 'Complete all profile sections' },
      { tape: '#0077B5', subheading: 'Add recruiter-targeted keywords' },
      { tape: '#2c2a63', subheading: 'Craft a compelling headline' },
      { tape: '#0077B5', subheading: 'Write an impactful About section' },
      { tape: '#2c2a63', subheading: 'Quantify your achievements' },
      { tape: '#0077B5', subheading: 'Add & get endorsements for skills' },
    ];
    const totalIssues = sectionRows.reduce((acc, row) => acc + (row.score < 30 ? 3 : row.score >= 30 && row.score < 60 ? (row.score >= 45 ? 1 : 2) : 0), 0);

    const SectionCards = () => (
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
        {sectionRows.map((row, idx) => {
          const isGood = row.score >= 60;
          const issueCount = row.score < 30 ? 3 : row.score >= 30 && row.score < 60 ? (row.score >= 45 ? 1 : 2) : 0;
          const ca = cardAccents[idx];
          return (
            <div key={idx} style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(44,42,99,0.12)' }}>
              <div style={{ height: '4px', background: ca.tape }} />
              <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {isGood ? (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                ) : (
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2L10 10M10 2L2 10" stroke="white" strokeWidth="2.2" strokeLinecap="round" /></svg>
                    </div>
                    <div style={{ position: 'absolute', top: '-5px', right: '-5px', width: '17px', height: '17px', borderRadius: '50%', background: '#fbbf24', border: '1.5px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '900', color: '#7c2d12' }}>{issueCount}</div>
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#1e1b4b' }}>{row.label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: isGood ? '#10b981' : '#64748b', fontWeight: '500' }}>
                    {isGood ? 'Looking good — no issues found' : ca.subheading}
                  </p>
                </div>
                {!isGood && <span style={{ fontSize: '9px', fontWeight: '700', color: '#ef4444', flexShrink: 0 }}>Issues</span>}
              </div>
              <div style={{ height: '3px', background: ca.tape, opacity: 0.35 }} />
            </div>
          );
        })}
      </div>
    );

    return (
      <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <style>{`
        
          @media(max-width:768px){
            .results-main-grid{grid-template-columns:1fr!important;}
            .results-left-panel{position:relative!important;top:0!important;}
            .bottom-banner-inner{flex-direction:column-reverse!important;}
            .report-popup-body{flex-direction:column!important;}
            .report-popup-left{width:100%!important;border-right:none!important;border-bottom:1.5px solid #e2e8f0!important;padding:16px!important;}
          }
          .results-right-scroll::-webkit-scrollbar{width:4px;}
          .results-right-scroll::-webkit-scrollbar-track{background:#f1f5f9;}
          .results-right-scroll::-webkit-scrollbar-thumb{background:#c7d2fe;border-radius:4px;}
        `}</style>
        <Navbar />
        {showPaywall && <PaywallPopup onClose={() => setShowPaywall(false)} onPay={handlePaywallPay} />}
        {showUpgradePopup && (
          <UpgradePopup
            onClose={() => setShowUpgradePopup(false)}
            onUpgrade={() => {
              setShowUpgradePopup(false);
              if (linkedInData) {
                localStorage.setItem('linkedinAnalysisData', JSON.stringify({ linkedInData, linkedinUrl, targetRole }));
                localStorage.setItem('linkedinReturnIntent', 'fix');
              }
              navigate('/payment', {
                state: {
                  type: 'linkedin-optimization',
                  plan: 'linkedin',
                  planName: 'LinkedIn Optimization',
                  price: 199,
                  returnUrl: '/linkedin-checker',
                },
              });
            }}
          />
        )}
        {showReportPopup && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10003, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
            <div style={{ background: '#fff', borderRadius: '24px', maxWidth: 'min(1280px, calc(100vw - 24px))', width: '100%', maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 20px 60px rgba(30,27,75,0.25)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <button onClick={() => setShowReportPopup(false)} style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-times"></i>
              </button>
              <div style={{ padding: '24px 28px 16px', borderBottom: '1.5px solid #e2e8f0', flexShrink: 0 }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e1b4b', marginBottom: '4px' }}>Your LinkedIn Analysis</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>We found <strong style={{ color: '#ef4444' }}>{totalIssues} profile issues</strong> limiting your visibility</p>
              </div>
              <div className="report-popup-body" style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0, minWidth: 0 }}>
                <div className="report-popup-left" style={{ width: '340px', flexShrink: 0, borderRight: '1.5px solid #e2e8f0', padding: '16px 20px', overflowY: 'auto', background: '#fafafa' }}>
                  <CircularGauge score={linkedInData.linkedinScore} />
                  <div style={{ borderTop: '1px solid #e2e8f0', margin: '10px 0' }} />
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#1e1b4b', marginBottom: '6px' }}>Review our suggestions to see what you can fix.</p>
                  {sectionRows.map((row, idx) => <SectionCheckRow key={idx} label={row.label} score={row.score} />)}
                  <button onClick={() => { setShowReportPopup(false); handleFixOrAnalyze(); }}
                    style={{ marginTop: '16px', width: '100%', background: '#EDC9AF', color: '#3d3b7a', padding: '11px', fontSize: '13px', fontWeight: '800', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}>Fix Issues 
                    </button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px 24px', minWidth: 0, width: '100%' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#1e1b4b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-chart-bar" style={{ color: '#3d3b7a' }}></i> Your Resume
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', padding: '12px 14px', background: '#fff5f5', borderRadius: '10px', border: '1px solid #fecaca' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #f87171, #ef4444)', clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-camera" style={{ fontSize: '14px', color: 'white' }}></i>
                      </div>
                      {totalIssues > 0 && <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '18px', height: '18px', borderRadius: '50%', background: '#ef4444', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '900', color: '#fff' }}>{totalIssues}</div>}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1e1b4b' }}>Oh, no!</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>We found <strong style={{ color: '#ef4444' }}>{totalIssues} profile issues</strong> in your resume.</p>
                    </div>
                  </div>
                  <SectionCards />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #2c2a63, #3d3b7a)', borderRadius: '12px', padding: '14px 18px', marginTop: '16px', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#fff' }}>Fix my resume issues</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#EDC9AF' }}>with Careerblueprint</p>
                    </div>
                    <button onClick={() => { setShowReportPopup(false); handleFixOrAnalyze(); }}
                      style={{ background: '#EDC9AF', color: '#3d3b7a', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                      onMouseOut={e => e.currentTarget.style.opacity = '1'}>Fix Issues 
                        <i className="fa-solid fa-arrow-right" />
                      </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: '100px', paddingBottom: '20px' }}>
          {showToast && <Toast />}
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
            <button onClick={() => { setCurrentScreen('landing'); setTargetRole(''); setUploadedFile(null); setLinkedInData(null); setAnalysisProgress(0); }}
              style={{ background: '#3d3b7a', border: 'none', color: '#EDC9AF', fontSize: '15px', cursor: 'pointer', marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: '600', padding: '12px 24px', borderRadius: '50px', boxShadow: '0 2px 8px rgba(61,59,122,0.3)', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(61,59,122,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(61,59,122,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <i className="fas fa-home" style={{ fontSize: '18px' }}></i><span>Back to Home</span>
            </button>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h2 style={{ color: '#3d3b7a', fontSize: isMobile ? '22px' : '30px', marginBottom: '6px', fontWeight: '800' }}>LinkedIn Profile Analysis Complete</h2>
              <p style={{ color: '#64748b', fontSize: isMobile ? '13px' : '15px', margin: 0 }}>Your score and personalized recommendations</p>
            </div>
            <div className="results-main-grid" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px', alignItems: 'start', marginBottom: '32px' }}>
              <div className="results-left-panel" style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column' }}>
                <CircularGauge score={linkedInData.linkedinScore} />
                <div style={{ borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#1e1b4b', marginBottom: '4px' }}>Review our suggestions to see what you can fix.</h3>
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '14px' }}>Tap a section to learn more</p>
                  {sectionRows.map((row, idx) => <SectionCheckRow key={idx} label={row.label} score={row.score} />)}
                </div>
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowReportPopup(true)}
                    style={{ flex: 1, background: '#3d3b7a', color: '#EDC9AF', padding: '12px 10px', fontSize: '13px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.88'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                    <i className="fas fa-file-alt"></i> View Report
                  </button>
                  <button onClick={handleFixOrAnalyze}
                    style={{ flex: 1, background: '#EDC9AF', color: '#3d3b7a', padding: '12px 10px', fontSize: '13px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.background = '#e5b898'; }} onMouseOut={e => { e.currentTarget.style.background = '#EDC9AF'; }}>
                    <i className="fas fa-magic"></i> Analyze
                  </button>
                </div>
                <button onClick={() => {
                  const name = linkedInData?.userData?.fullName || 'User';
                  const score = linkedInData?.linkedinScore ?? 0;
                  const label = getScoreLabel(score);
                  const r = linkedInData?.detailedReport;
                  const msg = `LinkedIn Profile Score Report - CareerBlueprint\n\nName: ${name}\n\nOverall LinkedIn Score: ${score}/100\nProfile Strength: ${label}\n\nDetailed Score Breakdown:\n\nProfile Completeness -> ${r?.profileCompleteness?.score ?? 0}%\nKeyword Optimization -> ${r?.keywordOptimization?.score ?? 0}%\nHeadline Strength -> ${r?.headlineStrength?.score ?? 0}%\nAbout Section -> ${r?.aboutSection?.score ?? 0}%\nExperience Section -> ${r?.experienceSection?.score ?? 0}%\nSkills & Endorsements -> ${r?.skillsEndorsements?.score ?? 0}%\n\nWant a better score? Build your optimized resume at CareerBlueprint!`;
                  window.open(`https://wa.me/918124494755?text=${encodeURIComponent(msg)}`, '_blank');
                }} style={{ marginTop: '10px', width: '100%', background: '#3d3b7a', color: '#EDC9AF', padding: '12px', fontSize: '13px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(61,59,122,0.3)', transition: 'all 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Share Score on WhatsApp
                </button>
              </div>

              <div className="results-right-scroll" style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
                  <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#3d3b7a', margin: 0 }}>Your LinkedIn Analysis</h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '20px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1e1b4b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fas fa-chart-bar" style={{ color: '#3d3b7a' }}></i> Profile Insights
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                      <div style={{ position: 'relative', display: 'inline-flex' }}>
                        <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #f87171, #ef4444)', clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                          <i className="fas fa-camera" style={{ fontSize: '16px', color: 'white' }}></i>
                        </div>
                        {totalIssues > 0 && <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '20px', height: '20px', borderRadius: '50%', background: '#ef4444', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '900', color: '#fff' }}>{totalIssues}</div>}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1e1b4b' }}>Profile Issues Detected!</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>We found <strong style={{ color: '#ef4444' }}>{totalIssues} profile issues</strong> limiting your visibility:</p>
                      </div>
                    </div>
                    <SectionCards />
                  </div>
                  <div style={{ background: 'linear-gradient(135deg, #3d3b7a 0%, #2c2a63 100%)', borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '800', color: '#fff', margin: '0 0 4px' }}>Fix my LinkedIn profile issues</p>
                      <p style={{ fontSize: '12px', color: '#EDC9AF', margin: 0 }}>with Careerblueprint</p>
                    </div>
                    <button onClick={handleFixOrAnalyze}
                      style={{ background: '#EDC9AF', color: '#3d3b7a', border: 'none', borderRadius: '10px', padding: '10px 22px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(237,201,175,0.4)', transition: 'all 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                      Fix Issues 
                        <i className="fa-solid fa-arrow-right" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <BottomBanner onAnalyze={handleBuildResume} />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return null;
};

export default LinkedInScoreChecker;