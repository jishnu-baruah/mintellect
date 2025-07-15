"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileUpload } from "@/components/file-upload"
import { AIEligibilityChecker } from "@/components/ai-eligibility-checker"
import { PlagiarismReduction } from "@/components/plagiarism-reduction"
import { TrustScoreGenerator } from "@/components/trust-score-generator"
import { NFTMinting } from "@/components/nft-minting"
import { useRouter, useSearchParams } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import { Check, FileText, AlertCircle, Upload, Shield, FileCheck, Award, UserCheck } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { HumanReviewInterface } from "@/components/human-review-interface"

export default function WorkflowPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)
  const [documentName, setDocumentName] = useState<string | null>(null)
  const [trustScore, setTrustScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize state from URL parameters if available
  useEffect(() => {
    const stepParam = searchParams.get("step")
    const docIdParam = searchParams.get("documentId")

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
  }, [searchParams])

  const steps = [
    {
      name: "Upload",
      component: "upload",
      icon: Upload,
    },
    {
      name: "AI Check",
      component: "eligibility",
      icon: Shield,
    },
    {
      name: "Plagiarism",
      component: "plagiarism",
      icon: FileCheck,
    },
    {
      name: "Trust Score",
      component: "trust",
      icon: Award,
    },
    {
      name: "Review",
      component: "review",
      icon: UserCheck,
    },
    {
      name: "NFT",
      component: "minting",
      icon: Shield,
    },
  ]

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      const newDocId = `doc-${Math.random().toString(36).substring(2, 9)}`
      setSelectedDocumentId(newDocId)
      setDocumentName(files[0].name)
    }
  }

  const handleAnalysisComplete = (files: File[]) => {
    if (files.length > 0 && selectedDocumentId) {
      setStep(1)
    }
  }

  const completeStep = (nextScore?: number) => {
    if (nextScore) {
      setTrustScore(nextScore)
    }
    setStep((prevStep) => prevStep + 1)
  }

  const handleHumanReviewComplete = (submission: any) => {
    setStep(5)
  }

  const handleNFTMintingComplete = () => {
    router.push("/nft-gallery")
  }

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <FileUpload onFilesSelected={handleFilesSelected} onAnalysisComplete={handleAnalysisComplete} />
      case 1:
        return <AIEligibilityChecker documentId={selectedDocumentId || ""} onComplete={() => completeStep()} />
      case 2:
        return (
          <PlagiarismReduction
            documentId={selectedDocumentId || ""}
            isPremium={true}
            onComplete={() => completeStep(88)}
          />
        )
      case 3:
        return <TrustScoreGenerator documentId={selectedDocumentId || ""} onComplete={() => completeStep(92)} />
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
            <RippleButton onClick={() => setStep(0)} fullWidth={true}>
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Verification Workflow
            </h1>
            <p className="text-gray-400 max-w-xl">
              Step-by-step verification and minting for your research documents, powered by AI and blockchain.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="mb-8 p-8 relative overflow-hidden" variant="futuristic">
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
              {/* Progress Bar - Enhanced with gradient and glow effect */}
              <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-800 rounded-full -z-10 transform -translate-y-1/2 overflow-hidden">
                <div className="absolute inset-0 bg-opacity-20 bg-white/5"></div>
              </div>

              {/* Animated Progress Fill */}
              <div
                className="absolute top-1/2 left-0 h-1.5 rounded-full -z-10 transform -translate-y-1/2 transition-all duration-700 ease-in-out"
                style={{
                  width: `${(step / (steps.length - 1)) * 100}%`,
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

              {/* Step Indicators with connecting lines */}
              <div className="flex justify-between relative">
                {steps.map((s, i) => (
                  <div key={i} className="flex flex-col items-center">
                    {/* Connecting lines between steps */}
                    {i > 0 && (
                      <div
                        className={`absolute h-0.5 top-6 -z-10 transition-colors duration-500 ${i <= step ? "bg-gradient-to-r from-mintellect-primary to-mintellect-accent" : "bg-gray-700"}`}
                        style={{
                          left: `${(i - 1) * (100 / (steps.length - 1))}%`,
                          width: `${100 / (steps.length - 1)}%`,
                        }}
                      ></div>
                    )}

                    {/* Step circle with icon */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{
                        scale: i <= step ? 1 : 0.8,
                        opacity: i <= step ? 1 : 0.5,
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
                      {i < step ? <Check className="h-6 w-6" /> : <s.icon className="h-6 w-6" />}

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
                  <RippleButton onClick={() => setStep(0)} fullWidth={true}>
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
