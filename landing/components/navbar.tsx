"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Menu, X, ChevronRight, Send, Rocket } from "lucide-react"
import { XIcon } from "@/components/icons/x-icon"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { ExpandedTabs } from "@/components/ui/expanded-tabs"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const [prevScrollY, setPrevScrollY] = useState(0)
  const [visible, setVisible] = useState(true)
  const [hoverLink, setHoverLink] = useState<string | null>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const navRef = useRef<HTMLElement>(null)

  // Smooth spring animation for mouse movement
  const springConfig = { damping: 25, stiffness: 300 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 20)

      // Determine if we should show or hide the navbar
      if (currentScrollY < 20) {
        setVisible(true) // Always show navbar at the top
      } else {
        setVisible(prevScrollY > currentScrollY || currentScrollY < 100)
      }

      setPrevScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [prevScrollY])

  // Track mouse position for glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect()
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  // Navigation items with enhanced structure
  const navItems = [
    { title: "Telegram", href: "https://t.me/mintellect_community", icon: Send, external: true },
  { title: "X", href: "https://x.com/_Mintellect_", icon: XIcon, external: true, showTitle: false },
    { 
      title: "Launch App", 
      href: "https://app.mintellect.xyz", 
      icon: Rocket, 
      external: true,
      highlight: true 
    }
  ]

  // Radial gradient for hover effect
  const size = 200
  const glowOpacity = useTransform(mouseYSpring, [0, 100], [0.1, 0.3])

  return (
    <header
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled 
          ? "bg-black/60 backdrop-blur-xl after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-blue-900/50 after:to-transparent py-3" 
          : "bg-transparent py-5",
        visible ? "transform-none" : "-translate-y-full",
      )}
    >
      {/* Animated background glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-blue-800/5 to-blue-900/10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%"],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
          }}
        />

        {/* Animated lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute h-px w-full bg-blue-500/10"
              style={{ top: `${25 + i * 25}%` }}
              animate={{
                x: ["-100%", "100%"],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 15 + i * 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Radial glow that follows mouse */}
        <motion.div
          className="absolute rounded-full bg-blue-500/10 pointer-events-none"
          style={{
            width: size,
            height: size,
            x: useTransform(mouseXSpring, (value) => value - size / 2),
            y: useTransform(mouseYSpring, (value) => value - size / 2),
            opacity: glowOpacity,
            boxShadow: "0 0 40px 20px rgba(59, 130, 246, 0.15)",
          }}
        />
      </motion.div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Mintellect text */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative w-12 h-12 flex items-center justify-center"
              whileHover={{
                scale: 1.1,
                rotate: [0, 5, -5, 0],
                transition: { duration: 0.5 },
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(59, 130, 246, 0)",
                    "0 0 0 8px rgba(59, 130, 246, 0.1)",
                    "0 0 0 0 rgba(59, 130, 246, 0)",
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 375 375"
                className="w-11 h-11 relative z-10"
                style={{ transform: "translateY(-1px)" }}
              >
                <motion.path
                  fill="#013ca4"
                  d="M 186.121094 130.828125 C 198.433594 123.742188 214.179688 127.949219 221.273438 140.246094 L 272.726562 229.261719 C 279.867188 241.558594 275.609375 257.285156 263.34375 264.371094 C 251.03125 271.457031 235.28125 267.253906 228.1875 254.953125 L 176.734375 165.941406 C 169.59375 153.644531 173.804688 137.960938 186.121094 130.828125 Z M 186.121094 130.828125 "
                  fillOpacity="1"
                  fillRule="evenodd"
                  animate={{
                    fillOpacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
                <motion.path
                  fill="#0175e4"
                  d="M 189.050781 264.371094 C 176.734375 271.457031 160.988281 267.253906 153.894531 254.953125 L 102.441406 165.941406 C 95.347656 153.644531 99.558594 137.960938 111.871094 130.828125 C 124.140625 123.742188 139.886719 127.949219 146.980469 140.246094 L 198.480469 229.261719 C 205.574219 241.558594 201.363281 257.285156 189.050781 264.371094 Z M 189.050781 264.371094 "
                  fillOpacity="1"
                  fillRule="evenodd"
                  animate={{
                    fillOpacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 0.5,
                  }}
                />
                <motion.path
                  fill="#73b7ff"
                  d="M 260.414062 130.828125 C 272.726562 123.742188 288.472656 127.949219 295.570312 140.246094 C 302.664062 152.546875 298.453125 168.273438 286.140625 175.359375 C 273.824219 182.445312 258.078125 178.238281 250.984375 165.941406 C 243.886719 153.644531 248.101562 137.960938 260.414062 130.828125 Z M 114.757812 264.371094 C 102.441406 271.457031 86.742188 267.253906 79.601562 254.953125 C 72.503906 242.703125 76.71875 226.972656 89.03125 219.886719 C 101.34375 212.757812 117.089844 217.007812 124.1875 229.261719 C 131.28125 241.558594 127.070312 257.285156 114.757812 264.371094 Z M 114.757812 264.371094 "
                  fillOpacity="1"
                  fillRule="evenodd"
                  animate={{
                    fillOpacity: [1, 0.6, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 1,
                  }}
                />
              </svg>
            </motion.div>
            <div className="overflow-hidden">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold relative inline-block"
              >
                <motion.span className="absolute inset-0 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.span
                  className="relative bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% center", "100% center", "0% center"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  Mintellect
                </motion.span>
              </motion.span>
            </div>
          </Link>

          {/* Right side - Navigation and mobile menu */}
          <div className="flex items-center">
            <nav className="hidden md:flex items-center space-x-6 mr-4">
              <ExpandedTabs 
                tabs={navItems}
                activeColor="text-blue-500"
                className="bg-transparent border-blue-900/20 dark:border-blue-800/20"
              />
            </nav>

            {/* Mobile menu button with animation */}
            <motion.button
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              className="md:hidden relative p-2 rounded-md text-gray-400 hover:text-white transition-colors z-20"
            >
              <motion.div
                className="absolute inset-0 rounded-md bg-blue-500/10 opacity-0"
                animate={{ opacity: isOpen ? 0.5 : 0 }}
                transition={{ duration: 0.2 }}
              />
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Enhanced mobile menu with animations */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, backdropFilter: "blur(0px)" }}
            animate={{
              opacity: 1,
              height: "auto",
              backdropFilter: "blur(15px)",
            }}
            exit={{
              opacity: 0,
              height: 0,
              backdropFilter: "blur(0px)",
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-gradient-to-b from-black/90 to-blue-950/80 backdrop-blur-xl border-b border-blue-900/30 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <ExpandedTabs 
                    tabs={navItems}
                    activeColor="text-blue-500"
                    className="border-blue-900/20 dark:border-blue-800/20 bg-black/20"
                  />
                </motion.div>
              </nav>

              {/* Decorative elements */}
              <motion.div
                className="mt-6 pt-4 border-t border-blue-900/20 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500/50 animate-pulse" />
                  <span>Powered by Mintellect</span>
                </div>
              </motion.div>
            </div>

            {/* Background particles */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 rounded-full bg-blue-400/30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20],
                    opacity: [0, 0.7, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

