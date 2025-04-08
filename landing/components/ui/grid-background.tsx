"use client"

import { useEffect, useRef } from "react"

interface GridBackgroundProps {
  gridColor?: string
  fadeColor?: string
}

export default function GridBackground({
  gridColor = "rgba(59, 130, 246, 0.2)",
  fadeColor = "#000000",
}: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const resizeObserver = new ResizeObserver(() => {
      if (!canvas) return
      // Make the canvas significantly larger than its container
      canvas.width = canvas.offsetWidth * 1.5
      canvas.height = canvas.offsetHeight * 1.5
      drawGrid()
    })

    resizeObserver.observe(canvas)

    function drawGrid() {
      if (!canvas || !context) return

      const width = canvas.width
      const height = canvas.height

      // Clear the canvas
      context.clearRect(0, 0, width, height)

      // Draw the grid
      const cellSize = 30
      const xCount = Math.floor(width / cellSize) + 1
      const yCount = Math.floor(height / cellSize) + 1

      // Use a more subtle grid color with lower opacity
      context.strokeStyle =
        typeof gridColor === "string"
          ? gridColor.replace(/[\d.]+\)$/, "0.1)") // Reduce opacity to 0.1
          : "rgba(59, 130, 246, 0.1)"
      context.lineWidth = 0.3

      // Draw vertical lines
      for (let i = 0; i < xCount; i++) {
        const x = i * cellSize
        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x, height)
        context.stroke()
      }

      // Draw horizontal lines
      for (let i = 0; i < yCount; i++) {
        const y = i * cellSize
        context.beginPath()
        context.moveTo(0, y)
        context.lineTo(width, y)
        context.stroke()
      }

      // Create gradient fade effect
      const fadeDistance = Math.min(width, height) * 0.5
      const gradient = context.createRadialGradient(
        width / 2,
        height / 2,
        fadeDistance * 0.5,
        width / 2,
        height / 2,
        fadeDistance,
      )
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)")
      gradient.addColorStop(1, fadeColor)

      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)
    }

    drawGrid()

    return () => {
      resizeObserver.disconnect()
    }
  }, [gridColor, fadeColor])

  return (
    <div className="relative w-full h-full overflow-visible" style={{ minHeight: "100vh" }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{
          opacity: 0.4,
          background: "transparent",
          transform: "scale(1.5)",
          transformOrigin: "center center",
          width: "150%",
          height: "150%",
          left: "-25%",
          top: "-25%",
        }}
      />
    </div>
  )
}

