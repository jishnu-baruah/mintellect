"use client"

import { motion } from "framer-motion"
import { FileText, Check, Clock, AlertCircle } from "lucide-react"
import { RippleButton } from "./ui/ripple-button"
import { useRouter } from "next/navigation"

interface Document {
  id: string
  name: string
  status: string
  date?: string
}

interface DocumentListProps {
  documents: Document[]
  onSelectDocument: (id: string) => void
}

export function DocumentList({ documents, onSelectDocument }: DocumentListProps) {
  const router = useRouter()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
      case "approved":
      case "trust_scored":
        return <Check className="h-4 w-4 text-green-400" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-yellow-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "uploaded":
        return "Uploaded"
      case "analyzed":
        return "Analysis Complete"
      case "eligibility_checked":
        return "Eligibility Checked"
      case "plagiarism_checked":
        return "Plagiarism Checked"
      case "trust_scored":
        return "Trust Score Generated"
      case "complete":
        return "Processing Complete"
      case "approved":
        return "Approved"
      case "rejected":
        return "Rejected"
      default:
        return "Processing"
    }
  }

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-4">Recent Documents</h2>

      {documents.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-700 rounded-lg">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400">No documents uploaded yet</p>
          <p className="text-gray-500 text-sm mt-1">Upload a document to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-10 w-10 text-mintellect-primary" />
                  <div>
                    <h3 className="font-medium">{doc.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      {getStatusIcon(doc.status)}
                      <span>{getStatusText(doc.status)}</span>
                      {doc.date && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{doc.date}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <RippleButton
                  size="sm"
                  onClick={() => {
                    // If the document is complete, navigate to results page
                    if (doc.status === "trust_scored" || doc.status === "complete") {
                      router.push(`/results/${doc.id}`)
                    } else {
                      onSelectDocument(doc.id)
                    }
                  }}
                >
                  {doc.status === "trust_scored" || doc.status === "complete" ? "View Results" : "View"}
                </RippleButton>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
