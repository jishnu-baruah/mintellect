"use client"

import { motion } from "framer-motion"
import { SectionTitle } from "@/components/ui/section-title"

export default function Roadmap() {
  const roadmapItems = [
    {
      date: "Q2 2025",
      title: "Phase 1: Foundation",
      description: "User registration system, basic uploading & viewing features, and initial plagiarism detection.",
      color: "#3a6bc4",
    },
    {
      date: "Q3 2025",
      title: "Phase 2: Monetization",
      description: "Payment and membership system, full paper access, and first version of AI trust score evaluation.",
      color: "#5a5cd6",
    },
    {
      date: "Q4 2025",
      title: "Phase 3: AI Integration",
      description: "Plagiarism reduction tools, human review system, and initial AI recommendations for readers.",
      color: "#7a4dd8",
    },
    {
      date: "Q1 2026",
      title: "Phase 4: Community",
      description: "AI accuracy improvements, community features, and token-based reward distribution.",
      color: "#9d4edd",
    },
  ]

  return (
    <section id="roadmap" className="py-20 bg-ui-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Roadmap"
          subtitle="Our development journey from concept to global research platform"
          centered={false}
        />

        <div className="mt-12">
          <div className="hidden md:block relative mb-8">
            {/* Horizontal timeline line */}
            <motion.div
              className="absolute top-12 left-0 right-0 h-0.5 bg-ui-border"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            ></motion.div>

            {/* Timeline dots */}
            {roadmapItems.map((_, index) => (
              <motion.div
                key={index}
                className="absolute top-12 w-3 h-3 rounded-full bg-primary-light transform -translate-y-1/2"
                style={{
                  left: `calc(${index * (100 / (roadmapItems.length - 1))}%)`,
                  backgroundColor: roadmapItems[index].color,
                }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
              ></motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={index}
                className="bg-ui-card border border-ui-border rounded-lg p-5 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {/* Mobile timeline dot */}
                <div
                  className="md:hidden absolute -left-1.5 top-6 w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>

                {/* Mobile timeline line */}
                <div className="md:hidden absolute top-0 bottom-0 left-0 w-0.5 bg-ui-border"></div>

                <div
                  className="px-3 py-1 rounded-full text-sm font-medium inline-block mb-3"
                  style={{ background: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}
                >
                  {item.date}
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent mb-2">
                  {item.title}
                </h3>
                <p className="text-white/70 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

