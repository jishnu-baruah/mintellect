"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

// Simplified mock data for blockchain research papers
const blockchainPapers = [
  {
    id: "0x7a9fe22691c811ea339401bbb2a2b471",
    title: "Decentralized Finance: The Future of Banking",
    author: "Dr. Satoshi Nakagawa",
    score: 94,
    category: "DeFi",
  },
  {
    id: "0x3b8f7e12d4a5c6b9e0f1d2a3b4c5d6e7",
    title: "Consensus Mechanisms: Proof of Stake vs. Proof of Work",
    author: "Prof. Vitalik Anderson",
    score: 89,
    category: "Consensus",
  },
  {
    id: "0x5e7d9c8b3a2f1e6d4c7b8a9e2d3f5c6b",
    title: "Smart Contract Vulnerabilities: Detection and Prevention",
    author: "Dr. Elena Gavin",
    score: 92,
    category: "Security",
  },
]

export default function TrustScorePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Blockchain Research Trust Scores</h1>

      <div className="grid gap-6">
        {blockchainPapers.map((paper) => (
          <Card key={paper.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle>{paper.title}</CardTitle>
                <Badge className="bg-green-500/20 text-green-400 border-green-800">Score: {paper.score}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400">Author: {paper.author}</p>
                  <Badge variant="outline" className="mt-2">
                    {paper.category}
                  </Badge>
                </div>
                <Button>
                  <Shield className="h-4 w-4 mr-2" /> View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
