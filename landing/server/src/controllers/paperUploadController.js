import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import logger from "../utils/logger.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Create a repository directory for approved papers
const REPOSITORY_DIR = path.join(dirname(__dirname), "../repository")

// Ensure repository directory exists
if (!fs.existsSync(REPOSITORY_DIR)) {
  fs.mkdirSync(REPOSITORY_DIR, { recursive: true })
  logger.info(`Created repository directory: ${REPOSITORY_DIR}`)
}

/**
 * Upload a verified paper to the repository
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const uploadPaper = async (req, res) => {
  logger.info(`Received paper upload request: ${JSON.stringify(req.body)}`)

  const { filePath, metadata } = req.body

  if (!filePath) {
    logger.error("No file path provided in request body")
    return res.status(400).json({
      success: false,
      error: "No file path provided",
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
    // Generate a unique filename for the repository
    const originalFilename = path.basename(filePath)
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const newFilename = `${timestamp}-${originalFilename}`
    const destinationPath = path.join(REPOSITORY_DIR, newFilename)

    // Copy the file to the repository
    fs.copyFileSync(filePath, destinationPath)

    // Create metadata file
    const metadataObj = {
      originalFilename,
      uploadDate: new Date().toISOString(),
      trustScore: metadata?.trustScore || "Not available",
      plagiarismScore: metadata?.plagiarismScore || "Not available",
      aiDetectionScore: metadata?.aiDetectionScore || "Not available",
      ...metadata,
    }

    const metadataPath = path.join(REPOSITORY_DIR, `${newFilename}.metadata.json`)
    fs.writeFileSync(metadataPath, JSON.stringify(metadataObj, null, 2))

    logger.info(`Paper uploaded successfully to repository: ${destinationPath}`)

    return res.status(200).json({
      success: true,
      data: {
        message: "Paper uploaded successfully to repository",
        filename: newFilename,
        repositoryPath: destinationPath,
      },
    })
  } catch (error) {
    logger.error(`Error uploading paper: ${error.message}`)

    return res.status(500).json({
      success: false,
      error: "Paper upload failed",
      details: error.message,
    })
  }
}

