"use client"

import Image from "next/image"
import { useState } from "react"

export function AnimatedLogo({ className }: { className?: string }) {
  // Always use a fixed logo size
  const logoSize = 96;

  return (
    <div className={`relative ${className}`}>
      <a href="https://mintellect.xyz" target="_blank" rel="noopener noreferrer" className="block relative z-10">
        <Image
          src="/images/Mintellect_logo.png"
          alt="Mintellect Logo"
          width={logoSize}
          height={logoSize}
          priority
        />
      </a>
    </div>
  )
}
