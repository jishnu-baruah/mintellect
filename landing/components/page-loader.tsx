"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface PageLoaderProps {
  onLoadingComplete: () => void
}

export default function PageLoader({ onLoadingComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress((prevProgress) => {
          const increment = Math.random() * 15
          const newProgress = Math.min(prevProgress + increment, 100)

          if (newProgress === 100) {
            setTimeout(onLoadingComplete, 500)
          }

          return newProgress
        })
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [progress, onLoadingComplete])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 375" className="w-16 h-16 mb-8">
          <motion.path
            fill="#013ca4"
            d="M 186.121094 130.828125 C 198.433594 123.742188 214.179688 127.949219 221.273438 140.246094 L 272.726562 229.261719 C 279.867188 241.558594 275.609375 257.285156 263.34375 264.371094 C 251.03125 271.457031 235.28125 267.253906 228.1875 254.953125 L 176.734375 165.941406 C 169.59375 153.644531 173.804688 137.960938 186.121094 130.828125 Z M 186.121094 130.828125 "
            fillOpacity="1"
            fillRule="evenodd"
            initial={{ fillOpacity: 0 }}
            animate={{ fillOpacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.path
            fill="#0175e4"
            d="M 189.050781 264.371094 C 176.734375 271.457031 160.988281 267.253906 153.894531 254.953125 L 102.441406 165.941406 C 95.347656 153.644531 99.558594 137.960938 111.871094 130.828125 C 124.140625 123.742188 139.886719 127.949219 146.980469 140.246094 L 198.480469 229.261719 C 205.574219 241.558594 201.363281 257.285156 189.050781 264.371094 Z M 189.050781 264.371094 "
            fillOpacity="1"
            fillRule="evenodd"
            initial={{ fillOpacity: 0 }}
            animate={{ fillOpacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
          />
          <motion.path
            fill="#73b7ff"
            d="M 260.414062 130.828125 C 272.726562 123.742188 288.472656 127.949219 295.570312 140.246094 C 302.664062 152.546875 298.453125 168.273438 286.140625 175.359375 C 273.824219 182.445312 258.078125 178.238281 250.984375 165.941406 C 243.886719 153.644531 248.101562 137.960938 260.414062 130.828125 Z M 114.757812 264.371094 C 102.441406 271.457031 86.742188 267.253906 79.601562 254.953125 C 72.503906 242.703125 76.71875 226.972656 89.03125 219.886719 C 101.34375 212.757812 117.089844 217.007812 124.1875 229.261719 C 131.28125 241.558594 127.070312 257.285156 114.757812 264.371094 Z M 114.757812 264.371094 "
            fillOpacity="1"
            fillRule="evenodd"
            initial={{ fillOpacity: 0 }}
            animate={{ fillOpacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.6 }}
          />
        </svg>
      </div>

      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-blue-400 text-sm"
      >
        Loading Mintellect...
      </motion.div>
    </div>
  )
}

