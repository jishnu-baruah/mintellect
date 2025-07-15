"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "glowing"
  size?: "default" | "sm" | "lg"
  children: React.ReactNode
  fullWidth?: boolean
}

interface Ripple {
  x: number
  y: number
  size: number
  id: number
}

export function RippleButton({
  className,
  variant = "default",
  size = "default",
  children,
  fullWidth = false,
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)
  const nextId = useRef(0)

  const addRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const size = Math.max(button.offsetWidth, button.offsetHeight)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const newRipple = {
      x,
      y,
      size,
      id: nextId.current,
    }

    nextId.current += 1
    setRipples([...ripples, newRipple])
  }

  useEffect(() => {
    const duration = 850
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prevRipples) => prevRipples.slice(1))
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [ripples])

  // Update the variantClasses object to make buttons more transparent and cool
  const variantClasses = {
    default:
      "bg-gradient-to-r from-mintellect-primary/40 to-mintellect-secondary/40 text-white relative overflow-hidden backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]",
    outline:
      "border border-mintellect-primary/30 text-mintellect-primary hover:bg-mintellect-primary/10 relative overflow-hidden backdrop-blur-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]",
    ghost: "text-mintellect-primary hover:bg-mintellect-primary/10 relative overflow-hidden backdrop-blur-sm",
    glowing:
      "bg-gradient-to-r from-mintellect-primary/60 via-mintellect-secondary/60 to-mintellect-primary/60 bg-size-200 backdrop-blur-sm animate-gradient-x text-white relative overflow-hidden border border-white/20 hover:border-white/30 hover:shadow-[0_0_25px_rgba(99,102,241,0.7)]",
  }

  const sizeClasses = {
    default: "h-10 px-4 py-2 text-sm md:text-base",
    sm: "h-8 px-2 py-1 text-xs md:text-sm",
    lg: "h-12 px-6 py-3 text-base md:text-lg",
  }

  // Update the button component to add more cool effects
  return (
    <button
      ref={buttonRef}
      className={cn(
        "relative overflow-hidden rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 flex items-center justify-center",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        variant === "glowing" &&
          "after:absolute after:inset-0 after:rounded-md after:animate-pulse after:opacity-0 after:hover:opacity-100 after:border after:border-mintellect-primary/50",
        className,
      )}
      onClick={addRipple}
      {...props}
    >
      {/* Add subtle glass shine effect */}
      <span className="absolute inset-0 overflow-hidden rounded-md">
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full hover:translate-x-full duration-1000 transition-transform ease-in-out"></span>
      </span>

      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/40 pointer-events-none"
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{
            width: ripple.size,
            height: ripple.size,
            opacity: 0,
          }}
          transition={{ duration: 0.85 }}
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
      <span className="relative z-10 flex items-center justify-center whitespace-nowrap">{children}</span>
    </button>
  )
}
