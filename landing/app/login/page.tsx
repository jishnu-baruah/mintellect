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
    const ocidParam = searchParams.get('ocid')
    const tokenParam = searchParams.get('token')
    const successParam = searchParams.get('success')

    // Clear any existing errors
    setError('')

    // Only show error if there's an explicit error parameter and it's not a success case
    if (errorParam === 'authentication_failed' && !successParam && !ocidParam) {
      setError('Authentication failed. Please try connecting your OCID again.')
    }

    // If we have OCID from redirect, clear any errors
    if (ocidParam || successParam) {
      setError('')
    }
  }, [searchParams])

  const connectToOcid = async () => {
    try {
      setError("")
      console.log('Initiating OCID connection...')
      if (!ocAuth) {
        throw new Error('OCID authentication not initialized');
      }
      await ocAuth.signInWithRedirect({ 
        state: 'opencampus',
        redirectUri: 'https://www.mintellect.xyz/redirect'
      })
    } catch (error: any) {
      console.error('OCID connection error:', error)
      setError(typeof error === 'string' ? error : error?.message || "Failed to connect with OCID. Please try again.")
    }
  }

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!isInitialized) {
      setError("Authentication system is initializing. Please wait...")
      return
    }

    if (!authState?.OCId && !searchParams.get('ocid')) {
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
      const ocid = authState?.OCId || searchParams.get('ocid')
      const token = authState?.accessToken || searchParams.get('token')
      
      // Redirect to app.mintellect.xyz with the auth token and email
      const redirectUrl = `https://app.mintellect.xyz?token=${token}&email=${encodeURIComponent(email)}&ocid=${ocid}`;
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
    <div className="min-h-screen bg-black">
      <Navbar />
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <GlassCard className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome to Mintellect</h1>
              <p className="text-gray-400">Connect your OCID and enter your email to continue</p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {(!authState?.OCId && !searchParams.get('ocid')) ? (
              <RippleButton
                onClick={connectToOcid}
                className="w-full mb-4"
                disabled={isSubmitting}
              >
                <Shield className="w-5 h-5 mr-2" />
                Connect OCID
              </RippleButton>
            ) : (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400">OCID Connected: {authState?.OCId || searchParams.get('ocid')}</p>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-mintellect-primary"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <RippleButton
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5 mr-2" />
                )}
                Continue
              </RippleButton>
            </form>
          </GlassCard>
        </div>
      </div>
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

