import express from 'express';
import multer from 'multer';
import TrustScoreCalculator from '../services/trustScoreCalculator.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();
const trustScoreCalculator = new TrustScoreCalculator();

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit (increased from 50MB)
  }
});

// Error handling for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: 'File too large. Maximum size is 100MB'
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${error.message}`
    });
  }
  next(error);
};

/**
 * POST /api/files/upload
 * Upload a file
 */
router.post('/upload', upload.single('file'), handleMulterError, asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file provided'
    });
  }

  // Check file size
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (req.file.size > maxSize) {
    return res.status(413).json({
      success: false,
      error: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`
    });
  }

  const { fileType } = req.body;
  const file = req.file;

  try {
    console.log(`[Files] Uploading file: ${file.originalname}, type: ${fileType}`);
    
    // For now, we'll create a mock file record
    // In a real implementation, you would save to S3 or similar storage
    const fileId = Math.random().toString(36).substring(2, 15);
    
    // Extract text content for trust score calculation
    let textContent = '';
    if (file.mimetype === 'text/plain') {
      textContent = file.buffer.toString('utf8');
    } else if (file.mimetype === 'application/pdf') {
      // In a real implementation, you would use a PDF parser
      textContent = 'PDF content would be extracted here...';
    } else if (file.mimetype === 'application/zip') {
      // In a real implementation, you would extract ZIP contents
      textContent = 'ZIP contents would be extracted here...';
    }

    const fileRecord = {
      _id: fileId,
      originalName: file.originalname,
      fileType: fileType || 'UNKNOWN',
      size: file.size,
      mimetype: file.mimetype,
      status: 'COMPLETED',
      textContent: textContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: {
        fileId: fileRecord._id,
        status: fileRecord.status,
        message: 'File uploaded successfully'
      }
    });

  } catch (error) {
    console.error('[Files] Upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload file'
    });
  }
}));

/**
 * GET /api/files
 * Get list of user's files
 */
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  try {
    // Mock file list - in real implementation, fetch from database
    const mockFiles = [
      {
        _id: 'mock-file-1',
        originalName: 'sample-document.txt',
        fileType: 'TXT',
        size: 1024,
        status: 'COMPLETED',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'mock-file-2',
        originalName: 'research-paper.pdf',
        fileType: 'PDF',
        size: 2048576,
        status: 'COMPLETED',
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: {
        files: mockFiles,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: mockFiles.length,
          pages: Math.ceil(mockFiles.length / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('[Files] Error fetching files:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch files'
    });
  }
}));

/**
 * GET /api/files/:fileId
 * Get file details
 */
router.get('/:fileId', asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  const { download } = req.query;

  if (!fileId) {
    return res.status(400).json({
      success: false,
      error: 'File ID is required'
    });
  }

  try {
    // Mock file data - in real implementation, fetch from database/storage
    const mockFile = {
      _id: fileId,
      originalName: 'sample-document.txt',
      fileType: 'TXT',
      size: 1024,
      status: 'COMPLETED',
      textContent: 'This is sample text content for trust score analysis...',
      signedUrl: `https://example.com/files/${fileId}`,
      downloadUrl: `https://example.com/files/${fileId}?download=true`,
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: mockFile
    });

  } catch (error) {
    console.error('[Files] Error fetching file:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch file'
    });
  }
}));

/**
 * POST /api/files/:fileId/check-plagiarism
 * Check plagiarism for a file
 */
router.post('/:fileId/check-plagiarism', asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  const { textContent, title } = req.body;

  if (!fileId) {
    return res.status(400).json({
      success: false,
      error: 'File ID is required'
    });
  }

  if (!textContent) {
    return res.status(400).json({
      success: false,
      error: 'Text content is required for plagiarism check'
    });
  }

  try {
    console.log(`[Files] Starting plagiarism check for file: ${fileId}`);
    
    // Call the PlagiarismSearch proxy server
    const plagiarismResponse = await fetch('http://localhost:8000/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: textContent,
        title: title || `Document_${fileId}`,
        is_search_web: '1',
        is_search_storage: '1',
        is_json: '1',
        is_search_ai: '1'
      })
    });

    if (!plagiarismResponse.ok) {
      throw new Error(`Plagiarism service error: ${plagiarismResponse.status} ${plagiarismResponse.statusText}`);
    }

    const plagiarismData = await plagiarismResponse.json();
    console.log('[Files] Plagiarism check completed:', plagiarismData);

    res.json({
      success: true,
      data: {
        status: 'completed',
        results: plagiarismData
      }
    });

  } catch (error) {
    console.error('[Files] Error checking plagiarism:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check plagiarism'
    });
  }
}));

