"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileText, Shield, BarChart2, Award, Users, Settings, ChevronLeft, ChevronRight, User, Lock, Bell, CreditCard, Wallet } from "lucide-react"
import { useState } from "react"
import { AnimatedLogo } from "./ui/animated-logo"
import { useWallet } from "./wallet-provider"

export function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(pathname.startsWith("/settings"))
  const { walletConnected, connectWallet, disconnectWallet } = useWallet()

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: BarChart2,
    },
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
    // Settings will be handled separately for sub-menu
  ]

  // New: handle nav/settings click with logic
  const handleNavClick = (targetHref: string) => {
    if (collapsed) {
      setCollapsed(false);
    } else {
      if (pathname === targetHref) {
        setCollapsed(true);
      }
      // else: stay expanded
    }
  };

  return (
    <aside className={cn(`flex flex-col bg-black border-2 border-blue-900/40 rounded-3xl m-3 shadow-lg p-3 h-[95vh] shrink-0 transition-all duration-300 overflow-hidden ${collapsed ? 'w-20' : 'w-64'}` , className)}>
      {/* Logo and Title (row when expanded, centered when collapsed) */}
      <div className={cn("flex items-center mb-8 px-2 relative", collapsed ? "justify-center" : "justify-start gap-3")}> 
        <div className={cn("flex items-center justify-center", collapsed ? "w-full" : "")}> 
          <AnimatedLogo size={collapsed ? "large" : "small"} />
        </div>
        {!collapsed && <span className="text-2xl font-bold text-white tracking-tight flex items-center">Mintellect</span>}
      </div>
      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item, idx) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => handleNavClick(item.href)}
            className={cn(
              `group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-[#23262F] ${collapsed ? 'justify-center' : ''}`,
              pathname === item.href ? "bg-mintellect-primary/10 text-mintellect-primary font-semibold" : "text-gray-300",
            )}
          >
            <item.icon className={cn("h-5 w-5", [
              "text-blue-400",
              "text-green-400",
              "text-yellow-400",
              "text-purple-400",
              "text-pink-400",
              "text-gray-400"
            ][idx % 6])} />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        ))}
        {/* Settings section with sub-menu */}
        <div className="relative">
          <button
            className={cn(
              "group flex items-center gap-3 px-3 py-2 rounded-xl w-full transition-all duration-200 hover:bg-[#23262F] focus:outline-none",
              pathname.startsWith("/settings") ? "bg-mintellect-primary/10 text-mintellect-primary font-semibold" : "text-gray-300",
              collapsed ? "justify-center" : ""
            )}
            onClick={() => {
              if (collapsed) {
                setCollapsed(false);
                setSettingsOpen(true);
              } else {
                // If already open and on a /settings route, collapse sidebar
                if (settingsOpen && pathname.startsWith("/settings")) {
                  setCollapsed(true);
                } else {
                  setSettingsOpen((open) => !open);
                }
              }
            }}
            aria-expanded={settingsOpen}
            aria-controls="settings-submenu"
          >
            <Settings className="h-5 w-5 text-gray-400 group-hover:text-mintellect-primary" />
            {!collapsed && <span className="truncate">Settings</span>}
            {!collapsed && (
              <ChevronRight
                className={cn(
                  "h-4 w-4 ml-auto transition-transform",
                  settingsOpen ? "rotate-90" : "rotate-0"
                )}
              />
            )}
          </button>
          {/* Sub-menu (expanded sidebar) */}
          {!collapsed && settingsOpen && (
            <div id="settings-submenu" className="ml-8 mt-1 space-y-1">
              <Link href="/settings/profile" className={cn(
                "flex items-center gap-2 px-2 py-1 rounded hover:bg-[#23262F] transition-colors text-sm",
                pathname === "/settings/profile" ? "bg-mintellect-primary/10 text-mintellect-primary font-semibold" : "text-gray-300"
              )}><User className="h-4 w-4" />Profile</Link>
              <Link href="/settings/security" className={cn(
                "flex items-center gap-2 px-2 py-1 rounded hover:bg-[#23262F] transition-colors text-sm",
                pathname === "/settings/security" ? "bg-mintellect-primary/10 text-mintellect-primary font-semibold" : "text-gray-300"
              )}><Lock className="h-4 w-4" />Security</Link>
              <Link href="/settings/notifications" className={cn(
                "flex items-center gap-2 px-2 py-1 rounded hover:bg-[#23262F] transition-colors text-sm",
                pathname === "/settings/notifications" ? "bg-mintellect-primary/10 text-mintellect-primary font-semibold" : "text-gray-300"
              )}><Bell className="h-4 w-4" />Notifications</Link>
              <Link href="/settings/privacy" className={cn(
                "flex items-center gap-2 px-2 py-1 rounded hover:bg-[#23262F] transition-colors text-sm",
                pathname === "/settings/privacy" ? "bg-mintellect-primary/10 text-mintellect-primary font-semibold" : "text-gray-300"
              )}><Shield className="h-4 w-4" />Privacy</Link>
              <Link href="/settings/billing" className={cn(
                "flex items-center gap-2 px-2 py-1 rounded hover:bg-[#23262F] transition-colors text-sm",
                pathname === "/settings/billing" ? "bg-mintellect-primary/10 text-mintellect-primary font-semibold" : "text-gray-300"
              )}><CreditCard className="h-4 w-4" />Billing</Link>
            </div>
          )}
          {/* Sub-menu (collapsed sidebar) as floating menu on hover/focus */}
          {collapsed && settingsOpen && (
            <div className="absolute left-full top-0 mt-0 ml-2 w-48 bg-black border border-blue-900 rounded-xl shadow-lg z-50 p-2">
              <Link href="/settings/profile" className={cn(
                "flex items-center gap-2 px-2 py-1 rounded hover:bg-[#23262F] transition-colors text-sm",
                pathname === "/settings/profile" ? "bg-mintellect-primary/10 text-mintellect-primary font-semibold" : "text-gray-300"
              )}><User className="h-4 w-4" />Profile</Link>
              <Link href="/settings/security" className={cn(
                "flex items-center gap-2 px-2 py-1 rounded hover:bg-[#23262F] transition-colors text-sm",
                pathname === "/settings/security" ? "bg-mintellect-primary/10 text-mintellect-primary font-semibold" : "text-gray-300"
              )}><Lock className="h-4 w-4" />Security</Link>
              <Link href="/settings/notifications" className={cn(
                "flex items-center gap-2 px-2 py-1 rounded hover:bg-[#23262F] transition-colors text-sm",
                pathname === "/settings/notifications" ? "bg-mintellect-primary/10 text-mintellect-primary font-semibold" : "text-gray-300"
              )}><Bell className="h-4 w-4" />Notifications</Link>
              <Link href="/settings/privacy" className={cn(
                "flex items-center gap-2 px-2 py-1 rounded hover:bg-[#23262F] transition-colors text-sm",
                pathname === "/settings/privacy" ? "bg-mintellect-primary/10 text-mintellect-primary font-semibold" : "text-gray-300"
              )}><Shield className="h-4 w-4" />Privacy</Link>
              <Link href="/settings/billing" className={cn(
                "flex items-center gap-2 px-2 py-1 rounded hover:bg-[#23262F] transition-colors text-sm",
                pathname === "/settings/billing" ? "bg-mintellect-primary/10 text-mintellect-primary font-semibold" : "text-gray-300"
              )}><CreditCard className="h-4 w-4" />Billing</Link>
            </div>
          )}
        </div>
      </nav>
      {/* Bottom section: wallet/socials */}
      <div className="mt-auto flex flex-col gap-3 items-center pb-2 min-w-0">
        {/* Wallet Connect Button */}
        <button
          onClick={walletConnected ? disconnectWallet : connectWallet}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors min-w-0",
            walletConnected
              ? "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20 border"
              : "bg-blue-600/10 text-blue-400 border-blue-500/30 hover:bg-blue-600/20 border",
          )}
        >
          <Wallet className="w-5 h-5 shrink-0" />
          {walletConnected ? (
            <span className={collapsed ? "hidden" : "flex items-center gap-1 text-green-400 font-semibold overflow-hidden whitespace-nowrap text-ellipsis min-w-0"}>
              Wallet Connected
              <span className="w-2 h-2 rounded-full bg-green-400 ml-1 shrink-0" />
            </span>
          ) : (
            <span className={collapsed ? "hidden" : "overflow-hidden whitespace-nowrap text-ellipsis min-w-0"}>Connect Wallet</span>
          )}
        </button>
        <div className={`flex ${collapsed ? 'flex-col' : 'flex-row'} items-center justify-center gap-4 w-full mt-2`}>
          <a href="https://discord.gg/mintellect" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#23262F] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.885-.608 1.28a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.28.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.49a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.3 13.3 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/></svg>
          </a>
          <a href="https://x.com/_Mintellect_" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#23262F] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
      </div>
    </aside>
  )
}
