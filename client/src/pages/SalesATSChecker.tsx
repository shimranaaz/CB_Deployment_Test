import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, ChevronLeft, ChevronRight, Home, Menu, X, LayoutDashboard, Phone, Eye, Search, UploadCloud } from 'lucide-react';
import api from '../configs/api';
import toast from 'react-hot-toast';

interface Stats {
  totalUsers: number;
  totalResumes: number;
  totalATSSubmissions: number;
  totalLinkedInSubmissions: number;
  totalCouponsUsed: number;
  activeCoupons: number;
}
interface User {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  plan: string;
  role: string;
  createdAt: string;
  atsScore?: number | null;
}

interface Resume {
  _id: string;
  title: string;
  userId: {
    name: string;
    email: string;
    mobile?: string;
    isDeleted?: boolean;
  };
  template: string;
  updatedAt: string;
}

interface LinkedInSubmission {
  _id: string;
  fullName: string;
  email: string;
  linkedinScore: number;
  createdAt: string;
}


interface ATSSubmission {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  atsScore: number;
  resumePath: string;
  feedback: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
  detailedReport?: {
    keywordsMatch?: { score: number; percentage: number; details: string };
    skillsSection?: { score: number; percentage: number; details: string };
    experienceRelevance?: { score: number; percentage: number; details: string };
    educationCertifications?: { score: number; percentage: number; details: string };
    resumeFormatting?: { score: number; percentage: number; details: string };
    projectsAchievements?: { score: number; percentage: number; details: string };
  };
  createdAt: string;
}

const jobDescriptionSamples = [
  { id: 'full-stack-developer', title: 'Full Stack Developer', category: 'Technology', description: `We are seeking a Full Stack Developer with strong expertise in designing, developing, and maintaining scalable web applications.\n\nSkills & Keywords:\nJavaScript, TypeScript, React, Angular, Node.js, Java, Python, REST API, GraphQL, SQL, NoSQL, MongoDB, PostgreSQL, MySQL, Microservices, Cloud (AWS/Azure/GCP), CI/CD, Docker, Git, Agile, SDLC` },
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
  { id: 'financial-analyst', title: 'Financial Analyst', category: 'Finance', description: `We are hiring a Financial Analyst to support financial planning, analysis, and decision-making.\n\nSkills & Keywords:\nFinancial Analysis, Budgeting, Forecasting, Financial Modeling, Advanced Excel, Power BI, Tableau, KPI Analysis, Risk Assessment, Business Intelligence, Accounting Principles, Strategic Planning` },
];


const SalesDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'resumes' | 'ats-checker' | 'linkedin-checker'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [atsSubmissions, setAtsSubmissions] = useState<ATSSubmission[]>([]);
  const [linkedinSubmissions, setLinkedinSubmissions] = useState<LinkedInSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState<ATSSubmission | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [atsSearch, setAtsSearch] = useState('');
  const [linkedinSearch, setLinkedinSearch] = useState('');
  const [resumeSearchQuery, setResumeSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userResumes, setUserResumes] = useState<any[]>([]);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [resumeForm, setResumeForm] = useState({ title: '', template: 'geometric-blue', category: 'ATS' });
  const [creatingResumeLoading, setCreatingResumeLoading] = useState(false);

  const [resumeJobDescription, setResumeJobDescription] = useState('');
const [resumeSelectedJobRole, setResumeSelectedJobRole] = useState('');
const [resumeJobDropdownOpen, setResumeJobDropdownOpen] = useState(false);
const resumeJobDropdownRef = useRef<HTMLDivElement>(null);


