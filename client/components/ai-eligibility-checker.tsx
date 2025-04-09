"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "./ui/glass-card"
import { RippleButton } from "./ui/ripple-button"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

interface EligibilityScore {
  overall: number
  originality: number
  citations: number
  structure: number
  language: number
}

interface EligibilityFeedback {
  type: "success" | "warning" | "error"
  message: string
}

interface AIEligibilityCheckerProps {
  documentId: string
  onComplete?: () => void
}

export function AIEligibilityChecker({ documentId, onComplete }: AIEligibilityCheckerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [score, setScore] = useState<EligibilityScore | null>(null)
  const [feedback, setFeedback] = useState<EligibilityFeedback[]>([])

  const runEligibilityCheck = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock data
      const mockScore: EligibilityScore = {
        overall: 78,
        originality: 82,
        citations: 65,
        structure: 90,
        language: 75,
      }

      const mockFeedback: EligibilityFeedback[] = [
        {
          type: "success",
          message: "Your document meets the basic requirements for academic submission.",
        },
        {
          type: "warning",
          message: "Citations could be improved. Consider adding more references to support your arguments.",
        },
        {
          type: "warning",
          message: "Some sentences may need revision for clarity and academic tone.",
        },
      ]

      setScore(mockScore)
      setFeedback(mockFeedback)
      setIsLoading(false)
    }, 3000)
  }

  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-400"
    if (value >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBackground = (value: number) => {
    if (value >= 80) return "bg-green-400"
    if (value >= 60) return "bg-yellow-400"
    return "bg-red-400"
  }

  return (
    <GlassCard className="w-full">
      <h2 className="text-2xl font-bold mb-6">AI Eligibility Checker</h2>

      {!score ? (
        <div className="text-center py-8">
          <Info className="h-16 w-16 text-mintellect-primary mx-auto mb-4" />
          <p className="text-gray-300 mb-6">
            Our AI will analyze your document for academic eligibility, checking originality, citations, structure, and
            language.
          </p>
          <RippleButton onClick={runEligibilityCheck} disabled={isLoading} className="mx-auto">
            {isLoading ? (
              <>
                <span className="mr-2">Analyzing...</span>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              </>
            ) : (
              "Run Eligibility Check"
            )}
          </RippleButton>
        </div>
      ) : (
        <div>
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
                      <span className={getScoreColor(score.overall)}>{score.overall}%</span>
                    </motion.div>
                    <p className="text-sm text-gray-400">Overall Score</p>
                  </div>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={score.overall >= 80 ? "#4ade80" : score.overall >= 60 ? "#facc15" : "#f87171"}
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset="283"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{
                      strokeDashoffset: 283 - (283 * score.overall) / 100,
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-semibold mb-4">Category Scores</h3>
              <div className="space-y-4">
                {Object.entries(score)
                  .filter(([key]) => key !== "overall")
                  .map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{key}</span>
                        <span className={getScoreColor(value)}>{value}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className={`${getScoreBackground(value)} h-2 rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">AI Feedback</h3>
            <div className="space-y-3">
              {feedback.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-3 rounded-lg flex items-start gap-3 ${
                    item.type === "success"
                      ? "bg-green-400/10"
                      : item.type === "warning"
                        ? "bg-yellow-400/10"
                        : "bg-red-400/10"
                  }`}
                >
                  {item.type === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  ) : item.type === "warning" ? (
                    <Info className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  )}
                  <p className="text-sm">{item.message}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <RippleButton onClick={() => onComplete && onComplete()}>Continue to Next Step</RippleButton>
          </div>
        </div>
      )}
    </GlassCard>
  )
}
