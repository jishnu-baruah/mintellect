"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  Search,
  FileText,
  BookOpen,
  ArrowRight,
  Filter,
  X,
  Lock,
  Check,
  Star,
  Clock,
  TrendingUp,
  Eye,
  Calendar,
  Award,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  ArrowLeft,
} from "lucide-react"
import { RippleButton } from "@/components/ui/ripple-button"
import { GlassCard } from "@/components/ui/glass-card"
import { PaperFilters } from "@/components/paper-filters"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { useWallet } from "@/components/wallet-provider"
import { useAccount, useContractRead } from 'wagmi';
import contractABI from "@/lib/MintellectNFT_ABI.json"

const CONTRACT_ADDRESS = "0x4c899A624F23Fe64E9e820b62CfEd4aFAAA93004"

// Paper card component
const PaperCard = ({ paper, onPurchase, isExpanded, onToggleExpand }: {
  paper: any;
  onPurchase: (paper: any) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) => {
  const { isConnected } = useWallet()
  const isPremium = paper.isPremium
  const isVerified = paper.verified

  const formattedDate = new Date(paper.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 80) return "text-blue-400"
    if (score >= 70) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-blue-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <GlassCard
        className={`h-full overflow-hidden transition-all duration-300 ${
          isExpanded ? "border-mintellect-primary/70" : "hover:border-mintellect-primary/30"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Paper thumbnail */}
          <div className="md:w-1/3 lg:w-1/4 relative">
            <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
              <Image src={paper.imageUrl || "/placeholder.svg"} alt={paper.title} fill className="object-cover" />

              {isPremium && (
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div className="absolute top-0 right-0 transform translate-y-[-50%] translate-x-[50%] rotate-45 bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-lg w-24 h-24"></div>
                  <div className="absolute top-3 right-2 transform rotate-45">
                    <Star className="h-3 w-3 text-black" />
                  </div>
                </div>
              )}

              {isVerified && (
                <div className="absolute top-3 left-3 bg-green-600/90 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  <span>VERIFIED</span>
                </div>
              )}

              {!isVerified && (
                <div className="absolute top-3 left-3 bg-orange-500/90 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>PENDING</span>
                </div>
              )}
            </div>
          </div>

          {/* Paper content */}
          <div className="flex-1 p-4 md:p-0 md:pr-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-mintellect-primary/20 text-mintellect-primary">
                {paper.category}
              </span>
              {isPremium && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  PREMIUM
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-mintellect-primary transition-colors">
              {paper.title}
            </h3>

            <div className="mb-3 text-sm text-gray-300">
              <span className="font-medium">{paper.author}</span>
              <p className="text-xs text-gray-400">{paper.institution}</p>
            </div>

            <p className={`text-sm text-gray-400 ${isExpanded ? "" : "line-clamp-2"} mb-4`}>{paper.abstract}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {paper.tags.slice(0, isExpanded ? paper.tags.length : 3).map((tag: string) => (
                <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
              {!isExpanded && paper.tags.length > 3 && (
                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                  +{paper.tags.length - 3}
                </span>
              )}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{paper.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>{paper.citations.toLocaleString()} citations</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className={getScoreColor(paper.trustScore)} />
                <span className={getScoreColor(paper.trustScore)}>{paper.trustScore}% trust</span>
              </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium mb-2 text-sm">Trust Score Breakdown</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Methodology</span>
                        <span className={getScoreColor(paper.trustScore - 5)}>{paper.trustScore - 5}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getScoreBgColor(paper.trustScore - 5)}`}
                          style={{ width: `${paper.trustScore - 5}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Citations</span>
                        <span className={getScoreColor(paper.trustScore - 2)}>{paper.trustScore - 2}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getScoreBgColor(paper.trustScore - 2)}`}
                          style={{ width: `${paper.trustScore - 2}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Originality</span>
                        <span className={getScoreColor(paper.trustScore + 3)}>
                          {Math.min(paper.trustScore + 3, 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getScoreBgColor(paper.trustScore + 3)}`}
                          style={{ width: `${Math.min(paper.trustScore + 3, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Consistency</span>
                        <span className={getScoreColor(paper.trustScore - 1)}>{paper.trustScore - 1}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getScoreBgColor(paper.trustScore - 1)}`}
                          style={{ width: `${paper.trustScore - 1}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {isVerified && (
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 text-sm">Blockchain Verification</h4>
                    <div className="text-xs text-gray-400 break-all mb-2">
                      <span className="text-gray-500">TX Hash:</span> {paper.transactionHash}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors">
                        <ExternalLink className="h-3 w-3" />
                        <span>View on Explorer</span>
                      </button>
                      <button className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors">
                        <Download className="h-3 w-3" />
                        <span>Download Certificate</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Actions row */}
            <div className="flex flex-wrap justify-between items-center gap-2">
              <button
                onClick={onToggleExpand}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>Show More</span>
                  </>
                )}
              </button>

              <div className="flex gap-2">
                {isPremium ? (
                  <RippleButton
                    onClick={() => onPurchase(paper)}
                    disabled={!isConnected}
                    className="text-xs px-3 py-1.5 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black"
                  >
                    <Lock className="h-3 w-3" />
                    <span>{paper.price} EDU</span>
                  </RippleButton>
                ) : (
                  <Link href={`/community/papers/${paper.id}`}>
                    <RippleButton className="text-xs px-3 py-1.5 flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>Read Paper</span>
                    </RippleButton>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// Featured paper component
const FeaturedPaper = ({ paper, onPurchase }: {
  paper: any;
  onPurchase: (paper: any) => void;
}) => {
  const { isConnected } = useWallet()
  const isPremium = paper.isPremium

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <GlassCard className="overflow-hidden border-mintellect-primary/30">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/3 relative">
            <div className="h-48 lg:h-full relative overflow-hidden">
              <Image src={paper.imageUrl || "/placeholder.svg"} alt={paper.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
              <div className="absolute top-4 left-4 z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">Featured Research</h2>
                <p className="text-gray-300 max-w-md">Highest trust score in blockchain technology</p>
              </div>
            </div>
          </div>

          <div className="p-6 lg:w-2/3">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-mintellect-primary/20 text-mintellect-primary">
                {paper.category}
              </span>
              {isPremium && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  FEATURED PREMIUM
                </span>
              )}
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
                <Award className="h-3 w-3" />
                {paper.trustScore}% TRUST SCORE
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold mb-3">{paper.title}</h3>

            <div className="mb-4 text-sm md:text-base text-gray-300">
              <span className="font-medium">{paper.author}</span>
              <p className="text-xs md:text-sm text-gray-400">{paper.institution}</p>
            </div>

            <p className="text-sm md:text-base text-gray-400 mb-6">{paper.abstract}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {paper.tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{paper.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{paper.citations.toLocaleString()} citations</span>
                </div>
              </div>

              <div className="flex gap-2">
                {isPremium ? (
                  <RippleButton
                    onClick={() => onPurchase(paper)}
                    disabled={!isConnected}
                    size="lg"
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-black"
                  >
                    <Lock className="h-4 w-4" />
                    <span>{paper.price} EDU</span>
                  </RippleButton>
                ) : (
                  <Link href={`/community/papers/${paper.id}`}>
                    <RippleButton size="lg" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Read Full Paper</span>
                    </RippleButton>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// Empty state for papers when no data is available
const EmptyPapers = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <GlassCard className="text-center py-12">
      <FileText className="h-16 w-16 mx-auto text-gray-500 mb-4" />
      <h3 className="text-xl font-medium mb-2">No papers found</h3>
      <p className="text-gray-400 mb-6">Be the first to publish research in this category</p>
      <Link href="/community/publish">
        <RippleButton className="mx-auto">Publish Paper</RippleButton>
      </Link>
    </GlassCard>
  </motion.div>
)

// Purchase modal component
const PurchaseModal = ({ paper, onClose, onConfirm }: {
  paper: any;
  onClose: () => void;
  onConfirm: (paper: any) => void;
}) => {
  const { isConnected, walletAddress } = useWallet()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePurchase = async () => {
    if (!isConnected) return

    setIsProcessing(true)
    // Simulate transaction processing
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsProcessing(false)
    onConfirm(paper)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full"
      >
        <div className="absolute top-3 right-3">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-800 transition-colors" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-500/20 p-2 rounded-full">
            <Lock className="h-5 w-5 text-amber-400" />
          </div>
          <h3 className="text-xl font-bold">Purchase Premium Paper</h3>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-1">{paper.title}</h4>
          <p className="text-sm text-gray-400">
            {paper.author} • {paper.institution}
          </p>
        </div>

        <div className="bg-gray-800/70 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-700">
            <span className="text-gray-300">Price:</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-amber-400">{paper.price}</span>
              <span className="text-amber-400">EDU</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300">Trust Score:</span>
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 text-green-400" />
              <span className="font-medium text-green-400">{paper.trustScore}%</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-300">Verification:</span>
            <div className="flex items-center gap-1">
              {paper.verified ? (
                <>
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="font-medium text-green-400">Verified</span>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 text-orange-400" />
                  <span className="font-medium text-orange-400">Pending</span>
                </>
              )}
            </div>
          </div>
        </div>

        {!isConnected ? (
          <div className="text-center mb-6">
            <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
              <p className="text-amber-400 mb-2 font-medium">Connect your wallet to purchase</p>
              <p className="text-sm text-gray-400">You need to connect your wallet to purchase premium papers.</p>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h4 className="font-medium mb-2">What you'll get:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Full access to the complete research paper</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Downloadable PDF version with citation information</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Blockchain verification certificate</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Access to supplementary materials and data</span>
              </li>
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>

          <RippleButton
            onClick={handlePurchase}
            disabled={!isConnected || isProcessing}
            className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-medium"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Purchase Now"
            )}
          </RippleButton>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("date")
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [isResearcher, setIsResearcher] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [selectedPaper, setSelectedPaper] = useState(null)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [expandedPapers, setExpandedPapers] = useState<string[]>([])
  const [papers, setPapers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { isConnected } = useWallet()
  const { address } = useAccount();

  // Read tokenCounter
  const { data: total, isLoading: isTotalLoading } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'tokenCounter',
    watch: true,
  });

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true)
      try {
        if (!address) return
        const nfts: any[] = []
        for (let i = 0; i < Number(total); i++) {
          try {
            const tokenId = i.toString()
            const tokenURI = await useContractRead({
              address: CONTRACT_ADDRESS,
              abi: contractABI,
              functionName: 'tokenURI',
              args: [tokenId],
            })
            const owner = await useContractRead({
              address: CONTRACT_ADDRESS,
              abi: contractABI,
              functionName: 'ownerOf',
              args: [tokenId],
            })
            const ipfsUrl = tokenURI.startsWith("ipfs://")
              ? `https://gateway.pinata.cloud/ipfs/${tokenURI.replace("ipfs://", "")}`
              : tokenURI
            const metaRes = await fetch(ipfsUrl)
            const meta = await metaRes.json()
            nfts.push({
              id: tokenId,
              title: meta.name || "Untitled Document",
              author: meta.author || owner,
              institution: meta.institution || "",
              date: meta.timestamp ? new Date(meta.timestamp).toISOString().slice(0, 10) : "-",
              category: meta.category || "Uncategorized",
              tags: meta.tags || [],
              abstract: meta.description || "No abstract provided.",
              trustScore: meta.trustScore || 0,
              citations: meta.citations || 0,
              views: meta.views || 0,
              isPremium: meta.isPremium || false,
              price: meta.price || 0,
              verified: true,
              imageUrl: meta.imageUrl || "/images/research-sample.png",
              transactionHash: meta.transactionHash || "",
            })
          } catch {}
        }
        setPapers(nfts)
      } finally {
        setLoading(false)
      }
    }
    fetchNFTs()
  }, [address, total])

  // Toggle researcher/general user view
  const toggleUserRole = () => {
    setIsResearcher(!isResearcher)
  }

  // Toggle paper expanded state
  const togglePaperExpanded = (paperId: string) => {
    setExpandedPapers((prev) => (prev.includes(paperId) ? prev.filter((id) => id !== paperId) : [...prev, paperId]))
  }

  // Filter papers based on search, category, and premium filter
  const filteredPapers = papers.filter((paper) => {
    // Search filter
    if (
      searchQuery &&
      !paper.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !paper.author.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !paper.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false
    }
    // Category filter
    if (selectedCategory && paper.category !== selectedCategory) {
      return false
    }
    // Premium filter
    if (showPremiumOnly && !paper.isPremium) {
      return false
    }
    return true
  })

  // Sort papers based on selected sort option
  const sortedPapers = [...filteredPapers].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === "trust") {
      return b.trustScore - a.trustScore
    } else if (sortBy === "citations") {
      return b.citations - a.citations
    } else if (sortBy === "views") {
      return b.views - a.views
    }
    return 0
  })

  // Get featured paper (highest trust score)
  const featuredPaper = papers.length
    ? papers.reduce((prev, current) => (prev.trustScore > current.trustScore ? prev : current), papers[0])
    : null;

  // Handle paper purchase
  const handlePurchase = (paper: any) => {
    setSelectedPaper(paper)
    setShowPurchaseModal(true)
  }

  // Confirm purchase
  const confirmPurchase = (paper: any) => {
    // Here you would implement the actual purchase logic
    alert(`Purchase successful! You now have access to "${paper.title}"`)
    setShowPurchaseModal(false)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* <Navbar showProfile={true} /> removed, navbar is now only in layout */}

      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-mintellect-primary/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <header className="relative z-10 border-b border-gray-800 py-8 bg-black">
        <div className="container mx-auto px-4">
          {/* Back to Dashboard Button removed */}

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Blockchain Research Hub
              </h1>
              <p className="text-gray-400 max-w-md text-sm md:text-base">
                Discover verified blockchain research papers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              <RippleButton onClick={toggleUserRole} variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{isResearcher ? "Reader View" : "Researcher View"}</span>
              </RippleButton>

              {isResearcher && (
                <Link href="/community/publish">
                  <RippleButton className="flex items-center gap-2 bg-gradient-to-r from-mintellect-primary to-mintellect-primary/80">
                    <BookOpen className="h-4 w-4" />
                    <span>Publish Research</span>
                  </RippleButton>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 pb-24 relative z-10">
        {/* Featured paper */}
        {featuredPaper ? (
          <FeaturedPaper paper={featuredPaper} onPurchase={handlePurchase} />
        ) : (
          <div className="text-gray-400 text-center py-8">No papers found.</div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile filters toggle */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>

            <div className="text-sm text-gray-400">
              {selectedCategory ? `Category: ${selectedCategory}` : "All Categories"}
              {showPremiumOnly ? " • Premium Only" : ""}
            </div>
          </div>

          {/* Mobile filters sidebar */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed inset-0 z-50 md:hidden ml-16"
              >
                <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => setShowMobileFilters(false)}
                ></div>
                <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-gray-900 p-4 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Filters</h3>
                    <button onClick={() => setShowMobileFilters(false)} className="p-1 rounded-full hover:bg-gray-800">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <PaperFilters
                    selectedCategory={selectedCategory}
                    onCategoryChange={(cat) => {
                      setSelectedCategory(cat)
                      setShowMobileFilters(false)
                    }}
                    showPremiumOnly={showPremiumOnly}
                    onPremiumChange={setShowPremiumOnly}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop filters sidebar */}
          <div className="hidden md:block w-64 lg:w-72 flex-shrink-0">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <PaperFilters
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  showPremiumOnly={showPremiumOnly}
                  onPremiumChange={setShowPremiumOnly}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </motion.div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative mb-6"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search blockchain papers..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>

            {/* Results count and sort options */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-400">
                {sortedPapers.length} {sortedPapers.length === 1 ? "paper" : "papers"} found
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  className="text-sm bg-gray-800 border border-gray-700 rounded-lg px-2 py-1"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Latest</option>
                  <option value="trust">Trust Score</option>
                  <option value="citations">Citations</option>
                  <option value="views">Views</option>
                </select>
              </div>
            </div>

            {/* Papers list */}
            {sortedPapers.length > 0 ? (
              <div className="space-y-6 mb-8">
                {sortedPapers.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    onPurchase={handlePurchase}
                    isExpanded={expandedPapers.includes(paper.id)}
                    onToggleExpand={() => togglePaperExpanded(paper.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyPapers />
            )}

            {/* Blockchain categories section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12"
            >
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold mb-4">Explore Blockchain Research Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    "Blockchain Technology",
                    "Blockchain Economics",
                    "Digital Assets",
                    "Cryptography",
                    "Smart Contracts",
                    "Governance",
                  ].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="p-3 bg-gray-800/60 rounded-lg hover:bg-gray-700/80 transition-colors text-left"
                    >
                      <div className="flex justify-between items-center">
                        <span>{category}</span>
                        <ArrowRight className="h-4 w-4 text-mintellect-primary" />
                      </div>
                    </button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Purchase modal */}
      <AnimatePresence>
        {showPurchaseModal && selectedPaper && (
          <PurchaseModal
            paper={selectedPaper}
            onClose={() => setShowPurchaseModal(false)}
            onConfirm={confirmPurchase}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
