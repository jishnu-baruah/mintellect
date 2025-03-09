"use client"
/** @jsxImportSource react */

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { useOCAuth } from '@opencampus/ocid-connect-js'
import { useToast } from "@/components/ui/use-toast"

const CallbackPage = () => {
  const { ocAuth } = useOCAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await ocAuth.handleRedirectCallback()
        router.push('/') // Redirect to the home page or another page after successful authentication
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
  }, [ocAuth, router, toast])

  return <div>Loading...</div>
}

export default CallbackPage
