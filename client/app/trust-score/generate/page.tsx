"use client"

import { TrustScoreGenerator } from "@/components/trust-score-generator"

export default function GenerateTrustScorePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Generate Trust Score</h1>
          <p className="text-gray-400">
            Upload your document to generate a trust score based on our AI-powered analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TrustScoreGenerator />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">How It Works</h3>
              <ol className="space-y-3 text-gray-300">
                <li className="flex gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-900/50 text-blue-400 text-sm">
                    1
                  </span>
                  <span>Upload your document (PDF, DOC, DOCX, or TXT)</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-900/50 text-blue-400 text-sm">
                    2
                  </span>
                  <span>Our AI analyzes the content for originality, methodology, citations, and consistency</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-900/50 text-blue-400 text-sm">
                    3
                  </span>
                  <span>A trust score is generated based on the analysis</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-900/50 text-blue-400 text-sm">
                    4
                  </span>
                  <span>The score is stored on the blockchain for verification</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-900/50 text-blue-400 text-sm">
                    5
                  </span>
                  <span>Share your verified trust score with others</span>
                </li>
              </ol>
            </div>

            <div className="bg-gray-800/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Trust Score Metrics</h3>
              <div className="space-y-3 text-gray-300">
                <div>
                  <div className="font-medium">Originality</div>
                  <p className="text-sm text-gray-400">
                    Measures how unique and original the content is compared to existing literature
                  </p>
                </div>
                <div>
                  <div className="font-medium">Methodology</div>
                  <p className="text-sm text-gray-400">
                    Evaluates the soundness of research methods and approaches used
                  </p>
                </div>
                <div>
                  <div className="font-medium">Citations</div>
                  <p className="text-sm text-gray-400">
                    Checks the accuracy and completeness of citations and references
                  </p>
                </div>
                <div>
                  <div className="font-medium">Consistency</div>
                  <p className="text-sm text-gray-400">
                    Analyzes internal consistency and logical flow of arguments and conclusions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
