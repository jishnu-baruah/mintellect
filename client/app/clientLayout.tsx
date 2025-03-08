"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import { useToast } from "@/components/ui/use-toast"

const inter = Inter({ subsets: ["latin"] })

// OCID Provider Logic
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

function OCIDProvider({ children }: { children: React.ReactNode }) {
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
      const mockOCID = "0x" + Math.random().toString(16).slice(2, 10)

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

// Root Layout Component
export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  useEffect(() => {
    // This runs only on the client after hydration
    // It ensures any class differences between server and client are reconciled
    if (typeof window !== "undefined") {
      document.body.classList.add("web3-bg", "min-h-screen")
    }
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} web3-bg min-h-screen`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <OCIDProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Toaster />
            </div>
          </OCIDProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

