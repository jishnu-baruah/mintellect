"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FuturisticCardProps {
  children: React.ReactNode
  className?: string
  accentColor?: string
}

export function FuturisticCard({ children, className, accentColor = "#3a6bc4" }: FuturisticCardProps) {
  return (
    <motion.div
      className={cn("relative rounded-xl bg-ui-card border border-ui-border p-6 overflow-hidden text-white", className)}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {/* Animated accent line at the top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        style={{
          background: `linear-gradient(to right, ${accentColor}, transparent 80%)`,
        }}
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />

      {/* Content */}
      <div className="relative z-10 text-white">{children}</div>
    </motion.div>
  )
}

