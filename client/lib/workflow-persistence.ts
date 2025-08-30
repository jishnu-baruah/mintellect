import { toast } from "@/hooks/use-toast"

export interface WorkflowState {
  step: number;
  documentId: string | null;
  documentName: string | null;
  documentText: string | null;
  documentFile: File | null;
  eligible: boolean | undefined;
  plagiarismResult: any | null;
  trustScoreData: any | null;
  humanReviewData: any | null;
  nftMintingData: any | null;
  error: string | null;
  isArchived: boolean;
  archiveUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowArchiveData {
  documentId: string;
  documentName: string;
  documentText: string;
  documentFile: File;
  plagiarismResult: any;
  trustScoreData: any;
  humanReviewData: any;
  nftMintingData: any;
  metadata: {
    createdAt: string;
    updatedAt: string;
    userId?: string;
    walletAddress?: string;
  };
}

// Utility to validate archive structure
function isValidArchiveData(data: any): boolean {
  return (
    data &&
    data.documentFile &&
    typeof data.documentFile.name === 'string' &&
    typeof data.documentFile.type === 'string' &&
    typeof data.documentFile.size === 'number' &&
    typeof data.documentFile.data === 'string'
  );
}

class WorkflowPersistenceService {
  private readonly STORAGE_KEY = 'mintellect_workflow_state';
  private readonly ARCHIVE_PREFIX = 'workflow_archive_';

  /**
   * Save workflow state to localStorage (now async, always serializes documentFile as base64 if File)
   */
  async saveWorkflowState(state: Partial<WorkflowState>): Promise<void> {
    try {
      const existingState = this.getWorkflowState();
      const updatedState = {
        ...existingState,
        ...state,
        // Ensure timestamps exist
        createdAt: existingState?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Serialize documentFile if it's a File
      if (
        updatedState.documentFile &&
        updatedState.documentFile instanceof File
      ) {
        const file = updatedState.documentFile;
        const fileBuffer = await file.arrayBuffer();
        const base64File = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
        updatedState.documentFile = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64File,
        };

        // Auto-populate documentName from file name when available
        if (!updatedState.documentName) {
          updatedState.documentName = file.name;
        }

        // Ensure we have a documentId when a file is present
        if (!updatedState.documentId) {
          updatedState.documentId = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        }

        // Ensure workflow step is at least 1 after upload
        if (!updatedState.step || updatedState.step < 1) {
          updatedState.step = 1;
        }
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedState));
      console.log('Workflow state saved:', updatedState);
    } catch (error) {
      console.error('Failed to save workflow state:', error);
    }
  }

  /**
   * Get workflow state from localStorage
   */
  getWorkflowState(): WorkflowState | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;
      
      const state = JSON.parse(stored);
      
