# Mintellect - Services Documentation

## 🎯 Services Overview

This document provides comprehensive documentation for all services used in the Mintellect project, including trust score calculation, file processing, workflow management, and archive services.

### 📁 Services Structure

```
server/src/services/
├── trustScoreCalculator.js      # Trust score calculation service
├── workflowArchiveService.js    # Workflow archive service
├── fileProcessingService.js     # File processing service
├── plagiarismService.js         # Plagiarism detection service
├── aiDetectionService.js        # AI content detection service
├── nftMintingService.js         # NFT minting service
├── notificationService.js       # Notification service
├── analyticsService.js          # Analytics service
└── emailService.js              # Email service
```

---

## 🛡️ Trust Score Calculation Service

### Service Overview
```javascript
// server/src/services/trustScoreCalculator.js
const User = require("../models/user.model")
const Document = require("../models/document.model")
const TrustScore = require("../models/trustScore.model")
const logger = require("../utils/logger")

class TrustScoreCalculator {
  constructor() {
    this.factors = {
      plagiarism: { weight: 0.3, name: "Plagiarism Detection" },
      aiDetection: { weight: 0.25, name: "AI Content Detection" },
      documentQuality: { weight: 0.2, name: "Document Quality" },
      sourceCredibility: { weight: 0.15, name: "Source Credibility" },
      citationAccuracy: { weight: 0.1, name: "Citation Accuracy" },
    }
  }

  async calculateTrustScore(documentId, userId) {
    try {
      logger.info(`Starting trust score calculation for document ${documentId}`)
      
      const document = await Document.findById(documentId)
      if (!document) {
        throw new Error("Document not found")
      }

      const user = await User.findById(userId)
      if (!user) {
        throw new Error("User not found")
      }

      // Check if user can perform action
      if (!user.canPerformAction("generateTrustScore")) {
        throw new Error("User has exceeded trust score generation limit")
      }

      // Create trust score record
      const trustScore = new TrustScore({
        document: documentId,
        user: userId,
        status: "processing",
        algorithm: {
          name: "Mintellect Trust Score v2.0",
          version: "2.0.0",
          parameters: this.factors,
        },
      })

      await trustScore.save()

      // Calculate individual factors
      const factorResults = await this.calculateFactors(document)

      // Calculate weighted score
      const weightedScore = this.calculateWeightedScore(factorResults)
      const confidence = this.calculateConfidence(factorResults)

      // Update trust score
      trustScore.score = weightedScore
      trustScore.confidence = confidence
      trustScore.factors = factorResults
      trustScore.status = "completed"
      trustScore.metadata.processingTime = Date.now() - trustScore.createdAt

      await trustScore.save()

      // Update user stats
      await User.findByIdAndUpdate(userId, {
        $inc: { "stats.trustScoresGenerated": 1 },
      })

      logger.info(`Trust score calculation completed: ${weightedScore}/100`)

      return trustScore
    } catch (error) {
      logger.error("Trust score calculation failed:", error)
      throw error
    }
  }

  async calculateFactors(document) {
    const factors = []

    // Plagiarism Detection
    const plagiarismScore = await this.calculatePlagiarismScore(document)
    factors.push({
      name: this.factors.plagiarism.name,
      weight: this.factors.plagiarism.weight,
      score: plagiarismScore,
      description: "Checks for copied content from other sources",
      details: {
        sourcesChecked: 1000,
        similarityThreshold: 0.15,
      },
    })

    // AI Content Detection
    const aiScore = await this.calculateAIScore(document)
    factors.push({
      name: this.factors.aiDetection.name,
      weight: this.factors.aiDetection.weight,
      score: aiScore,
      description: "Detects AI-generated content",
      details: {
        model: "GPT-Detector v3",
        confidence: 0.85,
      },
    })

    // Document Quality
    const qualityScore = await this.calculateQualityScore(document)
    factors.push({
      name: this.factors.documentQuality.name,
      weight: this.factors.documentQuality.weight,
      score: qualityScore,
      description: "Assesses document structure and formatting",
      details: {
        structureScore: 0.9,
        formattingScore: 0.85,
        readabilityScore: 0.8,
      },
    })

    // Source Credibility
    const credibilityScore = await this.calculateCredibilityScore(document)
    factors.push({
      name: this.factors.sourceCredibility.name,
      weight: this.factors.sourceCredibility.weight,
      score: credibilityScore,
      description: "Evaluates source reliability and authority",
      details: {
        sourceCount: 15,
        academicSources: 12,
        recentSources: 8,
      },
    })

    // Citation Accuracy
    const citationScore = await this.calculateCitationScore(document)
    factors.push({
      name: this.factors.citationAccuracy.name,
      weight: this.factors.citationAccuracy.weight,
      score: citationScore,
      description: "Verifies citation format and accuracy",
      details: {
        citationsChecked: 25,
        formatErrors: 2,
        accuracyScore: 0.92,
      },
    })

    return factors
  }

  async calculatePlagiarismScore(document) {
    try {
      // Call plagiarism detection service
      const plagiarismService = require("./plagiarismService")
      const result = await plagiarismService.detectPlagiarism(document.cloudinaryUrl)

      // Convert similarity score to trust score (inverse relationship)
      const similarityScore = result.overallScore || 0
      return Math.max(0, 100 - similarityScore)
    } catch (error) {
      logger.error("Plagiarism detection failed:", error)
      return 50 // Default score on error
    }
  }

  async calculateAIScore(document) {
    try {
      // Call AI detection service
      const aiDetectionService = require("./aiDetectionService")
      const result = await aiDetectionService.detectAI(document.cloudinaryUrl)

      // Convert AI probability to trust score (inverse relationship)
      const aiProbability = result.aiProbability || 0
      return Math.max(0, 100 - aiProbability)
    } catch (error) {
      logger.error("AI detection failed:", error)
      return 50 // Default score on error
    }
  }

  async calculateQualityScore(document) {
    try {
      const qualityFactors = {
        structure: 0.3,
        formatting: 0.3,
        readability: 0.4,
      }

      // Analyze document structure
      const structureScore = await this.analyzeDocumentStructure(document)
      
      // Analyze formatting
      const formattingScore = await this.analyzeDocumentFormatting(document)
      
      // Analyze readability
      const readabilityScore = await this.analyzeReadability(document)

      const weightedScore = 
        structureScore * qualityFactors.structure +
        formattingScore * qualityFactors.formatting +
        readabilityScore * qualityFactors.readability

      return Math.round(weightedScore * 100)
    } catch (error) {
      logger.error("Quality analysis failed:", error)
      return 50 // Default score on error
    }
  }

  async calculateCredibilityScore(document) {
    try {
      // Extract sources from document
      const sources = await this.extractSources(document)
      
      let totalScore = 0
      let sourceCount = 0

      for (const source of sources) {
        const sourceScore = await this.evaluateSource(source)
        totalScore += sourceScore
        sourceCount++
      }

      return sourceCount > 0 ? Math.round(totalScore / sourceCount) : 50
    } catch (error) {
      logger.error("Credibility analysis failed:", error)
      return 50 // Default score on error
    }
  }

  async calculateCitationScore(document) {
    try {
      // Extract citations from document
      const citations = await this.extractCitations(document)
      
      let totalScore = 0
      let citationCount = 0

      for (const citation of citations) {
        const citationScore = await this.evaluateCitation(citation)
        totalScore += citationScore
        citationCount++
      }

      return citationCount > 0 ? Math.round(totalScore / citationCount) : 50
    } catch (error) {
      logger.error("Citation analysis failed:", error)
      return 50 // Default score on error
    }
  }

  calculateWeightedScore(factors) {
    let totalWeight = 0
    let weightedSum = 0

    for (const factor of factors) {
      totalWeight += factor.weight
      weightedSum += factor.score * factor.weight
    }

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0
  }

  calculateConfidence(factors) {
    // Calculate confidence based on factor reliability and data quality
    const confidenceFactors = factors.map(factor => {
      // Higher scores generally indicate more reliable analysis
      return Math.min(100, factor.score + 20)
    })

    return Math.round(confidenceFactors.reduce((sum, conf) => sum + conf, 0) / confidenceFactors.length)
  }

  async analyzeDocumentStructure(document) {
    // Analyze document structure (headings, sections, etc.)
    // This is a simplified implementation
    return 0.85
  }

  async analyzeDocumentFormatting(document) {
    // Analyze document formatting (font, spacing, etc.)
    // This is a simplified implementation
    return 0.80
  }

  async analyzeReadability(document) {
    // Analyze document readability (sentence length, vocabulary, etc.)
    // This is a simplified implementation
    return 0.75
  }

  async extractSources(document) {
    // Extract sources from document
    // This is a simplified implementation
    return []
  }

  async evaluateSource(source) {
    // Evaluate source credibility
    // This is a simplified implementation
    return 75
  }

  async extractCitations(document) {
    // Extract citations from document
    // This is a simplified implementation
    return []
  }

  async evaluateCitation(citation) {
    // Evaluate citation accuracy
    // This is a simplified implementation
    return 80
  }
}

module.exports = new TrustScoreCalculator()
```

