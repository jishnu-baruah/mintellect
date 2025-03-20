import Hero from "@/components/sections/hero"
import About from "@/components/sections/about"
import HowItWorks from "@/components/sections/how-it-works"
import Benefits from "@/components/sections/benefits"
import Roadmap from "@/components/sections/roadmap"
import CtaSection from "@/components/sections/cta-section"
import Footer from "@/components/sections/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mintellect | Web3 Research Publishing Platform",
  description:
    "Empowering researchers and preserving knowledge on-chain with blockchain technology, AI-powered trust scores, and human verification.",
  keywords: "research publishing, blockchain, Web3, academic research, on-chain research, plagiarism detection",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-primary-dark dark">
      <Hero />
      <About />
      <HowItWorks />
      <Benefits />
      <Roadmap />
      <CtaSection />
      <Footer />
    </main>
  )
}

