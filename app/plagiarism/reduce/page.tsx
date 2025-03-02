"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, Copy, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatPercentage } from "@/lib/utils"

export default function PlagiarismReducePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [originalPlagiarismScore, setOriginalPlagiarismScore] = useState(0)
  const [newPlagiarismScore, setNewPlagiarismScore] = useState(0)
  const [trustScore, setTrustScore] = useState<number | null>(null)
  const [paperContent, setPaperContent] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Get trust score from session storage
    const storedTrustScore = sessionStorage.getItem("trustScore")
    if (storedTrustScore) {
      setTrustScore(Number.parseFloat(storedTrustScore))
    }

    // Set initial plagiarism score (from previous page)
    const initialScore = 0.05 + Math.random() * 0.25
    setOriginalPlagiarismScore(initialScore)

    // Set initial paper content
    setPaperContent(`The impact of climate change on global ecosystems has been extensively studied in recent years. Research indicates that rising temperatures are affecting biodiversity across various biomes.

The Intergovernmental Panel on Climate Change (IPCC) has reported that human activities are the dominant cause of observed warming since the mid-20th century.

Our analysis shows that marine ecosystems are particularly vulnerable to these changes. Coral reefs, which support approximately 25% of all marine species, are experiencing unprecedented bleaching events due to ocean acidification and temperature increases.

The data collected from our field studies suggests that adaptation strategies must be implemented immediately.`)

    // Set initial suggestions
    setSuggestions([
      "According to the IPCC (2021), human activities are the primary contributor to the observed warming trend since the mid-20th century.",
      "Research by Johnson et al. (2020) indicates that coral reefs, which provide habitat for roughly 25% of marine species, are undergoing severe bleaching due to increasing ocean temperatures and acidification.",
      "Our findings align with Smith (2019), who demonstrated that immediate implementation of adaptation strategies is crucial for ecosystem resilience.",
    ])
  }, [])

  const handleApplySuggestion = (suggestion: string) => {
    // Replace the plagiarized content with the suggested citation
    const newContent = paperContent.replace(
      /The Intergovernmental Panel on Climate Change $$IPCC$$ has reported that human activities are the dominant cause of observed warming since the mid-20th century\./,
      suggestion,
    )

    setPaperContent(newContent)

    // Calculate new plagiarism score (lower than original)
    const reducedScore = Math.max(0.03, originalPlagiarismScore * 0.6)
    setNewPlagiarismScore(reducedScore)

    toast({
      title: "Suggestion Applied",
      description: "The citation has been added to your paper",
    })
  }

  const handleCopySuggestion = (suggestion: string) => {
    navigator.clipboard.writeText(suggestion)
    toast({
      title: "Copied to Clipboard",
      description: "You can now paste the suggestion into your paper",
    })
  }

  const handleResubmit = () => {
    setIsLoading(true)

    // Simulate resubmission
    setTimeout(() => {
      // Update trust score (increase it)
      if (trustScore !== null) {
        const newTrustScore = Math.min(0.95, trustScore + 0.1)
        setTrustScore(newTrustScore)
        sessionStorage.setItem("trustScore", newTrustScore.toString())
      }

      setIsLoading(false)

      toast({
        title: "Paper Resubmitted",
        description: "Your paper has been updated with reduced plagiarism",
      })
    }, 2000)
  }

  const handleContinue = () => {
    router.push("/trust-score")
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <Link href="/plagiarism" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Plagiarism Check
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
        <h1 className="text-3xl font-bold">Reduce Plagiarism</h1>
        <p className="text-muted-foreground">
          Apply AI-suggested citations to reduce plagiarism in your paper and improve your trust score.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">Edit Your Paper</h2>
            <Textarea
              value={paperContent}
              onChange={(e) => setPaperContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />

            <div className="flex justify-end mt-4">
              <Button onClick={handleResubmit} disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Resubmitting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" /> Resubmit Paper
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">AI-Suggested Citations</h2>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="rounded border p-3">
                  <p className="text-sm mb-3">{suggestion}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopySuggestion(suggestion)}
                      className="flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApplySuggestion(suggestion)}
                      className="flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" /> Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">Plagiarism Reduction</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Original:</span>
                <span className="font-medium">{formatPercentage(originalPlagiarismScore)}</span>
              </div>

              {newPlagiarismScore > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">New:</span>
                  <span className="font-medium text-green-500">{formatPercentage(newPlagiarismScore)}</span>
                </div>
              )}

              {newPlagiarismScore > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Reduction:</span>
                  <span className="font-medium text-green-500">
                    {formatPercentage(originalPlagiarismScore - newPlagiarismScore)}
                  </span>
                </div>
              )}

              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: newPlagiarismScore > 0 ? `${(newPlagiarismScore / originalPlagiarismScore) * 100}%` : "100%",
                  }}
                ></div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/plagiarism">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Link>
            </Button>
            <Button onClick={handleContinue}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

