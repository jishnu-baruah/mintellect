"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ChevronLeft, Upload, Tags, FileText, Lock, Unlock, DollarSign, Info } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import Link from "next/link"

const CATEGORIES = [
  "Computer Science",
  "Environmental Science",
  "Medicine",
  "Information Technology",
  "Ethics",
  "Urban Planning",
  "Physics",
  "Mathematics",
  "Psychology",
  "Economics",
]

export default function PublishPaperPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [abstract, setAbstract] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [content, setContent] = useState("")
  const [isPremium, setIsPremium] = useState(false)
  const [price, setPrice] = useState("9.99")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be an API call to save the paper
      console.log("Paper submitted:", {
        title,
        abstract,
        category,
        tags: tags.split(",").map((tag) => tag.trim()),
        content,
        isPremium,
        price: isPremium ? Number.parseFloat(price) : 0,
      })

      setIsSubmitting(false)

      // Show success and redirect to community page
      router.push("/community?published=true")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar showProfile={true} /> removed, navbar is now only in layout */}

      <header className="border-b border-gray-800 py-4 backdrop-blur-md bg-gray-900/80 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <Link
              href="/community"
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Community</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Publish Research Paper</h1>

          <form onSubmit={handleSubmit}>
            <GlassCard className="mb-6">
              <div className="mb-6">
                <label htmlFor="title" className="block font-medium mb-2">
                  Paper Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary"
                  placeholder="Enter the title of your research paper"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="abstract" className="block font-medium mb-2">
                  Abstract <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="abstract"
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary min-h-[120px]"
                  placeholder="Write a brief summary of your research paper"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="category" className="block font-medium mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary"
                    required
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block font-medium mb-2">
                    <div className="flex items-center gap-1">
                      <Tags className="h-4 w-4" />
                      <span>Tags (comma-separated)</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary"
                    placeholder="e.g. machine learning, neural networks, AI"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="content" className="block font-medium mb-2">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>
                      Paper Content <span className="text-red-500">*</span>
                    </span>
                  </div>
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary min-h-[400px] font-mono"
                  placeholder="# Introduction

Write your paper content here using Markdown formatting.

## Section 1

Your content goes here...

## Section 2

More content..."
                  required
                />
                <p className="mt-2 text-sm text-gray-400">
                  Use Markdown formatting for your paper content. Headings, lists, and basic formatting are supported.
                </p>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2 mb-4">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      checked={isPremium}
                      onChange={(e) => setIsPremium(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-mintellect-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                  </div>

                  <div className="flex items-center">
                    {isPremium ? (
                      <Lock className="h-5 w-5 text-yellow-500 mr-2" />
                    ) : (
                      <Unlock className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <span className="font-medium">
                      {isPremium ? "Premium Paper (Paid Access)" : "Open Access Paper"}
                    </span>
                  </div>
                </label>

                {isPremium && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-14 mt-2"
                  >
                    <div className="flex flex-col gap-2">
                      <label htmlFor="price" className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-yellow-500" />
                        <span>Price (USD)</span>
                      </label>
                      <div className="flex items-center">
                        <span className="absolute ml-3 text-gray-400">$</span>
                        <input
                          type="number"
                          id="price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          min="0.99"
                          step="0.01"
                          className="w-32 pl-8 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary"
                          required={isPremium}
                        />
                      </div>
                      <p className="text-sm text-gray-400 flex items-start gap-2 mt-1">
                        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>We recommend pricing between $4.99 and $19.99 based on paper length and complexity.</span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="mb-6">
                <label className="font-medium mb-2 block">Upload .docx Files</label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 hover:border-gray-500 transition-colors">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="h-12 w-12 text-gray-500 mb-4" />
                    <p className="text-gray-400 mb-2">
                      Drag and drop your .docx files here, or click to select file
                    </p>
                    <p className="text-xs text-gray-500">Upload your .docx files (Max 50MB)</p>
                    <button
                      type="button"
                      className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Select File
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h2 className="text-xl font-bold mb-4">Certification</h2>
              <p className="text-gray-300 mb-4">By submitting this paper, you certify that:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-300 mb-6">
                <li>You are the author or have permission from the authors to publish this work</li>
                <li>The content is original and does not infringe on the intellectual property rights of others</li>
                <li>All sources and references are properly cited</li>
                <li>The research was conducted ethically and in accordance with relevant standards</li>
              </ul>

              <div className="flex items-center gap-3 mb-6">
                <input
                  type="checkbox"
                  id="certification"
                  className="h-4 w-4 rounded border-gray-700 text-mintellect-primary focus:ring-mintellect-primary/20"
                  required
                />
                <label htmlFor="certification" className="text-sm">
                  I certify that the above statements are true and I understand the terms of publishing on Mintellect
                </label>
              </div>

              <div className="flex gap-3">
                <Link href="/community">
                  <RippleButton type="button" variant="outline">
                    Cancel
                  </RippleButton>
                </Link>
                <RippleButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Publishing</span>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    </>
                  ) : (
                    "Publish Paper"
                  )}
                </RippleButton>
              </div>
            </GlassCard>
          </form>
        </div>
      </main>
    </div>
  )
}