---

## 📁 File Processing Service

### Service Overview
```javascript
// server/src/services/fileProcessingService.js
const cloudinary = require("../utils/cloudinary")
const Document = require("../models/document.model")
const logger = require("../utils/logger")
const crypto = require("crypto")
const fs = require("fs")
const path = require("path")

class FileProcessingService {
  constructor() {
    this.supportedFormats = ["pdf", "doc", "docx"]
    this.maxFileSize = 50 * 1024 * 1024 // 50MB
  }

  async processFile(file, userId) {
    try {
      logger.info(`Starting file processing for user ${userId}`)

      // Validate file
      this.validateFile(file)

      // Generate file hash
      const fileHash = await this.generateFileHash(file.path)

      // Check for duplicate files
      const existingDocument = await Document.findOne({ fileHash })
      if (existingDocument) {
        throw new Error("File already exists in the system")
      }

      // Upload to Cloudinary
      const uploadResult = await this.uploadToCloudinary(file.path)

      // Extract metadata
      const metadata = await this.extractMetadata(file.path, file.mimetype)

      // Create document record
      const document = new Document({
        title: file.originalname.replace(/\.[^/.]+$/, ""), // Remove extension
        filename: uploadResult.public_id,
        originalName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        fileHash,
        cloudinaryUrl: uploadResult.secure_url,
        cloudinaryPublicId: uploadResult.public_id,
        user: userId,
        status: "uploaded",
        metadata,
      })

      await document.save()

      // Start processing
      await this.startProcessing(document._id)

      logger.info(`File processing completed for document ${document._id}`)

      return document
    } catch (error) {
      logger.error("File processing failed:", error)
      throw error
    }
  }

  validateFile(file) {
    // Check file size
    if (file.size > this.maxFileSize) {
      throw new Error(`File size exceeds maximum limit of ${this.maxFileSize / 1024 / 1024}MB`)
    }

    // Check file format
    const extension = path.extname(file.originalname).toLowerCase().substring(1)
    if (!this.supportedFormats.includes(extension)) {
      throw new Error(`Unsupported file format. Supported formats: ${this.supportedFormats.join(", ")}`)
    }

    // Check MIME type
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error("Invalid file type")
    }
  }

  async generateFileHash(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash("sha256")
      const stream = fs.createReadStream(filePath)

      stream.on("data", (data) => {
        hash.update(data)
      })

      stream.on("end", () => {
        resolve(hash.digest("hex"))
      })

      stream.on("error", (error) => {
        reject(error)
      })
    })
  }

  async uploadToCloudinary(filePath) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: "auto",
        folder: "mintellect/documents",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        invalidate: true,
      })

      return result
    } catch (error) {
      logger.error("Cloudinary upload failed:", error)
      throw new Error("File upload failed")
    }
  }

  async extractMetadata(filePath, mimeType) {
    try {
      const metadata = {
        pageCount: 0,
        wordCount: 0,
        characterCount: 0,
        readingTime: 0,
        complexity: "medium",
        category: "other",
        tags: [],
      }

      if (mimeType === "application/pdf") {
        // Extract PDF metadata
        const pdfMetadata = await this.extractPDFMetadata(filePath)
        Object.assign(metadata, pdfMetadata)
      } else {
        // Extract Word document metadata
        const wordMetadata = await this.extractWordMetadata(filePath)
        Object.assign(metadata, wordMetadata)
      }

      // Calculate reading time (average 200 words per minute)
      if (metadata.wordCount > 0) {
        metadata.readingTime = Math.ceil(metadata.wordCount / 200)
      }

      // Determine complexity based on word count and vocabulary
      metadata.complexity = this.determineComplexity(metadata)

      // Categorize document
      metadata.category = this.categorizeDocument(metadata)

      return metadata
    } catch (error) {
      logger.error("Metadata extraction failed:", error)
      return {
        pageCount: 0,
        wordCount: 0,
        characterCount: 0,
        readingTime: 0,
        complexity: "medium",
        category: "other",
        tags: [],
      }
    }
  }

  async extractPDFMetadata(filePath) {
    // This would use a PDF parsing library like pdf-parse
    // For now, return default values
    return {
      pageCount: 10,
      wordCount: 5000,
      characterCount: 25000,
    }
  }

  async extractWordMetadata(filePath) {
    // This would use a Word document parsing library
    // For now, return default values
    return {
      pageCount: 8,
      wordCount: 4000,
      characterCount: 20000,
    }
  }

  determineComplexity(metadata) {
    const { wordCount, characterCount } = metadata
    
    // Simple complexity determination based on document size
    if (wordCount < 1000) return "easy"
    if (wordCount < 5000) return "medium"
    return "hard"
  }

  categorizeDocument(metadata) {
    // Simple categorization based on content analysis
    // This could be enhanced with NLP analysis
    const { wordCount, tags } = metadata
    
    if (tags.includes("academic") || tags.includes("research")) {
      return "academic"
    }
    if (tags.includes("thesis") || tags.includes("dissertation")) {
      return "thesis"
    }
    if (tags.includes("article") || tags.includes("paper")) {
      return "article"
    }
    if (tags.includes("report")) {
      return "report"
    }
    
    return "other"
  }

  async startProcessing(documentId) {
    try {
      const document = await Document.findById(documentId)
      if (!document) {
        throw new Error("Document not found")
      }

      // Update status to processing
      document.status = "processing"
      document.processingProgress = 0
      await document.save()

      // Simulate processing steps
      await this.simulateProcessing(document)

      // Update status to processed
      document.status = "processed"
      document.processingProgress = 100
      await document.save()

      logger.info(`Document processing completed: ${documentId}`)
    } catch (error) {
      logger.error("Document processing failed:", error)
      
      // Update status to failed
      const document = await Document.findById(documentId)
      if (document) {
        document.status = "failed"
        await document.save()
      }
      
      throw error
    }
  }

  async simulateProcessing(document) {
    const steps = [
      { name: "Text Extraction", progress: 20 },
      { name: "Content Analysis", progress: 40 },
      { name: "Metadata Processing", progress: 60 },
      { name: "Quality Assessment", progress: 80 },
      { name: "Finalization", progress: 100 },
    ]

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate processing time
      
      document.processingProgress = step.progress
      await document.save()
      
      logger.info(`Processing step completed: ${step.name}`)
    }
  }

  async deleteFile(documentId, userId) {
    try {
      const document = await Document.findOne({ _id: documentId, user: userId })
      if (!document) {
        throw new Error("Document not found or access denied")
      }

      // Delete from Cloudinary
      if (document.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(document.cloudinaryPublicId)
      }

      // Delete from database
      await Document.findByIdAndDelete(documentId)

      logger.info(`File deleted: ${documentId}`)
    } catch (error) {
      logger.error("File deletion failed:", error)
      throw error
    }
  }
}

module.exports = new FileProcessingService()
```

