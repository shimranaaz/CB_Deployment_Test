import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, FileText, Download, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LocationState {
  plan?: string;
  amount?: number;
  type?: 'single-template' | 'pro-plan';
  templateName?: string;
  resumeId?: string;
  returnUrl?: string;
}

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  useEffect(() => {
    triggerConfetti();
  }, []);

  const triggerConfetti = () => {
    const colors = ['#2c2a63', '#EDC9AF'];

    for (let i = 0; i < 150; i++) {
      confetti({
        particleCount: 1,
        startVelocity: 30 + Math.random() * 20,
        spread: 360,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.6,
        },
        colors: [colors[Math.floor(Math.random() * colors.length)]],
        shapes: ['square'],
        scalar: 1 + Math.random(),
        drift: 0.5,
        gravity: 0.6,
      });
    }
  };
  const handleContinue = () => {
    if (state?.plan === 'linkedin' || state?.returnUrl === '/linkedin-checker') {
      navigate('/linkedin-optimized');
    } else if (state?.returnUrl) {
      navigate(state.returnUrl);
    } else if (state?.resumeId) {
      navigate(`/app/builder/${state.resumeId}`);
    } else {
      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2c2a63]/10 via-white to-[#EDC9AF]/20 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center z-10">



        <div className="w-20 h-20 bg-[#2c2a63]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-[#2c2a63]" />
        </div>


        <h1 className="text-3xl font-bold text-[#2c2a63] mb-3">
          Payment Successful! 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          {state?.type === 'single-template'
            ? `You've successfully unlocked ${state.templateName || 'the template'}!`
            : `Welcome to ${state?.plan || 'Premium'}! Your account has been upgraded.`}
        </p>

        {state?.amount && (
          <div className="bg-gradient-to-br from-[#2c2a63]/5 to-[#EDC9AF]/10 rounded-xl p-6 mb-6 border border-[#EDC9AF]">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 font-medium">Amount Paid:</span>
              <span className="text-2xl font-bold text-[#2c2a63]">₹{state.amount}</span>
            </div>

            {state?.plan && (
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Plan:</span>
                <span className="font-semibold text-[#2c2a63]">{state.plan}</span>
              </div>
            )}
          </div>
        )}


        <div className="bg-[#2c2a63]/5 rounded-xl p-4 mb-6 text-left border border-[#EDC9AF]">
          <h3 className="font-semibold text-[#2c2a63] mb-2 text-sm">What's next?</h3>

          <ul className="text-sm text-[#2c2a63] space-y-2">
            <li className="flex gap-2">
              <CheckCircle size={16} />
              Access premium features
            </li>
            <li className="flex gap-2">
              <Download size={16} />
              Download resumes anytime
            </li>
            <li className="flex gap-2">
              <ArrowRight size={16} />
              Continue building your resume
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2 bg-[#2c2a63] hover:bg-[#1f1d4f] text-[#EDC9AF] font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <FileText size={20} />
            {state?.resumeId ? 'Continue to Resume' : 'Go to Dashboard'}
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-[#EDC9AF] hover:bg-[#e2bfa3] text-[#2c2a63] font-semibold py-3 rounded-xl transition-all shadow-md"
          >
            <Home size={20} />
            Back to Home
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
