"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

export function AnimatedLogo({ className, size = "small" }: { className?: string; size?: "small" | "large" }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const isLarge = size === "large"
  // Logo image size (make this bigger)
  const logoSize = isLarge ? 160 : 64;

  return (
    <div className={`relative ${className}`}>
      {/* Main logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
          rotate: isVisible ? 0 : -10,
        }}
        whileInView={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          scale: {
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        }}
        className="relative z-10"
      >
        <Image
          src="/images/Mintellect_logo__1_-removebg-preview (1).png"
          alt="Mintellect Logo"
          width={logoSize}
          height={logoSize}
        />
      </motion.div>
      {/* Removed background animation and orbiting particles */}
    </div>
  )
}
