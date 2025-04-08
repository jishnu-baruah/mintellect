import { PDFExtract } from "pdf.js-extract"
import fs from "fs"
import logger from "../utils/logger.js"

const pdfExtract = new PDFExtract()

// Configuration
export const PDF_CHECKS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MIN_PAGES: 3,
  MAX_PAGES: 50,
  MIN_TEXT_PER_PAGE: 100, // Characters
  REQUIRED_SECTIONS: ["abstract", "introduction", "methodology", "results", "discussion", "conclusion", "references"],
}

/**
 * Check if file is actually a PDF by examining file header
 * @param {string} filePath - Path to the file
 * @returns {boolean} - True if file is a valid PDF
 */
export const isActualPDF = (filePath) => {
  try {
    const buffer = Buffer.alloc(1024)
    const fd = fs.openSync(filePath, "r")
    fs.readSync(fd, buffer, 0, 1024, 0)
    fs.closeSync(fd)
    return buffer.includes(Buffer.from("%PDF-"))
  } catch (error) {
    logger.error(`Error checking PDF header: ${error.message}`)
    return false
  }
}

/**
 * Enhanced PDF extraction with metadata
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<Object>} - Extracted text and metadata
 */
export const extractPdfMetadata = async (filePath) => {
  try {
    logger.info(`Extracting content and metadata from PDF: ${filePath}`)

    const data = await pdfExtract.extract(filePath, {})
    const textContent = data.pages.map((page) => page.content.map((item) => item.str).join(" ")).join("\n")

    const metadata = {
      text: textContent,
      pageCount: data.pages.length,
      isScanned: textContent.length / data.pages.length < PDF_CHECKS.MIN_TEXT_PER_PAGE,
      textLength: textContent.length,
    }

    logger.info(`Successfully extracted ${textContent.length} characters from ${data.pages.length} pages`)
    return metadata
  } catch (error) {
    logger.error(`PDF extraction failed: ${error.message}`)
    throw new Error(`Failed to process PDF file: ${error.message}`)
  }
}

