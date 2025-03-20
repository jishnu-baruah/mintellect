"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FuturisticButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  icon?: React.ReactNode
  disabled?: boolean
}

export function FuturisticButton({
  children,
  onClick,
  className,
  variant = "primary",
  size = "md",
  icon,
  disabled = false,
}: FuturisticButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-primary-light to-secondary text-white",
    secondary: "bg-ui-card border border-primary-light text-white",
    outline: "bg-transparent border border-primary-light text-white",
  }

  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-6 py-3",
    lg: "text-lg px-8 py-4",
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative rounded-md font-medium transition-all duration-300",
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative flex items-center justify-center gap-2 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {icon && (
          <motion.span
            className="mr-2"
            initial={{ x: -5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {icon}
          </motion.span>
        )}
        {children}
      </motion.div>
    </motion.button>
  )
}

