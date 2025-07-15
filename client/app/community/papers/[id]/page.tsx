"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Eye, Clock, Award, Download, TrendingUp, Share2, Lock, ChevronLeft, ShieldCheck, FileText } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import { PaperPurchase } from "@/components/paper-purchase"

// Same mock data as in community page
const MOCK_PAPERS = [
  {
    id: "paper-001",
    title: "Advances in Quantum Computing: A New Paradigm for Information Processing",
    author: "Dr. Maria Rodriguez",
    institution: "MIT",
    date: "2023-04-15",
    category: "Computer Science",
    tags: ["quantum computing", "quantum information", "algorithms"],
    abstract:
      "This paper explores recent developments in quantum computing and their implications for solving complex computational problems. We present novel approaches to quantum gate operations and error correction techniques.",
    views: 1243,
    citations: 56,
    isPremium: true,
    trustScore: 92,
    price: 9.99,
    freeViewsLimit: 3,
    thumbnailUrl: "/placeholder.svg?height=200&width=400",
    content: `# Introduction

Quantum computing represents a revolutionary approach to computation that leverages quantum mechanical phenomena to perform operations on data. Unlike classical computers that use bits as the smallest unit of data (represented as either 0 or 1), quantum computers use quantum bits or qubits, which can exist in superpositions of states.

## Quantum Gates and Operations

Recent advances in quantum gate fidelity have significantly reduced error rates in quantum operations. Our research demonstrates a novel approach to implementing multi-qubit gates with reduced crosstalk and improved coherence times.

### Error Correction Techniques

Quantum error correction remains one of the critical challenges in building large-scale quantum computers. We propose a new error correction code that can detect and correct multiple types of errors while requiring fewer physical qubits than previous approaches.

# Experimental Results

Our experimental implementation on a 20-qubit superconducting quantum processor shows promising results, with gate fidelities exceeding 99.5% for single-qubit operations and 98.2% for two-qubit operations.

## Performance Analysis

When compared with previous implementations, our approach shows a 30% improvement in overall circuit depth and a 25% reduction in required error correction overhead.

# Conclusion

The techniques presented in this paper represent a significant step forward in making practical quantum computing a reality. Future work will focus on scaling these approaches to larger qubit arrays and implementing more complex quantum algorithms.`,
  },
  {
    id: "paper-002",
    title: "Climate Change Effects on Marine Ecosystems: A Comprehensive Analysis",
    author: "Dr. James Chen",
    institution: "Stanford University",
    date: "2023-03-22",
    category: "Environmental Science",
    tags: ["climate change", "marine biology", "ecosystem"],
    abstract:
      "This research examines the impact of rising ocean temperatures on marine biodiversity. We analyze data from over 50 coral reef systems to identify patterns of ecological change.",
    views: 895,
    citations: 32,
    isPremium: false,
    trustScore: 88,
    thumbnailUrl: "/placeholder.svg?height=200&width=400",
    content: `# Introduction

Climate change is dramatically altering marine ecosystems worldwide, with particularly severe impacts on coral reef systems. This paper presents a comprehensive analysis of these changes based on data collected from 50 coral reef systems across the Pacific and Indian Oceans over a 15-year period.

## Methodology

Our research team deployed temperature sensors and conducted regular biodiversity surveys at each site. We collected data on coral cover, fish species diversity, and various environmental parameters including water temperature, pH, and dissolved oxygen levels.

# Results

## Temperature Trends

All monitored sites showed statistically significant increases in average water temperature, with an average increase of 0.8°C over the study period. Notably, sites in the Western Pacific showed more rapid warming than those in the Indian Ocean.

## Biodiversity Changes

We observed a 23% average decline in coral cover across all sites, with some locations experiencing losses of up to 60%. Fish species diversity showed a corresponding decline, with an average reduction of 15% in species richness.

## Ecological Thresholds

Our data suggests that critical ecological thresholds are crossed when water temperatures exceed the local historical maximum by more than 1.5°C for periods longer than 3 weeks. After such events, ecosystem recovery times were measured in years rather than months.

# Discussion

These findings indicate that marine ecosystems are experiencing rapid and significant changes due to climate warming. The rate of change appears to be exceeding the adaptive capacity of many species, leading to simplified ecosystem structures and reduced biodiversity.

# Conclusion

Without immediate and substantial action to mitigate climate change, we project that over 60% of the world's coral reef ecosystems will experience severe degradation by 2050. Conservation efforts should focus on identifying and protecting potential climate refugia where ecosystems show greater resilience to warming trends.`,
  },
  // Other papers from the community page...
]

