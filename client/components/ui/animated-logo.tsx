"use client"

import Image from "next/image"
import { useState } from "react"

export function AnimatedLogo({ className }: { className?: string }) {
  // Always use a fixed logo size
  const logoSize = 96;

  return (
    <div className={`relative ${className}`}>
      <div className="relative z-10">
        <Image
          src="/images/Mintellect_logo__1_-removebg-preview (1).png"
          alt="Mintellect Logo"
          width={logoSize}
          height={logoSize}
          priority
        />
      </div>
    </div>
  )
}
