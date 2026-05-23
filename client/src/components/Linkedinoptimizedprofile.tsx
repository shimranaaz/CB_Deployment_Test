import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';

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
  profileFixData?: ProfileFixData;
  contentIntelligence?: { headlineSuggestion: string; aboutSuggestion: string; impactWords: string[] };
  detailedReport?: any;
  recruiterVisibility?: any;
  careerAlignment?: any;
}

interface RootState {
  auth: { user: any; token?: string };
}
const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const [animated, setAnimated] = useState(0);
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const fill = (animated / 100) * circ;
  const color = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  useEffect(() => {
    let start: number | null = null;
    const dur = 1200;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const run = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setAnimated(Math.round(ease(p) * score));
      if (p < 1) requestAnimationFrame(run);
    };
    const t = setTimeout(() => requestAnimationFrame(run), 300);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div style={{ position: 'relative', width: '72px', height: '72px', flexShrink: 0 }}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="6" />
        <circle
          cx="36" cy="36" r={radius} fill="none" stroke={color}
          strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - fill}
          style={{ transformOrigin: '36px 36px', transform: 'rotate(-90deg)', transition: 'stroke-dashoffset 0.03s linear' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '16px', fontWeight: '900', color: '#1e1b4b', lineHeight: 1 }}>{animated}</span>
        <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '600' }}>/100</span>
      </div>
    </div>
  );
};

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        background: copied ? '#10b981' : '#eef0fb',
        border: 'none',
        borderRadius: '8px',
        padding: '7px 14px',
        fontSize: '12px',
        fontWeight: '700',
        color: copied ? '#fff' : '#3d3b7a',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        transition: 'all 0.2s',
        flexShrink: 0,
        letterSpacing: '0.2px',
      }}
    >
      <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} style={{ fontSize: '11px' }}></i>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

