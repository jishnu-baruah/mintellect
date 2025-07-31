# Mintellect - Database Models Documentation

## 🎯 Database Models Overview

This document provides comprehensive documentation for all database models used in the Mintellect project, including their schemas, relationships, and usage patterns.

### 📁 Models Structure

```
server/src/models/
├── user.model.js           # User model
├── document.model.js       # Document model
├── workflow.model.js       # Workflow model
├── trustScore.model.js     # Trust score model
└── index.js               # Model exports
```

---

## 👤 User Model

### Schema Definition
```javascript
// server/src/models/user.model.js
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Don't include password in queries by default
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },
    institution: {
      type: String,
      maxlength: [200, "Institution name cannot exceed 200 characters"],
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "premium", "enterprise"],
        default: "free",
      },
      status: {
        type: String,
        enum: ["active", "inactive", "cancelled", "expired"],
        default: "active",
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
      },
      features: [{
        name: String,
        enabled: {
          type: Boolean,
          default: true,
        },
      }],
    },
    preferences: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: false,
        },
      },
      privacy: {
        profileVisibility: {
          type: String,
          enum: ["public", "private", "friends"],
          default: "public",
        },
        showEmail: {
          type: Boolean,
          default: false,
        },
        showInstitution: {
          type: Boolean,
          default: true,
        },
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      language: {
        type: String,
        default: "en",
      },
    },
    stats: {
      documentsUploaded: {
        type: Number,
        default: 0,
      },
      trustScoresGenerated: {
        type: Number,
        default: 0,
      },
      nftsMinted: {
        type: Number,
        default: 0,
      },
      lastActive: {
        type: Date,
        default: Date.now,
      },
    },
    walletAddress: {
      type: String,
      validate: {
        validator: function(v) {
          return /^0x[a-fA-F0-9]{40}$/.test(v)
        },
        message: "Invalid wallet address format",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)
```

### Virtual Fields
```javascript
// Virtual for user's full profile completion percentage
userSchema.virtual("profileCompletionPercentage").get(function() {
  const requiredFields = ["email", "name", "emailVerified"]
  const optionalFields = ["avatar", "bio", "institution", "walletAddress"]
  
  const requiredCompleted = requiredFields.filter(field => this[field]).length
  const optionalCompleted = optionalFields.filter(field => this[field]).length
  
  const totalFields = requiredFields.length + optionalFields.length
  const completedFields = requiredCompleted + optionalCompleted
  
  return Math.round((completedFields / totalFields) * 100)
})

// Virtual for user's display name
userSchema.virtual("displayName").get(function() {
  return this.name || this.email.split("@")[0]
})

// Virtual for user's subscription status
userSchema.virtual("hasActiveSubscription").get(function() {
  if (!this.subscription) return false
  return this.subscription.status === "active" && 
         (!this.subscription.endDate || this.subscription.endDate > new Date())
})
```

### Instance Methods
```javascript
// Compare password with hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now())
}

// Increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    })
  }
  
  const updates = { $inc: { loginAttempts: 1 } }
  
  // Lock account after 5 failed attempts
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 } // 2 hours
  }
  
  return this.updateOne(updates)
}

// Reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: Date.now() }
  })
}

// Update last active timestamp
userSchema.methods.updateLastActive = function() {
  this.stats.lastActive = new Date()
  return this.save()
}

// Check if user can perform action based on subscription
userSchema.methods.canPerformAction = function(action) {
  const subscriptionLimits = {
    free: {
      documentsPerMonth: 5,
      trustScoresPerMonth: 10,
      nftMinting: false,
    },
    basic: {
      documentsPerMonth: 50,
      trustScoresPerMonth: 100,
      nftMinting: true,
    },
    premium: {
      documentsPerMonth: 500,
      trustScoresPerMonth: 1000,
      nftMinting: true,
    },
    enterprise: {
      documentsPerMonth: -1, // Unlimited
      trustScoresPerMonth: -1, // Unlimited
      nftMinting: true,
    },
  }
  
  const plan = this.subscription?.plan || "free"
  const limits = subscriptionLimits[plan]
  
  switch (action) {
    case "uploadDocument":
      return limits.documentsPerMonth === -1 || 
             this.stats.documentsUploaded < limits.documentsPerMonth
    case "generateTrustScore":
      return limits.trustScoresPerMonth === -1 || 
             this.stats.trustScoresGenerated < limits.trustScoresPerMonth
    case "mintNFT":
      return limits.nftMinting
    default:
      return false
  }
}
```

