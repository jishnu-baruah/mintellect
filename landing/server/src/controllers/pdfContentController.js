import { extractPdfMetadata } from "../services/pdfExtractor.js"
import logger from "../utils/logger.js"
import fs from "fs"

/**
 * Controller for retrieving PDF content
 * Returns the text content of a PDF file
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPdfContent = async (req, res) => {
  logger.info(`Received PDF content request: ${JSON.stringify(req.body)}`)

  const { filePath } = req.body

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
    logger.info(`Extracting content from PDF: ${filePath}`)

    // Extract PDF content
    const pdfMetadata = await extractPdfMetadata(filePath)
    
    // Format the PDF content into sections
    const formattedContent = formatPdfContent(pdfMetadata.text)

    logger.info("PDF content extraction completed successfully")

    return res.status(200).json({
      success: true,
      data: {
        raw: pdfMetadata.text,
        formatted: formattedContent,
        metadata: {
          pageCount: pdfMetadata.pageCount,
          textLength: pdfMetadata.textLength,
          isScanned: pdfMetadata.isScanned
        }
      }
    })
  } catch (error) {
    logger.error(`Error extracting PDF content: ${error.message}`)

    return res.status(500).json({
      success: false,
      error: "PDF content extraction failed",
      details: error.message,
    })
  }
}

/**
 * Format PDF content into sections for better display
 * @param {string} content - Raw PDF content
 * @returns {Object} - Formatted content by sections
 */
function formatPdfContent(content) {
  // Define common section headers in research papers
  const sectionHeaders = [
    { name: 'abstract', regex: /\b(abstract|summary)\b/i },
    { name: 'introduction', regex: /\b(introduction|background)\b/i },
    { name: 'methodology', regex: /\b(methodology|methods|materials and methods|experimental procedure)\b/i },
    { name: 'results', regex: /\b(results|findings)\b/i },
    { name: 'discussion', regex: /\b(discussion|analysis)\b/i },
    { name: 'conclusion', regex: /\b(conclusion|conclusions|concluding remarks)\b/i },
    { name: 'references', regex: /\b(references|bibliography|works cited|literature cited)\b/i }
  ];

  // Split content into paragraphs
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  // Initialize result object with sections
  const result = {
    title: '',
    authors: '',
    sections: {}
  };
  
  // Initialize all sections with empty content
  sectionHeaders.forEach(section => {
    result.sections[section.name] = '';
  });
  
  // Try to extract title and authors from the beginning
  if (paragraphs.length > 0) {
    // First paragraph is likely the title
    result.title = paragraphs[0].trim();
    
    // Second paragraph might contain authors
    if (paragraphs.length > 1) {
      result.authors = paragraphs[1].trim();
    }
  }
  
  // Current section being processed
  let currentSection = 'unknown';
  
  // Process each paragraph
  paragraphs.forEach(paragraph => {
    // Check if paragraph is a section header
    for (const section of sectionHeaders) {
      if (section.regex.test(paragraph.toLowerCase())) {
        currentSection = section.name;
        return; // Skip this paragraph as it's a header
      }
    }
    
    // Add content to current section
    if (result.sections[currentSection] !== undefined) {
      result.sections[currentSection] += paragraph + '\n\n';
    } else {
      // If section is not recognized, add to unknown
      if (!result.sections.unknown) {
        result.sections.unknown = '';
      }
      result.sections.unknown += paragraph + '\n\n';
    }
  });
  
  // Clean up sections (trim whitespace)
  Object.keys(result.sections).forEach(key => {
    result.sections[key] = result.sections[key].trim();
    
    // Remove empty sections
    if (!result.sections[key]) {
      delete result.sections[key];
    }
  });
  
  return result;
}
