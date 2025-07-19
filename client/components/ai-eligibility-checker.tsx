"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "./ui/glass-card"
import { RippleButton } from "./ui/ripple-button"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

interface EligibilityScore {
  overall: number
  originality: number
  citations: number
  structure: number
  language: number
}

interface EligibilityFeedback {
  type: "success" | "warning" | "error"
  message: string
}

interface AIEligibilityCheckerProps {
  documentId: string;
  eligible?: boolean;
  error?: string;
  onComplete?: () => void;
}

export function AIEligibilityChecker({ documentId, eligible, error, onComplete }: AIEligibilityCheckerProps) {
  // Show real eligibility result from parent

  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-400"
    if (value >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBackground = (value: number) => {
    if (value >= 80) return "bg-green-400"
    if (value >= 60) return "bg-yellow-400"
    return "bg-red-400"
  }

  return (
    <GlassCard className="w-full">
      <h2 className="text-2xl font-bold mb-6">Eligibility Check</h2>
      {typeof eligible === 'boolean' ? (
        eligible ? (
          <div className="text-green-500 text-lg font-semibold text-center py-8">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            Document is eligible for plagiarism check.
          </div>
        ) : (
          <div className="text-red-500 text-lg font-semibold text-center py-8">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            {error || 'Document is not eligible.'}
          </div>
        )
      ) : (
        <div className="text-gray-400 text-center py-8">
          <Info className="h-8 w-8 mx-auto mb-2" />
          Upload a document to check eligibility.
        </div>
      )}
      <div className="mt-6 flex justify-end">
        <RippleButton onClick={() => onComplete && onComplete()} disabled={!eligible}>
          Continue to Next Step
        </RippleButton>
      </div>
    </GlassCard>
  )
}