### Static Methods
```javascript
// Find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() })
}

// Find active users
userSchema.statics.findActive = function() {
  return this.find({ isActive: true })
}

// Get user statistics
userSchema.statics.getStats = async function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
        },
        verifiedUsers: {
          $sum: { $cond: [{ $eq: ["$emailVerified", true] }, 1, 0] }
        },
        avgDocumentsPerUser: { $avg: "$stats.documentsUploaded" },
        avgTrustScoresPerUser: { $avg: "$stats.trustScoresGenerated" },
      }
    }
  ])
}

// Get users by subscription plan
userSchema.statics.getBySubscriptionPlan = function(plan) {
  return this.find({ "subscription.plan": plan })
}
```

### Middleware
```javascript
// Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Update profile completion status
userSchema.pre("save", function(next) {
  const requiredFields = ["email", "name", "emailVerified"]
  this.profileCompleted = requiredFields.every(field => this[field])
  next()
})

// Update last active on find
userSchema.pre("findOne", function() {
  if (this._conditions._id) {
    this.updateOne({ _id: this._conditions._id }, { $set: { "stats.lastActive": new Date() } })
  }
})
```

---

## 📄 Document Model

### Schema Definition
```javascript
// server/src/models/document.model.js
const mongoose = require("mongoose")

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Document title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    filename: {
      type: String,
      required: [true, "Filename is required"],
    },
    originalName: {
      type: String,
      required: [true, "Original filename is required"],
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
    },
    mimeType: {
      type: String,
      required: [true, "MIME type is required"],
    },
    fileHash: {
      type: String,
      required: [true, "File hash is required"],
      unique: true,
    },
    cloudinaryUrl: {
      type: String,
      required: [true, "Cloudinary URL is required"],
    },
    cloudinaryPublicId: {
      type: String,
      required: [true, "Cloudinary public ID is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    status: {
      type: String,
      enum: ["uploaded", "processing", "processed", "failed", "archived"],
      default: "uploaded",
    },
    processingProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    metadata: {
      author: String,
      subject: String,
      keywords: [String],
      language: {
        type: String,
        default: "en",
      },
      pageCount: Number,
      wordCount: Number,
      characterCount: Number,
      readingTime: Number, // in minutes
      complexity: {
        type: String,
        enum: ["easy", "medium", "hard"],
      },
      category: {
        type: String,
        enum: ["academic", "research", "thesis", "article", "report", "other"],
      },
      tags: [String],
    },
    analysis: {
      trustScore: {
        score: {
          type: Number,
          min: 0,
          max: 100,
        },
        confidence: {
          type: Number,
          min: 0,
          max: 100,
        },
        factors: [{
          name: String,
          weight: Number,
          score: Number,
          description: String,
        }],
        generatedAt: Date,
      },
      plagiarism: {
        overallScore: {
          type: Number,
          min: 0,
          max: 100,
        },
        matches: [{
          source: String,
          similarity: Number,
          text: String,
          url: String,
        }],
        checkedAt: Date,
      },
      aiDetection: {
        aiProbability: {
          type: Number,
          min: 0,
          max: 100,
        },
        humanProbability: {
          type: Number,
          min: 0,
          max: 100,
        },
        confidence: {
          type: Number,
          min: 0,
          max: 100,
        },
        checkedAt: Date,
      },
    },
    permissions: {
      visibility: {
        type: String,
        enum: ["private", "public", "shared"],
        default: "private",
      },
      sharedWith: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        permission: {
          type: String,
          enum: ["view", "edit", "admin"],
          default: "view",
        },
        sharedAt: {
          type: Date,
          default: Date.now,
        },
      }],
      allowComments: {
        type: Boolean,
        default: true,
      },
      allowDownloads: {
        type: Boolean,
        default: false,
      },
    },
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: {
        type: String,
        required: true,
        maxlength: [1000, "Comment cannot exceed 1000 characters"],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      isEdited: {
        type: Boolean,
        default: false,
      },
    }],
    version: {
      type: Number,
      default: 1,
    },
    parentDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
    isLatestVersion: {
      type: Boolean,
      default: true,
    },
    archivedAt: {
      type: Date,
    },
    archivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    archiveReason: {
      type: String,
      maxlength: [500, "Archive reason cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)
```

