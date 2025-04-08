import axios from "axios"
import FormData from "form-data"
import fs from "fs"
import logger from "../utils/logger.js"

/**
 * Upload a file to IPFS via Pinata
 * @param {string} filePath - Path to the file to upload
 * @param {string} fileName - Name to use for the file metadata
 * @returns {Promise<Object>} - Upload result with CID
 */
export async function uploadToPinata(filePath, fileName) {
  try {
    logger.info(`Preparing to upload ${filePath} to IPFS via Pinata`)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }

    // Get Pinata JWT from environment variables
    const pinataJWT = process.env.PINATA_JWT
    if (!pinataJWT) {
      throw new Error("PINATA_JWT environment variable is not set")
    }

    // Create unique identifier for the file
    const fileId = fileName || `research-paper-${Date.now()}`

    // Create form data
    const form = new FormData()
    form.append("file", fs.createReadStream(filePath))
    form.append(
      "pinataMetadata",
      JSON.stringify({
        name: `Research Paper - ${fileId}`,
      }),
    )

    // Set headers
    const headers = {
      Authorization: `Bearer ${pinataJWT}`,
      ...form.getHeaders(),
    }

    // Make the request to Pinata
    logger.info("Sending upload request to Pinata")
    const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", form, { headers })

    // Extract CID from response
    const cid = response.data.IpfsHash
    logger.info(`File uploaded successfully to IPFS with CID: ${cid}`)

    return {
      success: true,
      cid,
      url: `https://gateway.pinata.cloud/ipfs/${cid}`,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    logger.error(`IPFS upload failed: ${error.message}`)

    // Handle different types of errors
    if (error.response) {
      logger.error(`Pinata API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`)
      throw new Error(`Pinata API error: ${error.response.status} - ${error.response.data.error || "Unknown error"}`)
    } else {
      throw new Error(`IPFS upload failed: ${error.message}`)
    }
  }
}

