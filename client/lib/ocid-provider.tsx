"use client"
/** @jsxImportSource react */

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useOCAuth } from "@opencampus/ocid-connect-js"

type OCIDContextType = {
  ocid: string | null
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const OCIDContext = createContext<OCIDContextType>({
  ocid: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
})

export const useOCID = () => useContext(OCIDContext)

export const OCIDProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast()
  const { isInitialized, authState, ocAuth } = useOCAuth()
  const [isConnecting, setIsConnecting] = useState(false)

  const connect = async () => {
    setIsConnecting(true)
    try {
      await ocAuth.signInWithRedirect({
        state: "opencampus",
        redirectUri: "http://localhost:3000/redirect", // Update to the correct redirect URI
        referralCode: "PARTNER6", // Add referral code
        domain: "", // Leave blank to use the current domain
        sameSite: true, // Specify SameSite behavior
      })
    } catch (error) {
      console.error("Login error:", error)
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: (error as Error).message || "Failed to initiate OCID connection",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    ocAuth.signOut()
    toast({
      title: "OCID Disconnected",
      description: "Your OCID has been disconnected",
    })
  }

  useEffect(() => {
    if (authState?.error) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: authState.error.message,
      })
    }
  }, [authState?.error])

  return (
    <OCIDContext.Provider
      value={{
        ocid: authState?.OCId || null,
        isConnected: authState?.isAuthenticated || false,
        isConnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </OCIDContext.Provider>
  )
}

