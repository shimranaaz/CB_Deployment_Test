// client/src/pages/CoverLetterBuilder.tsx - PART 1
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeftIcon,
  DownloadIcon,
  SaveIcon,
  User,
  Mail,
  Phone,
  Linkedin,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  Palette,
  X
} from 'lucide-react';
import api from '../configs/api';
import toast from 'react-hot-toast';
import { CoverLetterData, ContactInfo, RecipientInfo, Opening, Body, Closing } from '../types/coverLetter';
import CoverLetterPreview from '../components/CoverLetterPreview';

interface RootState {
  auth: {
    token: string;
    user: any;
  };
}

const CoverLetterBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>({
    title: 'Untitled Cover Letter',
    contact_info: {},
    recipient_info: {},
    opening: { greeting: 'Dear Hiring Manager' },
    body: {},
    closing: { sign_off: 'Best regards' },
    header_color: '#2c2a63'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'recipient' | 'content'>('contact');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const colors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Purple', value: '#9333EA' },
    { name: 'Green', value: '#10B981' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Gray', value: '#6B7280' },
    { name: 'Black', value: '#000000' },
    { name: 'Violet', value: '#8B5CF6' },
    { name: 'Navy', value: '#2c2a63' },
    { name: 'Maroon', value: '#8B0000' },
    { name: 'Dark Blue', value: '#003366' },
    { name: 'Dark Green', value: '#2E7D32' },
    { name: 'Brown', value: '#5D4037' }
  ];

  useEffect(() => {
    if (id) {
      loadCoverLetter();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const loadCoverLetter = async () => {
    try {
      const { data } = await api.get(`/cover-letters/${id}`, {
        headers: { Authorization: token }
      });
      setCoverLetterData(data.coverLetter);
    } catch (error: any) {
      toast.error('Failed to load cover letter');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneNumber = phone.replace(/\D/g, '');
    return phoneNumber.length >= 10;
  };

  const validateCurrentTab = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (activeTab === 'contact') {
      if (!coverLetterData.contact_info?.full_name) {
        newErrors.full_name = 'Full name is required';
      }
      if (!coverLetterData.contact_info?.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(coverLetterData.contact_info.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!coverLetterData.contact_info?.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(coverLetterData.contact_info.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentTab()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    if (activeTab === 'contact') {
      setActiveTab('recipient');
    } else if (activeTab === 'recipient') {
      setActiveTab('content');
    }
  };

  const handlePrevious = () => {
    if (activeTab === 'content') {
      setActiveTab('recipient');
    } else if (activeTab === 'recipient') {
      setActiveTab('contact');
    }
  };

  const saveCoverLetter = async () => {
    if (!validateCurrentTab()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      setIsSaving(true);
      if (id) {
        await api.put(`/cover-letters/${id}`, coverLetterData, {
          headers: { Authorization: token }
        });
        toast.success('Cover letter saved successfully!');
      } else {
        const { data } = await api.post('/cover-letters/create', coverLetterData, {
          headers: { Authorization: token }
        });
        navigate(`/app/cover-letter/builder/${data.coverLetter._id}`, { replace: true });
        toast.success('Cover letter created successfully!');
      }
    } catch (error: any) {
      toast.error('Failed to save cover letter');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadCoverLetter = () => {
    window.print();
  };

  const updateContactInfo = (field: keyof ContactInfo, value: string) => {
    setCoverLetterData((prev: CoverLetterData) => ({
      ...prev,
      contact_info: { ...prev.contact_info, [field]: value }
    }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateRecipientInfo = (field: keyof RecipientInfo, value: string) => {
    setCoverLetterData((prev: CoverLetterData) => ({
      ...prev,
      recipient_info: { ...prev.recipient_info, [field]: value }
    }));
  };

  const updateOpening = (field: keyof Opening, value: string) => {
    setCoverLetterData((prev: CoverLetterData) => ({
      ...prev,
      opening: { ...prev.opening, [field]: value }
    }));
  };

  const updateBody = (field: keyof Body, value: string) => {
    setCoverLetterData((prev: CoverLetterData) => ({
      ...prev,
      body: { ...prev.body, [field]: value }
    }));
  };

  const updateClosing = (field: keyof Closing, value: string) => {
    setCoverLetterData((prev: CoverLetterData) => ({
      ...prev,
      closing: { ...prev.closing, [field]: value }
    }));
  };

  const formatPhoneNumber = (value: string): string => {
    const phoneNumber = value.replace(/[^\d+]/g, '');

    if (phoneNumber.startsWith('+')) {
      const numbers = phoneNumber.slice(1);

      if (numbers.length === 0) {
        return '+';
      } else if (numbers.length <= 2) {
        return `+${numbers}`;
      } else {
        const countryCode = numbers.slice(0, 2);
        const remaining = numbers.slice(2);

        if (remaining.length === 0) {
          return `+${countryCode}`;
        } else if (remaining.length <= 5) {
          return `+${countryCode} ${remaining}`;
        } else {
          const firstPart = remaining.slice(0, 5);
          const secondPart = remaining.slice(5, 10);
          return `+${countryCode} ${firstPart}${secondPart ? ' ' + secondPart : ''}`;
        }
      }
    } else {
      const numbers = phoneNumber.replace(/\D/g, '');

      if (numbers.length <= 5) {
        return numbers;
      } else if (numbers.length <= 10) {
        return `${numbers.slice(0, 5)} ${numbers.slice(5)}`;
      } else {
        const countryCode = numbers.slice(0, numbers.length - 10);
        const remaining = numbers.slice(numbers.length - 10);
        return `+${countryCode} ${remaining.slice(0, 5)} ${remaining.slice(5)}`;
      }
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    updateContactInfo('phone', formatted);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cover letter...</p>
        </div>
      </div>
    );
  }
  // client/src/pages/CoverLetterBuilder.tsx - PART 2 (JSX Return)
  // ... CONTINUED FROM PART 1

  return (
    <div className="bg-gray-50 min-h-screen">
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body * { visibility: hidden; }
          .cover-letter-preview, .cover-letter-preview * { visibility: visible; }
          .cover-letter-preview { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="no-print">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <Link to="/UserProfile" className="inline-flex gap-2 items-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors" style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}>
              <ArrowLeftIcon className="size-3.5 sm:size-4" /> Back to Dashboard
            </Link>
            <div className="flex gap-2 self-end sm:self-auto">
              <button onClick={saveCoverLetter} disabled={isSaving}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:opacity-90 transition-all disabled:opacity-50 text-xs sm:text-sm">
                <SaveIcon className="size-3.5 sm:size-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={downloadCoverLetter}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#EDC9AF] text-[#2c2a63] rounded-lg hover:opacity-90 transition-all text-xs sm:text-sm">
                <DownloadIcon className="size-3.5 sm:size-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 no-print">
            <div className="mb-4 sm:mb-6">
              <div className="relative">
                <button onClick={() => setShowColorPicker(!showColorPicker)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:opacity-90 transition-all text-xs sm:text-sm">
                  <Palette className="size-3.5 sm:size-4" />
                  <span className="font-medium">Choose Theme Color</span>
                </button>

                {showColorPicker && (
                  <div className="absolute top-full left-0 right-0 sm:right-auto mt-2 bg-white rounded-lg shadow-xl border-2 border-[#2c2a63] p-3 sm:p-4 z-50 sm:min-w-[280px]">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h3 className="font-semibold text-[#2c2a63] text-sm sm:text-base">Select Theme Color</h3>
                      <button onClick={() => setShowColorPicker(false)} className="text-gray-500 hover:text-[#2c2a63]">
                        <X className="size-3.5 sm:size-4" />
                      </button>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3">Choose a color for your cover letter header</p>
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                      {colors.map((color) => (
                        <button key={color.value}
                          onClick={() => { setCoverLetterData((prev) => ({ ...prev, header_color: color.value })); setShowColorPicker(false); }}
                          className="flex flex-col items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-lg hover:bg-[#EDC9AF]/20 transition-all">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all"
                            style={{
                              backgroundColor: color.value,
                              borderColor: coverLetterData.header_color === color.value ? '#2c2a63' : '#e5e7eb',
                              transform: coverLetterData.header_color === color.value ? 'scale(1.1)' : 'scale(1)',
                              boxShadow: coverLetterData.header_color === color.value ? '0 0 0 2px #EDC9AF' : 'none'
                            }}
                          />
                          <span className="text-[10px] sm:text-xs text-gray-600">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200 gap-3 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-bold text-[#2c2a63]">
                {activeTab === 'contact' && 'Your Contact Information'}
                {activeTab === 'recipient' && 'Recipient Information'}
                {activeTab === 'content' && 'Letter Content'}
              </h2>
              <div className="flex gap-2 self-end sm:self-auto">
                <button onClick={handlePrevious} disabled={activeTab === 'contact'}
                  className={`flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-all ${activeTab === 'contact' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#EDC9AF] text-[#2c2a63] hover:opacity-90'
                    }`}>
                  <ChevronLeft className="size-3.5 sm:size-4" /> Previous
                </button>
                {activeTab !== 'content' ? (
                  <button onClick={handleNext} className="flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:opacity-90 transition-all">
                    Next <ChevronRight className="size-3.5 sm:size-4" />
                  </button>
                ) : (
                  <button onClick={saveCoverLetter} disabled={isSaving}
                    className="flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:opacity-90 transition-all disabled:opacity-50">
                    <SaveIcon className="size-3.5 sm:size-4" /> {isSaving ? 'Saving...' : 'Save'}
                  </button>
                )}
              </div>
            </div>

            {activeTab === 'contact' && (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    <User className="size-3.5 sm:size-4" style={{ color: '#2c2a63' }} /> Full Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={coverLetterData.contact_info?.full_name || ''}
                    onChange={(e) => updateContactInfo('full_name', e.target.value)} placeholder="Enter your full name"
                    className={`w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm ${errors.full_name ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.full_name && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.full_name}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    <Phone className="size-3.5 sm:size-4" style={{ color: '#2c2a63' }} /> Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input type="tel" value={coverLetterData.contact_info?.phone || ''}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="Enter your phone number"
                    maxLength={17}

                    className={`w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.phone && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    <Mail className="size-3.5 sm:size-4" style={{ color: '#2c2a63' }} /> Email Address <span className="text-red-500">*</span>
                  </label>
                  <input type="email" value={coverLetterData.contact_info?.email || ''}
                    onChange={(e) => updateContactInfo('email', e.target.value)} placeholder="Enter your email address"
                    className={`w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.email && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    <Linkedin className="size-3.5 sm:size-4" style={{ color: '#2c2a63' }} /> LinkedIn Profile URL
                  </label>
                  <input type="url" value={coverLetterData.contact_info?.linkedin || ''}
                    onChange={(e) => updateContactInfo('linkedin', e.target.value)} placeholder="Enter your LinkedIn profile URL"
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="size-3.5 sm:size-4" style={{ color: '#2c2a63' }} /> City
                    </label>
                    <input type="text" value={coverLetterData.contact_info?.city || ''}
                      onChange={(e) => updateContactInfo('city', e.target.value)} placeholder="Enter your city"
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm" />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">State</label>
                    <input type="text" value={coverLetterData.contact_info?.state || ''}
                      onChange={(e) => updateContactInfo('state', e.target.value)} placeholder="Enter your state"
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm" />
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Postal Code</label>
                  <input type="text" value={coverLetterData.contact_info?.postal_code || ''}
                    onChange={(e) => updateContactInfo('postal_code', e.target.value)} placeholder="Enter your postal code"
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm" />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="size-3.5 sm:size-4" style={{ color: '#2c2a63' }} /> Date of Application
                  </label>
                  <input type="text" value={coverLetterData.contact_info?.date || ''}
                    onChange={(e) => updateContactInfo('date', e.target.value)} placeholder="e.g., January 7, 2026"
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm" />
                </div>
              </div>
            )}

            {activeTab === 'recipient' && (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    <User className="size-3.5 sm:size-4" style={{ color: '#2c2a63' }} /> Hiring Manager's Name
                  </label>
                  <input type="text" value={coverLetterData.recipient_info?.manager_name || ''}
                    onChange={(e) => updateRecipientInfo('manager_name', e.target.value)} placeholder="Enter hiring manager's name"
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm" />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    <Briefcase className="size-3.5 sm:size-4" style={{ color: '#2c2a63' }} /> Job Title
                  </label>
                  <input type="text" value={coverLetterData.recipient_info?.job_title || ''}
                    onChange={(e) => updateRecipientInfo('job_title', e.target.value)} placeholder="Enter job title you're applying for"
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm" />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    <Building2 className="size-3.5 sm:size-4" style={{ color: '#2c2a63' }} /> Company Name
                  </label>
                  <input type="text" value={coverLetterData.recipient_info?.company_name || ''}
                    onChange={(e) => updateRecipientInfo('company_name', e.target.value)} placeholder="Enter company name"
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm" />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Company Address</label>
                  <input type="text" value={coverLetterData.recipient_info?.company_address || ''}
                    onChange={(e) => updateRecipientInfo('company_address', e.target.value)} placeholder="Enter company address"
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm" />
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">City</label>
                    <input type="text" value={coverLetterData.recipient_info?.city || ''}
                      onChange={(e) => updateRecipientInfo('city', e.target.value)} placeholder="City"
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm" />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">State</label>
                    <input type="text" value={coverLetterData.recipient_info?.state || ''}
                      onChange={(e) => updateRecipientInfo('state', e.target.value)} placeholder="State"
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm" />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Postal</label>
                    <input type="text" value={coverLetterData.recipient_info?.postal_code || ''}
                      onChange={(e) => updateRecipientInfo('postal_code', e.target.value)} placeholder="Code"
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#2c2a63] mb-3 sm:mb-4">Greeting</h3>
                  <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Salutation</label>
                  <input type="text" value={coverLetterData.opening?.greeting || 'Dear Hiring Manager'}
                    onChange={(e) => updateOpening('greeting', e.target.value)} placeholder="Dear Hiring Manager"
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm" />
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#2c2a63] mb-3 sm:mb-4">Opening Paragraph</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Position Title</label>
                      <input type="text" value={coverLetterData.opening?.position_title || ''}
                        onChange={(e) => updateOpening('position_title', e.target.value)} placeholder="Enter the position you're applying for"
                        className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm" />
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">How You Found the Job</label>
                      <input type="text" value={coverLetterData.opening?.how_found || ''}
                        onChange={(e) => updateOpening('how_found', e.target.value)} placeholder="e.g., LinkedIn, company website, referral"
                        className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm" />
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">One-Sentence Summary</label>
                      <textarea rows={2} value={coverLetterData.opening?.summary || ''}
                        onChange={(e) => updateOpening('summary', e.target.value)} placeholder="Brief introduction about yourself and why you're excited about this role"
                        className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none resize-none text-xs sm:text-sm" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#2c2a63] mb-3 sm:mb-4">Body Paragraphs</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {['skill_1', 'skill_2', 'experience_summary', 'why_company'].map((key, idx) => (
                      <div key={key}>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                          {idx < 2 ? `Key Skill/Achievement ${idx + 1}` : idx === 2 ? 'Relevant Experience Summary' : 'Why This Company/Role'}
                        </label>
                        <textarea rows={3} value={coverLetterData.body?.[key as keyof Body] || ''}
                          onChange={(e) => updateBody(key as keyof Body, e.target.value)}
                          placeholder={idx < 2 ? `Describe your ${idx === 0 ? 'first' : 'second'} key skill or achievement` : idx === 2 ? 'Summarize your relevant work experience' : 'Explain why you\'re interested in this company and position'}
                          className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none resize-none text-xs sm:text-sm" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#2c2a63] mb-3 sm:mb-4">Closing</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Reiteration of Enthusiasm</label>
                      <textarea rows={2} value={coverLetterData.closing?.enthusiasm || ''}
                        onChange={(e) => updateClosing('enthusiasm', e.target.value)} placeholder="Express your enthusiasm and confidence in your ability to contribute"
                        className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none resize-none text-xs sm:text-sm" />
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Preferred Next Step</label>
                      <textarea rows={2} value={coverLetterData.closing?.next_step || ''}
                        onChange={(e) => updateClosing('next_step', e.target.value)} placeholder="Mention your availability for an interview or next steps"
                        className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none resize-none text-xs sm:text-sm" />
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Professional Sign-off</label>
                      <input type="text" value={coverLetterData.closing?.sign_off || 'Best regards'}
                        onChange={(e) => updateClosing('sign_off', e.target.value)} placeholder="Best regards"
                        className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-[#2c2a63] focus:ring-1 focus:ring-[#2c2a63] outline-none text-xs sm:text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <CoverLetterPreview data={coverLetterData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterBuilder;