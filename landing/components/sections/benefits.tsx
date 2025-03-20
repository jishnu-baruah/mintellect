"use client"

import { motion } from "framer-motion"
import { BookOpen, FileText, Eye, Award, Search, ThumbsUp, Users, BadgeCheck } from "lucide-react"
import { SectionTitle } from "@/components/ui/section-title"
import { FuturisticCard } from "@/components/ui/futuristic-card"

export default function Benefits() {
  const benefitGroups = [
    {
      title: "For Researchers",
      benefits: [
        {
          icon: <FileText className="h-6 w-6 text-primary-light" />,
          title: "On-Chain Minting",
          description: "Mint your research papers as NFTs, ensuring immutability and ownership verification.",
        },
        {
          icon: <Eye className="h-6 w-6 text-primary-light" />,
          title: "Quality Enhancement",
          description: "Access AI-driven tools to improve citations and reduce plagiarism in your papers.",
        },
        {
          icon: <Award className="h-6 w-6 text-primary-light" />,
          title: "Monetization",
          description: "Earn EDU tokens and platform credits when your research is cited within the platform.",
        },
      ],
      align: "left",
      accentColor: "#3a6bc4",
    },
    {
      title: "For Readers",
      benefits: [
        {
          icon: <BookOpen className="h-6 w-6 text-secondary" />,
          title: "Free Browsing",
          description: "Access abstracts and titles for free to discover relevant research.",
        },
        {
          icon: <Search className="h-6 w-6 text-secondary" />,
          title: "AI Recommendations",
          description: "Receive personalized paper suggestions based on your interests and reading history.",
        },
        {
          icon: <ThumbsUp className="h-6 w-6 text-secondary" />,
          title: "Membership Options",
          description: "Opt for a membership for wider access to complete papers and platform features.",
        },
      ],
      align: "right",
      accentColor: "#6f278e",
    },
    {
      title: "For Reviewers",
      benefits: [
        {
          icon: <Users className="h-6 w-6 text-primary-light" />,
          title: "Token Rewards",
          description: "Earn EDU tokens for contributing as a verified reviewer in the human verification process.",
        },
        {
          icon: <BadgeCheck className="h-6 w-6 text-secondary" />,
          title: "Community Participation",
          description: "Engage in discussions and earn tokens while contributing to research integrity.",
        },
      ],
      align: "left",
      accentColor: "#3a6bc4",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="benefits" className="py-20 bg-primary-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Key Benefits" subtitle="Value for everyone in the research ecosystem" centered={false} />

        <div className="mt-12 space-y-20">
          {benefitGroups.map((group, groupIndex) => (
            <motion.div
              key={groupIndex}
              className={`flex flex-col ${group.align === "right" ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-start`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full md:w-1/2">
                <motion.h3
                  className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: group.align === "right" ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {group.title}
                </motion.h3>
                <motion.div
                  className="grid grid-cols-1 gap-4"
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {group.benefits.map((benefit, benefitIndex) => (
                    <motion.div
                      key={benefitIndex}
                      className="bg-ui-background border border-ui-border rounded-lg p-4 hover:border-primary-light transition-colors duration-300"
                      variants={item}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="flex items-start">
                        <div className="p-2 rounded-lg bg-ui-card mr-3 flex-shrink-0">{benefit.icon}</div>
                        <div>
                          <h4 className="text-lg font-semibold mb-1 text-white">{benefit.title}</h4>
                          <p className="text-white/70 text-sm">{benefit.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                className="w-full md:w-1/2"
                initial={{ opacity: 0, x: group.align === "right" ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <FuturisticCard accentColor={group.accentColor}>
                  <h4 className="text-xl font-bold mb-4 text-white">
                    {group.title === "For Researchers"
                      ? "Publish with Confidence"
                      : group.title === "For Readers"
                        ? "Discover Verified Research"
                        : "Contribute to Research Integrity"}
                  </h4>
                  <motion.p
                    className="text-white/70 mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {group.title === "For Researchers"
                      ? "Mintellect provides researchers with tools to ensure their work is properly verified, protected, and monetized."
                      : group.title === "For Readers"
                        ? "Access high-quality, verified research with confidence in its authenticity and originality."
                        : "Join our community of reviewers to help maintain research integrity while earning rewards."}
                  </motion.p>
                  <motion.ul
                    className="space-y-2"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                  >
                    <motion.li className="flex items-start" variants={item}>
                      <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-light"></div>
                      </div>
                      <span className="text-white/70 text-sm">
                        {group.title === "For Researchers"
                          ? "Protect your intellectual property"
                          : group.title === "For Readers"
                            ? "Find relevant research faster"
                            : "Earn while contributing to science"}
                      </span>
                    </motion.li>
                    <motion.li className="flex items-start" variants={item}>
                      <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-light"></div>
                      </div>
                      <span className="text-white/70 text-sm">
                        {group.title === "For Researchers"
                          ? "Get recognized for your contributions"
                          : group.title === "For Readers"
                            ? "Trust in verified content"
                            : "Build your reputation in the community"}
                      </span>
                    </motion.li>
                  </motion.ul>
                </FuturisticCard>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