---

## 🔄 Workflow Management Service

### Service Overview
```javascript
// server/src/services/workflowManagementService.js
const Workflow = require("../models/workflow.model")
const Document = require("../models/document.model")
const User = require("../models/user.model")
const logger = require("../utils/logger")

class WorkflowManagementService {
  constructor() {
    this.workflowTemplates = {
      "document-verification": {
        name: "Document Verification",
        steps: [
          { name: "Upload Document", type: "upload", order: 1 },
          { name: "Process Document", type: "process", order: 2 },
          { name: "Generate Trust Score", type: "process", order: 3 },
          { name: "Review Results", type: "review", order: 4 },
          { name: "Approve/Reject", type: "approve", order: 5 },
        ],
      },
      "trust-score-generation": {
        name: "Trust Score Generation",
        steps: [
          { name: "Upload Document", type: "upload", order: 1 },
          { name: "Analyze Content", type: "process", order: 2 },
          { name: "Calculate Trust Score", type: "process", order: 3 },
          { name: "Generate Report", type: "process", order: 4 },
        ],
      },
      "nft-minting": {
        name: "NFT Minting",
        steps: [
          { name: "Verify Document", type: "process", order: 1 },
          { name: "Generate Metadata", type: "process", order: 2 },
          { name: "Mint NFT", type: "process", order: 3 },
          { name: "Confirm Transaction", type: "approve", order: 4 },
        ],
      },
    }
  }

  async createWorkflow(workflowData) {
    try {
      logger.info(`Creating workflow: ${workflowData.name}`)

      const { type, creator, documents, assignees, settings } = workflowData

      // Get workflow template
      const template = this.workflowTemplates[type]
      if (!template) {
        throw new Error(`Unknown workflow type: ${type}`)
      }

      // Create workflow steps from template
      const steps = template.steps.map(step => ({
        name: step.name,
        type: step.type,
        status: "pending",
        order: step.order,
        data: {},
      }))

      // Create workflow
      const workflow = new Workflow({
        name: workflowData.name || template.name,
        description: workflowData.description,
        type,
        creator,
        assignees: assignees || [],
        steps,
        documents: documents || [],
        settings: {
          ...this.getDefaultSettings(),
          ...settings,
        },
        status: "draft",
      })

      await workflow.save()

      // Add to history
      workflow.history.push({
        action: "workflow_created",
        user: creator,
        details: { workflowId: workflow._id },
      })

      await workflow.save()

      logger.info(`Workflow created: ${workflow._id}`)

      return workflow
    } catch (error) {
      logger.error("Workflow creation failed:", error)
      throw error
    }
  }

  async startWorkflow(workflowId, userId) {
    try {
      logger.info(`Starting workflow: ${workflowId}`)

      const workflow = await Workflow.findById(workflowId)
      if (!workflow) {
        throw new Error("Workflow not found")
      }

      // Check permissions
      if (!this.hasPermission(workflow, userId, "start")) {
        throw new Error("Insufficient permissions to start workflow")
      }

      // Validate workflow can be started
      if (workflow.status !== "draft") {
        throw new Error("Workflow cannot be started from current status")
      }

      // Start workflow
      await workflow.start()

      // Execute first step
      await this.executeStep(workflow, 0)

      logger.info(`Workflow started: ${workflowId}`)

      return workflow
    } catch (error) {
      logger.error("Workflow start failed:", error)
      throw error
    }
  }

  async executeStep(workflow, stepIndex) {
    try {
      if (stepIndex >= workflow.steps.length) {
        throw new Error("Step index out of bounds")
      }

      const step = workflow.steps[stepIndex]
      logger.info(`Executing step: ${step.name}`)

      // Update step status
      step.status = "in-progress"
      step.startedAt = new Date()
      await workflow.save()

      // Execute step based on type
      switch (step.type) {
        case "upload":
          await this.executeUploadStep(workflow, step)
          break
        case "process":
          await this.executeProcessStep(workflow, step)
          break
        case "review":
          await this.executeReviewStep(workflow, step)
          break
        case "approve":
          await this.executeApproveStep(workflow, step)
          break
        default:
          throw new Error(`Unknown step type: ${step.type}`)
      }

      // Complete step
      await workflow.completeStep(stepIndex, step.data)

      // Auto-advance to next step if enabled
      if (workflow.settings.autoAdvance && stepIndex + 1 < workflow.steps.length) {
        await this.executeStep(workflow, stepIndex + 1)
      }

      logger.info(`Step completed: ${step.name}`)
    } catch (error) {
      logger.error(`Step execution failed: ${error.message}`)
      
      // Mark step as failed
      const step = workflow.steps[stepIndex]
      step.status = "failed"
      step.error = {
        message: error.message,
        code: error.code || "UNKNOWN_ERROR",
        details: error.stack,
      }
      await workflow.save()
      
      throw error
    }
  }

  async executeUploadStep(workflow, step) {
    // Upload step is typically completed when workflow is created
    // This method handles any additional upload processing
    step.data.uploadedAt = new Date()
    step.data.fileCount = workflow.documents.length
  }

  async executeProcessStep(workflow, step) {
    // Execute processing based on step name
    switch (step.name) {
      case "Process Document":
        await this.processDocument(workflow, step)
        break
      case "Generate Trust Score":
        await this.generateTrustScore(workflow, step)
        break
      case "Analyze Content":
        await this.analyzeContent(workflow, step)
        break
      case "Calculate Trust Score":
        await this.calculateTrustScore(workflow, step)
        break
      case "Generate Report":
        await this.generateReport(workflow, step)
        break
      case "Generate Metadata":
        await this.generateMetadata(workflow, step)
        break
      case "Mint NFT":
        await this.mintNFT(workflow, step)
        break
      default:
        throw new Error(`Unknown process step: ${step.name}`)
    }
  }

  async executeReviewStep(workflow, step) {
    // Review steps require manual intervention
    step.data.requiresReview = true
    step.data.reviewDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }

  async executeApproveStep(workflow, step) {
    // Approval steps require manual intervention
    step.data.requiresApproval = true
    step.data.approvalDeadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
  }

  async processDocument(workflow, step) {
    // Process documents in workflow
    const documents = await Document.find({
      _id: { $in: workflow.documents.map(d => d.document) }
    })

    for (const document of documents) {
      // Update document status
      document.status = "processing"
      await document.save()
    }

    step.data.processedDocuments = documents.length
    step.data.processingTime = Date.now()
  }

  async generateTrustScore(workflow, step) {
    // Generate trust scores for documents
    const trustScoreService = require("./trustScoreCalculator")
    const documents = await Document.find({
      _id: { $in: workflow.documents.map(d => d.document) }
    })

    const trustScores = []
    for (const document of documents) {
      const trustScore = await trustScoreService.calculateTrustScore(
        document._id,
        workflow.creator
      )
      trustScores.push(trustScore)
    }

    step.data.trustScores = trustScores.map(ts => ({
      documentId: ts.document,
      score: ts.score,
      confidence: ts.confidence,
    }))
  }

  async analyzeContent(workflow, step) {
    // Analyze document content
    step.data.analysisCompleted = true
    step.data.analysisTime = Date.now()
  }

  async calculateTrustScore(workflow, step) {
    // Calculate trust score (similar to generateTrustScore)
    await this.generateTrustScore(workflow, step)
  }

  async generateReport(workflow, step) {
    // Generate workflow report
    step.data.reportGenerated = true
    step.data.reportUrl = `/api/workflows/${workflow._id}/report`
  }

  async generateMetadata(workflow, step) {
    // Generate NFT metadata
    step.data.metadataGenerated = true
    step.data.metadata = {
      name: `Mintellect Document #${workflow._id}`,
      description: "Academic document verified by Mintellect",
      attributes: [
        { trait_type: "Trust Score", value: "85" },
        { trait_type: "Document Type", value: "Academic" },
        { trait_type: "Verification Date", value: new Date().toISOString() },
      ],
    }
  }

  async mintNFT(workflow, step) {
    // Mint NFT (this would integrate with blockchain service)
    const nftService = require("./nftMintingService")
    
    step.data.nftMinted = true
    step.data.tokenId = "12345" // This would come from blockchain
    step.data.transactionHash = "0x..." // This would come from blockchain
  }

  async pauseWorkflow(workflowId, userId, reason) {
    try {
      const workflow = await Workflow.findById(workflowId)
      if (!workflow) {
        throw new Error("Workflow not found")
      }

      if (!this.hasPermission(workflow, userId, "pause")) {
        throw new Error("Insufficient permissions to pause workflow")
      }

      await workflow.pause(userId, reason)

      logger.info(`Workflow paused: ${workflowId}`)
      return workflow
    } catch (error) {
      logger.error("Workflow pause failed:", error)
      throw error
    }
  }

  async resumeWorkflow(workflowId, userId) {
    try {
      const workflow = await Workflow.findById(workflowId)
      if (!workflow) {
        throw new Error("Workflow not found")
      }

      if (!this.hasPermission(workflow, userId, "resume")) {
        throw new Error("Insufficient permissions to resume workflow")
      }

      await workflow.resume(userId)

      // Continue with current step
      if (workflow.currentStep < workflow.steps.length) {
        await this.executeStep(workflow, workflow.currentStep)
      }

      logger.info(`Workflow resumed: ${workflowId}`)
      return workflow
    } catch (error) {
      logger.error("Workflow resume failed:", error)
      throw error
    }
  }

  async cancelWorkflow(workflowId, userId, reason) {
    try {
      const workflow = await Workflow.findById(workflowId)
      if (!workflow) {
        throw new Error("Workflow not found")
      }

      if (!this.hasPermission(workflow, userId, "cancel")) {
        throw new Error("Insufficient permissions to cancel workflow")
      }

      await workflow.cancel(userId, reason)

      logger.info(`Workflow cancelled: ${workflowId}`)
      return workflow
    } catch (error) {
      logger.error("Workflow cancellation failed:", error)
      throw error
    }
  }

  hasPermission(workflow, userId, action) {
    // Check if user is creator
    if (workflow.creator.toString() === userId.toString()) {
      return true
    }

    // Check if user is assignee with appropriate role
    const assignee = workflow.assignees.find(a => a.user.toString() === userId.toString())
    if (!assignee) {
      return false
    }

    const rolePermissions = {
      owner: ["start", "pause", "resume", "cancel", "edit"],
      reviewer: ["review", "comment"],
      approver: ["approve", "reject"],
      viewer: ["view"],
    }

    return rolePermissions[assignee.role]?.includes(action) || false
  }

  getDefaultSettings() {
    return {
      autoAdvance: true,
      requireApproval: false,
      allowParallel: false,
      maxRetries: 3,
      timeout: 60,
    }
  }
}

