"use client"

import { useState, useRef, useEffect } from "react"
import { AnimatedBackground } from "@/components/ui/animated-background"
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
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import GridBackground from "@/components/ui/grid-background"
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
    description: "Real researchers from the community review your paper.",
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
    title: "Multi-Agent Verification System",
    description:
      "Our specialized AI agents work collaboratively to verify research integrity with unprecedented accuracy",
    icon: Brain,
    link: "#neural-text-analysis",
  },
  {
    title: "Plagiarism Detection",
    description: "99.7% accuracy across academic databases.",
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Add this to the beginning of the component
  const sectionRefs = {
    hero: useRef(null),
    capabilities: useRef(null),
    tech: useRef(null),
    verification: useRef(null),
    workflow: useRef(null),
    cta: useRef(null),
  }

  // Refs for sections
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const capabilitiesSectionRef = useRef<HTMLDivElement>(null)
  const techSectionRef = useRef<HTMLDivElement>(null)
  const verificationSectionRef = useRef<HTMLDivElement>(null)
  const workflowSectionRef = useRef<HTMLDivElement>(null)
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
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Determine active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      const sections = [
        { ref: heroRef, id: "hero" },
        { ref: capabilitiesSectionRef, id: "capabilities" },
        { ref: techSectionRef, id: "tech" },
        { ref: verificationSectionRef, id: "verification" },
        { ref: workflowSectionRef, id: "workflow" },
        { ref: ctaSectionRef, id: "cta" },
      ]

      for (const section of sections) {
        if (!section.ref.current) continue

        const rect = section.ref.current.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
          setActiveSection(section.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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

    // Add CSS to the head for smoother transitions
    const style = document.createElement("style")
    style.textContent = `
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
.animate-gradient-x {
  background-size: 200% 100%;
  animation: gradientFlow 4s linear infinite;
}
@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.animate-blink {
  animation: blink 1s step-end infinite;
}
`
    document.head.appendChild(style)

    return () => {
      document.documentElement.style.scrollBehavior = ""
      document.body.classList.remove("smooth-scroll")
      document.head.removeChild(style)
    }
  }, [])

  // Add this effect for smooth section transitions
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id
            setActiveSection(sectionId)

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
      className="min-h-screen bg-black text-white overflow-x-hidden scroll-smooth transition-all duration-500"
      ref={containerRef}
    >
      {/* Dynamic background with parallax effect */}
      <div className="fixed inset-0 -z-10">
        <AnimatedBackground />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black opacity-90"
          style={{
            backgroundPosition: `${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%`,
            willChange: "transform, opacity",
          }}
        />

        {/* Dynamic grid pattern that reacts to mouse movement */}
        <motion.div
          className="absolute inset-0 bg-grid-pattern opacity-10"
          style={{
            backgroundPosition: `${mousePosition.x * 20}px ${mousePosition.y * 20}px`,
            backgroundSize: `${60 + mousePosition.x * 10}px ${60 + mousePosition.y * 10}px`,
            willChange: "transform, opacity",
          }}
        />

        {/* Glowing orbs that follow mouse movement */}
        <motion.div
          className="absolute rounded-full bg-blue-500/5 blur-3xl"
          style={{
            width: "40vw",
            height: "40vw",
            left: `${mousePosition.x * 100}%`,
            top: `${mousePosition.y * 100}%`,
            transform: "translate(-50%, -50%)",
            willChange: "transform, opacity",
          }}
        />
      </div>

      {/* Futuristic navigation indicator */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
        <div className="flex flex-col items-center gap-6">
          {["hero", "capabilities", "tech", "verification", "workflow", "cta"].map((section) => (
            <motion.div
              key={section}
              className="relative w-3 h-3 rounded-full cursor-pointer"
              animate={{
                backgroundColor: activeSection === section ? "rgba(59, 130, 246, 0.8)" : "rgba(59, 130, 246, 0.2)",
                scale: activeSection === section ? 1.2 : 1,
              }}
              whileHover={{ scale: 1.3 }}
              onClick={() => {
                const element = document.getElementById(section)
                if (element) element.scrollIntoView({ behavior: "smooth" })
              }}
            >
              {activeSection === section && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-500/30"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              )}
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
          {/* Enhanced 3D Grid Background */}
          <div className="absolute inset-0 -z-5 perspective-[1500px]">
            <motion.div
              className="absolute inset-0"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateX(${5 + mousePosition.y * 10}deg) rotateY(${-5 + mousePosition.x * 10}deg)`,
                willChange: "transform, opacity",
              }}
            >
              <GridBackground gridColor="#3b82f6" fadeColor="#000000" />
            </motion.div>
          </div>

          {/* Main hero content with enhanced 3D effects and optimized for performance */}
          <div className="container mx-auto px-2 sm:px-4 md:px-6 relative z-10 w-full">
            <motion.div
              className="flex flex-col items-center justify-center min-h-[80vh] perspective-[1200px]"
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
                  className="relative rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden"
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {/* Animated background effect */}
                  <motion.div
                    className="absolute inset-0 -z-10 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Animated gradient background */}
                    <motion.div
                      className="absolute -inset-10"
                      style={{
                        background:
                          "linear-gradient(125deg, rgba(10, 20, 40, 0.3), rgba(0, 10, 30, 0.1), rgba(20, 40, 80, 0.2))",
                        filter: "blur(20px)",
                      }}
                      animate={{
                        background: [
                          "linear-gradient(125deg, rgba(10, 20, 40, 0.3), rgba(0, 10, 30, 0.1), rgba(20, 40, 80, 0.2))",
                          "linear-gradient(225deg, rgba(20, 40, 80, 0.2), rgba(10, 20, 40, 0.3), rgba(0, 10, 30, 0.1))",
                          "linear-gradient(325deg, rgba(0, 10, 30, 0.1), rgba(20, 40, 80, 0.2), rgba(10, 20, 40, 0.3))",
                          "linear-gradient(125deg, rgba(10, 20, 40, 0.3), rgba(0, 10, 30, 0.1), rgba(20, 40, 80, 0.2))",
                        ],
                      }}
                      transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    {/* Tiny animated background dots */}
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={`tiny-dot-${i}`}
                        className="absolute rounded-full bg-blue-300/10"
                        style={{
                          width: 1 + Math.random() * 2,
                          height: 1 + Math.random() * 2,
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          opacity: [0.1, 0.5, 0.1],
                          scale: [1, 1.5, 1],
                          x: [0, Math.random() * 10 - 5, 0],
                          y: [0, Math.random() * 10 - 5, 0],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </motion.div>

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
                                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-600 animate-gradient-x whitespace-nowrap"
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
                      style={{ willChange: "transform, opacity" }}
                    >
                      <Link href="https://app.mintellect.xyz" target="_blank" rel="noopener noreferrer">
                        <motion.button
                          className="group relative h-12 sm:h-14 w-40 sm:w-48 rounded-full overflow-hidden"
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
          {/* Enhanced background with neural network visualization */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-gray-950/90 to-black/80">
            {/* Dynamic neural network background */}

            {/* Enhanced hexagonal grid pattern */}
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.5 0l5 5-5 5-5-5 5-5zm-49 5l5 5-5 5-5-5 5-5zm44 44l5 5-5 5-5-5 5-5zm-49 5l5 5-5 5-5-5 5-5zM5 30l5 5-5 5-5-5 5-5zm44 0l5 5-5 5-5-5 5-5zm-20-25l5 5-5 5-5-5 5-5zm0 50l5 5-5 5-5-5 5-5z' fill='rgba(59, 130, 246, 0.15)' fillOpacity='0.4' fillRule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: `${60 + mousePosition.x * 20}px`,
                opacity: 0.2,
                transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
                willChange: "transform, opacity",
              }}
              animate={{
                backgroundPosition: ["0px 0px", "60px 60px"],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />

            {/* Animated circuit lines */}

            {/* Enhanced digital data particles - reduced count */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`data-particle-verification-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 1 + Math.random() * 2,
                  height: 1 + Math.random() * 2,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `rgba(${59 + Math.random() * 30}, ${130 + Math.random() * 40}, ${246}, ${0.6 + Math.random() * 0.4})`,
                  boxShadow: `0 0 ${2 + Math.random() * 5}px rgba(59, 130, 246, 0.8)`,
                  willChange: "transform, opacity",
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, (Math.random() - 0.5) * 100],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.2, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Digital code rain effect - reduced count */}
          </div>

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
                    AI agent detects plagiarism and suggests improvements if similarity {">"}15%.
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
                    From plagiarism checks to citation audits, our AI ensures your work stands on trusted ground.
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
          {/* Enhanced background with blockchain pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-gray-950/90 to-black/80">
            {/* Dynamic blockchain network background */}

            {/* Enhanced hexagonal grid pattern */}
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.5 0l5 5-5 5-5-5 5-5zm-49 5l5 5-5 5-5-5 5-5zm44 44l5 5-5 5-5-5 5-5zm-49 5l5 5-5 5-5-5 5-5zM5 30l5 5-5 5-5-5 5-5zm44 0l5 5-5 5-5-5 5-5zm-20-25l5 5-5 5-5-5 5-5zm0 50l5 5-5 5-5-5 5-5z' fill='rgba(59, 130, 246, 0.15)' fillOpacity='0.4' fillRule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: `${60 + mousePosition.x * 20}px`,
                opacity: 0.2,
                transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
                willChange: "transform, opacity",
              }}
              animate={{
                backgroundPosition: ["0px 0px", "60px 60px"],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />

            {/* Animated circuit lines */}

            {/* Enhanced digital data particles */}
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={`data-particle-blockchain-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 1 + Math.random() * 3,
                  height: 1 + Math.random() * 3,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `rgba(${59 + Math.random() * 30}, ${130 + Math.random() * 40}, ${246}, ${0.6 + Math.random() * 0.4})`,
                  boxShadow: `0 0 ${3 + Math.random() * 8}px rgba(59, 130, 246, 0.9)`,
                  willChange: "transform, opacity",
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 150],
                  y: [0, (Math.random() - 0.5) * 150],
                  opacity: [0, 0.9, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Digital code rain effect */}
          </div>

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
          {/* Enhanced workflow background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-gray-950/90 to-black/80">
            {/* Dynamic workflow visualization */}

            {/* Enhanced hexagonal grid pattern */}
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.5 0l5 5-5 5-5-5 5-5zm-49 5l5 5-5 5-5-5 5-5zm44 44l5 5-5 5-5-5 5-5zm-49 5l5 5-5 5-5-5 5-5zM5 30l5 5-5 5-5-5 5-5zm44 0l5 5-5 5-5-5 5-5zm-20-25l5 5-5 5-5-5 5-5zm0 50l5 5-5 5-5-5 5-5z' fill='rgba(59, 130, 246, 0.15)' fillOpacity='0.4' fillRule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: `${60 + mousePosition.x * 20}px`,
                opacity: 0.2,
                transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
                willChange: "transform, opacity",
              }}
              animate={{
                backgroundPosition: ["0px 0px", "60px 60px"],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />

            {/* Animated circuit lines */}

            {/* Enhanced digital data particles */}
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={`data-particle-workflow-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 1 + Math.random() * 3,
                  height: 1 + Math.random() * 3,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `rgba(${59 + Math.random() * 30}, ${130 + Math.random() * 40}, ${246}, ${0.6 + Math.random() * 0.4})`,
                  boxShadow: `0 0 ${3 + Math.random() * 8}px rgba(59, 130, 246, 0.9)`,
                  willChange: "transform, opacity",
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 150],
                  y: [0, (Math.random() - 0.5) * 150],
                  opacity: [0, 0.9, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Digital code rain effect */}
          </div>

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
                            {/* Animated background effect */}
                            <motion.div
                              className="absolute inset-0 opacity-20"
                              animate={{
                                background: [
                                  "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
                                  "radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
                                ],
                              }}
                              transition={{
                                duration: 5,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                                ease: "easeInOut",
                              }}
                              style={{ willChange: "transform, opacity" }}
                            />

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

        {/* Call to Action Section */}
        <section
          id="cta"
          ref={ctaSectionRef}
          className="relative py-20 sm:py-24 md:py-32 overflow-hidden transition-all duration-1000"
        >
          {/* Enhanced CTA background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-gray-950/90 to-black/80">
            {/* Dynamic CTA visualization */}

            {/* Enhanced hexagonal grid pattern */}
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.5 0l5 5-5 5-5-5 5-5zm-49 5l5 5-5 5-5-5 5-5zm44 44l5 5-5 5-5-5 5-5zm-49 5l5 5-5 5-5-5 5-5zM5 30l5 5-5 5-5-5 5-5zm44 0l5 5-5 5-5-5 5-5zm-20-25l5 5-5 5-5-5 5-5zm0 50l5 5-5 5-5-5 5-5z' fill='rgba(59, 130, 246, 0.15)' fillOpacity='0.4' fillRule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: `${60 + mousePosition.x * 20}px`,
                opacity: 0.2,
                transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
                willChange: "transform, opacity",
              }}
              animate={{
                backgroundPosition: ["0px 0px", "60px 60px"],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />

            {/* Animated circuit lines */}

            {/* Enhanced digital data particles */}
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={`data-particle-cta-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 1 + Math.random() * 3,
                  height: 1 + Math.random() * 3,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `rgba(${59 + Math.random() * 30}, ${130 + Math.random() * 40}, ${246}, ${0.6 + Math.random() * 0.4})`,
                  boxShadow: `0 0 ${3 + Math.random() * 8}px rgba(59, 130, 246, 0.9)`,
                  willChange: "transform, opacity",
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 150],
                  y: [0, (Math.random() - 0.5) * 150],
                  opacity: [0, 0.9, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Digital code rain effect */}
          </div>

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
                  {/* Animated background effect */}
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    animate={{
                      background: [
                        "radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
                        "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
                      ],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                    style={{ willChange: "transform, opacity" }}
                  />

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

                          {/* Orbital particles */}
                          {[...Array(3)].map((_, i) => {
                            const angle = (i / 3) * Math.PI * 2
                            return (
                              <motion.div
                                key={`cta-button-particle-${i}`}
                                className="absolute w-1 h-1 rounded-full bg-blue-400"
                                animate={{
                                  x: [
                                    `calc(${Math.cos(angle)} * 20px)`,
                                    `calc(${Math.cos(angle + Math.PI * 2)} * 20px)`,
                                  ],
                                  y: [
                                    `calc(${Math.sin(angle)} * 20px)`,
                                    `calc(${Math.sin(angle + Math.PI * 2)} * 20px)`,
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
                          <span className="relative flex items-center justify-center text-base font-medium text-white h-full">
                            Get Started
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                              className="ml-2"
                              style={{ willChange: "transform, opacity" }}
                            >
                              <ArrowRight className="h-5 w-5" />
                            </motion.div>
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

