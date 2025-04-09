"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "./ui/glass-card"
import { RippleButton } from "./ui/ripple-button"
import { CheckCircle, Clock, FileText, Filter, Search, User, XCircle } from "lucide-react"

type ReviewStatus = "pending" | "approved" | "rejected"

interface ReviewSubmission {
  id: string
  title: string
  author: string
  submittedDate: string
  status: ReviewStatus
  trustScore: number
  feedback?: string
}

interface HumanReviewInterfaceProps {
  isReviewer?: boolean
  onMintNFT?: (submission: ReviewSubmission) => void
}

export function HumanReviewInterface({ isReviewer = true, onMintNFT }: HumanReviewInterfaceProps) {
  const [activeTab, setActiveTab] = useState<ReviewStatus>("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<ReviewSubmission | null>(null)
  const [feedback, setFeedback] = useState("")
  const [reviewCompleted, setReviewCompleted] = useState(false)

  // Mock data
  const mockSubmissions: ReviewSubmission[] = [
    {
      id: "sub-001",
      title: "The Impact of Artificial Intelligence on Modern Healthcare",
      author: "John Smith",
      submittedDate: "2023-05-15",
      status: "pending",
      trustScore: 85,
    },
    {
      id: "sub-002",
      title: "Literature Review - Climate Change",
      author: "Sarah Johnson",
      submittedDate: "2023-05-14",
      status: "pending",
      trustScore: 72,
    },
    {
      id: "sub-003",
      title: "Quantum Computing: Future Prospects and Challenges",
      author: "Michael Brown",
      submittedDate: "2023-05-10",
      status: "approved",
      trustScore: 92,
      feedback: "Excellent work with comprehensive analysis and proper citations.",
    },
    {
      id: "sub-004",
      title: "The Ethics of Genetic Engineering",
      author: "Emily Davis",
      submittedDate: "2023-05-08",
      status: "rejected",
      trustScore: 58,
      feedback: "Significant plagiarism detected. Please revise and resubmit.",
    },
  ]

  const filteredSubmissions = mockSubmissions.filter(
    (submission) =>
      submission.status === activeTab &&
      (submission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.author.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleSubmitReview = (approved: boolean) => {
    if (!selectedSubmission) return

    // In a real app, this would send the review to the backend
    // Here we just update the UI
    const newStatus = approved ? "approved" : "rejected"

    // Update the mock data (in a real app, this would be handled by the backend)
    const updatedSubmission = { ...selectedSubmission, status: newStatus as ReviewStatus, feedback }

    // Reset state
    setSelectedSubmission(null)
    setFeedback("")

    // If approved and onMintNFT callback is provided, call it
    if (approved && onMintNFT) {
      onMintNFT(updatedSubmission)
    }
  }

  const getStatusIcon = (status: ReviewStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-400" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-400" />
    }
  }

  const getStatusText = (status: ReviewStatus) => {
    switch (status) {
      case "pending":
        return "Pending Review"
      case "approved":
        return "Approved"
      case "rejected":
        return "Rejected"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const handleMintClick = (submission: ReviewSubmission) => {
    if (onMintNFT) {
      onMintNFT(submission)
    }
  }

  // For non-reviewer view (user submitting for review)
  if (!isReviewer) {
    if (reviewCompleted) {
      return (
        <GlassCard className="w-full">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Review Completed</h2>
            <p className="text-gray-300 mb-6">
              Your document has been reviewed and approved. You can now proceed to mint your NFT certificate.
            </p>
            <RippleButton onClick={() => onMintNFT && onMintNFT(mockSubmissions[2])}>
              Proceed to NFT Minting
            </RippleButton>
          </div>
        </GlassCard>
      )
    }

    return (
      <GlassCard className="w-full">
        <h2 className="text-2xl font-bold mb-6">Human Review</h2>
        <div className="text-center py-8">
          <Clock className="h-16 w-16 text-mintellect-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Your Document is Being Reviewed</h3>
          <p className="text-gray-300 mb-6">
            Our academic experts are reviewing your document. This process typically takes 24-48 hours.
          </p>
          <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto mb-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Submission Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Completion:</span>
                <span>{new Date(Date.now() + 86400000).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-yellow-400">In Review</span>
              </div>
            </div>
          </div>

          {/* For demo purposes only - in a real app this would be removed */}
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-sm text-gray-400 mb-4">Demo: Click the button below to simulate review completion</p>
            <RippleButton variant="outline" onClick={() => setReviewCompleted(true)}>
              Simulate Review Completion
            </RippleButton>
          </div>
        </div>
      </GlassCard>
    )
  }

  // Reviewer view (admin reviewing submissions)
  return (
    <GlassCard className="w-full">
      <h2 className="text-2xl font-bold mb-6">Human Review Interface</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or author..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-700">
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === "pending"
                ? "border-b-2 border-mintellect-primary text-mintellect-primary"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            <Clock className="h-4 w-4" />
            <span>Pending</span>
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === "approved"
                ? "border-b-2 border-mintellect-primary text-mintellect-primary"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("approved")}
          >
            <CheckCircle className="h-4 w-4" />
            <span>Approved</span>
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === "rejected"
                ? "border-b-2 border-mintellect-primary text-mintellect-primary"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("rejected")}
          >
            <XCircle className="h-4 w-4" />
            <span>Rejected</span>
          </button>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No submissions found in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-grow">
                  <h3 className="font-medium mb-1">{submission.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{submission.author}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <span>Submitted on {submission.submittedDate}</span>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(submission.status)}
                      <span>{getStatusText(submission.status)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getScoreColor(submission.trustScore)}`}>
                      {submission.trustScore}
                    </div>
                    <div className="text-xs text-gray-400">Trust Score</div>
                  </div>
                  {isReviewer && submission.status === "pending" && (
                    <RippleButton size="sm" onClick={() => setSelectedSubmission(submission)}>
                      Review
                    </RippleButton>
                  )}
                  {submission.status === "approved" && onMintNFT && (
                    <RippleButton
                      size="sm"
                      className="bg-mintellect-primary hover:bg-mintellect-primary/90 relative"
                      onClick={() => handleMintClick(submission)}
                    >
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      Mint NFT
                    </RippleButton>
                  )}
                  {submission.status !== "pending" && (
                    <RippleButton variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)}>
                      View Details
                    </RippleButton>
                  )}
                </div>
              </div>

              {submission.feedback && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="text-sm">
                    <span className="font-medium">Feedback: </span>
                    <span className="text-gray-300">{submission.feedback}</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">{selectedSubmission.title}</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-400">Author</p>
                  <p>{selectedSubmission.author}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Submitted Date</p>
                  <p>{selectedSubmission.submittedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(selectedSubmission.status)}
                    <span>{getStatusText(selectedSubmission.status)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Trust Score</p>
                  <p className={getScoreColor(selectedSubmission.trustScore)}>{selectedSubmission.trustScore}</p>
                </div>
              </div>

              {isReviewer && selectedSubmission.status === "pending" ? (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Review Feedback</label>
                    <textarea
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary min-h-[100px]"
                      placeholder="Provide feedback for this submission..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <RippleButton
                      variant="ghost"
                      onClick={() => {
                        setSelectedSubmission(null)
                        setFeedback("")
                      }}
                    >
                      Cancel
                    </RippleButton>
                    <RippleButton
                      variant="outline"
                      className="border-red-400 text-red-400 hover:bg-red-400/10"
                      onClick={() => handleSubmitReview(false)}
                    >
                      Reject
                    </RippleButton>
                    <RippleButton className="bg-green-500 hover:bg-green-600" onClick={() => handleSubmitReview(true)}>
                      Approve
                    </RippleButton>
                  </div>
                </div>
              ) : (
                <div>
                  {selectedSubmission.feedback && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Feedback</h4>
                      <div className="p-3 bg-gray-800 rounded-lg">{selectedSubmission.feedback}</div>
                    </div>
                  )}
                  <div className="flex justify-end gap-3">
                    <RippleButton variant="ghost" onClick={() => setSelectedSubmission(null)}>
                      Close
                    </RippleButton>
                    {selectedSubmission.status === "approved" && onMintNFT && (
                      <RippleButton
                        className="bg-mintellect-primary hover:bg-mintellect-primary/90 relative overflow-hidden group"
                        onClick={() => {
                          setSelectedSubmission(null)
                          handleMintClick(selectedSubmission)
                        }}
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-mintellect-primary/0 via-white/20 to-mintellect-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                        Mint NFT Certificate
                      </RippleButton>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </GlassCard>
  )
}