/**
 * GET /api/files/:fileId/check-status
 * Get plagiarism check status
 */
router.get('/:fileId/check-status', asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  if (!fileId) {
    return res.status(400).json({
      success: false,
      error: 'File ID is required'
    });
  }

  try {
    // Mock status - in real implementation, check actual status
    const mockStatus = {
      status: 'completed',
      results: {
        plagiarism: {
          overall_score: 15,
          analysis: 'Document shows minimal similarity to other sources.'
        },
        trust_score: {
          overall_score: 85,
          classification: 'human-written',
          human_written_percentage: 85
        }
      }
    };

    res.json({
      success: true,
      data: mockStatus
    });

  } catch (error) {
    console.error('[Files] Error getting check status:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get check status'
    });
  }
}));

/**
 * GET /api/files/:fileId/plagiarism-results
 * Get plagiarism results for a file
 */
router.get('/:fileId/plagiarism-results', asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  const { reportId } = req.query;

  if (!fileId) {
    return res.status(400).json({
      success: false,
      error: 'File ID is required'
    });
  }

  if (!reportId) {
    return res.status(400).json({
      success: false,
      error: 'Report ID is required to fetch plagiarism results'
    });
  }

  try {
    console.log(`[Files] Fetching plagiarism results for file: ${fileId}, report: ${reportId}`);
    
    // Call the PlagiarismSearch proxy server to get report data
    const reportResponse = await fetch(`http://localhost:8000/report/${reportId}`);
    
    if (!reportResponse.ok) {
      throw new Error(`Failed to fetch report: ${reportResponse.status} ${reportResponse.statusText}`);
    }

    const reportData = await reportResponse.json();
    console.log('[Files] Plagiarism results fetched:', reportData);

    res.json({
      success: true,
      data: {
        plagiarismResults: reportData
      }
    });

  } catch (error) {
    console.error('[Files] Error fetching plagiarism results:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch plagiarism results'
    });
  }
}));

/**
 * GET /api/files/:fileId/trust-score
 * Get trust score for a file
 */
router.get('/:fileId/trust-score', asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  if (!fileId) {
    return res.status(400).json({
      success: false,
      error: 'File ID is required'
    });
  }

  try {
    console.log(`[Files] Getting trust score for file: ${fileId}`);
    
    // Mock file data - in real implementation, fetch from database
    const mockFile = {
      _id: fileId,
      originalName: 'sample-document.txt',
      textContent: 'This is sample text content for trust score analysis. The document appears to be well-written with proper academic structure and citations.',
      plagiarismResults: {
        plagiarism: {
          overall_score: 15
        }
      }
    };

    // Calculate trust score using the service
    const trustScoreResult = await trustScoreCalculator.calculateTrustScore({
      textContent: mockFile.textContent,
      plagiarismResults: mockFile.plagiarismResults,
      fileId: mockFile._id
    });

    res.json({
      success: true,
      data: {
        fileName: mockFile.originalName,
        checkDate: new Date().toISOString(),
        trustScore: trustScoreResult.trustScore / 100, // Convert to 0-1 scale
        similarity: 1 - (trustScoreResult.plagiarismScore / 100), // Convert to similarity
        matchedSources: [], // Mock empty sources
        textSample: mockFile.textContent.substring(0, 200) + '...'
      }
    });

  } catch (error) {
    console.error('[Files] Error getting trust score:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get trust score'
    });
  }
}));

/**
 * DELETE /api/files/:fileId
 * Delete a file
 */
router.delete('/:fileId', asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  if (!fileId) {
    return res.status(400).json({
      success: false,
      error: 'File ID is required'
    });
  }

  try {
    console.log(`[Files] Deleting file: ${fileId}`);
    
    // Mock deletion - in real implementation, delete from storage and database
    res.json({
      success: true,
      data: {
        message: 'File deleted successfully'
      }
    });

  } catch (error) {
    console.error('[Files] Error deleting file:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete file'
    });
  }
}));

export default router; 