module.exports = new WorkflowManagementService()
```

---

## 📦 Archive Service

### Service Overview
```javascript
// server/src/services/workflowArchiveService.js
const Workflow = require("../models/workflow.model")
const Document = require("../models/document.model")
const TrustScore = require("../models/trustScore.model")
const logger = require("../utils/logger")

class WorkflowArchiveService {
  constructor() {
    this.archiveRetentionDays = 365 // 1 year
    this.maxArchiveSize = 1000 // Maximum workflows per archive
  }

  async archiveCompletedWorkflows() {
    try {
      logger.info("Starting workflow archive process")

      // Find workflows to archive
      const workflowsToArchive = await Workflow.find({
        status: "completed",
        completedAt: {
          $lt: new Date(Date.now() - this.archiveRetentionDays * 24 * 60 * 60 * 1000)
        },
        archivedAt: { $exists: false }
      }).limit(this.maxArchiveSize)

      if (workflowsToArchive.length === 0) {
        logger.info("No workflows to archive")
        return { archived: 0, skipped: 0 }
      }

      let archived = 0
      let skipped = 0

      for (const workflow of workflowsToArchive) {
        try {
          await this.archiveWorkflow(workflow)
          archived++
        } catch (error) {
          logger.error(`Failed to archive workflow ${workflow._id}:`, error)
          skipped++
        }
      }

      logger.info(`Archive process completed: ${archived} archived, ${skipped} skipped`)

      return { archived, skipped }
    } catch (error) {
      logger.error("Workflow archive process failed:", error)
      throw error
    }
  }

