"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import { FileText, Download, Share2, CheckCircle, AlertCircle, Info, BookOpen, LinkIcon, Award } from "lucide-react"

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for the document
  const document = {
    id: params.id,
    name: "Research Paper on AI Ethics.pdf",
    date: "2023-05-15",
    type: "PDF",
    status: "complete",
    scores: {
      overall: 85,
      originality: 82,
      citations: 78,
      references: 90,
      credibility: 75,
      language: 88,
      structure: 84,
    },
    feedback: [
      {
        type: "success",
        message: "Your document meets the basic requirements for academic submission.",
      },
      {
        type: "warning",
        message: "Citations could be improved. Consider adding more references to support your arguments on page 12.",
      },
      {
        type: "warning",
        message:
          "Some sentences may need revision for clarity and academic tone, particularly in the methodology section.",
      },
    ],
    plagiarismMatches: [
      {
        id: "match1",
        text: "The theory of relativity was developed by Albert Einstein in the early 20th century.",
        source: "Wikipedia - Theory of Relativity",
        similarity: 92,
        suggestion:
          "Einstein's groundbreaking work on relativity theory emerged in the early 1900s, revolutionizing physics.",
        page: 4,
      },
      {
        id: "match2",
        text: "Machine learning algorithms can be categorized as supervised, unsupervised, or reinforcement learning.",
        source: "Introduction to Machine Learning, 3rd Edition",
        similarity: 85,
        suggestion:
          "We can classify ML algorithms into three main types: supervised learning, unsupervised learning, and reinforcement learning approaches.",
        page: 7,
      },
    ],
  }

  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-400"
    if (value >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBackground = (value: number) => {
    if (value >= 80) return "bg-green-400"
    if (value >= 60) return "bg-yellow-400"
    return "bg-red-400"
  }

  const getScoreLabel = (value: number) => {
    if (value >= 80) return "Excellent"
    if (value >= 60) return "Good"
    return "Needs Improvement"
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analysis Results</h1>
          <div className="flex items-center gap-2 text-gray-400">
            <FileText className="h-4 w-4" />
            <span>{document.name}</span>
            <span className="mx-1">•</span>
            <span>{document.date}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <RippleButton variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </RippleButton>
          <RippleButton variant="outline" size="sm" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </RippleButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GlassCard className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Trust Score</h2>
            <span className={`text-sm font-medium ${getScoreColor(document.scores.overall)}`}>
              {getScoreLabel(document.scores.overall)}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="relative w-36 h-36 mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-4xl font-bold"
                    >
                      <span className={getScoreColor(document.scores.overall)}>{document.scores.overall}</span>
                    </motion.div>
                    <p className="text-sm text-gray-400">Overall Score</p>
                  </div>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={
                      document.scores.overall >= 80 ? "#4ade80" : document.scores.overall >= 60 ? "#facc15" : "#f87171"
                    }
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset="283"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{
                      strokeDashoffset: 283 - (283 * document.scores.overall) / 100,
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard icon={FileText} title="Originality" value={document.scores.originality} />
              <MetricCard icon={BookOpen} title="Citations" value={document.scores.citations} />
              <MetricCard icon={LinkIcon} title="References" value={document.scores.references} />
              <MetricCard icon={Award} title="Credibility" value={document.scores.credibility} />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-xl font-bold mb-4">AI Feedback</h2>
          <div className="space-y-3">
            {document.feedback.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-3 rounded-lg flex items-start gap-3 ${
                  item.type === "success"
                    ? "bg-green-400/10"
                    : item.type === "warning"
                      ? "bg-yellow-400/10"
                      : "bg-red-400/10"
                }`}
              >
                {item.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                ) : item.type === "warning" ? (
                  <Info className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                )}
                <p className="text-sm">{item.message}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-800 mb-6">
          <div className="flex overflow-x-auto">
            <TabButton isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
              Overview
            </TabButton>
            <TabButton isActive={activeTab === "plagiarism"} onClick={() => setActiveTab("plagiarism")}>
              Plagiarism
            </TabButton>
            <TabButton isActive={activeTab === "citations"} onClick={() => setActiveTab("citations")}>
              Citations
            </TabButton>
            <TabButton isActive={activeTab === "language"} onClick={() => setActiveTab("language")}>
              Language
            </TabButton>
            <TabButton isActive={activeTab === "structure"} onClick={() => setActiveTab("structure")}>
              Structure
            </TabButton>
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <GlassCard>
              <h2 className="text-xl font-bold mb-6">Document Overview</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-4">Strengths</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Strong reference quality and quantity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Good overall originality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Proper citation format</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Well-structured arguments</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Areas for Improvement</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span>Enhance credibility with more recent sources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span>Improve citation density in certain sections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span>Consider adding more peer-reviewed references</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span>Revise methodology section for clarity</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Summary</h3>
                <p className="text-gray-300 mb-4">
                  This document demonstrates a strong academic foundation with good structure and originality. The
                  overall trust score of {document.scores.overall} indicates that it meets the standards for academic
                  submission. The document shows particular strength in reference quality ({document.scores.references}
                  %) and language usage ({document.scores.language}%).
                </p>
                <p className="text-gray-300">
                  To further improve the document, consider addressing the citation density in the methodology section
                  and incorporating more recent sources to enhance credibility. The plagiarism detection identified a
                  few potential matches that should be addressed through rewording or proper citation to ensure complete
                  academic integrity.
                </p>
              </div>
            </GlassCard>
          )}

          {activeTab === "plagiarism" && (
            <GlassCard>
              <h2 className="text-xl font-bold mb-6">Plagiarism Analysis</h2>

              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex-shrink-0">
                  <div className="relative w-36 h-36 mx-auto">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="text-4xl font-bold"
                        >
                          <span className={getScoreColor(document.scores.originality)}>
                            {document.scores.originality}%
                          </span>
                        </motion.div>
                        <p className="text-sm text-gray-400">Originality</p>
                      </div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={
                          document.scores.originality >= 80
                            ? "#4ade80"
                            : document.scores.originality >= 60
                              ? "#facc15"
                              : "#f87171"
                        }
                        strokeWidth="8"
                        strokeDasharray="283"
                        strokeDashoffset="283"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{
                          strokeDashoffset: 283 - (283 * document.scores.originality) / 100,
                        }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold mb-4">Plagiarism Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Potential matches found:</span>
                      <span className="font-semibold">{document.plagiarismMatches.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Originality score:</span>
                      <span className={`font-semibold ${getScoreColor(document.scores.originality)}`}>
                        {document.scores.originality}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Recommendation:</span>
                      <span
                        className={`font-semibold ${
                          document.scores.originality >= 80
                            ? "text-green-400"
                            : document.scores.originality >= 60
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {document.scores.originality >= 80
                          ? "Good to submit"
                          : document.scores.originality >= 60
                            ? "Needs improvement"
                            : "Significant revision needed"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Potential Plagiarism Matches</h3>
                <div className="space-y-4">
                  {document.plagiarismMatches.map((match) => (
                    <div key={match.id} className="border border-gray-700 rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-800">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-sm text-gray-400">Source: </span>
                            <span className="text-sm font-medium">{match.source}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">Page {match.page}</span>
                            <span
                              className={`text-sm font-semibold ${
                                match.similarity >= 80
                                  ? "text-red-400"
                                  : match.similarity >= 60
                                    ? "text-yellow-400"
                                    : "text-green-400"
                              }`}
                            >
                              {match.similarity}% Similar
                            </span>
                          </div>
                        </div>
                        <p className="text-sm bg-red-400/10 p-2 rounded border-l-2 border-red-400">{match.text}</p>
                      </div>
                      <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                        <h4 className="text-sm font-semibold mb-2">AI Suggested Rewrite:</h4>
                        <p className="text-sm bg-green-400/10 p-2 rounded border-l-2 border-green-400 mb-4">
                          {match.suggestion}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === "citations" && (
            <GlassCard>
              <h2 className="text-xl font-bold mb-6">Citation Analysis</h2>

              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex-shrink-0">
                  <div className="relative w-36 h-36 mx-auto">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="text-4xl font-bold"
                        >
                          <span className={getScoreColor(document.scores.citations)}>{document.scores.citations}%</span>
                        </motion.div>
                        <p className="text-sm text-gray-400">Citation Score</p>
                      </div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={
                          document.scores.citations >= 80
                            ? "#4ade80"
                            : document.scores.citations >= 60
                              ? "#facc15"
                              : "#f87171"
                        }
                        strokeWidth="8"
                        strokeDasharray="283"
                        strokeDashoffset="283"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{
                          strokeDashoffset: 283 - (283 * document.scores.citations) / 100,
                        }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold mb-4">Citation Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Citation Density</span>
                        <span className={getScoreColor(75)}>75%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-green-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "75%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Citation Format</span>
                        <span className={getScoreColor(90)}>90%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-green-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "90%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Source Quality</span>
                        <span className={getScoreColor(80)}>80%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-green-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "80%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Source Recency</span>
                        <span className={getScoreColor(65)}>65%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-yellow-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "65%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-4">Citation Recommendations</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>Consider adding more citations in the methodology section (pages 8-10).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>
                      Include more recent sources (published within the last 3 years) to strengthen your arguments.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>Add more peer-reviewed journal articles to increase the credibility of your research.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Your citation format is consistent and follows the required style guide.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Source Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Source Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Count</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Percentage</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Recommendation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-800">
                        <td className="px-4 py-3">Journal Articles</td>
                        <td className="px-4 py-3">12</td>
                        <td className="px-4 py-3">48%</td>
                        <td className="px-4 py-3 text-green-400">Good</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="px-4 py-3">Books</td>
                        <td className="px-4 py-3">5</td>
                        <td className="px-4 py-3">20%</td>
                        <td className="px-4 py-3 text-green-400">Good</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="px-4 py-3">Conference Papers</td>
                        <td className="px-4 py-3">4</td>
                        <td className="px-4 py-3">16%</td>
                        <td className="px-4 py-3 text-green-400">Good</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="px-4 py-3">Websites</td>
                        <td className="px-4 py-3">3</td>
                        <td className="px-4 py-3">12%</td>
                        <td className="px-4 py-3 text-yellow-400">Consider reducing</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="px-4 py-3">Other</td>
                        <td className="px-4 py-3">1</td>
                        <td className="px-4 py-3">4%</td>
                        <td className="px-4 py-3 text-green-400">Good</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === "language" && (
            <GlassCard>
              <h2 className="text-xl font-bold mb-6">Language Analysis</h2>

              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex-shrink-0">
                  <div className="relative w-36 h-36 mx-auto">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="text-4xl font-bold"
                        >
                          <span className={getScoreColor(document.scores.language)}>{document.scores.language}%</span>
                        </motion.div>
                        <p className="text-sm text-gray-400">Language Score</p>
                      </div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={
                          document.scores.language >= 80
                            ? "#4ade80"
                            : document.scores.language >= 60
                              ? "#facc15"
                              : "#f87171"
                        }
                        strokeWidth="8"
                        strokeDasharray="283"
                        strokeDashoffset="283"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{
                          strokeDashoffset: 283 - (283 * document.scores.language) / 100,
                        }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold mb-4">Language Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Grammar</span>
                        <span className={getScoreColor(92)}>92%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-green-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "92%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Clarity</span>
                        <span className={getScoreColor(85)}>85%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-green-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Academic Tone</span>
                        <span className={getScoreColor(88)}>88%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-green-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "88%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Vocabulary</span>
                        <span className={getScoreColor(90)}>90%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-green-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "90%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-4">Language Recommendations</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Your document demonstrates excellent grammar and vocabulary usage.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>The academic tone is consistent throughout most of the document.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>Consider revising some sentences in the methodology section for improved clarity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>Reduce the use of passive voice in some sections to enhance readability.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Suggested Revisions</h3>
                <div className="space-y-4">
                  <div className="border border-gray-700 rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">Page 8, Paragraph 2</span>
                      </div>
                      <p className="text-sm bg-yellow-400/10 p-2 rounded border-l-2 border-yellow-400">
                        "The methodology was implemented and the results were analyzed."
                      </p>
                    </div>
                    <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                      <h4 className="text-sm font-semibold mb-2">Suggested Revision:</h4>
                      <p className="text-sm bg-green-400/10 p-2 rounded border-l-2 border-green-400">
                        "We implemented the methodology and analyzed the results to identify key patterns."
                      </p>
                    </div>
                  </div>

                  <div className="border border-gray-700 rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">Page 12, Paragraph 1</span>
                      </div>
                      <p className="text-sm bg-yellow-400/10 p-2 rounded border-l-2 border-yellow-400">
                        "It can be seen that the data shows a correlation between the variables."
                      </p>
                    </div>
                    <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                      <h4 className="text-sm font-semibold mb-2">Suggested Revision:</h4>
                      <p className="text-sm bg-green-400/10 p-2 rounded border-l-2 border-green-400">
                        "The data demonstrates a clear correlation between the variables, as shown in Figure 3."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === "structure" && (
            <GlassCard>
              <h2 className="text-xl font-bold mb-6">Structure Analysis</h2>

              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex-shrink-0">
                  <div className="relative w-36 h-36 mx-auto">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="text-4xl font-bold"
                        >
                          <span className={getScoreColor(document.scores.structure)}>{document.scores.structure}%</span>
                        </motion.div>
                        <p className="text-sm text-gray-400">Structure Score</p>
                      </div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={
                          document.scores.structure >= 80
                            ? "#4ade80"
                            : document.scores.structure >= 60
                              ? "#facc15"
                              : "#f87171"
                        }
                        strokeWidth="8"
                        strokeDasharray="283"
                        strokeDashoffset="283"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{
                          strokeDashoffset: 283 - (283 * document.scores.structure) / 100,
                        }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold mb-4">Structure Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Organization</span>
                        <span className={getScoreColor(88)}>88%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-green-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "88%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Flow</span>
                        <span className={getScoreColor(82)}>82%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-green-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "82%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Paragraph Structure</span>
                        <span className={getScoreColor(85)}>85%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-green-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Transitions</span>
                        <span className={getScoreColor(78)}>78%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-yellow-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "78%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-4">Document Outline</h3>
                <div className="bg-gray-800 rounded-lg p-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="font-medium">Abstract</span>
                      <span className="text-sm text-gray-400 ml-2">Well-structured and concise</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="font-medium">Introduction</span>
                      <span className="text-sm text-gray-400 ml-2">Clear research question and objectives</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="font-medium">Literature Review</span>
                      <span className="text-sm text-gray-400 ml-2">Comprehensive and well-organized</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                      <span className="font-medium">Methodology</span>
                      <span className="text-sm text-gray-400 ml-2">Could be more detailed in some sections</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="font-medium">Results</span>
                      <span className="text-sm text-gray-400 ml-2">Well-presented with clear figures</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="font-medium">Discussion</span>
                      <span className="text-sm text-gray-400 ml-2">Thorough analysis of findings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="font-medium">Conclusion</span>
                      <span className />
                      <span className="font-medium">Conclusion</span>
                      <span className="text-sm text-gray-400 ml-2">
                        Effectively summarizes findings and implications
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="font-medium">References</span>
                      <span className="text-sm text-gray-400 ml-2">Properly formatted and comprehensive</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Structure Recommendations</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Your document follows a logical structure with clear sections.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Paragraphs are well-organized with clear topic sentences and supporting evidence.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>
                      Consider improving transitions between sections, particularly between the methodology and results.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>
                      Add more subheadings in the methodology section to improve organization and readability.
                    </span>
                  </li>
                </ul>
              </div>
            </GlassCard>
          )}
        </motion.div>
      </div>

      <div className="flex justify-end gap-4">
        <RippleButton variant="outline">Download Full Report</RippleButton>
        <RippleButton>Submit for Human Review</RippleButton>
      </div>
    </div>
  )
}

interface TabButtonProps {
  children: React.ReactNode
  isActive: boolean
  onClick: () => void
}

function TabButton({ children, isActive, onClick }: TabButtonProps) {
  return (
    <button
      className={`px-4 py-2 font-medium whitespace-nowrap ${
        isActive ? "border-b-2 border-mintellect-primary text-mintellect-primary" : "text-gray-400 hover:text-white"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

interface MetricCardProps {
  icon: React.ElementType
  title: string
  value: number
}

function MetricCard({ icon: Icon, title, value }: MetricCardProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-400"
    if (value >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBackground = (value: number) => {
    if (value >= 80) return "bg-green-400"
    if (value >= 60) return "bg-yellow-400"
    return "bg-red-400"
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
      <div className="p-2 rounded-full bg-gray-700">
        <Icon className="h-5 w-5 text-mintellect-primary" />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">{title}</span>
          <span className={`text-sm font-bold ${getScoreColor(value)}`}>{value}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <motion.div
            className={`${getScoreBackground(value)} h-1.5 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
}
