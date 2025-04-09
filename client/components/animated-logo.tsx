"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

export function AnimatedLogo({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

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
        <Image src="/images/mintellect-logo.png" alt="Mintellect Logo" width={40} height={40} className="w-10 h-10" />
      </motion.div>

      {/* Glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: isVisible ? [0.3, 0.7, 0.3] : 0,
          scale: isVisible ? [0.9, 1.1, 0.9] : 0,
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute inset-0 blur-lg bg-blue-500 rounded-full opacity-30 z-0"
      />

      {/* Orbiting particle 1 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute z-20"
        style={{ top: "-5px", right: "-5px" }}
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{ transformOrigin: "center center", width: "50px", height: "50px" }}
        >
          <motion.div
            className="w-2 h-2 bg-blue-300 rounded-full absolute"
            style={{ left: "50%", top: "0%" }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.div>
      </motion.div>

      {/* Orbiting particle 2 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="absolute z-20"
        style={{ bottom: "-5px", left: "-5px" }}
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            direction: "reverse",
          }}
          style={{ transformOrigin: "center center", width: "50px", height: "50px" }}
        >
          <motion.div
            className="w-2 h-2 bg-blue-300 rounded-full absolute"
            style={{ left: "50%", top: "0%" }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
