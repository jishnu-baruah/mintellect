"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { ArrowRight, FileUp, Shield, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatPercentage, getTrustScoreClass } from "@/lib/utils"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [trustScore, setTrustScore] = useState<number | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
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
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Upload successful",
        description: "Your research paper has been uploaded",
      })

      // Start analysis
      setIsUploading(false)
      setIsAnalyzing(true)

      // Simulate analysis
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate random trust score between 0.4 and 0.95
      const score = 0.4 + Math.random() * 0.55
      setTrustScore(score)
      setIsAnalyzing(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
      })
      setIsUploading(false)
    }
  }

  const handleContinue = () => {
    if (trustScore !== null) {
      // Store the trust score in session storage to use across pages
      sessionStorage.setItem("trustScore", trustScore.toString())
      router.push("/plagiarism")
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
              />
            </div>

            {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}

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