### Indexes
```javascript
// Create indexes for better query performance
documentSchema.index({ user: 1, createdAt: -1 })
documentSchema.index({ status: 1 })
documentSchema.index({ "metadata.category": 1 })
documentSchema.index({ "analysis.trustScore.score": -1 })
documentSchema.index({ fileHash: 1 }, { unique: true })
documentSchema.index({ "permissions.visibility": 1 })
documentSchema.index({ "metadata.tags": 1 })
```

### Virtual Fields
```javascript
// Virtual for document age
documentSchema.virtual("age").get(function() {
  return Date.now() - this.createdAt.getTime()
})

// Virtual for document size in human readable format
documentSchema.virtual("sizeFormatted").get(function() {
  const bytes = this.fileSize
  const sizes = ["Bytes", "KB", "MB", "GB"]
  if (bytes === 0) return "0 Bytes"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i]
})

// Virtual for document status color
documentSchema.virtual("statusColor").get(function() {
  const statusColors = {
    uploaded: "blue",
    processing: "yellow",
    processed: "green",
    failed: "red",
    archived: "gray",
  }
  return statusColors[this.status] || "gray"
})
```

### Instance Methods
```javascript
// Update processing progress
documentSchema.methods.updateProgress = function(progress) {
  this.processingProgress = Math.min(100, Math.max(0, progress))
  if (progress >= 100) {
    this.status = "processed"
  }
  return this.save()
}

// Add comment to document
documentSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content,
  })
  return this.save()
}

// Share document with user
documentSchema.methods.shareWith = function(userId, permission = "view") {
  const existingShare = this.permissions.sharedWith.find(
    share => share.user.toString() === userId.toString()
  )
  
  if (existingShare) {
    existingShare.permission = permission
    existingShare.sharedAt = new Date()
  } else {
    this.permissions.sharedWith.push({
      user: userId,
      permission,
    })
  }
  
  return this.save()
}

// Archive document
documentSchema.methods.archive = function(userId, reason) {
  this.status = "archived"
  this.archivedAt = new Date()
  this.archivedBy = userId
  this.archiveReason = reason
  this.isLatestVersion = false
  return this.save()
}

// Create new version
documentSchema.methods.createVersion = function(newData) {
  // Mark current document as not latest
  this.isLatestVersion = false
  
  // Create new document with version data
  const newDocument = new this.constructor({
    ...newData,
    parentDocument: this._id,
    version: this.version + 1,
    isLatestVersion: true,
  })
  
  return newDocument.save()
}
```

---

## 🔄 Workflow Model

### Schema Definition
```javascript
// server/src/models/workflow.model.js
const mongoose = require("mongoose")

const workflowStepSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Step name is required"],
  },
  type: {
    type: String,
    enum: ["upload", "process", "review", "approve", "complete"],
    required: [true, "Step type is required"],
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed", "failed", "skipped"],
    default: "pending",
  },
  order: {
    type: Number,
    required: [true, "Step order is required"],
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  duration: {
    type: Number, // in milliseconds
  },
  error: {
    message: String,
    code: String,
    details: mongoose.Schema.Types.Mixed,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
})

const workflowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Workflow name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    type: {
      type: String,
      enum: ["document-verification", "trust-score-generation", "nft-minting", "custom"],
      required: [true, "Workflow type is required"],
    },
    status: {
      type: String,
      enum: ["draft", "active", "paused", "completed", "cancelled", "failed"],
      default: "draft",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
    assignees: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["owner", "reviewer", "approver", "viewer"],
        default: "viewer",
      },
      assignedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    steps: [workflowStepSchema],
    currentStep: {
      type: Number,
      default: 0,
    },
    documents: [{
      document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
      role: {
        type: String,
        enum: ["input", "output", "reference"],
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    metadata: {
      tags: [String],
      category: String,
      estimatedDuration: Number, // in minutes
      actualDuration: Number, // in minutes
      cost: {
        amount: Number,
        currency: {
          type: String,
          default: "USD",
        },
      },
    },
    settings: {
      autoAdvance: {
        type: Boolean,
        default: true,
      },
      requireApproval: {
        type: Boolean,
        default: false,
      },
      allowParallel: {
        type: Boolean,
        default: false,
      },
      maxRetries: {
        type: Number,
        default: 3,
      },
      timeout: {
        type: Number, // in minutes
        default: 60,
      },
    },
    history: [{
      action: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      details: mongoose.Schema.Types.Mixed,
    }],
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    pausedAt: {
      type: Date,
    },
    pausedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pauseReason: {
      type: String,
      maxlength: [500, "Pause reason cannot exceed 500 characters"],
    },
    cancelledAt: {
      type: Date,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cancelReason: {
      type: String,
      maxlength: [500, "Cancel reason cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)
```

