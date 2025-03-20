"use client"

import { motion } from "framer-motion"
import { CheckCircle, Shield, Zap, Database, Brain } from "lucide-react"
import { SectionTitle } from "@/components/ui/section-title"
import { FuturisticCard } from "@/components/ui/futuristic-card"

export default function About() {
  const features = [
    {
      icon: <Database className="h-6 w-6 text-primary-light" />,
      title: "On-chain Research",
      description: "Mint your research as NFTs for immutable proof of ownership.",
    },
    {
      icon: <Shield className="h-6 w-6 text-secondary" />,
      title: "Plagiarism Detection",
      description: "Advanced algorithms detect plagiarism with high accuracy.",
    },
    {
      icon: <Zap className="h-6 w-6 text-primary-light" />,
      title: "Citation Tools",
      description: "Intelligent tools to help improve your citations.",
    },
    {
      icon: <Brain className="h-6 w-6 text-secondary" />,
      title: "AI Trust Score",
      description: "Evaluate AI-generated vs. human-written content.",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="about" className="py-20 bg-primary-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="About Mintellect"
          subtitle="Revolutionizing research publication through blockchain technology"
          centered={false}
        />

        <div className="mt-12 space-y-12">
          {/* Mission Statement - Left Aligned */}
          <motion.div
            className="flex flex-col md:flex-row gap-8 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full md:w-1/2">
              <motion.h3
                className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Our Mission
              </motion.h3>
              <motion.p
                className="text-white/70 mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                We're building a future where research is verified, trusted, and accessible to all. By leveraging
                blockchain technology, we ensure that published research is immutable, traceable, and free from
                manipulation.
              </motion.p>
              <motion.p
                className="text-white/70"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Mintellect democratizes research publication, encouraging contributions from both established and
                emerging researchers without requiring extensive academic credentials.
              </motion.p>
            </div>
            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <FuturisticCard accentColor="#3a6bc4">
                <h4 className="text-xl font-bold mb-4 text-white">Why Blockchain?</h4>
                <motion.ul
                  className="space-y-3"
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <motion.li className="flex items-start" variants={item}>
                    <CheckCircle className="h-5 w-5 text-primary-light mr-2 mt-1 flex-shrink-0" />
                    <span className="text-white/70">Immutable record of research publication</span>
                  </motion.li>
                  <motion.li className="flex items-start" variants={item}>
                    <CheckCircle className="h-5 w-5 text-primary-light mr-2 mt-1 flex-shrink-0" />
                    <span className="text-white/70">Transparent verification process</span>
                  </motion.li>
                  <motion.li className="flex items-start" variants={item}>
                    <CheckCircle className="h-5 w-5 text-primary-light mr-2 mt-1 flex-shrink-0" />
                    <span className="text-white/70">Fair compensation through tokenization</span>
                  </motion.li>
                </motion.ul>
              </FuturisticCard>
            </motion.div>
          </motion.div>

          {/* Features - Right Aligned */}
          <motion.div
            className="flex flex-col md:flex-row-reverse gap-8 items-start"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full md:w-1/2">
              <motion.h3
                className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Key Features
              </motion.h3>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-ui-card border border-ui-border rounded-lg p-4 hover:border-primary-light transition-colors duration-300"
                    variants={item}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-start mb-2">
                      <div className="p-2 rounded-lg bg-ui-background mr-3 flex-shrink-0">{feature.icon}</div>
                      <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
                    </div>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <FuturisticCard accentColor="#6f278e">
                <h4 className="text-xl font-bold mb-4 text-white">How We're Different</h4>
                <motion.p
                  className="text-white/70 mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Unlike traditional academic publishing platforms, Mintellect combines AI-powered verification with
                  human expertise to ensure research quality while providing fair compensation to authors.
                </motion.p>
                <motion.p
                  className="text-white/70"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Our multi-layered approach to verification creates a trustworthy ecosystem for knowledge sharing and
                  discovery.
                </motion.p>
              </FuturisticCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

