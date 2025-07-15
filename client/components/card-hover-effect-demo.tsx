import { HoverEffect } from "@/components/ui/card-hover-effect"
import { Brain, FileSearch, ScrollText } from "lucide-react"

export default function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  )
}

export const projects = [
  {
    title: "Neural Text Analysis",
    description: "Deep learning analysis for authenticity verification.",
    link: "#neural-text-analysis",
    icon: <Brain className="h-6 w-6 text-blue-400" />,
  },
  {
    title: "Plagiarism Detection",
    description: "99.7% accuracy across academic databases.",
    link: "#plagiarism-detection",
    icon: <FileSearch className="h-6 w-6 text-blue-400" />,
  },
  {
    title: "Citation Analysis",
    description: "Validates references against trusted sources.",
    link: "#citation-analysis",
    icon: <ScrollText className="h-6 w-6 text-blue-400" />,
  },
]