### Virtual Fields
```javascript
// Virtual for workflow progress percentage
workflowSchema.virtual("progressPercentage").get(function() {
  if (this.steps.length === 0) return 0
  
  const completedSteps = this.steps.filter(step => 
    step.status === "completed" || step.status === "skipped"
  ).length
  
  return Math.round((completedSteps / this.steps.length) * 100)
})

// Virtual for workflow duration
workflowSchema.virtual("duration").get(function() {
  if (!this.startedAt) return 0
  
  const endTime = this.completedAt || new Date()
  return endTime.getTime() - this.startedAt.getTime()
})

// Virtual for workflow status color
workflowSchema.virtual("statusColor").get(function() {
  const statusColors = {
    draft: "gray",
    active: "blue",
    paused: "yellow",
    completed: "green",
    cancelled: "red",
    failed: "red",
  }
  return statusColors[this.status] || "gray"
})
```

### Instance Methods
```javascript
// Start workflow
workflowSchema.methods.start = function() {
  this.status = "active"
  this.startedAt = new Date()
  this.currentStep = 0
  
  if (this.steps.length > 0) {
    this.steps[0].status = "in-progress"
    this.steps[0].startedAt = new Date()
  }
  
  this.history.push({
    action: "workflow_started",
    user: this.creator,
    details: { startedAt: this.startedAt },
  })
  
  return this.save()
}

// Complete current step
workflowSchema.methods.completeStep = function(stepIndex, data = {}) {
  if (stepIndex >= this.steps.length) {
    throw new Error("Step index out of bounds")
  }
  
  const step = this.steps[stepIndex]
  step.status = "completed"
  step.completedAt = new Date()
  step.data = { ...step.data, ...data }
  
  if (step.startedAt) {
    step.duration = step.completedAt.getTime() - step.startedAt.getTime()
  }
  
  this.currentStep = stepIndex + 1
  
  // Auto-advance to next step if enabled
  if (this.settings.autoAdvance && this.currentStep < this.steps.length) {
    this.steps[this.currentStep].status = "in-progress"
    this.steps[this.currentStep].startedAt = new Date()
  }
  
  // Check if workflow is complete
  if (this.currentStep >= this.steps.length) {
    this.status = "completed"
    this.completedAt = new Date()
  }
  
  this.history.push({
    action: "step_completed",
    user: step.assignedTo || this.creator,
    details: { stepIndex, stepName: step.name },
  })
  
  return this.save()
}

// Pause workflow
workflowSchema.methods.pause = function(userId, reason) {
  this.status = "paused"
  this.pausedAt = new Date()
  this.pausedBy = userId
  this.pauseReason = reason
  
  // Pause current step
  if (this.currentStep < this.steps.length) {
    this.steps[this.currentStep].status = "pending"
  }
  
  this.history.push({
    action: "workflow_paused",
    user: userId,
    details: { reason },
  })
  
  return this.save()
}

// Resume workflow
workflowSchema.methods.resume = function(userId) {
  this.status = "active"
  this.pausedAt = null
  this.pausedBy = null
  this.pauseReason = null
  
  // Resume current step
  if (this.currentStep < this.steps.length) {
    this.steps[this.currentStep].status = "in-progress"
    this.steps[this.currentStep].startedAt = new Date()
  }
  
  this.history.push({
    action: "workflow_resumed",
    user: userId,
  })
  
  return this.save()
}

// Cancel workflow
workflowSchema.methods.cancel = function(userId, reason) {
  this.status = "cancelled"
  this.cancelledAt = new Date()
  this.cancelledBy = userId
  this.cancelReason = reason
  
  // Cancel all pending steps
  this.steps.forEach(step => {
    if (step.status === "pending" || step.status === "in-progress") {
      step.status = "cancelled"
    }
  })
  
  this.history.push({
    action: "workflow_cancelled",
    user: userId,
    details: { reason },
  })
  
  return this.save()
}
```

