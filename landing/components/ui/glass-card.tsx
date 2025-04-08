import type React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-xl",
        className,
      )}
    >
      {children}
    </div>
  )
}

