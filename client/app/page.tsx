"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { ArrowRight, FileUp, Shield, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatPercentage, getTrustScoreClass } from "@/lib/utils"
import { useOCAuth } from "@opencampus/ocid-connect-js"
import LoginButton from "@/components/LoginButton"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [trustScore, setTrustScore] = useState<number | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const [originalFileName, setOriginalFileName] = useState<string | null>(null)
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null)
  const [isEligible, setIsEligible] = useState<boolean | null>(null)
  const [eligibilityData, setEligibilityData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { authState, ocAuth } = useOCAuth()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (authState.error) {
      return <div>Error: {authState.error.message}</div>
    }

    // Add a loading state
    if (authState.isLoading) {
      return <div>Loading...</div>
    }

    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      // Reset previous analysis results
      setEligibilityData(null)
      setTrustScore(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a research paper to upload",
      })
      return
    }

    setIsUploading(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("pdf", file)

      // Store original filename
      setOriginalFileName(file.name)

      // First simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsUploading(false)
      setIsAnalyzing(true)

      // Use environment variable or default to relative path for API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
      const response = await fetch(`${apiUrl}/api/analyze-pdf`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Unknown error occurred")
      }

      // Store file path for plagiarism check
      setCurrentFilePath(data.data.fileName)

      // Set eligibility status
      setIsEligible(data.data.eligibility.eligible)
      setEligibilityData(data.data.eligibility)

      // Generate trust score based on eligibility
      const score = data.data.eligibility.eligible ? 0.7 + Math.random() * 0.25 : 0.4 + Math.random() * 0.3
      setTrustScore(score)

      toast({
        title: "Analysis complete",
        description: data.data.eligibility.eligible
          ? "Your research paper is eligible for verification"
          : "Your research paper needs improvements before verification",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: `An error occurred during analysis: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
      setIsUploading(false)
      setIsAnalyzing(false)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleContinue = () => {
    if (trustScore !== null && isEligible) {
      // Store the trust score in session storage to use across pages
      sessionStorage.setItem("trustScore", trustScore.toString())
      if (currentFilePath) {
        sessionStorage.setItem("currentFilePath", currentFilePath)
      }
      router.push("/plagiarism")
    } else if (trustScore !== null && !isEligible) {
      toast({
        variant: "destructive",
        title: "Not eligible",
        description: "Your paper needs improvements before proceeding to plagiarism check",
      })
    }
  }

  return (
    <div className="container max-w-6xl py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center space-y-4 mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Verify Your Research with <span className="gradient-text">Mintellect</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Upload your research paper to check for plagiarism, get a trust score, and verify your work on the blockchain.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Upload Your Research Paper</h2>
            <p className="text-muted-foreground">We accept PDF, DOCX, and TXT files up to 20MB in size.</p>
          </div>

          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="paper" className="text-white">
                Research Paper
              </Label>
              <Input
                id="paper"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                disabled={isUploading || isAnalyzing}
                className="bg-accent text-accent-foreground"
                ref={fileInputRef}
              />
            </div>

            {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}

            {isAnalyzing && (
              <div className="mt-4">
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 animate-pulse" style={{ width: "100%" }}></div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Analyzing document...</p>
              </div>
            )}

            {eligibilityData && (
              <div className="mt-4 p-4 border rounded-md">
                <h3 className="text-lg font-medium mb-2">Analysis Results</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Status:</span>
                  <span
                    className={`text-sm font-medium ${eligibilityData.eligible ? "text-green-500" : "text-red-500"}`}
                  >
                    {eligibilityData.eligible ? "Eligible" : "Not Eligible"}
                  </span>
                </div>

                {eligibilityData.level0 && (
                  <div className="mb-2">
                    <h4 className="text-sm font-medium">Level 0 Issues:</h4>
                    <ul className="list-disc list-inside text-xs text-muted-foreground">
                      {eligibilityData.level0.issues?.map((issue: string, i: number) => (
                        <li key={`level0-${i}`}>{issue}</li>
                      ))}
                      {eligibilityData.level0.issues?.length === 0 && <li>No issues found</li>}
                    </ul>
                  </div>
                )}

                {eligibilityData.level1 && (
                  <div className="mb-2">
                    <h4 className="text-sm font-medium">Level 1 Issues:</h4>
                    <ul className="list-disc list-inside text-xs text-muted-foreground">
                      {eligibilityData.level1.issues?.map((issue: string, i: number) => (
                        <li key={`level1-${i}`}>{issue}</li>
                      ))}
                      {eligibilityData.level1.issues?.length === 0 && <li>No issues found</li>}
                    </ul>
                  </div>
                )}

                {eligibilityData.level2 && (
                  <div className="mb-2">
                    <h4 className="text-sm font-medium">Missing Sections:</h4>
                    <ul className="list-disc list-inside text-xs text-muted-foreground">
                      {eligibilityData.level2.missingSections?.map((section: string, i: number) => (
                        <li key={`level2-${i}`}>{section}</li>
                      ))}
                      {eligibilityData.level2.missingSections?.length === 0 && <li>No missing sections</li>}
                    </ul>
                  </div>
                )}

                {eligibilityData.metadata && (
                  <div>
                    <h4 className="text-sm font-medium">Document Metadata:</h4>
                    <div className="text-xs text-muted-foreground">
                      <p>Pages: {eligibilityData.metadata.pages || "N/A"}</p>
                      <p>Word Count: {eligibilityData.metadata.wordCount || "N/A"}</p>
                      {eligibilityData.metadata.title && <p>Title: {eligibilityData.metadata.title}</p>}
                      {eligibilityData.metadata.authors && (
                        <p>Authors: {eligibilityData.metadata.authors.join(", ")}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!file || isUploading || isAnalyzing || trustScore !== null}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUploading ? (
                "Uploading..."
              ) : isAnalyzing ? (
                "Analyzing..."
              ) : trustScore !== null ? (
                "Analyzed"
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Upload Paper
                </>
              )}
            </Button>
          </div>

          {trustScore !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className={`trust-score-ring ${getTrustScoreClass(trustScore)} p-6 rounded-full`}>
                  <div className="text-center">
                    <span className="text-2xl font-bold">{formatPercentage(trustScore)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Trust Score</h3>
                  <p className="text-sm text-muted-foreground">
                    {trustScore >= 0.8
                      ? "Excellent! Your paper has a high trust score."
                      : trustScore >= 0.5
                        ? "Good. Your paper has a moderate trust score."
                        : "Your paper needs improvement to increase its trust score."}
                  </p>
                </div>
              </div>

              <Button onClick={handleContinue} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                Continue to Plagiarism Check <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          <div className="rounded-lg border border-border/50 bg-accent/50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">How It Works</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="rounded-full bg-blue-500/20 p-2">
                  <FileUp className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium">Upload</h4>
                  <p className="text-sm text-muted-foreground">Upload your research paper for analysis</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="rounded-full bg-blue-500/20 p-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium">Analyze</h4>
                  <p className="text-sm text-muted-foreground">
                    Our AI analyzes your paper for plagiarism and generates a trust score
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="rounded-full bg-blue-500/20 p-2">
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
                    className="h-5 w-5 text-blue-500"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Verify</h4>
                  <p className="text-sm text-muted-foreground">
                    Get your paper verified on the blockchain with an NFT certificate
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-border/50 bg-accent/50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Benefits</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
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
                  className="h-4 w-4 text-blue-500"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Detect and reduce plagiarism in your research</span>
              </li>
              <li className="flex items-center gap-2">
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
                  className="h-4 w-4 text-blue-500"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Get AI-suggested citations to improve your paper</span>
              </li>
              <li className="flex items-center gap-2">
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
                  className="h-4 w-4 text-blue-500"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Verify your work with blockchain technology</span>
              </li>
              <li className="flex items-center gap-2">
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
                  className="h-4 w-4 text-blue-500"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Increase credibility with human review verification</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

