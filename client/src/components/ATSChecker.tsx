import React, { useState, ChangeEvent, DragEvent, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../configs/api';
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";

interface DetailedReport {
  keywordsMatch?: { score: number; percentage: number; details: string; };
  skillsSection?: { score: number; percentage: number; details: string; };
  experienceRelevance?: { score: number; percentage: number; details: string; };
  educationCertifications?: { score: number; percentage: number; details: string; };
  resumeFormatting?: { score: number; percentage: number; details: string; };
  projectsAchievements?: { score: number; percentage: number; details: string; };
  parsedData?: {
    name: string; email: string; phone: string; summary: string; skills: string[];
    experience: Array<{ company: string; position: string; duration: string; responsibilities: string[]; }>;
    education: Array<{ institution: string; degree: string; year: string; }>;
    projects: Array<{ title: string; description: string; }>;
  };
}

interface ATSData {
  overallScore: number;
  userData?: { fullName: string; email: string; mobile: string; };
  detailedReport: DetailedReport;
}

interface Template {
  id: string; name: string; image: string; category: string; isPremium: boolean;
}

type ScreenType = 'landing' | 'upload' | 'analyzing' | 'results';

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

const getRisk = (s: number) => {
  if (s >= 70) return { text: 'Low Rejection Risk', bg: '#10b981', color: '#fff' };
  if (s >= 50) return { text: 'Medium Rejection Risk', bg: '#f59e0b', color: '#fff' };
  if (s >= 30) return { text: 'High Rejection Risk', bg: '#fb923c', color: '#fff' };
  return { text: 'Very High Rejection Risk', bg: '#ef4444', color: '#fff' };
};

const getScoreColor = (s: number) => {
  if (s >= 70) return '#10b981';
  if (s >= 50) return '#f59e0b';
  if (s >= 30) return '#fb923c';
  return '#ef4444';
};

const getCompanyCount = (s: number) => {
  if (s >= 70) return '3';
  if (s >= 50) return '5';
  if (s >= 30) return '8';
  return '9';
};

const getScoreLabel = (s: number) => {
  if (s >= 70) return 'Excellent';
  if (s >= 60) return 'Good';
  if (s >= 45) return 'Average';
  if (s >= 30) return 'Below Average';
  return 'Needs Improvement';
};


const CircularGauge: React.FC<{ score: number }> = ({ score }) => {
  const [animatedScore, setAnimatedScore] = React.useState(0);
  const radius = 44;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const filled = (animatedScore / 100) * circumference;
  const scoreCol = getScoreColor(score);
  const risk = getRisk(score);
  const cx = 60;
  const cy = 60;

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
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', flexWrap: 'nowrap' }}>
      <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={scoreCol}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={circumference - filled}
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              transform: 'rotate(-90deg)',
              transition: 'stroke-dashoffset 0.05s linear',
            }}
          />
        </svg>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', textAlign: 'center',
        }}>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#1e1b4b', lineHeight: 1 }}>
            {animatedScore}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', lineHeight: 1.2 }}>/100</div>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: '160px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1e1b4b' }}>
            ATS Score:{' '}
            <span style={{ color: scoreCol }}>{score}%</span>
          </p>
        </div>
        <div style={{
          display: 'inline-block', padding: '6px 16px', borderRadius: '8px',
          background: risk.bg, color: risk.color,
          fontSize: '13px', fontWeight: '700', marginBottom: '10px',
        }}>
          {risk.text}
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
          <strong style={{ color: '#1e1b4b' }}>
            {getCompanyCount(score)} out of 10 companies
          </strong>{' '}
          will reject this resume automatically.
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

  let bg = '#f0fdf4';
  let border = '#bbf7d0';
  let iconBg = '#10b981';
  let iconContent: React.ReactNode = (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  if (isMedium) {
    bg = '#fffbeb';
    border = '#fde68a';
    iconBg = '#f59e0b';
    iconContent = (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L2 21h20L12 3z" stroke="white" strokeWidth="2.2" strokeLinejoin="round" />
        <line x1="12" y1="10" x2="12" y2="15" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="12" cy="18.5" r="1" fill="white" />
      </svg>
    );
  } else if (isBad) {
    bg = '#fff5f5';
    border = '#fecaca';
    iconBg = '#ef4444';
    iconContent = (
      <span style={{ color: 'white', fontSize: '12px', fontWeight: '900', lineHeight: 1 }}>!</span>
    );
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '11px 14px', borderRadius: '10px', marginBottom: '8px',
      background: bg, border: `1px solid ${border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {iconContent}
        </div>
        <span style={{ fontWeight: '600', fontSize: '13px', color: '#1e1b4b' }}>{label}</span>
      </div>
      {!isGood && issues > 0 && (
        <div style={{
          minWidth: '24px', height: '24px', borderRadius: '50%',
          background: isMedium ? '#f59e0b' : '#ef4444',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: '900', color: '#fff', flexShrink: 0,
        }}>
          {issues}
        </div>
      )}
    </div>
  );
};


const quotes = [
  "Great resumes open great doors ✨",
  "Every job starts with a single application 🚀",
  "Your skills deserve to be seen 💼",
  "ATS-ready = recruiter-ready 🎯",
  "Optimizing your future, one keyword at a time 🔍",
  "Stand out from the crowd — we've got you 🌟",
  "Your dream job is one optimized resume away 💫",
  "Let AI do the heavy lifting for you 🤖",
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
    <p style={{
      fontSize: '14px', fontWeight: '700', color: '#3d3b7a',
      marginTop: '12px', marginBottom: '0', minHeight: '22px', textAlign: 'center',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(8px)',
    }}>
      {quotes[idx]}
    </p>
  );
};


const AnalyzingAnimation: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-4">
    <style>{`
      @keyframes mgBounce {
        0%, 100% { transform: translateY(0px) rotate(-8deg); }
        50%       { transform: translateY(-14px) rotate(8deg); }
      }
      @keyframes mgGlow {
        0%, 100% { filter: drop-shadow(0 4px 12px rgba(61,59,122,0.25)); }
        50%       { filter: drop-shadow(0 8px 24px rgba(61,59,122,0.55)); }
      }
      @keyframes scanLine {
        0%   { transform: translateY(-30px); opacity: 0; }
        20%  { opacity: 1; }
        80%  { opacity: 1; }
        100% { transform: translateY(30px); opacity: 0; }
      }
      @keyframes ripple {
        0%   { transform: scale(0.8); opacity: 0.8; }
        100% { transform: scale(1.6); opacity: 0; }
      }
      .mg-anim {
        animation: mgBounce 1.8s ease-in-out infinite, mgGlow 1.8s ease-in-out infinite;
        display: inline-block;
      }
    `}</style>
    <div className="relative flex items-center justify-center mb-3" style={{ width: 100, height: 100 }}>
      {[0, 1].map(i => (
        <div key={i} style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2px solid rgba(61,59,122,0.25)',
          animation: `ripple 2s ease-out ${i * 0.7}s infinite`,
        }} />
      ))}
      <div className="mg-anim">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle cx="30" cy="30" r="22" fill="rgba(237,201,175,0.18)" />
          <circle cx="30" cy="30" r="19" stroke="#3d3b7a" strokeWidth="5" fill="white" fillOpacity="0.95" />
          <circle cx="30" cy="30" r="14" fill="rgba(61,59,122,0.06)" />
          <circle cx="23" cy="23" r="5" fill="rgba(237,201,175,0.55)" />
          <line x1="44" y1="44" x2="63" y2="63" stroke="#3d3b7a" strokeWidth="7" strokeLinecap="round" />
          <line x1="20" y1="30" x2="40" y2="30" stroke="#EDC9AF" strokeWidth="2.5" strokeLinecap="round"
            style={{ animation: 'scanLine 1.8s ease-in-out infinite' }} />
        </svg>
      </div>
    </div>
    <div className="flex gap-1.5 mb-3">
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: i % 2 === 0 ? '#3d3b7a' : '#EDC9AF',
          animation: `mgBounce 1.2s ease-in-out ${i * 0.18}s infinite`,
        }} />
      ))}
    </div>
    <QuoteRotator />
  </div>
);


const ATS_HERO_IMAGES = [
  '/assets/Services/resume.png',
  '/assets/Services/professional-modern-preview.jpeg',
  '/assets/Services/boardline-cv-preview.jpeg',
];
const AtsHeroVisual: React.FC<{ cardAnimated: boolean }> = ({ cardAnimated }) => {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActiveIdx(prev => (prev + 1) % ATS_HERO_IMAGES.length);
        setAnimating(false);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <style>{`
        @keyframes gaugeArcFill { from { stroke-dashoffset: 220; } to { stroke-dashoffset: 121; } }
        .gauge-arc-anim { stroke-dasharray: 220; stroke-dashoffset: 220; animation: gaugeArcFill 1.5s cubic-bezier(0.4,0,0.2,1) 0.6s forwards; }
        @keyframes fillBar { from { width: 0%; } }
        .bar-anim { animation: fillBar 1.2s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes atsCardSlideIn { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes atsCardFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
        @keyframes atsLeft1Float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
        @keyframes atsHeroFadeIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes atsHeroFadeOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-20px); } }
        .ats-hero-img-enter { animation: atsHeroFadeIn 0.4s ease forwards; }
        .ats-hero-img-exit { animation: atsHeroFadeOut 0.4s ease forwards; }
        .ats-score-card-anim { animation: atsCardSlideIn 0.6s ease forwards, atsCardFloat 3.5s ease-in-out 0.6s infinite; }
        .ats-left1-anim { animation: atsLeft1Float 4s ease-in-out 0.3s infinite; }
      `}</style>

      <div
        className="relative flex items-center justify-center"
        style={{ height: '380px', zIndex: 1 }}
      >
        {cardAnimated && (
          <div
            className="ats-score-card-anim absolute bg-white z-10"
            style={{
              top: '8px',
              left: '0px',
              width: '155px',
              borderRadius: '0px',
              padding: '12px',
              boxShadow: '0 10px 36px rgba(61,59,122,0.18)',
            }}
          >
            <p style={{ fontSize: '10px', fontWeight: '700', color: '#3d3b7a', margin: '0 0 6px', textAlign: 'center' }}>Resume ATS Score</p>
            <div style={{ position: 'relative', width: '110px', height: '64px', margin: '0 auto 2px' }}>
              <svg width="110" height="64" viewBox="0 0 130 80" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="atsGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fca5a5" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                </defs>
                <path d="M 12 75 A 53 53 0 0 1 118 75" fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" />
                <path className="gauge-arc-anim" d="M 12 75 A 53 53 0 0 1 118 75" fill="none" stroke="url(#atsGaugeGrad)" strokeWidth="12" strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: '900', color: '#1e1b4b', margin: 0, lineHeight: 1 }}>45%</p>
              </div>
            </div>
            <div style={{ margin: '4px 0 6px' }} />
            {[
              { label: 'Keyword Mismatch', pct: 30, delay: '1.0s' },
              { label: 'Poor Structure', pct: 45, delay: '1.2s' },
              { label: 'Complex Formatting', pct: 25, delay: '1.4s' },
            ].map((bar, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? '5px' : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '8px', fontWeight: '600', color: '#475569' }}>{bar.label}</span>
                  <span style={{ fontSize: '8px', fontWeight: '700', color: '#ef4444' }}>{bar.pct}%</span>
                </div>
                <div style={{ height: '4px', background: '#fee2e2', borderRadius: '3px', overflow: 'hidden' }}>
                  <div className="bar-anim" style={{ height: '100%', width: `${bar.pct}%`, background: 'linear-gradient(90deg, #fca5a5, #ef4444)', animationDelay: bar.delay, animationDuration: '1.2s' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        <img
          key={activeIdx}
          src={ATS_HERO_IMAGES[activeIdx]}
          alt="Resume"
          className={`relative shadow-2xl ${animating ? 'ats-hero-img-exit' : 'ats-hero-img-enter'}`}
          style={{
            width: 'clamp(220px, 52vw, 360px)',
            aspectRatio: '3/4',
            objectFit: 'cover',
            zIndex: 2,
            borderRadius: '0px',
          }}
        />

        {cardAnimated && (
          <img
            src="/assets/Services/left1.png"
            alt="Magnifying Glass"
            className="ats-left1-anim absolute z-10"
            style={{
              bottom: '0px',
              right: '0px',
              width: 'clamp(130px, 40vw, 200px)',
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
const BusyPopupComponent: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
    zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
  }}>
    <div style={{
      background: '#fff', borderRadius: '20px', padding: '32px 28px',
      maxWidth: '360px', width: '100%', textAlign: 'center',
      border: '2px solid #3d3b7a', boxShadow: '0 8px 32px rgba(61,59,122,0.2)'
    }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#3d3b7a', marginBottom: '10px' }}>
        Our server is a little busy right now
      </h3>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: '1.6' }}>
        Don't close this tab — your resume is still being analyzed.
        We'll have your results ready in just a moment! 🚀
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '10px', height: '10px', borderRadius: '50%', background: '#3d3b7a',
            animation: `busyDot 1.2s ease-in-out ${i * 0.3}s infinite`
          }} />
        ))}
      </div>
      <style>{`@keyframes busyDot { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }`}</style>
      <button onClick={onClose} style={{
        marginTop: '20px', background: 'transparent', border: '1.5px solid #3d3b7a',
        color: '#3d3b7a', padding: '8px 22px', borderRadius: '8px',
        fontSize: '13px', fontWeight: '700', cursor: 'pointer'
      }}>Got it, I'll wait</button>
    </div>
  </div>
);

const BottomBanner: React.FC<{ score: number; onBuild: () => void }> = ({ onBuild }) => {
  return (
    <div style={{ maxWidth: '1100px', margin: '58px auto 0', padding: '0 16px 48px' }}>
      <div className="bottom-banner-inner" style={{ background: '#f1f0f8', borderRadius: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '32px 36px', flexDirection: 'row' }}>
        <div style={{ flex: '1', minWidth: '220px', maxWidth: '520px' }}>
          <h2 style={{ fontSize: 'clamp(18px, 2.4vw, 26px)', fontWeight: '800', color: '#2c2a63', marginBottom: '10px', lineHeight: '1.35' }}>
            Build the resume that finally gets a yes.
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: '1.65' }}>
            Start in minutes, tailor with AI, and send applications you're proud of
          </p>
          <button
            onClick={onBuild}
            style={{ background: '#2c2a63', color: '#EDC9AF', padding: '13px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(44,42,99,0.28)', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Create my resume now
          </button>
        </div>
        <div style={{ flex: '1', minWidth: '220px', maxWidth: '300px', borderRadius: '16px', overflow: 'hidden', background: '#e8e5f8', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
          <img src="/assets/Services/resume-banner.jpg" alt="Resume" style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }} />
        </div>
      </div>
    </div>
  );
};
const ATSChecker: React.FC = () => {
  const navigate = useNavigate();

  const [showReportModal, setShowReportModal] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [atsData, setAtsData] = useState<ATSData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');


  const [jobDescription, setJobDescription] = useState<string>('');

  const [selectedJobRole, setSelectedJobRole] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cardAnimated, setCardAnimated] = useState(false);
  const [showBusyPopup, setShowBusyPopup] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentScreen === 'landing') {
      const timer = setTimeout(() => setCardAnimated(true), 300);
      return () => clearTimeout(timer);
    } else {
      setCardAnimated(false);
    }
  }, [currentScreen]);

  useEffect(() => {
    if (currentScreen !== 'analyzing') { setShowBusyPopup(false); return; }
    const timer = setTimeout(() => setShowBusyPopup(true), 60000);
    return () => clearTimeout(timer);
  }, [currentScreen]);

  useEffect(() => {
    if (currentScreen === 'results') setShowBusyPopup(false);
  }, [currentScreen]);

  const jobDescriptionSamples = [
    { id: 'full-stack-developer', title: 'Full Stack Developer', category: 'Technology', description: `We are seeking a Full Stack Developer with strong expertise in designing, developing, and maintaining scalable web applications.\n\nKey Responsibilities:\n- Develop end-to-end web applications using modern frontend and backend frameworks\n- Design and implement RESTful and GraphQL APIs\n- Build scalable backend services and integrate third-party APIs\n\nSkills & Keywords:\nJavaScript, TypeScript, React, Angular, Node.js, Java, Python, REST API, GraphQL, SQL, NoSQL, MongoDB, PostgreSQL, MySQL, Microservices, Cloud (AWS/Azure/GCP), CI/CD, Docker, Git, Agile, SDLC` },
    { id: 'react-developer', title: 'React Developer', category: 'Technology', description: `We are looking for a React Developer responsible for building high-performance, responsive user interfaces using React.js.\n\nSkills & Keywords:\nReact.js, JavaScript (ES6+), TypeScript, Redux, Context API, HTML5, CSS3, Tailwind, Material UI, REST APIs, Webpack, Vite, Git, Agile, Jest, Frontend Optimization` },
    { id: 'python-developer', title: 'Python Developer', category: 'Technology', description: `We are seeking a Python Developer to build robust backend systems, automation scripts, and data-driven applications.\n\nSkills & Keywords:\nPython, Django, Flask, FastAPI, REST APIs, Microservices, SQL, PostgreSQL, MySQL, MongoDB, Data Structures, Algorithms, AWS, Docker, CI/CD, Unit Testing, Agile` },
    { id: 'java-developer', title: 'Java Developer', category: 'Technology', description: `We are hiring a Java Developer to design and develop enterprise-grade applications.\n\nSkills & Keywords:\nJava, Spring Boot, Spring MVC, Hibernate, JPA, RESTful APIs, Microservices, SQL, Oracle, MySQL, Kafka, Docker, Kubernetes, AWS, CI/CD, Agile, SDLC` },
    { id: 'nodejs-developer', title: 'Node.js Developer', category: 'Technology', description: `We are looking for a Node.js Developer to build scalable server-side applications and APIs.\n\nSkills & Keywords:\nNode.js, Express.js, JavaScript, TypeScript, REST APIs, GraphQL, MongoDB, PostgreSQL, Redis, Microservices, JWT, OAuth, AWS, Docker, CI/CD, Agile` },
    { id: 'data-scientist', title: 'Data Scientist', category: 'Data & AI', description: `We are seeking a Data Scientist to analyze large datasets, build predictive models, and deliver actionable business insights.\n\nSkills & Keywords:\nPython, R, SQL, Machine Learning, Statistical Analysis, Data Visualization, Pandas, NumPy, Scikit-learn, TensorFlow, Power BI, Tableau, Big Data, AWS, Data Mining` },
    { id: 'devops-engineer', title: 'DevOps Engineer', category: 'Infrastructure', description: `We are seeking a DevOps Engineer to automate infrastructure, CI/CD pipelines, and deployment processes.\n\nSkills & Keywords:\nDevOps, CI/CD, Jenkins, GitHub Actions, Docker, Kubernetes, Terraform, AWS, Azure, Linux, Monitoring, Cloud Security, Automation, Agile` },
    { id: 'ui-ux-designer', title: 'UI/UX Designer', category: 'Design', description: `We are seeking a UI/UX Designer to create intuitive, user-centric digital experiences.\n\nSkills & Keywords:\nUI/UX Design, Figma, Adobe XD, Wireframing, Prototyping, User Research, Usability Testing, Design Systems, Accessibility, Responsive Design` },
    { id: 'product-manager', title: 'Product Manager', category: 'Product', description: `We are hiring a Product Manager to define product vision, roadmap, and delivery strategy.\n\nSkills & Keywords:\nProduct Management, Roadmap Planning, Stakeholder Management, Agile, Scrum, User Stories, Market Research, KPI, OKRs, Data-Driven Decision Making` },
    { id: 'frontend-developer', title: 'Frontend Developer', category: 'Technology', description: `We are seeking a Frontend Developer to design and develop responsive, high-performance user interfaces.\n\nSkills & Keywords:\nHTML5, CSS3, JavaScript (ES6+), React, Angular, Vue.js, Responsive Design, REST APIs, Web Performance Optimization, Cross-Browser Compatibility, Git, Agile` },
    { id: 'backend-developer', title: 'Backend Developer', category: 'Technology', description: `We are hiring a Backend Developer to build scalable, secure, and high-performance server-side applications.\n\nSkills & Keywords:\nJava, Python, Node.js, Spring Boot, Django, REST APIs, GraphQL, Microservices, SQL, NoSQL, PostgreSQL, MySQL, MongoDB, Cloud (AWS/Azure/GCP), Docker, CI/CD, Agile` },
    { id: 'qa-engineer', title: 'QA Engineer', category: 'Quality', description: `We are seeking a QA Engineer to ensure the quality, reliability, and performance of software applications.\n\nSkills & Keywords:\nSoftware Testing, Manual Testing, Automation Testing, Selenium, API Testing, TestNG, JUnit, Regression Testing, Bug Tracking, SDLC, Agile, CI/CD, Quality Assurance` },
    { id: 'business-analyst', title: 'Business Analyst', category: 'Business', description: `We are looking for a Business Analyst to bridge the gap between business stakeholders and technical teams.\n\nSkills & Keywords:\nBusiness Analysis, Requirement Gathering, BRD, FRD, User Stories, Stakeholder Management, Process Mapping, SQL, Data Analysis, Agile, Scrum, UAT, Documentation` },
    { id: 'financial-analyst', title: 'Financial Analyst', category: 'Finance', description: `We are hiring a Financial Analyst to support financial planning, analysis, and decision-making.\n\nSkills & Keywords:\nFinancial Analysis, Budgeting, Forecasting, Financial Modeling, Advanced Excel, Power BI, Tableau, KPI Analysis, Risk Assessment, Business Intelligence, Accounting Principles, Strategic Planning` }
  ];

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
    { id: "codepro-resume", name: "CodePro", image: "/templates/codepro-resume-preview.jpeg", category: "Two-column", isPremium: true },
  ];



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const showToastMessage = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleTemplateSelect = async (template: Template) => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('pendingTemplateId', template.id);
      localStorage.setItem('pendingTemplateName', template.name);
      localStorage.setItem('redirectAfterLogin', 'ats-template-selected');
      showToastMessage('Please login to create your resume', 'info');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }
    try {
      showToastMessage('Preparing your template...', 'info');
      const { data } = await api.post('/resumes/create', { title: `${template.name} Resume`, template: template.id });
      showToastMessage("Great choice! Let's build your resume 🎉", 'success');
      setTimeout(() => navigate(`/app/builder/${data.resume._id}`), 500);
    } catch (error: any) {
      showToastMessage(error?.response?.data?.message || 'Failed to create resume', 'error');
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) { showToastMessage('Invalid file type. Only PDF, DOC, DOCX, and TXT are allowed.', 'error'); return; }
    if (file.size > 2 * 1024 * 1024) { showToastMessage('File size must be less than 2MB', 'error'); return; }
    setUploadedFile(file);
    showToastMessage('File uploaded successfully!', 'success');
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>;
      handleFileUpload(fakeEvent);
    }
  };


  const fetchWithRetry = async (fn: () => Promise<any>, retries = 2, delay = 4000) => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      if (i === retries) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
};


const analyzeResume = async () => {
  if (!uploadedFile) { showToastMessage('Please upload a resume first', 'error'); return; }
  if (!jobDescription.trim()) { showToastMessage('Please provide a job description to analyze your resume', 'error'); return; }
 
  setCurrentScreen('analyzing');
 
  try {
    const formDataToSend = new FormData();
    formDataToSend.append('resume', uploadedFile);
    formDataToSend.append('jobDescription', jobDescription.trim());
 
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 25;
      setAnalysisProgress(progress);
      if (progress >= 100) clearInterval(progressInterval);
    }, 800);
 
  const response = await fetchWithRetry(() =>
  api.post('/ats/analyze', formDataToSend, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
);
    clearInterval(progressInterval);
    setAnalysisProgress(100);
 
    if (response.data.success) {
      const atsScore = response.data.data.atsScore;
 
      setAtsData({
        overallScore: atsScore,
        userData: response.data.data.userData,
        detailedReport: response.data.data.detailedReport,
      });
 
      // ✅ NEW: Save ATS score to user profile (silent — never blocks UI)
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await api.put(
            '/users/update-scores',
            { atsScore },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('✅ ATS score saved to profile:', atsScore);
        }
      } catch (saveError) {
        // Silent fail — score display still works, just won't persist to profile
        console.warn('⚠️ ATS score save failed (non-blocking):', saveError);
      }
 
      setTimeout(() => setCurrentScreen('results'), 500);
    } else {
      showToastMessage('Analysis failed. Please try again.', 'error');
      setCurrentScreen('upload');
    }
  } catch (error: any) {
    showToastMessage(
      error.response?.data?.message || 'Failed to analyze resume. Please try again.',
      'error'
    );
    setCurrentScreen('upload');
    setAnalysisProgress(0);
  }
};

  const handleBuildWithCareerBlueprint = () => {
    const token = localStorage.getItem('token');
    if (token) { navigate('/app'); }
    else { localStorage.setItem('redirectAfterLogin', 'resume-builder'); showToastMessage('Please login to access resume builder', 'info'); setTimeout(() => navigate('/login'), 1000); }
  };

  const Toast = () => (
    <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ffffff', color: '#000000', padding: '14px 24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', zIndex: 10000, display: 'flex', alignItems: 'center', gap: '12px', minWidth: '280px', maxWidth: '90vw' }}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      {toastType === 'success' && <i className="fas fa-check-circle" style={{ fontSize: '20px', color: '#10b981' }}></i>}
      {toastType === 'error' && <i className="fas fa-times-circle" style={{ fontSize: '20px', color: '#ef4444' }}></i>}
      {toastType === 'info' && <i className="fas fa-info-circle" style={{ fontSize: '20px', color: '#3b82f6' }}></i>}
      <span style={{ fontSize: '14px', fontWeight: '600', flex: 1 }}>{toastMessage}</span>
    </div>
  );

  const handleSampleSelect = (sampleDescription: string, sampleTitle: string) => {
    setJobDescription(sampleDescription);
    setSelectedJobRole(sampleTitle);
    setIsDropdownOpen(false);
    showToastMessage(`${sampleTitle} job description loaded!`, 'success');
  };

  if (currentScreen === 'landing') {
    return (
      <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <style>{`
          @keyframes floatUpDown { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          @keyframes floatLeftRight { 0%, 100% { transform: translateX(0px); } 50% { transform: translateX(8px); } }
          @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0px); } }
          @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0px); } }
          @keyframes gaugeArcFill { from { stroke-dashoffset: 220; } to { stroke-dashoffset: 121; } }
          .gauge-arc-anim { stroke-dasharray: 220; stroke-dashoffset: 220; animation: gaugeArcFill 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards; }
          @keyframes fillBar { from { width: 0%; } }
          .bar-anim { animation: fillBar 1.2s cubic-bezier(0.4,0,0.2,1) forwards; }
          .ats-card-float { animation: slideInLeft 0.6s ease forwards, floatLeftRight 4s ease-in-out 0.6s infinite; }
          .info-card-float { animation: slideInRight 0.6s ease 0.2s both, floatUpDown 3.8s ease-in-out 0.8s infinite; }
          .upload-preview { transition: box-shadow 0.25s, transform 0.25s; cursor: pointer; }
          .upload-preview:hover { box-shadow: 0 6px 22px rgba(61,59,122,0.16); transform: translateY(-2px); }
          .feat-card { transition: transform 0.25s, box-shadow 0.25s; }
          .feat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(61,59,122,0.14); }
       @keyframes liLeft1Float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
