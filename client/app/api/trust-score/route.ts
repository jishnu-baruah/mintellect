import { NextResponse } from "next/server"

interface AIFlags {
  highConfidenceAI: number
  sampleSections: Array<{
    score: number
    preview: string
  }>
}

interface TrustScoreComponent {
  score: number
  weight: number
  contribution: number
}

interface AIDetails {
  aiProbability: number
  confidence: number
  model: string
  verdict: string
  flags: AIFlags
}

interface TrustScoreRecommendation {
  area: string
  issue: string
  action: string
}

interface TrustScoreData {
  trustScore: number
  trustLevel: string
  components: {
    plagiarism: TrustScoreComponent
    aiGenerated: TrustScoreComponent & {
      details: AIDetails
    }
  }
  recommendations: TrustScoreRecommendation[]
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { filePath, plagiarismResults } = body

    if (!filePath) {
      return NextResponse.json({ success: false, error: "File path is required" }, { status: 400 })
    }

    console.log(`Processing trust score for file: ${filePath}`)

    // Extract plagiarism score from plagiarism results if available
    let plagiarismScore = 85
    if (plagiarismResults && plagiarismResults.summary && plagiarismResults.summary.overallScore) {
      plagiarismScore = plagiarismResults.summary.overallScore
    }

    // Calculate AI generated content score (in a real implementation, this would call an AI detection service)
    // For now, we'll generate a score between 70-95
    const aiScore = Math.floor(Math.random() * 26) + 70

    // Calculate weights for each component
    const plagiarismWeight = 0.6
    const aiWeight = 0.4

    // Calculate contributions
    const plagiarismContribution = Math.round(plagiarismScore * plagiarismWeight)
    const aiContribution = Math.round(aiScore * aiWeight)

    // Calculate overall trust score
    const trustScore = plagiarismContribution + aiContribution

    // Determine trust level based on score
    let trustLevel = "Very Low"
    if (trustScore >= 85) {
      trustLevel = "High"
    } else if (trustScore >= 70) {
      trustLevel = "Moderate"
    } else if (trustScore >= 50) {
      trustLevel = "Low"
    }

    // Generate AI detection details
    const aiProbability = (100 - aiScore) / 100
    const confidence = 0.85 + Math.random() * 0.1

    // Determine verdict based on AI score
    let verdict = "human-written"
    if (aiScore < 60) {
      verdict = "ai-generated"
    } else if (aiScore < 75) {
      verdict = "possibly-ai-generated"
    } else if (aiScore < 85) {
      verdict = "partially-ai-generated"
    }

    // Generate flagged sections if AI score is low
    const highConfidenceAI = aiScore < 80 ? Math.floor(Math.random() * 3) + 1 : 0

    // Sample sections with AI content
    const sampleSections = []
    if (highConfidenceAI > 0) {
      const sampleTexts = [
        "The results demonstrate a significant correlation between the variables, suggesting that the hypothesis is supported by the data.",
        "Furthermore, the analysis reveals patterns consistent with previous research in this domain, albeit with some notable differences.",
        "The methodology employed in this study builds upon established frameworks while introducing novel approaches to address the research questions.",
      ]

      for (let i = 0; i < Math.min(highConfidenceAI, sampleTexts.length); i++) {
        sampleSections.push({
          score: 0.7 + Math.random() * 0.3,
          preview: sampleTexts[i],
        })
      }
    }

    // Generate recommendations based on scores
    const recommendations: TrustScoreRecommendation[] = []

    if (plagiarismScore < 85) {
      recommendations.push({
        area: "Originality",
        issue: "Significant similarity to existing publications",
        action:
          "Review and rewrite sections with high similarity scores, ensuring proper citations for all referenced material.",
      })
    }

    if (aiScore < 85) {
      recommendations.push({
        area: "Authenticity",
        issue: "Potential AI-generated content detected",
        action: "Review flagged sections and rewrite them in your own words to improve authenticity.",
      })
    }

    if (trustScore < 75) {
      recommendations.push({
        area: "Overall Trust",
        issue: "Low trust score may affect credibility",
        action: "Address both plagiarism and AI-generated content issues to improve your paper's overall trust score.",
      })
    }

    // Construct the trust score data
    const trustScoreData: TrustScoreData = {
      trustScore,
      trustLevel,
      components: {
        plagiarism: {
          score: plagiarismScore,
          weight: plagiarismWeight,
          contribution: plagiarismContribution,
        },
        aiGenerated: {
          score: aiScore,
          weight: aiWeight,
          contribution: aiContribution,
          details: {
            aiProbability,
            confidence,
            model: "GPT-Detector-v2",
            verdict,
            flags: {
              highConfidenceAI,
              sampleSections,
            },
          },
        },
      },
      recommendations,
    }

    // Return the trust score data
    return NextResponse.json({
      success: true,
      data: trustScoreData,
    })
  } catch (error) {
    console.error("Error calculating trust score:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

