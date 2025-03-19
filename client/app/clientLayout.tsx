"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import { OCConnect } from "@opencampus/ocid-connect-js"
import { useOCAuth } from "@opencampus/ocid-connect-js"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const { isInitialized, authState } = useOCAuth()
  const [redirectUri, setRedirectUri] = useState("")

  // Set redirectUri after hydration
  useEffect(() => {
    if (typeof window !== "undefined") {
      setRedirectUri(`${window.location.origin}/redirect`)
    }
  }, [])

  // Handle authentication state changes
  useEffect(() => {
    if (!isInitialized) return // Wait for SDK initialization
    
    if (authState.isAuthenticated) {
      // Redirect to home page after successful connection
      router.push("/")
    }
  }, [isInitialized, authState.isAuthenticated, router])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} web3-bg min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {redirectUri && (
            <OCConnect
              opts={{
                redirectUri,
                referralCode: "PARTNER6",
              }}
              sandboxMode={true}
            >
              <AuthWrapper>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Toaster />
                </div>
              </AuthWrapper>
            </OCConnect>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isInitialized, authState } = useOCAuth()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !authState.isAuthenticated) {
      router.push("/login")
    }
  }, [isInitialized, authState.isAuthenticated, router])

  if (!isInitialized) {
    return <div className="container flex h-screen items-center justify-center">Initializing...</div>
  }

  if (authState.error) {
    return (
      <div className="container flex h-screen items-center justify-center">
        Error: {authState.error.message}
      </div>
    )
  }

  return <>{children}</>
}