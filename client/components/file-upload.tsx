"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Loader2, FileArchive } from "lucide-react"
import { cn } from "@/lib/utils"
import { RippleButton } from "./ui/ripple-button"
import { GlassCard } from "./ui/glass-card"

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  onAnalysisComplete?: (files: File[]) => void
  maxFiles?: number
  acceptedFileTypes?: string[]
}

type FileStatus = "uploading" | "processing" | "complete" | "error"

interface UploadedFile {
  file: File
  id: string
  status: FileStatus
  progress: number
  error?: string
}

export function FileUpload({
  onFilesSelected,
  onAnalysisComplete,
  maxFiles = 1,
  acceptedFileTypes = [".doc", ".docx", ".txt", ".tex"],
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [analyzing, setAnalyzing] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragging) {
      setIsDragging(true)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    // Filter files by accepted types
    const validFiles = files.filter((file) => {
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
      return acceptedFileTypes.includes(fileExtension)
    })

    // Only allow one file per submission
    if (uploadedFiles.length + validFiles.length > maxFiles) {
      alert(`You can only upload one file per submission.`)
      return
    }

    // Add files to state with initial status
    const newFiles = validFiles.slice(0, 1).map((file) => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      status: "uploading" as FileStatus,
      progress: 0,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])
    onFilesSelected(newFiles.map(f => f.file))

    // Simulate file upload and processing
    newFiles.forEach((fileObj) => {
      simulateFileUpload(fileObj.id)
    })
  }

  const simulateFileUpload = (fileId: string) => {
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((f) => {
          if (f.id === fileId) {
            const newProgress = Math.min(f.progress + 10, 100)

            // When upload completes, change to processing
            if (newProgress === 100 && f.status === "uploading") {
              clearInterval(uploadInterval)
              simulateProcessing(fileId)
              return { ...f, progress: newProgress, status: "processing" }
            }

            return { ...f, progress: newProgress }
          }
          return f
        }),
      )
    }, 300)
  }

  const simulateProcessing = (fileId: string) => {
    // Simulate processing time (2 seconds)
    setTimeout(() => {
      setUploadedFiles((prev) =>
        prev.map((f) => {
          if (f.id === fileId) {
            // 90% chance of success, 10% chance of error for demo purposes
            const success = Math.random() > 0.1
            return {
              ...f,
              status: success ? "complete" : "error",
              error: success ? undefined : "Error processing file.",
            }
          }
          return f
        }),
      )
    }, 2000)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold mb-6">Upload LaTeX Files</h2>

        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 transition-all duration-200 ease-in-out",
            isDragging ? "border-mintellect-primary bg-mintellect-primary/10" : "border-gray-700 hover:border-gray-500",
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: isDragging ? 1.1 : 1 }}
              className="mb-4 p-4 rounded-full bg-mintellect-primary/10"
            >
              <FileArchive className="h-10 w-10 md:h-12 md:w-12 text-mintellect-primary" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">{isDragging ? "Drop files here" : "Drag & Drop LaTeX .zip"}</h3>
            <p className="text-gray-400 mb-4">
              or{" "}
              <button className="text-mintellect-primary hover:underline" onClick={openFileDialog}>
                browse
              </button>
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <span className="px-2 py-1 bg-gray-800 rounded-full">.zip only</span>
              <span className="mx-2">•</span>
              <span className="px-2 py-1 bg-gray-800 rounded-full">Max 50MB</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedFileTypes.join(",")}
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Uploaded Files</h4>
            <div className="space-y-3">
              <AnimatePresence>
                {uploadedFiles.map((fileObj) => (
                  <motion.div
                    key={fileObj.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-800 rounded-lg p-4 relative"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <FileArchive className="h-6 w-6 text-mintellect-primary" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="truncate pr-6">
                            <p className="font-medium truncate">{fileObj.file.name}</p>
                            <p className="text-xs text-gray-400">{(fileObj.file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <button
                            onClick={() => removeFile(fileObj.id)}
                            className="text-gray-400 hover:text-white absolute top-4 right-4"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-2">
                          {fileObj.status === "uploading" && (
                            <>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Uploading...</span>
                                <span>{fileObj.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-1.5">
                                <motion.div
                                  className="bg-mintellect-primary h-1.5 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${fileObj.progress}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                            </>
                          )}

                          {fileObj.status === "processing" && (
                            <div className="flex items-center text-xs text-yellow-400">
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              <span>Processing...</span>
                            </div>
                          )}

                          {fileObj.status === "complete" && (
                            <div className="flex items-center text-xs text-green-400">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              <span>Ready</span>
                            </div>
                          )}

                          {fileObj.status === "error" && (
                            <div className="flex items-center text-xs text-red-400">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              <span>{fileObj.error || "Error"}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {uploadedFiles.some((f) => f.status === "complete") && (
              <div className="mt-6">
                <RippleButton
                  className="w-full"
                  onClick={() => {
                    setAnalyzing(true)
                    // Simulate analysis completion
                    setTimeout(() => {
                      setAnalyzing(false)
                      // Call the onAnalysisComplete prop
                      if (onAnalysisComplete)
                        onAnalysisComplete(uploadedFiles.filter((f) => f.status === "complete").map((f) => f.file))
                    }, 2000)
                  }}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    "Analyze Files"
                  )}
                </RippleButton>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 border-t border-gray-700 pt-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="flex items-center gap-1 text-xs text-gray-400 px-2 py-1 bg-gray-800 rounded-full">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>.tex files</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 px-2 py-1 bg-gray-800 rounded-full">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>.bib files</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 px-2 py-1 bg-gray-800 rounded-full">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>style files</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 px-2 py-1 bg-gray-800 rounded-full">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>images</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