export default function PaperDetailPage() {
  const params = useParams()
  const router = useRouter()
  const paperId = params.id as string

  const [paper, setPaper] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [freeViewsUsed, setFreeViewsUsed] = useState(0)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [isOwner, setIsOwner] = useState(false) // In a real app, would check if current user is the author

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchPaper = () => {
      setLoading(true)

      try {
        // Simulate API delay
        setTimeout(() => {
          const foundPaper = MOCK_PAPERS.find((p) => p.id === paperId)

          if (foundPaper) {
            setPaper(foundPaper)

            // Check if user has access (in a  {
            setPaper(foundPaper)

            // Check if user has access (in a real app, this would check if the user purchased the paper)
            // For demo purposes, we'll simulate access based on certain papers
            const simulateAccess = !foundPaper.isPremium || foundPaper.id === "paper-001" || isOwner
            setHasAccess(simulateAccess)

            // Simulate free views from local storage
            const freeViewsKey = `paper_free_views_${paperId}`
            const storedViews = localStorage.getItem(freeViewsKey)
            const viewsUsed = storedViews ? Number.parseInt(storedViews) : 0

            if (foundPaper.isPremium && !simulateAccess) {
              // Update free views counter
              const newViewsCount = viewsUsed + 1
              localStorage.setItem(freeViewsKey, newViewsCount.toString())
              setFreeViewsUsed(newViewsCount)
            }
          } else {
            setError("Paper not found")
          }

          setLoading(false)
        }, 1000)
      } catch (err) {
        setError("Error loading paper")
        setLoading(false)
      }
    }

    fetchPaper()
  }, [paperId, isOwner])

  const handlePurchase = () => {
    // In a real app, this would open a payment flow
    setShowPurchaseModal(true)
  }

  const completePurchase = () => {
    // Simulate successful purchase
    setHasAccess(true)
    setShowPurchaseModal(false)

    // In a real app, this would call an API to record the purchase
    console.log("Paper purchased:", paperId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showProfile={true} />
        <div className="container mx-auto py-12 px-4 flex justify-center items-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-transparent border-mintellect-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading paper...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showProfile={true} />
        <div className="container mx-auto py-12 px-4">
          <GlassCard className="max-w-2xl mx-auto text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Paper Not Found</h2>
            <p className="text-gray-400 mb-6">The requested paper could not be found or has been removed.</p>
            <RippleButton onClick={() => router.push("/community")} variant="outline">
              Return to Community
            </RippleButton>
          </GlassCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar showProfile={true} /> removed, navbar is now only in layout */}

      <header className="border-b border-gray-800 py-4 backdrop-blur-md bg-gray-900/80 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/community")}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Community</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-mintellect-primary/10 rounded text-xs font-medium text-mintellect-primary">
                {paper.category}
              </span>
              {paper.isPremium && (
                <span className="px-2 py-1 bg-yellow-500/10 rounded text-xs font-medium text-yellow-500 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Premium
                </span>
              )}
              <span className="px-2 py-1 bg-green-500/10 rounded text-xs font-medium text-green-500 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-4">{paper.title}</h1>

            <div className="flex flex-wrap items-center text-sm text-gray-400 mb-6">
              <span className="font-medium text-white">{paper.author}</span>
              <span className="mx-2">•</span>
              <span>{paper.institution}</span>
              <span className="mx-2">•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(paper.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              {paper.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-400 hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="lg:w-2/3">
              <GlassCard>
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-xl font-bold mb-4">Abstract</h2>
                  <p className="text-gray-300 mb-6">{paper.abstract}</p>

                  {paper.isPremium && !hasAccess ? (
                    <div>
                      <div className="border-t border-gray-700 my-6"></div>

                      {freeViewsUsed < (paper.freeViewsLimit || 3) ? (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-2">Preview Content</h3>
                          <div className="relative">
                            {/* Show just the first part of the content */}
                            <div className="markdown-preview mb-4">
                              {paper.content.split("\n").slice(0, 10).join("\n")}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-900 to-transparent"></div>

                            <div className="text-center mt-6 relative z-10">
                              <p className="text-gray-400 mb-4">
                                You are viewing a preview of this premium paper. <br />
                                <span className="text-yellow-500">
                                  {paper.freeViewsLimit - freeViewsUsed} free views remaining
                                </span>
                              </p>

                              <RippleButton
                                onClick={handlePurchase}
                                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                              >
                                Purchase Full Paper (${paper.price})
                              </RippleButton>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 border border-dashed border-gray-700 rounded-lg">
                          <Lock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                          <h3 className="text-xl font-bold mb-2">Premium Content</h3>
                          <p className="text-gray-400 mb-6">
                            You've used all your free views for this paper. <br />
                            Purchase access to read the full content.
                          </p>

                          <RippleButton
                            onClick={handlePurchase}
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                          >
                            Purchase Full Paper (${paper.price})
                          </RippleButton>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="border-t border-gray-700 my-6"></div>

                      <h2 className="text-xl font-bold mb-4">Full Paper</h2>

                      <div className="markdown-preview">
                        {paper.content.split("\n").map((line: string, i: number) => {
                          if (line.startsWith("# ")) {
                            return (
                              <h1 key={i} className="text-2xl font-bold mt-8 mb-4">
                                {line.substring(2)}
                              </h1>
                            )
                          } else if (line.startsWith("## ")) {
                            return (
                              <h2 key={i} className="text-xl font-bold mt-6 mb-3">
                                {line.substring(3)}
                              </h2>
                            )
                          } else if (line.startsWith("### ")) {
                            return (
                              <h3 key={i} className="text-lg font-bold mt-4 mb-2">
                                {line.substring(4)}
                              </h3>
                            )
                          } else if (line.trim() === "") {
                            return <div key={i} className="my-2"></div>
                          } else {
                            return (
                              <p key={i} className="mb-4">
                                {line}
                              </p>
                            )
                          }
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>

            <div className="lg:w-1/3">
              <div className="sticky top-24">
                <GlassCard className="mb-6">
                  <h3 className="font-bold mb-4">Paper Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-mintellect-primary" />
                        <span>Trust Score</span>
                      </div>
                      <span className="font-bold text-lg">{paper.trustScore}%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-gray-400" />
                        <span>Views</span>
                      </div>
                      <span>{paper.views.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                        <span>Citations</span>
                      </div>
                      <span>{paper.citations.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <span>Published</span>
                      </div>
                      <span>{new Date(paper.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 my-4 pt-4">
                    <div className="flex flex-col gap-3">
                      {hasAccess && (
                        <RippleButton variant="outline" className="w-full flex items-center justify-center gap-2">
                          <Download className="h-4 w-4" />
                          <span>Download PDF</span>
                        </RippleButton>
                      )}

                      <RippleButton variant="outline" className="w-full flex items-center justify-center gap-2">
                        <Share2 className="h-4 w-4" />
                        <span>Share Paper</span>
                      </RippleButton>

                      {paper.isPremium && !hasAccess && (
                        <RippleButton
                          onClick={handlePurchase}
                          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 flex items-center justify-center gap-2"
                        >
                          <Lock className="h-4 w-4" />
                          <span>Purchase (${paper.price})</span>
                        </RippleButton>
                      )}
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <h3 className="font-bold mb-4">Author</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-mintellect-primary/20 flex items-center justify-center text-mintellect-primary font-bold text-xl">
                      {paper.author.split(" ")[1][0]}
                    </div>
                    <div>
                      <h4 className="font-medium">{paper.author}</h4>
                      <p className="text-sm text-gray-400">{paper.institution}</p>
                    </div>
                  </div>
                  <RippleButton variant="outline" size="sm" className="w-full">
                    View Profile
                  </RippleButton>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showPurchaseModal && (
        <PaperPurchase paper={paper} onClose={() => setShowPurchaseModal(false)} onComplete={completePurchase} />
      )}
    </div>
  )
}
