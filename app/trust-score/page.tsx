"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle, Shield, ShieldCheck, ShieldAlert, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatPercentage, getTrustScoreClass } from "@/lib/utils"

export default function TrustScorePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [trustScore, setTrustScore] = useState<number | null>(null)
  const [aiContent, setAiContent] = useState(0)
  const [humanContent, setHumanContent] = useState(0)
  const [isVerified, setIsVerified] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Get trust score from session storage
    const storedTrustScore = sessionStorage.getItem("trustScore")
    if (storedTrustScore) {
      setTrustScore(Number.parseFloat(storedTrustScore))

      // Calculate AI vs Human content based on trust score
      // Higher trust score = more human content
      const human = 0.3 + Number.parseFloat(storedTrustScore) * 0.6
      setHumanContent(human)
      setAiContent(1 - human)
    } else {
      // If no trust score, generate a random one
      const score = 0.5 + Math.random() * 0.4
      setTrustScore(score)

      const human = 0.3 + score * 0.6
      setHumanContent(human)
      setAiContent(1 - human)
    }

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

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

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/plagiarism/reduce"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Plagiarism Reduction
        </Link>
        {trustScore !== null && (
          <div className="text-sm">
            Trust Score: <span className="font-medium">{formatPercentage(trustScore)}</span>
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
              <h2 className="text-xl font-semibold mb-6">AI vs Human Content Analysis</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Human-Written Content</span>
                    <span className="text-sm">{formatPercentage(humanContent)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${humanContent * 100}%` }}></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Content identified as written by humans shows:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Consistent writing style</li>
                      <li>Natural language patterns</li>
                      <li>Proper citation usage</li>
                      <li>Domain-specific expertise</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">AI-Generated Content</span>
                    <span className="text-sm">{formatPercentage(aiContent)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${aiContent * 100}%` }}></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Content identified as AI-generated shows:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Generic phrasing patterns</li>
                      <li>Repetitive sentence structures</li>
                      <li>Lack of nuanced domain knowledge</li>
                      <li>Consistent formatting patterns</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Content Distribution</h3>
                <div className="h-8 bg-muted rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-green-500 flex items-center justify-center text-xs font-medium text-white"
                    style={{ width: `${humanContent * 100}%` }}
                  >
                    {humanContent > 0.2 ? "Human" : ""}
                  </div>
                  <div
                    className="h-full bg-blue-500 flex items-center justify-center text-xs font-medium text-white"
                    style={{ width: `${aiContent * 100}%` }}
                  >
                    {aiContent > 0.2 ? "AI" : ""}
                  </div>
                </div>
              </div>
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
              {trustScore !== null && (
                <div className="flex flex-col items-center">
                  <div className={`trust-score-ring ${getTrustScoreClass(trustScore)} p-8 rounded-full mb-4`}>
                    <div className="text-center">
                      <span className="text-4xl font-bold">{formatPercentage(trustScore)}</span>
                    </div>
                  </div>
                  <p className="text-center text-muted-foreground">
                    {trustScore >= 0.8
                      ? "Excellent! Your paper has a high trust score."
                      : trustScore >= 0.5
                        ? "Good. Your paper has a moderate trust score."
                        : "Your paper needs improvement to increase its trust score."}
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

