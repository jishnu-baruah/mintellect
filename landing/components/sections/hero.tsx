"use client"

import type React from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, FileText } from "lucide-react"
import { FuturisticButton } from "@/components/ui/futuristic-button"

export default function Hero() {
  // Function to handle smooth scrolling to the How It Works section
  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault()
    const howItWorksSection = document.getElementById("how-it-works")
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Simple gradient background instead of Three.js */}
      <div className="absolute inset-0 bg-gradient-radial from-primary-dark/90 to-primary-dark z-0"></div>

      {/* Simple animated dots background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary-light"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-left mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="block text-white">Verify Your Research with </span>
            <motion.span
              className="bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent"
              initial={{ backgroundPosition: "200% 0" }}
              animate={{ backgroundPosition: "0% 0" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              Mintellect
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/70 text-left mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            Upload your research paper to check for plagiarism, get a trust score, and verify your work on the
            blockchain.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          >
            <Link href="https://mintellect.vercel.app" target="_blank" rel="noopener noreferrer">
              <FuturisticButton variant="primary" size="lg" icon={<FileText className="w-5 h-5" />}>
                Explore Demo
              </FuturisticButton>
            </Link>

            <a href="#how-it-works" onClick={scrollToHowItWorks}>
              <FuturisticButton variant="outline" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Learn More
              </FuturisticButton>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

