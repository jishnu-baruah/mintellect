'use client'

import { useState, useEffect } from 'react';
import PlagiarismPayment from './PlagiarismPayment';
import { FileUpload } from './file-upload';
import { AIEligibilityChecker as EligibilityChecker } from './ai-eligibility-checker';
import { parseDocx } from 'docx-preview';

// Toggle this variable to switch between paid and free mode
const IS_PAID_MODE = false; // Set to true for paid, false for free

export default function PlagiarismWorkflow() {
  type StepType = 'payment' | 'eligibility' | 'checking' | 'results';
  const [step, setStep] = useState<StepType>(IS_PAID_MODE ? 'payment' : 'eligibility');
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [eligible, setEligible] = useState<boolean | undefined>(undefined);
  // New state for plagiarism score and report HTML
  const [plagiarismScore, setPlagiarismScore] = useState<number | null>(null);
  const [reportHtml, setReportHtml] = useState<string | null>(null);
  const [reportId, setReportId] = useState<number | null>(null);

  console.log("PlagiarismWorkflow rendered, step:", step);

  // Payment step (only used if IS_PAID_MODE is true)
  const handlePaymentSuccess = () => {
    setStep('eligibility');
  };
  const handlePaymentError = (error: string) => {
    setError(error);
  };

  // Eligibility step
  const handleFilesSelected = (files: File[]) => {
    console.log('Files selected:', files);
    setUploadedFiles(files);
    setEligible(undefined); // Set to undefined to avoid showing eligibility UI prematurely
    setError('');
    if (files.length > 0) {
      setStep('eligibility');
      console.log('Step set to eligibility');
    }
  };
  // Basic eligibility check for .doc, .docx, .txt
  async function readFileText(file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'txt') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });
    } else if (extension === 'docx') {
      // Use docx-preview to extract text from .docx
      return new Promise(async (resolve, reject) => {
        try {
          const arrayBuffer = await file.arrayBuffer();
          // parseDocx returns an array of paragraphs, join them
          const paragraphs = await parseDocx(arrayBuffer);
          const text = paragraphs.map(p => p.text).join('\n\n');
          resolve(text);
        } catch (err) {
          reject('Failed to read .docx file');
        }
      });
    } else {
      throw new Error('Unsupported file type. Only .txt and .docx are allowed.');
    }
  }

  function isEligible(text: string): boolean {
    const wordCount = text.split(/\s+/).length;
    const hasTitle = /^.{0,100}(Title:|#|\n)/i.test(text);
    const hasParagraphs = text.split(/\n\n+/).length > 1;
    return wordCount > 200 && hasTitle && hasParagraphs;
  }

  // Simulate plagiarism check (replace with real API call)
  const runPlagiarismCheck = async (file: File) => {
    console.log("runPlagiarismCheck called with file:", file);
    try {
      // TODO: Replace with your backend endpoint
      const formData = new FormData();
      formData.append('document', file);
      formData.append('is_json', '1');
      // Example: POST to /api/plagiarism
      const response = await fetch('/api/plagiarism', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Plagiarism check failed');
      const data = await response.json();
      
      // Log the full response to see the structure
      console.log('Plagiarism API Response:', data);
      console.log('Response data structure:', JSON.stringify(data, null, 2));
      
      // Expecting data.data.originality and data.data.id
      setPlagiarismScore(data.data.plagiarism); // Show plagiarism percent
      setReportId(data.data.id);
      
      // Fetch the HTML report
      const htmlRes = await fetch(`/api/plagiarism/report-html/${data.data.id}`);
      if (htmlRes.ok) {
        const htmlData = await htmlRes.json();
        console.log('HTML Report Response:', htmlData);
        setReportHtml(htmlData.data.html);
      } else {
        setReportHtml('<p>Could not load report details.</p>');
      }
    } catch (err) {
      console.error('Plagiarism check error:', err);
      setError('Failed to check plagiarism.');
      setPlagiarismScore(null);
      setReportHtml(null);
    }
  };

  // When entering results step, run the plagiarism check
  useEffect(() => {
    console.log("useEffect for step:", step, "uploadedFiles:", uploadedFiles, "plagiarismScore:", plagiarismScore);
    if (step === 'results' && uploadedFiles.length > 0 && plagiarismScore === null) {
      runPlagiarismCheck(uploadedFiles[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleAnalysisComplete = async (files: File[]) => {
    console.log('Analysis complete for files:', files);
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
      console.log('Eligibility check result:', valid);
      if (valid) {
        setStep('checking');
        console.log('Step set to checking');
        // Simulate plagiarism check
        setTimeout(() => {
          setStep('results');
          console.log('Step set to results');
        }, 2000);
      } else {
        setError('Document is not eligible. Please upload a research document with a title, paragraphs, and sufficient length.');
      }
    } catch (err) {
      setError('Unsupported file type. Only .txt and .docx are allowed.');
      setEligible(false);
      console.log('Error reading file:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {console.log('PlagiarismWorkflow: render', { step, eligible, uploadedFiles, error })}
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
            acceptedFileTypes={[".txt", ".docx"]}
          />
          {/* Show EligibilityChecker with real results */}
          {typeof eligible === 'boolean' && (
            (() => { console.log('EligibilityChecker: rendered', { eligible, error, documentId: uploadedFiles[0]?.name }); return null; })() ||
            <EligibilityChecker
              documentId={uploadedFiles[0]?.name}
              eligible={eligible}
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
          {plagiarismScore !== null ? (
            <div className="mb-6">
              <div className="text-3xl font-bold text-center mb-2">Plagiarism Score: {plagiarismScore}%</div>
            </div>
          ) : (
            <div className="text-gray-600 text-center mb-4">Loading plagiarism score...</div>
          )}
          {reportHtml ? (
            <div className="prose max-w-none border-t pt-4 mt-4" dangerouslySetInnerHTML={{ __html: reportHtml }} />
          ) : (
            <div className="text-gray-600 text-center">Loading report details...</div>
          )}
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm mt-4">{error}</div>
      )}
    </div>
  );
} 