"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Award, Download, FileText, Upload } from "lucide-react"
import Link from "next/link"
import { formatPercentage, getTrustScoreClass } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const [trustScore, setTrustScore] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Get trust score from session storage
    const storedTrustScore = sessionStorage.getItem("trustScore")
    if (storedTrustScore) {
      setTrustScore(Number.parseFloat(storedTrustScore))
    } else {
      // If no trust score, generate a random one
      const score = 0.5 + Math.random() * 0.4
      setTrustScore(score)
    }
  }, [])

  const handleDownloadCertificate = () => {
    toast({
      title: "Certificate Downloaded",
      description: "Your NFT certificate has been downloaded",
    })
  }

  const papers = [
    {
      title: "Impact of Climate Change on Global Ecosystems",
      date: "May 15, 2023",
      status: "Verified",
      score: trustScore || 0.85,
      hasNft: true,
    },
    {
      title: "Machine Learning Applications in Healthcare",
      date: "March 3, 2023",
      status: "Verified",
      score: 0.78,
      hasNft: true,
    },
    {
      title: "Quantum Computing: Current Challenges",
      date: "January 20, 2023",
      status: "In Review",
      score: 0.62,
      hasNft: false,
    },
  ]

  return (
    <div className="container max-w-6xl py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 mb-8"
      >
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <p className="text-muted-foreground">Manage your research papers and view verification status.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Papers</h2>
              <Button asChild>
                <Link href="/">
                  <Upload className="mr-2 h-4 w-4" /> Upload New Paper
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {papers.map((paper, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{paper.title}</CardTitle>
                      <Badge variant={paper.status === "Verified" ? "default" : "outline"}>{paper.status}</Badge>
                    </div>
                    <CardDescription>Uploaded on {paper.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Trust Score:</span>
                      <div
                        className={`trust-score-ring ${getTrustScoreClass(paper.score)} px-2 py-0.5 rounded-full text-xs font-medium`}
                      >
                        {formatPercentage(paper.score)}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/plagiarism">
                        <FileText className="mr-2 h-4 w-4" /> View Details
                      </Link>
                    </Button>
                    {paper.hasNft && (
                      <Button size="sm" onClick={handleDownloadCertificate}>
                        <Download className="mr-2 h-4 w-4" /> Certificate
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
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
            <h2 className="text-xl font-semibold mb-4">Statistics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Papers Uploaded</span>
                  <span className="text-sm font-medium">3</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "100%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Papers Verified</span>
                  <span className="text-sm font-medium">2</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "66.7%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">NFT Certificates</span>
                  <span className="text-sm font-medium">2</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "66.7%" }}></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">Latest Certificate</h2>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Impact of Climate Change</h3>
              <p className="text-center text-muted-foreground mb-4">Verified on May 15, 2023</p>
              <div className="bg-muted p-3 rounded-md font-mono text-xs w-full overflow-x-auto mb-4">
                <p>Token ID: 8294</p>
                <p className="mt-1">Contract: 0x3f9e8d7c6b5a4e3f2d1c0b9a8e7d6c5b</p>
              </div>
              <Button onClick={handleDownloadCertificate} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download Certificate
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

