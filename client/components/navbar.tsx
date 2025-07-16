"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useWallet } from "./wallet-provider"
import { AnimatedLogo } from "./ui/animated-logo"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Get wallet state from context
  const { walletConnected, walletAddress, connectWallet, disconnectWallet } = useWallet()

  // Check if we're on a dashboard page
  const isDashboardPage = pathname.startsWith("/dashboard")

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <div className="bg-black/80 backdrop-blur-md border-b border-blue-900/30 py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Left side - Mintellect logo and heading */}
        <Link href="/dashboard" className="flex items-center gap-2 align-middle">
          <AnimatedLogo className="mr-2 align-middle" size="small" />
          <span className="text-xl font-bold text-white align-middle leading-none">Mintellect</span>
        </Link>

        {/* Right side - Wallet, Discord, X */}
        <div className="flex items-center gap-3">
          <button
            onClick={walletConnected ? disconnectWallet : connectWallet}
            className={cn(
              "hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
              walletConnected
                ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                : "bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30",
            )}
          >
            <Wallet className="w-4 h-4" />
            {walletConnected ? (
              <span className="flex items-center gap-1 text-green-400 font-semibold">
                Wallet Connected
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1"></span>
              </span>
            ) : (
              <span>Connect Wallet</span>
            )}
          </button>
          <nav className="hidden md:flex items-center space-x-5">
            <Link
              href="https://t.me/mintellect_community"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style={{ transform: 'translate(1px, 4px)' }}>
                <path d="M21.05 2.927a2.25 2.25 0 0 0-2.37-.37L3.36 9.37c-1.49.522-1.471 1.27-.254 1.611l4.624 1.444 10.74-6.77c.505-.327.968-.146.588.181l-8.2 7.01 3.36 2.45 2.676-2.56 5.547 4.047c1.016.561 1.74.266 1.992-.941l3.613-16.84c.33-1.527-.553-2.127-1.54-1.792z" stroke="currentColor" fill="none"/>
              </svg>
            </Link>
            <Link
              href="https://x.com/_Mintellect_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
          </nav>
          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black/90 border-b border-blue-900/30">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Connect Wallet Button */}
            <button
              onClick={walletConnected ? disconnectWallet : connectWallet}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium mb-4",
                walletConnected
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-blue-600/20 text-blue-400 border border-blue-500/30",
              )}
            >
              <Wallet className="w-4 h-4" />
              {walletConnected ? (
                <span className="flex items-center gap-1 text-green-400 font-semibold">
                  Wallet Connected
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1"></span>
                </span>
              ) : (
                <span>Connect Wallet</span>
              )}
            </button>
            <div className="flex justify-center space-x-6 pt-2">
              <Link
                href="https://t.me/mintellect_community"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                onClick={closeMenu}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.05 2.927a2.25 2.25 0 0 0-2.37-.37L3.36 9.37c-1.49.522-1.471 1.27-.254 1.611l4.624 1.444 10.74-6.77c.505-.327.968-.146.588.181l-8.2 7.01 3.36 2.45 2.676-2.56 5.547 4.047c1.016.561 1.74.266 1.992-.941l3.613-16.84c.33-1.527-.553-2.127-1.54-1.792z"/>
                </svg>
              </Link>
              <Link
                href="https://x.com/_Mintellect_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                onClick={closeMenu}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
