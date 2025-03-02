"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@v0/components/ui/use-toast"

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

export const OCIDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ocid, setOCID] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const savedOCID = localStorage.getItem("ocid")
    if (savedOCID) {
      setOCID(savedOCID)
    }
  }, [])

  const connect = async () => {
    setIsConnecting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockOCID = "0000-0000-0000-" + Math.random().toString(16).slice(2, 6)

      setOCID(mockOCID)
      localStorage.setItem("ocid", mockOCID)

      toast({
        title: "OCID Connected",
        description: `Connected with OCID: ${mockOCID}`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect OCID. Please try again.",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setOCID(null)
    localStorage.removeItem("ocid")
    toast({
      title: "OCID Disconnected",
      description: "Your OCID has been disconnected",
    })
  }

  return (
    <OCIDContext.Provider
      value={{
        ocid,
        isConnected: !!ocid,
        isConnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </OCIDContext.Provider>
  )
}

