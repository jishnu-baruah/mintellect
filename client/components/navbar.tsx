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
              href="https://discord.gg/mintellect"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.885-.608 1.28a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.28.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.49a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.3 13.3 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
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
                href="https://discord.gg/mintellect"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                onClick={closeMenu}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.885-.608 1.28a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.28.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.49a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.3 13.3 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
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
