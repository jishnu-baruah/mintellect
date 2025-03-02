"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Award, CheckCircle, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatPercentage } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ReviewPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [trustScore, setTrustScore] = useState<number | null>(null)
  const [isAssigned, setIsAssigned] = useState(false)
  const [isReviewed, setIsReviewed] = useState(false)
  const [isMinted, setIsMinted] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

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

  const handleAssign = () => {
    setIsLoading(true)

    // Simulate assignment
    setTimeout(() => {
      setIsAssigned(true)
      setIsLoading(false)

      toast({
        title: "Paper Assigned",
        description: "Your paper has been assigned to reviewers",
      })
    }, 1500)
  }

  const handleReview = () => {
    setIsLoading(true)

    // Simulate review
    setTimeout(() => {
      setIsReviewed(true)
      setIsLoading(false)

      // Increase trust score after human review
      if (trustScore !== null) {
        const newTrustScore = Math.min(0.95, trustScore + 0.05)
        setTrustScore(newTrustScore)
        sessionStorage.setItem("trustScore", newTrustScore.toString())
      }

      toast({
        title: "Review Complete",
        description: "Your paper has been reviewed by our experts",
      })
    }, 2000)
  }

  const handleMint = () => {
    setIsLoading(true)

    // Simulate NFT minting
    setTimeout(() => {
      setIsMinted(true)
      setIsLoading(false)

      toast({
        title: "NFT Minted",
        description: "Your paper has been verified and an NFT certificate has been minted",
      })
    }, 2500)
  }

  const handleComplete = () => {
    router.push("/dashboard")
  }

  const reviewers = [
    {
      name: "Dr. Sarah Johnson",
      role: "AI Ethics Researcher",
      avatar: "/placeholder-user.jpg",
      institution: "MIT",
      status: isAssigned ? "Reviewing" : "Available",
    },
    {
      name: "Prof. Michael Chen",
      role: "Computer Science",
      avatar: "/placeholder-user.jpg",
      institution: "Stanford",
      status: isAssigned ? "Reviewing" : "Available",
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Data Science",
      avatar: "/placeholder-user.jpg",
      institution: "Berkeley",
      status: isAssigned ? "Reviewing" : "Available",
    },
  ]

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <Link href="/trust-score" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Trust Score
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
        <h1 className="text-3xl font-bold">Human Review Panel</h1>
        <p className="text-muted-foreground">
          Assign your paper to human reviewers for final verification and mint an NFT certificate.
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
            <h2 className="text-xl font-semibold mb-6">Available Reviewers</h2>

            <div className="grid gap-4">
              {reviewers.map((reviewer, index) => (
                <Card key={index} className={isAssigned ? "border-primary/50" : ""}>
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar>
                      <AvatarImage src={reviewer.avatar} alt={reviewer.name} />
                      <AvatarFallback>{reviewer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-base">{reviewer.name}</CardTitle>
                      <CardDescription>{reviewer.role}</CardDescription>
                    </div>
                    <Badge variant={isAssigned ? "default" : "outline"}>{reviewer.status}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{reviewer.institution}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              {!isAssigned ? (
                <Button onClick={handleAssign} disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? "Assigning..." : "Assign to Reviewers"}
                </Button>
              ) : !isReviewed ? (
                <Button onClick={handleReview} disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? "Reviewing..." : "Complete Review"}
                </Button>
              ) : null}
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
            <h2 className="text-xl font-semibold mb-4">Verification Progress</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full p-1.5 bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Plagiarism Check</h4>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full p-1.5 bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">AI Content Analysis</h4>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full p-1.5 bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Blockchain Verification</h4>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full p-1.5 ${isAssigned ? (isReviewed ? "bg-green-100 dark:bg-green-900/30" : "bg-yellow-100 dark:bg-yellow-900/30") : "bg-muted"}`}
                >
                  {isReviewed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : isAssigned ? (
                    <Users className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Users className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium">Human Review</h4>
                  <p className="text-xs text-muted-foreground">
                    {isReviewed ? "Completed" : isAssigned ? "In Progress" : "Pending"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-1.5 ${isMinted ? "bg-green-100 dark:bg-green-900/30" : "bg-muted"}`}>
                  {isMinted ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Award className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium">NFT Certificate</h4>
                  <p className="text-xs text-muted-foreground">{isMinted ? "Minted" : "Pending"}</p>
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
            <h2 className="text-xl font-semibold mb-4">NFT Certificate</h2>

            {isMinted ? (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Certificate Minted</h3>
                <p className="text-center text-muted-foreground mb-4">
                  Your paper has been verified and an NFT certificate has been minted
                </p>
                <div className="bg-muted p-3 rounded-md font-mono text-xs w-full overflow-x-auto">
                  <p>Token ID: 8294</p>
                  <p className="mt-1">Contract: 0x3f9e8d7c6b5a4e3f2d1c0b9a8e7d6c5b</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <Award className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Not Yet Minted</h3>
                <p className="text-center text-muted-foreground mb-4">
                  {isReviewed
                    ? "Your paper has been reviewed. You can now mint an NFT certificate."
                    : "Complete the human review process to mint an NFT certificate."}
                </p>
                {isReviewed && (
                  <Button onClick={handleMint} disabled={isLoading || !isReviewed} className="w-full">
                    {isLoading ? "Minting..." : "Mint NFT Certificate"}
                  </Button>
                )}
              </div>
            )}
          </motion.div>

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/trust-score">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Link>
            </Button>
            <Button onClick={handleComplete} disabled={!isMinted}>
              Complete <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

