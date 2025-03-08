"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, CheckCircle, Shield, ShieldCheck, ShieldAlert, AlertTriangle, Info } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AIFlags {
  highConfidenceAI: number
  sampleSections: Array<{
    score: number
    preview: string
  }>
}

interface TrustScoreComponent {
  score: number
  weight: number
  contribution: number
}

interface AIDetails {
  aiProbability: number
  confidence: number
  model: string
  verdict: string
  flags: AIFlags
}

interface TrustScoreRecommendation {
  area: string
  issue: string
  action: string
}

interface TrustScoreData {
  trustScore: number
  trustLevel: string
  components: {
    plagiarism: TrustScoreComponent
    aiGenerated: TrustScoreComponent & {
      details: AIDetails
    }
  }
  recommendations: TrustScoreRecommendation[]
}

export default function TrustScorePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [trustScoreData, setTrustScoreData] = useState<TrustScoreData | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Fetch trust score data from the API
    fetchTrustScore()
  }, [])

  const fetchTrustScore = async () => {
    setIsLoading(true)
    try {
      // Get file path and plagiarism results from session storage
      const filePath = sessionStorage.getItem("currentFilePath")
      const plagiarismResults = sessionStorage.getItem("plagiarismResults")

      if (!filePath || !plagiarismResults) {
        throw new Error("Missing required data. Please complete the plagiarism check first.")
      }

      // Use environment variable for API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
      const response = await fetch(`${apiUrl}/api/trust-score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePath,
          plagiarismResults: JSON.parse(plagiarismResults),
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch trust score: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Unknown error occurred")
      }

      // Set trust score data
      setTrustScoreData(data.data)

      // Store trust score in session storage for other pages to use
      sessionStorage.setItem("trustScore", (data.data.trustScore / 100).toString())
    } catch (error) {
      console.error("Error fetching trust score:", error)
      toast({
        variant: "destructive",
        title: "Failed to load trust score",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })

      // Fallback to a default trust score if we can't fetch it
      const storedTrustScore = sessionStorage.getItem("trustScore")
      if (storedTrustScore) {
        const score = Number.parseFloat(storedTrustScore)
        // Create a minimal trust score object with the stored value
        setTrustScoreData({
          trustScore: Math.round(score * 100),
          trustLevel: score >= 0.85 ? "High" : score >= 0.7 ? "Moderate" : score >= 0.5 ? "Low" : "Very Low",
          components: {
            plagiarism: {
              score: Math.round(score * 100),
              weight: 0.6,
              contribution: Math.round(score * 60),
            },
            aiGenerated: {
              score: Math.round(score * 100),
              weight: 0.4,
              contribution: Math.round(score * 40),
              details: {
                aiProbability: 1 - score,
                confidence: 0.8,
                model: "default",
                verdict: "possibly-ai-generated",
                flags: {
                  highConfidenceAI: 0,
                  sampleSections: [],
                },
              },
            },
          },
          recommendations: [],
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = () => {
    setIsLoading(true)

    // Simulate blockchain verification
    setTimeout(() => {
      setIsVerified(true)
      setIsLoading(false)

      toast({
        title: "Verification Complete",
        description: "Your paper has been verified on the blockchain",
      })
    }, 2000)
  }

  const handleContinue = () => {
    router.push("/review")
  }

  // Function to get trust level color
  const getTrustLevelColor = (level: string): string => {
    switch (level) {
      case "High":
        return "text-green-500 bg-green-100 dark:bg-green-900/30"
      case "Moderate":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30"
      case "Low":
        return "text-orange-500 bg-orange-100 dark:bg-orange-900/30"
      case "Very Low":
        return "text-red-500 bg-red-100 dark:bg-red-900/30"
      default:
        return "text-blue-500 bg-blue-100 dark:bg-blue-900/30"
    }
  }

  // Function to get score color
  const getScoreColor = (score: number): string => {
    if (score >= 85) return "text-green-500"
    if (score >= 70) return "text-yellow-500"
    if (score >= 50) return "text-orange-500"
    return "text-red-500"
  }

  // Function to get score background color for progress bars
  const getScoreBgColor = (score: number): string => {
    if (score >= 85) return "bg-green-500"
    if (score >= 70) return "bg-yellow-500"
    if (score >= 50) return "bg-orange-500"
    return "bg-red-500"
  }

  // Function to get icon based on trust level
  const getTrustLevelIcon = (level: string) => {
    switch (level) {
      case "High":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Moderate":
        return <Info className="h-5 w-5 text-yellow-500" />
      case "Low":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "Very Low":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/plagiarism/reduce"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Plagiarism Reduction
        </Link>
        {trustScoreData && (
          <div className="text-sm">
            Trust Score: <span className="font-medium">{trustScoreData.trustScore}%</span>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 mb-8"
      >
        <h1 className="text-3xl font-bold">Trust Score Dashboard</h1>
        <p className="text-muted-foreground">View your paper's trust score analysis and verify it on the blockchain.</p>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Analyzing trust score data...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-6">Trust Score Analysis</h2>

              {trustScoreData && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={`flex items-center justify-center w-20 h-20 rounded-full ${getScoreBgColor(trustScoreData.trustScore)}`}
                    >
                      <span className="text-white text-2xl font-bold">{trustScoreData.trustScore}%</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {getTrustLevelIcon(trustScoreData.trustLevel)}
                        <h3 className="text-lg font-medium">{trustScoreData.trustLevel} Trust Level</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {trustScoreData.trustLevel === "High"
                          ? "Your paper demonstrates excellent originality and authenticity."
                          : trustScoreData.trustLevel === "Moderate"
                            ? "Your paper shows good originality with some areas for improvement."
                            : trustScoreData.trustLevel === "Low"
                              ? "Your paper needs significant improvements in originality and authenticity."
                              : "Your paper has critical issues that need immediate attention."}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Components:</strong> Plagiarism ({trustScoreData.components.plagiarism.weight * 100}%),
                        AI Detection ({trustScoreData.components.aiGenerated.weight * 100}%)
                      </p>
                    </div>
                  </div>

                  {/* Component scores table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">Component</th>
                          <th className="text-center py-2 px-4">Score</th>
                          <th className="text-center py-2 px-4">Weight</th>
                          <th className="text-center py-2 px-4">Contribution</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 px-4">Originality (Plagiarism Check)</td>
                          <td
                            className={`py-2 px-4 text-center font-medium ${getScoreColor(trustScoreData.components.plagiarism.score)}`}
                          >
                            {trustScoreData.components.plagiarism.score}%
                          </td>
                          <td className="py-2 px-4 text-center">
                            {trustScoreData.components.plagiarism.weight * 100}%
                          </td>
                          <td className="py-2 px-4 text-center">{trustScoreData.components.plagiarism.contribution}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4">Authenticity (AI Detection)</td>
                          <td
                            className={`py-2 px-4 text-center font-medium ${getScoreColor(trustScoreData.components.aiGenerated.score)}`}
                          >
                            {trustScoreData.components.aiGenerated.score}%
                          </td>
                          <td className="py-2 px-4 text-center">
                            {trustScoreData.components.aiGenerated.weight * 100}%
                          </td>
                          <td className="py-2 px-4 text-center">
                            {trustScoreData.components.aiGenerated.contribution}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* AI Detection Details */}
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4">AI Content Detection Details</h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Verdict:</strong>{" "}
                        {trustScoreData.components.aiGenerated.details.verdict
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                      <p>
                        <strong>AI Probability:</strong>{" "}
                        {Math.round(trustScoreData.components.aiGenerated.details.aiProbability * 100)}%
                      </p>
                      <p>
                        <strong>Confidence:</strong>{" "}
                        {Math.round(trustScoreData.components.aiGenerated.details.confidence * 100)}%
                      </p>
                      <p>
                        <strong>Model:</strong> {trustScoreData.components.aiGenerated.details.model}
                      </p>
                    </div>

                    {/* Flagged Sections */}
                    {trustScoreData.components.aiGenerated.details.flags.highConfidenceAI > 0 && (
                      <div className="mt-4">
                        <p className="font-medium">
                          Flagged Sections: {trustScoreData.components.aiGenerated.details.flags.highConfidenceAI}
                        </p>
                        {trustScoreData.components.aiGenerated.details.flags.sampleSections.length > 0 && (
                          <div className="mt-2 space-y-4">
                            {trustScoreData.components.aiGenerated.details.flags.sampleSections.map((sample, index) => (
                              <div key={index} className="border rounded-md p-3">
                                <p className="text-sm">
                                  <strong>AI Score:</strong> {Math.round(sample.score * 100)}%
                                </p>
                                <p className="text-sm mt-1">
                                  <strong>Preview:</strong> "{sample.preview}"
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Recommendations */}
                  {trustScoreData.recommendations.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                      <div className="space-y-4">
                        {trustScoreData.recommendations.map((recommendation, index) => (
                          <div key={index} className="border rounded-md p-4">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                              <div>
                                <h4 className="font-medium">{recommendation.area}</h4>
                                <p className="text-sm mt-1">
                                  <strong>Issue:</strong> {recommendation.issue}
                                </p>
                                <p className="text-sm mt-1">
                                  <strong>Action:</strong> {recommendation.action}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-6">Blockchain Verification</h2>

              {isVerified ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Verification Complete</h3>
                  <p className="text-center text-muted-foreground mb-4">
                    Your paper has been successfully verified on the blockchain
                  </p>
                  <div className="bg-muted p-3 rounded-md font-mono text-xs w-full overflow-x-auto">
                    <p>Transaction Hash: 0x7f9e8d7c6b5a4e3f2d1c0b9a8e7d6c5b4a3f2e1d</p>
                    <p className="mt-1">Block Number: 15482935</p>
                    <p className="mt-1">Timestamp: {new Date().toISOString()}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Not Yet Verified</h3>
                  <p className="text-center text-muted-foreground mb-4">
                    Verify your paper on the blockchain to create an immutable record of its authenticity
                  </p>
                  <Button onClick={handleVerify} disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify on Blockchain"}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4">Trust Score</h2>
              {trustScoreData && (
                <div className="flex flex-col items-center">
                  <div className={`relative w-40 h-40 mb-4`}>
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-muted/20"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeDasharray={`${trustScoreData.trustScore * 2.83} 283`}
                        className={`${
                          trustScoreData.trustScore >= 85
                            ? "text-green-500"
                            : trustScoreData.trustScore >= 70
                              ? "text-yellow-500"
                              : trustScoreData.trustScore >= 50
                                ? "text-orange-500"
                                : "text-red-500"
                        }`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">{trustScoreData.trustScore}%</span>
                      <span className="text-sm font-medium">{trustScoreData.trustLevel}</span>
                    </div>
                  </div>
                  <p className="text-center text-muted-foreground">
                    {trustScoreData.trustLevel === "High"
                      ? "Excellent! Your paper has a high trust score."
                      : trustScoreData.trustLevel === "Moderate"
                        ? "Good. Your paper has a moderate trust score."
                        : trustScoreData.trustLevel === "Low"
                          ? "Your paper needs improvement to increase its trust score."
                          : "Your paper requires significant revisions to be trustworthy."}
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4">Verification Status</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full p-1.5 bg-green-100 dark:bg-green-900/30">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Plagiarism Check</h4>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full p-1.5 bg-green-100 dark:bg-green-900/30">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">AI Content Analysis</h4>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full p-1.5 ${isVerified ? "bg-green-100 dark:bg-green-900/30" : "bg-muted"}`}
                  >
                    {isVerified ? (
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Blockchain Verification</h4>
                    <p className="text-xs text-muted-foreground">{isVerified ? "Completed" : "Pending"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full p-1.5 bg-muted">
                    <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Human Review</h4>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/plagiarism/reduce">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Link>
              </Button>
              <Button onClick={handleContinue}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

