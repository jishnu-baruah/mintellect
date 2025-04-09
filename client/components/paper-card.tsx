"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, Eye, ArrowRight, Award, Lock, TrendingUp } from "lucide-react"
import { GlassCard } from "./ui/glass-card"
import { RippleButton } from "./ui/ripple-button"

interface Paper {
  id: string
  title: string
  author: string
  institution: string
  date: string
  category: string
  tags: string[]
  abstract: string
  views: number
  citations: number
  isPremium: boolean
  trustScore: number
  thumbnailUrl: string
}

interface PaperCardProps {
  paper: Paper
  isResearcher?: boolean
}

export function PaperCard({ paper, isResearcher = false }: PaperCardProps) {
  const formattedDate = new Date(paper.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 80) return "text-green-300"
    if (score >= 70) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <GlassCard className="overflow-hidden hover:border-mintellect-primary/30 transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:flex-1 order-2 md:order-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-mintellect-primary/10 rounded text-xs font-medium text-mintellect-primary">
                {paper.category}
              </span>
              {paper.isPremium && (
                <span className="px-2 py-1 bg-yellow-500/10 rounded text-xs font-medium text-yellow-500 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Premium
                </span>
              )}
              <span
                className={`ml-auto ${getScoreColor(paper.trustScore)} text-sm font-medium flex items-center gap-1`}
              >
                <Award className="h-4 w-4" />
                {paper.trustScore}
              </span>
            </div>

            <Link href={`/community/papers/${paper.id}`}>
              <h2 className="text-xl font-bold mb-2 hover:text-mintellect-primary transition-colors line-clamp-2">
                {paper.title}
              </h2>
            </Link>

            <div className="flex flex-wrap items-center text-sm text-gray-400 mb-3">
              <span className="font-medium text-white">{paper.author}</span>
              <span className="mx-2">•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formattedDate}
              </span>
            </div>

            <p className="text-gray-300 mb-4 line-clamp-2">{paper.abstract}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {paper.views.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {paper.citations.toLocaleString()}
                </div>
              </div>

              <Link href={`/community/papers/${paper.id}`}>
                <RippleButton size="sm" className="flex items-center gap-1">
                  {paper.isPremium ? "Preview" : "Read"}
                  <ArrowRight className="h-4 w-4" />
                </RippleButton>
              </Link>
            </div>
          </div>

          <div className="md:w-1/3 order-1 md:order-2 relative">
            <div className="w-full h-32 md:h-full min-h-[120px] relative overflow-hidden rounded-lg">
              <Image src={paper.thumbnailUrl || "/placeholder.svg"} alt={paper.title} fill className="object-cover" />
              {paper.isPremium && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex items-end p-2">
                  <span className="flex items-center gap-1 text-xs bg-yellow-500/90 text-black font-medium px-2 py-1 rounded">
                    <Lock className="h-3 w-3" /> Premium
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
