"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface FlipWordsProps {
  words: string[]
  className?: string
  duration?: number
}

export function FlipWords({ words, className = "", duration = 2000 }: FlipWordsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, duration)

    return () => clearInterval(interval)
  }, [words, duration])

  const currentWord = words[currentIndex]
  const letters = currentWord.split("")

  return (
    <span className={cn("inline-flex justify-end", className)}>
      <AnimatePresence mode="wait">
        {letters.map((letter, i) => (
          <motion.span
            key={`${currentIndex}-${i}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
              duration: 0.2,
              delay: (letters.length - i - 1) * 0.05, // Animate from right to left
              ease: "easeOut",
            }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 font-bold"
            style={{
              textShadow: "0 0 5px rgba(59, 130, 246, 0.15)",
              filter: "drop-shadow(0 0 1px rgba(59, 130, 246, 0.1))",
            }}
          >
            {letter}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  )
}
