"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, BarChart2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TrustScoreData {
  trustScore: number
  plagiarismScore: number
  aiAnalysis: {
    aiProbability: number
    humanWrittenProbability: number
    academicQuality: number
    methodologyScore: number
    citationQuality: number
    originalityScore: number
    confidence: number
    classification: string
    analysis: string
    flags: string[]
    recommendations: string[]
  }
  breakdown: {
    overall: {
      score: number
      level: string
      confidence: number
    }
    components: {
      plagiarism: {
        score: number
        weight: number
        contribution: number
        description: string
      }
      aiDetection: {
        score: number
        weight: number
        contribution: number
        description: string
      }
      academicQuality: {
        score: number
        weight: number
        contribution: number
        description: string
      }
      methodology: {
        score: number
        weight: number
        contribution: number
        description: string
      }
      citations: {
        score: number
        weight: number
        contribution: number
        description: string
      }
    }
  }
  recommendations: string[]
  timestamp: string
  fileId: string
}

interface TrustScoreGeneratorProps {
  documentId: string
  documentText?: string
  plagiarismResult?: any
  onComplete: (score: number, data: TrustScoreData) => void
}

export function TrustScoreGenerator({ documentId, documentText, plagiarismResult, onComplete }: TrustScoreGeneratorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [trustScoreData, setTrustScoreData] = useState<TrustScoreData | null>(null)
  const [showDetails, setShowDetails] = useState(false)
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
    setCurrentStep("Fetching trust score from backend...")

    try {
      // Simulate progress for UI
      await simulateProgress("Fetching trust score from backend...", 0, 100)

      // Get the actual document content and plagiarism results from workflow state
      // This should be passed as props or retrieved from context
      if (!documentText) {
        throw new Error('Document text is required for trust score calculation');
      }

      // Fetch trust score from backend with real data
      const response = await fetch(`http://localhost:5000/api/trust-score/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          textContent: documentText,
          plagiarismResults: plagiarismResult,
          fileId: documentId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trust score')
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch trust score')
      }

      setTrustScoreData(data.data)
      setIsAnalyzing(false)

      toast({
        title: "Trust Score Generated",
        description: `Your document received a trust score of ${data.data.trustScore}%`,
      })
    } catch (error) {
      console.error('Trust score fetch error:', error)
      setIsAnalyzing(false)
      toast({
        title: "Error",
        description: "Failed to fetch trust score. Please try again.",
        variant: "destructive",
      })
    }
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
    if (trustScoreData) {
      onComplete(trustScoreData.trustScore, trustScoreData)
    }
  }

  const getTrustLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'text-green-500'
      case 'moderate': return 'text-yellow-500'
      case 'low': return 'text-orange-500'
      case 'very low': return 'text-red-500'
      default: return 'text-gray-500'
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
        ) : trustScoreData ? (
          <div className="space-y-6">
            {/* Main Trust Score Display */}
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-6xl font-bold text-green-500 mb-2">{trustScoreData.trustScore}%</div>
              <div className="text-center">
                <p className="text-lg font-medium mb-1">Document Trust Score</p>
                <p className={`text-sm font-medium ${getTrustLevelColor(trustScoreData.breakdown.overall.level)}`}>
                  {trustScoreData.breakdown.overall.level} Trust Level
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Confidence: {Math.round(trustScoreData.breakdown.overall.confidence * 100)}%
                </p>
              </div>
            </div>

            {/* AI Analysis Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2">AI Analysis Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Classification:</span>
                  <span className="ml-2 font-medium capitalize">{trustScoreData.aiAnalysis.classification.replace('-', ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-500">AI Probability:</span>
                  <span className="ml-2 font-medium">{Math.round(trustScoreData.aiAnalysis.aiProbability * 100)}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Human Written:</span>
                  <span className="ml-2 font-medium">{Math.round(trustScoreData.aiAnalysis.humanWrittenProbability * 100)}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Academic Quality:</span>
                  <span className="ml-2 font-medium">{Math.round(trustScoreData.aiAnalysis.academicQuality * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Component Scores */}
            <div className="space-y-3">
              <h4 className="font-semibold">Component Scores</h4>
              <div className="space-y-2">
                {Object.entries(trustScoreData.breakdown.components).map(([key, component]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${component.score * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{Math.round(component.score * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {trustScoreData.recommendations && trustScoreData.recommendations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Recommendations</h4>
                <div className="space-y-2">
                  {trustScoreData.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Analysis */}
            {trustScoreData.aiAnalysis.analysis && (
              <div className="space-y-3">
                <h4 className="font-semibold">Detailed Analysis</h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{trustScoreData.aiAnalysis.analysis}</p>
                </div>
              </div>
            )}

            {/* Toggle Details Button */}
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm"
              >
                {showDetails ? 'Hide' : 'Show'} Detailed Breakdown
              </Button>
            </div>

            {/* Detailed Breakdown */}
            {showDetails && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-semibold">Detailed Breakdown</h4>
                <div className="space-y-3">
                  {Object.entries(trustScoreData.breakdown.components).map(([key, component]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-sm text-gray-500">Weight: {Math.round(component.weight * 100)}%</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Score: {Math.round(component.score * 100)}%</span>
                        <span>Contribution: {Math.round(component.contribution * 100)}%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{component.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
        {trustScoreData && (
          <Button onClick={handleComplete}>
            <BarChart2 className="h-4 w-4 mr-2" />
            Continue to Next Step
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