.li-left1-anim { animation: liLeft1Float 4s ease-in-out 0.3s infinite; }

.mobile-back { display: none; }
@media (max-width: 768px) { .mobile-back { display: block; } }

@media (max-width: 1024px) { .hero-grid { grid-template-columns: 1fr !important; } .hero-visual-wrap { height: 380px !important; margin-top: 16px; } }
@media (max-width: 640px) {
  .hero-grid { display: flex !important; flex-direction: column-reverse !important; }
  .hero-visual-wrap { height: 380px !important; }
  .ats-score-card { width: 130px !important; left: 0px !important; top: 8px !important; padding: 10px 10px 8px !important; }
  .ats-score-card > p:first-child { font-size: 9px !important; margin-bottom: 4px !important; }
  .ats-score-card-pct { font-size: 16px !important; }
  .ats-score-card-label { font-size: 8px !important; margin: 2px 0 6px !important; }
  .ats-bar-row span { font-size: 7px !important; }
  .ats-bar-row .bar-track { height: 3px !important; }
  .info-card-right { width: 128px !important; right: 4px !important; top: 8px !important; padding: 10px 10px 8px !important; }
  .hiw-steps-container { flex-direction: row !important; flex-wrap: nowrap !important; align-items: flex-start !important; justify-content: center !important; gap: 0 !important; }
  .hiw-step { width: auto !important; flex: 1 !important; min-width: 0 !important; padding: 0 2px !important; }
  .hiw-icon-wrap { width: 60px !important; height: 60px !important; margin-bottom: 8px !important; }
  .hiw-inner { width: 30px !important; height: 30px !important; }
  .hiw-inner i { font-size: 12px !important; }
  .hiw-step h3 { font-size: 9px !important; margin-bottom: 3px !important; }
  .hiw-step p { font-size: 7.5px !important; line-height: 1.4 !important; }
  .hiw-divider { display: none !important; }
  .bottom-banner-row { flex-direction: column-reverse !important; }
}
        `}</style>

        <Navbar />
        <div style={{ minHeight: '100vh', background: '#ffffff', paddingTop: '80px' }}>
          {showToast && <Toast />}
          {showBusyPopup && <BusyPopupComponent onClose={() => setShowBusyPopup(false)} />}

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
              <div>
                <div style={{ display: 'inline-block', background: '#EDC9AF', color: '#3d3b7a', padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '20px', letterSpacing: '0.5px' }}>
                  RESUME CHECKER
                </div>
                <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 48px)', fontWeight: '800', color: '#3d3b7a', marginBottom: '16px', lineHeight: '1.15' }}>
                  Get Your ATS Resume<br />Score in 10 Seconds
                </h1>
                <p style={{ fontSize: 'clamp(14px, 1.4vw, 17px)', color: '#64748b', marginBottom: '28px', lineHeight: '1.65' }}>
                  Instant AI-powered feedback to help you pass ATS and land interviews
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <button
                    onClick={() => setCurrentScreen('upload')}
                    style={{ background: '#3d3b7a', color: '#EDC9AF', padding: '13px 26px', fontSize: '14px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(61,59,122,0.28)', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Check My Resume – Free
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>No signup required • Instant results</p>

                <div
                  className="upload-preview"
                  onClick={() => setCurrentScreen('upload')}
                  style={{ border: '2px dashed #c4b8f0', borderRadius: '14px', padding: '22px 20px', background: '#fafbff', maxWidth: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '8px' }}
                >
                  <div style={{ width: '46px', height: '46px', background: '#3d3b7a', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-cloud-upload-alt" style={{ fontSize: '20px', color: '#EDC9AF' }}></i>
                  </div>
                  <p style={{ fontWeight: '700', color: '#3d3b7a', fontSize: '15px', margin: 0 }}>Drop file or click to browse</p>
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>PDF, DOC, DOCX, TXT • Max 2MB</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', maxWidth: '380px', marginTop: '16px', flexDirection: 'row-reverse', justifyContent: 'flex-end' }}>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                    Trusted by <strong style={{ color: '#3d3b7a' }}>10,000+</strong> job seekers
                  </p>
                  <div style={{ display: 'flex' }}>
                    {[
                      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
                      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
                      'https://randomuser.me/api/portraits/men/75.jpg',
                    ].map((src, i) => (
                      <img key={i} src={src} alt="user" style={{ width: '30px', height: '30px', borderRadius: '50%', border: '2px solid #fff', marginLeft: i === 0 ? 0 : '-9px', objectFit: 'cover' }} />
                    ))}
                  </div>
                </div>
              </div>


              {/* RIGHT: Visual — auto-scrolling 3-image carousel */}
              <AtsHeroVisual cardAnimated={cardAnimated} />
            </div>
          </div>

          {/* ══ HOW IT WORKS ══ */}
          <div style={{ background: '#faf9ff', padding: '56px 24px' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '44px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#EDC9AF', color: '#3d3b7a', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '14px' }}>✦ Simple Process</div>
                <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: '800', color: '#2c2a63', margin: '0 0 8px' }}>How it works</h2>
                <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Get your ATS score in 3 easy steps</p>
              </div>
              <div className="hiw-steps-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', position: 'relative', zIndex: 0 }}>
                {[
                  { icon: 'fa-file-upload', title: '1. Upload Resume', desc: 'Upload your resume instantly.' },
                  { icon: 'fa-chart-bar', title: '2. Get ATS Score', desc: 'Get your score and insights in seconds.' },
                  { icon: 'fa-download', title: '3. Improve & Download', desc: 'Apply fixes and download a better resume.' },
                ].map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="hiw-step" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '210px', padding: '0 10px', cursor: 'default' }}>
                      <div className="hiw-divider" style={{ position: 'absolute', top: '55px', left: '32%', right: '32%', borderTop: '3px dotted #2c2a63', zIndex: -1 }} />
                      <div className="hiw-icon-wrap" style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid #2c2a63' }} />
                        <div style={{ position: 'absolute', inset: '6px', borderRadius: '50%', border: '4px solid #EDC9AF' }} />
                        <div style={{ position: 'absolute', inset: '12px', borderRadius: '50%', border: '4px solid #2c2a63' }} />
                        <div style={{ position: 'absolute', inset: '18px', borderRadius: '50%', background: '#fff' }} />
                        <div className="hiw-inner" style={{ position: 'relative', zIndex: 1, width: '54px', height: '54px', borderRadius: '50%', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className={`fas ${step.icon}`} style={{ fontSize: '22px', color: '#2c2a63' }}></i>
                        </div>
                      </div>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#2c2a63', marginBottom: '6px' }}>{step.title}</h3>
                      <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>{step.desc}</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* ══ AI CHECKER CARDS ══ */}
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 24px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2c2a63 0%, #3d3b7a 100%)', borderRadius: '20px', padding: '40px 44px', marginBottom: '36px', textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(18px, 2.5vw, 30px)', fontWeight: '800', color: '#fff', margin: '0 0 10px', lineHeight: '1.3' }}>
                Our AI-powered resume checker goes beyond typos and punctuation
              </h2>
              <p style={{ color: '#EDC9AF', fontSize: '15px', margin: 0 }}>
                We've built-in AI to help you create a resume that's tailored to the position you're applying for.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {[
                { icon: 'fa-align-left', title: 'Format', items: ['File format and size', 'Resume length', 'Bullet points with suggestions'] },
                { icon: 'fa-layer-group', title: 'Content', items: ['ATS parse rate', 'Repetition of words and phrases', 'Spelling and grammar'] },
                { icon: 'fa-id-card', title: 'Resume sections', items: ['Contact information', 'Essential sections', 'Personality showcase with tips'] },
                { icon: 'fa-paint-brush', title: 'Style', items: ['Resume design', 'Email address', 'Usage of active voice'] },
              ].map((card, idx) => (
                <div key={idx} className="feat-card" style={{ background: '#fff', borderRadius: '16px', padding: '28px 24px', boxShadow: '0 4px 16px rgba(61,59,122,0.09)', border: '1px solid #ede9f8' }}>
                  <div style={{ width: '42px', height: '42px', background: '#f0eeff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <i className={`fas ${card.icon}`} style={{ fontSize: '19px', color: '#3d3b7a' }}></i>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#2c2a63', marginBottom: '12px' }}>{card.title}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {card.items.map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#475569' }}>
                        <i className="fas fa-check-circle" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0, fontSize: '13px' }}></i>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ══ BOTTOM BANNER ══ */}
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 64px' }}>
            <div className="bottom-banner-row" style={{ background: '#f5f5f5', borderRadius: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '20px 24px' }}>
              <div style={{ flex: '1', minWidth: '240px' }}>
                <h2 style={{ fontSize: 'clamp(18px, 2.4vw, 28px)', fontWeight: '800', color: '#2c2a63', marginBottom: '10px', lineHeight: '1.35' }}>
                  Optimize Your Resume for Success With Our ATS Checker
                </h2>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: '1.65' }}>
                  Upload your resume from any device to get your score and receive personalized suggestions to pass ATS scans and stand out to recruiters.
                </p>
                <button
                  onClick={() => setCurrentScreen('upload')}
                  style={{ background: '#2c2a63', color: '#EDC9AF', padding: '13px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(44,42,99,0.28)', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Check My Resume – Free
                </button>
              </div>
              <div style={{ flex: '1', minWidth: '220px', maxWidth: '300px', borderRadius: '16px', overflow: 'hidden', background: '#e8e5f8', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                <img src="/assets/Services/Ats.png" alt="Resume" style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }} />
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
      { label: 'Parsing your resume', progress: 25 },
      { label: 'Extracting contact info', progress: 50 },
      { label: 'Analyzing keywords', progress: 75 },
      { label: 'Generating score', progress: 100 }
    ];
    const isMobile = window.innerWidth <= 768;

    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', background: '#ffffff', paddingTop: '100px', paddingBottom: '80px' }}>
          {showToast && <Toast />}
          {showBusyPopup && <BusyPopupComponent onClose={() => setShowBusyPopup(false)} />}

          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <button
              onClick={() => setCurrentScreen('landing')}
              style={{ background: '#3d3b7a', border: 'none', color: '#EDC9AF', fontSize: '15px', cursor: 'pointer', marginBottom: '30px', display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: '600', padding: '12px 24px', borderRadius: '50px', boxShadow: '0 2px 8px rgba(61,59,122,0.3)', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(61,59,122,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(61,59,122,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
              <i className="fas fa-home" style={{ fontSize: '18px' }}></i>
              <span>Back to Home</span>
            </button>

            <h2 style={{ color: '#3d3b7a', fontSize: isMobile ? '24px' : '32px', marginBottom: '10px', fontWeight: '800' }}>
              {currentScreen === 'upload' ? 'Upload Your Resume' : 'Analyzing Your Resume'}
            </h2>
            <p style={{ color: '#64748b', fontSize: isMobile ? '14px' : '16px', marginBottom: '30px' }}>
              {currentScreen === 'upload' ? 'Upload your resume and provide the job description for accurate analysis' : 'Please wait while we analyze your resume...'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '30px', background: '#fff', padding: isMobile ? '24px' : '40px', borderRadius: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#3d3b7a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-file-upload" style={{ color: '#3d3b7a' }}></i> Upload Resume
                </h3>
                <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} style={{ border: '3px dashed #EDC9AF', borderRadius: '16px', padding: isMobile ? '30px 20px' : '40px 20px', textAlign: 'center', cursor: 'pointer', background: uploadedFile ? '#f0fdf4' : '#fafafa', marginBottom: '20px' }}>
                  <input type="file" id="fileUpload" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} style={{ display: 'none' }} />
                  <label htmlFor="fileUpload" style={{ cursor: 'pointer', display: 'block' }}>
                    <i className="fas fa-cloud-upload-alt" style={{ fontSize: isMobile ? '32px' : '40px', color: '#3d3b7a', marginBottom: '16px' }}></i>
                    {uploadedFile ? (
                      <div>
                        <i className="fas fa-check-circle" style={{ fontSize: '20px', color: '#10b981', marginRight: '8px' }}></i>
                        <span style={{ color: '#10b981', fontSize: '15px', fontWeight: '600', wordBreak: 'break-word' }}>{uploadedFile.name}</span>
                        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '10px' }}>Click to replace</p>
                      </div>
                    ) : (
                      <>
                        <p style={{ fontSize: '16px', color: '#3d3b7a', marginBottom: '6px', fontWeight: '600' }}>Drop file or click to browse</p>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>PDF, DOC, DOCX, TXT • Max 2MB</p>
                      </>
                    )}
                  </label>
                </div>

                <div ref={dropdownRef} style={{ marginBottom: '20px', position: 'relative', zIndex: isDropdownOpen ? 9999 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#3d3b7a', margin: 0, flex: 1 }}>Select Job Description</h3>
                    <span style={{ background: '#3d3b7a', color: '#EDC9AF', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>REQUIRED</span>
                  </div>
                  <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ width: '100%', padding: isMobile ? '12px 16px' : '14px 18px', fontSize: isMobile ? '14px' : '15px', fontWeight: '600', color: selectedJobRole ? '#10b981' : '#3d3b7a', background: '#ffffff', border: selectedJobRole ? '2px solid #10b981' : '2px solid #3d3b7a', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s', position: 'relative', zIndex: isDropdownOpen ? 10000 : 100, boxSizing: 'border-box' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedJobRole || 'Choose a job role...'}</span>
                    <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'}`} style={{ color: selectedJobRole ? '#10b981' : '#3d3b7a', fontSize: '14px', flexShrink: 0, marginLeft: '8px' }}></i>
                  </div>
                  {isDropdownOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: '#ffffff', border: '2px solid #3d3b7a', borderRadius: '12px', boxShadow: '0 8px 20px rgba(61,59,122,0.25)', maxHeight: '300px', overflowY: 'auto', zIndex: 10001 }}>
                      {jobDescriptionSamples.map(sample => (
                        <div key={sample.id} onClick={() => handleSampleSelect(sample.description, sample.title)} style={{ padding: isMobile ? '10px 14px' : '12px 18px', cursor: 'pointer', borderBottom: '1px solid #e2e8f0', fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: '#3d3b7a' }}
                          onMouseOver={e => e.currentTarget.style.background = '#f0f9ff'}
                          onMouseOut={e => e.currentTarget.style.background = '#ffffff'}
                        >
                          {sample.title} <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '500' }}>({sample.category})</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedJobRole && (
                    <div style={{ marginTop: '12px', padding: '8px 12px', background: '#dcfce7', border: '1px solid #10b981', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#059669', fontWeight: '600' }}>
                      <i className="fas fa-check-circle" style={{ color: '#10b981', flexShrink: 0 }}></i>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{selectedJobRole} selected</span>
                      <button onClick={() => { setSelectedJobRole(''); setJobDescription(''); setIsDropdownOpen(false); }} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#059669', cursor: 'pointer', fontSize: '14px', flexShrink: 0 }}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px', fontStyle: 'italic' }}>
                    <i className="fas fa-info-circle" style={{ marginRight: '6px', color: '#3d3b7a' }}></i>
                    Or paste your own job description below
                  </p>
                </div>

                <textarea
                  value={jobDescription}
                  onChange={e => { setJobDescription(e.target.value); if (e.target.value && !selectedJobRole) setSelectedJobRole('Custom Job Description'); else if (!e.target.value) setSelectedJobRole(''); }}
                  placeholder="Or paste a custom job description here..."
                  style={{ width: '100%', minHeight: isMobile ? '120px' : '150px', padding: '14px', border: jobDescription.trim() ? '2px solid #10b981' : '2px solid #e2e8f0', borderRadius: '12px', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', marginBottom: '16px' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#3d3b7a'}
                  onBlur={e => e.currentTarget.style.borderColor = jobDescription.trim() ? '#10b981' : '#e2e8f0'}
                />
                <p style={{ fontSize: '11px', color: '#3d3b7a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                  <i className="fas fa-exclamation-circle"></i> Job description is required to analyze your resume accurately
                </p>
                {currentScreen === 'upload' && (
                  <button onClick={analyzeResume} disabled={!uploadedFile || !jobDescription.trim()} style={{ width: '100%', background: (uploadedFile && jobDescription.trim()) ? '#3d3b7a' : '#94a3b8', color: '#EDC9AF', padding: '14px', fontSize: isMobile ? '13px' : '16px', fontWeight: '700', border: 'none', borderRadius: '12px', cursor: (uploadedFile && jobDescription.trim()) ? 'pointer' : 'not-allowed', boxShadow: (uploadedFile && jobDescription.trim()) ? '0 4px 12px rgba(61,59,122,0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (uploadedFile && jobDescription.trim()) ? 1 : 0.6, transition: 'all 0.2s' }}>
                    {(uploadedFile && jobDescription.trim()) ? (<><i className="fas fa-chart-line"></i> Analyze Resume with Job Match</>) : !uploadedFile ? 'Upload resume first' : 'Add job description to continue'}
                  </button>
                )}
              </div>

              <div>
                {currentScreen === 'analyzing' && <AnalyzingAnimation />}
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#3d3b7a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className={`fas ${currentScreen === 'analyzing' ? 'fa-spinner fa-pulse' : 'fa-list-check'}`} style={{ color: '#3d3b7a' }}></i>
                  {currentScreen === 'analyzing' ? 'Analyzing Your Resume...' : 'What We Check'}
                </h3>
                <div style={{ background: '#f8fafc', padding: isMobile ? '20px' : '30px', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
                  {currentScreen === 'analyzing' ? (
                    steps.map((step, idx) => (
                      <div key={idx} style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {analysisProgress >= step.progress
                            ? <i className="fas fa-check-circle" style={{ fontSize: '22px', color: '#10b981', marginRight: '12px' }}></i>
                            : <div style={{ width: '22px', height: '22px', border: '3px solid #e2e8f0', borderRadius: '50%', marginRight: '12px', flexShrink: 0 }} />}
                          <span style={{ color: analysisProgress >= step.progress ? '#3d3b7a' : '#94a3b8', fontSize: '15px', fontWeight: analysisProgress >= step.progress ? '600' : '400' }}>{step.label}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.8' }}>
                      {[
                        { icon: 'fa-chart-simple', text: 'Compatibility score' },
                        { icon: 'fa-key', text: 'Keyword and skills analysis' },
                        { icon: 'fa-briefcase', text: 'Experience & education review' },
                        { icon: 'fa-palette', text: 'Formatting recommendations' },
                        { icon: 'fa-file-alt', text: 'Enhanced resume template' }
                      ].map((item, idx) => (
                        <div key={idx} style={{ marginBottom: '16px', display: 'flex', alignItems: 'start', gap: '10px' }}>
                          <i className={`fas ${item.icon}`} style={{ fontSize: '16px', color: '#3d3b7a', marginTop: '2px' }}></i>
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
        <Footer />
      </>
    );
  }

  if (currentScreen === 'results' && atsData) {
    const isMobile = window.innerWidth <= 768;

    const sectionRows = [
      { label: 'Keywords Match', score: atsData.detailedReport.keywordsMatch?.score || 0 },
      { label: 'Skills Section', score: atsData.detailedReport.skillsSection?.score || 0 },
      { label: 'Work Experience', score: atsData.detailedReport.experienceRelevance?.score || 0 },
      { label: 'Education', score: atsData.detailedReport.educationCertifications?.score || 0 },
      { label: 'Formatting', score: atsData.detailedReport.resumeFormatting?.score || 0 },
      { label: 'Projects', score: atsData.detailedReport.projectsAchievements?.score || 0 },
    ];

    return (
      <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        {/* Responsive overrides */}
        <style>{`
          @media (max-width: 768px) {
            .results-main-grid { grid-template-columns: 1fr !important; }
            .results-left-panel { position: relative !important; top: 0 !important; }
            .modal-inner { flex-direction: column !important; max-height: 95vh !important; }
            .modal-left { width: 100% !important; border-right: none !important; border-bottom: 2px solid #3d3b7a !important; }
            .modal-right { max-height: 50vh !important; }
            .template-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .bottom-opt-banner { flex-direction: column !important; }
            .bottom-opt-banner-card { max-width: 100% !important; width: 100% !important; }
             .bottom-banner-inner { flex-direction: column-reverse !important; }
          }
          @media (max-width: 400px) {
            .template-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
        <Navbar />
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: '100px', paddingBottom: '20px' }}>
          {showToast && <Toast />}
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>

            {/* Back button */}
            <button
              onClick={() => { setCurrentScreen('landing'); setUploadedFile(null); setAtsData(null); setAnalysisProgress(0); setJobDescription(''); setSelectedJobRole(''); }}
              style={{ background: '#3d3b7a', border: 'none', color: '#EDC9AF', fontSize: '15px', cursor: 'pointer', marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: '600', padding: '12px 24px', borderRadius: '50px', boxShadow: '0 2px 8px rgba(61,59,122,0.3)', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(61,59,122,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(61,59,122,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <i className="fas fa-home" style={{ fontSize: '18px' }}></i>
              <span>Back to Home</span>
            </button>

            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h2 style={{ color: '#3d3b7a', fontSize: isMobile ? '22px' : '30px', marginBottom: '6px', fontWeight: '800' }}>
                Resume Analysis Complete
              </h2>
              <p style={{ color: '#64748b', fontSize: isMobile ? '13px' : '15px', margin: 0 }}>
                Your score and enhanced resume options
              </p>
            </div>
            <div className="results-main-grid" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px', alignItems: 'stretch', marginBottom: '32px' }}>
              <div
                className="results-left-panel"
                style={{
                  background: '#fff', padding: '24px', borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  position: 'sticky', top: '100px',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                <CircularGauge score={atsData.overallScore} />

                <div style={{ borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#1e1b4b', marginBottom: '4px' }}>
                    Review our suggestions to see what you can fix.
                  </h3>
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '14px' }}>Tap a section to learn more</p>
                  {sectionRows.map((row, idx) => (
                    <SectionCheckRow key={idx} label={row.label} score={row.score} />
                  ))}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setShowReportModal(true)}
                    style={{ flex: 1, minWidth: '120px', background: '#3d3b7a', color: '#EDC9AF', padding: '12px 10px', fontSize: '13px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <i className="fas fa-eye"></i> View Report
                  </button>
                  <button
                    onClick={handleBuildWithCareerBlueprint}
                    style={{ flex: 1, minWidth: '120px', background: '#EDC9AF', color: '#3d3b7a', padding: '12px 10px', fontSize: '13px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <i className="fas fa-file-alt"></i> Build Resume
                  </button>
                </div>

                <button
                  onClick={() => {
                    const name = atsData?.userData?.fullName || 'User';
                    const email = atsData?.userData?.email || 'N/A';
                    const score = atsData?.overallScore ?? 0;
                    const label = getScoreLabel(score);
                    const r = atsData?.detailedReport;
                    const msg =
                      `📊 *ATS Resume Score Report — CareerBlueprint*
━━━━━━━━━━━━━━━━━━━━━━━

👤 *Name:* ${name}
📧 *Email:* ${email}

⭐ *Overall ATS Score:* ${score}/100
📌 *Resume Strength:* ${label}

━━━━━━━━━━━━━━━━━━━━━━━
📋 *Detailed Score Breakdown:*

🔑 Keywords Match    →  ${r?.keywordsMatch?.score ?? 0}%
🛠️ Skills Section     →  ${r?.skillsSection?.score ?? 0}%
💼 Work Experience   →  ${r?.experienceRelevance?.score ?? 0}%
🎓 Education          →  ${r?.educationCertifications?.score ?? 0}%
📐 Formatting         →  ${r?.resumeFormatting?.score ?? 0}%
🚀 Projects            →  ${r?.projectsAchievements?.score ?? 0}%

━━━━━━━━━━━━━━━━━━━━━━━
💡 Want a better score? Build your ATS-optimized resume at CareerBlueprint and land your dream job faster! 🎯`;
                    const url = `https://wa.me/918124494755?text=${encodeURIComponent(msg)}`;
                    window.open(url, '_blank');
                  }}
                  style={{
                    marginTop: '10px', width: '100%',
                    background: '#3d3b7a', color: '#EDC9AF',
                    padding: '12px', fontSize: '13px', fontWeight: '700',
                    border: 'none', borderRadius: '10px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 12px rgba(61,59,122,0.3)', transition: 'all 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Share Score on WhatsApp
                </button>
              </div>


              <div style={{
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                height: 'fit-content',
                paddingBottom: '20px',
              }}>
                <div style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #e2e8f0',
                  flexShrink: 0,
                }}>
                  <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#3d3b7a', margin: 0 }}>
                    Your Resume
                  </h3>
                </div>

                <div style={{ padding: isMobile ? '16px' : '20px 24px 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    <div>
                      {(() => {
                        const totalIssues = sectionRows.reduce((acc, row) => {
                          const count = row.score < 30 ? 3 : (row.score >= 30 && row.score < 60) ? (row.score >= 45 ? 1 : 2) : 0;
                          return acc + count;
                        }, 0);

                        return (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                              <div style={{ position: 'relative', display: 'inline-flex' }}>
                                <div style={{
                                  width: '52px', height: '52px',
                                  background: 'linear-gradient(135deg, #f87171, #ef4444)',
                                  clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  flexDirection: 'column',
                                }}>
                                  <span style={{ color: 'white', fontSize: '10px', fontWeight: '900', lineHeight: 1 }}>abc</span>
                                  <div style={{ width: '18px', borderBottom: '2px wavy white', marginTop: '3px' }} />
                                </div>
                                {totalIssues > 0 && (
                                  <div style={{
                                    position: 'absolute', bottom: '-4px', right: '-4px',
                                    width: '20px', height: '20px', borderRadius: '50%',
                                    background: '#ef4444', border: '2px solid white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '10px', fontWeight: '900', color: '#fff',
                                  }}>
                                    {totalIssues}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1e1b4b' }}>Oh, no!</p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                                  We found{' '}
                                  <strong style={{ color: '#ef4444' }}>{totalIssues} resume issues</strong>
                                  {' '}in your resume:
                                </p>
                              </div>
                            </div>

                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                              gap: '10px',
                              marginBottom: '16px',
                            }}>
                              {sectionRows.map((row, idx) => {
                                const isGood = row.score >= 60;
                                const issueCount = row.score < 30 ? 3 : (row.score >= 30 && row.score < 60) ? (row.score >= 45 ? 1 : 2) : 0;

                                const cardAccents = [
                                  { tape: '#2c2a63', subheading: 'Improve ATS keyword relevance' },
                                  { tape: '#2c2a63', subheading: 'Add relevant technical and soft skills' },
                                  { tape: '#2c2a63', subheading: 'Highlight achievements with clear results' },
                                  { tape: '#2c2a63', subheading: 'Ensure accurate and well-structured details' },
                                  { tape: '#2c2a63', subheading: 'Maintain clean and consistent layout' },
                                  { tape: '#2c2a63', subheading: 'Showcase practical work and real impact' },
                                ];
                                const ca = cardAccents[idx % cardAccents.length];

                                return (
                                  <div key={idx} style={{
                                    background: '#ffffff',
                                    border: '1.5px solid #e5e7eb',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 10px rgba(44, 42, 99, 0.12)',
                                  }}>
                                    <div style={{ height: '4px', background: ca.tape }} />
                                    <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      {isGood ? (
                                        <div style={{
                                          width: '32px', height: '32px', borderRadius: '50%',
                                          background: '#10b981', flexShrink: 0,
                                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                                            <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                        </div>
                                      ) : (
                                        <div style={{ position: 'relative', flexShrink: 0 }}>
                                          <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: '#ef4444',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                          }}>
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                              <path d="M2 2L10 10M10 2L2 10" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                                            </svg>
                                          </div>
                                          <div style={{
                                            position: 'absolute', top: '-5px', right: '-5px',
                                            width: '17px', height: '17px', borderRadius: '50%',
                                            background: '#fbbf24', border: '1.5px solid white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '9px', fontWeight: '900', color: '#7c2d12',
                                          }}>
                                            {issueCount}
                                          </div>
                                        </div>
                                      )}
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{
                                          margin: 0, fontSize: '13px', fontWeight: '800',
                                          color: '#1e1b4b', whiteSpace: 'nowrap',
                                          overflow: 'hidden', textOverflow: 'ellipsis',
                                        }}>
                                          {row.label}
                                        </p>
                                        <p style={{
                                          margin: '2px 0 0', fontSize: '11px',
                                          color: isGood ? '#10b981' : '#64748b',
                                          fontWeight: '500',
                                          overflow: 'hidden', textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                        }}>
                                          {isGood ? 'Looking good — no issues found' : ca.subheading}
                                        </p>
                                      </div>
                                      {!isGood && (
                                        <p style={{
                                          margin: 0, fontSize: '9px', fontWeight: '700',
                                          color: '#ef4444', textAlign: 'center', flexShrink: 0,
                                        }}>Issues</p>
                                      )}
                                    </div>
                                    <div style={{ height: '3px', background: ca.tape, opacity: 0.35 }} />
                                  </div>
                                );
                              })}
                            </div>

                            <div style={{
                              background: 'linear-gradient(135deg, #3d3b7a 0%, #2c2a63 100%)',
                              borderRadius: '14px',
                              padding: '18px 20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '16px',
                              flexWrap: 'wrap',
                            }}>
                              <div>
                                <p style={{ fontSize: '14px', fontWeight: '800', color: '#fff', margin: '0 0 4px' }}>
                                  Fix my resume issues
                                </p>
                                <p style={{ fontSize: '12px', color: '#EDC9AF', margin: 0 }}>
                                  with Careerblueprint
                                </p>
                              </div>
<button
  onClick={handleBuildWithCareerBlueprint}
  style={{
    background: '#EDC9AF',
    color: '#3d3b7a',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 22px',
    fontSize: '13px',
    fontWeight: '800',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 12px rgba(237,201,175,0.4)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  }}
>
  Fix Issues
  <i className="fa-solid fa-arrow-right" />
</button>                         </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

            </div>



            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: isMobile ? '24px 16px' : '40px 32px', marginBottom: '0' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: isMobile ? '20px' : '28px', fontWeight: '800', color: '#2c2a63', marginBottom: '8px' }}>
                  " Elevate Your Application with Premium Templates "
                </h2>
                <p style={{ color: '#333', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                  Professionally designed, recruiter-approved, and ready for instant download.
                </p>
              </div>

              <div style={{ position: 'relative' }}>
                {/* Left Arrow */}
                <button
                  onClick={() => {
                    const el = document.getElementById('results-template-scroll');
                    if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
                  }}
                  style={{ position: 'absolute', left: '-16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: '#2c2a63', color: '#EDC9AF', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(44,42,99,0.3)', flexShrink: 0 }}
                >
                  <i className="fas fa-chevron-left" style={{ fontSize: '14px' }}></i>
                </button>

                <div
                  id="results-template-scroll"
                  style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px' }}
                >
                  {templates.filter(t => ['professional-modern', 'professional-resume', 'soft-minimal', 'modern-sidebar', 'pureform-resume'].includes(t.id)).map((template) => {
                    const meta = templateMeta[template.id];
                    const dots = categoryDots[template.category] ?? ["#9E9E9E", "#BDBDBD", "#E0E0E0"];
                    return (

                      <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        style={{ flexShrink: 0, width: '260px', cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', border: 'none', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'all 0.3s' }}
                        onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(61,59,122,0.18)'; }}
                        onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; }}
                      >
                        <div style={{ position: 'relative', overflow: 'hidden', height: '280px' }}>
                          <img
                            src={template.image} alt={template.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.3s', display: 'block' }}
                            onMouseOver={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'}
                            onMouseOut={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
                          />
                          <div
                            style={{ position: 'absolute', inset: 0, background: 'rgba(237,201,175,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0, transition: 'opacity 0.3s' }}
                            onMouseOver={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
                            onMouseOut={e => (e.currentTarget as HTMLDivElement).style.opacity = '0'}
                          >
                            <button style={{ background: '#2c2a63', color: '#EDC9AF', padding: '10px 22px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', border: 'none', cursor: 'pointer' }}>Use Template</button>
                            <p style={{ fontSize: '12px', fontWeight: '600', color: '#2c2a63', margin: 0 }}>{(meta?.users ?? 10000).toLocaleString()}+ users</p>
                          </div>
                        </div>
                        <div style={{ padding: '14px 16px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                            {dots.map((color: string, i: number) => (
                              <span key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', display: 'inline-block', backgroundColor: color }} />
                            ))}
                          </div>
                          <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#2c2a63', margin: '0 0 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{template.name}</h4>
                          <p style={{ fontSize: '12px', color: '#555', margin: '0 0 12px', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                            {meta?.description ?? "A professionally designed resume template."}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <span style={{ background: '#6B7280', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '5px' }}>PDF</span>
                          </div>
                        </div>
                      </div>

                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById('results-template-scroll');
                    if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
                  }}
                  style={{ position: 'absolute', right: '-16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: '#2c2a63', color: '#EDC9AF', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(44,42,99,0.3)', flexShrink: 0 }}
                >
                  <i className="fas fa-chevron-right" style={{ fontSize: '14px' }}></i>
                </button>
              </div>

              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <button
                  onClick={() => navigate('/resume/templates')}
                  style={{ background: '#2c2a63', color: '#EDC9AF', padding: '13px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(44,42,99,0.28)', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Explore All Resume Templates <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>

            <BottomBanner
              score={atsData.overallScore}
              onBuild={() => {
                const token = localStorage.getItem('token');
                if (token) {
                  navigate('/app');
                } else {
                  navigate('/login');
                }
              }}
            />
          </div>
        </div>
        {showReportModal && (
          <div
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', overflowY: 'auto' }}
            onClick={() => setShowReportModal(false)}
          >
            <div
              className="modal-inner"
              style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '1100px', width: '100%', maxHeight: '90vh', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'row', border: '3px solid #3d3b7a' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowReportModal(false)}
                style={{ position: 'absolute', top: '14px', right: '14px', background: '#3d3b7a', color: '#EDC9AF', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, fontSize: '16px', fontWeight: '700' }}
              >
                <i className="fas fa-times"></i>
              </button>

              <div
                className="modal-left"
                style={{ background: '#ffffff', padding: '28px 24px', overflowY: 'auto', width: '360px', flexShrink: 0, borderRight: '2px solid #3d3b7a' }}
              >
                <CircularGauge score={atsData.overallScore} />
                <div style={{ borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />
                <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#1e1b4b', marginBottom: '12px' }}>
                  Review our suggestions to see what you can fix.
                </h3>
                {sectionRows.map((row, idx) => (
                  <SectionCheckRow key={idx} label={row.label} score={row.score} />
                ))}
              </div>



              <div
                className="modal-right"
                style={{ padding: '28px 24px', overflowY: 'auto', background: '#fff', flex: 1 }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#3d3b7a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-file-alt"></i> Your Resume
                </h3>

                {(() => {
                  const totalIssues = sectionRows.reduce((acc, row) => {
                    const count = row.score < 30 ? 3 : (row.score >= 30 && row.score < 60) ? (row.score >= 45 ? 1 : 2) : 0;
                    return acc + count;
                  }, 0);
                  return (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                        <div style={{ position: 'relative', display: 'inline-flex' }}>
                          <div style={{
                            width: '52px', height: '52px',
                            background: 'linear-gradient(135deg, #f87171, #ef4444)',
                            clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                          }}>
                            <span style={{ color: 'white', fontSize: '10px', fontWeight: '900', lineHeight: 1 }}>abc</span>
                            <div style={{ width: '18px', borderBottom: '2px wavy white', marginTop: '3px' }} />
                          </div>
                          {totalIssues > 0 && (
                            <div style={{
                              position: 'absolute', bottom: '-4px', right: '-4px',
                              width: '20px', height: '20px', borderRadius: '50%',
                              background: '#ef4444', border: '2px solid white',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '10px', fontWeight: '900', color: '#fff',
                            }}>
                              {totalIssues}
                            </div>
                          )}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1e1b4b' }}>Oh, no!</p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                            We found{' '}
                            <strong style={{ color: '#ef4444' }}>{totalIssues} resume issues</strong>
                            {' '}in your resume:
                          </p>
                        </div>
                      </div>


                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
                        {sectionRows.map((row, idx) => {
                          const isGood = row.score >= 60;
                          const issueCount = row.score < 30 ? 3 : (row.score >= 30 && row.score < 60) ? (row.score >= 45 ? 1 : 2) : 0;
                          const cardAccents = [
                            { tape: '#2c2a63', subheading: 'Improve ATS keyword relevance' },
                            { tape: '#2c2a63', subheading: 'Add relevant technical and soft skills' },
                            { tape: '#2c2a63', subheading: 'Highlight achievements with clear results' },
                            { tape: '#2c2a63', subheading: 'Ensure accurate and well-structured details' },
                            { tape: '#2c2a63', subheading: 'Maintain clean and consistent layout' },
                            { tape: '#2c2a63', subheading: 'Showcase practical work and real impact' },
                          ];
                          const ca = cardAccents[idx % cardAccents.length];
                          return (
                            <div key={idx} style={{ background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(44,42,99,0.12)' }}>
                              <div style={{ height: '4px', background: ca.tape }} />
                              <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {isGood ? (
                                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                                      <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div style={{ position: 'relative', flexShrink: 0 }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 2L10 10M10 2L2 10" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                                      </svg>
                                    </div>
                                    <div style={{ position: 'absolute', top: '-5px', right: '-5px', width: '17px', height: '17px', borderRadius: '50%', background: '#fbbf24', border: '1.5px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '900', color: '#7c2d12' }}>
                                      {issueCount}
                                    </div>
                                  </div>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#1e1b4b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {row.label}
                                  </p>
                                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: isGood ? '#10b981' : '#64748b', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {isGood ? 'Looking good — no issues found' : ca.subheading}
                                  </p>
                                </div>
                                {!isGood && (
                                  <p style={{ margin: 0, fontSize: '9px', fontWeight: '700', color: '#ef4444', textAlign: 'center', flexShrink: 0 }}>Issues</p>
                                )}
                              </div>
                              <div style={{ height: '3px', background: ca.tape, opacity: 0.35 }} />
                            </div>
                          );
                        })}
                      </div>


                      <div style={{ background: 'linear-gradient(135deg, #3d3b7a 0%, #2c2a63 100%)', borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '800', color: '#fff', margin: '0 0 4px' }}>Fix my resume issues</p>
                          <p style={{ fontSize: '12px', color: '#EDC9AF', margin: 0 }}>with Careerblueprint</p>
                        </div>
                        <button
                          onClick={handleBuildWithCareerBlueprint}
                          style={{ background: '#EDC9AF', color: '#3d3b7a', border: 'none', borderRadius: '10px', padding: '10px 22px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(237,201,175,0.4)' }}
                        >
                          Fix Issues 
                            <i className="fa-solid fa-arrow-right" />
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>

            </div>
          </div>
        )}
        <Footer />
      </>
    );
  }

  return null;
};

export default ATSChecker;