---

## 🛡️ Trust Score Model

### Schema Definition
```javascript
// server/src/models/trustScore.model.js
const mongoose = require("mongoose")

const trustScoreSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: [true, "Document reference is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    score: {
      type: Number,
      required: [true, "Trust score is required"],
      min: [0, "Score cannot be less than 0"],
      max: [100, "Score cannot be greater than 100"],
    },
    confidence: {
      type: Number,
      required: [true, "Confidence level is required"],
      min: [0, "Confidence cannot be less than 0"],
      max: [100, "Confidence cannot be greater than 100"],
    },
    factors: [{
      name: {
        type: String,
        required: [true, "Factor name is required"],
      },
      weight: {
        type: Number,
        required: [true, "Factor weight is required"],
        min: [0, "Weight cannot be less than 0"],
        max: [1, "Weight cannot be greater than 1"],
      },
      score: {
        type: Number,
        required: [true, "Factor score is required"],
        min: [0, "Factor score cannot be less than 0"],
        max: [100, "Factor score cannot be greater than 100"],
      },
      description: {
        type: String,
        maxlength: [500, "Factor description cannot exceed 500 characters"],
      },
      details: {
        type: mongoose.Schema.Types.Mixed,
      },
    }],
    algorithm: {
      name: {
        type: String,
        required: [true, "Algorithm name is required"],
      },
      version: {
        type: String,
        required: [true, "Algorithm version is required"],
      },
      parameters: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
    metadata: {
      processingTime: {
        type: Number, // in milliseconds
      },
      modelUsed: String,
      inputSize: Number,
      outputSize: Number,
      apiCalls: [{
        service: String,
        endpoint: String,
        responseTime: Number,
        status: String,
        timestamp: Date,
      }],
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed", "expired"],
      default: "processing",
    },
    expiresAt: {
      type: Date,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    reviewNotes: {
      type: String,
      maxlength: [1000, "Review notes cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)
```

### Indexes
```javascript
// Create indexes for better query performance
trustScoreSchema.index({ document: 1, createdAt: -1 })
trustScoreSchema.index({ user: 1, createdAt: -1 })
trustScoreSchema.index({ score: -1 })
trustScoreSchema.index({ status: 1 })
trustScoreSchema.index({ isPublic: 1 })
trustScoreSchema.index({ tags: 1 })
trustScoreSchema.index({ expiresAt: 1 })
```

### Virtual Fields
```javascript
// Virtual for trust score level
trustScoreSchema.virtual("level").get(function() {
  if (this.score >= 90) return "excellent"
  if (this.score >= 80) return "good"
  if (this.score >= 70) return "fair"
  if (this.score >= 60) return "poor"
  return "very-poor"
})

// Virtual for trust score color
trustScoreSchema.virtual("color").get(function() {
  const levelColors = {
    excellent: "green",
    good: "blue",
    fair: "yellow",
    poor: "orange",
    "very-poor": "red",
  }
  return levelColors[this.level] || "gray"
})

// Virtual for age in days
trustScoreSchema.virtual("ageInDays").get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24))
})

// Virtual for is expired
trustScoreSchema.virtual("isExpired").get(function() {
  return this.expiresAt && this.expiresAt < new Date()
})
```

