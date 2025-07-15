"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, BarChart2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TrustScoreGeneratorProps {
  documentId: string
  onComplete: (score?: number) => void
}

export function TrustScoreGenerator({ documentId, onComplete }: TrustScoreGeneratorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [trustScore, setTrustScore] = useState<number | null>(null)
  const { toast } = useToast()

  // Auto-start analysis when component mounts
  useEffect(() => {
    if (documentId) {
      generateTrustScore()
    }
  }, [documentId])

  const generateTrustScore = async () => {
    setIsAnalyzing(true)
    setProgress(0)
    setCurrentStep("Initializing analysis...")

    // Simulate the analysis process
    await simulateProgress("Checking document format...", 0, 10)
    await simulateProgress("Analyzing content originality...", 10, 30)
    await simulateProgress("Evaluating methodology...", 30, 50)
    await simulateProgress("Verifying citations...", 50, 70)
    await simulateProgress("Checking internal consistency...", 70, 85)
    await simulateProgress("Generating final trust score...", 85, 100)

    // Generate a score between 85-95 for demonstration
    const score = Math.floor(Math.random() * 10) + 85
    setTrustScore(score)
    setIsAnalyzing(false)

    toast({
      title: "Trust Score Generated",
      description: `Your document received a trust score of ${score}`,
    })
  }

  const simulateProgress = async (step: string, startProgress: number, endProgress: number) => {
    setCurrentStep(step)

    const increment = (endProgress - startProgress) / 10
    for (let i = 0; i <= 10; i++) {
      setProgress(Math.floor(startProgress + increment * i))
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }

  const handleComplete = () => {
    if (trustScore) {
      onComplete(trustScore)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" /> Trust Score Generator
        </CardTitle>
        <CardDescription>
          Analyzing document to generate a trust score based on originality, methodology, citations, and consistency
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAnalyzing ? (
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>{currentStep}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : trustScore ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-6xl font-bold text-green-500 mb-4">{trustScore}</div>
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Document Trust Score</p>
              <p className="text-sm text-gray-400">
                Your document has been analyzed and assigned a trust score of {trustScore}. This score will be stored on
                the blockchain for verification.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-8">
            <Button onClick={generateTrustScore} className="w-64">
              <Shield className="h-4 w-4 mr-2" />
              Generate Trust Score
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {trustScore && (
          <Button onClick={handleComplete}>
            <BarChart2 className="h-4 w-4 mr-2" />
            Continue to Next Step
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
