"use client"
/** @jsxImportSource react */

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useOCAuth } from "@opencampus/ocid-connect-js"
import { useToast } from "@/components/ui/use-toast"

const CallbackPage = () => {
  const { ocAuth } = useOCAuth() || {}
  const { toast } = useToast()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !ocAuth) return

    const handleCallback = async () => {
      try {
        const authState = await ocAuth.handleRedirectCallback()
        if (authState?.idToken) {
          router.push("/") // Redirect to the home page after successful authentication
        } else {
          throw new Error("Login process is not completed")
        }
      } catch (error) {
        console.error("Callback error:", error)
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: (error as Error).message || "Failed to complete authentication",
        })
      }
    }

    handleCallback()
  }, [isClient, ocAuth, router, toast])

  if (!isClient) {
    return <div suppressHydrationWarning>Loading...</div>
  }

  return <div>Loading...</div>
}

export default CallbackPage
