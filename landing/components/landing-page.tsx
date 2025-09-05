"use client"

import { useState, useRef, useEffect } from "react"

import { motion, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight,
  FileCheck,
  Shield,
  Award,
  BookOpen,
  ChevronDown,
  FileSearch,
  ScrollText,
  Brain,
  Cpu,
  Zap,
  BarChart3,
  CheckCircle,
  Lock,
  Users,
  Send,
} from "lucide-react"
import Link from "next/link"
import { XIcon } from "@/components/icons/x-icon"
import { Navbar } from "@/components/navbar"
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect"
import { ShootingStars } from "@/components/ui/shooting-stars"
import { StarsBackground } from "@/components/ui/stars-background"
import MintellectTestimonials from "@/components/mintellect-testimonials"
import FlipLink from "./ui/text-effect-flipper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import PageLoader from "@/components/page-loader"


// Define data outside the component to avoid re-creation on each render
const WORKFLOW_STEPS = [
  {
    title: "Upload",
    description: "Upload LaTeX, PDF, or Word documents.",
    icon: FileCheck,
  },
  {
    title: "Analyze",
    description: "AI verifies originality with speed and accuracy.",
    icon: Shield,
  },
  {
    title: "Verify",
    description: "Receive trust score and detailed analysis.",
    icon: Award,
  },
  {
    title: "Human Review",
    description: "Experienced researchers from the community review your paper.",
    icon: Users,
  },
  {
    title: "Certify",
    description: "Mint NFT certificate as proof of verified work.",
    icon: BookOpen,
  },
]

const AI_CAPABILITIES = [
  {
    title: "Multi-AI System Verification",
    description:
      "Our specialized AI systems work collaboratively to verify research integrity with unprecedented accuracy",
    icon: Brain,
    link: "#neural-text-analysis",
  },
  {
    title: "Plagiarism Detection",
    description: "Human reviewers verify originality against academic databases.",
    icon: FileSearch,
    link: "#plagiarism-detection",
  },
  {
    title: "Citation Analysis",
    description: "Validates references against trusted sources.",
    icon: ScrollText,
    link: "#citation-analysis",
  },
]

const AI_TECH_FEATURES = [
  {
    icon: Cpu,
    title: "Advanced Neural Networks",
    description: "Trained on millions of papers to recognize originality patterns.",
  },
  {
    title: "Real-time Processing",
    description: "Results in seconds, not hours.",
    icon: Zap,
    link: "#real-time-processing",
  },
  {
    icon: BarChart3,
    title: "Continuous Learning",
    description: "Models improve through machine learning.",
  },
  {
    icon: CheckCircle,
    title: "Multi-language Support",
    description: "Analyze documents in over 20 languages.",
  },
]

// Custom component for right-to-left typing animation
interface RightToLeftTypeAnimationProps {
  words: string[];
  className?: string;
}

