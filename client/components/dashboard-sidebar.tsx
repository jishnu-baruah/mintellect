"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileText, Shield, BarChart2, Award, Users, Settings } from "lucide-react"

export function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/workflow",
      label: "Verification",
      icon: FileText,
    },
    {
      href: "/documents",
      label: "Documents",
      icon: Shield,
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: BarChart2,
    },
    {
      href: "/nft-gallery",
      label: "Certificates",
      icon: Award,
    },
    {
      href: "/community",
      label: "Community",
      icon: Users,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  return (
    <div className={cn("flex flex-col p-4 border-r border-gray-800 w-64 shrink-0", className)}>
      <div className="mb-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-mintellect-primary"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="text-xl font-bold">Mintellect</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-800",
              pathname === item.href ? "bg-mintellect-primary/10 text-mintellect-primary" : "text-gray-400",
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
