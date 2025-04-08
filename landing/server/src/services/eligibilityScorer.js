import logger from "../utils/logger.js"
import { PDF_CHECKS } from "./pdfExtractor.js"

/**
 * Perform Level 0 checks (file validation)
 * @param {Object} file - Uploaded file object
 * @returns {Array} - Array of issues found
 */
export const performInitialChecks = (file) => {
  const issues = []

  // File size check
  if (file.size > PDF_CHECKS.MAX_FILE_SIZE) {
    issues.push(`File size exceeds ${PDF_CHECKS.MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  return issues
}

/**
 * Perform Level 1 checks (content structure)
 * @param {Object} metadata - PDF metadata
 * @returns {Array} - Array of issues found
 */
export const performContentChecks = (metadata) => {
  const issues = []

  // Page count validation
  if (metadata.pageCount < PDF_CHECKS.MIN_PAGES || metadata.pageCount > PDF_CHECKS.MAX_PAGES) {
    issues.push(`Page count out of range (${PDF_CHECKS.MIN_PAGES}-${PDF_CHECKS.MAX_PAGES})`)
  }

  // Text presence check (vs scanned document)
  if (metadata.isScanned) {
    issues.push("Document appears to be image-based (scanned)")
  }

  return issues
}

/**
 * Perform Level 2 checks (section validation)
 * @param {string} text - Extracted text content
 * @returns {Array} - Array of missing sections
 */
export const performSectionChecks = (text) => {
  const normalized = text.toLowerCase()
  return PDF_CHECKS.REQUIRED_SECTIONS.filter((section) => !new RegExp(`\\b${section}\\b`).test(normalized))
}

/**
 * Calculate eligibility based on multi-level checks
 * @param {Object} file - Uploaded file object
 * @param {Object} metadata - PDF metadata
 * @returns {Object} - Eligibility results
 */
export const calculateEligibility = (file, metadata) => {
  logger.info("Calculating eligibility with multi-level checks")

  const result = {
    eligible: false,
    level0: { passed: false, issues: [] },
    level1: { passed: false, issues: [] },
    level2: { passed: false, missingSections: [] },
    metadata: {
      pageCount: metadata.pageCount,
      textLength: metadata.textLength,
      isScanned: metadata.isScanned,
    },
  }

  // Level 0 Checks
  result.level0.issues = performInitialChecks(file)
  result.level0.passed = result.level0.issues.length === 0

  // If Level 0 fails, return early
  if (!result.level0.passed) {
    logger.info("Level 0 checks failed")
    return result
  }

  // Level 1 Checks
  result.level1.issues = performContentChecks(metadata)
  result.level1.passed = result.level1.issues.length === 0

  // If Level 1 fails, return early
  if (!result.level1.passed) {
    logger.info("Level 1 checks failed")
    return result
  }

  // Level 2 Checks
  result.level2.missingSections = performSectionChecks(metadata.text)
  result.level2.passed = result.level2.missingSections.length === 0

  // Final eligibility
  result.eligible = result.level0.passed && result.level1.passed && result.level2.passed

  logger.info(`Eligibility calculation complete. Result: ${result.eligible ? "Eligible" : "Not Eligible"}`)
  return result
}

/**
 * Get the default eligibility criteria
 * @returns {Object} - Default eligibility criteria
 */
export const getDefaultCriteria = () => {
  return {
    fileSize: PDF_CHECKS.MAX_FILE_SIZE,
    minPages: PDF_CHECKS.MIN_PAGES,
    maxPages: PDF_CHECKS.MAX_PAGES,
    minTextPerPage: PDF_CHECKS.MIN_TEXT_PER_PAGE,
    requiredSections: PDF_CHECKS.REQUIRED_SECTIONS,
  }
}

