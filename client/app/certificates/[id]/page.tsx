"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import { Shield, Download, Share2, ExternalLink, Copy, FileText, Check } from "lucide-react"
import Link from "next/link"
import { useAccount, useContractRead } from 'wagmi';
import contractABI from "@/lib/MintellectNFT_ABI.json"

const CONTRACT_ADDRESS = "0x4c899A624F23Fe64E9e820b62CfEd4aFAAA93004"

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
  const { address } = useAccount();

  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true)
      setError(null)
      try {
        if (!address) throw new Error("Wallet not connected")
        const tokenId = id
        const tokenURI = await useContractRead({
          address: CONTRACT_ADDRESS,
          abi: contractABI,
          functionName: 'tokenURI',
          args: [tokenId],
        })
        const ipfsUrl = tokenURI.startsWith("ipfs://")
          ? `https://gateway.pinata.cloud/ipfs/${tokenURI.replace("ipfs://", "")}`
          : tokenURI
        const metaRes = await fetch(ipfsUrl)
        const meta = await metaRes.json()
        let txHash = meta.transactionHash || ""
        // If transactionHash is not in metadata, fetch from blockchain logs
        if (!txHash) {
          // Get the Transfer event for this tokenId
          const ownerOf = await useContractRead({
            address: CONTRACT_ADDRESS,
            abi: contractABI,
            functionName: 'ownerOf',
            args: [tokenId],
          })
          const owner = ownerOf.result;
          const filter = {
            address: CONTRACT_ADDRESS,
            topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", // Transfer event signature
              null, // From address (null for Transfer)
              null, // To address (null for Transfer)
              tokenId, // Token ID
            ],
          };
          const logs = await useContractRead({
            address: CONTRACT_ADDRESS,
            abi: contractABI,
            functionName: 'queryFilter',
            args: [filter, 0, "latest"],
          })
          if (logs.result.length > 0) {
            txHash = logs.result[0].transactionHash
          }
        }
        setCertificateData({
          documentName: meta.name || "Untitled Document",
          trustScore: meta.trustScore || 0,
          tokenId,
          transactionHash: txHash,
          blockchain: "Educhain Testnet",
          ipfsUrl,
          mintedDate: meta.timestamp ? new Date(meta.timestamp).toLocaleDateString() : "-",
          author: meta.author || "",
          institution: meta.institution || "",
        })
      } catch (err: any) {
        setError(err.message || "Failed to fetch certificate")
      } finally {
        setLoading(false)
      }
    }
    fetchCertificate()
  }, [id, address])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-mintellect-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading certificate...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
          <RippleButton onClick={() => window.location.reload()} className="mt-4">
            Retry
          </RippleButton>
        </div>
      </div>
    )
  }

  if (!certificateData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-mintellect-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Certificate not found or data incomplete.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-mintellect-primary/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <header className="relative z-10 border-b border-gray-800 py-8 bg-black">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
          >
            Academic Trust Certificate
          </motion.h1>
          <p className="text-gray-400 max-w-md">
            This document has been verified for academic integrity and minted as an NFT on the blockchain.
          </p>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
                    <a
                      href={`https://edu-chain-testnet.blockscout.com/tx/${certificateData.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <RippleButton variant="outline" className="w-full flex items-center justify-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        <span>View on Blockchain</span>
                      </RippleButton>
                    </a>
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
                <Link href="/dashboard/nft-gallery">
                  <RippleButton variant="outline">View Gallery</RippleButton>
                </Link>
                <Link href="/dashboard/documents">
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