      // Rehydrate documentFile as a real File object if needed
      if (
        state.documentFile &&
        typeof state.documentFile.name === "string" &&
        typeof state.documentFile.type === "string" &&
        typeof state.documentFile.size === "number" &&
        state.documentFile.data // base64 string
      ) {
        // Convert base64 to Uint8Array
        const binaryString = atob(state.documentFile.data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        state.documentFile = new File([bytes], state.documentFile.name, {
          type: state.documentFile.type,
        });
      }

      // Heal missing fields instead of discarding state
      let mutated = false;
      if (!state.createdAt) {
        state.createdAt = new Date().toISOString();
        mutated = true;
      }
      if (!state.documentId && state.documentFile) {
        state.documentId = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        mutated = true;
      }
      if (state.documentFile && (!state.step || state.step < 1)) {
        state.step = 1;
        mutated = true;
      }
      if (mutated) {
        try {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
        } catch {}
      }
      
      return state;
    } catch (error) {
      console.error('Failed to get workflow state:', error);
      this.clearWorkflowState();
      return null;
    }
  }

  /**
   * Clear workflow state from localStorage
   */
  clearWorkflowState(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Workflow state cleared');
    } catch (error) {
      console.error('Failed to clear workflow state:', error);
    }
  }

  /**
   * Check if there's an active workflow that can be resumed
   */
  hasActiveWorkflow(): boolean {
    const state = this.getWorkflowState();
    if (!state) return false;
    
    // Check if workflow is not completed (not at final step)
    return state.step < 5;
  }

  /**
   * Archive document and workflow data to AWS S3
   */
  async archiveWorkflow(workflowData: WorkflowArchiveData): Promise<string> {
    try {
      console.log('Archiving workflow to AWS S3...');

      // Defensive: Ensure documentFile is a real File
      if (!(workflowData.documentFile instanceof File)) {
        toast({
          title: "Cannot Archive",
          description: "The document file is missing or invalid. Please re-upload the file before archiving.",
          variant: "destructive",
        });
        throw new Error("documentFile is not a File object");
      }

      // Create archive payload
      const archivePayload = {
        ...workflowData,
        archivedAt: new Date().toISOString(),
        version: 1,
        step: (workflowData as any).step ?? 0, // Ensure step is included
      };

      // Convert File to base64 for storage
      const fileBuffer = await workflowData.documentFile.arrayBuffer();
      const base64File = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
      
      const archiveData = {
        ...archivePayload,
        documentFile: {
          name: workflowData.documentFile.name,
          type: workflowData.documentFile.type,
          size: workflowData.documentFile.size,
          data: base64File,
        },
      };

      // Validate archive structure before saving
      if (!isValidArchiveData(archiveData)) {
        toast({
          title: "Cannot Archive",
          description: "Archive structure is invalid. Please try again.",
          variant: "destructive",
        });
        throw new Error("Archive structure is invalid");
      }

      // LOG: What is being sent to the server
      console.log('archiveData to be sent:', archiveData);

      // Send to server for AWS S3 upload
      const response = await fetch('/api/workflow/archive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(archiveData),
      });

      if (!response.ok) {
        throw new Error(`Archive upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Workflow archived successfully:', result);
      
      return result.archiveUrl;
    } catch (error) {
      console.error('Failed to archive workflow:', error);
      throw error;
    }
  }

  /**
   * Resume workflow from archived data
   */
  async resumeWorkflow(archiveUrl: string): Promise<WorkflowState | null> {
    try {
      console.log('Resuming workflow from archive:', archiveUrl);
      
      const response = await fetch(`/api/workflow/resume?url=${encodeURIComponent(archiveUrl)}`);
      
      if (!response.ok) {
        throw new Error(`Resume failed: ${response.status}`);
      }

      const responseJson = await response.json();
      const archiveData = responseJson.data || responseJson;
      // LOG: What is being received from the server
      console.log('archiveData received from server:', archiveData);

      // Validate archive structure before resuming
      if (!isValidArchiveData(archiveData)) {
        toast({
          title: "Cannot Resume Workflow",
          description: "The archived workflow is missing its document file or is malformed. Please try another archive or re-upload.",
          variant: "destructive",
        });
        throw new Error("archiveData.documentFile.data is missing or archive is malformed");
      }

      // Convert base64 file back to File object
      const binaryString = atob(archiveData.documentFile.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const file = new File([bytes], archiveData.documentFile.name, {
        type: archiveData.documentFile.type,
      });

      // Reconstruct workflow state
      const workflowState: WorkflowState = {
        step: archiveData.step ?? 0, // Restore the correct step
        documentId: archiveData.documentId,
        documentName: archiveData.documentName,
        documentText: archiveData.documentText,
        documentFile: file,
        eligible: true, // Assume eligible since it was processed
        plagiarismResult: archiveData.plagiarismResult,
        trustScoreData: archiveData.trustScoreData,
        humanReviewData: archiveData.humanReviewData,
        nftMintingData: archiveData.nftMintingData,
        error: null,
        isArchived: true,
        archiveUrl: archiveUrl,
        createdAt: archiveData.metadata.createdAt,
        updatedAt: new Date().toISOString(),
      };
      // Save to localStorage so the workflow page can resume at the correct step
      await this.saveWorkflowState(workflowState);
      return workflowState;
    } catch (error) {
      console.error('Failed to resume workflow:', error);
      return null;
    }
  }

  /**
   * Get list of archived workflows for user
   */
  async getArchivedWorkflows(): Promise<Array<{
    documentId: string;
    documentName: string;
    archiveUrl: string;
    createdAt: string;
    updatedAt: string;
    status: 'completed' | 'in_progress' | 'archived';
  }>> {
    try {
      const response = await fetch('/api/workflow/archives');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch archives: ${response.status}`);
      }

      const archives = await response.json();
      return archives.data || [];
    } catch (error) {
      console.error('Failed to get archived workflows:', error);
      return [];
    }
  }

  /**
   * Delete archived workflow
   */
  async deleteArchivedWorkflow(archiveUrl: string): Promise<boolean> {
    try {
      const response = await fetch('/api/workflow/archive', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ archiveUrl }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to delete archived workflow:', error);
      return false;
    }
  }
}

export const workflowPersistence = new WorkflowPersistenceService(); 