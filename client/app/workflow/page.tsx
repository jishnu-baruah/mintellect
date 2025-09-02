"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileUpload } from "@/components/file-upload"
import { AIEligibilityChecker } from "@/components/ai-eligibility-checker"
import { PlagiarismReduction } from "@/components/plagiarism-reduction"
import { TrustScoreGenerator } from "@/components/trust-score-generator"
import { NFTMinting } from "@/components/nft-minting"
import { PlagiarismReportViewer } from "@/components/plagiarism-report-viewer"
import { useRouter, useSearchParams } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import { Check, FileText, AlertCircle, Upload, Shield, FileCheck, Award, UserCheck, RotateCcw, Save } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { HumanReviewInterface } from "@/components/human-review-interface"
import { renderAsync } from 'docx-preview';
import { workflowPersistence, type WorkflowState } from "@/lib/workflow-persistence"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/useWallet"

export default function WorkflowPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)
  const [documentName, setDocumentName] = useState<string | null>(null)
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [trustScore, setTrustScore] = useState<number | null>(null)
  const [trustScoreData, setTrustScoreData] = useState<any | null>(null)
  const [humanReviewData, setHumanReviewData] = useState<any | null>(null);
  const [nftMintingData, setNftMintingData] = useState<any | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [archivedWorkflows, setArchivedWorkflows] = useState<Array<any>>([]);
  const [isArchiving, setIsArchiving] = useState(false);
  const { toast } = useToast();
  const { walletAddress, walletConnected } = useWallet();
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [formattedCreatedAt, setFormattedCreatedAt] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [eligible, setEligible] = useState<boolean | undefined>(undefined);
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [plagiarismResult, setPlagiarismResult] = useState<any | null>(null);
  const [plagiarismLoading, setPlagiarismLoading] = useState(false);
  const [plagiarismError, setPlagiarismError] = useState<string | null>(null);

  useEffect(() => {
    const stepParam = searchParams.get("step")
    const docIdParam = searchParams.get("documentId")
    const savedState = workflowPersistence.getWorkflowState()
    if (savedState && !stepParam && !docIdParam) {
      setStep(savedState.step)
      setSelectedDocumentId(savedState.documentId)
      setDocumentName(savedState.documentName)
      setDocumentText(savedState.documentText)
      setDocumentFile(savedState.documentFile)
      setEligible(savedState.eligible)
      setPlagiarismResult(savedState.plagiarismResult)
      setTrustScoreData(savedState.trustScoreData)
      setHumanReviewData(savedState.humanReviewData)
      setNftMintingData(savedState.nftMintingData)
      setError(savedState.error)
      setCreatedAt(savedState.createdAt || null);
      if (savedState.trustScoreData) {
        setTrustScore(savedState.trustScoreData.trustScore)
      }
      setTimeout(() => {
        // log state
      }, 500)
    } else {
      if (stepParam) {
        const stepNumber = Number.parseInt(stepParam)
        if (!isNaN(stepNumber) && stepNumber >= 0 && stepNumber <= 5) {
          setStep(stepNumber)
        }
      }
      if (docIdParam) {
        setSelectedDocumentId(docIdParam)
        setDocumentName("Document " + docIdParam.substring(0, 8))
        setTrustScore(Math.floor(Math.random() * 15) + 80)
      }
      setCreatedAt(null);
    }
    loadArchivedWorkflows()
  }, [searchParams])

  useEffect(() => {
    if (createdAt) {
      setFormattedCreatedAt(new Date(createdAt).toLocaleDateString());
    } else {
      setFormattedCreatedAt('');
    }
  }, [createdAt]);

  const steps = [
    { name: "Upload", component: "upload", icon: Upload },
    { name: "Eligibility Check", component: "eligibility", icon: Shield },
    { name: "Plagiarism", component: "plagiarism", icon: FileCheck },
    { name: "Trust Score", component: "trust", icon: Award },
    { name: "Review", component: "review", icon: UserCheck },
    { name: "NFT", component: "minting", icon: Shield },
  ];

  useEffect(() => {
    if (selectedDocumentId) {
      const workflowState: Partial<WorkflowState> = {
        step,
        documentId: selectedDocumentId,
        documentName,
        documentText,
        documentFile,
        eligible,
        plagiarismResult,
        trustScoreData,
        humanReviewData,
        nftMintingData,
        error,
        isArchived: false,
        archiveUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (async () => {
        await workflowPersistence.saveWorkflowState(workflowState);
      })();
    }
  }, [step, selectedDocumentId, documentName, documentText, documentFile, eligible, plagiarismResult, trustScoreData, humanReviewData, nftMintingData, error]);

  async function loadArchivedWorkflows() {
    try {
      const archives = await workflowPersistence.getArchivedWorkflows()
      setArchivedWorkflows(archives)
    } catch (error) {
      console.error('Failed to load archived workflows:', error)
    }
  }

  function isEligible(text: string): boolean {
    const wordCount = text.split(/\s+/).length;
    const hasTitle = /^.{0,100}(Title:|#|\n)/i.test(text);
    const hasParagraphs = text.split(/\n\n+/).length > 1;
    return wordCount > 200 && hasTitle && hasParagraphs;
  }

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
      return new Promise(async (resolve, reject) => {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const container = document.createElement('div');
          await renderAsync(arrayBuffer, container);
          const docxElement = container.querySelector('.docx');
          const text = docxElement ? (docxElement as HTMLElement).innerText : '';
          resolve(text);
        } catch (err) {
          reject(new Error('Failed to read or parse .docx file. The file may be corrupted or not a valid .docx.'));
        }
      });
    } else {
      throw new Error('Unsupported file type. Only .txt and .docx are allowed.');
    }
  }

  const clearWorkflowState = () => {
    setStep(0);
    setSelectedDocumentId(null);
    setDocumentName(null);
    setDocumentFile(null);
    setDocumentText(null);
    setEligible(undefined);
    setPlagiarismResult(null);
    setTrustScoreData(null);
    setHumanReviewData(null);
    setNftMintingData(null);
    setError(null);
    setPlagiarismLoading(false);
    setPlagiarismError(null);
    workflowPersistence.clearWorkflowState();
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      
      // Check if we already have a workflow for this file
      const existingWorkflow = workflowPersistence.getWorkflowState();
      const isSameFile = existingWorkflow && 
        existingWorkflow.documentName === file.name &&
        existingWorkflow.documentFile &&
        existingWorkflow.documentFile.name === file.name;
      
      if (isSameFile) {
        // Use existing workflow
        console.log('Resuming existing workflow for file:', file.name);
        setSelectedDocumentId(existingWorkflow.documentId);
        setDocumentName(existingWorkflow.documentName);
        setDocumentFile(existingWorkflow.documentFile);
        setStep(existingWorkflow.step || 0);
        setDocumentText(existingWorkflow.documentText);
        setEligible(existingWorkflow.eligible);
        setPlagiarismResult(existingWorkflow.plagiarismResult);
        setTrustScoreData(existingWorkflow.trustScoreData);
        setHumanReviewData(existingWorkflow.humanReviewData);
        setNftMintingData(existingWorkflow.nftMintingData);
        setError(existingWorkflow.error);
        return;
      }
      
      // Clear existing workflow state for different file
      console.log('Different file detected, clearing existing workflow');
      clearWorkflowState();
      
      // Create new workflow only if it's a different file
      const newDocId = `doc-${Math.random().toString(36).substring(2, 9)}`;
      console.log('Creating new workflow for file:', file.name, 'with ID:', newDocId);
      setSelectedDocumentId(newDocId);
      setDocumentName(file.name);
      setDocumentFile(file);
    }
  };

  const handleAnalysisComplete = async (files: File[]) => {
    if (files.length === 0) {
      setError('No file uploaded.');
      setEligible(false);
      return;
    }
    const file = files[0];
    try {
      const text = await readFileText(file);
      setDocumentText(text);
      const wordCount = text.split(/\s+/).length;
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      const titleLine = lines[0] || '';
      const hasTitle = titleLine.length >= 5;
      const paragraphCount = lines.filter(l => l.length > 40).length;
      const hasParagraphs = paragraphCount >= 2;
      const valid = wordCount > 200 && hasTitle;
      setEligible(valid);
      if (valid) {
        setStep(1);
        setError(null);
      } else {
        setError('Document is not eligible. Please upload a research document with a title, paragraphs, and sufficient length.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error while reading file.');
      setEligible(false);
    }
  };

  // Plagiarism check function
  // Poll for report completion
  const pollForCompletion = async (reportId: number) => {
    const maxAttempts = 30; // 30 seconds max
    let attempts = 0;
    
    const poll = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PLAGIARISM_API_URL}/status/${reportId}`);
        if (!response.ok) throw new Error(`Status check failed: ${response.status}`);
        const data = await response.json();
        
        console.log('Poll response:', data);
        
        if (data.data.status === 2 || data.data.status_label === 'checked') {
          // Report is complete
          console.log('Report completed, fetching final results');
          const finalResponse = await fetch(`${process.env.NEXT_PUBLIC_PLAGIARISM_API_URL}/report/${reportId}`);
          if (finalResponse.ok) {
            const finalData = await finalResponse.json();
            console.log('Final report data:', finalData);
            setPlagiarismResult(finalData);
            
            // Fetch HTML report
            try {
              const htmlRes = await fetch(`${process.env.NEXT_PUBLIC_PLAGIARISM_API_URL}/reports/html/${reportId}`);
              if (htmlRes.ok) {
                const htmlData = await htmlRes.json();
                setPlagiarismResult((prev: any) => ({
                  ...prev,
                  reportHtml: htmlData.data?.html || '<p>Could not load report details.</p>'
                }));
              }
            } catch (htmlErr) {
              console.error('Failed to fetch HTML report:', htmlErr);
            }
          }
        } else if (attempts < maxAttempts) {
          // Still processing, poll again in 1 second
          attempts++;
          setTimeout(poll, 1000);
        } else {
          // Timeout
          setPlagiarismError('Report processing timed out. Please try again.');
        }
      } catch (err) {
        console.error('Poll error:', err);
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 1000);
        } else {
          setPlagiarismError('Failed to check report status.');
        }
      }
    };
    
    poll();
  };

  const runPlagiarismCheck = async () => {
    if (!documentText) {
      setPlagiarismError('No document text available.');
      return;
    }
    setPlagiarismLoading(true);
    setPlagiarismError(null);
    setPlagiarismResult(null);
    try {
      const formData = new FormData();
      formData.append('text', documentText);
      formData.append('title', documentName || 'Document.txt');
      const response = await fetch(`${process.env.NEXT_PUBLIC_PLAGIARISM_API_URL}/check`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`Plagiarism server error: ${response.status}`);
      const data = await response.json();
      
      // Log the full response to see the structure
      console.log('Plagiarism API Response:', data);
      console.log('Response data structure:', JSON.stringify(data, null, 2));
      
      // Check if the report is still processing
      if (data.data.status === -9 || data.data.status_label === 'init') {
        console.log('Report is still processing, status:', data.data.status_label);
        setPlagiarismResult({
          ...data,
          isProcessing: true,
          reportId: data.data.id
        });
        
        // Poll for completion
        pollForCompletion(data.data.id);
      } else {
        setPlagiarismResult(data);
        
        // If we have a report ID, fetch the HTML report
        if (data.data.id) {
          try {
            const htmlRes = await fetch(`${process.env.NEXT_PUBLIC_PLAGIARISM_API_URL}/reports/html/${data.data.id}`);
            if (htmlRes.ok) {
              const htmlData = await htmlRes.json();
              console.log('HTML Report Response:', htmlData);
              // Store the HTML report in the result
              setPlagiarismResult((prev: any) => ({
                ...prev,
                reportHtml: htmlData.data?.html || '<p>Could not load report details.</p>'
              }));
            }
          } catch (htmlErr) {
            console.error('Failed to fetch HTML report:', htmlErr);
          }
        }
      }
    } catch (err) {
      console.error('Plagiarism check error:', err);
      setPlagiarismError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setPlagiarismLoading(false);
    }
  };

  const completeStep = (nextScore?: number) => {
    if (nextScore) {
      setTrustScore(nextScore)
    }
    setStep((prevStep) => prevStep + 1)
  }

  const handleHumanReviewComplete = (submission: any) => {
    setStep(5)
  }

  const handleNFTMintingComplete = async () => {
    // Archive the completed workflow before redirecting
    try {
      if (selectedDocumentId && documentFile) {
        const archiveData = {
          step, // <-- add this line to ensure step is included
          documentId: selectedDocumentId,
          documentName: documentName || 'Unknown Document',
          documentText: documentText || '',
          documentFile,
          plagiarismResult,
          trustScoreData,
          humanReviewData,
          nftMintingData,
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        };

        if (!walletAddress) {
          throw new Error('Wallet not connected');
        }
        await workflowPersistence.archiveWorkflow(archiveData, walletAddress);
        console.log('Workflow archived successfully');
        
        // Clear workflow state immediately to prevent duplicates
        clearWorkflowState();
        
        // Show success message
        toast({
          title: 'NFT Certificate Minted!',
          description: 'Your document has been successfully minted as an NFT.',
        });
      }
    } catch (error) {
      console.error('Failed to archive workflow:', error);
      toast({
        title: 'Archive Failed',
        description: 'Workflow completed but failed to archive. Your NFT was still minted successfully.',
        variant: 'destructive',
      });
    }

    // Navigate to NFT gallery
    router.push("/nft-gallery")
  }

  const handleResumeWorkflow = async (archiveUrl: string) => {
    try {
      setIsLoading(true);
      const resumedState = await workflowPersistence.resumeWorkflow(archiveUrl);
      
      if (resumedState) {
        setStep(resumedState.step);
        setSelectedDocumentId(resumedState.documentId);
        setDocumentName(resumedState.documentName);
        setDocumentText(resumedState.documentText);
        setDocumentFile(resumedState.documentFile);
        setEligible(resumedState.eligible);
        setPlagiarismResult(resumedState.plagiarismResult);
        setTrustScoreData(resumedState.trustScoreData);
        setHumanReviewData(resumedState.humanReviewData);
        setNftMintingData(resumedState.nftMintingData);
        setError(resumedState.error);
        setCreatedAt(resumedState.createdAt || null);
        
        if (resumedState.trustScoreData) {
          setTrustScore(resumedState.trustScoreData.trustScore);
        }
        
        setShowResumeModal(false);
        console.log('Workflow resumed successfully');
      }
    } catch (error) {
      console.error('Failed to resume workflow:', error);
      setError('Failed to resume workflow');
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteArchive = async (archiveUrl: string) => {
    try {
      const success = await workflowPersistence.deleteArchivedWorkflow(archiveUrl);
      if (success) {
        await loadArchivedWorkflows(); // Reload the list
        console.log('Archive deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete archive:', error);
    }
  }

  // Save as Draft/Archive handler
  const handleSaveAsDraft = async () => {
    if (!selectedDocumentId || !documentFile) return;
    setIsArchiving(true);
    try {
      const archiveData = {
        step, // <-- ensure step is included
        documentId: selectedDocumentId,
        documentName: documentName || 'Unknown Document',
        documentText: documentText || '',
        documentFile,
        plagiarismResult,
        trustScoreData,
        humanReviewData,
        nftMintingData,
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      };
      if (!walletAddress) {
        throw new Error('Wallet not connected');
      }
      await workflowPersistence.archiveWorkflow(archiveData, walletAddress);
      toast({
        title: 'Saved as Draft/Archive',
        description: 'You can resume this workflow from the Documents page.',
      });
      // Reset workflow state for new workflow
      workflowPersistence.clearWorkflowState();
      setStep(0);
      setSelectedDocumentId(null);
      setDocumentName(null);
      setDocumentFile(null);
      setTrustScore(null);
      setTrustScoreData(null);
      setEligible(undefined);
      setDocumentText(null);
      setPlagiarismResult(null);
      setPlagiarismLoading(false);
      setPlagiarismError(null);
      setHumanReviewData(null);
      setNftMintingData(null);
      setError(null);
    } catch (error) {
      toast({
        title: 'Failed to Save as Draft/Archive',
        description: 'An error occurred while saving. Please try again.',
        variant: 'destructive',
      });
      console.error('Failed to archive workflow:', error);
    } finally {
      setIsArchiving(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <FileUpload onFilesSelected={handleFilesSelected} onAnalysisComplete={handleAnalysisComplete} />
      case 1:
        return <AIEligibilityChecker documentId={selectedDocumentId || ""} eligible={eligible} error={error || undefined} onComplete={() => completeStep()} />
      case 2:
        return (
          <GlassCard className="w-full">
            <h2 className="text-2xl font-bold mb-6">Plagiarism Check</h2>
            {plagiarismLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-mintellect-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Checking for plagiarism...</p>
              </div>
            ) : plagiarismResult?.isProcessing ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-mintellect-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Processing plagiarism report...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            ) : plagiarismResult ? (
              <div className="text-center py-8 flex flex-col items-center gap-4 sm:block">
                <PlagiarismReportViewer 
                  plagiarismResult={plagiarismResult}
                  documentName={documentName || "Document"}
                />
                <div className="w-full sm:w-auto mt-4 flex flex-col sm:flex-row justify-center items-center gap-2">
                  <RippleButton className="w-full sm:w-auto" onClick={() => completeStep()}>
                    Continue to Next Step
                  </RippleButton>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">Run a plagiarism check on your document.</p>
                {plagiarismError && <div className="text-red-500 mb-2">{plagiarismError}</div>}
                <RippleButton onClick={runPlagiarismCheck} disabled={plagiarismLoading || !documentText}>
                  Run Plagiarism Check
                </RippleButton>
              </div>
            )}
          </GlassCard>
        );
      case 3:
        return <TrustScoreGenerator 
          documentId={selectedDocumentId || ""} 
          documentText={documentText || ""}
          plagiarismResult={plagiarismResult}
          onComplete={(score, data) => {
            setTrustScoreData(data);
            completeStep(score);
          }} 
        />
      case 4:
        return <HumanReviewInterface isReviewer={false} onMintNFT={handleHumanReviewComplete} />
      case 5:
        return (
          <NFTMinting
            documentId={selectedDocumentId || ""}
            documentName={documentName || "Research Document"}
            trustScore={trustScore || 90}
            onComplete={handleNFTMintingComplete}
          />
        )
      default:
        return (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Invalid Step</h3>
            <RippleButton onClick={clearWorkflowState} fullWidth={true}>
              Start Over
            </RippleButton>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-mintellect-primary/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <header className="relative z-10 border-b border-gray-800 py-8 bg-black">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex justify-between items-start">
                <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Verification Workflow
            </h1>
            <p className="text-gray-400 max-w-xl text-sm md:text-base">
              Step-by-step verification and minting for your research.
            </p>
                </div>
                
                {/* Resume Workflow Button */}
                {archivedWorkflows.length > 0 && (
                  <RippleButton
                    onClick={() => setShowResumeModal(true)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Resume Workflow
                  </RippleButton>
                )}
              </div>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Resume Workflow Modal */}
          {showResumeModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Resume Workflow</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Choose a workflow to resume from your archived documents:
                </p>
                
                {archivedWorkflows.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No archived workflows found.</p>
                ) : (
                  <div className="space-y-3">
                    {archivedWorkflows.map((archive, index) => (
                      <div key={archive.documentId} className="border rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{archive.documentName}</h3>
                          <p className="text-sm text-gray-500">
                            Created: {formattedCreatedAt}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">
                            Status: {archive.status.replace('_', ' ')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <RippleButton
                            onClick={() => handleResumeWorkflow(archive.archiveUrl)}
                            disabled={isLoading}
                            className="text-sm"
                          >
                            {isLoading ? 'Loading...' : 'Resume'}
                          </RippleButton>
                          <RippleButton
                            onClick={() => handleDeleteArchive(archive.archiveUrl)}
                            variant="outline"
                            className="text-sm text-red-500"
                          >
                            Delete
                          </RippleButton>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-end gap-3 mt-6">
                  <RippleButton
                    onClick={() => setShowResumeModal(false)}
                    variant="outline"
                  >
                    Cancel
                  </RippleButton>
                </div>
              </div>
            </div>
          )}

          <GlassCard className="mb-8 p-8 relative overflow-hidden">
            {/* Error display */}
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}
            {/* Background pattern for workflow card */}
            <div className="absolute inset-0 -z-10 opacity-5">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Workflow Progress Indicator */}
            <div className="relative mb-16">
              {/* Progress Bar - Enhanced with gradient and glow effect, aligned with icon centers */}
              <div
                className="absolute z-0"
                style={{
                  top: '24px',
                  left: '24px', // half icon width (w-12 = 48px, so 24px)
                  right: '24px', // half icon width
                  height: '0',
                }}
              >
                <div className="relative h-1.5 bg-gray-800 rounded-full z-0 overflow-hidden">
                <div className="absolute inset-0 bg-opacity-20 bg-white/5"></div>
              {/* Animated Progress Fill */}
              <div
                    className="absolute top-0 left-0 h-1.5 rounded-full transition-all duration-700 ease-in-out"
                style={{
                  width: `${(step / (steps.length - 1)) * 100}%`,
                      maxWidth: '100%',
                  background:
                    "linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(139,92,246,1) 50%, rgba(6,182,212,1) 100%)",
                  boxShadow: "0 0 10px rgba(99,102,241,0.5), 0 0 20px rgba(99,102,241,0.3)",
                }}
              >
                {/* Animated pulse effect */}
                <div className="absolute right-0 top-1/2 w-4 h-4 -mt-2 -mr-2 bg-mintellect-primary rounded-full">
                  <div className="absolute inset-0 rounded-full animate-ping bg-mintellect-primary opacity-75"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step Indicators (no extra connecting lines) */}
              <div className="flex justify-between relative">
                {steps.map((s, i) => (
                  <div key={i} className="flex flex-col items-center">
                    {/* Step circle with icon */}
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{
                        scale: i <= step ? 1 : 0.8,
                        opacity: 1,
                      }}
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center z-10 
                        transition-all duration-500
                        ${
                          i < step
                            ? "bg-green-500 text-white workflow-step-completed"
                            : i === step
                              ? "workflow-gradient text-white workflow-step-active"
                              : "bg-gray-800 text-gray-400"
                        }`}
                    >
                      {i < step ? <Check className="h-6 w-6 opacity-100" /> : <s.icon className="h-6 w-6 opacity-100" />}

                      {/* Pulse animation for current step */}
                      {i === step && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-mintellect-primary"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.5, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                          }}
                        />
                      )}

                      {/* Glow effect for completed steps */}
                      {i < step && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 rounded-full"
                          style={{ boxShadow: "0 0 10px rgba(74,222,128,0.5)" }}
                        />
                      )}
                    </motion.div>

                    {/* Step name with animated transition */}
                    <motion.p
                      initial={{ y: 5, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        transition: { delay: i * 0.1 },
                      }}
                      className={`text-sm font-medium mt-3 ${i <= step ? "text-white" : "text-gray-400"}`}
                    >
                      {s.name}
                    </motion.p>

                    {/* Step indicator dot for completed steps */}
                    {i < step && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-green-400 rounded-full mt-1"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Current Step Content */}
            <div className="mt-8">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-12 h-12 border-4 border-mintellect-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Error</h3>
                  <RippleButton onClick={clearWorkflowState} fullWidth={true}>
                    Start Over
                  </RippleButton>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Save as Draft/Archive Button (steps after eligibility) */}
            {step >= 2 && step < 6 && (
              <div className="mt-6 flex justify-end">
                <RippleButton
                  onClick={handleSaveAsDraft}
                  disabled={isArchiving}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isArchiving ? 'Saving...' : 'Save as Draft/Archive'}
                </RippleButton>
              </div>
            )}

            {/* Document Info Card */}
            {selectedDocumentId && step > 0 && step < 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex justify-center"
              >
                <GlassCard className="max-w-md w-full relative overflow-hidden" variant="glowing">
                  {/* Add subtle animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-mintellect-primary/5 to-transparent opacity-30 -z-10"></div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-mintellect-primary/10">
                      <FileText className="h-8 w-8 text-mintellect-primary flex-shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-medium">{documentName}</h4>
                      {trustScore && (
                        <div className="flex items-center mt-1">
                          <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-green-400" style={{ width: `${trustScore}%` }}></div>
                          </div>
                          <span className="ml-2 text-sm text-green-400 font-medium">{trustScore}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            {step > 0 && step < steps.length && (
              <div className="mt-8 flex justify-between">
                <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.97 }}>
                  <RippleButton
                    variant="outline"
                    onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                    className="flex items-center gap-2"
                    fullWidth={true}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back
                  </RippleButton>
                </motion.div>

                {step < steps.length - 1 && (
                  <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}>
                    <RippleButton
                      onClick={() => completeStep()}
                      disabled={step === 3 || step === 4}
                      className="flex items-center gap-2"
                      fullWidth={true}
                    >
                      Next
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </RippleButton>
                  </motion.div>
                )}
              </div>
            )}
          </GlassCard>

          {/* Help Section */}
          <div className="mt-8">
            <GlassCard className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-mintellect-primary"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
                <span className="font-medium">Need help?</span>
              </div>
              <div className="flex gap-2">
                <RippleButton variant="outline" size="sm" className="flex items-center gap-1" fullWidth={true}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span>Chat</span>
                </RippleButton>
                <RippleButton variant="outline" size="sm" className="flex items-center gap-1" fullWidth={true}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  <span>Docs</span>
                </RippleButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  )
}
