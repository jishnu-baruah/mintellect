"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import { Shield, Search, Filter, ExternalLink } from "lucide-react"
import Link from "next/link"

interface NFTCertificate {
  id: string
  tokenId: string
  documentName: string
  author: string
  trustScore: number
  mintedDate: string
  blockchain: string
}

export default function NFTGalleryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)

  // Mock data for NFT certificates
  const certificates: NFTCertificate[] = [
    {
      id: "cert-001",
      tokenId: "MINT-4872",
      documentName: "The Impact of Artificial Intelligence on Modern Healthcare",
      author: "John Smith",
      trustScore: 85,
      mintedDate: "2023-05-15",
      blockchain: "Ethereum",
    },
    {
      id: "cert-002",
      tokenId: "MINT-3921",
      documentName: "Quantum Computing: Future Prospects and Challenges",
      author: "Michael Brown",
      trustScore: 92,
      mintedDate: "2023-05-10",
      blockchain: "Ethereum",
    },
    {
      id: "cert-003",
      tokenId: "MINT-7654",
      documentName: "Sustainable Energy Solutions for Urban Development",
      author: "Emily Chen",
      trustScore: 88,
      mintedDate: "2023-05-08",
      blockchain: "Polygon",
    },
    {
      id: "cert-004",
      tokenId: "MINT-2345",
      documentName: "Machine Learning Applications in Financial Markets",
      author: "David Wilson",
      trustScore: 90,
      mintedDate: "2023-05-05",
      blockchain: "Ethereum",
    },
    {
      id: "cert-005",
      tokenId: "MINT-8901",
      documentName: "Neuroplasticity and Cognitive Development in Children",
      author: "Sarah Johnson",
      trustScore: 95,
      mintedDate: "2023-05-01",
      blockchain: "Polygon",
    },
    {
      id: "cert-006",
      tokenId: "MINT-5678",
      documentName: "Blockchain Technology in Supply Chain Management",
      author: "Robert Lee",
      trustScore: 87,
      mintedDate: "2023-04-28",
      blockchain: "Ethereum",
    },
  ]

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.tokenId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = selectedFilter ? cert.blockchain === selectedFilter : true

    return matchesSearch && matchesFilter
  })

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 80) return "text-green-300"
    if (score >= 70) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-gray-800 py-4 backdrop-blur-md bg-gray-900/80 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-mintellect-primary" />
              <h1 className="text-2xl font-bold">NFT Certificate Gallery</h1>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard">
                <RippleButton size="sm">Dashboard</RippleButton>
              </Link>
              <Link href="/documents">
                <RippleButton variant="outline" size="sm">
                  Documents
                </RippleButton>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, or token ID..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-shrink-0 w-full md:w-auto">
            <select
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary flex-1 md:flex-initial"
              value={selectedFilter || ""}
              onChange={(e) => setSelectedFilter(e.target.value || null)}
            >
              <option value="">All Blockchains</option>
              <option value="Ethereum">Ethereum</option>
              <option value="Polygon">Polygon</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>

        {filteredCertificates.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-700 rounded-lg">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">No certificates found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <GlassCard className="h-full flex flex-col">
                  <div className="border-2 border-mintellect-primary rounded-lg p-6 bg-gradient-to-br from-gray-900 to-gray-800 flex-1 flex flex-col relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-mintellect-primary/10 blur-2xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-mintellect-secondary/10 blur-2xl"></div>

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-mintellect-primary" />
                        <span className="font-bold">Mintellect</span>
                      </div>
                      <div className="px-2 py-1 bg-mintellect-primary/20 rounded-full text-xs font-medium text-mintellect-primary">
                        Verified
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-2 line-clamp-2 relative z-10">{cert.documentName}</h3>
                    <p className="text-sm text-gray-400 mb-4 relative z-10">By {cert.author}</p>

                    <div className="flex justify-center mb-4 mt-auto relative z-10">
                      <div className="w-16 h-16 rounded-full bg-mintellect-primary/20 flex items-center justify-center text-mintellect-primary text-2xl font-bold relative">
                        <div className="absolute inset-0 rounded-full border border-mintellect-primary/30 animate-pulse"></div>
                        {cert.trustScore}
                      </div>
                    </div>

                    <div className="text-center text-xs text-gray-400 mt-auto relative z-10">
                      <p>Token ID: {cert.tokenId}</p>
                      <p>Minted on {cert.mintedDate}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-gray-400">Blockchain: </span>
                      <span>{cert.blockchain}</span>
                    </div>
                    <Link href={`/certificates/${cert.id}`}>
                      <RippleButton size="sm" className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        <span>View</span>
                      </RippleButton>
                    </Link>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