### Instance Methods
```javascript
// Calculate weighted score from factors
trustScoreSchema.methods.calculateWeightedScore = function() {
  if (this.factors.length === 0) return 0
  
  const weightedSum = this.factors.reduce((sum, factor) => {
    return sum + (factor.score * factor.weight)
  }, 0)
  
  const totalWeight = this.factors.reduce((sum, factor) => {
    return sum + factor.weight
  }, 0)
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

// Add factor to trust score
trustScoreSchema.methods.addFactor = function(name, weight, score, description, details) {
  this.factors.push({
    name,
    weight,
    score,
    description,
    details,
  })
  
  // Recalculate overall score
  this.score = this.calculateWeightedScore()
  
  return this.save()
}

// Mark as reviewed
trustScoreSchema.methods.markAsReviewed = function(userId, notes) {
  this.reviewedBy = userId
  this.reviewedAt = new Date()
  this.reviewNotes = notes
  
  return this.save()
}

// Extend expiration
trustScoreSchema.methods.extendExpiration = function(days) {
  if (this.expiresAt) {
    this.expiresAt = new Date(this.expiresAt.getTime() + (days * 24 * 60 * 60 * 1000))
  } else {
    this.expiresAt = new Date(Date.now() + (days * 24 * 60 * 60 * 1000))
  }
  
  return this.save()
}
```

---

## 🔗 Model Relationships

### Relationship Definitions
```javascript
// User -> Document (One-to-Many)
userSchema.virtual("documents", {
  ref: "Document",
  localField: "_id",
  foreignField: "user",
})

// User -> Workflow (One-to-Many)
userSchema.virtual("workflows", {
  ref: "Workflow",
  localField: "_id",
  foreignField: "creator",
})

// User -> TrustScore (One-to-Many)
userSchema.virtual("trustScores", {
  ref: "TrustScore",
  localField: "_id",
  foreignField: "user",
})

// Document -> TrustScore (One-to-Many)
documentSchema.virtual("trustScores", {
  ref: "TrustScore",
  localField: "_id",
  foreignField: "document",
})

// Document -> Workflow (Many-to-Many through documents array)
documentSchema.virtual("workflows", {
  ref: "Workflow",
  localField: "_id",
  foreignField: "documents.document",
})
```

### Population Examples
```javascript
// Populate user with documents
const userWithDocuments = await User.findById(userId)
  .populate({
    path: "documents",
    select: "title status createdAt",
    match: { status: "processed" },
    options: { sort: { createdAt: -1 } },
  })

// Populate document with trust scores
const documentWithScores = await Document.findById(documentId)
  .populate({
    path: "trustScores",
    select: "score confidence createdAt",
    match: { status: "completed" },
    options: { sort: { createdAt: -1 } },
  })

// Populate workflow with steps and assignees
const workflowWithDetails = await Workflow.findById(workflowId)
  .populate("creator", "name email")
  .populate("assignees.user", "name email")
  .populate("steps.assignedTo", "name email")
```

---

## 📊 Data Validation

### Custom Validators
```javascript
// Email format validator
const emailValidator = function(email) {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return emailRegex.test(email)
}

// Wallet address validator
const walletAddressValidator = function(address) {
  const addressRegex = /^0x[a-fA-F0-9]{40}$/
  return addressRegex.test(address)
}

// File size validator
const fileSizeValidator = function(size) {
  const maxSize = 50 * 1024 * 1024 // 50MB
  return size <= maxSize
}
```

### Validation Middleware
```javascript
// Pre-save validation
documentSchema.pre("save", function(next) {
  // Validate file type
  const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
  if (!allowedTypes.includes(this.mimeType)) {
    return next(new Error("File type not supported"))
  }
  
  // Validate file size
  if (this.fileSize > 50 * 1024 * 1024) {
    return next(new Error("File size too large"))
  }
  
  next()
})

// Pre-remove cleanup
documentSchema.pre("remove", async function(next) {
  // Remove associated trust scores
  await mongoose.model("TrustScore").deleteMany({ document: this._id })
  
  // Remove from workflows
  await mongoose.model("Workflow").updateMany(
    { "documents.document": this._id },
    { $pull: { documents: { document: this._id } } }
  )
  
  next()
})
```

---

*This database models documentation provides comprehensive coverage of all data models used in the Mintellect project. For specific implementation details, refer to the individual model files.* 