const SectionCard: React.FC<{
  icon: string;
  title: string;
  content: string;
  delay?: number;
  fullWidth?: boolean;
}> = ({ icon, title, content, delay = 0, fullWidth = false }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '14px',
        border: '1.5px solid #e8ebf4',
        boxShadow: '0 2px 12px rgba(61,59,122,0.06)',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        gridColumn: fullWidth ? '1 / -1' : undefined,
      }}
    >
      <div style={{ height: '3px', background: '#3d3b7a' }} />
      <div style={{ padding: '20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: '#f0eeff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <i className={`fas ${icon}`} style={{ fontSize: '15px', color: '#3d3b7a' }}></i>
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e1b4b', margin: 0 }}>{title}</h3>
          </div>
          <CopyButton text={content} />
        </div>
        <div style={{
          background: '#f8fafc',
          borderRadius: '10px',
          padding: '14px 16px',
          border: '1px solid #edf0f7',
        }}>
          <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.8', margin: 0, whiteSpace: 'pre-wrap' }}>
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

const SkillsCard: React.FC<{ skills: string[]; delay?: number }> = ({ skills, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  const allSkillsText = skills.join(', ');

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '14px',
        border: '1.5px solid #e8ebf4',
        boxShadow: '0 2px 12px rgba(61,59,122,0.06)',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        gridColumn: undefined,
      }}
    >
      <div style={{ height: '3px', background: '#3d3b7a' }} />
      <div style={{ padding: '20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: '#f0eeff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <i className="fas fa-layer-group" style={{ fontSize: '15px', color: '#3d3b7a' }}></i>
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e1b4b', margin: 0 }}>Recommended Skills</h3>
          </div>
          <CopyButton text={allSkillsText} />
        </div>
        <div style={{
          background: '#f8fafc',
          borderRadius: '10px',
          padding: '14px 16px',
          border: '1px solid #edf0f7',
        }}>
          <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.8', margin: 0 }}>
            {allSkillsText}
          </p>
        </div>
      </div>
    </div>
  );
};


const StatPill: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div style={{
    background: '#f0eeff',
    borderRadius: '10px',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: '1',
    minWidth: '130px',
  }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#3d3b7a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <i className={`fas ${icon}`} style={{ fontSize: '13px', color: '#EDC9AF' }}></i>
    </div>
    <div>
      <p style={{ margin: 0, fontSize: '10px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '13px', color: '#1e1b4b', fontWeight: '700' }}>{value}</p>
    </div>
  </div>
);

const LinkedInOptimizedProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [linkedInData, setLinkedInData] = useState<LinkedInData | null>(null);
  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    if (!token || !user) { navigate('/login'); return; }

    const savedRaw = localStorage.getItem('linkedinAnalysisData');
    if (savedRaw) {
      try {
        const parsed = JSON.parse(savedRaw);
        if (parsed.linkedInData) setLinkedInData(parsed.linkedInData);
      } catch { /* ignore */ }
    } else {
      const oldRaw = localStorage.getItem('linkedinProfileData');
      if (oldRaw) {
        try { setLinkedInData(JSON.parse(oldRaw)); } catch { /* ignore */ }
      }
    }

    setLoading(false);
    const t = setTimeout(() => setHeaderVisible(true), 100);
    return () => clearTimeout(t);
  }, [token, user, navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6fb' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', border: '4px solid #e2e8f0', borderTopColor: '#3d3b7a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
          <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
          <p style={{ color: '#64748b', fontWeight: '600', fontSize: '14px' }}>Loading your optimized profile...</p>
        </div>
      </div>
    );
  }

  if (!linkedInData) {
    return (
      <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6fb', padding: '20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div style={{ width: '72px', height: '72px', background: '#f0eeff', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '28px', color: '#3d3b7a' }}></i>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1e1b4b', marginBottom: '10px' }}>No Profile Data Found</h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: '1.65' }}>
              Please run the LinkedIn checker first to generate your optimized profile.
            </p>
            <button
              onClick={() => navigate('/linkedin-checker')}
              style={{ background: '#3d3b7a', color: '#EDC9AF', padding: '12px 26px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer' }}
            >
              Go to LinkedIn Checker
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const fix = linkedInData.profileFixData;
  const ci = linkedInData.contentIntelligence;
  const fullName = linkedInData.userData?.fullName || user?.name || 'Your Profile';
  const headline = linkedInData.userData?.headline || '';
  const connections = linkedInData.userData?.estimatedConnections || '—';
  const score = linkedInData.linkedinScore;
  const strength = linkedInData.profileStrength || '—';

  const scoreColor = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const scoreLabel = score >= 70 ? 'Excellent' : score >= 60 ? 'Good' : score >= 45 ? 'Average' : 'Needs Work';

  const sections = [
    { icon: 'fa-heading', title: 'Optimized Headline', content: fix?.headline || ci?.headlineSuggestion || 'No headline suggestion available.' },
    { icon: 'fa-align-left', title: 'Rewritten Summary', content: fix?.summary || 'Your summary has been optimized for maximum recruiter visibility.' },
    { icon: 'fa-user-circle', title: 'About Section', content: fix?.about || ci?.aboutSuggestion || 'No about section suggestion available.' },
    { icon: 'fa-graduation-cap', title: 'Education Highlights', content: fix?.education || 'Include relevant coursework, certifications, and academic achievements.' },
    { icon: 'fa-briefcase', title: 'Experience Optimization', content: fix?.experience || 'Quantify achievements with metrics. Use action verbs to describe impact.' },
  ];

  const completedSections = ['Headline', 'Summary', 'About', 'Education', 'Experience', 'Skills'];

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <style>{`
        @media (max-width: 640px) {
          .opt-header-inner { flex-direction: column !important; }
          .opt-cards-grid { grid-template-columns: 1fr !important; }
          .opt-stats-row { flex-wrap: wrap !important; }
          .opt-profile-row { flex-direction: column !important; }
        }
        @media (max-width: 768px) {
          .opt-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Navbar />

      <div style={{ minHeight: '100vh', background: '#f4f6fb', paddingTop: '90px', paddingBottom: '60px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 16px' }}>

          {/* Back button */}
          <button
            onClick={() => navigate('/linkedin-checker')}
            style={{
              background: 'transparent', border: '1.5px solid #d0d5e8', color: '#3d3b7a',
              fontSize: '13px', cursor: 'pointer', marginBottom: '24px',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontWeight: '600', padding: '9px 18px', borderRadius: '50px',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#3d3b7a'; e.currentTarget.style.color = '#EDC9AF'; e.currentTarget.style.borderColor = '#3d3b7a'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3d3b7a'; e.currentTarget.style.borderColor = '#d0d5e8'; }}
          >
            <i className="fas fa-arrow-left" style={{ fontSize: '11px' }}></i>
            Back to LinkedIn Checker
          </button>

          {/* ── Profile Header Card ── */}
          <div
            style={{
              background: '#fff',
              borderRadius: '18px',
              border: '1.5px solid #e8ebf4',
              boxShadow: '0 4px 24px rgba(61,59,122,0.08)',
              overflow: 'hidden',
              marginBottom: '20px',
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(-16px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <div style={{ height: '6px', background: '#3d3b7a' }} />
            <div style={{ padding: '28px 32px' }}>

              {/* Profile row */}
              <div className="opt-profile-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>

                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: '#eef0fb',
                    border: '3px solid #e8ebf4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '26px', color: '#3d3b7a', fontWeight: '800',
                  }}>
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{
                    position: 'absolute', bottom: '-2px', right: '-2px',
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: '#0077B5',
                    border: '2px solid #fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <i className="fab fa-linkedin-in" style={{ fontSize: '11px', color: '#fff' }}></i>
                  </div>
                </div>

                {/* Name / headline — NO username pill */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 4px' }}>{fullName}</h1>
                  {headline && (
                    <p style={{ margin: '0 0 8px', fontSize: '13.5px', color: '#475569', lineHeight: '1.5' }}>{headline}</p>
                  )}
                  {/* Completed sections pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {completedSections.map((item, i) => (
                      <span key={i} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        background: '#f0fdf4', color: '#059669',
                        border: '1px solid #bbf7d0',
                        padding: '3px 10px', borderRadius: '20px',
                        fontSize: '11px', fontWeight: '600',
                      }}>
                        <i className="fas fa-check" style={{ fontSize: '9px' }}></i>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score ring */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <ScoreRing score={score} />
                  <span style={{
                    fontSize: '11px', fontWeight: '700',
                    color: scoreColor,
                    background: `${scoreColor}15`,
                    padding: '2px 8px', borderRadius: '20px',
                  }}>{scoreLabel}</span>
                </div>
              </div>


              <div style={{ borderTop: '1px solid #edf0f7', marginBottom: '20px' }} />


              <div className="opt-stats-row" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <StatPill icon="fa-trophy" label="Profile Strength" value={strength} />
                <StatPill icon="fa-users" label="Connections" value={connections} />
                <StatPill icon="fa-chart-line" label="Visibility Score" value={`${score}/100`} />
              </div>
            </div>
          </div>


          <p style={{
            fontSize: '12.5px', color: '#94a3b8', marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <i className="fas fa-info-circle" style={{ color: '#3d3b7a', fontSize: '13px' }}></i>
            Click the <strong style={{ color: '#3d3b7a' }}>Copy</strong> button on any section to copy the content to your clipboard.
          </p>

          {/* ── Section Cards Grid ── */}
          <div className="opt-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
            {sections.map((sec, i) => (
              <SectionCard
                key={i}
                icon={sec.icon}
                title={sec.title}
                content={sec.content}
                delay={i * 80}
              />
            ))}

            {fix?.skills && fix.skills.length > 0 && (
              <SkillsCard skills={fix.skills} delay={sections.length * 80} />
            )}
            {(!fix?.skills || fix.skills.length === 0) && ci?.impactWords && ci.impactWords.length > 0 && (
              <SkillsCard skills={ci.impactWords} delay={sections.length * 80} />
            )}
          </div>

          {/* ── Footer CTA ── */}
          <div style={{
            background: '#3d3b7a',
            borderRadius: '14px',
            padding: '22px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            <div>
              <p style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: '0 0 3px' }}>
                Ready to build a matching resume?
              </p>
              <p style={{ fontSize: '12.5px', color: '#EDC9AF', margin: 0 }}>
                Combine your optimized LinkedIn profile with a powerful resume
              </p>
            </div>
            <button
              onClick={() => navigate('/app')}
              style={{
                background: '#EDC9AF', color: '#3d3b7a', border: 'none', borderRadius: '10px',
                padding: '11px 22px', fontSize: '13px', fontWeight: '800', cursor: 'pointer',
                whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(237,201,175,0.4)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <i className="fas fa-file-alt" style={{ marginRight: '7px' }}></i>
              Build My Resume
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default LinkedInOptimizedProfile;