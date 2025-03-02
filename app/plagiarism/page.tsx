"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatPercentage } from "@/lib/utils"

export default function PlagiarismPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [plagiarismScore, setPlagiarismScore] = useState(0)
  const [isPremiumLocked, setIsPremiumLocked] = useState(false)
  const [trustScore, setTrustScore] = useState<number | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Get trust score from session storage
    const storedTrustScore = sessionStorage.getItem("trustScore")
    if (storedTrustScore) {
      setTrustScore(Number.parseFloat(storedTrustScore))
    }

    // Simulate loading plagiarism check
    const timer = setTimeout(() => {
      // Generate random plagiarism score between 0.05 and 0.3
      const score = 0.05 + Math.random() * 0.25
      setPlagiarismScore(score)
      setIsLoading(false)

      // If plagiarism is over 15%, lock premium features
      if (score > 0.15) {
        setIsPremiumLocked(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleUnlock = () => {
    toast({
      title: "Premium Feature Unlocked",
      description: "You now have access to the full plagiarism report",
    })
    setIsPremiumLocked(false)
  }

  const handleContinue = () => {
    router.push("/plagiarism/reduce")
  }

  const mockPaperContent = `
    <p class="paper-highlight">The impact of climate change on global ecosystems has been extensively studied in recent years.</p>
    <p>Research indicates that rising temperatures are affecting biodiversity across various biomes.</p>
    <p class="paper-highlight plagiarized">The Intergovernmental Panel on Climate Change (IPCC) has reported that human activities are the dominant cause of observed warming since the mid-20th century.</p>
    <p>Our analysis shows that marine ecosystems are particularly vulnerable to these changes.</p>
    <p class="paper-highlight plagiarized">Coral reefs, which support approximately 25% of all marine species, are experiencing unprecedented bleaching events due to ocean acidification and temperature increases.</p>
    <p>The data collected from our field studies suggests that adaptation strategies must be implemented immediately.</p>
  `

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Home
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
        <h1 className="text-3xl font-bold">Plagiarism Check</h1>
        <p className="text-muted-foreground">
          We analyze your paper to identify potential plagiarism and provide suggestions for improvement.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Analyzing your paper for plagiarism...</p>
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
              <h2 className="text-xl font-semibold mb-4">Paper Analysis</h2>
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: mockPaperContent }}
              ></div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30"></div>
                  <span className="text-sm">Highlighted text indicates potential plagiarism</span>
                </div>
              </div>
            </motion.div>

            {isPremiumLocked ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-lg border bg-card p-6 shadow-sm relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                  <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
                  <p className="text-center text-muted-foreground mb-4 max-w-md">
                    Your paper has more than 15% plagiarism. Unlock the full report to see detailed sources and
                    suggestions.
                  </p>
                  <Button onClick={handleUnlock}>Unlock Premium Report</Button>
                </div>

                <h2 className="text-xl font-semibold mb-4">Detailed Sources</h2>
                <div className="space-y-4 blur-sm">
                  <div className="rounded border p-3">
                    <h4 className="font-medium">Source 1: IPCC Climate Change Report (2021)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      "The Intergovernmental Panel on Climate Change (IPCC) has reported that human activities are the
                      dominant cause of observed warming since the mid-20th century."
                    </p>
                  </div>
                  <div className="rounded border p-3">
                    <h4 className="font-medium">Source 2: Marine Biology Journal (2020)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      "Coral reefs, which support approximately 25% of all marine species, are experiencing
                      unprecedented bleaching events due to ocean acidification and temperature increases."
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-lg border bg-card p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold mb-4">Detailed Sources</h2>
                <div className="space-y-4">
                  <div className="rounded border p-3">
                    <h4 className="font-medium">Source 1: IPCC Climate Change Report (2021)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      "The Intergovernmental Panel on Climate Change (IPCC) has reported that human activities are the
                      dominant cause of observed warming since the mid-20th century."
                    </p>
                    <div className="mt-2 pt-2 border-t">
                      <h5 className="text-sm font-medium">Suggested Citation:</h5>
                      <p className="text-xs text-muted-foreground">
                        IPCC, 2021: Climate Change 2021: The Physical Science Basis. Cambridge University Press,
                        Cambridge, United Kingdom and New York, NY, USA.
                      </p>
                    </div>
                  </div>
                  <div className="rounded border p-3">
                    <h4 className="font-medium">Source 2: Marine Biology Journal (2020)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      "Coral reefs, which support approximately 25% of all marine species, are experiencing
                      unprecedented bleaching events due to ocean acidification and temperature increases."
                    </p>
                    <div className="mt-2 pt-2 border-t">
                      <h5 className="text-sm font-medium">Suggested Citation:</h5>
                      <p className="text-xs text-muted-foreground">
                        Johnson, A. et al., 2020: Impact of Climate Change on Coral Reef Ecosystems. Marine Biology
                        Journal, 45(2), 112-128.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4">Plagiarism Score</h2>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
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
                      strokeDasharray={`${plagiarismScore * 283} 283`}
                      className={`${plagiarismScore > 0.15 ? "text-red-500" : "text-green-500"}`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{formatPercentage(plagiarismScore)}</span>
                  </div>
                </div>
                <p className="text-center text-muted-foreground">
                  {plagiarismScore > 0.15
                    ? "Your paper has significant plagiarism issues that need to be addressed."
                    : "Your paper has minimal plagiarism issues."}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
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
                    className="h-4 w-4 text-red-500 mt-0.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  <span>
                    {plagiarismScore > 0.15
                      ? `${formatPercentage(plagiarismScore)} of your paper contains plagiarized content`
                      : `Only ${formatPercentage(plagiarismScore)} of your paper contains potential plagiarism`}
                  </span>
                </li>
                <li className="flex items-start gap-2">
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
                    className="h-4 w-4 text-yellow-500 mt-0.5"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>2 sources identified in your paper</span>
                </li>
                <li className="flex items-start gap-2">
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
                    className="h-4 w-4 text-blue-500 mt-0.5"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span>AI-suggested citations available</span>
                </li>
              </ul>
            </motion.div>

            <div className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Link>
              </Button>
              <Button onClick={handleContinue}>
                Reduce Plagiarism <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