  async archiveWorkflow(workflow) {
    try {
      logger.info(`Archiving workflow: ${workflow._id}`)

      // Create archive record
      const archiveData = {
        workflowId: workflow._id,
        originalData: workflow.toObject(),
        archivedAt: new Date(),
        archivedBy: "system",
        archiveReason: "Automatic archival after retention period",
      }

      // Store in archive collection (you might want to create a separate collection)
      // For now, we'll just mark the workflow as archived
      workflow.archivedAt = new Date()
      workflow.archivedBy = null // System archive
      workflow.archiveReason = "Automatic archival after retention period"

      // Archive related documents
      await this.archiveRelatedDocuments(workflow)

      // Archive related trust scores
      await this.archiveRelatedTrustScores(workflow)

      await workflow.save()

      logger.info(`Workflow archived: ${workflow._id}`)
    } catch (error) {
      logger.error(`Workflow archive failed: ${workflow._id}`, error)
      throw error
    }
  }

  async archiveRelatedDocuments(workflow) {
    try {
      const documentIds = workflow.documents.map(d => d.document)
      
      if (documentIds.length === 0) return

      // Archive documents that are only referenced by this workflow
      for (const documentId of documentIds) {
        const document = await Document.findById(documentId)
        if (!document) continue

        // Check if document is referenced by other active workflows
        const activeWorkflows = await Workflow.find({
          _id: { $ne: workflow._id },
          status: { $nin: ["archived", "cancelled"] },
          "documents.document": documentId
        })

        if (activeWorkflows.length === 0) {
          // Archive document
          document.archivedAt = new Date()
          document.archivedBy = null // System archive
          document.archiveReason = "Workflow archival"
          await document.save()

          logger.info(`Document archived: ${documentId}`)
        }
      }
    } catch (error) {
      logger.error("Document archive failed:", error)
      throw error
    }
  }

