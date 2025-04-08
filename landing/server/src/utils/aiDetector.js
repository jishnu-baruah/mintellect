import logger from "./logger.js"

// Configuration
const AI_DETECTION_CONFIG = {
  THRESHOLDS: {
    HUMAN: 0.4,
    AI: 0.75,
    CHUNK_SIZE: 512, // Tokens
    SAMPLES: 10, // Number of text segments to check
  },
}

/**
 * Analyze text to detect if it was AI-generated
 * @param {string} text - The text to analyze
 * @returns {Promise<Object>} - Analysis results
 */
export async function detectAiContent(text) {
  try {
    logger.info("Starting AI content detection")

    // Prepare text analysis
    const textChunks = chunkText(text, AI_DETECTION_CONFIG.CHUNK_SIZE).slice(0, AI_DETECTION_CONFIG.SAMPLES)

    // Since we can't use the Xenova/transformers library directly in this environment,
    // we'll simulate the detection with a simplified approach
    const results = await simulateAiDetection(textChunks)

    // Aggregate scores
    const aiScores = results.map((r) => r.score)
    const averageScore = aiScores.reduce((a, b) => a + b, 0) / aiScores.length
    const maxScore = Math.max(...aiScores)
    const flaggedSections = results.filter((r) => r.score > AI_DETECTION_CONFIG.THRESHOLDS.AI)

    // Determine likelihood
    const analysis = {
      aiProbability: averageScore,
      verdict:
        averageScore > AI_DETECTION_CONFIG.THRESHOLDS.AI
          ? "likely-ai"
          : averageScore < AI_DETECTION_CONFIG.THRESHOLDS.HUMAN
            ? "likely-human"
            : "uncertain",
      flags: {
        highConfidenceAI: flaggedSections.length,
        sampleSections: flaggedSections.slice(0, 3).map((s) => ({
          score: s.score,
          preview: s.text.substring(0, 150) + "...",
        })),
      },
    }

    logger.info(`AI detection completed with verdict: ${analysis.verdict}`)
    return analysis
  } catch (error) {
    logger.error(`AI detection failed: ${error.message}`)
    throw new Error(`AI detection failed: ${error.message}`)
  }
}

/**
 * Split text into overlapping chunks
 * @param {string} text - Text to split
 * @param {number} chunkSize - Size of each chunk
 * @returns {Array<string>} - Array of text chunks
 */
function chunkText(text, chunkSize) {
  const chunks = []
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize))
  }
  return chunks
}

/**
 * Simulate AI detection since we can't use the Xenova/transformers library directly
 * @param {Array<string>} textChunks - Array of text chunks to analyze
 * @returns {Promise<Array<Object>>} - Analysis results
 */
async function simulateAiDetection(textChunks) {
  // This is a simulation of AI detection
  // In a real implementation, you would use a proper AI detection model

  return textChunks.map((chunk) => {
    // Look for patterns that might indicate AI-generated text
    const containsAiPatterns =
      /(\bas (an|the) AI language model\b|\bI'm not able to\b|\bI don't have personal\b|\bas an AI\b)/i.test(chunk)

    // Check for repetitive phrases
    const repetitivePatterns =
      (chunk.match(/\b(\w+\s+\w+\s+\w+)\b/g) || []).filter((phrase, i, arr) => arr.indexOf(phrase) !== i).length > 0

    // Check for unnaturally perfect grammar and structure
    const perfectStructure =
      /\b(however|therefore|consequently|furthermore|moreover)\b/gi.test(chunk) &&
      !/\b(um|uh|like|you know|I mean)\b/gi.test(chunk)

    // Generate a score based on these heuristics
    let score = 0.3 // Base score
    if (containsAiPatterns) score += 0.4
    if (repetitivePatterns) score += 0.2
    if (perfectStructure) score += 0.2

    // Add some randomness to simulate real-world variance
    score += Math.random() * 0.2 - 0.1

    // Ensure score is between 0 and 1
    score = Math.max(0, Math.min(1, score))

    return {
      score,
      text: chunk,
    }
  })
}

