"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { useEffect, useRef } from "react"

interface GridBackgroundProps {
  className?: string
  children?: React.ReactNode
  gridColor?: string
  fadeColor?: string
}

export default function GridBackground({
  className,
  children,
  gridColor = "#3b82f6", // Default blue color
  fadeColor = "black",
}: GridBackgroundProps) {
  const dotsCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = dotsCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create dots - REDUCED COUNT by 60%
    const dots: { x: number; y: number; size: number; speed: number; opacity: number }[] = []
    const dotCount = Math.floor((canvas.width * canvas.height) / 40000) // Further reduced density

    for (let i = 0; i < dotCount; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.4, // Smaller dots
        speed: Math.random() * 0.15 + 0.05, // Slower speed
        opacity: Math.random() * 0.3 + 0.1, // Reduced opacity
      })
    }

    // Optimized animation loop with throttling
    let lastTime = 0
    const fps = 24 // Limit to 24fps for better performance
    const interval = 1000 / fps

    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime

      if (deltaTime > interval) {
        lastTime = timestamp - (deltaTime % interval)

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        dots.forEach((dot) => {
          // Update position - move upward
          dot.y -= dot.speed

          // Reset position if dot goes off screen
          if (dot.y < -10) {
            dot.y = canvas.height + 10
            dot.x = Math.random() * canvas.width
          }

          // Draw dot
          ctx.beginPath()
          ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(59, 130, 246, ${dot.opacity})`
          ctx.fill()
        })
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    let animationFrameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className={cn("relative flex w-full items-center justify-center", className)}>
      {/* Simplified grid with larger spacing and reduced opacity */}
      <div
        className={cn("absolute inset-0", "[background-size:80px_80px]")} // Increased grid size
        style={{
          backgroundImage: `linear-gradient(to right, ${gridColor}15 1px, transparent 1px), linear-gradient(to bottom, ${gridColor}15 1px, transparent 1px)`,
          willChange: "transform", // Add will-change for smoother parallax
        }}
      />
      {/* AI Badge - unchanged */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 opacity-80 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-500/30 shadow-lg group hover:border-blue-500/50 transition-all duration-300">
          <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 13.25V19.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.25 9V15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M4.75 9V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M12 19.25L4.75 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.25 15L12 19.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xs font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
            AI + Blockchain powered
          </span>
          <div className="absolute -inset-px bg-blue-500/10 rounded-full blur-sm group-hover:bg-blue-500/20 transition-all duration-300"></div>
        </div>
      </div>
      {/* Optimized canvas with lazy initialization */}
      <canvas ref={dotsCanvasRef} className="absolute inset-0 z-0 pointer-events-none" />
      {/* Simplified radial gradient */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at center, transparent 30%, ${fadeColor} 70%)`,
          willChange: "transform", // Add will-change for smoother parallax
        }}
      ></div>
      {children}
    </div>
  )
}