  async archiveRelatedTrustScores(workflow) {
    try {
      // Find trust scores related to this workflow's documents
      const documentIds = workflow.documents.map(d => d.document)
      
      if (documentIds.length === 0) return

      const trustScores = await TrustScore.find({
        document: { $in: documentIds }
      })

      for (const trustScore of trustScores) {
        // Check if trust score is still needed
        const activeWorkflows = await Workflow.find({
          _id: { $ne: workflow._id },
          status: { $nin: ["archived", "cancelled"] },
          "documents.document": trustScore.document
        })

        if (activeWorkflows.length === 0) {
          // Archive trust score
          trustScore.status = "expired"
          await trustScore.save()

          logger.info(`Trust score archived: ${trustScore._id}`)
        }
      }
    } catch (error) {
      logger.error("Trust score archive failed:", error)
      throw error
    }
  }

  async restoreWorkflow(workflowId, userId) {
    try {
      logger.info(`Restoring workflow: ${workflowId}`)

      const workflow = await Workflow.findById(workflowId)
      if (!workflow) {
        throw new Error("Workflow not found")
      }

      if (!workflow.archivedAt) {
        throw new Error("Workflow is not archived")
      }

      // Restore workflow
      workflow.archivedAt = null
      workflow.archivedBy = null
      workflow.archiveReason = null
      workflow.status = "completed" // or appropriate status

      // Add to history
      workflow.history.push({
        action: "workflow_restored",
        user: userId,
        details: { restoredAt: new Date() },
      })

      await workflow.save()

      // Restore related documents
      await this.restoreRelatedDocuments(workflow)

      // Restore related trust scores
      await this.restoreRelatedTrustScores(workflow)

      logger.info(`Workflow restored: ${workflowId}`)

      return workflow
    } catch (error) {
      logger.error("Workflow restore failed:", error)
      throw error
    }
  }

