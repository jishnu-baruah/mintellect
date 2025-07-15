'use client'

import { useState } from 'react';
import PlagiarismPayment from './PlagiarismPayment';

export default function PlagiarismWorkflow() {
  const [step, setStep] = useState<'payment' | 'checking' | 'results'>('payment');
  const [error, setError] = useState('');

  const handlePaymentSuccess = () => {
    setStep('checking');
    // Here you would start the plagiarism check process
    // For now, we'll simulate it with a timeout
    setTimeout(() => {
      setStep('results');
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Plagiarism Check Workflow</h1>
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${step === 'payment' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="ml-2">Payment</span>
          </div>
          <div className={`flex items-center ${step === 'checking' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'checking' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="ml-2">Checking</span>
          </div>
          <div className={`flex items-center ${step === 'results' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'results' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="ml-2">Results</span>
          </div>
        </div>
      </div>

      {step === 'payment' && (
        <PlagiarismPayment
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}

      {step === 'checking' && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Running plagiarism check...</p>
        </div>
      )}

      {step === 'results' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Plagiarism Check Results</h2>
          <p className="text-gray-600">Your document has been checked for plagiarism.</p>
          {/* Add your results display here */}
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm mt-4">
          {error}
        </div>
      )}
    </div>
  );
} 