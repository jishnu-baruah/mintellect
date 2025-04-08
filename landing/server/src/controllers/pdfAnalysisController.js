import { extractPdfMetadata, isActualPDF } from "../services/pdfExtractor.js"
import { calculateEligibility } from "../services/eligibilityScorer.js"
import logger from "../utils/logger.js"

/**
 * Analyze a PDF file and return eligibility score
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const analyzePdf = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No PDF file uploaded" })
  }

  const filePath = req.file.path
  logger.info(`Processing file: ${filePath}`)

  try {
    // Check if file is actually a PDF
    if (!isActualPDF(filePath)) {
      return res.status(400).json({
        success: false,
        error: "Invalid PDF file format",
      })
    }

    // Extract text content and metadata from PDF
    const metadata = await extractPdfMetadata(filePath)

    // Calculate eligibility using multi-level checks
    const eligibilityResult = calculateEligibility(req.file, metadata)

    // Get just the filename part for the client
    const fileName = filePath.split("/").pop()

    logger.info(`Analysis complete. File will be kept at ${filePath} for potential plagiarism check.`)

    return res.status(200).json({
      success: true,
      data: {
        eligibility: eligibilityResult,
        fileName: filePath, // Send the full file path back to the client
      },
    })
  } catch (error) {
    logger.error(`Error analyzing PDF: ${error.message}`)

    return res.status(500).json({
      success: false,
      error: "PDF processing failed",
      details: error.message,
    })
  }
}

