"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface FlipWordsProps {
  words: string[]
  className?: string
  duration?: number
  align?: "left" | "center" | "right"
}

export function FlipWords({ words, className = "", duration = 2000, align = "center" }: FlipWordsProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, duration)

    return () => clearInterval(interval)
  }, [words.length, duration])

  return (
    <span className="inline-block relative whitespace-nowrap" style={{ marginLeft: "-100px" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className={`pl-16 ${className}`}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

