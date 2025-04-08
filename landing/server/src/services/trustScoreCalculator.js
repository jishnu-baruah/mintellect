import logger from "../utils/logger.js"
import { detectAiContent } from "../utils/aiDetector.js"

// Configuration
const TRUST_SCORE_CONFIG = {
  WEIGHTS: {
    PLAGIARISM: 0.6,
    AI_GENERATED: 0.4,
  },
}

/**
 * Calculate a trust score based on plagiarism and AI detection results
 * @param {Object} plagiarismResults - Results from plagiarism check
 * @param {string} text - Full text content for AI detection
 * @returns {Promise<Object>} - Trust score analysis
 */
export async function calculateTrustScore(plagiarismResults, text) {
  try {
    logger.info("Calculating trust score")

    // Get plagiarism score (already on a 0-100 scale)
    const plagiarismScore = plagiarismResults.summary.overallScore

    // Get AI detection results
    const aiDetectionResults = await detectAiContent(text)

    // Convert AI probability to a 0-100 scale (inverted, since lower AI probability is better)
    const aiScore = Math.round((1 - aiDetectionResults.aiProbability) * 100)

    // Calculate weighted trust score
    const trustScore = Math.round(
      plagiarismScore * TRUST_SCORE_CONFIG.WEIGHTS.PLAGIARISM + aiScore * TRUST_SCORE_CONFIG.WEIGHTS.AI_GENERATED,
    )

    // Determine trust level
    let trustLevel
    if (trustScore >= 85) trustLevel = "High"
    else if (trustScore >= 70) trustLevel = "Moderate"
    else if (trustScore >= 50) trustLevel = "Low"
    else trustLevel = "Very Low"

    // Generate recommendations
    const recommendations = []

    if (plagiarismScore < 70) {
      recommendations.push({
        area: "Originality",
        issue: "High similarity to existing works",
        action: "Review and properly cite all sources",
      })
    }

    if (aiScore < 70) {
      recommendations.push({
        area: "Authenticity",
        issue: "Potential AI-generated content detected",
        action: "Ensure all content is human-written or properly disclosed",
      })
    }

    // Create detailed report
    const report = {
      trustScore,
      trustLevel,
      components: {
        plagiarism: {
          score: plagiarismScore,
          weight: TRUST_SCORE_CONFIG.WEIGHTS.PLAGIARISM,
          contribution: Math.round(plagiarismScore * TRUST_SCORE_CONFIG.WEIGHTS.PLAGIARISM),
        },
        aiGenerated: {
          score: aiScore,
          weight: TRUST_SCORE_CONFIG.WEIGHTS.AI_GENERATED,
          contribution: Math.round(aiScore * TRUST_SCORE_CONFIG.WEIGHTS.AI_GENERATED),
          details: aiDetectionResults,
        },
      },
      recommendations,
    }

    logger.info(`Trust score calculation complete: ${trustScore} (${trustLevel})`)
    return report
  } catch (error) {
    logger.error(`Trust score calculation failed: ${error.message}`)
    throw new Error(`Trust score calculation failed: ${error.message}`)
  }
}

