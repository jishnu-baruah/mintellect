'use client'

import { useState, useEffect } from 'react';
import PlagiarismPayment from './PlagiarismPayment';
import { FileUpload } from './file-upload';
import { AIEligibilityChecker as EligibilityChecker } from './ai-eligibility-checker';

// Toggle this variable to switch between paid and free mode
const IS_PAID_MODE = false; // Set to true for paid, false for free

export default function PlagiarismWorkflow() {
  type StepType = 'payment' | 'eligibility' | 'checking' | 'results';
  const [step, setStep] = useState<StepType>(IS_PAID_MODE ? 'payment' : 'eligibility');
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [eligible, setEligible] = useState<boolean | undefined>(undefined);

  // Payment step (only used if IS_PAID_MODE is true)
  const handlePaymentSuccess = () => {
    setStep('eligibility');
  };
  const handlePaymentError = (error: string) => {
    setError(error);
  };

  // Eligibility step
  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles(files);
    setEligible(undefined);
    setError('');
    if (files.length > 0) {
      setStep('eligibility');
    }
  };
  // Basic eligibility check for .doc, .docx, .txt, .tex
  async function readFileText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  function isEligible(text: string): boolean {
    const wordCount = text.split(/\s+/).length;
    const hasTitle = /^.{0,100}(Title:|#|\n)/i.test(text);
    const hasParagraphs = text.split(/\n\n+/).length > 1;
    return wordCount > 200 && hasTitle && hasParagraphs;
  }

  // Run eligibility check when entering eligibility step
  useEffect(() => {
    const runEligibility = async () => {
      if (step === 'eligibility' && uploadedFiles.length > 0) {
        try {
          const text = await readFileText(uploadedFiles[0]);
          const valid = isEligible(text);
          setEligible(valid);
          if (!valid) {
            setError('Document is not eligible. Please upload a research document with a title, paragraphs, and sufficient length.');
          } else {
            setError('');
          }
        } catch (err) {
          setError('Could not read file.');
          setEligible(false);
        }
      }
    };
    runEligibility();
  }, [step, uploadedFiles]);

  const handleAnalysisComplete = async (files: File[]) => {
    if (files.length === 0) {
      setError('No file uploaded.');
      setEligible(false);
      return;
    }
    const file = files[0];
    try {
      const text = await readFileText(file);
      const valid = isEligible(text);
      setEligible(valid);
      if (valid) {
        setStep('checking');
        // Simulate plagiarism check
        setTimeout(() => {
          setStep('results');
        }, 2000);
      } else {
        setError('Document is not eligible. Please upload a research document with a title, paragraphs, and sufficient length.');
      }
    } catch (err) {
      setError('Could not read file.');
      setEligible(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Plagiarism Check Workflow</h1>
        <div className="flex items-center justify-between">
          {IS_PAID_MODE && (
            <div className={`flex items-center ${step === 'payment' ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>1</div>
              <span className="ml-2">Payment</span>
            </div>
          )}
          <div className={`flex items-center ${step === 'eligibility' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'eligibility' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>{IS_PAID_MODE ? '2' : '1'}</div>
            <span className="ml-2">Eligibility Check</span>
          </div>
          <div className={`flex items-center ${step === 'checking' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'checking' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>{IS_PAID_MODE ? '3' : '2'}</div>
            <span className="ml-2">Plagiarism Check</span>
          </div>
          <div className={`flex items-center ${step === 'results' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'results' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>{IS_PAID_MODE ? '4' : '3'}</div>
            <span className="ml-2">Results</span>
          </div>
        </div>
      </div>

      {/* Payment step only shown if paid mode is enabled */}
      {IS_PAID_MODE && step === 'payment' && (
        <PlagiarismPayment
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}

      {step === 'eligibility' && (
        <div>
          <FileUpload
            onFilesSelected={handleFilesSelected}
            onAnalysisComplete={handleAnalysisComplete}
            acceptedFileTypes={[".zip"]}
          />
          {/* Show EligibilityChecker with real results */}
          {uploadedFiles.length > 0 && (
            <EligibilityChecker
              documentId={uploadedFiles[0]?.name}
              eligible={typeof eligible === 'boolean' ? eligible : undefined}
              error={error}
              onComplete={() => {
                if (eligible) handleAnalysisComplete(uploadedFiles);
              }}
            />
          )}
        </div>
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
        <div className="text-red-600 text-sm mt-4">{error}</div>
      )}
    </div>
  );
} 