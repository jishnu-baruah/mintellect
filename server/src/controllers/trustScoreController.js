import fs from "fs"
import { calculateTrustScore } from "../services/trustScoreCalculator.js"
import { extractPdfMetadata } from "../services/pdfExtractor.js"
import logger from "../utils/logger.js"

/**
 * Calculate trust score for a paper
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTrustScore = async (req, res) => {
  logger.info(`Received trust score request: ${JSON.stringify(req.body)}`)

  const { filePath, plagiarismResults } = req.body

  if (!filePath) {
    logger.error("No file path provided in request body")
    return res.status(400).json({
      success: false,
      error: "No file path provided",
    })
  }

  if (!plagiarismResults) {
    logger.error("No plagiarism results provided in request body")
    return res.status(400).json({
      success: false,
      error: "Plagiarism results are required for trust score calculation",
    })
  }

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    logger.error(`File not found at path: ${filePath}`)
    return res.status(404).json({
      success: false,
      error: "File not found",
    })
  }

  try {
    logger.info(`Calculating trust score for file: ${filePath}`)

    // Extract text from PDF
    const metadata = await extractPdfMetadata(filePath)

    // Calculate trust score
    const trustScoreResults = await calculateTrustScore(plagiarismResults, metadata.text)

    logger.info("Trust score calculation completed successfully")

    return res.status(200).json({
      success: true,
      data: trustScoreResults,
    })
  } catch (error) {
    logger.error(`Error calculating trust score: ${error.message}`)

    return res.status(500).json({
      success: false,
      error: "Trust score calculation failed",
      details: error.message,
    })
  }
}

