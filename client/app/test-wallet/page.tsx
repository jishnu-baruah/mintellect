"use client"

import { WalletTest } from "@/components/wallet-test"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function TestWalletPage() {
  const [isDevMode, setIsDevMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if we're in development mode
    const checkDevMode = () => {
      const isDev = process.env.NODE_ENV === 'development'
      setIsDevMode(isDev)
      setIsLoading(false)
      
      // Redirect to dashboard if not in dev mode
      if (!isDev) {
        router.push('/dashboard')
      }
    }
    
    checkDevMode()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isDevMode) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Wallet Connection Test</h1>
        <WalletTest />
      </div>
    </div>
  )
} 