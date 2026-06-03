import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, FileText, TrendingUp, Search, Trash2, ChevronLeft, ChevronRight, Home, Menu, X, LayoutDashboard, Phone, Eye, UploadCloud } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPenToSquare, faRightLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import api from '../configs/api';
import toast from 'react-hot-toast';

interface Stats {
  totalUsers: number;
  totalResumes: number;
  totalPayments: number;
  totalFailedPayments: number;
  totalRevenue: number;
  lostRevenue: number;
  totalATSSubmissions: number;
  totalCouponsUsed: number;
  activeCoupons: number;
  totalLinkedInSubmissions: number;
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
interface Payment {
  _id: string;
  userId: {
    name: string;
    email: string;
    mobile?: string;
    isDeleted?: boolean;
  } | null;
  userName?: string;
  userEmail?: string;
  userMobile?: string;
  plan: string;
  amount: number;
  status: string;
  type: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  createdAt: string;
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


interface LinkedInSubmission {
  _id: string;
  fullName: string;
  email: string;
  linkedinScore: number;
  createdAt: string;
}


// ── Ebook states ──
interface Ebook {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  fileSize: string;
  isFree: boolean;
  color: string;
  order: number;
  isActive: boolean;
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

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [addingEbook, setAddingEbook] = useState(false);
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);
  const [newEbook, setNewEbook] = useState({
    title: '', description: '', coverImage: '', pdfUrl: '',
    fileSize: '', isFree: false, color: '#2c2a63', order: 0,
  });
  
 const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'payments' | 'failed-payments' | 'resumes' | 'terms' | 'ats-checker' | 'linkedin-checker' | 'pricing' | 'coupons' | 'user-resumes' | 'admin-resume-builder' | 'ebooks'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
  const [resumeSearchQuery, setResumeSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name?: string } | null>(null);

  const [atsSubmissions, setAtsSubmissions] = useState<ATSSubmission[]>([]);
  const [linkedinSubmissions, setLinkedinSubmissions] = useState<LinkedInSubmission[]>([]);
  const [atsSearch, setAtsSearch] = useState('');
  const [linkedinSearch, setLinkedinSearch] = useState('');
  const [viewingReport, setViewingReport] = useState<ATSSubmission | null>(null);


  const [terms, setTerms] = useState<any[]>([]);
  const [editingTerm, setEditingTerm] = useState<{ section: string; content: string } | null>(null);
  const [originalContent, setOriginalContent] = useState<string>('');

  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);


  const [resumeJobDescription, setResumeJobDescription] = useState('');
const [resumeSelectedJobRole, setResumeSelectedJobRole] = useState('');
const [resumeJobDropdownOpen, setResumeJobDropdownOpen] = useState(false);
const resumeJobDropdownRef = useRef<HTMLDivElement>(null);



