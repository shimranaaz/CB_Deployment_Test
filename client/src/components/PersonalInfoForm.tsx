import { BriefcaseBusiness, Globe, Linkedin, Mail, MapPin, Phone, User, Briefcase, LucideIcon, Lock } from 'lucide-react';
import React, { ChangeEvent, useState, useEffect } from 'react';

interface PersonalInfoData {
  full_name?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  profession?: string;
  linkedin?: string;
  website?: string;
  image?: File | string;
}

interface PersonalInfoFormProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
  removeBackground: boolean;
  setRemoveBackground: React.Dispatch<React.SetStateAction<boolean>>;
  personalInfoLocked?: boolean;
  globalEditUsed?: boolean;
}

interface Field {
  key: keyof PersonalInfoData;
  label: string;
  icon: LucideIcon;
  type: string;
  required?: boolean;
  validation?: (value: string) => string | null;
  lockable?: boolean;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  data,
  onChange,
  removeBackground,
  setRemoveBackground,
  personalInfoLocked = false,
  globalEditUsed = false
}) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  //Directly use props, don't use local state
  const isLocked = personalInfoLocked || globalEditUsed;


  useEffect(() => {
    console.log('🔐 PersonalInfoForm render:', {
      personalInfoLocked,
      globalEditUsed,
      isLocked,
      hasData: !!data.full_name
    });
  }, [personalInfoLocked, globalEditUsed, isLocked, data.full_name]);

  // Validation functions
  const validateEmail = (email: string): string | null => {
    if (!email) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone) return null;
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
    if (phone.replace(/\D/g, '').length < 10) return 'Phone number must be at least 10 digits';
    return null;
  };

  const validateLinkedIn = (url: string): string | null => {
    if (!url) return null;
    const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/.*$/;
    if (!linkedInRegex.test(url)) return 'Please enter a valid LinkedIn URL';
    return null;
  };

  const validateWebsite = (url: string): string | null => {
    if (!url) return null;
    const urlRegex = /^https?:\/\/.+\..+$/;
    if (!urlRegex.test(url)) return 'Please enter a valid website URL';
    return null;
  };

  const handleChange = (field: keyof PersonalInfoData, value: string | File): void => {
    onChange({ ...data, [field]: value });

    if (typeof value === 'string') {
      setTouched(prev => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field: keyof PersonalInfoData): void => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: Field): string | null => {
    if (!touched[field.key]) return null;

    const value = data[field.key] as string;

    if (field.required && (!value || value.trim() === '')) {
      return null;
    }

    if (value && field.validation) {
      return field.validation(value);
    }

    return null;
  };

  //  Check if field should be locked
  const isFieldLocked = (field: Field): boolean => {
    if (!field.lockable) return false;
    return isLocked;
  };

  const fields: Field[] = [
    {
      key: "full_name",
      label: "Full Name",
      icon: User,
      type: "text",
      required: true,
      lockable: true
    },
    {
      key: "title",
      label: "Title",
      icon: Briefcase,
      type: "text",
      required: false
    },
    {
      key: "email",
      label: "Email Address",
      icon: Mail,
      type: "email",
      required: true,
      validation: validateEmail,
      lockable: true
    },
    {
      key: "phone",
      label: "Phone Number",
      icon: Phone,
      type: "tel",
      validation: validatePhone,
      lockable: true
    },
    {
      key: "location",
      label: "Location",
      icon: MapPin,
      type: "text"
    },
    {
      key: "profession",
      label: "Profession",
      icon: BriefcaseBusiness,
      type: "text"
    },
    {
      key: "linkedin",
      label: "LinkedIn Profile",
      icon: Linkedin,
      type: "url",
      validation: validateLinkedIn
    },
    {
      key: "website",
      label: "Personal Website",
      icon: Globe,
      type: "url",
      validation: validateWebsite
    }
  ];

  return (
    <div className="px-4 sm:px-0">
      <h3 className='text-lg sm:text-xl font-semibold text-gray-900'>Personal Information</h3>
      <p className='text-xs sm:text-sm text-gray-600 mt-1'>Get Started with the personal information</p>

      {/*  Show lock warning */}
      {isLocked && (
        <div className="mt-3 p-3 bg-gray-100 border-2 border-[#2c2a63] rounded-lg">
          <div className="flex items-start gap-2">
            <Lock className="size-4 text-[#2c2a63] mt-0.5 flex-shrink-0" />
            <div className="text-xs text-[#2c2a63]">
              <p className="font-semibold">Personal Info Locked</p>
              <p className="mt-1">
                Fields are locked after download. Upgrade to edit again.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2 mt-4 sm:mt-0'>
        <label className="flex-shrink-0">
          {data.image ? (
            <img
              src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}
              alt="user-image"
              className='w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover mt-4 sm:mt-5 ring ring-[#2c2a63] hover:opacity-80 cursor-pointer'
            />
          ) : (
            <div className='inline-flex items-center gap-2 mt-4 sm:mt-5 text-slate-600 hover:text-slate-700 cursor-pointer text-xs sm:text-sm'>
              <User className='size-8 sm:size-10 p-2 sm:p-2.5 border border-[#2c2a63] rounded-full text-[#2c2a63]' />
              <span className="hidden sm:inline">upload user image</span>
              <span className="sm:hidden">upload image</span>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) handleChange("image", file);
            }}
          />
        </label>
        {typeof data.image === 'object' && data.image instanceof File && (
          <div className='flex flex-col gap-1 pl-0 sm:pl-4 text-xs sm:text-sm'>
            <p>Remove Background</p>
            <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={() => setRemoveBackground(prev => !prev)}
                checked={removeBackground}
              />
              <div className='w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200'>
              </div>
              <span className='dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>
            </label>
          </div>
        )}
      </div>

      {fields.map((field) => {
        const Icon = field.icon;
        const fieldError = getFieldError(field);
        const value = data[field.key] as string;
        const fieldLocked = isFieldLocked(field);

        return (
          <div key={field.key} className='space-y-1 mt-4 sm:mt-5'>
            <label className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-600">
              <Icon className="size-3.5 sm:size-4 text-[#2c2a63]" />
              <span>{field.label}</span>
              {field.required && <span className="text-red-500">*</span>}
              {fieldLocked && (
                <span className="text-[10px] sm:text-xs text-[#2c2a63] flex items-center gap-1 w-full sm:w-auto mt-1 sm:mt-0">
                  <Lock className="size-2.5 sm:size-3" /> Locked
                </span>
              )}
            </label>
            <input
              type={field.type}
              value={value || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(field.key, e.target.value)
              }
              onBlur={() => handleBlur(field.key)}
              disabled={fieldLocked}
              className={`mt-1 w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border rounded-lg outline-none transition-all text-xs sm:text-sm ${fieldLocked
                  ? 'bg-gray-100 cursor-not-allowed text-gray-500 border-gray-300'
                  : 'border-[#2c2a63] focus:ring-[#2c2a63] focus:border-[#2c2a63]'
                }`}
              placeholder={fieldLocked ? 'Field locked - upgrade to edit' : `Enter your ${field.label.toLowerCase()}`}
              required={field.required}
            />
            {fieldError && !fieldLocked && (
              <p className="text-[10px] sm:text-xs text-red-500 mt-1 flex items-center gap-1">
                <span>⚠</span> {fieldError}
              </p>
            )}
            {fieldLocked && (
              <p className="text-[10px] sm:text-xs text-[#2c2a63] font-medium flex items-center gap-1">
                <Lock className="size-2.5 sm:size-3" />
                Locked after download. Upgrade to unlock.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PersonalInfoForm;