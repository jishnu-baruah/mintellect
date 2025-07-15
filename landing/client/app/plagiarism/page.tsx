"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle, Info, FileText } from "lucide-react"
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

export default function PlagiarismPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isPremiumLocked, setIsPremiumLocked] = useState(false)
  const [trustScore, setTrustScore] = useState<number | null>(null)
  const [plagiarismResults, setPlagiarismResults] = useState<PlagiarismResults | null>(null)
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null)
  const [pdfContent, setPdfContent] = useState<PdfContentResponse | null>(null)
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const storedTrustScore = sessionStorage.getItem("trustScore")
    if (storedTrustScore) setTrustScore(Number.parseFloat(storedTrustScore))

    const storedFilePath = sessionStorage.getItem("currentFilePath")
    if (storedFilePath) {
      setCurrentFilePath(storedFilePath)
      checkPlagiarism(storedFilePath)
      fetchPaperContent(storedFilePath)
    } else {
      toast({
        variant: "destructive",
        title: "No file available",
        description: "Please upload a file first",
      })
      setIsLoading(false)
    }
  }, [])

  const fetchPaperContent = async (filePath: string) => {
    setIsLoadingContent(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
      const response = await fetch(`${apiUrl}/api/pdf-content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath }),
      })

      if (!response.ok) throw new Error(`Failed to fetch content: ${response.status}`)
      
      const data = await response.json()
      if (data.success) {
        setPdfContent(data.data)
        sessionStorage.setItem("pdfContent", JSON.stringify(data.data))
        const sections = Object.keys(data.data.formatted?.sections || {})
        if (sections.length > 0) setActiveSection(sections[0])
      }
    } catch (error) {
      console.error("Error fetching content:", error)
      toast({ variant: "destructive", title: "Error", description: "Failed to load content" })
    } finally {
      setIsLoadingContent(false)
    }
  }

  const checkPlagiarism = async (filePath: string) => {
    setIsLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
      const response = await fetch(`${apiUrl}/api/check-plagiarism`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath }),
      })

      if (!response.ok) throw new Error(`Plagiarism check failed: ${response.status}`)
      
      const data = await response.json()
      if (data.success) {
        setPlagiarismResults(data.data)
        sessionStorage.setItem("plagiarismResults", JSON.stringify(data.data))
        if (data.data.summary.overallScore < 85) setIsPremiumLocked(true)
      }
    } catch (error) {
      console.error("Plagiarism check error:", error)
      toast({
        variant: "destructive",
        title: "Check failed",
        description: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = () => router.push("/plagiarism/reduce")

  const getRiskIcon = (score: number) => {
    if (score < 70) return <AlertCircle className="h-5 w-5" />
    if (score < 85) return <Info className="h-5 w-5" />
    return <CheckCircle className="h-5 w-5" />
  }

  const highlightPlagiarizedContent = (text: string) => {
    if (!plagiarismResults || !text) return text
    return plagiarismResults.detailedResults
      .flatMap(s => s.examples)
      .reduce((acc, example) => 
        acc.replace(example.sentence, `<span class="bg-red-100 dark:bg-red-900/30">${example.sentence}</span>`),
        text
      )
  }

  const renderSectionContent = () => {
    if (!pdfContent?.formatted || !activeSection) 
      return <div className="p-4 text-muted-foreground">No content available</div>

    const sectionContent = pdfContent.formatted.sections[activeSection]
    if (!sectionContent) 
      return <div className="p-4 text-muted-foreground">This section is empty</div>

    return (
      <div className="prose dark:prose-invert max-w-none">
        {sectionContent.split("\n\n").map((paragraph, index) => (
          <p
            key={index}
            className="mb-4 last:mb-0 text-justify hover:bg-accent/5 transition-colors p-2 rounded-lg"
            dangerouslySetInnerHTML={{ __html: highlightPlagiarizedContent(paragraph) }}
          />
        ))}
      </div>
    )
  }

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

      {isLoading || isLoadingContent ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">
            {isLoading ? "Analyzing..." : "Loading content..."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-lg border bg-card shadow-sm"
            >
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-semibold">Paper Analysis</h2>
                {pdfContent?.metadata && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>{pdfContent.metadata.pageCount} pages</span>
                  </div>
                )}
              </div>

              {pdfContent?.formatted && (
                <div className="p-6  overflow-scroll" style={{height: "400px"}}>
                  {pdfContent.formatted.title && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-foreground">
                        {pdfContent.formatted.title}
                      </h3>
                      {pdfContent.formatted.authors && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {pdfContent.formatted.authors}
                        </p>
                      )}
                    </div>
                  )}

                  {Object.keys(pdfContent.formatted.sections).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.keys(pdfContent.formatted.sections).map((section) => (
                        <Button
                          key={section}
                          variant={activeSection === section ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveSection(section)}
                          className="rounded-full px-4 transition-all duration-200 hover:scale-105"
                        >
                          {section.charAt(0).toUpperCase() + section.slice(1)}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="h-[500px] w-full rounded-xl border dark:border-gray-800 bg-background overflow-hidden">
                    <div className="h-full overflow-y-auto scroll-smooth p-4">
                      {renderSectionContent()}
                      <style jsx global>{`
                        ::-webkit-scrollbar {
                          width: 8px;
                          height: 8px;
                        }
                        ::-webkit-scrollbar-track {
                          background: rgba(0, 0, 0, 0.05);
                          border-radius: 10px;
                        }
                        ::-webkit-scrollbar-thumb {
                          background: rgba(0, 0, 0, 0.2);
                          border-radius: 10px;
                          border: 2px solid transparent;
                          background-clip: padding-box;
                        }
                        ::-webkit-scrollbar-thumb:hover {
                          background: rgba(0, 0, 0, 0.3);
                        }
                        .dark ::-webkit-scrollbar-track {
                          background: rgba(255, 255, 255, 0.05);
                        }
                        .dark ::-webkit-scrollbar-thumb {
                          background: rgba(255, 255, 255, 0.2);
                        }
                      `}</style>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t dark:border-gray-800">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 rounded-sm" />
                      <span className="text-muted-foreground">Highlighted text indicates potential plagiarism</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4">Plagiarism Score</h2>
              {plagiarismResults ? (
                <>
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
                        strokeDasharray={`${(100 - plagiarismResults.summary.overallScore) * 2.83} 283`}
                        className={`${plagiarismResults.summary.overallScore < 85 ? "text-red-500" : "text-green-500"}`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">{plagiarismResults.summary.overallScore}%</span>
                    </div>
                  </div>
                  <p className="text-center text-muted-foreground">
                    {plagiarismResults.summary.overallScore < 85
                      ? "Needs improvement"
                      : "Good originality score"}
                  </p>
                </>
              ) : (
                <p className="text-center text-muted-foreground">No data available</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              {plagiarismResults ? (
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    {getRiskIcon(plagiarismResults.summary.overallScore)}
                    <span>
                      {plagiarismResults.summary.overallScore < 85
                        ? `${100 - plagiarismResults.summary.overallScore}% potential matches`
                        : `Only ${100 - plagiarismResults.summary.overallScore}% matches found`}
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
                    <span>
                      {plagiarismResults.detailedResults.reduce((t, s) => t + s.flaggedCount, 0)} sources found
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
                      className="h-4 w-4 text-blue-500 mt-0.5"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span>AI citation suggestions available</span>
                  </li>
                </ul>
              ) : (
                <p className="text-center text-muted-foreground">No summary data</p>
              )}
            </motion.div>

            <div className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Link>
              </Button>
              <Button onClick={handleContinue} disabled={!plagiarismResults}>
                Reduce Plagiarism <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}