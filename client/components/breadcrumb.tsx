"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { usePathname } from "next/navigation"

interface BreadcrumbProps {
  customItems?: { label: string; href: string }[]
}

export function Breadcrumb({ customItems }: BreadcrumbProps) {
  const pathname = usePathname()

  // Generate breadcrumb items from pathname if no custom items provided
  const items = customItems || generateBreadcrumbItems(pathname)

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center px-3 py-2 rounded-lg bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 shadow-md"
    >
      <Link
        href="/dashboard"
        className="flex items-center text-mintellect-primary hover:text-mintellect-primary/80 transition-colors"
      >
        <Home size={16} className="mr-1" />
        <span className="hidden sm:inline text-xs font-medium">Home</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight size={14} className="mx-1 text-gray-500" />
          {index === items.length - 1 ? (
            <span className="text-white font-medium px-2 py-1 rounded-md bg-gray-700/50 text-xs sm:text-sm">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-gray-300 hover:text-mintellect-primary transition-colors text-xs sm:text-sm"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

// Helper function to generate breadcrumb items from pathname
function generateBreadcrumbItems(pathname: string) {
  if (!pathname) return []

  const segments = pathname.split("/").filter(Boolean)

  return segments.map((segment, index) => {
    // Create the href for this breadcrumb item
    const href = `/${segments.slice(0, index + 1).join("/")}`

    // Format the label (capitalize first letter, replace hyphens with spaces)
    let label = segment.charAt(0).toUpperCase() + segment.slice(1)
    label = label.replace(/-/g, " ")

    return { label, href }
  })
}