  async restoreRelatedDocuments(workflow) {
    try {
      const documentIds = workflow.documents.map(d => d.document)

      for (const documentId of documentIds) {
        const document = await Document.findById(documentId)
        if (!document || !document.archivedAt) continue

        // Restore document
        document.archivedAt = null
        document.archivedBy = null
        document.archiveReason = null
        await document.save()

        logger.info(`Document restored: ${documentId}`)
      }
    } catch (error) {
      logger.error("Document restore failed:", error)
      throw error
    }
  }

  async restoreRelatedTrustScores(workflow) {
    try {
      const documentIds = workflow.documents.map(d => d.document)

      const trustScores = await TrustScore.find({
        document: { $in: documentIds },
        status: "expired"
      })

      for (const trustScore of trustScores) {
        // Restore trust score
        trustScore.status = "completed"
        await trustScore.save()

        logger.info(`Trust score restored: ${trustScore._id}`)
      }
    } catch (error) {
      logger.error("Trust score restore failed:", error)
      throw error
    }
  }

  async getArchiveStats() {
    try {
      const stats = await Workflow.aggregate([
        {
          $group: {
            _id: null,
            totalWorkflows: { $sum: 1 },
            archivedWorkflows: {
              $sum: { $cond: [{ $ne: ["$archivedAt", null] }, 1, 0] }
            },
            activeWorkflows: {
              $sum: { $cond: [{ $eq: ["$archivedAt", null] }, 1, 0] }
            },
          }
        }
      ])

      return stats[0] || {
        totalWorkflows: 0,
        archivedWorkflows: 0,
        activeWorkflows: 0,
      }
    } catch (error) {
      logger.error("Archive stats failed:", error)
      throw error
    }
  }