const RightToLeftTypeAnimation = ({ words, className }: RightToLeftTypeAnimationProps) => {
  const [currentWord, setCurrentWord] = useState("")
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(100)

  useEffect(() => {
    const word = words[wordIndex]

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Adding characters from right to left
        if (currentWord.length < word.length) {
          setCurrentWord(word.substring(0, currentWord.length + 1))
          // Even more consistent typing speed with minimal randomness
          setTypingSpeed(60 + Math.random() * 20)
        } else {
          // Wait at complete word - smoother pause
          setTypingSpeed(1000)
          setIsDeleting(true)
        }
      } else {
        // Removing characters
        if (currentWord.length > 0) {
          setCurrentWord(word.substring(0, currentWord.length - 1))
          // Smoother deletion speed
          setTypingSpeed(25 + Math.random() * 15)
        } else {
          // Move to next word with a smoother pause
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
          setTypingSpeed(200) // Shorter pause before starting next word
        }
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [currentWord, isDeleting, wordIndex, words, typingSpeed])

  return (
    <span
      className={`${className} transition-all duration-400 ease-out transform`}
      style={{
        willChange: "transform, opacity, letter-spacing",
        textShadow: currentWord ? "0 0 10px rgba(59, 130, 246, 0.4)" : "none",
        letterSpacing: "0.02em",
      }}
    >
      {currentWord}
    </span>
  )
}

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState("hero")


  // Add this to the beginning of the component
  const sectionRefs = {
    hero: useRef(null),
    capabilities: useRef(null),
    tech: useRef(null),
    verification: useRef(null),
    workflow: useRef(null),
    community: useRef(null),
    testimonials: useRef(null),
    cta: useRef(null),
  }

  // Refs for sections
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const capabilitiesSectionRef = useRef<HTMLDivElement>(null)
  const techSectionRef = useRef<HTMLDivElement>(null)
  const verificationSectionRef = useRef<HTMLDivElement>(null)
  const workflowSectionRef = useRef<HTMLDivElement>(null)
  const communitySectionRef = useRef<HTMLDivElement>(null)
  const testimonialsSectionRef = useRef<HTMLDivElement>(null)
  const ctaSectionRef = useRef<HTMLDivElement>(null)

  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Section-specific scroll progress
  const { scrollYProgress: capabilitiesProgress } = useScroll({
    target: capabilitiesSectionRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: techProgress } = useScroll({
    target: techSectionRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: workflowProgress } = useScroll({
    target: workflowSectionRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaSectionRef,
    offset: ["start end", "end start"],
  })

  // Enhanced parallax values with smoother transitions
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95])

  const capabilitiesY = useTransform(capabilitiesProgress, [0, 1], [100, -100])
  const techX = useTransform(techProgress, [0, 1], [-50, 50])
  const workflowY = useTransform(workflowProgress, [0, 1], [40, -40])
  const ctaY = useTransform(ctaProgress, [0, 1], [60, -40])

  // Track mouse for interactive effects


  // Determine active section based on scroll position with improved accuracy
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      const sections = [
        { ref: heroRef, id: "hero", offset: 0 },
        { ref: capabilitiesSectionRef, id: "capabilities", offset: 100 },
        { ref: verificationSectionRef, id: "verification", offset: 100 },
        { ref: workflowSectionRef, id: "workflow", offset: 0 },
        { ref: communitySectionRef, id: "community", offset: 100 },
        { ref: testimonialsSectionRef, id: "testimonials", offset: 100 },
        { ref: ctaSectionRef, id: "cta", offset: 100 },
      ]

      let activeSection = "hero"
      let minDistance = Infinity

      for (const section of sections) {
        if (!section.ref.current) continue

        const rect = section.ref.current.getBoundingClientRect()
        const sectionTop = rect.top + scrollY
        const sectionCenter = sectionTop + rect.height / 2
        const distance = Math.abs(scrollY + windowHeight / 2 - sectionCenter)

        if (distance < minDistance) {
          minDistance = distance
          activeSection = section.id
        }
      }

      setActiveSection(activeSection)
    }

    // Throttle scroll events for better performance
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", throttledHandleScroll, { passive: true })
    return () => window.removeEventListener("scroll", throttledHandleScroll)
  }, [])

  // Handle loading completion
  const handleLoadingComplete = () => {
    window.scrollTo(0, 0)
    // Remove delay completely for faster loading
    setIsLoading(false)
    document.body.style.overflow = "auto"
  }

  // Optimize loading sequence
  useEffect(() => {
    // Set a timeout to ensure the loader doesn't show for too long
    const timer = setTimeout(() => {
      setIsLoading(false)
      document.body.style.overflow = "auto"
    }, 200) // Reduced to 200ms for even faster loading

    document.body.style.overflow = isLoading ? "hidden" : "auto"
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = "auto"
    }
  }, [isLoading])

  // At the beginning of the component, add this effect
  useEffect(() => {
    // Enable enhanced smooth scrolling for the entire page
    document.documentElement.style.scrollBehavior = "smooth"

    // Add a custom class to improve section transitions
    document.body.classList.add("smooth-scroll")

    // Add CSS to the head for smoother transitions and hidden scrollbars
    const style = document.createElement("style")
    style.textContent = `
/* Hide scrollbar for all browsers - More aggressive approach */
html, body {
  scrollbar-width: none !important; /* Firefox */
  -ms-overflow-style: none !important; /* Internet Explorer 10+ */
  overflow-x: hidden !important;
}

html::-webkit-scrollbar, body::-webkit-scrollbar {
  display: none !important; /* Chrome, Safari, Opera */
  width: 0 !important;
  height: 0 !important;
}

/* Hide scrollbar for any scrollable elements */
* {
  scrollbar-width: none !important; /* Firefox */
  -ms-overflow-style: none !important; /* Internet Explorer 10+ */
}

*::-webkit-scrollbar {
  display: none !important; /* Chrome, Safari, Opera */
  width: 0 !important;
  height: 0 !important;
}

/* Additional scrollbar hiding for specific elements */
.scrollbar-hidden {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

.smooth-scroll section {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.section-active {
  opacity: 1;
  transform: translateY(0);
}
section:not(.section-active) {
  opacity: 0.9;
  transform: translateY(5px);
}
`
    document.head.appendChild(style)

    // Also apply scrollbar hiding directly to html and body
    document.documentElement.style.scrollbarWidth = 'none'
    document.documentElement.style.msOverflowStyle = 'none'
    document.body.style.scrollbarWidth = 'none'
    document.body.style.msOverflowStyle = 'none'

    return () => {
      document.documentElement.style.scrollBehavior = ""
      document.body.classList.remove("smooth-scroll")
      document.head.removeChild(style)
    }
  }, [])

  // Global scrollbar hiding effect
  useEffect(() => {
    // Force hide scrollbars globally
    const globalStyle = document.createElement("style")
    globalStyle.textContent = `
      html, body {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
        overflow-x: hidden !important;
      }
      html::-webkit-scrollbar, body::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
      *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    `
    globalStyle.id = 'global-scrollbar-hide'
    document.head.appendChild(globalStyle)

    return () => {
      if (document.getElementById('global-scrollbar-hide')) {
        document.head.removeChild(globalStyle)
      }
    }
  }, [])

  // Add this effect for smooth section transitions (without interfering with active section detection)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add a class to the section for transition effects
            entry.target.classList.add("section-active")

            // Add a smooth reveal effect to all direct children
            const children = entry.target.querySelectorAll(":scope > div")
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add("section-child-active")
              }, index * 30) // Reduced to 30ms for even faster animation
            })
          } else {
            entry.target.classList.remove("section-active")

            // Remove the active class from children
            const children = entry.target.querySelectorAll(":scope > div")
            children.forEach((child) => {
              child.classList.remove("section-child-active")
            })
          }
        })
      },
      { threshold: 0.05, rootMargin: "-2% 0px -2% 0px" }, // Adjusted for better triggering
    )

    // Observe all sections
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current)
      })
    }
  }, [])

  if (isLoading) {
    return <PageLoader onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <div
      className="min-h-screen bg-black text-white overflow-x-hidden scroll-smooth transition-all duration-500 scrollbar-hidden"
      ref={containerRef}
          style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitScrollbar: { display: 'none' }
      }}
    >
      {/* Stars Background - Full Page (Fixed) */}
      <StarsBackground 
        starDensity={0.0001}
        allStarsTwinkle={true}
        twinkleProbability={0.9}
        minTwinkleSpeed={0.6}
        maxTwinkleSpeed={1.2}
        className="z-0"
      />
      
      {/* Shooting Stars - Full Page (Fixed) */}
      <ShootingStars 
        minSpeed={20}
        maxSpeed={40}
        minDelay={1500}
        maxDelay={4000}
        starColor="#60a5fa"
        trailColor="#93c5fd"
        starWidth={12}
        starHeight={2}
        className="z-0"
      />


      {/* Enhanced scroll navigation indicator */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
        <div className="flex flex-col items-center gap-6">
          {["hero", "verification", "workflow", "community", "testimonials", "cta"].map((section) => (
            <motion.div
              key={section}
              className="relative w-4 h-4 rounded-full cursor-pointer group"
              animate={{
                backgroundColor: activeSection === section ? "rgba(59, 130, 246, 0.9)" : "rgba(59, 130, 246, 0.3)",
                scale: activeSection === section ? 1.3 : 1,
                borderColor: activeSection === section ? "rgba(59, 130, 246, 0.8)" : "rgba(59, 130, 246, 0.2)",
              }}
              whileHover={{ 
                scale: 1.4,
                backgroundColor: "rgba(59, 130, 246, 0.7)"
              }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                const element = document.getElementById(section)
                if (element) {
                  element.scrollIntoView({ 
                    behavior: "smooth",
                    block: "center"
                  })
                }
              }}
              style={{
                border: "2px solid",
                borderColor: activeSection === section ? "rgba(59, 130, 246, 0.8)" : "rgba(59, 130, 246, 0.2)"
              }}
            >
              {/* Active section indicator */}
              {activeSection === section && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-500/40"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              
              {/* Hover tooltip */}
              <div className="absolute right-full mr-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Navbar />

      <main className="pt-20">
        {/* Hero section content */}
        <section
          id="hero"
          ref={heroRef}
          className="relative min-h-[100vh] flex items-center justify-center overflow-visible pt-8 pb-0 sm:pt-12 md:pt-16 lg:pt-20 transition-all duration-1000"
        >
          {/* Main hero content with enhanced 3D effects and optimized for performance */}
          <div className="container mx-auto px-2 sm:px-4 md:px-6 relative z-10 w-full">
            {/* Background Ripple Effect - Larger Container */}
            <BackgroundRippleEffect 
              rows={10} 
              cols={20} 
              cellSize={50}
              interactive={true}
              className="opacity-30 absolute inset-0"
            />
            <motion.div
              className="flex flex-col items-center justify-center min-h-[80vh] perspective-[1200px] relative z-10 pointer-events-none"
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              {/* 3D Holographic Display */}
              <motion.div
                className="relative mb-6 sm:mb-8 w-full max-w-4xl mx-auto"
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                }}
              >
                {/* Main content */}
                <motion.div
                  className="relative rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden z-20 pointer-events-none"
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                >


                  {/* Main title with enhanced animations */}
                  <div className="text-center relative z-10">
                    {/* AI+Web3.0 badge */}
                    <motion.div
                      className="inline-flex items-center bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-xs text-blue-300 font-medium mb-6 sm:mb-8 mx-auto"
                      animate={{
                        boxShadow: [
                          "0 0 4px rgba(59, 130, 246, 0.3)",
                          "0 0 8px rgba(59, 130, 246, 0.5)",
                          "0 0 4px rgba(59, 130, 246, 0.3)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    >
                      <span className="mr-1 opacity-80">AI+Blockchain</span>
                      <span className="text-blue-400">Powered</span>
                    </motion.div>

                    {/* Main title with flip words */}
                    <motion.div
                      className="mb-4 sm:mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      style={{ willChange: "transform, opacity" }}
                    >
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                        <div className="flex flex-col sm:flex-row items-center justify-center w-full">
                          <div className="flex items-center justify-center w-full">
                            <div className="flex flex-col sm:flex-row items-center justify-center w-full">
                              <div className="text-center w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] xl:w-[320px] overflow-visible">
                                <RightToLeftTypeAnimation
                                  words={["Validate", "Publish", "Analyze"]}
                                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-600 whitespace-nowrap"
                                />
                              </div>
                              <div className="whitespace-nowrap tracking-normal px-1 letter-spacing-tight mt-2 sm:mt-0">
                                Your Research
                              </div>
                            </div>
                          </div>
                        </div>
                      </h1>
                    </motion.div>

                    {/* Brand name with enhanced effects */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="mb-6 sm:mb-8"
                      style={{ willChange: "transform, opacity" }}
                    >
                      <div className="relative inline-block">
                        {/* Glow effect */}
                        <motion.div
                          className="absolute -inset-4 rounded-full blur-xl"
                          animate={{
                            background: [
                              "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                              "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
                              "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                            ],
                            opacity: [0.3, 0.5, 0.3],
                          }}
                          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                          style={{ willChange: "transform, opacity" }}
                        />

                        <motion.h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
                          <motion.span
                            className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-white"
                            animate={{
                              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{
                              duration: 8,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                            style={{ backgroundSize: "200% 100%", willChange: "transform, opacity" }}
                          >
                            Mintellect
                          </motion.span>
                        </motion.h2>
                      </div>
                    </motion.div>

                    {/* Animated description */}
                    <motion.p
                      className="text-base sm:text-lg text-blue-100/80 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto mb-6 sm:mb-10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      style={{ willChange: "transform, opacity" }}
                    >
                                             AI verifies your research for originality and trust, recording immutable proof on the blockchain as a dynamic NFT.
                    </motion.p>

                    {/* Enhanced CTA button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1 }}
                      style={{ willChange: "transform, opacity", zIndex: 9999, pointerEvents: "auto" }}
                      className="relative pointer-events-auto"
                    >
                      <Link href="https://app.mintellect.xyz" target="_blank" rel="noopener noreferrer">
                        <motion.button
                          className="group relative h-12 sm:h-14 w-40 sm:w-48 rounded-full overflow-hidden"
                          style={{ zIndex: 10000, pointerEvents: "auto" }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Transparent background */}
                          <motion.div
                            className="absolute inset-0 bg-blue-500/10 backdrop-blur-md"
                            animate={{
                              backgroundColor: [
                                "rgba(59, 130, 246, 0.1)",
                                "rgba(59, 130, 246, 0.2)",
                                "rgba(59, 130, 246, 0.1)",
                              ],
                            }}
                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                            style={{ willChange: "transform, opacity" }}
                          />

                          {/* Animated border */}
                          <motion.div
                            className="absolute inset-0 rounded-full border border-blue-500/30"
                            animate={{
                              borderColor: [
                                "rgba(59, 130, 246, 0.3)",
                                "rgba(59, 130, 246, 0.6)",
                                "rgba(59, 130, 246, 0.3)",
                              ],
                            }}
                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                            style={{ willChange: "transform, opacity" }}
                          />

                          {/* Animated glow */}
                          <motion.div
                            className="absolute -inset-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            animate={{
                              boxShadow: [
                                "0 0 5px rgba(59, 130, 246, 0.2)",
                                "0 0 10px rgba(59, 130, 246, 0.3)",
                                "0 0 5px rgba(59, 130, 246, 0.2)",
                              ],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            style={{ willChange: "transform, opacity" }}
                          />

                          {/* Orbital particles */}
                          {[...Array(3)].map((_, i) => {
                            const angle = (i / 3) * Math.PI * 2
                            return (
                              <motion.div
                                key={`button-particle-${i}`}
                                className="absolute w-1 h-1 rounded-full bg-blue-400"
                                animate={{
                                  x: [
                                    `calc(${Math.cos(angle)} * 20px)`,
                                    `calc(${Math.cos(angle + Math.PI * 2)} * 20px)`,
                                  ],
                                  opacity: [0, 1, 0],
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Number.POSITIVE_INFINITY,
                                  delay: i * 1,
                                  ease: "linear",
                                }}
                                style={{
                                  left: "50%",
                                  top: "50%",
                                  transform: "translate(-50%, -50%)",
                                  willChange: "transform, opacity",
                                }}
                              />
                            )
                          })}

                          {/* Button text */}
                          <span className="relative flex items-center justify-center text-sm sm:text-base font-medium text-white h-full">
                            Get Started
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                              className="ml-2"
                              style={{ willChange: "transform, opacity" }}
                            >
                              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                            </motion.div>
                          </span>
                        </motion.button>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
            style={{ willChange: "transform, opacity" }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
              className="flex flex-col items-center"
              style={{ willChange: "transform, opacity" }}
            >
              <span className="text-xs sm:text-sm text-blue-400 mb-1 sm:mb-2 tracking-widest uppercase mt-12">
                Scroll
              </span>
              <motion.div
                animate={{
                  y: [0, 5, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                style={{ willChange: "transform, opacity" }}
              >
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* AI Capabilities Section */}
        <section
          id="capabilities"
          ref={capabilitiesSectionRef}
          className="relative pt-0 pb-12 sm:pb-16 md:pb-20 overflow-hidden z-10 transition-all duration-700"
        >
          {/* This section intentionally left empty to create a seamless transition to the next section */}
        </section>

        {/* AI Tech Features Section */}
        <section
          id="tech"
          ref={techSectionRef}
          className="relative pt-0 pb-12 sm:pb-16 md:pb-20 overflow-hidden transition-all duration-700"
        >
          {/* Tech features content here - abbreviated for brevity */}
          {/* ... */}
        </section>

        {/* AI Verification and Blockchain Section */}
        {/* AI Verification Section */}
        <section
          id="verification"
          ref={verificationSectionRef}
          className="relative pt-0 pb-20 sm:pb-24 md:pb-32 overflow-visible transition-all duration-700"
        >



          <div className="container mx-auto px-4 relative z-10">
            {/* Section header with simplified animated glow */}
            <div className="text-center relative z-10 mb-12">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-4"
              >
                <motion.h2
                  className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{ willChange: "transform" }}
                >
                  AI Verification
                </motion.h2>
              </motion.div>

              <motion.p
                className="text-lg text-blue-100/80 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{ willChange: "transform" }}
              >
                Our advanced AI system verifies research integrity with unprecedented accuracy
              </motion.p>
            </div>

            {/* Card-based content layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Card 1 */}
              <motion.div
                className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Plagiarism Checker</h3>
                  <p className="text-blue-100/70 text-sm">
                    Human reviewers detect plagiarism and suggest improvements if similarity {">"}15%.
                  </p>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4">
                    <FileSearch className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Trust Score</h3>
                  <p className="text-blue-100/70 text-sm">
                    AI verifies human vs. AI-written content and stores the score on-chain.
                  </p>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4">
                    <ScrollText className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Originality Verified</h3>
                  <p className="text-blue-100/70 text-sm">
                    From plagiarism checks to citation audits, our human reviewers ensure your work stands on trusted ground.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Blockchain Storage Section */}
        <section
          id="blockchain"
          className="relative py-20 sm:py-24 md:py-32 overflow-visible transition-all duration-1000"
        >


          <div className="container mx-auto px-4 relative z-10">
            {/* Section header with simplified animated glow */}
            <div className="text-center relative z-10 mb-12">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-4"
              >
                <motion.h2
                  className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{ willChange: "transform" }}
                >
                  Blockchain Storage
                </motion.h2>
              </motion.div>

              <motion.p
                className="text-lg text-blue-100/80 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{ willChange: "transform" }}
              >
                Immutable blockchain storage for verified research with NFT certification
              </motion.p>
            </div>

            {/* Card-based content layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Card 1 */}
              <motion.div
                className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Immutable Storage</h3>
                  <p className="text-blue-100/70 text-sm">
                    Research data is stored on the blockchain, making it tamper-proof and permanently accessible.
                  </p>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">NFT Certification</h3>
                  <p className="text-blue-100/70 text-sm">
                    Verified research receives an NFT certificate as proof of authenticity and ownership.
                  </p>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Decentralized Verification</h3>
                  <p className="text-blue-100/70 text-sm">
                    Verification records are distributed across the blockchain network for enhanced security.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section
          id="workflow"
          ref={workflowSectionRef}
          className="relative py-20 sm:py-24 md:py-32 overflow-hidden transition-all duration-1000"
        >


          <div className="container mx-auto px-4 relative z-10">
            {/* Section header with simplified animated glow */}
            <div className="text-center relative z-10 mb-12">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-4"
              >
                <motion.h2
                  className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{ willChange: "transform" }}
                >
                  Workflow
                </motion.h2>
              </motion.div>

              <motion.p
                className="text-lg text-blue-100/80 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{ willChange: "transform" }}
              >
                Our streamlined workflow ensures efficient and accurate verification of research
              </motion.p>
            </div>

            {/* Roadmap-themed workflow */}
            <div className="max-w-5xl mx-auto">
              <div className="relative">
                {/* Workflow steps */}
                <div className="space-y-24 relative">
                  {WORKFLOW_STEPS.map((step, index) => (
                    <motion.div
                      key={`workflow-step-${index}`}
                      className="relative"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.7, delay: index * 0.2 }}
                    >
                      <div
                        className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center`}
                      >
                        {/* Step number with icon */}
                        <div className="flex-shrink-0 relative z-10">
                          {/* Pulsing background effect */}
                          <motion.div
                            className="absolute -inset-6 rounded-full bg-blue-500/5"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: index * 0.5,
                            }}
                          />

                          {/* Step number indicator */}
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-blue-400 font-bold text-xl">
                            {index + 1}
                          </div>

                          {/* Icon container */}
                          <motion.div
                            className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm border-2 border-blue-500/50 flex items-center justify-center"
                            whileHover={{
                              scale: 1.1,
                              boxShadow: "0 0 25px rgba(59, 130, 246, 0.6)",
                              borderColor: "rgba(59, 130, 246, 0.8)",
                            }}
                          >
                            <step.icon className="h-9 w-9 text-blue-400" />

                            {/* Orbital particles */}
                            {[...Array(3)].map((_, i) => {
                              const angle = (i / 3) * Math.PI * 2
                              return (
                                <motion.div
                                  key={`step-particle-${index}-${i}`}
                                  className="absolute w-2 h-2 rounded-full bg-blue-400/80"
                                  animate={{
                                    x: [
                                      `calc(${Math.cos(angle)} * 30px)`,
                                      `calc(${Math.cos(angle + Math.PI * 2)} * 30px)`,
                                    ],
                                    y: [
                                      `calc(${Math.sin(angle)} * 30px)`,
                                      `calc(${Math.sin(angle + Math.PI * 2)} * 30px)`,
                                    ],
                                    opacity: [0.4, 1, 0.4],
                                    scale: [0.8, 1.2, 0.8],
                                  }}
                                  transition={{
                                    duration: 4 + i,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                    delay: i * 0.5,
                                  }}
                                />
                              )
                            })}
                          </motion.div>

                          {/* Glowing effect */}
                          <motion.div
                            className="absolute -inset-3 rounded-full opacity-20"
                            animate={{
                              boxShadow: [
                                "0 0 0 rgba(59, 130, 246, 0)",
                                "0 0 30px rgba(59, 130, 246, 0.7)",
                                "0 0 0 rgba(59, 130, 246, 0)",
                              ],
                            }}
                            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                          />
                        </div>

                        {/* Content */}
                        <div className={`mt-10 md:mt-0 ${index % 2 === 0 ? "md:ml-16" : "md:mr-16"} md:w-1/2`}>
                          <motion.div
                            className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8 overflow-hidden relative"
                            whileHover={{
                              y: -5,
                              boxShadow: "0 15px 30px -10px rgba(59, 130, 246, 0.3)",
                              borderColor: "rgba(59, 130, 246, 0.4)",
                            }}
                          >


                            <div className="relative z-10">
                              <h3 className="text-2xl font-bold text-white mb-3 flex items-center">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">
                                  {step.title}
                                </span>
                              </h3>
                              <p className="text-blue-100/80 text-lg">{step.description}</p>

                              {/* Decorative element */}
                              <motion.div
                                className="absolute bottom-0 right-0 w-16 h-16 opacity-20"
                                style={{
                                  background: "radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)",
                                }}
                                animate={{
                                  scale: [1, 1.5, 1],
                                  opacity: [0.1, 0.3, 0.1],
                                }}
                                transition={{
                                  duration: 4,
                                  repeat: Number.POSITIVE_INFINITY,
                                  delay: index * 0.3,
                                }}
                              />
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section
          id="community"
          ref={communitySectionRef}
          className="relative py-20 sm:py-24 md:py-32 overflow-hidden transition-all duration-1000"
        >
          <div className="container mx-auto px-4 relative z-10">
            {/* Section header */}
            <div className="text-center relative z-10 mb-16">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <motion.h2
                  className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                    textShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                willChange: "transform, opacity",
              }}
                >
                  Community
                </motion.h2>

                <motion.p
                  className="text-lg text-blue-100/80 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  style={{ willChange: "transform, opacity" }}
                >
                  Where Research Meets Trust and Grows Together
                </motion.p>
              </motion.div>
            </div>

            {/* Professional Community Section with Cards */}
            <div className="max-w-6xl mx-auto">
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{ willChange: "transform, opacity" }}
              >
                {/* Community Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  
                  {/* Telegram Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Link href="https://t.me/mintellect_community" target="_blank" rel="noopener noreferrer">
                      <Card className="group cursor-pointer border border-blue-500/20 bg-black/30 backdrop-blur-md hover:border-blue-500/40 hover:bg-black/50 transition-all duration-300 hover:scale-105">
                        <CardHeader className="text-center">
                          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-300">
                            <Send className="h-8 w-8 text-blue-400" />
                          </div>
                          <CardTitle className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                            Join Telegram
                          </CardTitle>
                          <CardDescription className="text-blue-100/70">
                            Connect with researchers
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  </motion.div>

                  {/* X/Twitter Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Link href="https://x.com/_Mintellect_" target="_blank" rel="noopener noreferrer">
                      <Card className="group cursor-pointer border border-blue-500/20 bg-black/30 backdrop-blur-md hover:border-blue-500/40 hover:bg-black/50 transition-all duration-300 hover:scale-105">
                        <CardHeader className="text-center">
                          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-300">
                            <XIcon className="h-8 w-8 text-blue-400" />
                          </div>
                          <CardTitle className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                            Follow on X
                          </CardTitle>
                          <CardDescription className="text-blue-100/70">
                            Stay updated
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  </motion.div>

                  {/* Reviewer Application Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <Link href="https://18olnrtzvht.typeform.com/to/HCsFJfMH" target="_blank" rel="noopener noreferrer">
                      <Card className="group cursor-pointer border border-blue-500/20 bg-black/30 backdrop-blur-md hover:border-blue-500/40 hover:bg-black/50 transition-all duration-300 hover:scale-105">
                        <CardHeader className="text-center">
                          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-300">
                            <Users className="h-8 w-8 text-blue-400" />
                          </div>
                          <CardTitle className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                            Become a Reviewer
                          </CardTitle>
                          <CardDescription className="text-blue-100/70">
                            Join our reviewer program
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  </motion.div>

                </div>

                {/* Description card */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card className="border border-blue-500/20 bg-black/40 backdrop-blur-md">
                    <CardContent className="p-6">
                      <p className="text-lg text-blue-100/90 text-center leading-relaxed max-w-2xl mx-auto">
                        A supportive peer review community where researchers collaborate to build trusted knowledge.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Bottom message */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Card className="border border-blue-500/20 bg-black/40 backdrop-blur-md">
                    <CardContent className="p-4">
                      <p className="text-lg text-blue-200/80 font-medium">
                        Building a decentralized ecosystem where trust fuels growth.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          ref={testimonialsSectionRef}
          className="relative py-20 sm:py-24 md:py-32 overflow-hidden transition-all duration-1000"
        >
          <div className="container mx-auto px-4 relative z-10">
            {/* Section header */}
            <div className="text-center relative z-10 mb-16">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <motion.h2
                  className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                style={{
                    textShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                  willChange: "transform, opacity",
                }}
                >
                  What Researchers Say
                </motion.h2>

                <motion.p
                  className="text-lg text-blue-100/80 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  style={{ willChange: "transform, opacity" }}
                >
                  Hear from leading researchers and institutions who trust Mintellect for their verification needs
                </motion.p>
              </motion.div>
          </div>

            {/* Testimonials content */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <MintellectTestimonials />
            </motion.div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section
          id="cta"
          ref={ctaSectionRef}
          className="relative py-20 sm:py-24 md:py-32 overflow-hidden transition-all duration-1000"
        >



          <div className="container mx-auto px-4 relative z-10">
            {/* Section header with enhanced animated glow */}
            <div className="text-center relative z-10 mb-16">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <motion.h2
                  className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  style={{
                    textShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                    willChange: "transform, opacity",
                  }}
                >
                  Ready to Get Started?
                </motion.h2>

                <motion.div
                  className="w-40 h-1 bg-gradient-to-r from-blue-400/0 via-blue-400 to-blue-400/0 mx-auto mt-6"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    boxShadow: [
                      "0 0 5px rgba(59, 130, 246, 0.3)",
                      "0 0 15px rgba(59, 130, 246, 0.6)",
                      "0 0 5px rgba(59, 130, 246, 0.3)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
                  style={{ backgroundSize: "200% 100%", willChange: "transform, opacity" }}
                />
              </motion.div>

              <motion.p
                className="text-lg text-blue-100/80 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ willChange: "transform, opacity" }}
              >
                Join Mintellect today and revolutionize your research verification process
              </motion.p>
            </div>

            {/* CTA Content */}
            <div className="max-w-3xl mx-auto">
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{ willChange: "transform, opacity" }}
              >
                <div className="relative rounded-xl border border-blue-500/20 bg-black/40 backdrop-blur-md p-8 overflow-hidden h-full">


                  {/* CTA pattern overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="ctaPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                          <rect
                            x="20"
                            y="20"
                            width="40"
                            height="40"
                            stroke="rgba(59, 130, 246, 0.8)"
                            strokeWidth="1"
                            fill="none"
                          />
                          <circle cx="40" cy="40" r="10" fill="rgba(59, 130, 246, 0.3)" />
                        </pattern>
                      </defs>
                      <rect x="0" y="0" width="100%" height="100%" fill="url(#ctaPattern)" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-center">
                      <Link href="https://app.mintellect.xyz" target="_blank" rel="noopener noreferrer">
                        <motion.button
                          className="group relative h-14 w-48 rounded-full overflow-hidden"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Transparent background */}
                          <motion.div
                            className="absolute inset-0 bg-blue-500/10 backdrop-blur-md"
                            animate={{
                              backgroundColor: [
                                "rgba(59, 130, 246, 0.1)",
                                "rgba(59, 130, 246, 0.2)",
                                "rgba(59, 130, 246, 0.1)",
                              ],
                            }}
                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                            style={{ willChange: "transform, opacity" }}
                          />

                          {/* Animated border */}
                          <motion.div
                            className="absolute inset-0 rounded-full border border-blue-500/30"
                            animate={{
                              borderColor: [
                                "rgba(59, 130, 246, 0.3)",
                                "rgba(59, 130, 246, 0.6)",
                                "rgba(59, 130, 246, 0.3)",
                              ],
                            }}
                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                            style={{ willChange: "transform, opacity" }}
                          />

                          {/* Animated glow */}
                          <motion.div
                            className="absolute -inset-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            animate={{
                              boxShadow: [
                                "0 0 5px rgba(59, 130, 246, 0.2)",
                                "0 0 10px rgba(59, 130, 246, 0.3)",
                                "0 0 5px rgba(59, 130, 246, 0.2)",
                              ],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            style={{ willChange: "transform, opacity" }}
                          />



                          {/* Button text */}
                          <span className="relative flex items-center justify-center text-base font-medium text-white h-full">
                            Get Started
                            <div className="ml-2">
                              <ArrowRight className="h-5 w-5" />
                            </div>
                          </span>
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <p className="text-blue-100/70 text-sm">© {new Date().getFullYear()} Mintellect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

