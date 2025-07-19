import express from 'express';
import TrustScoreCalculator from '../services/trustScoreCalculator.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();
const trustScoreCalculator = new TrustScoreCalculator();

// Special middleware for large trust score analysis
const largePayloadMiddleware = express.json({ limit: '200mb' });

/**
 * POST /api/trust-score/generate (for large files)
 * Generate trust score with large payload support
 */
router.post('/generate-large', largePayloadMiddleware, asyncHandler(async (req, res) => {
  const { textContent, title, fileType } = req.body;

  if (!textContent) {
    return res.status(400).json({
      success: false,
      error: 'Text content is required'
    });
  }

  try {
    console.log(`[TrustScore] Starting large file analysis for: ${title || 'Untitled'}`);
    console.log(`[TrustScore] Content length: ${textContent.length} characters`);
    
    // For large files, we might want to process in chunks
    const result = await trustScoreCalculator.calculateTrustScore(textContent, title, fileType);
    
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('[TrustScore] Large file analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze large file'
    });
  }
}));

/**
 * POST /api/trust-score/generate
 * Generate trust score for a document
 */
router.post('/generate', asyncHandler(async (req, res) => {
  const { textContent, plagiarismResults, fileId } = req.body;

  if (!textContent) {
    return res.status(400).json({
      success: false,
      error: 'Text content is required'
    });
  }

  if (!fileId) {
    return res.status(400).json({
      success: false,
      error: 'File ID is required'
    });
  }

  try {
    console.log(`[TrustScore] Generating trust score for file: ${fileId}`);
    
    const result = await trustScoreCalculator.calculateTrustScore({
      textContent,
      plagiarismResults,
      fileId
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('[TrustScore] Error generating trust score:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate trust score'
    });
  }
}));

/**
 * GET /api/trust-score/:fileId
 * Get trust score for a specific file
 */
router.get('/:fileId', asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  if (!fileId) {
    return res.status(400).json({
      success: false,
      error: 'File ID is required'
    });
  }

  try {
    console.log(`[TrustScore] Getting trust score for file: ${fileId}`);
    
    // Get workflow data from the request body or query params
    // The frontend should send the actual file content and plagiarism results
    const { textContent, plagiarismResults } = req.body || req.query;
    
    if (!textContent) {
      return res.status(400).json({
        success: false,
        error: 'Text content is required. Please provide the document content.'
      });
    }

    // Calculate trust score using the real data
    const result = await trustScoreCalculator.calculateTrustScore({
      textContent,
      plagiarismResults: plagiarismResults || null,
      fileId
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('[TrustScore] Error getting trust score:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get trust score'
    });
  }
}));

/**
 * POST /api/trust-score/:fileId/analyze
 * Analyze a file and generate trust score
 */
router.post('/:fileId/analyze', asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  const { textContent, plagiarismResults } = req.body;

  if (!fileId) {
    return res.status(400).json({
      success: false,
      error: 'File ID is required'
    });
  }

  if (!textContent) {
    return res.status(400).json({
      success: false,
      error: 'Text content is required'
    });
  }

  try {
    console.log(`[TrustScore] Analyzing file for trust score: ${fileId}`);
    
    const result = await trustScoreCalculator.calculateTrustScore({
      textContent,
      plagiarismResults,
      fileId
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('[TrustScore] Error analyzing file:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze file'
    });
  }
}));

export default router; 