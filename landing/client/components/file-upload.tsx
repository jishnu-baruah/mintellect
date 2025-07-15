"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelected: (file: File) => void
  isUploading: boolean
  isSuccess: boolean
  error: string | null
  className?: string
}

export function FileUpload({ onFileSelected, isUploading, isSuccess, error, className }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setFileName(file.name)
      onFileSelected(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          disabled={isUploading || isSuccess}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          {fileName ? "Change File" : "Select PDF File"}
        </Button>
      </div>

      {fileName && (
        <div className="flex items-center gap-2 text-sm">
          {isSuccess ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : isUploading ? (
            <div className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          ) : (
            <div className="h-4 w-4" />
          )}
          <span className={isSuccess ? "text-green-500" : "text-foreground"}>{fileName}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

