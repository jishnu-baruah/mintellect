import type React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  variant?: "default" | "glowing"
}

export function GlassCard({ children, className, variant = "default", ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-6 transition-all duration-300 border border-gray-800/30 bg-black/80 backdrop-blur-sm relative",
        variant === "glowing" &&
          "hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:border-mintellect-primary/30 border-glow",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
