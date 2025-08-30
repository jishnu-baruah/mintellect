"use client"

import { cn } from "@/lib/utils"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Tab {
  title?: string
  icon?: React.ComponentType<{ className?: string }>
  href?: string
  type?: "separator"
  external?: boolean
  highlight?: boolean
  showTitle?: boolean
}

interface ExpandedTabsProps {
  tabs: Tab[]
  activeColor?: string
  className?: string
}

export function ExpandedTabs({
  tabs,
  activeColor = "text-primary",
  className,
}: ExpandedTabsProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex gap-2 p-2 bg-background border rounded-lg", className)}>
  {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return (
            <div
              key={index}
              className="w-px bg-border/60 mx-2"
              role="separator"
              aria-orientation="vertical"
            />
          )
        }

        const isActive = tab.href ? pathname === tab.href : false
        const Icon = tab.icon

    const TabContent = (
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive ? activeColor : "text-muted-foreground",
              !tab.href && "cursor-default"
            )}
          >
      {tab.icon && <tab.icon className="h-4 w-4" />}
      {tab.showTitle !== false && tab.title}
          </div>
        )

        if (tab.href) {
          return (
            <Link 
              key={tab.title} 
              href={tab.href}
              {...(tab.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {TabContent}
            </Link>
          )
        }

        return <div key={tab.title}>{TabContent}</div>
      })}
    </div>
  )
}
