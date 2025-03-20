"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FuturisticButton } from "@/components/ui/futuristic-button"

export default function CtaSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90 z-0"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <span className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium text-white">
              Join the Revolution
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6 text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Ready to Transform Research Publishing?
          </motion.h2>

          <motion.p
            className="text-xl text-white/70 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Join Mintellect today and be part of the revolution in academic research verification, publication, and
            monetization through Web3 technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link href="https://x.com/_Mintellect_" target="_blank" rel="noopener noreferrer">
              <FuturisticButton
                variant="secondary"
                size="lg"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                }
                className="bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20"
              >
                Join Mintellect Now
              </FuturisticButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