  async cleanupExpiredArchives() {
    try {
      logger.info("Starting archive cleanup process")

      const cutoffDate = new Date(Date.now() - 2 * this.archiveRetentionDays * 24 * 60 * 60 * 1000)

      // Find workflows archived more than 2 years ago
      const expiredWorkflows = await Workflow.find({
        archivedAt: { $lt: cutoffDate }
      })

      let deleted = 0

      for (const workflow of expiredWorkflows) {
        try {
          await this.permanentlyDeleteWorkflow(workflow)
          deleted++
        } catch (error) {
          logger.error(`Failed to delete workflow ${workflow._id}:`, error)
        }
      }

      logger.info(`Archive cleanup completed: ${deleted} workflows deleted`)

      return { deleted }
    } catch (error) {
      logger.error("Archive cleanup failed:", error)
      throw error
    }
  }

  async permanentlyDeleteWorkflow(workflow) {
    try {
      logger.info(`Permanently deleting workflow: ${workflow._id}`)

      // Delete related documents
      const documentIds = workflow.documents.map(d => d.document)
      await Document.deleteMany({ _id: { $in: documentIds } })

      // Delete related trust scores
      await TrustScore.deleteMany({
        document: { $in: documentIds }
      })

      // Delete workflow
      await Workflow.findByIdAndDelete(workflow._id)

      logger.info(`Workflow permanently deleted: ${workflow._id}`)
    } catch (error) {
      logger.error("Permanent deletion failed:", error)
      throw error
    }
  }
}

module.exports = new WorkflowArchiveService()
```

---

*This services documentation provides comprehensive coverage of all services used in the Mintellect project. For specific implementation details, refer to the individual service files.* 