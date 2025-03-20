"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionTitleProps {
  title: string
  subtitle?: string
  className?: string
  centered?: boolean
}

export function SectionTitle({ title, subtitle, className, centered = true }: SectionTitleProps) {
  return (
    <motion.div
      className={cn("mb-8", centered ? "text-center" : "text-left", className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative inline-block">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10 bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent">
          {title}
        </h2>

        {/* Decorative elements - simplified */}
        <motion.div
          className={`absolute -left-2 ${centered ? "-right-2" : "w-1/2"} h-[1px] bottom-3 bg-gradient-to-r from-primary-light to-transparent`}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>

      {subtitle && (
        <motion.p
          className="text-lg text-white/70 max-w-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}

