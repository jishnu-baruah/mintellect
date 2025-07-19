import express from 'express';
import workflowArchiveService from '../services/workflowArchiveService.js';

const router = express.Router();

/**
 * Archive workflow data to AWS S3
 * POST /api/workflow/archive
 */
router.post('/archive', async (req, res) => {
  try {
    // Add 'step' to destructuring
    const { documentId, documentName, documentText, documentFile, plagiarismResult, trustScoreData, humanReviewData, nftMintingData, metadata, step } = req.body;

    if (!documentId || !documentName) {
      return res.status(400).json({
        success: false,
        error: 'Document ID and name are required'
      });
    }

    // Get user ID from request (you can implement your own auth logic)
    const userId = req.headers['x-user-id'] || 'anonymous';

    // Add 'step' to workflowData
    const workflowData = {
      documentId,
      documentName,
      documentText,
      documentFile,
      plagiarismResult,
      trustScoreData,
      humanReviewData,
      nftMintingData,
      metadata: {
        ...metadata,
        createdAt: metadata.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
      },
      step // <-- ensure step is included
    };

    const archiveUrl = await workflowArchiveService.archiveWorkflow(workflowData, userId);

    res.json({
      success: true,
      data: {
        archiveUrl,
        documentId,
        message: 'Workflow archived successfully'
      }
    });

  } catch (error) {
    console.error('[WorkflowArchive] Archive error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to archive workflow'
    });
  }
});

/**
 * Resume workflow from AWS S3 archive
 * GET /api/workflow/resume?url=<archive_url>
 */
router.get('/resume', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'Archive URL is required'
      });
    }

    const archiveData = await workflowArchiveService.resumeWorkflow(url);

    res.json({
      success: true,
      data: archiveData
    });

  } catch (error) {
    console.error('[WorkflowArchive] Resume error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to resume workflow'
    });
  }
});

/**
 * Get list of archived workflows for user
 * GET /api/workflow/archives
 */
router.get('/archives', async (req, res) => {
  try {
    // Get user ID from request (you can implement your own auth logic)
    const userId = req.headers['x-user-id'] || 'anonymous';

    const archives = await workflowArchiveService.getArchivedWorkflows(userId);

    res.json({
      success: true,
      data: archives
    });

  } catch (error) {
    console.error('[WorkflowArchive] Get archives error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get archived workflows'
    });
  }
});

/**
 * Delete archived workflow
 * DELETE /api/workflow/archive
 */
router.delete('/archive', async (req, res) => {
  try {
    const { archiveUrl } = req.body;

    if (!archiveUrl) {
      return res.status(400).json({
        success: false,
        error: 'Archive URL is required'
      });
    }

    const success = await workflowArchiveService.deleteArchivedWorkflow(archiveUrl);

    if (success) {
      res.json({
        success: true,
        message: 'Archive deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to delete archive'
      });
    }

  } catch (error) {
    console.error('[WorkflowArchive] Delete error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete archive'
    });
  }
});

/**
 * Check AWS S3 configuration status
 * GET /api/workflow/archive/status
 */
router.get('/archive/status', (req, res) => {
  const isConfigured = workflowArchiveService.isConfigured();
  
  res.json({
    success: true,
    data: {
      configured: isConfigured,
      bucket: process.env.AWS_S3_BUCKET || null,
      region: process.env.AWS_REGION || null,
    }
  });
});

export default router; 