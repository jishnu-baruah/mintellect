"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import { Shield, Download, Share2, ExternalLink, Copy, FileText, Check } from "lucide-react"
import Link from "next/link"
// import { useAccount, useContractRead } from 'wagmi';
// import contractABI from "@/lib/MintellectNFT_ABI.json"

// const CONTRACT_ADDRESS = "0x4c899A624F23Fe64E9e820b62CfEd4aFAAA93004"

export default function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true)
      setError(null)
      try {
        // Simulate certificate data for now
        setCertificateData({
          documentName: "Sample Certificate",
          trustScore: 85,
          tokenId: id,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
          blockchain: "Educhain Testnet",
          ipfsUrl: "",
          mintedDate: new Date().toLocaleDateString(),
          author: "Sample Author",
          institution: "Sample Institution",
        })
      } catch (err: any) {
        setError(err.message || "Failed to fetch certificate")
      } finally {
        setLoading(false)
      }
    }
    fetchCertificate()
  }, [id])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-mintellect-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading certificate...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Shield className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Certificate Not Found</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <Link href="/dashboard" className="text-mintellect-primary hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!certificateData) {
    return (
      <div className="min-h-screen bg-black text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">
            <FileText className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Certificate Not Available</h1>
          <p className="text-gray-400 mb-4">Wallet functionality is temporarily disabled</p>
          <Link href="/dashboard" className="text-mintellect-primary hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-foreground p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-mintellect-primary" />
                <h1 className="text-3xl font-bold">Certificate</h1>
              </div>
              <Link href="/dashboard">
                <RippleButton variant="outline" size="sm">
                  Back to Dashboard
                </RippleButton>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">{certificateData.documentName}</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-green-500 font-semibold">Verified Certificate</span>
                  </div>
                  <div>
                    <p className="text-gray-400">Trust Score</p>
                    <p className="text-2xl font-bold text-mintellect-primary">{certificateData.trustScore}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Author</p>
                    <p className="font-semibold">{certificateData.author}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Institution</p>
                    <p className="font-semibold">{certificateData.institution}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Minted Date</p>
                    <p className="font-semibold">{certificateData.mintedDate}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 mb-2">Token ID</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-800 px-3 py-1 rounded text-sm font-mono">
                      {certificateData.tokenId}
                    </code>
                    <button
                      onClick={() => copyToClipboard(certificateData.tokenId)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 mb-2">Transaction Hash</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-800 px-3 py-1 rounded text-sm font-mono">
                      {certificateData.transactionHash}
                    </code>
                    <button
                      onClick={() => copyToClipboard(certificateData.transactionHash)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 mb-2">Blockchain</p>
                  <p className="font-semibold">{certificateData.blockchain}</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <RippleButton className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Certificate
                  </RippleButton>
                  <RippleButton variant="outline" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </RippleButton>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
