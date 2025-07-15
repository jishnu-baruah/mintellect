"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function PageLoader({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Much faster progress increments
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress((prev) => {
          // Larger increments for faster loading
          const increment = Math.random() * 55 + 45 // Bigger jumps
          const newProgress = Math.min(prev + increment, 100)

          if (newProgress === 100) {
            // Minimal delay before completing
            setTimeout(() => {
              onLoadingComplete()
            }, 50) // Reduced from 100ms to 50ms
          }

          return newProgress
        })
      }
    }, 20) // Reduced from 50ms to 30ms

    return () => clearTimeout(timer)
  }, [progress, onLoadingComplete])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-lg"
      initial={{ opacity: 1 }}
      animate={{ opacity: progress === 100 ? 0 : 1 }}
      transition={{ duration: 0.15 }} // Reduced from 0.3 to 0.2
    >
      {/* Simplified background grid */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0,transparent_70%)]"></div>
        <div className="h-full w-full bg-[linear-gradient(to_right,#0000_1px,transparent_1px),linear-gradient(to_bottom,#0000_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(circle,white,transparent_80%)]"></div>
      </div>

      <div className="relative mb-12">
        {/* Simplified outer glow effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />

        {/* Single ripple effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/30"
          style={{ width: "70px", height: "70px" }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.4, 0],
            scale: [0.5, 1.5, 2],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
          }}
        />

        {/* Main SVG container - simplified */}
        <svg className="relative w-28 h-28 md:w-32 md:h-32" viewBox="0 0 100 100">
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress / 100 }}
            transition={{ duration: 0.05, ease: "easeInOut" }} // Faster transition
            style={{
              strokeDasharray: "251.2",
              strokeDashoffset: "0",
              transformOrigin: "center",
              transform: "rotate(-90deg)",
              filter: "drop-shadow(0 0 2px rgba(59, 130, 246, 0.4))",
            }}
          />

          {/* M Logo with glow effect */}
          <g transform="translate(25, 25) scale(0.5)" filter="url(#glow)">
            <path
              fill="#013ca4"
              d="M 186.121094 130.828125 C 198.433594 123.742188 214.179688 127.949219 221.273438 140.246094 L 272.726562 229.261719 C 279.867188 241.558594 275.609375 257.285156 263.34375 264.371094 C 251.03125 271.457031 235.28125 267.253906 228.1875 254.953125 L 176.734375 165.941406 C 169.59375 153.644531 173.804688 137.960938 186.121094 130.828125 Z M 186.121094 130.828125 "
              fillOpacity="1"
              fillRule="evenodd"
            />
            <path
              fill="#0175e4"
              d="M 189.050781 264.371094 C 176.734375 271.457031 160.988281 267.253906 153.894531 254.953125 L 102.441406 165.941406 C 95.347656 153.644531 99.558594 137.960938 111.871094 130.828125 C 124.140625 123.742188 139.886719 127.949219 146.980469 140.246094 L 198.480469 229.261719 C 205.574219 241.558594 201.363281 257.285156 189.050781 264.371094 Z M 189.050781 264.371094 "
              fillOpacity="1"
              fillRule="evenodd"
            />
            <path
              fill="#73b7ff"
              d="M 260.414062 130.828125 C 272.726562 123.742188 288.472656 127.949219 295.570312 140.246094 C 302.664062 152.546875 298.453125 168.273438 286.140625 175.359375 C 273.824219 182.445312 258.078125 178.238281 250.984375 165.941406 C 243.886719 153.644531 248.101562 137.960938 260.414062 130.828125 Z M 114.757812 264.371094 C 102.441406 271.457031 86.742188 267.253906 79.601562 254.953125 C 72.503906 242.703125 76.71875 226.972656 89.03125 219.886719 C 101.34375 212.757812 117.089844 217.007812 124.1875 229.261719 C 131.28125 241.558594 127.070312 257.285156 114.757812 264.371094 Z M 114.757812 264.371094 "
              fillOpacity="1"
              fillRule="evenodd"
            />
          </g>

          {/* Gradients and filters */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0036B2" />
              <stop offset="100%" stopColor="#73B7FF" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>

        {/* Reduced orbiting particles - only 1 instead of 2 */}
        {[...Array(1)].map((_, i) => {
          const angle = (i * 180 * Math.PI) / 180
          const radius = 50
          const delay = i * 0.15

          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full"
              style={{
                background: i % 2 === 0 ? "#0175E4" : "#73B7FF",
                boxShadow: i % 2 === 0 ? "0 0 8px 1px rgba(1, 117, 228, 0.6)" : "0 0 8px 1px rgba(115, 183, 255, 0.6)",
                marginLeft: "-0.75px",
                marginTop: "-0.75px",
              }}
              animate={{
                x: Array.from({ length: 3 }, (_, j) => Math.cos(angle + (j * Math.PI) / 2) * radius),
                y: Array.from({ length: 3 }, (_, j) => Math.sin(angle + (j * Math.PI) / 2) * radius),
                scale: [1, 1.3, 1],
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay,
              }}
            />
          )
        })}
      </div>

      <motion.div
        className="text-center relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2 tracking-wider">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">MINTELLECT</span>
        </h2>
        <div className="flex items-center justify-center gap-2">
          <div className="text-blue-400 text-sm font-light tracking-widest">LOADING</div>
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`dot-${i}`}
                className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                animate={{
                  y: [0, -4, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        </div>
        <div className="mt-3 text-blue-300 text-sm font-mono">
          <motion.span>{Math.round(progress)}%</motion.span>
        </div>
      </motion.div>
    </motion.div>
  )
}
