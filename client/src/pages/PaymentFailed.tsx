import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle, Home, RotateCcw, Mail } from 'lucide-react';
import { useEffect } from 'react';

interface LocationState {
  errorCode?: string;
  errorMessage?: string;
  amount?: number;
  plan?: string;
}

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;


  useEffect(() => {
    console.log('📍 PaymentFailed mounted');
    console.log('📊 Received state:', state);
  }, [state]);

  const getErrorDetails = () => {
    if (state?.errorCode) {
      switch (state.errorCode) {
        case 'BAD_REQUEST_ERROR':
          return {
            title: 'Invalid Payment Details',
            message: state.errorMessage || 'The payment information provided was invalid. Please check your details and try again.'
          };
        case 'GATEWAY_ERROR':
          return {
            title: 'Payment Gateway Error',
            message: 'There was an issue with the payment gateway. Please try again in a few minutes.'
          };
        case 'SERVER_ERROR':
          return {
            title: 'Server Error',
            message: 'Our servers are experiencing issues. Please try again later.'
          };
        case 'NETWORK_ERROR':
          return {
            title: 'Network Error',
            message: 'Unable to connect to payment gateway. Please check your internet connection.'
          };
        default:
          return {
            title: 'Payment Failed',
            message: state.errorMessage || 'Unfortunately, your payment could not be processed.'
          };
      }
    }

    return {
      title: 'Payment Failed',
      message: 'Unfortunately, your payment could not be processed. Please try again or contact support if the problem persists.'
    };
  };

  const { title, message } = getErrorDetails();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center border-2 border-[#EDC9AF]">
        {/* Error Icon */}
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse border-4 border-red-200">
          <XCircle className="w-14 h-14 text-red-500" />
        </div>

        {/* Error Title */}
        <h1 className="text-4xl font-bold text-[#2c2a63] mb-4">
          {title}
        </h1>

        {/* Error Message */}
        <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
          {message}
        </p>

        {/* Payment Details (if available) */}
        {state?.amount && state?.plan && (
          <div className="bg-gradient-to-br from-[#f5f0eb] to-[#faf7f4] rounded-xl p-6 mb-8 border border-[#EDC9AF]">
            <h3 className="text-sm font-semibold text-[#2c2a63] mb-4">Attempted Payment Details</h3>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-700 font-medium">Amount:</span>
              <span className="text-2xl font-bold text-[#2c2a63]">₹{state.amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Plan:</span>
              <span className="text-lg font-semibold text-[#2c2a63]">{state.plan}</span>
            </div>
          </div>
        )}

        {/* Common Issues */}
        <div className="bg-gradient-to-br from-[#f5f0eb] to-[#faf7f4] rounded-xl p-6 mb-8 text-left border border-[#EDC9AF]">
          <h3 className="font-bold text-[#2c2a63] mb-4 text-center">Common Issues & Solutions</h3>
          <ul className="text-sm text-gray-700 space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#2c2a63] font-bold">•</span>
              <span><strong className="text-[#2c2a63]">Insufficient Balance:</strong> Check your account balance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#2c2a63] font-bold">•</span>
              <span><strong className="text-[#2c2a63]">Incorrect Details:</strong> Verify card/UPI information</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#2c2a63] font-bold">•</span>
              <span><strong className="text-[#2c2a63]">Network Issues:</strong> Check your internet connection</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#2c2a63] font-bold">•</span>
              <span><strong className="text-[#2c2a63]">Bank Declined:</strong> Contact your bank for authorization</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 bg-[#2c2a63] hover:bg-[#1f1d4f] text-[#EDC9AF] font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <RotateCcw size={20} />
            <span className="hidden sm:inline">Try Payment Again</span>
            <span className="sm:hidden">Try Again</span>
          </button>

          <button
            onClick={() => navigate('/app')}
            className="w-full flex items-center justify-center gap-2 bg-[#EDC9AF] hover:bg-[#d4b896] text-[#2c2a63] font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <Home size={20} />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/contact')}
            className="w-full flex items-center justify-center gap-2 bg-[#2c2a63] hover:bg-[#1f1d4f] text-[#EDC9AF] font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <Mail size={20} />
            <span className="hidden sm:inline">Contact Support</span>
            <span className="sm:hidden">Support</span>
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-8 pt-8 border-t-2 border-[#EDC9AF]">
          <p className="text-sm text-gray-600 mb-2">
            Need immediate assistance?
          </p>
          <p className="text-xl font-bold text-[#2c2a63]">
            info.careersblueprint@gmail.com
          </p>
          <p className="text-sm text-gray-500 mt-3">
            Our support team is here to help you complete your payment
          </p>
        </div>

        {/* Error Code (for support reference) */}
        {state?.errorCode && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              Error Reference: {state.errorCode}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Please provide this code when contacting support
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentFailed;