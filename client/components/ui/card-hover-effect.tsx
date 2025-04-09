"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface CardHoverEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    title: string
    description: string
    link: string
    icon: React.ReactNode
  }[]
}

export const HoverEffect = ({ className, items, ...props }: CardHoverEffectProps) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)} {...props}>
      {items.map((item, idx) => (
        <motion.a
          key={item.link}
          href={item.link}
          className="relative group block p-2 h-full w-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative z-10 h-full w-full overflow-hidden rounded-xl border border-white/[0.1] bg-black p-6">
            <div className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative z-50">
              <div className="flex items-center mb-2">
                {item.icon}
                <div className="ml-2 text-xl font-bold text-neutral-200">{item.title}</div>
              </div>
              <p className="text-sm text-neutral-400">{item.description}</p>
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  )
}
