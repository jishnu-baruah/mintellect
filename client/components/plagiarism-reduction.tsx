"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "./ui/glass-card"
import { RippleButton } from "./ui/ripple-button"
import { Edit, Lock, Coins, AlertTriangle, CheckCircle2 } from "lucide-react"
import { type UserModel, UserTier } from "@/types/user"
import PlagiarismPayment from "./PlagiarismPayment"

interface PlagiarismResult {
  originalityScore: number
  matches: PlagiarismMatch[]
}

interface PlagiarismMatch {
  id: string
  text: string
  source: string
  similarity: number
  suggestion: string
}

interface PlagiarismReductionProps {
  documentId: string
  onComplete?: () => void
}

export function PlagiarismReduction({ documentId, onComplete }: PlagiarismReductionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PlagiarismResult | null>(null)
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null)
  const [paymentStep, setPaymentStep] = useState<"initial" | "paying" | "success" | "error" | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [showCitationReduction, setShowCitationReduction] = useState(false)
  const [citationsReduced, setCitationsReduced] = useState(false)
  const [user, setUser] = useState<UserModel | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // Check if user is premium
  const isPremium = user?.userTier === UserTier.Premium

  // Token costs
  const PLAGIARISM_REDUCTION_COST = 0.000062

  const runPlagiarismCheck = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock data
      const mockResult: PlagiarismResult = {
        originalityScore: 76,
        matches: [
          {
            id: "match1",
            text: "The theory of relativity was developed by Albert Einstein in the early 20th century.",
            source: "Wikipedia - Theory of Relativity",
            similarity: 92,
            suggestion:
              "Einstein's groundbreaking work on relativity theory emerged in the early 1900s, revolutionizing physics.",
          },
          {
            id: "match2",
            text: "Machine learning algorithms can be categorized as supervised, unsupervised, or reinforcement learning.",
            source: "Introduction to Machine Learning, 3rd Edition",
            similarity: 85,
            suggestion:
              "We can classify ML algorithms into three main types: supervised learning, unsupervised learning, and reinforcement learning approaches.",
          },
          {
            id: "match3",
            text: "Climate change poses significant threats to global ecosystems and human societies.",
            source: "IPCC Climate Report 2022",
            similarity: 78,
            suggestion:
              "Global climate shifts present substantial risks to worldwide ecological systems and human communities.",
          },
        ],
      }

      setResult(mockResult)
      setIsLoading(false)
      setPaymentStep("initial")
    }, 3000)
  }

  const getOriginalityColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 80) return "text-red-400"
    if (similarity >= 60) return "text-yellow-400"
    return "text-green-400"
  }

  const applyRewrite = (matchId: string) => {
    if (!result) return

    // In a real app, this would send the rewrite to the backend
    // Here we just update the UI to show the change
    setResult({
      ...result,
      originalityScore: Math.min(result.originalityScore + 5, 100),
      matches: result.matches.filter((match) => match.id !== matchId),
    })

    setActiveMatchId(null)
  }

  const handleCitationReduction = () => {
    setIsLoading(true)

    // Simulate API call for citation reduction
    setTimeout(() => {
      setIsLoading(false)
      setCitationsReduced(true)

      // Improve originality score after citation reduction
      if (result) {
        setResult({
          ...result,
          originalityScore: Math.min(result.originalityScore + 8, 100),
        })
      }
    }, 2000)
  }

  const handleTokenPayment = () => {
    setProcessingPayment(true)
    setPaymentStep('paying')
  }

  // Render the token payment layer (Layer 1.5)
  const renderTokenPaywall = () => {
    if (paymentStep === "initial") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full py-6"
        >
          <div className="relative bg-black/40 border border-mintellect-primary/30 rounded-lg p-6 backdrop-blur-sm overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-mintellect-primary/10 to-transparent opacity-50 z-0"></div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-mintellect-primary/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Coins className="h-8 w-8 text-mintellect-primary mr-3" />
                  <h3 className="text-xl font-bold text-white">EDU Token Payment Required</h3>
                </div>
                <div className="bg-mintellect-primary/20 px-3 py-1.5 rounded-full flex items-center border border-mintellect-primary/30">
                  <Coins className="h-4 w-4 text-mintellect-primary mr-2" />
                  <span className="font-mono text-white">{user?.credits || 0} EDU</span>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-4 mb-6 border border-white/10">
                <h4 className="font-medium text-gray-300 mb-2">Service Details</h4>
                <ul className="space-y-2">
                  <li className="flex items-start text-sm">
                    <div className="bg-mintellect-primary/20 p-1 rounded-full mr-2 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-mintellect-primary" />
                    </div>
                    <span>AI-powered plagiarism reduction on {result?.matches.length} detected instances</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <div className="bg-mintellect-primary/20 p-1 rounded-full mr-2 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-mintellect-primary" />
                    </div>
                    <span>Smart rewriting that preserves your original meaning</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <div className="bg-mintellect-primary/20 p-1 rounded-full mr-2 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-mintellect-primary" />
                    </div>
                    <span>Potential originality score improvement of 10-15%</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center mb-6">
                <div className="flex-1 h-px bg-gray-700"></div>
                <div className="px-4 py-1 bg-mintellect-primary/20 rounded-full text-sm font-medium border border-mintellect-primary/30">
                  Cost: {PLAGIARISM_REDUCTION_COST} EDU Tokens
                </div>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setPaymentStep(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Skip for now
                </button>
                <RippleButton
                  onClick={handleTokenPayment}
                  disabled={processingPayment}
                  className="relative overflow-hidden group"
                >
                  {processingPayment ? (
                    <>
                      <span className="mr-2">Processing...</span>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Pay {PLAGIARISM_REDUCTION_COST} EDU Tokens
                    </>
                  )}
                </RippleButton>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                * Your document will still be processed and available for submission even if you skip this step.
              </div>
            </div>
          </div>
        </motion.div>
      )
    } else if (paymentStep === "paying") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full py-6"
        >
          <PlagiarismPayment
            onPaymentSuccess={() => {
              setPaymentStep("success")
              // Update user credits after successful payment
              if (user) {
                const updatedUser = {
                  ...user,
                  credits: user.credits - PLAGIARISM_REDUCTION_COST,
                }
                setUser(updatedUser)
                localStorage.setItem("user", JSON.stringify(updatedUser))
              }
            }}
            onPaymentError={(error: string) => {
              setPaymentStep("error")
              setError(error)
            }}
          />
        </motion.div>
      )
    } else if (paymentStep === "success") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center mb-6"
        >
          <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
          <span>Payment successful! Applying AI reductions to your document...</span>
        </motion.div>
      )
    } else if (paymentStep === "error") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center mb-6"
        >
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
          <div className="flex-1">
            <p>
              Insufficient EDU tokens. You need {PLAGIARISM_REDUCTION_COST} tokens but only have {user?.credits || 0}.
            </p>
            <RippleButton className="mt-2" size="sm">
              Buy EDU Tokens
            </RippleButton>
          </div>
        </motion.div>
      )
    }

    return null
  }

  return (
    <GlassCard className="w-full">
      <h2 className="text-2xl font-bold mb-6">Plagiarism Reduction</h2>

      {!result ? (
        <div className="text-center py-8">
          <Edit className="h-16 w-16 text-mintellect-primary mx-auto mb-4" />
          <p className="text-gray-300 mb-6">
            Our AI will analyze your document for potential plagiarism and provide suggestions to improve originality.
          </p>
          <RippleButton onClick={runPlagiarismCheck} disabled={isLoading} className="mx-auto">
            {isLoading ? (
              <>
                <span className="mr-2">Analyzing...</span>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              </>
            ) : (
              "Run Plagiarism Check"
            )}
          </RippleButton>
        </div>
      ) : (
        <div>
          {/* Token Payment Layer (Layer 1.5) */}
          {renderTokenPaywall()}

          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-1">
              <div className="relative w-48 h-48 mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-4xl font-bold"
                    >
                      <span className={getOriginalityColor(result.originalityScore)}>{result.originalityScore}%</span>
                    </motion.div>
                    <p className="text-sm text-gray-400">Originality Score</p>
                  </div>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={
                      result.originalityScore >= 80 ? "#4ade80" : result.originalityScore >= 60 ? "#facc15" : "#f87171"
                    }
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset="283"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{
                      strokeDashoffset: 283 - (283 * result.originalityScore) / 100,
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-semibold mb-4">Plagiarism Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Potential matches found:</span>
                  <span className="font-semibold">{result.matches.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Originality score:</span>
                  <span className={`font-semibold ${getOriginalityColor(result.originalityScore)}`}>
                    {result.originalityScore}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Recommendation:</span>
                  <span
                    className={`font-semibold ${
                      result.originalityScore >= 80
                        ? "text-green-400"
                        : result.originalityScore >= 60
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {result.originalityScore >= 80
                      ? "Good to submit"
                      : result.originalityScore >= 60
                        ? "Needs improvement"
                        : "Significant revision needed"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Potential Plagiarism Matches</h3>
            <div className="space-y-4">
              {result.matches.map((match) => (
                <div key={match.id} className="border border-gray-700 rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-sm text-gray-400">Source: </span>
                        <span className="text-sm font-medium">{match.source}</span>
                      </div>
                      <span className={`text-sm font-semibold ${getSimilarityColor(match.similarity)}`}>
                        {match.similarity}% Similar
                      </span>
                    </div>
                    <p className="text-sm bg-red-400/10 p-2 rounded border-l-2 border-red-400">{match.text}</p>
                  </div>

                  {activeMatchId === match.id ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 border-t border-gray-700 bg-gray-800/50"
                    >
                      <h4 className="text-sm font-semibold mb-2">AI Suggested Rewrite:</h4>
                      <p className="text-sm bg-green-400/10 p-2 rounded border-l-2 border-green-400 mb-4">
                        {match.suggestion}
                      </p>
                      <div className="flex justify-end gap-2">
                        <RippleButton variant="ghost" size="sm" onClick={() => setActiveMatchId(null)}>
                          Cancel
                        </RippleButton>
                        <RippleButton size="sm" onClick={() => applyRewrite(match.id)}>
                          Apply Rewrite
                        </RippleButton>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="p-4 border-t border-gray-700 flex justify-between items-center">
                      {paymentStep === null ? (
                        <RippleButton size="sm" onClick={() => setActiveMatchId(match.id)}>
                          View AI Suggestion
                        </RippleButton>
                      ) : (
                        <div className="flex items-center text-gray-400 text-sm">
                          <Lock className="h-3 w-3 mr-1" />
                          <span>Complete EDU Token Payment to Access</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-500">Manually rewrite to improve originality</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {paymentStep === null && !citationsReduced && (
            <div className="mt-6 border border-gray-700 rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-800 flex justify-between items-center">
                <div className="flex items-center">
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
                    className="text-mintellect-primary mr-3"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                    <path d="M12 12v9"></path>
                    <path d="m8 17 4 4 4-4"></path>
                  </svg>
                  <h3 className="font-semibold">Citation Reduction</h3>
                </div>
                <button
                  onClick={() => setShowCitationReduction(!showCitationReduction)}
                  className="text-sm text-mintellect-primary hover:underline"
                >
                  {showCitationReduction ? "Hide Details" : "Show Details"}
                </button>
              </div>

              {showCitationReduction && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 border-t border-gray-700 bg-gray-800/50"
                >
                  <p className="text-sm mb-4">
                    Our AI can analyze your document's citations and suggest ways to reduce unnecessary references while
                    maintaining academic integrity. This can improve your originality score by 5-10%.
                  </p>

                  <div className="bg-gray-900 p-3 rounded-lg mb-4">
                    <h4 className="text-sm font-semibold mb-2">Benefits of Citation Reduction:</h4>
                    <ul className="text-sm space-y-1 text-gray-400">
                      <li>• Identify redundant citations that can be consolidated</li>
                      <li>• Suggest places where paraphrasing can replace direct quotes</li>
                      <li>• Highlight citations that may not be necessary for your argument</li>
                      <li>• Improve overall originality score</li>
                    </ul>
                  </div>

                  <div className="flex justify-end">
                    {isPremium ? (
                      <RippleButton size="sm" onClick={handleCitationReduction} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <span className="mr-2">Processing...</span>
                            <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          </>
                        ) : (
                          "Reduce Citations"
                        )}
                      </RippleButton>
                    ) : (
                      <div className="flex items-center text-gray-400 text-sm">
                        <Lock className="h-3 w-3 mr-1" />
                        <span>Premium Feature</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {citationsReduced && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg"
            >
              <div className="flex items-center mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                <h3 className="font-semibold">Citation Reduction Complete</h3>
              </div>
              <p className="text-sm ml-8">
                We've analyzed your citations and made improvements to reduce redundancy while maintaining academic
                integrity. Your originality score has improved!
              </p>
            </motion.div>
          )}

          {!isPremium && paymentStep === null && (
            <div className="mt-6 p-4 border border-mintellect-primary rounded-lg bg-mintellect-primary/10 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-mintellect-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Upgrade to Premium</p>
                  <p className="text-sm text-gray-400">
                    Get access to AI-powered rewriting suggestions, citation reduction, and unlimited document analysis.
                  </p>
                </div>
              </div>
              <RippleButton>Upgrade</RippleButton>
            </div>
          )}
        </div>
      )}
      {result && (
        <div className="mt-6 flex justify-end">
          <RippleButton onClick={() => onComplete && onComplete()}>Continue to Next Step</RippleButton>
        </div>
      )}
    </GlassCard>
  )
}
