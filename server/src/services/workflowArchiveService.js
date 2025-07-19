import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

class WorkflowArchiveService {
  constructor() {
    // Configure AWS
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    
    this.bucketName = process.env.AWS_S3_BUCKET;
    
    if (!this.bucketName) {
      console.warn('[WorkflowArchiveService] AWS_S3_BUCKET not configured, archiving disabled');
    }
  }

  /**
   * Archive workflow data to AWS S3
   * @param {Object} workflowData - Workflow data to archive
   * @param {string} userId - User ID for organization
   * @returns {Promise<string>} Archive URL
   */
  async archiveWorkflow(workflowData, userId = 'anonymous') {
    try {
      if (!this.bucketName) {
        throw new Error('AWS S3 bucket not configured');
      }

      console.log(`[WorkflowArchiveService] Archiving workflow for user: ${userId}`);

      // Create unique archive key
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const archiveKey = `workflows/${userId}/${workflowData.documentId}_${timestamp}.json`;

      // Prepare archive data
      const archiveData = {
        ...workflowData,
        archivedAt: new Date().toISOString(),
        userId,
        archiveKey,
      };

      // Upload to S3
      const uploadParams = {
        Bucket: this.bucketName,
        Key: archiveKey,
        Body: JSON.stringify(archiveData, null, 2),
        ContentType: 'application/json',
        Metadata: {
          'document-id': workflowData.documentId,
          'document-name': workflowData.documentName,
          'user-id': userId,
          'archived-at': new Date().toISOString(),
        },
      };

      const result = await this.s3.upload(uploadParams).promise();
      
      console.log(`[WorkflowArchiveService] Workflow archived successfully: ${result.Location}`);
      
      return result.Location;
    } catch (error) {
      console.error('[WorkflowArchiveService] Archive failed:', error);
      throw new Error(`Failed to archive workflow: ${error.message}`);
    }
  }

  /**
   * Resume workflow from AWS S3 archive
   * @param {string} archiveUrl - S3 URL of the archive
   * @returns {Promise<Object>} Workflow data
   */
  async resumeWorkflow(archiveUrl) {
    try {
      if (!this.bucketName) {
        throw new Error('AWS S3 bucket not configured');
      }

      console.log(`[WorkflowArchiveService] Resuming workflow from: ${archiveUrl}`);

      // Extract key from URL
      const key = this.extractKeyFromUrl(archiveUrl);
      
      // Download from S3
      const downloadParams = {
        Bucket: this.bucketName,
        Key: key,
      };

      const result = await this.s3.getObject(downloadParams).promise();
      const archiveData = JSON.parse(result.Body.toString());
      
      console.log(`[WorkflowArchiveService] Workflow resumed successfully: ${archiveData.documentId}`);
      
      return archiveData;
    } catch (error) {
      console.error('[WorkflowArchiveService] Resume failed:', error);
      throw new Error(`Failed to resume workflow: ${error.message}`);
    }
  }

  /**
   * Get list of archived workflows for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of archives
   */
  async getArchivedWorkflows(userId = 'anonymous') {
    try {
      if (!this.bucketName) {
        console.warn('[WorkflowArchiveService] AWS S3 bucket not configured, returning empty list');
        return [];
      }

      console.log(`[WorkflowArchiveService] Getting archives for user: ${userId}`);

      const listParams = {
        Bucket: this.bucketName,
        Prefix: `workflows/${userId}/`,
        MaxKeys: 100,
      };

      const result = await this.s3.listObjectsV2(listParams).promise();
      
      const archives = await Promise.all(
        result.Contents.map(async (object) => {
          try {
            const downloadParams = {
              Bucket: this.bucketName,
              Key: object.Key,
            };

            const archiveResult = await this.s3.getObject(downloadParams).promise();
            const archiveData = JSON.parse(archiveResult.Body.toString());
            
            return {
              documentId: archiveData.documentId,
              documentName: archiveData.documentName,
              archiveUrl: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${object.Key}`,
              createdAt: archiveData.metadata.createdAt,
              updatedAt: archiveData.metadata.updatedAt,
              status: this.determineStatus(archiveData),
            };
          } catch (error) {
            console.warn(`[WorkflowArchiveService] Failed to process archive ${object.Key}:`, error);
            return null;
          }
        })
      );

      return archives.filter(Boolean);
    } catch (error) {
      console.error('[WorkflowArchiveService] Failed to get archives:', error);
      return [];
    }
  }

  /**
   * Delete archived workflow
   * @param {string} archiveUrl - S3 URL of the archive
   * @returns {Promise<boolean>} Success status
   */
  async deleteArchivedWorkflow(archiveUrl) {
    try {
      if (!this.bucketName) {
        throw new Error('AWS S3 bucket not configured');
      }

      console.log(`[WorkflowArchiveService] Deleting archive: ${archiveUrl}`);

      const key = this.extractKeyFromUrl(archiveUrl);
      
      const deleteParams = {
        Bucket: this.bucketName,
        Key: key,
      };

      await this.s3.deleteObject(deleteParams).promise();
      
      console.log(`[WorkflowArchiveService] Archive deleted successfully: ${key}`);
      return true;
    } catch (error) {
      console.error('[WorkflowArchiveService] Delete failed:', error);
      return false;
    }
  }

  /**
   * Extract S3 key from URL
   * @param {string} url - S3 URL
   * @returns {string} S3 key
   */
  extractKeyFromUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1); // Remove leading slash
    } catch (error) {
      console.error('[WorkflowArchiveService] Invalid URL:', url);
      throw new Error('Invalid archive URL');
    }
  }

  /**
   * Determine workflow status from archive data
   * @param {Object} archiveData - Archive data
   * @returns {string} Status
   */
  determineStatus(archiveData) {
    if (archiveData.nftMintingData) {
      return 'completed';
    } else if (archiveData.humanReviewData) {
      return 'in_progress';
    } else if (archiveData.trustScoreData) {
      return 'in_progress';
    } else if (archiveData.plagiarismResult) {
      return 'in_progress';
    } else {
      return 'archived';
    }
  }

  /**
   * Check if AWS S3 is properly configured
   * @returns {boolean} Configuration status
   */
  isConfigured() {
    return !!(
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_REGION &&
      process.env.AWS_S3_BUCKET
    );
  }
}

export default new WorkflowArchiveService(); 