"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Search, Filter, Upload, Plus, X } from "lucide-react"
import { RippleButton } from "@/components/ui/ripple-button"
import { Breadcrumb } from "@/components/breadcrumb"
import Link from "next/link"

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // Empty state - no mock data
  const documents: any[] = []

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus ? doc.status === selectedStatus : true
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-[80vh] relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="mb-4">
          <Breadcrumb />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            Documents
          </h1>
          <div className="flex gap-3 w-full sm:w-auto">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <RippleButton variant="outline" className="w-full sm:w-auto">
                Back to Dashboard
              </RippleButton>
            </Link>
            <RippleButton
              onClick={() => setIsUploadModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </RippleButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glassmorphic-card p-6 rounded-xl mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <select
                className="px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-auto"
                value={selectedStatus || ""}
                onChange={(e) => setSelectedStatus(e.target.value || null)}
              >
                <option value="">All Status</option>
                <option value="complete">Complete</option>
                <option value="processing">Processing</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-all w-full sm:w-auto justify-center">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glassmorphic-card rounded-xl overflow-hidden"
        >
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="relative mb-6"
            >
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="relative bg-gray-800/80 p-6 rounded-full border border-gray-700">
                <FileText className="h-16 w-16 text-blue-400" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              No Documents Yet
            </h2>
            <p className="text-gray-400 max-w-md mb-8">
              Upload your first document to begin the verification process. We support various document formats
              including PDF, DOCX, and more.
            </p>
            <RippleButton
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Your First Document
            </RippleButton>
          </div>
        </motion.div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glassmorphic-card border border-gray-700 rounded-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h3 className="text-xl font-bold">Upload Document</h3>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 mb-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300 mb-2">Drag and drop your document here</p>
                  <p className="text-gray-500 text-sm">or</p>
                  <button className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                    Browse Files
                  </button>
                  <p className="text-gray-500 text-xs mt-4">Supported formats: PDF, DOCX, TXT, RTF (Max size: 20MB)</p>
                </div>
                <div className="flex justify-end gap-3">
                  <RippleButton variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                    Cancel
                  </RippleButton>
                  <RippleButton className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400">
                    Upload Document
                  </RippleButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
