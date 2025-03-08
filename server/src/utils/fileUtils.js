import fs from "fs"
import logger from "./logger.js"

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath - Directory path
 */
export const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true })
      logger.info(`Created directory: ${dirPath}`)
    } catch (error) {
      logger.error(`Error creating directory ${dirPath}: ${error.message}`)
    }
  }
}

