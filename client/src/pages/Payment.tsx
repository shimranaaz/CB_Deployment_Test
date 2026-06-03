import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import api from '../configs/api';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface LocationState {
  type: 'single-template' | 'pro-plan' | 'linkedin-optimization';
  templateId?: string;
  templateName?: string;
  price: number;
  resumeId?: string;
  returnUrl?: string;
  plan?: string;
  planName?: string;
}

interface RootState {
  auth: {
    user: any;
    token?: string;
  };
}

interface PricingPlan {
  planKey: string;
  name: string;
  price: number;
  features: { text: string; included: boolean }[];
}

const FeatureIcon = ({ feature }: { feature: string }) => {
  if (feature.includes('Download')) return (
    <div style={{ background: '#ede9fe', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 3v13" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 12l4 4 4-4" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );

  if (feature.includes('AI Resume')) return (
    <div style={{ background: '#fff7ed', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  if (feature.includes('50+') || feature.includes('Template')) return (
    <div style={{ background: '#dcfce7', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="2" width="16" height="20" rx="2" stroke="#16a34a" strokeWidth="2" />
        <line x1="8" y1="7" x2="16" y2="7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="11" x2="16" y2="11" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="15" x2="13" y2="15" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );

  // ✅ MUST come BEFORE the ATS check — "One Resume, Multiple ATS-Optimized Outputs" contains "ATS"
  if (feature.includes('One Resume') || feature.includes('Multiple')) return (
    <div style={{ background: '#dbeafe', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="15" width="20" height="5" rx="1.5" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
        <rect x="2" y="9.5" width="20" height="5" rx="1.5" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
        <rect x="2" y="4" width="20" height="5" rx="1.5" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );

  if (feature.includes('ATS')) return (
    <div style={{ background: '#ede9fe', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#7c3aed" strokeWidth="2" />
        <circle cx="12" cy="12" r="5" stroke="#7c3aed" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" fill="#7c3aed" />
      </svg>
    </div>
  );

  if (feature.includes('LinkedIn')) return (
    <div style={{ background: '#dbeafe', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="3" stroke="#0a66c2" strokeWidth="2" />
        <path d="M7 10v7M7 7v.01" stroke="#0a66c2" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M11 17v-4a2 2 0 014 0v4M11 13v4" stroke="#0a66c2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  if (feature.includes('Priority')) return (
    <div style={{ background: '#fff7ed', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 18v-6a9 9 0 0118 0v6" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
        <rect x="16" y="14" width="5" height="6" rx="2" stroke="#ea580c" strokeWidth="2" />
        <rect x="3" y="14" width="5" height="6" rx="2" stroke="#ea580c" strokeWidth="2" />
      </svg>
    </div>
  );

  if (feature.includes('One Time') || feature.includes('Lifetime')) return (
    <div style={{ background: '#ffe4e6', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="18" height="14" viewBox="0 0 30 18" fill="none">
        <path d="M15 9C13 5.5 10 3 6.5 3a6 6 0 000 12C10 15 13 12.5 15 9z" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 9c2 3.5 5 6 8.5 6a6 6 0 000-12C20 3 17 5.5 15 9z" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  return (
    <div style={{ background: '#dcfce7', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const state = location.state as LocationState;

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.mobile || '');
  const [dbPlans, setDbPlans] = useState<PricingPlan[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    couponCode: string;
    discountAmount: number;
    finalPrice: number;
    discountType: string;
    discountValue: number;
    originalPrice?: number;
  } | null>(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    if (!token || !user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (!state || !state.type) {
      toast.error('Invalid payment request');
      navigate('/app');
      return;
    }

    const fetchPlans = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://deployment-careerblueprint.onrender.com/api'}/pricing`);
        const data = await response.json();
        if (data.success && data.plans?.length > 0) {
          setDbPlans(data.plans);
        }
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      }
    };

    fetchPlans();

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => console.log('✅ Razorpay SDK loaded successfully');
    script.onerror = () => {
      toast.error('Failed to load payment gateway');
      console.error('❌ Failed to load Razorpay SDK');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [state, navigate, token, user]);

  const getPlanDetails = () => {
    if (state.type === 'linkedin-optimization') {
      const linkedinPlan = dbPlans.find(p => p.planKey === 'linkedin');
      return {
        title: 'LinkedIn Optimization',
        plan: 'linkedin',
        displayName: 'LinkedIn Optimization',
        price: state.price,
        features: linkedinPlan
          ? linkedinPlan.features.filter(f => f.included).map(f => f.text)
          : ['LinkedIn Profile Review', 'Headline & Summary Rewrite', 'Keyword Optimization', '3 Optimization Sessions'],
      };
    }

    if (state.type === 'single-template') {
      return {
        title: `Unlock ${state.templateName || 'Template'}`,
        plan: state.plan || 'Basic',
        displayName: state.planName || state.plan || 'Basic',
        price: state.price,
        features: [
          `Use ${state.templateName} for this resume`,
          'Switch templates anytime for this resume',
          'Lifetime access to this template',
          'Download as PDF anytime',
        ],
      };
    }

    const matchedByKey = state.plan ? dbPlans.find(p => p.planKey === state.plan) : null;
    const matchedByPrice = !matchedByKey ? dbPlans.find(p => p.price === state.price) : null;
    const matchedDbPlan = matchedByKey || matchedByPrice;
    const planKey = state.plan || 'starter';

    if (matchedDbPlan) {
      return {
        title: `${matchedDbPlan.name} Plan`,
        plan: matchedDbPlan.planKey,
        displayName: matchedDbPlan.name,
        price: matchedDbPlan.price,
        features: matchedDbPlan.features.filter(f => f.included).map(f => f.text),
      };
    }

    const planMap: Record<string, { displayName: string; features: string[] }> = {
      trial: {
        displayName: 'Trial · 7 Days',
        features: [
          'Download in PDF & Word — high-quality PDF and editable Word file',
          '50+ Premium Templates — recruiter-approved designs',
          'LinkedIn Profile Review — detailed LinkedIn optimization guide',
          'Priority Support — get expert help whenever you need',
          'One Time Payment — lifetime access, no recurring charges',
        ],
      },
      starter: {
        displayName: 'Starter · 1 Month',
        features: [
          'Download in PDF & Word — high-quality PDF and editable Word file',
          '50+ Premium Templates — recruiter-approved designs',
          'LinkedIn Profile Review — detailed LinkedIn optimization guide',
          'Priority Support — get expert help whenever you need',
          'One Time Payment — lifetime access, no recurring charges',
        ],
      },
      power: {
        displayName: 'Power User · 3 Months',
        features: [
          'Download in PDF & Word — high-quality PDF and editable Word file',
          '50+ Premium Templates — recruiter-approved designs',
          'LinkedIn Profile Review — detailed LinkedIn optimization guide',
          'Priority Support — get expert help whenever you need',
          'One Time Payment — lifetime access, no recurring charges',
        ],
      },
      pro: {
        displayName: 'Pro Member · 1 Year',
        features: [
          'Download in PDF & Word — high-quality PDF and editable Word file',
          '50+ Premium Templates — recruiter-approved designs',
          'LinkedIn Profile Review — detailed LinkedIn optimization guide',
          'Priority Support — get expert help whenever you need',
          'One Time Payment — lifetime access, no recurring charges',
        ],
      },
    };

    const plan = planMap[planKey] || planMap['starter'];
    return {
      title: `${plan.displayName} Plan`,
      plan: planKey,
      displayName: plan.displayName,
      price: state.price,
      features: plan.features,
    };
  };

  const planDetails = getPlanDetails();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    setAppliedCoupon(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'https://deployment-careerblueprint.onrender.com/api'}/coupons/validate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            couponCode: couponCode.trim(),
            originalPrice: planDetails.price,
          }),
        }
      );
      const data = await response.json();

      if (data.valid) {
        setAppliedCoupon(data);
        toast.success('Coupon applied successfully! 🎉');
      } else {
        setCouponError(data.message || 'Invalid or expired coupon');
      }
    } catch (err) {
      setCouponError('Failed to validate coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handlePayment = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    if (phone.length !== 10) {
      toast.error('Please enter valid 10-digit mobile number');
      return;
    }

    if (!token) {
      toast.error('Authentication required. Please login again.');
      navigate('/login');
      return;
    }

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      toast.error('Payment configuration error. Please contact support.');
      console.error('❌ VITE_RAZORPAY_KEY_ID is not set in environment variables');
      return;
    }

    setLoading(true);

    try {
      console.log('📝 Creating order with planKey:', planDetails.plan);

      const finalAmount = appliedCoupon ? appliedCoupon.finalPrice : state.price;

      const { data: orderData } = await api.post('/payments/create-order', {
        amount: finalAmount,
        type: state.type,
        plan: planDetails.plan,
        templateId: state.templateId,
        templateName: state.templateName,
        resumeId: state.resumeId,
        couponCode: appliedCoupon ? appliedCoupon.couponCode : undefined,
      });

      console.log('✅ Order created:', orderData);

      if (!orderData.orderId) {
        throw new Error('Invalid order data received from server');
      }

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page.');
      }

      let paymentProcessed = false;

      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        description: planDetails.title,
        order_id: orderData.orderId,
        prefill: {
          name: name,
          contact: phone,
          email: user?.email || ''
        },
        theme: { color: '#2c2a63' },
        handler: async function (response: any) {
          if (paymentProcessed) return;
          paymentProcessed = true;

          console.log('✅ Payment successful, verifying...');
          try {
            const verifyResponse = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              toast.success('Payment successful! 🎉');
              setTimeout(() => {
                navigate('/payment-success', {
                  state: {
                    plan: planDetails.displayName,
                    amount: finalAmount,
                    type: state.type,
                    templateName: state.templateName,
                    resumeId: state.resumeId,
                    returnUrl: state.returnUrl
                  }
                });
              }, 1000);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error: any) {
            console.error('❌ Payment verification error:', error);
            api.post('/payments/log-failure', {
              orderId: orderData.orderId,
              errorCode: 'VERIFICATION_FAILED',
              errorDescription: error?.response?.data?.message || 'Payment verification failed',
              errorReason: error?.message
            }).catch(err => console.warn('⚠️ Failed to log verification failure:', err));

            toast.error(error?.response?.data?.message || 'Payment verification failed');
            setTimeout(() => {
              navigate('/payment-failed', {
                state: {
                  errorCode: 'VERIFICATION_FAILED',
                  errorMessage: error?.response?.data?.message || 'Payment verification failed',
                  amount: finalAmount,
                  plan: planDetails.displayName
                }
              });
            }, 2000);
          }
        },
        modal: {
          ondismiss: function () {
            if (paymentProcessed) return;
            console.log('ℹ️ Payment modal closed by user');
            setLoading(false);
            api.post('/payments/log-failure', {
              orderId: orderData.orderId,
              errorCode: 'USER_CANCELLED',
              errorDescription: 'User closed payment modal',
              errorReason: 'Modal dismissed'
            }).catch(err => console.warn('⚠️ Failed to log cancellation:', err));
            toast('Payment cancelled', { icon: 'ℹ️' });
          },
          escape: true,
          backdropclose: false
        },
        timeout: 300
      };

      console.log('💳 Opening Razorpay checkout...');
      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', async function (response: any) {
        if (paymentProcessed) return;
        paymentProcessed = true;

        const errorCode = response.error?.code || 'UNKNOWN_ERROR';
        const errorDescription = response.error?.description || 'Payment failed';
        const errorReason = response.error?.reason || 'Unknown reason';

        api.post('/payments/log-failure', {
          orderId: orderData.orderId,
          errorCode,
          errorDescription,
          errorReason
        }).catch(logError => console.warn('⚠️ Failed to log to backend:', logError?.response?.status));

        setLoading(false);

        const waitForModalClose = setInterval(() => {
          const razorpayContainer = document.querySelector('.razorpay-container');
          if (!razorpayContainer) {
            clearInterval(waitForModalClose);
            toast.error('Payment failed: ' + errorDescription, { duration: 4000, position: 'top-center' });
            setTimeout(() => {
              navigate('/payment-failed', {
                state: { errorCode, errorMessage: errorDescription, amount: finalAmount, plan: planDetails.displayName },
                replace: true
              });
            }, 500);
          }
        }, 300);

        setTimeout(() => {
          clearInterval(waitForModalClose);
          navigate('/payment-failed', {
            state: { errorCode, errorMessage: errorDescription, amount: finalAmount, plan: planDetails.displayName },
            replace: true
          });
        }, 10000);
      });

      razorpay.open();
      setLoading(false);
    } catch (error: any) {
      console.error('❌ Payment initiation error:', error);
      if (error?.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 1500);
      } else if (error?.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(error?.response?.data?.message || error?.message || 'Failed to initiate payment');
      }
      setLoading(false);
    }
  };

  if (!state) return null;

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-100 text-[#2c2a63] px-4 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all mb-4"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2c2a63] mb-2">
            Confirm Your Order
          </h1>
          <p className="text-gray-600">Complete your payment to unlock premium features</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-[#EDC9AF]">
              <h2 className="text-xl font-semibold text-[#2c2a63] mb-6">
                Your Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2c2a63] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10 digit mobile number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2c2a63] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-2 border-[#EDC9AF]">
              <h2 className="text-xl font-semibold text-[#2c2a63] mb-6">Order Summary</h2>

              <div className="bg-gradient-to-br from-[#f5f0eb] to-[#faf7f4] rounded-xl p-6 mb-6 border border-[#EDC9AF]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-[#2c2a63]">{planDetails.title}</h3>
                  <div className="text-2xl font-bold text-[#2c2a63]">₹{planDetails.price}</div>
                </div>
                <p className="text-sm text-gray-600">One-time payment</p>
                <div className="mt-3 inline-flex items-center gap-1.5 bg-[#eeedf8] border border-[#b0aedd] text-[#2c2a63] text-xs font-semibold px-3 py-1.5 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#2e7d32]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                  42% Higher response rate from recruiters
                </div>
              </div>

              {/* What's included */}
              <div className="mb-6">
                <h4 className="font-semibold text-[#2c2a63] mb-3">What's included:</h4>
                <ul className="space-y-3">
                  {planDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <FeatureIcon feature={feature} />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <div className="mb-6 border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-[#2c2a63] mb-3">Accepts Payment Methods</h4>
                  <div className="flex items-center gap-3">
                    <img src="/assets/Services/upi.png" alt="UPI" className="h-6 object-contain" />
                    <img src="/assets/Services/Gpay-upi.png" alt="GPay" className="h-6 object-contain" />
                    <img src="/assets/Services/phone-pe.png" alt="PhonePe" className="h-6 object-contain" />
                    <img src="/assets/Services/netbanking.png" alt="Net Banking" className="h-6 object-contain" />
                    <img src="/assets/Services/wallet.png" alt="Wallet" className="h-6 object-contain" />
                  </div>
                </div>

                <h4 className="font-semibold text-[#2c2a63] mb-2 text-sm">Have a coupon?</h4>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2c2a63] uppercase"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2 bg-[#EDC9AF] text-[#2c2a63] rounded-lg text-sm font-semibold hover:bg-[#e0b89f] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <span className="text-green-700 text-sm font-semibold">{appliedCoupon.couponCode} applied ✓</span>
                    <button onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                  </div>
                )}
                {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
              </div>

              {appliedCoupon && (
                <div className="mb-4 bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-1 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Original Price</span>
                    <span>₹{appliedCoupon.originalPrice ?? planDetails.price}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount ({appliedCoupon.couponCode})</span>
                    <span>- ₹{appliedCoupon.discountAmount}</span>
                  </div>
                  <div className="flex justify-between text-[#2c2a63] font-bold text-base border-t border-gray-200 pt-1 mt-1">
                    <span>Final Price</span>
                    <span>₹{appliedCoupon.finalPrice}</span>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-[#2c2a63] to-[#3d3a7a] rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-[#EDC9AF]">Total Due Now</span>
                  <span className="text-3xl font-bold text-[#EDC9AF]">
                    ₹{appliedCoupon ? appliedCoupon.finalPrice : planDetails.price}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-[#2c2a63] hover:bg-[#1f1d4f] text-[#EDC9AF] font-semibold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>

              <div className="mt-4 border border-[#b0aedd] bg-[#eeedf8] rounded-xl px-4 py-3 flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span className="text-xs font-semibold text-green-700">256-bit SSL Encrypted · 100% Secure Checkout</span>
                </div>
          <p className="text-[11px] text-[#2c2a63]">Powered by <span className="font-semibold text-[#2c2a63]">Razorpay</span> · Trusted by 5M+ businesses worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;