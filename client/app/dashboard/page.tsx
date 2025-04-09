"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { RippleButton } from "@/components/ui/ripple-button"
import { GlassCard } from "@/components/ui/glass-card"
import { FileText, Upload, BarChart2, Award, Eye, ArrowRight } from "lucide-react"

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [greeting, setGreeting] = useState("")
  const [currentTime, setCurrentTime] = useState("")

  // Initialize greeting and time
  useEffect(() => {
    setIsLoaded(true)
    updateGreeting()

    // Update time every second
    const interval = setInterval(updateGreeting, 1000)
    return () => clearInterval(interval)
  }, [])

  // Function to update greeting and time
  const updateGreeting = () => {
    const now = new Date()
    const hour = now.getHours()
    const name = "User" // You could replace this with the user's name if available

    let newGreeting = ""
    if (hour < 12) newGreeting = `Good morning, ${name}`
    else if (hour < 17) newGreeting = `Good afternoon, ${name}`
    else if (hour < 21) newGreeting = `Good evening, ${name}`
    else newGreeting = `Good night, ${name}`

    setGreeting(newGreeting)
    setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="py-6 px-4 hide-scrollbar">
        {/* Welcome section with real-time greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {isLoaded ? greeting : "Welcome, User"}
          </h1>
          <p className="text-gray-400 mt-1">
            Welcome to your Mintellect dashboard
            <span className="ml-2 text-sm text-gray-500">
              {isLoaded ? currentTime : ""}
            </span>
          </p>
        </motion.div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left column - Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <GlassCard className="h-full bg-black/70 border-gray-800/50">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">Recent Activity</h2>
                <Link href="/documents">
                  <button className="text-mintellect-primary text-sm flex items-center hover:underline">
                    View All <ArrowRight className="h-3 w-3 ml-1" />
                  </button>
                </Link>
              </div>

              <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-center px-2">
                <FileText className="h-8 w-8 sm:h-12 sm:w-12 mb-3 sm:mb-4 text-gray-700" />
                <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">No recent activity</p>
                <Link href="/workflow" className="w-full sm:w-auto">
                  <RippleButton variant="outline" size="sm" className="w-full sm:w-auto" fullWidth>
                    Start New Paper
                  </RippleButton>
                </Link>
              </div>
            </GlassCard>
          </motion.div>

          {/* Right column - Upload and Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Upload card */}
            <GlassCard className="bg-black/70 border-gray-800/50 overflow-hidden relative">
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-mintellect-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-10 w-40 h-40 bg-mintellect-secondary/5 rounded-full blur-3xl"></div>

              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="p-2 sm:p-3 rounded-full bg-mintellect-primary/10 mb-3 sm:mb-4 border border-mintellect-primary/20 glow-sm">
                    <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-mintellect-primary" />
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">New Research</h2>

                  <Link href="/workflow" className="w-full">
                    <RippleButton
                      className="w-full bg-gradient-to-r from-mintellect-primary to-mintellect-secondary text-sm md:text-base py-2 sm:py-2.5 md:py-3"
                      variant="glowing"
                      fullWidth
                    >
                      <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      <span className="whitespace-nowrap">Upload Paper</span>
                    </RippleButton>
                  </Link>
                </div>
              </div>
            </GlassCard>

            {/* Quick links */}
            <GlassCard className="bg-black/70 border-gray-800/50">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">Quick Access</h2>
              <div className="space-y-1.5 sm:space-y-3">
                <QuickLinkItem title="Verification" icon={FileText} href="/workflow" />
                <QuickLinkItem title="Documents" icon={Eye} href="/documents" />
                <QuickLinkItem title="Analytics" icon={BarChart2} href="/analytics" />
                <QuickLinkItem title="Certificates" icon={Award} href="/nft-gallery" />
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

// Quick Link Item Component
function QuickLinkItem({
  title,
  icon: Icon,
  href,
}: {
  title: string
  icon: React.ElementType
  href: string
}) {
  return (
    <Link href={href} className="block w-full">
      <div className="flex items-center gap-3 p-3 md:p-3.5 rounded-lg hover:bg-gray-900/50 transition-colors group">
        <div className="p-1.5 sm:p-2 rounded-lg bg-gray-800 group-hover:bg-mintellect-primary/20 transition-colors flex-shrink-0">
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-mintellect-primary" />
        </div>
        <h3 className="font-medium text-xs sm:text-sm text-white group-hover:text-mintellect-primary transition-colors truncate">
          {title}
        </h3>
        <ArrowRight className="h-3.5 w-3.5 ml-auto text-gray-500 group-hover:text-mintellect-primary transition-colors" />
      </div>
    </Link>
  )
}
