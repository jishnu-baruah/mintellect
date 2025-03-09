"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useOCAuth } from "@opencampus/ocid-connect-js"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const UserTokenPage: React.FC = () => {
  const { isInitialized, authState, ocAuth, OCId } = useOCAuth()
  const [error, setError] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isInitialized && authState.isAuthenticated && ocAuth) {
        try {
          const authStateData = await ocAuth.getAuthState()
          const userInfoData = await ocAuth.getUserInfo()
          setUserInfo({
            authState: authStateData,
            userInfo: userInfoData,
          })
        } catch (err) {
          setError("Failed to fetch user information")
          console.error(err)
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch user information",
          })
        }
      }
    }

    fetchUserInfo()
  }, [isInitialized, authState.isAuthenticated, ocAuth, toast])

  const handleLogin = async () => {
    try {
      await ocAuth?.signInWithRedirect()
    } catch (err) {
      setError("Login error: " + (err instanceof Error ? err.message : "undefined"))
      console.error("Login error:", err)
      toast({
        variant: "destructive",
        title: "Login Error",
        description: (err instanceof Error ? err.message : "An error occurred during login"),
      })
    }
  }

  if (!isInitialized) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Not Authenticated</CardTitle>
            <CardDescription>Please connect your OCID to view token information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogin}>Connect with OCID</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>User Token Information</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Authentication State:</h2>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">{JSON.stringify(userInfo?.authState, null, 2)}</pre>
          <h2 className="text-xl font-semibold mt-4 mb-2">User Information:</h2>
          <p>
            <strong>OCId:</strong> {OCId ?? "N/A"}
          </p>
          <p>
            <strong>Ethereum Address:</strong> {userInfo?.userInfo?.ethereumAddress ?? "N/A"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserTokenPage

