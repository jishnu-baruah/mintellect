"use client"

import type React from "react"
import { PinContainer } from "@/components/ui/3d-pin"

interface AICapability {
  title: string
  description: string
  icon?: React.ReactNode
  gradient: string
  link: string
}

const capabilities: AICapability[] = [
  {
    title: "Plagiarism Detection",
    description: "Advanced AI algorithms to detect and highlight potential plagiarism in academic work.",
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    link: "/workflow",
  },
  {
    title: "Citation Analysis",
    description: "Verify and analyze citations for accuracy, completeness, and proper formatting.",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    link: "/workflow",
  },
  {
    title: "Content Verification",
    description: "Verify factual accuracy and identify potential misinformation in research papers.",
    gradient: "from-pink-500 via-rose-500 to-purple-500",
    link: "/workflow",
  },
  {
    title: "Style Consistency",
    description: "Ensure consistent writing style, tone, and formatting throughout academic documents.",
    gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
    link: "/workflow",
  },
  {
    title: "Trust Score Generation",
    description: "Generate comprehensive trust scores based on multiple verification factors.",
    gradient: "from-fuchsia-500 via-purple-500 to-violet-500",
    link: "/workflow",
  },
  {
    title: "Blockchain Certification",
    description: "Secure and immutable certification of verified academic content on the blockchain.",
    gradient: "from-violet-500 via-indigo-500 to-blue-500",
    link: "/workflow",
  },
]

export function AICapabilities() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Capabilities</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our platform leverages cutting-edge AI to verify, validate, and certify academic content with unprecedented
            accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mt-20">
          {capabilities.map((capability, index) => (
            <div key={index} className="h-[400px] flex items-center justify-center">
              <PinContainer title={capability.title} href={capability.link}>
                <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 w-[20rem] h-[20rem]">
                  <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">{capability.title}</h3>
                  <div className="text-base !m-0 !p-0 font-normal">
                    <span className="text-slate-400">{capability.description}</span>
                  </div>
                  <div className={`flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br ${capability.gradient}`} />
                </div>
              </PinContainer>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
