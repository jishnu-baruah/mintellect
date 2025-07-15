"use client"

import type React from "react"

interface BorderMagicButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const BorderMagicButton = ({ children, onClick, className = "" }: BorderMagicButtonProps) => {
  return (
    <button
      className={`relative h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-50 ${className}`}
      onClick={onClick}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#93C5FD_0%,#1E40AF_50%,#93C5FD_100%)]" />
      <span className="flex h-full w-full items-center justify-center rounded-full bg-slate-950 px-4 py-1">
        <span className="text-sm font-medium text-white">{children}</span>
      </span>
    </button>
  )
}

export default BorderMagicButton

