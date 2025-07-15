"use client"

import type React from "react"

export function ButtonsCard({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition duration-200 cursor-pointer"
    >
      <div className="flex flex-col items-center justify-center space-y-2">{children}</div>
    </div>
  )
}

