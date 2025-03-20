"use client"

import { motion } from "framer-motion"
import { FileCheck, Search, Brain, UserCheck, BookOpen, Upload } from "lucide-react"
import { SectionTitle } from "@/components/ui/section-title"
import { FuturisticCard } from "@/components/ui/futuristic-card"

export default function HowItWorks() {
  const steps = [
    {
      icon: <Upload className="h-8 w-8 text-primary-light" />,
      title: "Upload & Register",
      description: "Sign up and upload your research paper to the Mintellect platform.",
      align: "left",
      accentColor: "#3a6bc4",
    },
    {
      icon: <Search className="h-8 w-8 text-secondary" />,
      title: "Plagiarism Check",
      description: "Our AI scans your paper for plagiarism with high accuracy and precision.",
      align: "right",
      accentColor: "#6f278e",
    },
    {
      icon: <Brain className="h-8 w-8 text-primary-light" />,
      title: "AI Trust Score",
      description: "Get an AI-generated trust score that evaluates content authenticity.",
      align: "left",
      accentColor: "#3a6bc4",
    },
    {
      icon: <UserCheck className="h-8 w-8 text-secondary" />,
      title: "Human Verification",
      description: "Expert reviewers validate your research for quality and authenticity.",
      align: "right",
      accentColor: "#6f278e",
    },
    {
      icon: <FileCheck className="h-8 w-8 text-primary-light" />,
      title: "On-chain Publication",
      description: "Your verified research is minted as an NFT on the blockchain.",
      align: "left",
      accentColor: "#3a6bc4",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-secondary" />,
      title: "Access & Monetize",
      description: "Readers can access your work, and you earn tokens when cited.",
      align: "right",
      accentColor: "#6f278e",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-ui-background mt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="How It Works" subtitle="A simple process from upload to publication" centered={false} />

        <div className="mt-12 space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${step.align === "right" ? "md:flex-row-reverse" : "md:flex-row"} gap-6 items-center`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="w-full md:w-1/2">
                <div className={`${step.align === "right" ? "md:text-right" : "md:text-left"}`}>
                  <div className={`flex items-center mb-3 ${step.align === "right" ? "md:justify-end" : ""}`}>
                    <motion.div
                      className={`bg-ui-card rounded-full p-3 border border-ui-border ${step.align === "right" ? "md:order-2 md:ml-3" : "mr-3"}`}
                      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                    >
                      {step.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-white/70">{step.description}</p>
                </div>
              </div>

              <motion.div className="w-full md:w-1/2" whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <FuturisticCard accentColor={step.accentColor}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-bold text-white/10">{index + 1}</span>
                    <div className="h-1 flex-grow ml-4 bg-gradient-to-r from-primary/20 to-transparent rounded"></div>
                  </div>

                  <div className="space-y-3">
                    <motion.div
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-light mt-2 mr-2"></div>
                      <p className="text-white/70 text-sm">
                        {index === 0
                          ? "Create an account with your email or wallet"
                          : index === 1
                            ? "AI compares your paper against millions of sources"
                            : index === 2
                              ? "Receive a detailed report on content originality"
                              : index === 3
                                ? "Experts in your field review your submission"
                                : index === 4
                                  ? "Your paper is permanently stored on blockchain"
                                  : "Set your own terms for access and citation"}
                      </p>
                    </motion.div>
                    <motion.div
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-light mt-2 mr-2"></div>
                      <p className="text-white/70 text-sm">
                        {index === 0
                          ? "Upload your paper in PDF, DOCX, or LaTeX format"
                          : index === 1
                            ? "Get suggestions to improve citations if needed"
                            : index === 2
                              ? "AI distinguishes between human and AI-written content"
                              : index === 3
                                ? "Receive feedback to improve your research"
                                : index === 4
                                  ? "Receive a unique NFT certificate of authenticity"
                                  : "Track citations and engagement with your research"}
                      </p>
                    </motion.div>
                  </div>
                </FuturisticCard>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

