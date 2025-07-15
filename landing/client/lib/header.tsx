"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useOCID } from "@/lib/ocid-provider"
import { cn } from "@/lib/utils"
import { Bell, User, Menu } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

export default function Header() {
  const pathname = usePathname()
  const { ocid, isConnected, isConnecting, connect, disconnect } = useOCID()
  const [hasNotifications, setHasNotifications] = useState(true)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/plagiarism", label: "Plagiarism" },
    { href: "/trust-score", label: "Trust Score" },
    { href: "/review", label: "Review" },
    { href: "/user-token", label: "User Token" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-xl">
              <span className="gradient-text">Mintellect</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {hasNotifications && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setHasNotifications(false)}>
                Your paper has been analyzed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setHasNotifications(false)}>
                New citation suggestions available
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
          {isConnected ? (
            <Button variant="outline" onClick={disconnect} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{ocid}</span>
            </Button>
          ) : (
            <Button
              onClick={connect}
              disabled={isConnecting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <User className="h-4 w-4" />
              <span>{isConnecting ? "Connecting..." : "Connect OCID"}</span>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
