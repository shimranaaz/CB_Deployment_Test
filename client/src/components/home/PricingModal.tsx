import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  showFreeOption?: boolean;
  onFreeDownload?: () => void;
}

interface Plan {
  planKey: string;
  name: string;
  price: number;
  priceUnit: string;
  subtitle: string;
  description: string;
  features: { text: string; included: boolean }[];
  buttonText: string;
  popular: boolean;
  isFree: boolean;
}

const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  showFreeOption = false,
  onFreeDownload
}) => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackPlans: Plan[] = [
    {
      planKey: 'trial',
      name: 'Trial · 7 Days',
      price: 99,
      priceUnit: '/ Resume',
      subtitle: 'Try before you commit',
      description: '',
      features: [
        { text: '1 Premium Resume Download', included: true },
        { text: 'All Premium Templates', included: true },
        { text: '7 Days Access', included: true },
        { text: 'Basic Support', included: true },
      ],
      buttonText: 'Try Now',
      popular: false,
      isFree: false,
    },
    {
      planKey: 'starter',
      name: 'Starter · 1 Month',
      price: 400,
      priceUnit: '/ Resume',
      subtitle: 'Great for occasional use',
      description: '',
      features: [
        { text: '1 Premium Resume Download', included: true },
        { text: 'All Premium Templates', included: true },
        { text: '30 Days Access', included: true },
        { text: 'Email Support', included: true },
      ],
      buttonText: 'Get Now',
      popular: false,
      isFree: false,
    },
    {
      planKey: 'power',
      name: 'Power User · 3 Months',
      price: 499,
      priceUnit: '/ Resume',
      subtitle: 'Most popular choice',
      description: '',
      features: [
        { text: '3 Premium Resumes Download', included: true },
        { text: 'All Premium Templates', included: true },
        { text: '90 Days Access', included: true },
        { text: 'Priority Email Support', included: true },
        { text: 'Custom Colors', included: true },
      ],
      buttonText: 'Get Now',
      popular: true,
      isFree: false,
    },
    {
      planKey: 'pro',
      name: 'Pro Member · 1 Year',
      price: 999,
      priceUnit: '/ Resume',
      subtitle: 'For power users',
      description: '',
      features: [
        { text: '5 Premium Resumes Download', included: true },
        { text: 'All Premium Templates', included: true },
        { text: '1 Year Access', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Custom Colors', included: true },
        { text: 'Lifetime Updates', included: true },
      ],
      buttonText: 'Get Now',
      popular: false,
      isFree: false,
    },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://deployment-careerblueprint.onrender.com/api'}/pricing`);
        const data = await res.json();
        if (data.plans && data.plans.length > 0) {
          const paidPlans = data.plans.filter((p: Plan) => !p.isFree);
          setPlans(paidPlans);
        } else {
          setPlans(fallbackPlans);
        }
      } catch {
        setPlans(fallbackPlans);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: Plan) => {
    navigate('/payment', {
      state: {
        type: 'pro-plan',
        price: plan.price,
        plan: plan.planKey,
        planName: plan.name,
        returnUrl: window.location.pathname
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2c2a63]">Choose Your Plan</h2>
            <p className="text-gray-600 mt-2">Unlock premium templates and download limits</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Plans - always 2 columns grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c2a63]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {plans.map((plan) => (
              <div
                key={plan.planKey}
                className={`relative border-2 rounded-2xl p-6 transition-all hover:shadow-lg ${plan.popular ? 'border-[#2c2a63] shadow-md' : 'border-gray-200'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2c2a63] text-[#EDC9AF] px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <h3 className="text-lg font-bold text-[#2c2a63] mb-1">{plan.name}</h3>
                {plan.subtitle && (
                  <p className="text-xs text-gray-500 mb-3">{plan.subtitle}</p>
                )}

                <div className="mb-4">
                  <span className="text-3xl font-bold text-[#2c2a63]">₹{plan.price}</span>
                  <span className="text-gray-600 text-sm"> {plan.priceUnit || '/one-time'}</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features
                    .filter((f) => f.included)
                    .map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature.text}</span>
                      </li>
                    ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.popular
                      ? 'bg-[#2c2a63] text-[#EDC9AF] hover:bg-[#1f1d4f]'
                      : 'bg-gray-200 text-[#2c2a63] hover:bg-gray-300'
                    }`}
                >
                  {plan.buttonText || `Choose ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Free option */}
        {showFreeOption && onFreeDownload && (
          <div className="text-center pt-4 border-t border-gray-200">
            <button
              onClick={onFreeDownload}
              className="w-full md:w-auto px-6 py-3 rounded-xl font-semibold transition-all bg-gray-200 text-[#2c2a63] hover:bg-gray-300"
            >
              Continue with Free Download (Limited Templates)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingModal;