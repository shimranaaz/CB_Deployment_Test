import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@/components/ui/card";

interface PricingPlan {
  _id: string;
  planKey: string;
  name: string;
  subtitle: string;
  price: number;
  priceDisplay: string;
  priceUnit: string;
  description: string;
  features: { text: string; included: boolean }[];
  buttonText: string;
  popular: boolean;
  isFree: boolean;
  order: number;
}

const fallbackPlans: PricingPlan[] = [
  {
    _id: 'fallback-free',
    planKey: 'free',
    name: 'Free Forever',
    subtitle: 'Start building professional resumes at zero cost, forever.',
    price: 0,
    priceDisplay: '₹0',
    priceUnit: '/ Forever',
    description: 'Access essential features to create your first professional resume.',
    features: [
      { text: '2 Free resume templates (lifetime access)', included: true },
      { text: 'Basic editing and formatting tools', included: true },
      { text: 'Download in PDF format anytime', included: true },
      { text: 'No credit card required', included: true },
      { text: 'Premium templates', included: false },
      { text: 'AI suggestions and optimization', included: false },
      { text: 'Priority support', included: false },
    ],
    buttonText: 'Start Free',
    popular: false,
    isFree: true,
    order: 0,
  },
  {
    _id: 'fallback-trial',
    planKey: 'trial',
    name: 'Trial · 7 Days',
    subtitle: 'Test premium features with a quick 7-day trial before committing.',
    price: 99,
    priceDisplay: '₹99',
    priceUnit: '/ Resume',
    description: 'Get 7 days to explore premium templates and basic features.',
    features: [
      { text: 'All premium templates and color styles', included: true },
      { text: '1 Premium Resume', included: true },
      { text: 'Download in PDF format', included: true },
      { text: '7 Days Access', included: true },
      { text: 'Live AI suggestions while you type', included: false },
      { text: 'Real‑time online preview', included: false },
      { text: 'Email support', included: false },
    ],
    buttonText: 'Try Now',
    popular: false,
    isFree: false,
    order: 1,
  },
  {
    _id: 'fallback-starter',
    planKey: 'starter',
    name: 'Starter · 1 Month',
    subtitle: 'Perfect for quick, high‑stakes job hunts where every resume must stand out.',
    price: 399,
    priceDisplay: '₹399',
    priceUnit: '/ Resume',
    description: 'Get full access for 30 days to design, refine, and export job‑ready resumes.',
    features: [
      { text: 'Unlimited resume edits and versions', included: true },
      { text: 'All premium templates and color styles', included: true },
      { text: 'Live AI suggestions while you type', included: true },
      { text: '1 Premium Resume', included: true },
      { text: 'Real‑time online preview', included: false },
      { text: 'Export in high‑quality PDF only', included: false },
      { text: 'Email support', included: false },
    ],
    buttonText: 'Get Now',
    popular: false,
    isFree: false,
    order: 2,
  },
  {
    _id: 'fallback-power',
    planKey: 'power',
    name: 'Power User · 3 Months',
    subtitle: 'Built for serious applicants who refuse to send the same resume twice.',
    price: 499,
    priceDisplay: '₹499',
    priceUnit: '/ Resume',
    description: 'Locked‑in access for 90 days to tune every resume for every role.',
    features: [
      { text: 'Unlimited resumes for different job roles', included: true },
      { text: 'AI keyword match against job descriptions', included: true },
      { text: 'ATS‑friendly optimization and score hints', included: true },
      { text: 'Smart application tracking dashboard', included: true },
      { text: '3 Premium Resumes', included: true },
      { text: 'Early access to new templates and layouts', included: false },
      { text: 'Priority email & WhatsApp support', included: false },
    ],
    buttonText: 'Get Now',
    popular: true,
    isFree: false,
    order: 3,
  },
  {
    _id: 'fallback-pro',
    planKey: 'pro',
    name: 'Pro Member · 1 Year',
    subtitle: 'Designed for ambitious professionals who tweak and test all year long.',
    price: 999,
    priceDisplay: '₹999',
    priceUnit: '/ Resume',
    description: 'Build, test, and perfect your profile across the entire year.',
    features: [
      { text: 'Unlimited everything inside the studio', included: true },
      { text: 'Deep‑dive AI score and fix suggestions', included: true },
      { text: 'Shareable online resume links & snapshots', included: true },
      { text: 'Multi‑language resume support', included: true },
      { text: 'VIP 1:1 priority help when you need it', included: true },
      { text: '5 Premium Resumes', included: true },
    ],
    buttonText: 'Get Now',
    popular: false,
    isFree: false,
    order: 4,
  },
];

const API_URL = import.meta.env.VITE_API_URL || 'https://deployment-careerblueprint.onrender.com/api';

const Pricing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const fetchPricing = async () => {
      try {
        const response = await fetch(`${API_URL}/pricing`);
        const data = await response.json();
        if (data.success && data.plans && data.plans.length > 0) {
          setPricingPlans(data.plans);
        } else {
          setPricingPlans(fallbackPlans);
        }
      } catch (err) {
        console.error('Failed to fetch pricing:', err);
        setPricingPlans(fallbackPlans);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPricing();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleGetNow = (plan: PricingPlan) => {
    if (plan.isFree) {
      navigate(isLoggedIn ? '/app' : '/login');
      return;
    }

    const paymentState = {
      type: 'pro-plan' as const,
      price: plan.price,
      plan: plan.planKey,
      planName: plan.name,
      returnUrl: '/',
    };

    if (isLoggedIn) {
      navigate('/payment', { state: paymentState });
    } else {
      navigate('/login', {
        state: {
          redirectTo: '/payment',
          planData: paymentState,
        },
      });
    }
  };

  const rows: PricingPlan[][] = [];
  for (let i = 0; i < pricingPlans.length; i += 3) {
    rows.push(pricingPlans.slice(i, i + 3));
  }

  const PlanCard = ({ plan, globalIndex }: { plan: PricingPlan; globalIndex: number }) => (
    <Card
      className={`relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col ${isVisible ? "animate-fade-in-up" : "opacity-0"
        }`}
      style={{
        animationDelay: `${globalIndex * 0.1}s`,
        border: plan.popular || plan.isFree ? '2px solid #2c2a63' : '1px solid #e5e7eb',
      }}
    >
      {plan.popular && (
        <div
          className="absolute top-5 right-4 text-xs font-bold px-3 py-1 rounded-full z-10"
          style={{ backgroundColor: '#EDC9AF', color: '#2c2a63', marginTop: "-10px" }}
        >
          POPULAR
        </div>
      )}
      {plan.isFree && (
        <div
          className="absolute top-5 right-4 text-xs font-bold px-3 py-1 rounded-full z-10"
          style={{ backgroundColor: '#EDC9AF', color: '#2c2a63', marginTop: "-10px" }}
        >
          FREE
        </div>
      )}

      <div className="p-6 text-center" style={{ backgroundColor: '#2c2a63', color: '#fff' }}>
        <h3 className="text-xl font-bold mb-1" style={{ color: '#EDC9AF' }}>{plan.name}</h3>
        <p className="text-xs leading-relaxed" style={{ color: '#fff' }}>{plan.subtitle}</p>
      </div>

      <div className="p-6 text-center" style={{ backgroundColor: '#EDC9AF', color: '#2c2a63' }}>
        <div className="text-4xl font-bold mb-1">
          ₹{plan.price} <span className="text-base">{plan.priceUnit}</span>
        </div>
        <p className="text-xs font-bold leading-relaxed" style={{ color: '#333' }}>{plan.description}</p>
      </div>

      <div className="p-5 space-y-4 bg-white flex-grow flex flex-col">
        <ul className="space-y-2 flex-grow">
          {plan.features.map((feature, idx) => (
            <li
              key={idx}
              className={`flex items-start space-x-2 text-xs leading-relaxed ${feature.included ? 'text-slate-700' : ''}`}
              style={!feature.included ? { color: '#333' } : {}}
            >
              <FontAwesomeIcon
                icon={feature.included ? faCheck : faTimes}
                className="mt-0.5 flex-shrink-0 text-xs"
                style={feature.included ? { color: '#1db954' } : { color: '#333' }}
              />
              <span className={feature.included ? '' : 'line-through'}>{feature.text}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => handleGetNow(plan)}
          className="w-full py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:opacity-90 text-sm"
          style={{ backgroundColor: '#2c2a63', color: '#EDC9AF' }}
        >
          {plan.buttonText}
        </button>
      </div>
    </Card>
  );

  return (
    <section ref={sectionRef} id="pricing" className="py-8 md:py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 max-w-7xl">

        <h2
          className="text-3xl md:text-4xl font-bold mb-6 flex items-start gap-2 pl-4"
          style={{ color: "#2c2a63" }}
        >
          <FontAwesomeIcon icon={faQuoteLeft} className="text-2xl mt-1" style={{ color: "#2c2a63" }} />
          <span className="flex-1">
            Plans that pay off — see our pricing.
            <FontAwesomeIcon icon={faQuoteRight} className="text-2xl ml-2" style={{ color: "#2c2a63" }} />
          </span>
        </h2>

        {loadingPlans ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c2a63]" />
          </div>
        ) : (
          <div className="space-y-6">
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex flex-col md:flex-row justify-center items-stretch gap-6"
              >
                {row.map((plan, index) => (
                  <div
                    key={plan.planKey}
                    className="w-full md:w-1/3"
                  >
                    <PlanCard plan={plan} globalIndex={rowIndex * 3 + index} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;