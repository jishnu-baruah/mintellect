"use client"

import { useEffect, useState } from "react"
import { ethers } from "ethers"
import contractABI from "@/lib/MintellectNFT_ABI.json"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { RippleButton } from "@/components/ui/ripple-button"
import { GlassCard } from "@/components/ui/glass-card"
import { Download, Calendar, Filter, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import Link from "next/link"
import { motion } from "framer-motion"
import { useWallet } from "@/components/wallet-provider"

const CONTRACT_ADDRESS = "0x4c899A624F23Fe64E9e820b62CfEd4aFAAA93004"
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("This Month")
  const [nfts, setNfts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { walletAddress } = useWallet();

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true)
      setError(null)
      try {
        if (!(window as any).ethereum) throw new Error("MetaMask not found")
        const provider = new ethers.BrowserProvider((window as any).ethereum)
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider)
        const total = await contract.tokenCounter()
        const nfts: any[] = []
        for (let i = 0; i < Number(total); i++) {
          try {
            const tokenId = i.toString()
            const tokenURI = await contract.tokenURI(tokenId)
            const owner = (await contract.ownerOf(tokenId)).toLowerCase()
            // Only include NFTs owned by the connected wallet
            if (!walletAddress || owner !== walletAddress.toLowerCase()) continue
            const ipfsUrl = tokenURI.startsWith("ipfs://")
              ? `https://gateway.pinata.cloud/ipfs/${tokenURI.replace("ipfs://", "")}`
              : tokenURI
            const metaRes = await fetch(ipfsUrl)
            const meta = await metaRes.json()
            nfts.push({
              tokenId,
              documentName: meta.name || "Untitled Document",
              trustScore: meta.trustScore || 0,
              mintedDate: meta.timestamp ? new Date(meta.timestamp) : null,
              category: meta.category || "Uncategorized",
              owner,
            })
          } catch {}
        }
        setNfts(nfts)
      } catch (err: any) {
        setError(err.message || "Failed to fetch NFTs")
      } finally {
        setLoading(false)
      }
    }
    fetchNFTs()
  }, [walletAddress])

  // Compute stats
  const totalPapers = nfts.length
  const certificatesIssued = nfts.length
  const avgTrustScore = nfts.length ? (nfts.reduce((sum, n) => sum + n.trustScore, 0) / nfts.length).toFixed(1) : "-"
  const rejectionRate = "0%" // Not tracked in metadata

  // Activity over time (by month)
  const monthlyMap: Record<string, { papers: number; certificates: number }> = {}
  nfts.forEach((n) => {
    if (!n.mintedDate) return
    const key = n.mintedDate.toLocaleString("default", { month: "short", year: "numeric" })
    if (!monthlyMap[key]) monthlyMap[key] = { papers: 0, certificates: 0 }
    monthlyMap[key].papers++
    monthlyMap[key].certificates++
  })
  const monthlyData = Object.entries(monthlyMap).map(([name, v]) => ({ name, ...v }))

  // Category data
  const categoryMap: Record<string, number> = {}
  nfts.forEach((n) => {
    categoryMap[n.category] = (categoryMap[n.category] || 0) + 1
  })
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))

  // Trust score distribution
  const scoreBuckets = [
    { name: "90-100", count: 0 },
    { name: "80-89", count: 0 },
    { name: "70-79", count: 0 },
    { name: "60-69", count: 0 },
    { name: "Below 60", count: 0 },
  ]
  nfts.forEach((n) => {
    if (n.trustScore >= 90) scoreBuckets[0].count++
    else if (n.trustScore >= 80) scoreBuckets[1].count++
    else if (n.trustScore >= 70) scoreBuckets[2].count++
    else if (n.trustScore >= 60) scoreBuckets[3].count++
    else scoreBuckets[4].count++
  })

  // Recent activity (last 5 NFTs)
  const recentNFTs = [...nfts].sort((a, b) => (b.mintedDate?.getTime() || 0) - (a.mintedDate?.getTime() || 0)).slice(0, 5)

  // Custom tooltip for the line chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 border border-gray-800 rounded-lg shadow-lg">
          <p className="font-medium text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
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
            Analytics Overview
          </motion.h1>
          <p className="text-gray-400 max-w-md">
            Get a quick, visual summary of your research activity and trust scores on Mintellect. All data is live from the blockchain.
          </p>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 relative z-10">
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-10"
        >
          <Link href="/dashboard" className="w-full sm:w-auto">
            <RippleButton variant="outline" className="w-full sm:w-auto px-6 py-2 text-base">
              Back to Dashboard
            </RippleButton>
          </Link>
          <RippleButton className="w-full sm:w-auto px-6 py-2 text-base" variant="glowing">
            <Download className="h-5 w-5 mr-2" />
            Export Data
          </RippleButton>
        </motion.div>

        {/* Stats overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <StatCard title="Total Papers" value={totalPapers} />
          <StatCard title="Average Trust Score" value={avgTrustScore} />
          <StatCard title="Most Popular Category" value={categoryData.length ? categoryData[0].name : '-'} />
        </motion.div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Papers Over Time */}
          <GlassCard className="bg-black/70 border-mintellect-primary/30 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-4 text-mintellect-primary">Papers Over Time</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="papers" stroke="#00C49F" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Categories */}
          <GlassCard className="bg-black/70 border-mintellect-secondary/30 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-4 text-mintellect-secondary">Categories</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        {/* Trust Score Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <GlassCard className="bg-black/70 border-mintellect-primary/30 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-4 text-mintellect-primary">Trust Score Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreBuckets} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#8884d8">
                    {scoreBuckets.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </main>
    </div>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <GlassCard className="bg-black/70 border-gray-800/50 p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
      <h3 className="text-lg text-gray-300 mb-2 font-semibold group-hover:text-mintellect-primary transition-colors duration-200">
        {title}
      </h3>
      <p className="text-4xl font-extrabold text-white group-hover:text-mintellect-primary transition-colors duration-200">
        {value}
      </p>
    </GlassCard>
  )
}

// Activity Item Component
function ActivityItem({
  title,
  description,
  time,
  score,
  isRejected = false,
}: {
  title: string
  description: string
  time: string
  score: number
  isRejected?: boolean
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-400">{description}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
      {isRejected ? (
        <div className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-medium">Rejected</div>
      ) : (
        <div className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</div>
      )}
    </div>
  )
}
