import { uploadToPinata } from "../services/ipfsUploader.js"
import logger from "../utils/logger.js"
import path from "path"

/**
 * Upload a PDF file to IPFS
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const uploadToIPFS = async (req, res) => {
  logger.info(`Received IPFS upload request: ${JSON.stringify(req.body)}`)

  const { filePath } = req.body

  if (!filePath) {
    logger.error("No file path provided in request body")
    return res.status(400).json({
      success: false,
      error: "No file path provided",
    })
  }

  try {
    // Extract filename from path
    const fileName = path.basename(filePath)

    // Upload to IPFS
    const result = await uploadToPinata(filePath, fileName)

    return res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    logger.error(`Error uploading to IPFS: ${error.message}`)

    return res.status(500).json({
      success: false,
      error: "IPFS upload failed",
      details: error.message,
    })
  }
}

