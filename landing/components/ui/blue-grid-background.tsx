import { cn } from "@/lib/utils"
import type React from "react"

interface BlueGridBackgroundProps {
  className?: string
  children?: React.ReactNode
}

export function BlueGridBackground({ className, children }: BlueGridBackgroundProps) {
  return (
    <div className={cn("relative w-full bg-black", className)}>
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.1)_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      {children}
    </div>
  )
}

