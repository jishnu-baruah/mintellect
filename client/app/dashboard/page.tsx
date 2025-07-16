"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { RippleButton } from "@/components/ui/ripple-button"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedLogo } from "@/components/ui/animated-logo"
import { Upload, ArrowRight, FileText } from "lucide-react"
import { ethers } from "ethers"
import contractABI from "@/lib/MintellectNFT_ABI.json"
import { useWallet } from "@/components/wallet-provider"

const CONTRACT_ADDRESS = "0x4c899A624F23Fe64E9e820b62CfEd4aFAAA93004"

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [greeting, setGreeting] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [recentNFTs, setRecentNFTs] = useState<any[]>([])
  const [activityLoading, setActivityLoading] = useState(false)
  const { walletAddress } = useWallet();

  useEffect(() => {
    setIsLoaded(true)
    updateGreeting()
    const interval = setInterval(updateGreeting, 1000)
    return () => clearInterval(interval)
  }, [])

  const updateGreeting = () => {
    const now = new Date()
    const hour = now.getHours()
    const name = "User"
    let newGreeting = ""
    if (hour < 12) newGreeting = `Good morning, ${name}`
    else if (hour < 17) newGreeting = `Good afternoon, ${name}`
    else if (hour < 21) newGreeting = `Good evening, ${name}`
    else newGreeting = `Good night, ${name}`
    setGreeting(newGreeting)
    setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
  }

  useEffect(() => {
    const fetchRecentNFTs = async () => {
      setActivityLoading(true)
      try {
        if (!(window as any).ethereum) return
        const provider = new ethers.BrowserProvider((window as any).ethereum)
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider)
        const total = await contract.tokenCounter()
        const accounts = await provider.send("eth_accounts", [])
        const currentAddress = accounts[0]?.toLowerCase()
        const nfts: any[] = []
        for (let i = Number(total) - 1; i >= 0 && nfts.length < 3; i--) {
          try {
            const tokenId = i.toString()
            const tokenURI = await contract.tokenURI(tokenId)
            const owner = (await contract.ownerOf(tokenId)).toLowerCase()
            if (owner !== currentAddress) continue
            const ipfsUrl = tokenURI.startsWith("ipfs://")
              ? `https://gateway.pinata.cloud/ipfs/${tokenURI.replace("ipfs://", "")}`
              : tokenURI
            const metaRes = await fetch(ipfsUrl)
            const meta = await metaRes.json()
            nfts.push({
              tokenId,
              documentName: meta.name || "Untitled Document",
              mintedDate: meta.timestamp ? new Date(meta.timestamp).toLocaleDateString() : "-",
              certificateUrl: `/certificates/${tokenId}`,
            })
          } catch {}
        }
        setRecentNFTs(nfts)
      } catch {}
      setActivityLoading(false)
    }
    fetchRecentNFTs()
  }, [walletAddress])

  return (
    <div className="min-h-screen bg-black relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-mintellect-primary/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <header className="relative z-10 border-b border-gray-800 py-8 bg-black">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
          {/* Removed <AnimatedLogo /> */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
            >
              Dashboard
            </motion.h1>
            <p className="text-gray-400 max-w-md text-sm md:text-base">
              Your web3 research hub.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content - Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:w-2/3"
          >
            <GlassCard className="h-full overflow-hidden transition-all duration-300">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-mintellect-primary" />
                  Recent Activity
                </h2>
                <Link href="/dashboard/documents">
                  <button className="text-mintellect-primary text-sm flex items-center hover:underline">
                    View All <ArrowRight className="h-3 w-3 ml-1" />
                  </button>
                </Link>
              </div>
              {activityLoading ? (
                <div className="text-gray-400 text-sm">Loading recent activity...</div>
              ) : recentNFTs.length === 0 ? (
                <div className="text-gray-400 text-sm">No recent activity</div>
              ) : (
                <ul className="w-full space-y-3">
                  {recentNFTs.map((nft) => (
                    <li key={nft.tokenId} className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 last:pb-0">
                      <div className="flex-1">
                        <span className="font-medium text-white">{nft.documentName}</span>
                        <span className="ml-2 text-xs text-gray-500">Minted {nft.mintedDate}</span>
                      </div>
                      <Link href={nft.certificateUrl} className="mt-2 sm:mt-0">
                        <RippleButton size="sm" variant="outline" className="px-4 py-1 font-medium">
                          View
                        </RippleButton>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </GlassCard>
          </motion.div>

          {/* Right column - Upload Paper */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:w-1/3 space-y-6"
          >
            <GlassCard className="overflow-hidden relative">
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-mintellect-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-10 w-40 h-40 bg-mintellect-secondary/5 rounded-full blur-3xl"></div>
              <div className="relative flex flex-col items-center text-center p-6">
                <div className="p-3 rounded-full bg-mintellect-primary/10 mb-4 border border-mintellect-primary/20 glow-sm">
                  <Upload className="h-8 w-8 text-mintellect-primary" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">New Research</h2>
                <Link href="/workflow" className="w-full">
                  <RippleButton
                    className="w-full bg-gradient-to-r from-mintellect-primary to-mintellect-secondary text-sm md:text-base py-2.5 md:py-3"
                    variant="glowing"
                    fullWidth
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    <span className="whitespace-nowrap">Upload Paper</span>
                  </RippleButton>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
