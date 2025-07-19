"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { RippleButton } from "@/components/ui/ripple-button"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedLogo } from "@/components/ui/animated-logo"
import { Upload, ArrowRight, FileText, Clock, CheckCircle, AlertCircle, Play, Shield, Target } from "lucide-react"
import { ethers } from "ethers"
import contractABI from "@/lib/MintellectNFT_ABI.json"
import { useWallet } from "@/components/wallet-provider"
import { workflowPersistence } from "@/lib/workflow-persistence"

const CONTRACT_ADDRESS = "0x4c899A624F23Fe64E9e820b62CfEd4aFAAA93004"

interface RecentActivity {
  id: string
  type: 'workflow' | 'nft' | 'document'
  title: string
  status: string
  date: string
  description: string
  actionUrl: string
  icon: React.ReactNode
}

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [greeting, setGreeting] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
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
    const fetchRecentActivities = async () => {
      setActivityLoading(true)
      try {
        const activities: RecentActivity[] = []

        // 1. Get current workflow
        const currentWorkflow = workflowPersistence.getWorkflowState()
        if (currentWorkflow) {
          activities.push({
            id: currentWorkflow.documentId,
            type: 'workflow',
            title: currentWorkflow.documentName || 'Current Document',
            status: getWorkflowStatus(currentWorkflow),
            date: new Date(currentWorkflow.updatedAt || currentWorkflow.createdAt).toLocaleDateString(),
            description: getWorkflowDescription(currentWorkflow),
            actionUrl: '/workflow',
            icon: <Play className="h-4 w-4" />
          })
        }

        // 2. Get archived workflows
        try {
          const archivedWorkflows = await workflowPersistence.getArchivedWorkflows()
          const recentArchives = archivedWorkflows
            .slice(0, 3) // Limit to 3 most recent
            .map(workflow => ({
              id: workflow.documentId,
              type: 'workflow' as const,
              title: workflow.documentName || 'Archived Document',
              status: workflow.status || 'completed',
              date: new Date(workflow.updatedAt || workflow.createdAt).toLocaleDateString(),
              description: getArchiveDescription(workflow),
              actionUrl: `/documents`,
              icon: <CheckCircle className="h-4 w-4" />
            }))
          activities.push(...recentArchives)
        } catch (error) {
          console.error('Failed to fetch archived workflows:', error)
        }

        // 3. Get recent NFTs (keep existing functionality)
        try {
          if ((window as any).ethereum) {
            const provider = new ethers.BrowserProvider((window as any).ethereum)
            const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider)
            const total = await contract.tokenCounter()
            const accounts = await provider.send("eth_accounts", [])
            const currentAddress = accounts[0]?.toLowerCase()
            
            for (let i = Number(total) - 1; i >= 0 && activities.length < 6; i--) {
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
                activities.push({
                  id: `nft-${tokenId}`,
                  type: 'nft',
                  title: meta.name || "Untitled Document",
                  status: 'minted',
                  date: meta.timestamp ? new Date(meta.timestamp).toLocaleDateString() : "-",
                  description: "NFT Certificate minted",
                  actionUrl: `/certificates/${tokenId}`,
                  icon: <Target className="h-4 w-4" />
                })
              } catch {}
            }
          }
        } catch (error) {
          console.error('Failed to fetch NFTs:', error)
        }

        // Sort by date (most recent first)
        activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        
        // Limit to 6 most recent activities
        setRecentActivities(activities.slice(0, 6))
      } catch (error) {
        console.error('Failed to fetch recent activities:', error)
      }
      setActivityLoading(false)
    }
    fetchRecentActivities()
  }, [walletAddress])

  const getWorkflowStatus = (workflow: any) => {
    if (!workflow) return 'unknown'
    if (workflow.step === 'completed') return 'completed'
    if (workflow.step === 'nft-minting') return 'minting'
    if (workflow.step === 'human-review') return 'review'
    if (workflow.step === 'trust-score') return 'analyzing'
    if (workflow.step === 'plagiarism-check') return 'checking'
    if (workflow.step === 'upload') return 'uploaded'
    return 'in-progress'
  }

  const getWorkflowDescription = (workflow: any) => {
    const status = getWorkflowStatus(workflow)
    switch (status) {
      case 'completed': return 'Workflow completed successfully'
      case 'minting': return 'NFT certificate being minted'
      case 'review': return 'Awaiting human review'
      case 'analyzing': return 'Trust score analysis in progress'
      case 'checking': return 'Plagiarism check in progress'
      case 'uploaded': return 'Document uploaded, ready to start'
      default: return 'Workflow in progress'
    }
  }

  const getArchiveDescription = (workflow: any) => {
    if (workflow.status === 'completed') return 'Workflow completed and archived'
    if (workflow.status === 'minted') return 'NFT certificate minted'
    return 'Document processed and archived'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'minted':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'checking':
      case 'analyzing':
      case 'minting':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'review':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-mintellect-primary/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <header className="relative z-10 border-b border-gray-800 py-8 bg-black">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-start gap-6">
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
                <Link href="/documents">
                  <button className="text-mintellect-primary text-sm flex items-center hover:underline">
                    View All <ArrowRight className="h-3 w-3 ml-1" />
                  </button>
                </Link>
              </div>
              {activityLoading ? (
                <div className="text-gray-400 text-sm">Loading recent activity...</div>
              ) : recentActivities.length === 0 ? (
                <div className="text-gray-400 text-sm">No recent activity</div>
              ) : (
                <ul className="w-full space-y-3">
                  {recentActivities.map((activity) => (
                    <li key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 last:pb-0">
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {activity.icon}
                          {getStatusIcon(activity.status)}
                        </div>
                        <div>
                          <span className="font-medium text-white">{activity.title}</span>
                          <div className="text-xs text-gray-500 mt-1">
                            {activity.description} • {activity.date}
                          </div>
                        </div>
                      </div>
                      <Link href={activity.actionUrl} className="mt-2 sm:mt-0">
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
