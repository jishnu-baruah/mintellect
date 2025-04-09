"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import { Shield, ArrowRight, Loader2, X } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface RegistrationModalProps {
  onClose: () => void
}

export function RegistrationModal({ onClose }: RegistrationModalProps) {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [ocid, setOcid] = useState("")
  const [email, setEmail] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const connectToOcid = async () => {
    setIsConnecting(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate successful connection with mock values
    const mockOcid = "ocid_3b3wzr1ip"
    const mockEmail = "researcher@university.edu"

    setOcid(mockOcid)
    setEmail(mockEmail)
    setIsConnecting(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!ocid || !email) {
      setError("Please connect your OCID first")
      return
    }

    if (!firstName || !lastName) {
      setError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    setError("")

    // Prepare the data to submit
    const userData = {
      firstName,
      lastName,
      ocid,
      email,
    }

    // Submit to API
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      // Redirect to dashboard on success
      router.push("/dashboard")
    } catch (err) {
      setError("Registration failed. Please try again.")
      setIsSubmitting(false)
    }
  }

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-6 border-mintellect-primary/20 relative overflow-hidden">
          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-mintellect-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-mintellect-secondary/5 rounded-full blur-3xl -z-10"></div>

          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-full bg-mintellect-primary/10 border border-mintellect-primary/30 glow-sm">
              <Shield className="h-8 w-8 text-mintellect-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-6">Register for Mintellect</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* OCID Connection Section */}
              <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-800 mb-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Academic Identity</h2>
                  <div className="px-2 py-1 bg-mintellect-primary/10 rounded text-xs font-medium text-mintellect-primary">
                    Required
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="ocid" className="block text-sm font-medium text-gray-300">
                        OCID
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="ocid"
                        value={ocid}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary/50 focus:border-mintellect-primary/50 transition-colors"
                        placeholder="Connect your OCID"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {ocid && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-2 w-2 bg-green-400 rounded-full"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">
                      Academic Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary/50 focus:border-mintellect-primary/50 transition-colors"
                      placeholder="Your academic email"
                    />
                  </div>

                  <RippleButton
                    type="button"
                    variant={ocid ? "outline" : "default"}
                    size="sm"
                    className="w-full"
                    onClick={connectToOcid}
                    disabled={isConnecting || !!ocid}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : ocid ? (
                      <>Connected</>
                    ) : (
                      <>Connect to OCID</>
                    )}
                  </RippleButton>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                <h2 className="text-lg font-medium mb-4">Personal Information</h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-gray-300">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary/50 focus:border-mintellect-primary/50 transition-colors"
                      placeholder="First name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-gray-300">
                      Last Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary/50 focus:border-mintellect-primary/50 transition-colors"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <RippleButton type="submit" className="w-full" disabled={isSubmitting || !ocid || !email}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </RippleButton>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-mintellect-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
