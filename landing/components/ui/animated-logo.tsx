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
  const logoSize = isLarge ? 120 : 40
  const particleSize = isLarge ? 6 : 2
  const orbitSize = isLarge ? 150 : 50
  const glowSize = isLarge ? "blur-xl" : "blur-lg"
  const particleCount = isLarge ? 3 : 2

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
          src="/mintellect-logo.png"
          alt="Mintellect Logo"
          width={logoSize}
          height={logoSize}
          className={`w-${isLarge ? "30" : "10"} h-${isLarge ? "30" : "10"}`}
        />
      </motion.div>

      {/* Pulsing glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className={`absolute inset-0 ${glowSize} bg-blue-500 rounded-full z-0`}
        style={{
          width: logoSize,
          height: logoSize,
          left: "0",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />

      {/* Orbiting particles */}
      {[...Array(particleCount)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
          className="absolute z-20"
          style={{
            left: logoSize / 2,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3 + index * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              direction: index % 2 === 0 ? "normal" : "reverse",
            }}
            style={{
              transformOrigin: "center center",
              width: orbitSize + index * 20,
              height: orbitSize + index * 20,
              position: "relative",
            }}
          >
            <motion.div
              className={`bg-blue-${300 + index * 100} rounded-full absolute`}
              style={{
                width: particleSize,
                height: particleSize,
                left: "50%",
                top: "0%",
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.5,
              }}
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Digital circuit lines (only for large logo) */}
      {isLarge && (
        <>
          <motion.div
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: [0, 1, 0.8],
            }}
            transition={{
              duration: 2,
              delay: 0.8,
            }}
            className="absolute z-5"
            style={{
              left: logoSize / 2,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <svg
              width={logoSize * 3}
              height={logoSize * 3}
              viewBox="0 0 360 360"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.path
                d="M180 60 L180 30"
                stroke="rgba(59, 130, 246, 0.5)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 1 }}
              />
              <motion.path
                d="M180 300 L180 330"
                stroke="rgba(59, 130, 246, 0.5)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 1.2 }}
              />
              <motion.path
                d="M60 180 L30 180"
                stroke="rgba(59, 130, 246, 0.5)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 1.4 }}
              />
              <motion.path
                d="M300 180 L330 180"
                stroke="rgba(59, 130, 246, 0.5)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 1.6 }}
              />
              <motion.circle
                cx="180"
                cy="180"
                r="90"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <motion.circle
                cx="180"
                cy="180"
                r="120"
                stroke="rgba(59, 130, 246, 0.2)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, delay: 0.7 }}
              />
            </svg>
          </motion.div>

          {/* Data points */}
          {[45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
            <motion.div
              key={`data-point-${index}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.4,
                delay: 1.5 + index * 0.1,
              }}
              className="absolute w-1.5 h-1.5 rounded-full bg-blue-400"
              style={{
                left: logoSize / 2 + Math.cos((angle * Math.PI) / 180) * 90,
                top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 90}px)`,
                transform: "translateY(-50%)",
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}

