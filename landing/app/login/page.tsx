"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import { Navbar } from "@/components/navbar"
import { Shield, ArrowRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useOCAuth } from '@opencampus/ocid-connect-js'
import { Suspense } from "react"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const { ocAuth, authState, isInitialized } = useOCAuth()

  useEffect(() => {
    // Check for error in URL parameters
    const errorParam = searchParams.get('error')
    if (errorParam === 'authentication_failed') {
      setError('Authentication failed. Please try again.')
    }
  }, [searchParams])

  const connectToOcid = async () => {
    try {
      setError("")
      await ocAuth.signInWithRedirect({ 
        state: 'opencampus',
        redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/redirect`
      })
    } catch (error: any) {
      console.error('OCID connection error:', error)
      setError(error.message || "Failed to connect with OCID. Please try again.")
    }
  }

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!isInitialized) {
      setError("Authentication system is initializing. Please wait...")
      return
    }

    if (!authState?.isAuthenticated) {
      setError("Please connect your OCID first")
      return
    }

    if (!email) {
      setError("Please enter your email")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Redirect to app.mintellect.xyz with the auth token and email
      const redirectUrl = `https://app.mintellect.xyz?token=${authState?.accessToken}&email=${encodeURIComponent(email)}`;
      window.location.href = redirectUrl;
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Login failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mintellect-primary mx-auto mb-4"></div>
          <p>Initializing authentication system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background with subtle tech pattern */}
      <div className="fixed inset-0 -z-10">
        <AnimatedBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black opacity-90"></div>
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      <Navbar />

      <main className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <GlassCard className="p-8 border-mintellect-primary/20 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-mintellect-primary/5 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-mintellect-secondary/5 rounded-full blur-3xl -z-10"></div>

              <div className="flex justify-center mb-6">
                <div className="p-3 rounded-full bg-mintellect-primary/10 border border-mintellect-primary/30 glow-sm">
                  <Shield className="h-8 w-8 text-mintellect-primary" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-center mb-6">Login with OCID</h1>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary/50 focus:border-mintellect-primary/50 transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="ocid" className="block text-sm font-medium text-gray-300">
                        OCID
                      </label>
                      <span className="text-xs text-mintellect-primary">Required</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="ocid"
                        value={authState?.OCId || ""}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary/50 focus:border-mintellect-primary/50 transition-colors"
                        placeholder="Connect your OCID"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {authState?.isAuthenticated && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-2 w-2 bg-green-400 rounded-full"
                          />
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <RippleButton
                        type="button"
                        variant={authState?.isAuthenticated ? "outline" : "default"}
                        size="sm"
                        className="w-full"
                        onClick={connectToOcid}
                        disabled={isSubmitting || authState?.isAuthenticated}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : authState?.isAuthenticated ? (
                          <>Connected</>
                        ) : (
                          <>Connect to OCID</>
                        )}
                      </RippleButton>
                    </div>
                  </div>

                  <div>
                    <RippleButton type="submit" className="w-full" disabled={isSubmitting || !authState?.isAuthenticated}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        <>
                          Login
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </RippleButton>
                  </div>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-mintellect-primary hover:underline">
                    Register here
                  </Link>
                </p>
              </div>

              {/* Decorative tech pattern */}
              <div className="absolute bottom-2 right-2 opacity-10">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="30" cy="30" r="20" stroke="url(#paint0_linear)" strokeWidth="0.5" />
                  <circle cx="30" cy="30" r="10" stroke="url(#paint0_linear)" strokeWidth="0.5" />
                  <defs>
                    <linearGradient id="paint0_linear" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6366f1" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mintellect-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}