  // 👇 ADD ALL NEW STATES HERE
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userResumes, setUserResumes] = useState<any[]>([]);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeForm, setResumeForm] = useState({
    title: '',
    template: 'geometric-blue',
    category: 'Simple',
  });
  const [transferResumeId, setTransferResumeId] = useState('');
  const [transferTargetEmail, setTransferTargetEmail] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [creatingResumeLoading, setCreatingResumeLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

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


  useEffect(() => {
  const h = (e: MouseEvent) => {
    if (resumeJobDropdownRef.current && !resumeJobDropdownRef.current.contains(e.target as Node))
      setResumeJobDropdownOpen(false);
  };
  document.addEventListener('mousedown', h);
  return () => document.removeEventListener('mousedown', h);
}, []);



  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (activeTab === 'overview') {
      loadStats();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'payments') {
      loadPayments();
    } else if (activeTab === 'failed-payments') {
      loadFailedPayments();
    }


    else if (activeTab === 'ats-checker') {
      loadATSSubmissions();
    }

    else if (activeTab === 'linkedin-checker') {
      loadLinkedInSubmissions();
    }

    else if (activeTab === 'resumes') {
      loadResumes();
    } else if (activeTab === 'terms') {
      loadTerms();
    }
    else if (activeTab === 'pricing') {
      loadPricing();
    }

 else if (activeTab === 'coupons') {
  loadCoupons();
}
else if (activeTab === 'ebooks') {
  loadEbooks();
}

}, [activeTab, currentPage, searchQuery, resumeSearchQuery, atsSearch, linkedinSearch]);

  const loadFailedPayments = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading failed payments...');
      const { data } = await api.get('/admin/payments/failed', {
        params: { page: currentPage, limit: 10 }
      });

      console.log('✅ Failed payments loaded:', data.payments.length);
      console.log('📊 Failed payments data:', data.payments);

      setPayments(data.payments);
      setTotalPages(data.pagination.pages);
    } catch (error: any) {
      console.error('❌ Failed to load failed payments:', error);
      console.error('❌ Error response:', error?.response?.data);
      toast.error(error?.response?.data?.message || 'Failed to load failed payments');
    } finally {
      setLoading(false);
    }
  };


  const [addingPlan, setAddingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    planKey: '',
    name: '',
    subtitle: '',
    price: 0,
    priceUnit: '/ Resume',
    description: '',
    features: [{ text: '', included: true }],
    buttonText: 'Get Now',
    popular: false,
    isFree: false,
  });

  const addPricingPlan = async () => {
    try {
      await api.post('/pricing/add', newPlan);
      toast.success('Plan added successfully');
      loadPricing();
      setAddingPlan(false);
      setNewPlan({
        planKey: '', name: '', subtitle: '', price: 0,
        priceUnit: '/ Resume', description: '',
        features: [{ text: '', included: true }],
        buttonText: 'Get Now', popular: false, isFree: false,
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to add plan');
    }
  };


  const loadEbooks = async () => {
  setLoading(true);
  try {
    const { data } = await api.get('/ebooks/admin/all');
    setEbooks(data.ebooks);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Failed to load ebooks');
  } finally {
    setLoading(false);
  }
};

const createEbook = async () => {
  if (!newEbook.title || !newEbook.description || !newEbook.pdfUrl) {
    toast.error('Title, description and PDF URL are required');
    return;
  }
  try {
    await api.post('/ebooks', newEbook);
    toast.success('Ebook created successfully!');
    loadEbooks();
    setAddingEbook(false);
    setNewEbook({ title: '', description: '', coverImage: '', pdfUrl: '', fileSize: '', isFree: false, color: '#2c2a63', order: 0 });
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Failed to create ebook');
  }
};

const updateEbook = async () => {
  if (!editingEbook) return;
  try {
    await api.put(`/ebooks/${editingEbook._id}`, editingEbook);
    toast.success('Ebook updated successfully!');
    loadEbooks();
    setEditingEbook(null);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Failed to update ebook');
  }
};

const toggleEbookStatus = async (ebookId: string, isActive: boolean) => {
  try {
    await api.patch(`/ebooks/${ebookId}/toggle`, { isActive });
    toast.success(`Ebook ${isActive ? 'activated' : 'deactivated'}`);
    loadEbooks();
  } catch (error: any) {
    toast.error('Failed to update ebook status');
  }
};

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/coupons');
      setCoupons(data.coupons);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async () => {
    try {
      await api.post('/coupons', newCoupon);
      toast.success('Coupon created successfully!');
      loadCoupons();
      setAddingCoupon(false);
      setNewCoupon({ couponCode: '', discountType: 'percentage', discountValue: 0, expiresAt: '', isActive: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create coupon');
    }
  };

  const toggleCoupon = async (couponCode: string, isActive: boolean) => {
    try {
      await api.patch(`/coupons/${couponCode}/toggle`, { isActive });
      toast.success(`Coupon ${isActive ? 'activated' : 'deactivated'}`);
      loadCoupons();
    } catch (error: any) {
      toast.error('Failed to update coupon');
    }
  };


  
  const [coupons, setCoupons] = useState<any[]>([]);
  const [addingCoupon, setAddingCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    couponCode: '',
    discountType: 'percentage',
    discountValue: 0,
    expiresAt: '',
    isActive: true,
  });

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


  const deleteATSSubmission = async (id: string) => {
    try {
      await api.delete(`/admin/ats/${id}`);  // ← Makes API call
      toast.success('ATS submission deleted successfully');
      loadATSSubmissions();
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete ATS submission');
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

  const deleteLinkedInSubmission = async (id: string) => {
    try {
      await api.delete(`/admin/linkedin/${id}`);
      toast.success('LinkedIn submission deleted successfully');
      loadLinkedInSubmissions();
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete submission');
    }
  };


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

const checkAdminAccess = async () => {
  // ✅ FIX: Don't run access check if we're navigating away to builder
  if (!window.location.pathname.includes('/admin')) return;
  
  try {
    const { data } = await api.get('/users/data');
    if (data.user.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      if (data.user.role === 'sales') {
        navigate('/sales/ats-checker');
      } else {
        navigate('/app');
      }
    }
  } catch (error) {
    toast.error('Failed to verify admin access');
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

  const loadPayments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/payments', {
        params: { page: currentPage, limit: 10 }
      });
      setPayments(data.payments);
      setTotalPages(data.pagination.pages);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load payments');
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

  const loadTerms = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/terms');
      setTerms(data.terms);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load terms');
    } finally {
      setLoading(false);
    }
  };

  const updateTermContent = async (section: string, content: string) => {
    try {
      await api.put(`/terms/${encodeURIComponent(section)}`, { content });
      toast.success('Term updated successfully');
      loadTerms();
      setEditingTerm(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update term');
    }
  };


  const loadPricing = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/pricing');
      setPricingPlans(data.plans);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load pricing');
    }

    finally {
      setLoading(false);
    }
  };

  const updatePricingPlan = async (planKey: string, planData: any) => {
    try {
      await api.put(`/pricing/${planKey}`, planData);
      toast.success('Plan updated successfully');
      loadPricing();
      setEditingPlan(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update plan');
    }
  };

  const updateUserPlan = async (userId: string, newPlan: string) => {
    try {
      await api.put(`/admin/users/${userId}/plan`, { plan: newPlan });
      toast.success('User plan updated successfully');
      loadUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update plan');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      loadUsers();
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete user');
    }
  };

  const deletePayment = async (paymentId: string) => {
    try {
      await api.delete(`/admin/payments/${paymentId}`);
      toast.success('Payment deleted successfully');
      loadPayments();
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete payment');
    }
  };

  const deleteResume = async (resumeId: string) => {
    try {
      await api.delete(`/admin/resumes/${resumeId}`);
      toast.success('Resume deleted successfully');
      loadResumes();
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete resume');
    }
  };

  const handleDeleteClick = (type: string, id: string, name?: string) => {
    setDeleteTarget({ type, id, name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'user') {
      deleteUser(deleteTarget.id);
    } else if (deleteTarget.type === 'payment') {
      deletePayment(deleteTarget.id);
    } else if (deleteTarget.type === 'resume') {
      deleteResume(deleteTarget.id);
    }
    else if (deleteTarget.type === 'ats') {
      deleteATSSubmission(deleteTarget.id);
    }

    else if (deleteTarget.type === 'linkedin') {
      deleteLinkedInSubmission(deleteTarget.id);
    }

    else if (deleteTarget.type === 'pricing') {
      try {
        await api.delete(`/pricing/${deleteTarget.id}`);
        toast.success('Plan deleted successfully');
        loadPricing();
        setShowDeleteModal(false);
        setDeleteTarget(null);
      }
      catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to delete plan');
      }
    }

   else if (deleteTarget.type === 'coupon') {
  try {
    await api.delete(`/coupons/${deleteTarget.id}`);
    toast.success('Coupon deleted successfully');
    loadCoupons();
    setShowDeleteModal(false);
    setDeleteTarget(null);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Failed to delete coupon');
  }
}
else if (deleteTarget.type === 'ebook') {
  try {
    await api.delete(`/ebooks/${deleteTarget.id}`);
    toast.success('Ebook deleted successfully');
    loadEbooks();
    setShowDeleteModal(false);
    setDeleteTarget(null);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Failed to delete ebook');
  }
}

    // 👇 ADD THIS NEW CASE
    else if (deleteTarget.type === 'admin-resume') {
      try {
        await api.delete(`/admin/users/${selectedUser!._id}/resumes/${deleteTarget.id}`);
        toast.success('Resume deleted');
        const { data } = await api.get(`/admin/users/${selectedUser!._id}/resumes`);
        setUserResumes(data.resumes);
        setShowDeleteModal(false);
        setDeleteTarget(null);
      } catch (error: any) {
        toast.error('Failed to delete resume');
      }
    }
  };

  const formatUserDisplay = (
    userId: { name: string; email: string; mobile?: string; isDeleted?: boolean } | null | undefined,
    fallbackName?: string,
    fallbackEmail?: string,
    fallbackMobile?: string
  ) => {
    if (!userId && (fallbackName || fallbackEmail)) {
      return {
        name: `Deleted User (${fallbackName || 'Unknown'})`,
        email: fallbackEmail || 'No email available',
        mobile: fallbackMobile || 'N/A',
        isDeleted: true
      };
    }

    if (!userId) {
      return {
        name: 'Deleted User',
        email: 'User no longer exists',
        mobile: 'N/A',
        isDeleted: true
      };
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

    return {
      ...userId,
      mobile: userId.mobile || 'N/A'
    };
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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


  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Professional': return 'bg-purple-100 text-purple-700';
      case 'Advanced': return 'bg-blue-100 text-blue-700';
      case 'Basic': return 'bg-green-100 text-green-700';
      case 'Trial': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#2c2a63] text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="h-full flex flex-col">
          <div className="p-4 sm:p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-[#EDC9AF]">Admin Panel</h2>
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
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'overview'
                ? 'bg-[#EDC9AF] text-[#2c2a63]'
                : 'text-white hover:bg-white/10'
                }`}
            >
              <LayoutDashboard size={18} className="sm:w-5 sm:h-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab('users'); setCurrentPage(1); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'users'
                ? 'bg-[#EDC9AF] text-[#2c2a63]'
                : 'text-white hover:bg-white/10'
                }`}
            >
              <Users size={18} className="sm:w-5 sm:h-5" />
              <span className="font-medium">Users</span>
            </button>

            <button
              onClick={() => { setActiveTab('payments'); setCurrentPage(1); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'payments'
                ? 'bg-[#EDC9AF] text-[#2c2a63]'
                : 'text-white hover:bg-white/10'
                }`}
            >
              <DollarSign size={18} className="sm:w-5 sm:h-5" />
              <span className="font-medium">Payments</span>
            </button>
            <button
              onClick={() => { setActiveTab('failed-payments'); setCurrentPage(1); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'failed-payments'
                ? 'bg-[#EDC9AF] text-[#2c2a63]'
                : 'text-white hover:bg-white/10'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Failed Payments</span>
            </button>


            <button
              onClick={() => { setActiveTab('ats-checker'); setCurrentPage(1); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'ats-checker'
                ? 'bg-[#EDC9AF] text-[#2c2a63]'
                : 'text-white hover:bg-white/10'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">ATS Checker</span>
            </button>

            <button
              onClick={() => { setActiveTab('linkedin-checker'); setCurrentPage(1); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'linkedin-checker'
                ? 'bg-[#EDC9AF] text-[#2c2a63]'
                : 'text-white hover:bg-white/10'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span className="font-medium">LinkedIn Checker</span>
            </button>

        <button
              onClick={() => { setActiveTab('resumes'); setCurrentPage(1); setResumeSearchQuery(''); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'resumes'
                ? 'bg-[#EDC9AF] text-[#2c2a63]'
                : 'text-white hover:bg-white/10'
                }`}
            >
              <FileText size={18} className="sm:w-5 sm:h-5" />
              <span className="font-medium">Resumes</span>
            </button>

            <button
              onClick={() => { setActiveTab('terms'); setCurrentPage(1); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'terms'
                ? 'bg-[#EDC9AF] text-[#2c2a63]'
                : 'text-white hover:bg-white/10'
                }`}
            >
              <FileText size={18} className="sm:w-5 sm:h-5" />
              <span className="font-medium">Manage Terms</span>
            </button>

            <button
              onClick={() => { setActiveTab('pricing'); setCurrentPage(1); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'pricing'
                ? 'bg-[#EDC9AF] text-[#2c2a63]'
                : 'text-white hover:bg-white/10'
                }`}
            >
              <DollarSign size={18} className="sm:w-5 sm:h-5" />
              <span className="font-medium">Manage Pricing</span>
            </button>

          <button
  onClick={() => { setActiveTab('coupons'); setCurrentPage(1); setSidebarOpen(false); }}
  className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'coupons'
    ? 'bg-[#EDC9AF] text-[#2c2a63]'
    : 'text-white hover:bg-white/10'
    }`}
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
  <span className="font-medium">Coupons</span>
</button>

<button
  onClick={() => { setActiveTab('ebooks'); setCurrentPage(1); setSidebarOpen(false); }}
  className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'ebooks'
    ? 'bg-[#EDC9AF] text-[#2c2a63]'
    : 'text-white hover:bg-white/10'
    }`}
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
  <span className="font-medium">Manage E-Books</span>
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

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={20} className="sm:w-6 sm:h-6 text-[#2c2a63]" />
              </button>
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-[#2c2a63]">Admin Dashboard</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 overflow-auto">
          {activeTab === 'overview' && stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
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
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm">Failed Payments</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalFailedPayments}</p>
                  <p className="text-xs text-gray-900 mt-1">Lost: {formatCurrency(stats.lostRevenue)}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm">Successful Payments</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalPayments}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm">Total Revenue</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex flex-col items-start gap-3">

                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>

                  {/* Text */}
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">ATS Submissions</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {stats?.totalATSSubmissions || 0}
                    </p>
                  </div>

                </div>
              </div>



              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex flex-col items-start gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Coupons Used</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {stats?.totalCouponsUsed || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Active Coupons: {stats?.activeCoupons || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex flex-col items-start gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">LinkedIn Submissions</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {stats?.totalLinkedInSubmissions || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                  />
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="block lg:hidden divide-y divide-gray-200">
                {users.map((user) => (
                  <div key={user._id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{user.email}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <Phone size={12} />
                          <span>{user.mobile || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            setSelectedUser(user);
                            setActiveTab('user-resumes');
                            const { data } = await api.get(`/admin/users/${user._id}/resumes`);
                            setUserResumes(data.resumes);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-2"
                          title="Manage Resumes"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick('user', user._id, user.name)}
                          disabled={user.role === 'admin'}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      {user.role === 'admin' ? (
                        <span className="text-xs px-2 py-1 rounded-full font-semibold bg-gray-100 text-gray-400">
                          All Access
                        </span>
                      ) : (
                        <select
                          value={user.plan}
                          onChange={(e) => updateUserPlan(user._id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${getPlanColor(user.plan)} cursor-pointer`}
                        >
                          <option value="Free">Free</option>
                          <option value="Trial">Trial</option>
                          <option value="Basic">Basic</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Professional">Professional</option>
                        </select>
                      )}

                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {user.role}
                      </span>

                      <span className="text-xs text-gray-500">{formatDate(user.createdAt)}</span>
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
                          {user.role === 'admin' ? (
                            <span className="text-xs px-2 py-1 rounded-full font-semibold bg-gray-100 text-gray-400 cursor-not-allowed">
                              All Access
                            </span>
                          ) : (
                            <select
                              value={user.plan}
                              onChange={(e) => updateUserPlan(user._id, e.target.value)}
                              className={`text-xs px-2 py-1 rounded-full font-semibold ${getPlanColor(user.plan)} cursor-pointer`}
                            >
                              <option value="Free">Free</option>
                              <option value="Trial">Trial</option>
                              <option value="Basic">Basic</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Professional">Professional</option>
                            </select>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={async () => {
                                setSelectedUser(user);
                                setActiveTab('user-resumes');
                                const { data } = await api.get(`/admin/users/${user._id}/resumes`);
                                setUserResumes(data.resumes);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                              title="Manage Resumes"
                            >
                              <FileText size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick('user', user._id, user.name)}
                              disabled={user.role === 'admin'}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={user.role === 'admin' ? 'Cannot delete admin' : 'Delete user'}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 sm:p-4 border-t border-gray-200 flex flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <span className="text-xs sm:text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white rounded-lg shadow-sm">
              {/* Mobile Card View */}
              <div className="block lg:hidden divide-y divide-gray-200">
                {payments.map((payment) => {
                  const userDisplay = formatUserDisplay(
                    payment.userId,
                    payment.userName,
                    payment.userEmail,
                    payment.userMobile
                  );
                  return (
                    <div key={payment._id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${userDisplay.isDeleted ? 'text-gray-500 italic' : 'text-gray-900'}`}>
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
                        <button
                          onClick={() => handleDeleteClick('payment', payment._id, `Payment ${payment.razorpay_payment_id || payment.razorpay_order_id}`)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 items-center mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(payment.plan)}`}>
                          {payment.plan}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${payment.status === 'success' ? 'bg-green-100 text-green-700' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                          {payment.status}
                        </span>
                        <span className="text-xs text-gray-500">{payment.type === 'pro-plan' ? 'PRO Plan' : 'Template'}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                        <span className="text-xs text-gray-500">{formatDate(payment.createdAt)}</span>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => {
                      const userDisplay = formatUserDisplay(
                        payment.userId,
                        payment.userName,
                        payment.userEmail,
                        payment.userMobile
                      );
                      return (
                        <tr key={payment._id} className="hover:bg-gray-50">
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
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(payment.plan)}`}>
                              {payment.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.type === 'pro-plan' ? 'PRO Plan' : 'Template'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${payment.status === 'success' ? 'bg-green-100 text-green-700' :
                              payment.status === 'failed' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(payment.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteClick('payment', payment._id, `Payment ${payment.razorpay_payment_id || payment.razorpay_order_id}`)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete payment"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3 sm:p-4 border-t border-gray-200 flex flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <span className="text-xs sm:text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  Next
                  <ChevronRight size={16} />
                </button>

              </div>
            </div>
          )}

          {activeTab === 'failed-payments' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Failed Payment Transactions</h3>
                <p className="text-sm text-gray-600 mt-1">Review and manage failed payment attempts</p>
              </div>

              {/* Mobile Card View */}
              <div className="block lg:hidden divide-y divide-gray-200">
                {payments.length === 0 ? (
                  <div className="p-8 text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600">No failed payments found</p>
                  </div>
                ) : (
                  payments.map((payment) => {
                    const userDisplay = formatUserDisplay(
                      payment.userId,
                      payment.userName,
                      payment.userEmail,
                      payment.userMobile
                    );
                    return (
                      <div key={payment._id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className={`text-sm font-medium ${userDisplay.isDeleted ? 'text-gray-500 italic' : 'text-gray-900'}`}>
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
                          <button
                            onClick={() => handleDeleteClick('payment', payment._id, `Payment ${payment.razorpay_payment_id || payment.razorpay_order_id}`)}
                            className="text-red-600 hover:text-red-800 p-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 items-center mb-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(payment.plan)}`}>
                            {payment.plan}
                          </span>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                            FAILED
                          </span>
                          <span className="text-xs text-gray-500">{payment.type === 'pro-plan' ? 'PRO Plan' : 'Template'}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                          <span className="text-xs text-gray-500">{formatDate(payment.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                {payments.length === 0 ? (
                  <div className="p-12 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Failed Payments</h3>
                    <p className="text-gray-500">All payment transactions completed successfully</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => {
                        const userDisplay = formatUserDisplay(
                          payment.userId,
                          payment.userName,
                          payment.userEmail,
                          payment.userMobile
                        );
                        return (
                          <tr key={payment._id} className="hover:bg-gray-50">
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
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(payment.plan)}`}>
                                {payment.plan}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.type === 'pro-plan' ? 'PRO Plan' : 'Template'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                                FAILED
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(payment.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => handleDeleteClick('payment', payment._id, `Payment ${payment.razorpay_payment_id || payment.razorpay_order_id}`)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete payment"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              <div className="p-3 sm:p-4 border-t border-gray-200 flex flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <span className="text-xs sm:text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}


          {activeTab === 'ats-checker' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">ATS Resume Checker Submissions</h3>
                <p className="text-sm text-gray-600 mt-1">View and manage all resume analysis requests</p>
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
                              color: '#fff',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}>
                              {submission.atsScore}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(submission.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">

                              <button
                                onClick={async () => {
                                  try {
                                    console.log('🔍 Fetching report for submission:', submission._id);
                                    const { data } = await api.get(`/admin/ats/${submission._id}`);
                                    console.log('✅ Report data received:', data);
                                    console.log('📊 Detailed Report:', data.submission?.detailedReport);
                                    setViewingReport(data.submission);
                                  } catch (error) {
                                    console.error('❌ Failed to load report:', error);
                                    toast.error('Failed to load full report');
                                  }
                                }}
                                className="text-blue-600 hover:text-blue-800"
                                title="View Report"
                              >
                                <Eye size={18} />
                              </button>

                              <button
                                onClick={() => handleDeleteClick('ats', submission._id, submission.fullName)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete submission"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
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


          {activeTab === 'linkedin-checker' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">LinkedIn Profile Checker Submissions</h3>
                <p className="text-sm text-gray-600 mt-1">View and manage all LinkedIn profile analysis requests</p>
              </div>
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email or mobile..."
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {linkedinSubmissions.map((submission) => (
                        <tr key={submission._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.fullName || '—'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.email || '—'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span style={{
                              background: submission.linkedinScore >= 75 ? '#10b981' : submission.linkedinScore >= 50 ? '#f59e0b' : '#ef4444',
                              color: '#fff',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}>
                              {submission.linkedinScore}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(submission.createdAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteClick('linkedin', submission._id, submission.fullName)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete submission"
                            >
                              <Trash2 size={18} />
                            </button>
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
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                  />
                </div>
              </div>
              {/* Mobile Card View */}
              <div className="block lg:hidden divide-y divide-gray-200">
                {resumes.map((resume) => {
                  const userDisplay = formatUserDisplay(resume.userId);
                  return (
                    <div key={resume._id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
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
                        <button
                          onClick={() => handleDeleteClick('resume', resume._id, resume.title)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <Trash2 size={16} />
                        </button>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resumes.map((resume) => {
                      const userDisplay = formatUserDisplay(resume.userId);
                      return (
                        <tr key={resume._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {resume.title}
                            </div>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteClick('resume', resume._id, resume.title)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete resume"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3 sm:p-4 border-t border-gray-200 flex flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <span className="text-xs sm:text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#2c2a63]">Manage Terms & Conditions</h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Edit the content that appears on the Terms page</p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await api.post('/terms/initialize');
                        toast.success('Terms re-initialized successfully!');
                        loadTerms();
                      } catch (error: any) {
                        toast.error(error?.response?.data?.message || 'Failed to re-initialize terms');
                      }
                    }}
                    className="px-3 sm:px-4 py-2 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#252353] transition-colors text-xs sm:text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                    </svg>
                    <span>Re-initialize</span>
                  </button>


                </div>
              </div>


              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#2c2a63]"></div>
                  </div>
                ) : terms.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText size={40} className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">No Terms Found</h3>
                    <p className="text-sm text-gray-500 mb-6">No terms and conditions have been created yet.</p>
                    <button
                      onClick={async () => {
                        try {
                          await api.post('/terms/initialize');
                          toast.success('Default terms initialized successfully');
                          loadTerms();
                        } catch (error: any) {
                          toast.error(error?.response?.data?.message || 'Failed to initialize terms');
                        }
                      }}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#1f1d4f] transition-colors font-medium text-sm whitespace-nowrap"
                    >
                      Initialize Default Terms
                    </button>
                  </div>
                ) : (
                  terms.map((term) => (
                    <div key={term.section} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-[#2c2a63]">{term.section}</h3>
                        <button
                          onClick={() => {
                            setEditingTerm({ section: term.section, content: term.content });
                            setOriginalContent(term.content);
                          }}
                          className="px-3 sm:px-4 py-2 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#1f1d4f] transition-colors text-xs sm:text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                        >
                          <FileText size={14} />
                          Edit
                        </button>

                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap break-words">
                          {term.content.length > 200 ? `${term.content.substring(0, 200)}...` : term.content}
                        </p>
                      </div>

                      <div className="mt-2 text-xs text-gray-500">
                        Last updated: {new Date(term.lastUpdated).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {editingTerm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-3 sm:p-4">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] flex flex-col">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex-1 min-w-0 mr-2">
                    <h3 className="text-lg sm:text-2xl font-bold text-[#2c2a63] truncate">Edit: {editingTerm.section}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {editingTerm.content.length} chars · {editingTerm.content.split(/\s+/).length} words
                      {editingTerm.content !== originalContent && (
                        <span className="ml-2 text-orange-600 font-semibold">● Modified</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingTerm(null);
                      setOriginalContent('');
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>

                <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                  <textarea
                    value={editingTerm.content}
                    onChange={(e) => setEditingTerm({ ...editingTerm, content: e.target.value })}
                    className="w-full h-full min-h-[300px] sm:min-h-[500px] p-3 sm:p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c2a63] focus:border-transparent font-mono text-xs sm:text-sm resize-none"
                    placeholder="Enter term content..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => {
                      setEditingTerm({ ...editingTerm, content: originalContent });
                      toast.success('Changes reverted');
                    }}
                    disabled={editingTerm.content === originalContent}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#252353] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7v6h6" />
                      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                    </svg>
                    Undo Changes
                  </button>

                  <div className="flex gap-2 sm:gap-3 justify-end">
                    <button
                      onClick={() => {
                        setEditingTerm(null);
                        setOriginalContent('');
                      }}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm whitespace-nowrap"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => updateTermContent(editingTerm.section, editingTerm.content)}
                      disabled={editingTerm.content === originalContent}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#1f1d4f] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                    >
                      <FileText size={16} />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'pricing' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#2c2a63]">Manage Pricing Plans</h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Edit plans that appear live on the Pricing section</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAddingPlan(true)}
                      className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                      style={{ backgroundColor: "#EDC9AF", color: "#2c2a63" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      Add Plan
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await api.post('/pricing/initialize');
                          toast.success('Pricing re-initialized successfully!');
                          loadPricing();
                        } catch (error: any) {
                          toast.error(error?.response?.data?.message || 'Failed to re-initialize pricing');
                        }
                      }}
                      className="px-3 sm:px-4 py-2 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#252353] transition-colors text-xs sm:text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                      </svg>
                      Re-initialize
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2c2a63]"></div>
                  </div>
                ) : pricingPlans.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign size={40} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">No Plans Found</h3>
                    <p className="text-sm text-gray-500 mb-6">Click below to seed the default pricing plans.</p>
                    <button
                      onClick={async () => {
                        try {
                          await api.post('/pricing/initialize');
                          toast.success('Default plans initialized!');
                          loadPricing();
                        } catch (error: any) {
                          toast.error('Failed to initialize pricing');
                        }
                      }}
                      className="px-4 sm:px-6 py-2.5 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#1f1d4f] transition-colors font-medium text-sm"
                    >
                      Initialize Default Plans
                    </button>
                  </div>
                ) : (
                  pricingPlans.map((pricingItem) => (
                    <div key={pricingItem.planKey} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-base sm:text-lg font-semibold text-[#2c2a63]">{pricingItem.name}</h3>
                          <span className="text-lg font-bold text-[#2c2a63]">{pricingItem.priceDisplay}</span>
                          {pricingItem.popular && <span className="text-xs px-2 py-1 rounded-full font-semibold bg-[#EDC9AF] text-[#2c2a63]">POPULAR</span>}
                          {pricingItem.isFree && <span className="text-xs px-2 py-1 rounded-full font-semibold bg-green-100 text-green-700">FREE</span>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingPlan({ ...pricingItem, features: pricingItem.features.map((f: any) => ({ ...f })) })}
                            className="px-3 sm:px-4 py-2 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#1f1d4f] transition-colors text-xs sm:text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                          >
                            <FileText size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick('pricing', pricingItem.planKey, pricingItem.name)}
                            className="px-3 sm:px-4 py-2 border rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                            style={{ backgroundColor: "#EDC9AF", color: "#2c2a63", borderColor: "#EDC9AF" }}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-gray-600 mb-3">{pricingItem.subtitle}</p>
                        <ul className="space-y-1">
                          {pricingItem.features.map((f: any, i: number) => (
                            <li key={i} className={`text-xs flex items-center gap-2 ${f.included ? 'text-gray-700' : 'text-gray-400'}`}>
                              <span style={{ color: f.included ? '#1db954' : '#9ca3af' }}>{f.included ? '✓' : '✗'}</span>
                              <span className={f.included ? '' : 'line-through'}>{f.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Last updated: {new Date(pricingItem.lastUpdated).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {editingPlan && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-3 sm:p-4">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] flex flex-col">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#2c2a63]">Edit: {editingPlan.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">Changes reflect live on the pricing page</p>
                  </div>
                  <button onClick={() => setEditingPlan(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Plan Name</label>
                    <input value={editingPlan.name}
                      onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]" />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitle</label>
                    <input value={editingPlan.subtitle}
                      onChange={(e) => setEditingPlan({ ...editingPlan, subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]" />
                  </div>

                  {/* Price / Unit / Button */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹)</label>
                      <input type="number" value={editingPlan.price}
                        onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value), priceDisplay: `₹${e.target.value}` })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Price Unit</label>
                      <input value={editingPlan.priceUnit}
                        onChange={(e) => setEditingPlan({ ...editingPlan, priceUnit: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Button Text</label>
                      <input value={editingPlan.buttonText}
                        onChange={(e) => setEditingPlan({ ...editingPlan, buttonText: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]" />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                    <input value={editingPlan.description}
                      onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]" />
                  </div>

                  {/* Toggles */}
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editingPlan.popular}
                        onChange={(e) => setEditingPlan({ ...editingPlan, popular: e.target.checked })}
                        className="w-4 h-4 accent-[#2c2a63]" />
                      <span className="text-sm font-medium text-gray-700">Mark as Popular</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editingPlan.isFree}
                        onChange={(e) => setEditingPlan({ ...editingPlan, isFree: e.target.checked })}
                        className="w-4 h-4 accent-[#2c2a63]" />
                      <span className="text-sm font-medium text-gray-700">Is Free Plan</span>
                    </label>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Features</label>
                    <div className="space-y-2">
                      {editingPlan.features.map((feature: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input type="checkbox" checked={feature.included}
                            onChange={(e) => {
                              const updated = [...editingPlan.features];
                              updated[idx] = { ...updated[idx], included: e.target.checked };
                              setEditingPlan({ ...editingPlan, features: updated });
                            }}
                            className="w-4 h-4 flex-shrink-0 accent-[#2c2a63]"
                          />
                          <input value={feature.text}
                            onChange={(e) => {
                              const updated = [...editingPlan.features];
                              updated[idx] = { ...updated[idx], text: e.target.value };
                              setEditingPlan({ ...editingPlan, features: updated });
                            }}
                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2c2a63]"
                          />
                          <button
                            onClick={() => setEditingPlan({ ...editingPlan, features: editingPlan.features.filter((_: any, i: number) => i !== idx) })}
                            className="text-red-500 hover:text-red-700 flex-shrink-0 p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setEditingPlan({ ...editingPlan, features: [...editingPlan.features, { text: 'New feature', included: true }] })}
                      className="mt-2 text-xs text-[#2c2a63] font-semibold hover:underline"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 justify-end p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setEditingPlan(null)}
                    className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updatePricingPlan(editingPlan.planKey, editingPlan)}
                    className="px-4 py-2 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#1f1d4f] font-medium text-sm flex items-center gap-2"
                  >
                    <FileText size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}



          {addingPlan && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-3 sm:p-4">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] flex flex-col">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#2c2a63]">Add New Plan</h3>
                    <p className="text-xs text-gray-500 mt-1">New plan will appear live on the pricing page</p>
                  </div>
                  <button onClick={() => setAddingPlan(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

                  {/* Plan Key + Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Plan Key <span className="text-gray-400">(unique, no spaces)</span></label>
                      <input
                        value={newPlan.planKey}
                        onChange={(e) => setNewPlan({ ...newPlan, planKey: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                        placeholder="e.g. premium"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Plan Name</label>
                      <input
                        value={newPlan.name}
                        onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                        placeholder="e.g. Premium · 6 Months"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                      />
                    </div>
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitle</label>
                    <input
                      value={newPlan.subtitle}
                      onChange={(e) => setNewPlan({ ...newPlan, subtitle: e.target.value })}
                      placeholder="Short tagline for this plan"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                    />
                  </div>

                  {/* Price / Unit / Button */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        value={newPlan.price}
                        onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Price Unit</label>
                      <input
                        value={newPlan.priceUnit}
                        onChange={(e) => setNewPlan({ ...newPlan, priceUnit: e.target.value })}
                        placeholder="/ Resume"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Button Text</label>
                      <input
                        value={newPlan.buttonText}
                        onChange={(e) => setNewPlan({ ...newPlan, buttonText: e.target.value })}
                        placeholder="Get Now"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                    <input
                      value={newPlan.description}
                      onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                      placeholder="Short description shown under price"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={newPlan.popular}
                        onChange={(e) => setNewPlan({ ...newPlan, popular: e.target.checked })}
                        className="w-4 h-4 accent-[#2c2a63]" />
                      <span className="text-sm font-medium text-gray-700">Mark as Popular</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={newPlan.isFree}
                        onChange={(e) => setNewPlan({ ...newPlan, isFree: e.target.checked })}
                        className="w-4 h-4 accent-[#2c2a63]" />
                      <span className="text-sm font-medium text-gray-700">Is Free Plan</span>
                    </label>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Features</label>
                    <div className="space-y-2">
                      {newPlan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input type="checkbox" checked={feature.included}
                            onChange={(e) => {
                              const updated = [...newPlan.features];
                              updated[idx] = { ...updated[idx], included: e.target.checked };
                              setNewPlan({ ...newPlan, features: updated });
                            }}
                            className="w-4 h-4 flex-shrink-0 accent-[#2c2a63]"
                          />
                          <input
                            value={feature.text}
                            onChange={(e) => {
                              const updated = [...newPlan.features];
                              updated[idx] = { ...updated[idx], text: e.target.value };
                              setNewPlan({ ...newPlan, features: updated });
                            }}
                            placeholder="Feature description"
                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2c2a63]"
                          />
                          <button
                            onClick={() => setNewPlan({ ...newPlan, features: newPlan.features.filter((_, i) => i !== idx) })}
                            className="text-red-500 hover:text-red-700 flex-shrink-0 p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setNewPlan({ ...newPlan, features: [...newPlan.features, { text: '', included: true }] })}
                      className="mt-2 text-xs text-[#2c2a63] font-semibold hover:underline"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 justify-end p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setAddingPlan(false)}
                    className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addPricingPlan}
                    disabled={!newPlan.planKey || !newPlan.name}
                    className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{ backgroundColor: "#2c2a63", color: "#EDC9AF" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Plan
                  </button>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'coupons' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#2c2a63]">Manage Coupons</h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Create and manage discount coupon codes</p>
                  </div>
                  <button
                    onClick={() => setAddingCoupon(true)}
                    className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2"
                    style={{ backgroundColor: '#EDC9AF', color: '#2c2a63' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Coupon
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {coupons.length === 0 ? (
                  <div className="p-12 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Coupons Yet</h3>
                    <p className="text-gray-500">Create your first coupon code to get started</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uses</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {coupons.map((coupon) => (
                        <tr key={coupon._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-[#2c2a63] bg-[#f5f0eb] px-2 py-1 rounded">
                              {coupon.couponCode}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {coupon.discountType === 'percentage'
                              ? `${coupon.discountValue}% off`
                              : `₹${coupon.discountValue} off`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {coupon.usedCount || 0} / {coupon.maxUses === 0 ? '∞' : coupon.maxUses}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {coupon.expiresAt ? formatDate(coupon.expiresAt) : 'No expiry'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleCoupon(coupon.couponCode, !coupon.isActive)}
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${coupon.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                            >
                              {coupon.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteClick('coupon', coupon._id, coupon.couponCode)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

{activeTab === 'ebooks' && (
  <div className="bg-white rounded-lg shadow-sm">
    <div className="p-4 sm:p-6 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#2c2a63]">Manage E-Books</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Add and manage career e-books for users</p>
        </div>
        <button
          onClick={() => setAddingEbook(true)}
          className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 whitespace-nowrap"
          style={{ backgroundColor: '#EDC9AF', color: '#2c2a63' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Add E-Book
        </button>
      </div>
    </div>

    <div className="p-4 sm:p-6">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2c2a63]"></div>
        </div>
      ) : ebooks.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No E-Books Yet</h3>
          <p className="text-gray-500 mb-4">Add your first e-book to get started</p>
          <button
            onClick={() => setAddingEbook(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
          >Add E-Book</button>
        </div>
      ) : (
        <div className="space-y-4">
          {ebooks.map((ebook) => (
            <div key={ebook._id} className="border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
              {/* Cover preview */}
              <div className="w-full sm:w-24 h-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                style={{ background: `${ebook.color}18`, border: `2px solid ${ebook.color}30` }}>
                {ebook.coverImage ? (
                  <img src={ebook.coverImage} alt={ebook.title} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-10 h-10" fill="none" stroke={ebook.color} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-sm sm:text-base font-bold text-[#2c2a63] truncate">{ebook.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ebook.isFree ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                    {ebook.isFree ? 'FREE' : 'PREMIUM'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ebook.isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    {ebook.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{ebook.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  {ebook.fileSize && <span>📦 {ebook.fileSize}</span>}
                  <span>🎨 <span className="font-mono">{ebook.color}</span></span>
                  <span>📋 Order: {ebook.order}</span>
                </div>
              </div>


{/* Actions */}
<div className="flex flex-row gap-2 flex-shrink-0 items-start">
  <button
    onClick={() => setEditingEbook({ ...ebook })}
    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
    style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    Edit
  </button>
  <button
    onClick={() => toggleEbookStatus(ebook._id, !ebook.isActive)}
    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
    style={{ backgroundColor: '#EDC9AF', color: '#2c2a63' }}
  >
    {ebook.isActive ? 'Hide' : 'Show'}
  </button>
  <button
    onClick={() => handleDeleteClick('ebook', ebook._id, ebook.title)}
    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
    style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
  >
    <Trash2 size={12} />
    Delete
  </button>
</div>
          
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

{/* Add Ebook Modal */}
{addingEbook && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-3 sm:p-4">
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] flex flex-col">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#2c2a63]">Add New E-Book</h3>
          <p className="text-xs text-gray-500 mt-1">Fill in the details for the new e-book</p>
        </div>
        <button onClick={() => setAddingEbook(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Book Title <span className="text-red-500">*</span></label>
          <input value={newEbook.title} onChange={e => setNewEbook({ ...newEbook, title: e.target.value })}
            placeholder="e.g. The Ultimate LinkedIn Profile Guide"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
          <textarea value={newEbook.description} onChange={e => setNewEbook({ ...newEbook, description: e.target.value })}
            placeholder="A short description of what this e-book covers..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63] resize-none" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Cover Image URL</label>
          <input value={newEbook.coverImage} onChange={e => setNewEbook({ ...newEbook, coverImage: e.target.value })}
            placeholder="https://your-imagekit-url.com/cover.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]" />
          <p className="text-xs text-gray-400 mt-1">Upload image to ImageKit and paste URL here</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">PDF URL <span className="text-red-500">*</span></label>
          <input value={newEbook.pdfUrl} onChange={e => setNewEbook({ ...newEbook, pdfUrl: e.target.value })}
            placeholder="https://your-imagekit-url.com/ebook.pdf"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]" />
          <p className="text-xs text-gray-400 mt-1">Upload PDF to ImageKit and paste URL here</p>
        </div>

   <div>
  <label className="block text-xs font-semibold text-gray-700 mb-1">File Size</label>
  <input value={newEbook.fileSize} onChange={e => setNewEbook({ ...newEbook, fileSize: e.target.value })}
    placeholder="e.g. PDF · 8 MB"
    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]" />
</div>

<div className="flex items-center gap-3 pt-1">
  <label className="flex items-center gap-2 cursor-pointer">
    <div onClick={() => setNewEbook({ ...newEbook, isFree: !newEbook.isFree })}
      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${newEbook.isFree ? 'bg-green-500' : 'bg-gray-300'}`}>
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${newEbook.isFree ? 'translate-x-5' : 'translate-x-0.5'}`}/>
    </div>
    <span className="text-sm font-medium text-gray-700">{newEbook.isFree ? 'Free' : 'Premium'}</span>
  </label>
</div>


      </div>

      <div className="flex gap-3 justify-end p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
        <button onClick={() => setAddingEbook(false)}
          className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
          Cancel
        </button>
        <button onClick={createEbook} disabled={!newEbook.title || !newEbook.description || !newEbook.pdfUrl}
          className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Add E-Book
        </button>
      </div>
    </div>
  </div>
)}

{/* Edit Ebook Modal */}
{editingEbook && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-3 sm:p-4">
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] flex flex-col">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#2c2a63]">Edit E-Book</h3>
          <p className="text-xs text-gray-500 mt-1">Changes reflect immediately for users</p>
        </div>
        <button onClick={() => setEditingEbook(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Book Title <span className="text-red-500">*</span></label>
          <input value={editingEbook.title} onChange={e => setEditingEbook({ ...editingEbook, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
          <textarea value={editingEbook.description} onChange={e => setEditingEbook({ ...editingEbook, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63] resize-none" />
        </div>

     <div>
  <label className="block text-xs font-semibold text-gray-700 mb-2">Cover Image</label>
  <div className="flex gap-2 mb-2">
    <button
      type="button"
      onClick={() => setNewEbook({ ...newEbook, _coverMode: 'url' } as any)}
      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
        (newEbook as any)._coverMode !== 'upload'
          ? 'border-[#2c2a63] bg-[#2c2a63] text-[#EDC9AF]'
          : 'border-gray-300 bg-white text-gray-600'
      }`}
    >
      Paste URL
    </button>
    <button
      type="button"
      onClick={() => setNewEbook({ ...newEbook, _coverMode: 'upload' } as any)}
      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
        (newEbook as any)._coverMode === 'upload'
          ? 'border-[#2c2a63] bg-[#2c2a63] text-[#EDC9AF]'
          : 'border-gray-300 bg-white text-gray-600'
      }`}
    >
      Upload File
    </button>
  </div>

  {(newEbook as any)._coverMode === 'upload' ? (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#2c2a63] transition-colors"
      onClick={() => document.getElementById('ebookCoverUpload')?.click()}
    >
      <input
        id="ebookCoverUpload"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) { toast.error('Image must be less than 5MB'); return; }
          const reader = new FileReader();
          reader.onload = (ev) => {
            setNewEbook({ ...newEbook, coverImage: ev.target?.result as string, _coverMode: 'upload' } as any);
          };
          reader.readAsDataURL(file);
        }}
      />
      {newEbook.coverImage && (newEbook as any)._coverMode === 'upload' ? (
        <div className="flex flex-col items-center gap-2">
          <img src={newEbook.coverImage} alt="Preview" className="h-20 object-contain rounded" />
          <span className="text-xs text-green-600 font-semibold">Image selected</span>
        </div>
      ) : (
        <>
          <svg className="w-8 h-8 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-gray-500">Click to upload cover image</p>
          <p className="text-xs text-gray-400">JPG, PNG, WEBP · Max 5MB</p>
        </>
      )}
    </div>
  ) : (
    <input
      value={(newEbook as any)._coverMode === 'upload' ? '' : newEbook.coverImage}
      onChange={e => setNewEbook({ ...newEbook, coverImage: e.target.value } as any)}
      placeholder="https://your-imagekit-url.com/cover.jpg"
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
    />
  )}
</div>

      <div>
  <label className="block text-xs font-semibold text-gray-700 mb-2">Cover Image</label>
  <div className="flex gap-2 mb-2">
    <button
      type="button"
      onClick={() => setEditingEbook({ ...editingEbook, _coverMode: 'url' } as any)}
      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
        (editingEbook as any)._coverMode !== 'upload'
          ? 'border-[#2c2a63] bg-[#2c2a63] text-[#EDC9AF]'
          : 'border-gray-300 bg-white text-gray-600'
      }`}
    >
      Paste URL
    </button>
    <button
      type="button"
      onClick={() => setEditingEbook({ ...editingEbook, _coverMode: 'upload' } as any)}
      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
        (editingEbook as any)._coverMode === 'upload'
          ? 'border-[#2c2a63] bg-[#2c2a63] text-[#EDC9AF]'
          : 'border-gray-300 bg-white text-gray-600'
      }`}
    >
      Upload File
    </button>
  </div>

  {(editingEbook as any)._coverMode === 'upload' ? (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#2c2a63] transition-colors"
      onClick={() => document.getElementById('editEbookCoverUpload')?.click()}
    >
      <input
        id="editEbookCoverUpload"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) { toast.error('Image must be less than 5MB'); return; }
          const reader = new FileReader();
          reader.onload = (ev) => {
            setEditingEbook({ ...editingEbook, coverImage: ev.target?.result as string, _coverMode: 'upload' } as any);
          };
          reader.readAsDataURL(file);
        }}
      />
      {editingEbook.coverImage && (editingEbook as any)._coverMode === 'upload' ? (
        <div className="flex flex-col items-center gap-2">
          <img src={editingEbook.coverImage} alt="Preview" className="h-20 object-contain rounded" />
          <span className="text-xs text-green-600 font-semibold">Image selected</span>
        </div>
      ) : (
        <>
          <svg className="w-8 h-8 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-gray-500">Click to upload cover image</p>
          <p className="text-xs text-gray-400">JPG, PNG, WEBP · Max 5MB</p>
        </>
      )}
    </div>
  ) : (
    <input
      value={(editingEbook as any)._coverMode === 'upload' ? '' : editingEbook.coverImage}
      onChange={e => setEditingEbook({ ...editingEbook, coverImage: e.target.value } as any)}
      placeholder="https://your-imagekit-url.com/cover.jpg"
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
    />
  )}
</div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">File Size</label>
            <input value={editingEbook.fileSize} onChange={e => setEditingEbook({ ...editingEbook, fileSize: e.target.value })}
              placeholder="e.g. PDF · 8 MB"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Accent Color</label>
            <div className="flex gap-2">
              <input type="color" value={editingEbook.color} onChange={e => setEditingEbook({ ...editingEbook, color: e.target.value })}
                className="w-10 h-9 rounded border border-gray-300 cursor-pointer p-0.5" />
              <input value={editingEbook.color} onChange={e => setEditingEbook({ ...editingEbook, color: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Display Order</label>
            <input type="number" value={editingEbook.order} onChange={e => setEditingEbook({ ...editingEbook, order: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]" />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => setEditingEbook({ ...editingEbook, isFree: !editingEbook.isFree })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${editingEbook.isFree ? 'bg-green-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${editingEbook.isFree ? 'translate-x-5' : 'translate-x-0.5'}`}/>
              </div>
              <span className="text-sm font-medium text-gray-700">{editingEbook.isFree ? 'Free' : 'Premium'}</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
        <button onClick={() => setEditingEbook(null)}
          className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
          Cancel
        </button>
        <button onClick={updateEbook}
          className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
          style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

          {addingCoupon && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-3 sm:p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#2c2a63]">Create New Coupon</h3>
                  <button onClick={() => setAddingCoupon(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Coupon Code</label>
                    <input
                      value={newCoupon.couponCode}
                      onChange={(e) => setNewCoupon({ ...newCoupon, couponCode: e.target.value.toUpperCase().replace(/\s/g, '') })}
                      placeholder="e.g. SAVE20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm uppercase font-mono focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Discount Type</label>
                      <select
                        value={newCoupon.discountType}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                      >
                        <option value="percent">Percentage (%)</option>
                        <option value="flat">Flat Amount (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Value {newCoupon.discountType === 'percentage' ? '(%)' : '(₹)'}
                      </label>
                      <input
                        type="number"
                        value={newCoupon.discountValue}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Expiry Date <span className="text-gray-400">(optional)</span></label>
                      <input
                        type="date"
                        value={newCoupon.expiresAt}
                        onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCoupon.isActive}
                      onChange={(e) => setNewCoupon({ ...newCoupon, isActive: e.target.checked })}
                      className="w-4 h-4 accent-[#2c2a63]"
                    />
                    <span className="text-sm font-medium text-gray-700">Active immediately</span>
                  </label>
                </div>

                <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setAddingCoupon(false)}
                    className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createCoupon}
                    disabled={!newCoupon.couponCode || newCoupon.discountValue <= 0}
                    className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
                  >
                    Create Coupon
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* Transfer Resume Modal */}
          {showTransferModal && (
            <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#2c2a63]">Transfer Resume</h3>
                  <button onClick={() => setShowTransferModal(false)}><X size={20} /></button>
                </div>
                <p className="text-sm text-gray-500 mb-4">Enter the email of the user you want to transfer this resume to.</p>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Target User Email</label>
                  <input
                    value={transferTargetEmail}
                    onChange={(e) => setTransferTargetEmail(e.target.value)}
                    placeholder="inaya@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63]"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowTransferModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
                  <button
                    onClick={async () => {
                      try {
                        const { data: userData } = await api.get('/admin/users', { params: { search: transferTargetEmail, limit: 1 } });
                        const targetUser = userData.users?.[0];
                        if (!targetUser) { toast.error('User not found'); return; }
                        await api.put(`/admin/resumes/${transferResumeId}/transfer`, { newUserId: targetUser._id });
                        toast.success(`Resume transferred to ${targetUser.name}!`);
                        setShowTransferModal(false);
                        const { data } = await api.get(`/admin/users/${selectedUser!._id}/resumes`);
                        setUserResumes(data.resumes);
                      } catch (error: any) {
                        toast.error(error?.response?.data?.message || 'Transfer failed');
                      }
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold"
                    style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
                  >
                    Transfer Resume
                  </button>
                </div>
              </div>
            </div>
          )}

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

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
          <select
            value={resumeForm.category}
            onChange={(e) => {
              const newCategory = e.target.value;
              const filtered = newCategory === 'All' ? allTemplates : allTemplates.filter(t => t.category === newCategory);
              setResumeForm({ ...resumeForm, category: newCategory, template: filtered[0]?.id || 'geometric-blue' });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63] bg-white"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2a63] bg-white"
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
            onClick={() => document.getElementById('adminPdfUpload')?.click()}
          >
            <input
              id="adminPdfUpload"
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
            if (!resumeForm.title || creatingResumeLoading) return;
            setCreatingResumeLoading(true);
            try {
              const formData = new FormData();
              formData.append('title', resumeForm.title);
              formData.append('template', resumeForm.template);
              if (pdfFile) formData.append('resumePdf', pdfFile);
              if (resumeJobDescription.trim()) formData.append('jobDescription', resumeJobDescription.trim());

              const { data } = await api.post(`/admin/users/${selectedUser._id}/resumes`, formData);
              const newResumeId = data.resume._id;
              setCreatingResumeLoading(false);
              setShowResumeModal(false);
              setPdfFile(null);
              setResumeJobDescription('');
              setResumeSelectedJobRole('');
              toast.success('Resume created successfully!');
              navigate(`/app/builder/${newResumeId}`);
            } catch (error: any) {
              setCreatingResumeLoading(false);
              toast.error(error?.response?.data?.message || 'Failed to create resume');
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


          {/* User Resumes Tab */}
          {activeTab === 'user-resumes' && selectedUser && (
            <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
  <div className="flex items-center justify-between gap-2 mb-2">
    <button
      onClick={() => { setActiveTab('users'); setSelectedUser(null); }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
      style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
    >
      <FontAwesomeIcon icon={faArrowLeft} />
      Back to Users
    </button>
    <button
      onClick={() => {
       setResumeForm({ title: '', template: 'geometric-blue', category: 'ATS' });
        setPdfFile(null);
        setShowResumeModal(true);
      }}
      className="px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap"
      style={{ backgroundColor: '#EDC9AF', color: '#2c2a63' }}
    >
      + Create Resume
    </button>
  </div>
  <h3 className="text-base font-bold text-gray-900 mt-2">{selectedUser.name}</h3>
  <p className="text-sm text-gray-500">{selectedUser.email}</p>
</div>
              <div className="divide-y divide-gray-200">
                {userResumes.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">No resumes yet for this user.</div>
                ) : (
                  userResumes.map((resume: any) => (
                 <div key={resume._id} className="p-4 hover:bg-gray-50 border-b border-gray-100">
  <style>{`
    .resume-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .resume-row-info { flex: 1; min-width: 0; }
    .resume-row-actions { display: flex; gap: 8px; flex-shrink: 0; }
    .resume-row-actions button { padding: 6px 14px; }
    @media (max-width: 640px) {
      .resume-row { flex-direction: column; align-items: flex-start; }
      .resume-row-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; width: 100%; }
      .resume-row-actions button { padding: 8px 4px; font-size: 11px; justify-content: center; }
    }
  `}</style>

  <div className="resume-row">
    {/* Left: Resume info */}
    <div className="resume-row-info">
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <p className="font-semibold text-gray-900 text-sm">{resume.title}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${resume.status === 'published'
          ? 'bg-green-100 text-green-700'
          : 'bg-yellow-100 text-yellow-700'
          }`}>
          {resume.status === 'published' ? 'Sent' : 'Draft'}
        </span>
        {getCreatedByLabel(resume)}
      </div>
      <p className="text-xs text-gray-500">
        Template: {resume.template} · Updated: {formatDate(resume.updatedAt)}
      </p>
      {resume.adminUploadedPdf && (
        <a href={resume.adminUploadedPdf}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 underline"
        >
          View uploaded PDF
        </a>
      )}
    </div>

    {/* Right: Action buttons */}
    <div className="resume-row-actions">
      <button
        onClick={() => navigate(`/app/builder/${resume._id}`)}
        className="flex items-center gap-1.5 rounded-lg text-sm font-semibold transition-colors"
        style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
      >
        <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
        Edit
      </button>
      <button
        onClick={() => { setTransferResumeId(resume._id); setTransferTargetEmail(''); setShowTransferModal(true); }}
        className="flex items-center gap-1.5 rounded-lg text-sm font-semibold transition-colors"
        style={{ backgroundColor: '#EDC9AF', color: '#2c2a63' }}
      >
        <FontAwesomeIcon icon={faRightLeft} className="text-xs" />
        Transfer
      </button>
      <button
        onClick={() => handleDeleteClick('admin-resume', resume._id, resume.title)}
        className="flex items-center gap-1.5 rounded-lg text-sm font-semibold transition-colors"
        style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
      >
        <FontAwesomeIcon icon={faTrash} className="text-xs" />
        Delete
      </button>
    </div>
  </div>
</div>
                 
                  ))
                )}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#2c2a63]"></div>
            </div>
          )}
        </main>
      </div>

      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-red-100 mb-3 sm:mb-4">
                <Trash2 className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Confirm Deletion
              </h3>

              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
                Are you sure you want to delete <span className="font-semibold break-words">{deleteTarget.name}</span>?
                This action cannot be undone.
              </p>

              <div className="flex gap-2 sm:gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                  }}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm whitespace-nowrap"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {viewingReport && (
        <div
          className="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-4"
          onClick={() => setViewingReport(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewingReport(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-[#2c2a63] text-white rounded-full hover:bg-[#1f1d4f] transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex flex-1 overflow-hidden">
              <div className="w-80 bg-white p-6 overflow-y-auto border-r border-gray-200">

                <div className="text-center mb-6">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <svg width="160" height="160" className="transform -rotate-90">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth={12} />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke={viewingReport.atsScore >= 75 ? '#10b981' : viewingReport.atsScore >= 50 ? '#f59e0b' : '#ef4444'}
                        strokeWidth={12}
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - viewingReport.atsScore / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-5xl font-bold text-[#2c2a63]">
                        {viewingReport.atsScore}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {viewingReport.atsScore >= 75 ? 'Excellent' : viewingReport.atsScore >= 50 ? 'Good' : 'Needs Improvement'}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#2c2a63] mb-2">ATS Score</h3>
                  <p className="text-sm text-gray-600">Resume Strength</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#2c2a63] mb-3">Score Breakdown</h4>

                  {[
                    { label: 'Keywords', score: viewingReport.detailedReport?.keywordsMatch?.percentage || 0, color: '#ef4444' },
                    { label: 'Skills', score: viewingReport.detailedReport?.skillsSection?.percentage || 0, color: '#f59e0b' },
                    { label: 'Experience', score: viewingReport.detailedReport?.experienceRelevance?.percentage || 0, color: '#8b5cf6' },
                    { label: 'Education', score: viewingReport.detailedReport?.educationCertifications?.percentage || 0, color: '#10b981' },
                    { label: 'Formatting', score: viewingReport.detailedReport?.resumeFormatting?.percentage || 0, color: '#14b8a6' },
                    { label: 'Projects', score: viewingReport.detailedReport?.projectsAchievements?.percentage || 0, color: '#3b82f6' }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-semibold text-[#2c2a63]">{item.label}</span>
                        <span className="text-xs font-bold" style={{ color: item.color }}>{item.score}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${item.score}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
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
              <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={20} className="text-[#2c2a63]" />
                  <h4 className="text-lg font-bold text-[#2c2a63]">Resume Preview</h4>
                </div>

                {viewingReport.resumePath ? (
                  true ? (
                    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg" style={{ height: 'calc(90vh - 140px)' }}>
                      <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(viewingReport.resumePath)}&embedded=true`}
                        className="w-full h-full border-0"
                        title="Resume PDF Preview"
                      />
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 min-h-[400px]">
                      <div className="w-20 h-24 bg-gradient-to-br from-[#2c2a63] to-[#3d3a7a] rounded-lg flex items-center justify-center mb-4 shadow-lg">
                        <FileText size={40} className="text-white" />
                      </div>
                      <p className="text-gray-700 font-semibold mb-2 text-lg">Document Preview</p>
                      <p className="text-gray-500 text-sm mb-4">Preview not available for this file type</p>
                      <button
                        onClick={() => {
                          window.open(viewingReport?.resumePath, '_blank');
                        }}
                        className="px-6 py-3 bg-[#2c2a63] text-white rounded-lg hover:bg-[#1f1d4f] transition-colors flex items-center gap-2 font-semibold"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download File
                      </button>
                    </div>
                  )
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

export default AdminDashboard;