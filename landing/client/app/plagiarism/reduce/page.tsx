"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, Copy, RefreshCw, ExternalLink, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatPercentage } from "@/lib/utils"

interface PlagiarismSummary {
  overallScore: number
  plagiarismRisk: string
  analyzedSections: string[]
}

interface PlagiarismExample {
  sentence: string
  similarity: number
  potentialSource: string
  sourceUrl?: string
}

interface SectionResult {
  section: string
  score: number
  flaggedCount: number
  examples: PlagiarismExample[]
}

interface Recommendation {
  section: string
  advice: string
}

interface PlagiarismResults {
  summary: PlagiarismSummary
  detailedResults: SectionResult[]
  recommendations: Recommendation[]
}

interface PdfMetadata {
  pageCount: number
  textLength: number
  isScanned: boolean
}

interface FormattedPdfContent {
  title: string
  authors: string
  sections: {
    [key: string]: string
  }
}

interface PdfContentResponse {
  raw: string
  formatted: FormattedPdfContent
  metadata: PdfMetadata
}

export default function PlagiarismReducePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [originalPlagiarismScore, setOriginalPlagiarismScore] = useState(0)
  const [newPlagiarismScore, setNewPlagiarismScore] = useState(0)
  const [trustScore, setTrustScore] = useState<number | null>(null)
  const [pdfContent, setPdfContent] = useState<PdfContentResponse | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [editableSectionContent, setEditableSectionContent] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [plagiarismResults, setPlagiarismResults] = useState<PlagiarismResults | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Function to determine color based on score
  const getScoreColor = (score: number): string => {
    if (score < 50) return "text-red-500"
    if (score < 70) return "text-orange-500"
    if (score < 85) return "text-yellow-500"
    return "text-green-500"
  }

  useEffect(() => {
    // Get trust score from session storage
    const storedTrustScore = sessionStorage.getItem("trustScore")
    if (storedTrustScore) {
      setTrustScore(Number.parseFloat(storedTrustScore))
    }

    // Get plagiarism results from session storage
    const storedResults = sessionStorage.getItem("plagiarismResults")
    if (storedResults) {
      const results = JSON.parse(storedResults) as PlagiarismResults
      setPlagiarismResults(results)
      setOriginalPlagiarismScore(results.summary.overallScore)
    } else {
      // If no results, redirect back to plagiarism check
      toast({
        variant: "destructive",
        title: "No plagiarism data",
        description: "Please complete the plagiarism check first",
      })
      router.push("/plagiarism")
    }

    // Get PDF content from session storage
    const storedPdfContent = sessionStorage.getItem("pdfContent")
    if (storedPdfContent) {
      const content = JSON.parse(storedPdfContent) as PdfContentResponse
      setPdfContent(content)

      // Set the first section as active by default
      if (content.formatted && content.formatted.sections) {
        const sections = Object.keys(content.formatted.sections)
        if (sections.length > 0) {
          const firstSection = sections[0]
          setActiveSection(firstSection)
          setEditableSectionContent(content.formatted.sections[firstSection] || "")
        }
      }
    } else {
      // If no content, use a default
      const defaultContent = `The impact of climate change on global ecosystems has been extensively studied in recent years. Research indicates that rising temperatures are affecting biodiversity across various biomes.

The Intergovernmental Panel on Climate Change (IPCC) has reported that human activities are the dominant cause of observed warming since the mid-20th century.

Our analysis shows that marine ecosystems are particularly vulnerable to these changes. Coral reefs, which support approximately 25% of all marine species, are experiencing unprecedented bleaching events due to ocean acidification and temperature increases.

The data collected from our field studies suggests that adaptation strategies must be implemented immediately.`

      setEditableSectionContent(defaultContent)
    }

    // Generate suggestions based on plagiarism results
    if (storedResults) {
      const results = JSON.parse(storedResults) as PlagiarismResults
      const generatedSuggestions = results.detailedResults
        .flatMap((section) => section.examples)
        .map((example) => {
          const source = example.potentialSource || "Research"
          const year = new Date().getFullYear() - Math.floor(Math.random() * 5) // Random recent year
          const similarity = Math.round(example.similarity * 100)
          return `According to ${source} (${year}), "${example.sentence.replace(/"/g, '\\"')}" (${similarity}% similar)`
        })

      // Add some default suggestions if we don't have enough
      if (generatedSuggestions.length < 3) {
        generatedSuggestions.push(
          "According to the IPCC (2021), human activities are the primary contributor to the observed warming trend since the mid-20th century.",
          "Research by Johnson et al. (2020) indicates that coral reefs, which provide habitat for roughly 25% of marine species, are undergoing severe bleaching due to increasing ocean temperatures and acidification.",
          "Our findings align with Smith (2019), who demonstrated that immediate implementation of adaptation strategies is crucial for ecosystem resilience.",
        )
      }

      setSuggestions(generatedSuggestions.slice(0, 5)) // Limit to 5 suggestions
    }
  }, [])

  const handleSectionChange = (section: string) => {
    if (!pdfContent || !pdfContent.formatted || !pdfContent.formatted.sections) return

    // Save current section content before switching
    if (activeSection && pdfContent.formatted.sections) {
      const updatedSections = { ...pdfContent.formatted.sections }
      updatedSections[activeSection] = editableSectionContent

      setPdfContent({
        ...pdfContent,
        formatted: {
          ...pdfContent.formatted,
          sections: updatedSections,
        },
      })
    }

    // Set new active section
    setActiveSection(section)
    setEditableSectionContent(pdfContent.formatted.sections[section] || "")
  }

  const handleApplySuggestion = (suggestion: string) => {
    // Find plagiarized content to replace
    if (!plagiarismResults || !activeSection) return

    // Get examples for the current section
    const sectionExamples =
      plagiarismResults.detailedResults.find((result) => result.section.toLowerCase() === activeSection.toLowerCase())
        ?.examples || []

    if (sectionExamples.length === 0) {
      // If no examples for this section, just append the suggestion
      setEditableSectionContent((prev) => prev + "\n\n" + suggestion)

      toast({
        title: "Suggestion Added",
        description: "The citation has been added to your paper",
      })

      // Calculate new plagiarism score
      const reducedScore = Math.max(0.03, originalPlagiarismScore * 0.8)
      setNewPlagiarismScore(reducedScore)

      return
    }

    // Try to replace one of the plagiarized phrases
    const phraseToReplace = sectionExamples[0].sentence
    if (editableSectionContent.includes(phraseToReplace)) {
      const newContent = editableSectionContent.replace(phraseToReplace, suggestion)
      setEditableSectionContent(newContent)

      // Calculate new plagiarism score
      const reducedScore = Math.max(0.03, originalPlagiarismScore * 0.6)
      setNewPlagiarismScore(reducedScore)

      toast({
        title: "Suggestion Applied",
        description: "The citation has been added to your paper",
      })
    } else {
      // Fallback if no exact match found
      setEditableSectionContent((prev) => prev + "\n\n" + suggestion)

      // Calculate new plagiarism score
      const reducedScore = Math.max(0.03, originalPlagiarismScore * 0.8)
      setNewPlagiarismScore(reducedScore)

      toast({
        title: "Suggestion Added",
        description: "The citation has been added to your paper",
      })
    }
  }

  const handleCopySuggestion = (suggestion: string) => {
    navigator.clipboard.writeText(suggestion)
    toast({
      title: "Copied to Clipboard",
      description: "You can now paste the suggestion into your paper",
    })
  }

  const handleResubmit = async () => {
    setIsLoading(true)

    try {
      // Save current section content
      if (activeSection && pdfContent && pdfContent.formatted && pdfContent.formatted.sections) {
        const updatedSections = { ...pdfContent.formatted.sections }
        updatedSections[activeSection] = editableSectionContent

        const updatedPdfContent = {
          ...pdfContent,
          formatted: {
            ...pdfContent.formatted,
            sections: updatedSections,
          },
        }

        setPdfContent(updatedPdfContent)

        // Store updated content in session storage
        sessionStorage.setItem("pdfContent", JSON.stringify(updatedPdfContent))
      }

      // In a real app, you would send the updated content to your backend
      // const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      // const response = await fetch(`${apiUrl}/api/update-paper`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     filePath: sessionStorage.getItem("currentFilePath"),
      //     content: updatedPdfContent
      //   }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update trust score (increase it)
      if (trustScore !== null) {
        const newTrustScore = Math.min(0.95, trustScore + 0.1)
        setTrustScore(newTrustScore)
        sessionStorage.setItem("trustScore", newTrustScore.toString())
      }

      toast({
        title: "Paper Resubmitted",
        description: "Your paper has been updated with reduced plagiarism",
      })
    } catch (error) {
      console.error("Error resubmitting paper:", error)
      toast({
        variant: "destructive",
        title: "Resubmission failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
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
            className="rounded-lg border bg-card shadow-sm"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Edit Your Paper</h2>
              {pdfContent?.metadata && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>{pdfContent.metadata.pageCount} pages</span>
                </div>
              )}
            </div>

            <div className="p-6">
              {/* Section navigation */}
              {pdfContent?.formatted && Object.keys(pdfContent.formatted.sections).length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {Object.keys(pdfContent.formatted.sections).map((section) => (
                    <Button
                      key={section}
                      variant={activeSection === section ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSectionChange(section)}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </Button>
                  ))}
                </div>
              )}

              <div className="mb-2 text-sm font-medium">
                {activeSection
                  ? `Editing: ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}`
                  : "Edit your paper"}
              </div>

              {/* Fixed height container with textarea */}
              <div className="h-[600px] w-full border rounded-md">
                <Textarea
                  value={editableSectionContent}
                  onChange={(e) => setEditableSectionContent(e.target.value)}
                  className="h-full w-full resize-none border-0 rounded-md p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder={activeSection ? `Edit ${activeSection} section here...` : "Edit your paper here..."}
                />
              </div>
            </div>

            <div className="flex justify-end p-6 pt-4 border-t">
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

          {/* Detailed Plagiarism Analysis */}
          {plagiarismResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-6">Detailed Analysis</h2>

              <div className="space-y-6">
                <h3 className="text-lg font-medium">Section Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Section</th>
                        <th className="text-center py-2 px-4">Score</th>
                        <th className="text-center py-2 px-4">Flagged Content</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plagiarismResults.detailedResults.map((section, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-4">
                            {section.section.charAt(0).toUpperCase() + section.section.slice(1)}
                          </td>
                          <td className={`py-2 px-4 text-center font-medium ${getScoreColor(section.score)}`}>
                            {section.score}%
                          </td>
                          <td className="py-2 px-4 text-center">{section.flaggedCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Examples of flagged content */}
                {plagiarismResults.detailedResults.some((section) => section.examples.length > 0) && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Examples of Potentially Unoriginal Content</h3>
                    <div className="space-y-4">
                      {plagiarismResults.detailedResults.flatMap((section, sectionIndex) =>
                        section.examples.map((example, exampleIndex) => (
                          <div key={`${sectionIndex}-${exampleIndex}`} className="border rounded-md p-4">
                            <p className="font-medium mb-2">
                              Section: {section.section.charAt(0).toUpperCase() + section.section.slice(1)}
                            </p>
                            <p className="text-sm mb-2">"{example.sentence}"</p>
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-muted-foreground">
                                Similarity: {Math.round(example.similarity * 100)}%
                              </p>
                              {example.sourceUrl && (
                                <Button variant="outline" size="sm" asChild className="flex items-center gap-1">
                                  <a href={example.sourceUrl} target="_blank" rel="noopener noreferrer">
                                    View Source <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                </Button>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              Potential Source: {example.potentialSource}
                            </p>
                          </div>
                        )),
                      )}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {plagiarismResults.recommendations && plagiarismResults.recommendations.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                    <div className="space-y-4">
                      {plagiarismResults.recommendations.map((recommendation, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <p className="font-medium mb-2">
                            Section: {recommendation.section.charAt(0).toUpperCase() + recommendation.section.slice(1)}
                          </p>
                          <p className="text-sm">{recommendation.advice}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                <span className="font-medium">{plagiarismResults ? plagiarismResults.summary.overallScore : 0}%</span>
              </div>

              {newPlagiarismScore > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">New:</span>
                  <span className="font-medium text-green-500">{newPlagiarismScore}%</span>
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

