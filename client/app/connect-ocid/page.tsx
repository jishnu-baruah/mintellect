"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import { Navbar } from "@/components/navbar"
import { Shield, ArrowRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function ConnectOcidPage() {
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect back to dashboard or previous page
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background with subtle tech pattern */}
      <div className="fixed inset-0 -z-10">
        <AnimatedBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black opacity-90"></div>
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      {/* <Navbar showProfile={true} /> removed, navbar is now only in layout */}

      <main className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <GlassCard className="p-8 border-mintellect-primary/20 relative overflow-hidden">
              <div className="flex justify-center mb-6">
                <div className="p-3 rounded-full bg-mintellect-primary/10 border border-mintellect-primary/30 glow-sm">
                  <Shield className="h-8 w-8 text-mintellect-primary" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-center mb-6">Connect OCID</h1>

              <p className="text-gray-300 mb-6 text-center">
                Connect your Open Campus ID to verify your academic identity and enhance your Mintellect experience.
              </p>

              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 mb-6">
                <h2 className="font-medium mb-2">What is OCID?</h2>
                <p className="text-sm text-gray-400 mb-4">
                  Open Campus ID provides a persistent digital identifier that distinguishes you from other researchers
                  and supports automated links between your professional activities.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-blue-500">
                    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
                    <path d="M12 6a3 3 0 100 6 3 3 0 000-6zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span>OCID is trusted by researchers worldwide</span>
                </div>
              </div>

              <RippleButton onClick={handleConnect} className="w-full" disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Connect OCID
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </RippleButton>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
