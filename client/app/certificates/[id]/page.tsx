"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import { Shield, Download, Share2, ExternalLink, Copy, FileText, Check } from "lucide-react"
import Link from "next/link"

export default function CertificatePage({ params }: { params: { id: string } }) {
  const [certificateData, setCertificateData] = useState<{
    documentName: string
    trustScore: number
    tokenId: string
    transactionHash: string
    blockchain: string
    ipfsUrl: string
    mintedDate: string
    author: string
    institution: string
  } | null>(null)

  useEffect(() => {
    // Simulate fetching certificate data
    setTimeout(() => {
      setCertificateData({
        documentName: "Research Paper on AI Ethics.pdf",
        trustScore: 92,
        tokenId: `MINT-${Math.floor(Math.random() * 10000)}`,
        transactionHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        blockchain: "Ethereum",
        ipfsUrl: `ipfs://Qm${Array.from({ length: 44 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        mintedDate: new Date().toLocaleDateString(),
        author: "John Smith",
        institution: "Stanford University",
      })
    }, 1000)
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  if (!certificateData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-mintellect-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading certificate...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-gray-800 py-4 backdrop-blur-md bg-gray-900/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-mintellect-primary" />
            <span className="text-xl font-bold">Mintellect</span>
          </Link>
          <div className="flex gap-4">
            <RippleButton variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </RippleButton>
            <RippleButton size="sm" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </RippleButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Academic Trust Certificate</h1>
              <p className="text-gray-400">
                This document has been verified for academic integrity and minted as an NFT on the blockchain.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="md:col-span-2">
                <GlassCard>
                  <div className="border-2 border-mintellect-primary rounded-lg p-8 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-mintellect-primary/10 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-mintellect-secondary/10 blur-3xl"></div>

                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="flex items-center gap-2">
                        <Shield className="h-8 w-8 text-mintellect-primary" />
                        <span className="text-2xl font-bold">Mintellect</span>
                      </div>
                      <div className="px-3 py-1 bg-mintellect-primary/20 rounded-full text-sm font-medium text-mintellect-primary flex items-center gap-2 backdrop-blur-sm">
                        <Check className="h-4 w-4" />
                        <span>Verified</span>
                      </div>
                    </div>

                    <h2 className="text-3xl font-bold mb-4 text-center relative z-10">Academic Trust Certificate</h2>
                    <p className="text-center text-gray-300 mb-8 relative z-10">
                      This document has been verified for academic integrity
                    </p>

                    <div className="flex justify-center mb-8 relative z-10">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: [0.9, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                        className="w-32 h-32 rounded-full bg-mintellect-primary/20 flex items-center justify-center text-mintellect-primary text-5xl font-bold relative"
                      >
                        <div className="absolute inset-0 rounded-full border border-mintellect-primary/50 animate-pulse"></div>
                        {certificateData.trustScore}
                      </motion.div>
                    </div>

                    <div className="mb-8 text-center">
                      <h3 className="text-xl font-bold mb-2">{certificateData.documentName}</h3>
                      <p className="text-gray-300">By {certificateData.author}</p>
                      <p className="text-gray-400">{certificateData.institution}</p>
                    </div>

                    <div className="text-center text-sm text-gray-400 border-t border-gray-700 pt-6">
                      <p>Token ID: {certificateData.tokenId}</p>
                      <p>Blockchain: {certificateData.blockchain}</p>
                      <p>Minted on {certificateData.mintedDate}</p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <div>
                <GlassCard>
                  <h3 className="text-lg font-bold mb-4">Certificate Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Document</p>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-mintellect-primary" />
                        <p className="font-medium">{certificateData.documentName}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Trust Score</p>
                      <p className="font-medium text-green-400">{certificateData.trustScore}/100</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Author</p>
                      <p className="font-medium">{certificateData.author}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Institution</p>
                      <p className="font-medium">{certificateData.institution}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Minted Date</p>
                      <p className="font-medium">{certificateData.mintedDate}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-400 mb-1">Token ID</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{certificateData.tokenId}</p>
                        <button
                          onClick={() => copyToClipboard(certificateData.tokenId)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Blockchain</p>
                      <p className="font-medium">{certificateData.blockchain}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Transaction Hash</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">
                          {certificateData.transactionHash.substring(0, 10)}...
                          {certificateData.transactionHash.substring(certificateData.transactionHash.length - 10)}
                        </p>
                        <button
                          onClick={() => copyToClipboard(certificateData.transactionHash)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <RippleButton variant="outline" className="w-full flex items-center justify-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>View on Blockchain</span>
                    </RippleButton>
                    <RippleButton variant="outline" className="w-full flex items-center justify-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>Download Certificate</span>
                    </RippleButton>
                    <RippleButton className="w-full flex items-center justify-center gap-2">
                      <Share2 className="h-4 w-4" />
                      <span>Share Certificate</span>
                    </RippleButton>
                  </div>
                </GlassCard>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-400 mb-4">
                This certificate is permanently stored on the blockchain and can be verified at any time.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/dashboard">
                  <RippleButton variant="outline">Back to Dashboard</RippleButton>
                </Link>
                <Link href="/nft-gallery">
                  <RippleButton variant="outline">View Gallery</RippleButton>
                </Link>
                <Link href="/documents">
                  <RippleButton>Verify Another Document</RippleButton>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
