"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileText, Shield, BarChart2, Award, Users, Settings, ChevronLeft, ChevronRight, User, Lock, Bell, CreditCard, Wallet } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { AnimatedLogo } from "./ui/animated-logo"
import { useWallet } from "./wallet-provider"
import ReactDOM from "react-dom";
import { useIsMobile } from "@/components/ui/use-mobile";
import React from "react";
import { useRouter } from "next/navigation"
import { useConnectModal } from '@rainbow-me/rainbowkit';

// Minimal portal-based tooltip for sidebar
function SidebarTooltip({ children, label }: { children: React.ReactNode, label: string }) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.top + rect.height / 2,
        left: rect.right + 8,
      });
      setShow(true);
    }
  };
  const handleMouseLeave = () => setShow(false);

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative flex items-center justify-center"
      >
        {children}
      </div>
      {show && coords && ReactDOM.createPortal(
        <span
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            transform: "translateY(-50%)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
          className="px-2 py-1 rounded bg-black text-white text-xs shadow-lg whitespace-nowrap animate-fadein"
        >
          {label}
        </span>,
        document.body
      )}
    </>
  );
}

export function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const isMobile = useIsMobile();
  // Collapsed by default, only expanded by default if not mobile
  const [collapsed, setCollapsedRaw] = useState(() => true);
  const [settingsOpen, setSettingsOpen] = useState(pathname.startsWith("/settings"))
  const { walletConnected, connectWallet, disconnectWallet } = useWallet()
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { openConnectModal } = useConnectModal();

  // Expand sidebar if not mobile on mount
  useEffect(() => {
    if (!isMobile) setCollapsedRaw(false);
  }, [isMobile]);

  const collapsedFinal = isMobile ? true : collapsed;
  const setCollapsed = (val: boolean) => {
    if (!isMobile) setCollapsedRaw(val);
  };

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
    if (collapsedFinal) {
      if (pathname === targetHref) {
        setCollapsed(false); // Only expand if clicking the active page
      }
      // else: stay collapsed
    } else {
      if (pathname === targetHref) {
        setCollapsed(true); // Collapse if clicking the active page
      }
      // else: stay expanded
    }
  };

  if (isMobile) {
  return (
      <aside
        className="fixed top-0 left-0 z-40 h-screen w-16 bg-black flex flex-col items-center py-4 gap-4 border-r border-gray-800"
      >
        {/* Logo */}
        <div className="flex items-center justify-center w-12 h-12 mb-2">
          <AnimatedLogo />
        </div>
        {/* Navigation icons */}
        <nav className="flex flex-col items-center gap-4 flex-1 mt-2">
        {navItems.map((item, idx) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => handleNavClick(item.href)}
            className={cn(
                `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 hover:bg-[#23262F]`,
                pathname === item.href ? "bg-mintellect-primary/10 text-mintellect-primary font-semibold" : "text-gray-300",
              )}
            >
              <item.icon className={cn("h-6 w-6", [
                "text-blue-400",
                "text-green-400",
                "text-yellow-400",
                "text-purple-400",
                "text-pink-400",
                "text-gray-400"
              ][idx % 6])} />
            </Link>
          ))}
          {/* Settings icon */}
          <Link
            href={pathname.startsWith("/settings") ? "#" : "/settings/profile"}
            onClick={() => {
              setSettingsOpen(true);
              if (!pathname.startsWith("/settings")) {
                router.push("/settings/profile");
              }
            }}
            className={cn(
              `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 hover:bg-[#23262F]`,
              pathname.startsWith("/settings") ? "bg-mintellect-primary/10 text-mintellect-primary font-semibold" : "text-gray-300"
            )}
          >
            <Settings className="h-6 w-6 text-gray-400" />
          </Link>
        </nav>
        {/* Bottom section (wallet/socials) */}
        <div className="flex flex-col items-center gap-2 mt-auto mb-2">
          <button
            onClick={walletConnected ? disconnectWallet : (isMobile ? openConnectModal : connectWallet)}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-xl border text-xs font-semibold transition-colors",
              walletConnected
                ? "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20 border"
                : "bg-blue-600/10 text-blue-400 border-blue-500/30 hover:bg-blue-600/20 border",
            )}
          >
            <Wallet className="w-5 h-5 shrink-0" />
          </button>
          <div className="flex flex-col items-center gap-2 mt-2">
            <a href="https://t.me/mintellect_community" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#23262F] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: 'translate(1px, 4px)' }}><path d="M21.05 2.927a2.25 2.25 0 0 0-2.37-.37L3.36 9.37c-1.49.522-1.471 1.27-.254 1.611l4.624 1.444 10.74-6.77c.505-.327.968-.146.588.181l-8.2 7.01 3.36 2.45 2.676-2.56 5.547 4.047c1.016.561 1.74.266 1.992-.941l3.613-16.84c.33-1.527-.553-2.127-1.54-1.792z" stroke="currentColor" fill="none"/></svg>
            </a>
            <a href="https://x.com/_Mintellect_" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#23262F] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <div className="relative flex">
      <aside
        className={cn(
          `relative flex flex-col h-screen bg-black rounded-3xl shadow-lg shrink-0 overflow-x-hidden overflow-y-visible pl-0`,
          collapsedFinal ? 'w-20' : 'w-64',
          'transition-[width] duration-300'
        )}
      >
        {/* Logo and Title (row when expanded, centered when collapsed) */}
        <div className="flex flex-row items-center mb-8 min-w-0 h-20 w-full overflow-hidden">
          <div className="flex items-center justify-center w-20 h-20 flex-shrink-0 ml-0">
            <AnimatedLogo />
          </div>
          <span
            className={cn(
              "text-2xl font-bold text-white tracking-tight flex items-center transition-all duration-300 whitespace-nowrap",
              collapsedFinal
                ? "opacity-0 pointer-events-none select-none"
                : "opacity-100 ml-1",
            )}
            style={{ marginTop: '2px' }}
          >
            Mintellect
          </span>
        </div>
        {/* Navigation - scrollable, but bottom section is outside */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1">
          <nav className="space-y-1">
            {navItems.map((item, idx) => (
              <React.Fragment key={item.href}>
                {collapsedFinal ? (
                  <SidebarTooltip label={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={cn(
                        `group flex items-center py-2 rounded-xl transition-all duration-200 hover:bg-[#23262F] items-center w-full justify-center px-0 gap-0`,
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
                      <span
                        className={cn(
                          "whitespace-nowrap overflow-hidden transition-all duration-300",
                          "max-w-0 opacity-0 ml-0"
                        )}
                        style={{ display: 'inline-block', verticalAlign: 'middle' }}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </SidebarTooltip>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={cn(
                      `group flex items-center py-2 rounded-xl transition-all duration-200 hover:bg-[#23262F] items-center w-full justify-start px-3 gap-3`,
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
                    <span
                      className={cn(
                        "whitespace-nowrap overflow-hidden transition-all duration-300",
                        "max-w-[160px] opacity-100 ml-2"
                      )}
                      style={{ display: 'inline-block', verticalAlign: 'middle' }}
                    >
                      {item.label}
                    </span>
          </Link>
                )}
              </React.Fragment>
        ))}
        {/* Settings section with sub-menu */}
        <div className="relative">
              {collapsedFinal ? (
                <SidebarTooltip label="Settings">
          <button
            className={cn(
                      `group flex items-center py-2 rounded-xl w-full transition-all duration-200 hover:bg-[#23262F] focus:outline-none justify-center px-0 gap-0`,
                      pathname.startsWith("/settings") ? "bg-mintellect-primary/10 text-mintellect-primary font-semibold" : "text-gray-300"
            )}
            onClick={() => {
                if (!isMobile) {
                setCollapsed(false);
                }
                setSettingsOpen(true);
                if (!pathname.startsWith("/settings")) {
                  router.push("/settings/profile");
              }
            }}
            aria-expanded={settingsOpen}
            aria-controls="settings-submenu"
          >
            <Settings className="h-5 w-5 text-gray-400 group-hover:text-mintellect-primary" />
          </button>
                </SidebarTooltip>
              ) : (
                <button
                  className={cn(
                    `group flex items-center py-2 rounded-xl w-full transition-all duration-200 hover:bg-[#23262F] focus:outline-none justify-start px-3 gap-3`,
                    pathname.startsWith("/settings") ? "bg-mintellect-primary/10 text-mintellect-primary font-semibold" : "text-gray-300"
                  )}
                  onClick={() => {
                    if (!isMobile && pathname.startsWith("/settings")) {
                      setCollapsed(true);
                    } else {
                      setSettingsOpen(true);
                      router.push("/settings/profile");
                    }
                  }}
                  aria-expanded={settingsOpen}
                  aria-controls="settings-submenu"
                >
                  <Settings className="h-5 w-5 text-gray-400 group-hover:text-mintellect-primary" />
                  <span
                    className={cn(
                      "whitespace-nowrap overflow-hidden transition-all duration-300",
                      "max-w-[160px] opacity-100 ml-2"
                    )}
                    style={{ display: 'inline-block', verticalAlign: 'middle' }}
                  >
                    Settings
                  </span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 ml-auto transition-transform",
                  settingsOpen ? "rotate-90" : "rotate-0"
                )}
              />
                </button>
            )}
          {/* Sub-menu (expanded sidebar) */}
          {!collapsedFinal && settingsOpen && (
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
          {collapsedFinal && settingsOpen && (
                <div className="absolute left-full top-0 mt-0 ml-2 w-48 bg-black border rounded-xl shadow-lg z-50 p-2">
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
        </div>
      </aside>
      {/* Right divider, always visible, sibling to sidebar */}
      <div className="absolute top-3 bottom-3 left-full w-px bg-gray-700/40 z-30 transition-all duration-300" />
      {/* Bottom section absolutely positioned and outside the sidebar */}
      <div className={cn(
        `absolute left-0 bottom-0 flex flex-col gap-3 items-center min-w-0 mb-4`,
        collapsedFinal ? 'w-20' : 'w-64',
        'transition-[width] duration-300'
      )}>
        {/* Wallet Connect Button */}
        <button
          onClick={walletConnected ? disconnectWallet : (isMobile ? openConnectModal : connectWallet)}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors min-w-0",
            walletConnected
              ? "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20 border"
              : "bg-blue-600/10 text-blue-400 border-blue-500/30 hover:bg-blue-600/20 border",
          )}
        >
          <Wallet className="w-5 h-5 shrink-0" />
          {walletConnected ? (
            <span className={collapsedFinal ? "hidden" : "flex items-center gap-1 text-green-400 font-semibold overflow-hidden whitespace-nowrap text-ellipsis min-w-0"}>
              Wallet Connected
              <span className="w-2 h-2 rounded-full bg-green-400 ml-1 shrink-0" />
            </span>
          ) : (
            <span className={collapsedFinal ? "hidden" : "overflow-hidden whitespace-nowrap text-ellipsis min-w-0"}>Connect Wallet</span>
          )}
        </button>
        <div className={`flex ${collapsedFinal ? 'flex-col' : 'flex-row'} items-center justify-center gap-4 w-full mt-2`}>
          <a href="https://t.me/mintellect_community" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#23262F] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M21.05 2.927a2.25 2.25 0 0 0-2.37-.37L3.36 9.37c-1.49.522-1.471 1.27-.254 1.611l4.624 1.444 10.74-6.77c.505-.327.968-.146.588.181l-8.2 7.01 3.36 2.45 2.676-2.56 5.547 4.047c1.016.561 1.74.266 1.992-.941l3.613-16.84c.33-1.527-.553-2.127-1.54-1.792z"/></svg>
          </a>
          <a href="https://x.com/_Mintellect_" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#23262F] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
      </div>
    </div>
  )
}