useEffect(() => {
  const h = (e: MouseEvent) => {
    if (resumeJobDropdownRef.current && !resumeJobDropdownRef.current.contains(e.target as Node))
      setResumeJobDropdownOpen(false);
  };
  document.addEventListener('mousedown', h);
  return () => document.removeEventListener('mousedown', h);
}, []);


  useEffect(() => {
    checkSalesAccess();
  }, []);

  useEffect(() => {
    if (activeTab === 'overview') {
      loadStats();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'resumes') {
      loadResumes();
    } else if (activeTab === 'ats-checker') {
      loadATSSubmissions();
    } else if (activeTab === 'linkedin-checker') {
      loadLinkedInSubmissions();
    }
  }, [activeTab, currentPage, searchQuery, resumeSearchQuery, atsSearch, linkedinSearch]);

  const checkSalesAccess = async () => {
    try {
      const { data } = await api.get('/users/data');
      if (data.user.role !== 'sales' && data.user.role !== 'admin') {
        toast.error('Access denied. Sales only.');
        navigate('/app');
      }
    } catch (error) {
      toast.error('Failed to verify access');
      navigate('/app');
    }
  };

  const loadStats = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data.stats);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', {
        params: { page: currentPage, limit: 10, search: searchQuery }
      });
      setUsers(data.users);
      setTotalPages(data.pagination.pages);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadResumes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/resumes', {
        params: { page: currentPage, limit: 10, search: resumeSearchQuery }
      });
      setResumes(data.resumes);
      setTotalPages(data.pagination.pages);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const loadLinkedInSubmissions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/linkedin', {
        params: { page: currentPage, limit: 10, search: linkedinSearch }
      });
      setLinkedinSubmissions(data.submissions);
      setTotalPages(data.pagination.pages);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load LinkedIn submissions');
    } finally {
      setLoading(false);
    }
  };


  const loadATSSubmissions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/ats', {
        params: { page: currentPage, limit: 10, search: atsSearch }
      });
      setAtsSubmissions(data.submissions);
      setTotalPages(data.pagination.pages);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load ATS submissions');
    } finally {
      setLoading(false);
    }
  };

  const formatUserDisplay = (
    userId: { name: string; email: string; mobile?: string; isDeleted?: boolean } | null | undefined
  ) => {
    if (!userId) {
      return { name: 'Deleted User', email: 'User no longer exists', mobile: 'N/A', isDeleted: true };
    }
    if (userId.isDeleted) {
      const userName = userId.name && userId.name !== 'Deleted Account' ? userId.name : 'Unknown User';
      return {
        name: `Deleted User (${userName})`,
        email: userId.email !== 'N/A' ? userId.email : 'No email available',
        mobile: userId.mobile || 'N/A',
        isDeleted: true
      };
    }
    return { ...userId, mobile: userId.mobile || 'N/A' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Professional': return 'bg-purple-100 text-purple-700';
      case 'Advanced': return 'bg-blue-100 text-blue-700';
      case 'Basic': return 'bg-green-100 text-green-700';
      case 'Trial': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const templateCategoryMap: Record<string, string> = {
    "modern-two-column": "Simple", "digital-pro": "Simple", "modern": "Word",
    "minimal-image": "Two-column", "minimal": "Word", "geometric-blue": "ATS",
    "classic": "Word", "geometric": "Two-column", "modern-sidebar": "Two-column",
    "stylish": "Two-column", "clean-modern": "ATS", "soft-minimal": "ATS",
    "professional-resume": "Two-column", "professional-modern": "Picture",
    "professional-resume-template": "Picture", "soft-stylish": "Word",
    "professional": "Word", "creative": "Word", "executive": "Word",
    "tech": "ATS", "technical": "Picture", "elite": "Picture", "profile": "Picture",
    "ember-creative": "Word", "smart-resume": "Word", "minimal-cv": "Two-column",
    "prime-edge": "Two-column", "elitecraft-cv": "Two-column", "executive-cv": "Picture",
    "pureform-resume": "ATS", "meridian-cv": "Picture", "elevare-cv": "ATS",
    "talentra-cv": "Picture", "boardline-cv": "Picture", "apex-resume": "Picture",
    "blueprint-resume": "Word", "technexa-resume": "Two-column", "stackpro-cv": "ATS",
    "visualcraft-cv": "Picture", "designflux-resume": "Word", "elitepath-cv": "Picture",
    "imperial-cv": "Two-column", "corporate-atlas": "Picture", "executive_cv": "Word",
    "artistry-resume": "Word", "pixel-aura": "Two-column", "beginner-pro": "Word",
    "design-smart": "Word", "career-elite": "Picture", "codepro-resume": "Two-column",
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ATS': return 'bg-green-100 text-green-700';
      case 'Word': return 'bg-blue-100 text-blue-700';
      case 'Picture': return 'bg-purple-100 text-purple-700';
      case 'Two-column': return 'bg-orange-100 text-orange-700';
      case 'Simple': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };


  const allTemplates = [
    { id: "modern-two-column", name: "Simple Resume Core", category: "Simple" },
    { id: "digital-pro", name: "Simple Foundation", category: "Simple" },
    { id: "modern", name: "Modern Edge", category: "Word" },
    { id: "minimal-image", name: "Profile Minimal", category: "Two-column" },
    { id: "minimal", name: "Pure Minimal", category: "Word" },
    { id: "geometric-blue", name: "Pro ATS", category: "ATS" },
    { id: "classic", name: "Executive Classic", category: "Word" },
    { id: "geometric", name: "Geometry Elite", category: "Two-column" },
    { id: "modern-sidebar", name: "Sidebar Professional", category: "Two-column" },
    { id: "stylish", name: "Stylish Executive", category: "Two-column" },
    { id: "clean-modern", name: "Clean ATS Pro", category: "ATS" },
    { id: "soft-minimal", name: "Soft ATS Pro", category: "ATS" },
    { id: "professional-resume", name: "Prime Professional", category: "Two-column" },
    { id: "professional-modern", name: "Modern Profile", category: "Picture" },
    { id: "professional-resume-template", name: "Professional Prime", category: "Picture" },
    { id: "soft-stylish", name: "Stylish Soft Pro", category: "Word" },
    { id: "professional", name: "Corporate Professional", category: "Word" },
    { id: "creative", name: "Creative Professional", category: "Word" },
    { id: "executive", name: "Executive Prime", category: "Word" },
    { id: "tech", name: "Tech ATS Pro", category: "ATS" },
    { id: "technical", name: "Technical Visual", category: "Picture" },
    { id: "elite", name: "Elite Visual", category: "Picture" },
    { id: "profile", name: "Profile Executive", category: "Picture" },
    { id: "ember-creative", name: "Creative Ember", category: "Word" },
    { id: "smart-resume", name: "Smart Professional", category: "Word" },
    { id: "minimal-cv", name: "Minimal Professional CV", category: "Two-column" },
    { id: "prime-edge", name: "Prime Edge", category: "Two-column" },
    { id: "elitecraft-cv", name: "EliteCraft", category: "Two-column" },
    { id: "executive-cv", name: "Executive Visual CV", category: "Picture" },
    { id: "pureform-resume", name: "PureForm ATS", category: "ATS" },
    { id: "meridian-cv", name: "Meridian Visual CV", category: "Picture" },
    { id: "elevare-cv", name: "Elevare ATS", category: "ATS" },
    { id: "talentra-cv", name: "Talentra Visual", category: "Picture" },
    { id: "boardline-cv", name: "Boardline Visual", category: "Picture" },
    { id: "apex-resume", name: "Apex Visual", category: "Picture" },
    { id: "blueprint-resume", name: "Blueprint Professional", category: "Word" },
    { id: "technexa-resume", name: "TechNexa", category: "Two-column" },
    { id: "stackpro-cv", name: "StackPro ATS", category: "ATS" },
    { id: "visualcraft-cv", name: "VisualCraft Pro", category: "Picture" },
    { id: "designflux-resume", name: "DesignFlux Professional", category: "Word" },
    { id: "elitepath-cv", name: "ElitePath Visual", category: "Picture" },
    { id: "imperial-cv", name: "Imperial Professional", category: "Two-column" },
    { id: "corporate-atlas", name: "Corporate Atlas", category: "Picture" },
    { id: "executive_cv", name: "Executive Minimal", category: "Word" },
    { id: "artistry-resume", name: "Artistry Professional", category: "Word" },
    { id: "pixel-aura", name: "PixelAura", category: "Two-column" },
    { id: "beginner-pro", name: "Beginner Professional", category: "Word" },
    { id: "design-smart", name: "DesignSmart Professional", category: "Word" },
    { id: "career-elite", name: "Career Elite", category: "Picture" },
    { id: "codepro-resume", name: "CodePro", category: "Two-column" },
  ];


  const getCreatedByLabel = (resume: any) => {
    if (!resume.adminCreated) {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-700">
          Created by User
        </span>
      );
    }
    if (resume.createdByRole === 'sales') {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-purple-100 text-purple-700">
          Created by Sales
        </span>
      );
    }
    return (
      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-orange-100 text-orange-700">
        Created by Admin
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#2c2a63] text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 sm:p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-[#EDC9AF]">Sales Panel</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-white/10 rounded"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
            <button
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'overview' ? 'bg-[#EDC9AF] text-[#2c2a63]' : 'text-white hover:bg-white/10'}`}
            >
              <LayoutDashboard size={18} className="sm:w-5 sm:h-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab('users'); setCurrentPage(1); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'users' ? 'bg-[#EDC9AF] text-[#2c2a63]' : 'text-white hover:bg-white/10'}`}
            >
              <Users size={18} className="sm:w-5 sm:h-5" />
              <span className="font-medium">Users</span>
            </button>

            <button
              onClick={() => { setActiveTab('resumes'); setCurrentPage(1); setResumeSearchQuery(''); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'resumes' ? 'bg-[#EDC9AF] text-[#2c2a63]' : 'text-white hover:bg-white/10'}`}
            >
              <FileText size={18} className="sm:w-5 sm:h-5" />
              <span className="font-medium">Resumes</span>
            </button>

            <button
              onClick={() => { setActiveTab('ats-checker'); setCurrentPage(1); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'ats-checker' ? 'bg-[#EDC9AF] text-[#2c2a63]' : 'text-white hover:bg-white/10'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">ATS Checker</span>
            </button>


            <button
              onClick={() => { setActiveTab('linkedin-checker'); setCurrentPage(1); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'linkedin-checker' ? 'bg-[#EDC9AF] text-[#2c2a63]' : 'text-white hover:bg-white/10'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span className="font-medium">LinkedIn Checker</span>
            </button>

          </nav>

          <div className="p-3 sm:p-4 border-t border-white/10">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#EDC9AF] text-[#2c2a63] rounded-lg hover:bg-[#d4b896] transition-colors font-medium text-sm sm:text-base"
            >
              <Home size={18} className="sm:w-5 sm:h-5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={20} className="sm:w-6 sm:h-6 text-[#2c2a63]" />
              </button>
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-[#2c2a63]">Sales Dashboard</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 overflow-auto">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">

              {/* Total Users */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm">Total Users</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>

              {/* Total Resumes */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm">Total Resumes</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalResumes}</p>
                </div>
              </div>

              {/* ATS Submissions */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex flex-col items-start gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">ATS Submissions</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats?.totalATSSubmissions || 0}</p>
                  </div>
                </div>
              </div>

              {/* LinkedIn Submissions */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex flex-col items-start gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">LinkedIn Submissions</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats?.totalLinkedInSubmissions || 0}</p>
                  </div>
                </div>
              </div>


              {/* Coupons Used */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex flex-col items-start gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Coupons Used</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats?.totalCouponsUsed || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Active Coupons: {stats?.activeCoupons || 0}</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                  />
                </div>
              </div>
              {/* Mobile Card View */}
              <div className="block lg:hidden divide-y divide-gray-200">
                {users.map((user) => (
                  <div key={user._id} className="p-4 hover:bg-gray-50">
                    <div className="flex-1 mb-3">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{user.email}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <Phone size={12} />
                        <span>{user.mobile || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <div className="flex flex-wrap gap-2 items-center justify-between">
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getPlanColor(user.plan)}`}>
                            {user.role === 'admin' ? 'All Access' : user.plan}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                            {user.role}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(user.createdAt)}</span>
                        </div>
                        <button
                          onClick={async () => {
                            setSelectedUser(user);
                            setActiveTab('user-resumes' as any);
                            const { data } = await api.get(`/admin/users/${user._id}/resumes`);
                            setUserResumes(data.resumes);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-2"
                          title="Manage Resumes"
                        >
                          <FileText size={16} />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ATS Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone size={14} className="text-gray-400" />
                            <span>{user.mobile || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.atsScore != null ? (
                            <span
                              className="inline-flex px-2.5 py-1 text-xs font-bold rounded-full"
                              style={{
                                backgroundColor:
                                  user.atsScore >= 75 ? '#d1fae5' :
                                    user.atsScore >= 50 ? '#fef3c7' : '#fee2e2',
                                color:
                                  user.atsScore >= 75 ? '#065f46' :
                                    user.atsScore >= 50 ? '#92400e' : '#991b1b',
                              }}
                            >
                              {user.atsScore} / 100
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">No score</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${user.role === 'admin' ? 'bg-gray-100 text-gray-400' : getPlanColor(user.plan)}`}>
                            {user.role === 'admin' ? 'All Access' : user.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={async () => {
                              setSelectedUser(user);
                              setActiveTab('user-resumes' as any);
                              const { data } = await api.get(`/admin/users/${user._id}/resumes`);
                              setUserResumes(data.resumes);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="Manage Resumes"
                          >
                            <FileText size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-3 sm:p-4 border-t border-gray-200 flex flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-xs sm:text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── RESUMES ── */}
          {activeTab === 'resumes' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resumes by title, user name or email..."
                    value={resumeSearchQuery}
                    onChange={(e) => { setResumeSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                  />
                </div>
              </div>
              {/* Mobile Card View */}
              <div className="block lg:hidden divide-y divide-gray-200">
                {resumes.map((resume) => {
                  const userDisplay = formatUserDisplay(resume.userId);
                  return (
                    <div key={resume._id} className="p-4 hover:bg-gray-50">
                      <div className="flex-1 mb-3">
                        <div className="text-sm font-medium text-gray-900 mb-2">{resume.title}</div>
                        <div className={`text-xs font-medium ${userDisplay.isDeleted ? 'text-gray-500 italic' : 'text-gray-900'}`}>
                          {userDisplay.name}
                        </div>
                        <div className={`text-xs ${userDisplay.isDeleted ? 'text-gray-400 italic' : 'text-gray-500'} mt-1`}>
                          {userDisplay.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <Phone size={12} />
                          <span>{userDisplay.mobile}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(templateCategoryMap[resume.template] || 'Other')}`}>
                          {templateCategoryMap[resume.template] || resume.template}
                        </span>
                        <span className="text-xs text-gray-500">{formatDate(resume.updatedAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resumes.map((resume) => {
                      const userDisplay = formatUserDisplay(resume.userId);
                      return (
                        <tr key={resume._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{resume.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className={`text-sm font-medium ${userDisplay.isDeleted ? 'text-gray-500 italic' : 'text-gray-900'}`}>
                                {userDisplay.name}
                              </div>
                              <div className={`text-sm ${userDisplay.isDeleted ? 'text-gray-400 italic' : 'text-gray-500'}`}>
                                {userDisplay.email}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                <Phone size={12} />
                                <span>{userDisplay.mobile}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(templateCategoryMap[resume.template] || 'Other')}`}>
                              {templateCategoryMap[resume.template] || resume.template}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(resume.updatedAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-3 sm:p-4 border-t border-gray-200 flex flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-xs sm:text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
          {/* ── ATS CHECKER ── */}
          {activeTab === 'ats-checker' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">ATS Resume Checker Submissions</h3>
                <p className="text-sm text-gray-600 mt-1">View all resume analysis requests</p>
              </div>
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={atsSearch}
                    onChange={(e) => { setAtsSearch(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                {atsSubmissions.length === 0 ? (
                  <div className="p-12 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No ATS Submissions Yet</h3>
                    <p className="text-gray-500">Resume analysis submissions will appear here</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ATS Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {atsSubmissions.map((submission) => (
                        <tr key={submission._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {submission.fullName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {submission.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {submission.mobile}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span style={{
                              background: submission.atsScore >= 75 ? '#10b981' : submission.atsScore >= 50 ? '#f59e0b' : '#ef4444',
                              color: '#fff', padding: '4px 12px', borderRadius: '12px',
                              fontSize: '14px', fontWeight: '600'
                            }}>
                              {submission.atsScore}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(submission.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={async () => {
                                try {
                                  const { data } = await api.get(`/admin/ats/${submission._id}`);
                                  setViewingReport(data.submission);
                                } catch (error) {
                                  toast.error('Failed to load full report');
                                }
                              }}
                              className="text-blue-600 hover:text-blue-800"
                              title="View Report"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}


          {/* ── LINKEDIN CHECKER ── */}
          {activeTab === 'linkedin-checker' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">LinkedIn Profile Checker Submissions</h3>
                <p className="text-sm text-gray-600 mt-1">View all LinkedIn profile analysis requests</p>
              </div>
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={linkedinSearch}
                    onChange={(e) => { setLinkedinSearch(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                {linkedinSubmissions.length === 0 ? (
                  <div className="p-12 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No LinkedIn Submissions Yet</h3>
                    <p className="text-gray-500">LinkedIn profile analysis submissions will appear here</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">LinkedIn Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {linkedinSubmissions.map((submission) => (
                        <tr key={submission._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {submission.fullName || '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {submission.email || '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span style={{
                              background: submission.linkedinScore >= 75 ? '#10b981' : submission.linkedinScore >= 50 ? '#f59e0b' : '#ef4444',
                              color: '#fff', padding: '4px 12px', borderRadius: '12px',
                              fontSize: '14px', fontWeight: '600'
                            }}>
                              {submission.linkedinScore}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(submission.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── USER RESUMES TAB ── */}
          {(activeTab as any) === 'user-resumes' && selectedUser && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <button
                    onClick={() => { setActiveTab('users'); setSelectedUser(null); }}
                    className="flex items-center gap-1 mb-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                    style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
                  >
                    ← Back to Users
                  </button>
                  <h3 className="text-lg font-bold text-gray-900">Resumes for {selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
                <button
                  onClick={() => {
                setResumeForm({ title: '', template: 'geometric-blue', category: 'ATS' });
                    setShowResumeModal(true);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                  style={{ backgroundColor: '#EDC9AF', color: '#2c2a63' }}
                >
                  + Create Resume
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {userResumes.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">No resumes yet for this user.</div>
                ) : (
                  userResumes.map((resume: any) => (
                    <div key={resume._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-semibold text-gray-900">{resume.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${resume.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {resume.status === 'published' ? 'Sent' : 'Draft'}
                          </span>
                          {getCreatedByLabel(resume)}
                        </div>
                        <p className="text-sm text-gray-500">
                          Template: {resume.template} · Updated: {formatDate(resume.updatedAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/app/builder/${resume._id}`)}
                          className="px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                          style={{ backgroundColor: '#EDC9AF', color: '#2c2a63' }}
                        >
                          {resume.status === 'published' ? 'Edit & Resend' : 'Edit & Send'}
                        </button>
                      </div>


                    </div>
                  ))
                )}
              </div>
            </div>
          )}

{/* ── CREATE RESUME MODAL ── */}
{showResumeModal && selectedUser && (
  <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#2c2a63]">
          Create Resume for {selectedUser.name}
        </h3>
        <button onClick={() => { setShowResumeModal(false); setPdfFile(null); setResumeJobDescription(''); setResumeSelectedJobRole(''); setResumeJobDropdownOpen(false); }}>
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Resume Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Resume Title</label>
          <input
            value={resumeForm.title}
            onChange={(e) => setResumeForm({ ...resumeForm, title: e.target.value })}
            placeholder="e.g. Frontend Developer Resume"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
          <select
            value={resumeForm.category}
            onChange={(e) => {
              const newCategory = e.target.value;
              const filtered = newCategory === 'All' ? allTemplates : allTemplates.filter(t => t.category === newCategory);
              setResumeForm({ ...resumeForm, category: newCategory, template: filtered[0]?.id || 'geometric-blue' });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
          >
            <option value="All">All</option>
            <option value="Simple">Simple</option>
            <option value="Word">Word</option>
            <option value="Picture">Picture</option>
            <option value="ATS">ATS</option>
            <option value="Two-column">Two-column</option>
          </select>
        </div>

        {/* Template */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Template</label>
          <select
            value={resumeForm.template}
            onChange={(e) => setResumeForm({ ...resumeForm, template: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
          >
            {(resumeForm.category === 'All' ? allTemplates : allTemplates.filter(t => t.category === resumeForm.category)).map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Upload Resume PDF <span className="text-gray-400">(optional)</span>
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#2c2a63] transition-colors"
            onClick={() => document.getElementById('salesPdfUpload')?.click()}
          >
            <input
              id="salesPdfUpload"
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) { toast.error('PDF must be less than 5MB'); return; }
                  setPdfFile(file);
                }
              }}
            />
            {pdfFile ? (
              <div className="flex items-center justify-center gap-2">
                <FileText size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-semibold">{pdfFile.name}</span>
                <button onClick={(e) => { e.stopPropagation(); setPdfFile(null); }} className="text-red-500 hover:text-red-700 ml-1">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <UploadCloud size={20} className="text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Click to upload PDF resume</p>
                <p className="text-xs text-gray-400">Max 5MB</p>
              </>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Job Description{' '}
            <span style={{ background: '#2c2a63', color: '#EDC9AF', padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, marginLeft: 4 }}>
              OPTIONAL
            </span>
          </label>
          <p className="text-xs text-gray-400 mb-2 italic">Tailor the resume content to a specific role</p>

          {/* Dropdown */}
          <div ref={resumeJobDropdownRef} style={{ position: 'relative', marginBottom: 8 }}>
            <div
              onClick={() => setResumeJobDropdownOpen(o => !o)}
              className="w-full px-3 py-2 border rounded-lg text-sm cursor-pointer flex justify-between items-center"
              style={{
                border: resumeSelectedJobRole ? '2px solid #10b981' : '2px solid #2c2a63',
                color: resumeSelectedJobRole ? '#10b981' : '#2c2a63',
                background: '#fff',
                boxSizing: 'border-box',
              }}
            >
              <span className="truncate text-sm">{resumeSelectedJobRole || 'Pick a job role (optional)…'}</span>
              <svg className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform ${resumeJobDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {resumeJobDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#2c2a63] rounded-lg shadow-xl overflow-y-auto z-50" style={{ maxHeight: 200 }}>
                {jobDescriptionSamples.map(sample => (
                  <div
                    key={sample.id}
                    onClick={() => { setResumeJobDescription(sample.description); setResumeSelectedJobRole(sample.title); setResumeJobDropdownOpen(false); }}
                    className="px-3 py-2 cursor-pointer text-sm font-semibold text-[#2c2a63] border-b border-gray-100 hover:bg-blue-50 transition-colors"
                  >
                    {sample.title} <span className="text-gray-400 font-normal text-xs">({sample.category})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected badge */}
          {resumeSelectedJobRole && resumeSelectedJobRole !== 'Custom Job Description' && (
            <div className="mb-2 px-3 py-2 bg-green-50 border border-green-400 rounded-lg flex items-center gap-2 text-xs text-green-700 font-semibold">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="flex-1 truncate">{resumeSelectedJobRole} selected</span>
              <button onClick={() => { setResumeSelectedJobRole(''); setResumeJobDescription(''); }} className="text-green-700 hover:text-green-900">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Custom textarea */}
          <textarea
            value={resumeJobDescription}
            onChange={e => {
              setResumeJobDescription(e.target.value);
              if (e.target.value && !resumeSelectedJobRole) setResumeSelectedJobRole('Custom Job Description');
              else if (!e.target.value) setResumeSelectedJobRole('');
            }}
            placeholder="Or paste a custom job description here…"
            rows={3}
            className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
            style={{ borderColor: resumeJobDescription.trim() ? '#10b981' : '#e5e7eb' }}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => { setShowResumeModal(false); setPdfFile(null); setResumeJobDescription(''); setResumeSelectedJobRole(''); setResumeJobDropdownOpen(false); }}
          className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium"
        >
          Cancel
        </button>
        <button
          disabled={!resumeForm.title || creatingResumeLoading}
          onClick={async () => {
            if (!resumeForm.title) return;
            setCreatingResumeLoading(true);
            try {
              const formData = new FormData();
              formData.append('title', resumeForm.title);
              formData.append('template', resumeForm.template);
              if (pdfFile) formData.append('resumePdf', pdfFile);
              if (resumeJobDescription.trim()) formData.append('jobDescription', resumeJobDescription.trim());

              const { data } = await api.post(`/admin/users/${selectedUser._id}/resumes`, formData);
              toast.success('Resume created! Redirecting to editor...');
              setShowResumeModal(false);
              setPdfFile(null);
              setResumeJobDescription('');
              setResumeSelectedJobRole('');
              navigate(`/app/builder/${data.resume._id}`);
            } catch (error: any) {
              toast.error(error?.response?.data?.message || 'Failed to create resume');
            } finally {
              setCreatingResumeLoading(false);
            }
          }}
          className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
        >
          {creatingResumeLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#EDC9AF] border-t-transparent rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            'Create & Edit Resume'
          )}
        </button>
      </div>
    </div>
  </div>
)}
       

          {/* Loading Spinner */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#2c2a63]"></div>
            </div>
          )}

        </main>
      </div>

      {/* ── ATS REPORT MODAL ── */}
      {viewingReport && (
        <div
          className="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-4"
          onClick={() => setViewingReport(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setViewingReport(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-[#2c2a63] text-white rounded-full hover:bg-[#1f1d4f] transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-1 overflow-hidden">

              {/* LEFT: Score Section */}
              <div className="w-80 bg-white p-6 overflow-y-auto border-r border-gray-200">

                {/* Circular Score */}
                <div className="text-center mb-6">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <svg width="160" height="160" className="transform -rotate-90">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth={12} />
                      <circle
                        cx="80" cy="80" r="70" fill="none"
                        stroke={viewingReport.atsScore >= 75 ? '#10b981' : viewingReport.atsScore >= 50 ? '#f59e0b' : '#ef4444'}
                        strokeWidth={12}
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - viewingReport.atsScore / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-5xl font-bold text-[#2c2a63]">{viewingReport.atsScore}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {viewingReport.atsScore >= 75 ? 'Excellent' : viewingReport.atsScore >= 50 ? 'Good' : 'Needs Improvement'}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#2c2a63] mb-2">ATS Score</h3>
                  <p className="text-sm text-gray-600">Resume Strength</p>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#2c2a63] mb-3">Score Breakdown</h4>
                  {[
                    { label: 'Keywords', score: viewingReport.detailedReport?.keywordsMatch?.percentage || 0, color: '#ef4444' },
                    { label: 'Skills', score: viewingReport.detailedReport?.skillsSection?.percentage || 0, color: '#f59e0b' },
                    { label: 'Experience', score: viewingReport.detailedReport?.experienceRelevance?.percentage || 0, color: '#8b5cf6' },
                    { label: 'Education', score: viewingReport.detailedReport?.educationCertifications?.percentage || 0, color: '#10b981' },
                    { label: 'Formatting', score: viewingReport.detailedReport?.resumeFormatting?.percentage || 0, color: '#14b8a6' },
                    { label: 'Projects', score: viewingReport.detailedReport?.projectsAchievements?.percentage || 0, color: '#3b82f6' },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-semibold text-[#2c2a63]">{item.label}</span>
                        <span className="text-xs font-bold" style={{ color: item.color }}>{item.score}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{ width: `${item.score}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-xs">
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-semibold text-[#2c2a63] break-all">{viewingReport.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Mobile:</span>
                    <p className="font-semibold text-[#2c2a63]">{viewingReport.mobile}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Submitted:</span>
                    <p className="font-semibold text-[#2c2a63]">{formatDate(viewingReport.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* RIGHT: Resume Preview */}
              <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={20} className="text-[#2c2a63]" />
                  <h4 className="text-lg font-bold text-[#2c2a63]">Resume Preview</h4>
                </div>

                {viewingReport.resumePath ? (
                  <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg" style={{ height: 'calc(90vh - 140px)' }}>
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(viewingReport.resumePath)}&embedded=true`}
                      className="w-full h-full border-0"
                      title="Resume PDF Preview"
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <FileText size={48} className="text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">Resume preview not available</p>
                      <p className="text-gray-400 text-sm mt-2">No resume file found</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;