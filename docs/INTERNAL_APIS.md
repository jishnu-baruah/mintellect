# Mintellect - Internal APIs Documentation

## 🎯 Internal APIs Overview

This document provides comprehensive documentation for all internal APIs used in the Mintellect project, including frontend-backend communication, API authentication, error handling, and data validation.

### 📁 Internal APIs Structure

```
Internal APIs:
├── Authentication APIs
├── User Management APIs
├── Document Management APIs
├── Workflow APIs
├── Trust Score APIs
├── NFT APIs
├── Analytics APIs
└── Utility APIs
```

---

## 🔐 Authentication APIs

### Authentication Service
```javascript
// server/src/services/authService.js
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require("../models/user.model")
const logger = require("../utils/logger")

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h"
  }

  async register(userData) {
    try {
      const { email, password, name } = userData

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() })
      if (existingUser) {
        throw new Error("User already exists")
      }

      // Create new user
      const user = new User({
        email: email.toLowerCase(),
        password,
        name,
      })

      await user.save()

      // Generate JWT token
      const token = this.generateToken(user._id)

      logger.info(`User registered: ${user._id}`)

      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      }
    } catch (error) {
      logger.error("Registration failed:", error)
      throw error
    }
  }

  async login(credentials) {
    try {
      const { email, password } = credentials

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() }).select("+password")
      if (!user) {
        throw new Error("Invalid credentials")
      }

      // Check if account is locked
      if (user.isLocked()) {
        throw new Error("Account is temporarily locked")
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        await user.incLoginAttempts()
        throw new Error("Invalid credentials")
      }

      // Reset login attempts on successful login
      await user.resetLoginAttempts()

      // Generate JWT token
      const token = this.generateToken(user._id)

      // Update last login
      await user.updateLastActive()

      logger.info(`User logged in: ${user._id}`)

      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          profileCompleted: user.profileCompleted,
        },
        token,
      }
    } catch (error) {
      logger.error("Login failed:", error)
      throw error
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret)
      const user = await User.findById(decoded.userId).select("-password")
      
      if (!user || !user.isActive) {
        throw new Error("Invalid token")
      }

      return user
    } catch (error) {
      logger.error("Token verification failed:", error)
      throw new Error("Invalid token")
    }
  }

  async refreshToken(token) {
    try {
      const user = await this.verifyToken(token)
      const newToken = this.generateToken(user._id)

      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token: newToken,
      }
    } catch (error) {
      logger.error("Token refresh failed:", error)
      throw error
    }
  }

  generateToken(userId) {
    return jwt.sign({ userId }, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    })
  }

  async forgotPassword(email) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() })
      if (!user) {
        // Don't reveal if user exists
        return { message: "If an account exists, a reset email has been sent" }
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex")
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      user.resetPasswordToken = resetToken
      user.resetPasswordExpires = resetTokenExpiry
      await user.save()

      // Send reset email (implement email service)
      // await emailService.sendPasswordReset(user.email, resetToken)

      logger.info(`Password reset requested for: ${user._id}`)

      return { message: "If an account exists, a reset email has been sent" }
    } catch (error) {
      logger.error("Password reset failed:", error)
      throw error
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      })

      if (!user) {
        throw new Error("Invalid or expired reset token")
      }

      // Update password
      user.password = newPassword
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()

      logger.info(`Password reset completed for: ${user._id}`)

      return { message: "Password reset successful" }
    } catch (error) {
      logger.error("Password reset failed:", error)
      throw error
    }
  }
}

module.exports = new AuthService()
```

### Authentication Routes
```javascript
// server/src/routes/auth.js
const express = require("express")
const router = express.Router()
const authService = require("../services/authService")
const { validateRegistration, validateLogin } = require("../middleware/validation")
const { authenticateToken } = require("../middleware/auth")

// Register new user
router.post("/register", validateRegistration, async (req, res) => {
  try {
    const result = await authService.register(req.body)
    
    res.status(201).json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Login user
router.post("/login", validateLogin, async (req, res) => {
  try {
    const result = await authService.login(req.body)
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    })
  }
})

// Verify token
router.get("/verify", authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Invalid token",
    })
  }
})

// Refresh token
router.post("/refresh", async (req, res) => {
  try {
    const { token } = req.body
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Token is required",
      })
    }

    const result = await authService.refreshToken(token)
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    })
  }
})

// Forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      })
    }

    const result = await authService.forgotPassword(email)
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Token and new password are required",
      })
    }

    const result = await authService.resetPassword(token, newPassword)
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

module.exports = router
```

---

## 👤 User Management APIs

### User Service
```javascript
// server/src/services/userService.js
const User = require("../models/user.model")
const logger = require("../utils/logger")

class UserService {
  async getProfile(userId) {
    try {
      const user = await User.findById(userId).select("-password")
      
      if (!user) {
        throw new Error("User not found")
      }

      return user
    } catch (error) {
      logger.error("Get profile failed:", error)
      throw error
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const allowedFields = [
        "name",
        "bio",
        "institution",
        "avatar",
        "preferences",
      ]

      const filteredData = {}
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field]
        }
      }

      const user = await User.findByIdAndUpdate(
        userId,
        filteredData,
        { new: true, runValidators: true }
      ).select("-password")

      if (!user) {
        throw new Error("User not found")
      }

      logger.info(`Profile updated for user: ${userId}`)

      return user
    } catch (error) {
      logger.error("Profile update failed:", error)
      throw error
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId).select("+password")
      
      if (!user) {
        throw new Error("User not found")
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword)
      if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect")
      }

      // Update password
      user.password = newPassword
      await user.save()

      logger.info(`Password changed for user: ${userId}`)

      return { message: "Password changed successfully" }
    } catch (error) {
      logger.error("Password change failed:", error)
      throw error
    }
  }

  async updatePreferences(userId, preferences) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { preferences },
        { new: true, runValidators: true }
      ).select("-password")

      if (!user) {
        throw new Error("User not found")
      }

      logger.info(`Preferences updated for user: ${userId}`)

      return user.preferences
    } catch (error) {
      logger.error("Preferences update failed:", error)
      throw error
    }
  }

  async deleteAccount(userId, password) {
    try {
      const user = await User.findById(userId).select("+password")
      
      if (!user) {
        throw new Error("User not found")
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        throw new Error("Password is incorrect")
      }

      // Soft delete - mark as inactive
      user.isActive = false
      user.deletedAt = new Date()
      await user.save()

      logger.info(`Account deleted for user: ${userId}`)

      return { message: "Account deleted successfully" }
    } catch (error) {
      logger.error("Account deletion failed:", error)
      throw error
    }
  }

  async getUserStats(userId) {
    try {
      const user = await User.findById(userId)
      
      if (!user) {
        throw new Error("User not found")
      }

      return user.stats
    } catch (error) {
      logger.error("Get user stats failed:", error)
      throw error
    }
  }
}

module.exports = new UserService()
```

### User Routes
```javascript
// server/src/routes/user.js
const express = require("express")
const router = express.Router()
const userService = require("../services/userService")
const { authenticateToken } = require("../middleware/auth")
const { validateProfileUpdate } = require("../middleware/validation")

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const profile = await userService.getProfile(req.user._id)
    
    res.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    })
  }
})

// Update user profile
router.put("/profile", authenticateToken, validateProfileUpdate, async (req, res) => {
  try {
    const updatedProfile = await userService.updateProfile(req.user._id, req.body)
    
    res.json({
      success: true,
      data: updatedProfile,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Change password
router.put("/password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required",
      })
    }

    const result = await userService.changePassword(
      req.user._id,
      currentPassword,
      newPassword
    )
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Update preferences
router.put("/preferences", authenticateToken, async (req, res) => {
  try {
    const preferences = await userService.updatePreferences(req.user._id, req.body)
    
    res.json({
      success: true,
      data: preferences,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Delete account
router.delete("/account", authenticateToken, async (req, res) => {
  try {
    const { password } = req.body
    
    if (!password) {
      return res.status(400).json({
        success: false,
        error: "Password is required",
      })
    }

    const result = await userService.deleteAccount(req.user._id, password)
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Get user stats
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const stats = await userService.getUserStats(req.user._id)
    
    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    })
  }
})

module.exports = router
```

---

## 📄 Document Management APIs

### Document Service
```javascript
// server/src/services/documentService.js
const Document = require("../models/document.model")
const fileProcessingService = require("./fileProcessingService")
const logger = require("../utils/logger")

class DocumentService {
  async uploadDocument(file, userId, metadata = {}) {
    try {
      logger.info(`Document upload started for user: ${userId}`)

      // Process and upload file
      const document = await fileProcessingService.processFile(file, userId)

      // Update with additional metadata
      if (Object.keys(metadata).length > 0) {
        document.metadata = { ...document.metadata, ...metadata }
        await document.save()
      }

      logger.info(`Document uploaded successfully: ${document._id}`)

      return document
    } catch (error) {
      logger.error("Document upload failed:", error)
      throw error
    }
  }

  async getDocuments(userId, filters = {}) {
    try {
      const {
        status,
        category,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = filters

      const query = { user: userId }

      // Apply filters
      if (status) query.status = status
      if (category) query["metadata.category"] = category

      const sortOptions = {}
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1

      const documents = await Document.find(query)
        .sort(sortOptions)
        .limit(limit)
        .skip((page - 1) * limit)
        .populate("user", "name email")

      const total = await Document.countDocuments(query)

      return {
        documents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      logger.error("Get documents failed:", error)
      throw error
    }
  }

  async getDocument(documentId, userId) {
    try {
      const document = await Document.findOne({
        _id: documentId,
        user: userId,
      }).populate("user", "name email")

      if (!document) {
        throw new Error("Document not found")
      }

      return document
    } catch (error) {
      logger.error("Get document failed:", error)
      throw error
    }
  }

  async updateDocument(documentId, userId, updateData) {
    try {
      const allowedFields = [
        "title",
        "metadata",
        "permissions",
      ]

      const filteredData = {}
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field]
        }
      }

      const document = await Document.findOneAndUpdate(
        {
          _id: documentId,
          user: userId,
        },
        filteredData,
        { new: true, runValidators: true }
      )

      if (!document) {
        throw new Error("Document not found")
      }

      logger.info(`Document updated: ${documentId}`)

      return document
    } catch (error) {
      logger.error("Document update failed:", error)
      throw error
    }
  }

  async deleteDocument(documentId, userId) {
    try {
      const document = await Document.findOne({
        _id: documentId,
        user: userId,
      })

      if (!document) {
        throw new Error("Document not found")
      }

      // Delete from cloud storage
      await fileProcessingService.deleteFile(documentId, userId)

      logger.info(`Document deleted: ${documentId}`)

      return { message: "Document deleted successfully" }
    } catch (error) {
      logger.error("Document deletion failed:", error)
      throw error
    }
  }

  async shareDocument(documentId, userId, shareData) {
    try {
      const { userEmail, permission } = shareData

      const document = await Document.findOne({
        _id: documentId,
        user: userId,
      })

      if (!document) {
        throw new Error("Document not found")
      }

      // Find user to share with
      const User = require("../models/user.model")
      const targetUser = await User.findOne({ email: userEmail.toLowerCase() })

      if (!targetUser) {
        throw new Error("User not found")
      }

      // Share document
      await document.shareWith(targetUser._id, permission)

      logger.info(`Document shared: ${documentId} with ${targetUser._id}`)

      return { message: "Document shared successfully" }
    } catch (error) {
      logger.error("Document sharing failed:", error)
      throw error
    }
  }

  async addComment(documentId, userId, commentData) {
    try {
      const { content } = commentData

      const document = await Document.findOne({
        _id: documentId,
        user: userId,
      })

      if (!document) {
        throw new Error("Document not found")
      }

      await document.addComment(userId, content)

      logger.info(`Comment added to document: ${documentId}`)

      return { message: "Comment added successfully" }
    } catch (error) {
      logger.error("Comment addition failed:", error)
      throw error
    }
  }
}

module.exports = new DocumentService()
```

### Document Routes
```javascript
// server/src/routes/documents.js
const express = require("express")
const router = express.Router()
const documentService = require("../services/documentService")
const { authenticateToken } = require("../middleware/auth")
const { upload } = require("../middleware/upload")

// Upload document
router.post("/upload", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "File is required",
      })
    }

    const document = await documentService.uploadDocument(
      req.file,
      req.user._id,
      req.body
    )
    
    res.status(201).json({
      success: true,
      data: document,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Get documents
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await documentService.getDocuments(req.user._id, req.query)
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Get single document
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const document = await documentService.getDocument(req.params.id, req.user._id)
    
    res.json({
      success: true,
      data: document,
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    })
  }
})

// Update document
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const document = await documentService.updateDocument(
      req.params.id,
      req.user._id,
      req.body
    )
    
    res.json({
      success: true,
      data: document,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Delete document
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const result = await documentService.deleteDocument(req.params.id, req.user._id)
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Share document
router.post("/:id/share", authenticateToken, async (req, res) => {
  try {
    const result = await documentService.shareDocument(
      req.params.id,
      req.user._id,
      req.body
    )
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Add comment
router.post("/:id/comments", authenticateToken, async (req, res) => {
  try {
    const result = await documentService.addComment(
      req.params.id,
      req.user._id,
      req.body
    )
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

module.exports = router
```

---

## 🔄 Workflow APIs

### Workflow Service
```javascript
// server/src/services/workflowService.js
const Workflow = require("../models/workflow.model")
const workflowManagementService = require("./workflowManagementService")
const logger = require("../utils/logger")

class WorkflowService {
  async createWorkflow(workflowData, userId) {
    try {
      logger.info(`Workflow creation started by user: ${userId}`)

      const workflow = await workflowManagementService.createWorkflow({
        ...workflowData,
        creator: userId,
      })

      logger.info(`Workflow created: ${workflow._id}`)

      return workflow
    } catch (error) {
      logger.error("Workflow creation failed:", error)
      throw error
    }
  }

  async getWorkflows(userId, filters = {}) {
    try {
      const {
        status,
        type,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = filters

      const query = {
        $or: [
          { creator: userId },
          { "assignees.user": userId },
        ],
      }

      // Apply filters
      if (status) query.status = status
      if (type) query.type = type

      const sortOptions = {}
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1

      const workflows = await Workflow.find(query)
        .sort(sortOptions)
        .limit(limit)
        .skip((page - 1) * limit)
        .populate("creator", "name email")
        .populate("assignees.user", "name email")

      const total = await Workflow.countDocuments(query)

      return {
        workflows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      logger.error("Get workflows failed:", error)
      throw error
    }
  }

  async getWorkflow(workflowId, userId) {
    try {
      const workflow = await Workflow.findOne({
        _id: workflowId,
        $or: [
          { creator: userId },
          { "assignees.user": userId },
        ],
      })
        .populate("creator", "name email")
        .populate("assignees.user", "name email")
        .populate("steps.assignedTo", "name email")
        .populate("documents.document")

      if (!workflow) {
        throw new Error("Workflow not found")
      }

      return workflow
    } catch (error) {
      logger.error("Get workflow failed:", error)
      throw error
    }
  }

  async startWorkflow(workflowId, userId) {
    try {
      const workflow = await workflowManagementService.startWorkflow(workflowId, userId)
      return workflow
    } catch (error) {
      logger.error("Workflow start failed:", error)
      throw error
    }
  }

  async pauseWorkflow(workflowId, userId, reason) {
    try {
      const workflow = await workflowManagementService.pauseWorkflow(workflowId, userId, reason)
      return workflow
    } catch (error) {
      logger.error("Workflow pause failed:", error)
      throw error
    }
  }

  async resumeWorkflow(workflowId, userId) {
    try {
      const workflow = await workflowManagementService.resumeWorkflow(workflowId, userId)
      return workflow
    } catch (error) {
      logger.error("Workflow resume failed:", error)
      throw error
    }
  }

  async cancelWorkflow(workflowId, userId, reason) {
    try {
      const workflow = await workflowManagementService.cancelWorkflow(workflowId, userId, reason)
      return workflow
    } catch (error) {
      logger.error("Workflow cancellation failed:", error)
      throw error
    }
  }

  async completeStep(workflowId, stepIndex, userId, stepData = {}) {
    try {
      const workflow = await Workflow.findById(workflowId)
      
      if (!workflow) {
        throw new Error("Workflow not found")
      }

      // Check permissions
      if (!workflowManagementService.hasPermission(workflow, userId, "complete_step")) {
        throw new Error("Insufficient permissions")
      }

      await workflowManagementService.executeStep(workflow, stepIndex)

      return workflow
    } catch (error) {
      logger.error("Step completion failed:", error)
      throw error
    }
  }
}

module.exports = new WorkflowService()
```

### Workflow Routes
```javascript
// server/src/routes/workflows.js
const express = require("express")
const router = express.Router()
const workflowService = require("../services/workflowService")
const { authenticateToken } = require("../middleware/auth")

// Create workflow
router.post("/", authenticateToken, async (req, res) => {
  try {
    const workflow = await workflowService.createWorkflow(req.body, req.user._id)
    
    res.status(201).json({
      success: true,
      data: workflow,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Get workflows
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await workflowService.getWorkflows(req.user._id, req.query)
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Get single workflow
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const workflow = await workflowService.getWorkflow(req.params.id, req.user._id)
    
    res.json({
      success: true,
      data: workflow,
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    })
  }
})

// Start workflow
router.post("/:id/start", authenticateToken, async (req, res) => {
  try {
    const workflow = await workflowService.startWorkflow(req.params.id, req.user._id)
    
    res.json({
      success: true,
      data: workflow,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Pause workflow
router.post("/:id/pause", authenticateToken, async (req, res) => {
  try {
    const { reason } = req.body
    const workflow = await workflowService.pauseWorkflow(req.params.id, req.user._id, reason)
    
    res.json({
      success: true,
      data: workflow,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Resume workflow
router.post("/:id/resume", authenticateToken, async (req, res) => {
  try {
    const workflow = await workflowService.resumeWorkflow(req.params.id, req.user._id)
    
    res.json({
      success: true,
      data: workflow,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Cancel workflow
router.post("/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const { reason } = req.body
    const workflow = await workflowService.cancelWorkflow(req.params.id, req.user._id, reason)
    
    res.json({
      success: true,
      data: workflow,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Complete step
router.post("/:id/steps/:stepIndex/complete", authenticateToken, async (req, res) => {
  try {
    const workflow = await workflowService.completeStep(
      req.params.id,
      parseInt(req.params.stepIndex),
      req.user._id,
      req.body
    )
    
    res.json({
      success: true,
      data: workflow,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

module.exports = router
```

---

## 🛡️ Trust Score APIs

### Trust Score Service
```javascript
// server/src/services/trustScoreService.js
const TrustScore = require("../models/trustScore.model")
const trustScoreCalculator = require("./trustScoreCalculator")
const logger = require("../utils/logger")

class TrustScoreService {
  async generateTrustScore(documentId, userId) {
    try {
      logger.info(`Trust score generation started for document: ${documentId}`)

      const trustScore = await trustScoreCalculator.calculateTrustScore(documentId, userId)

      logger.info(`Trust score generated: ${trustScore._id}`)

      return trustScore
    } catch (error) {
      logger.error("Trust score generation failed:", error)
      throw error
    }
  }

  async getTrustScores(userId, filters = {}) {
    try {
      const {
        documentId,
        status,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = filters

      const query = { user: userId }

      // Apply filters
      if (documentId) query.document = documentId
      if (status) query.status = status

      const sortOptions = {}
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1

      const trustScores = await TrustScore.find(query)
        .sort(sortOptions)
        .limit(limit)
        .skip((page - 1) * limit)
        .populate("document", "title filename")
        .populate("user", "name email")

      const total = await TrustScore.countDocuments(query)

      return {
        trustScores,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      logger.error("Get trust scores failed:", error)
      throw error
    }
  }

  async getTrustScore(trustScoreId, userId) {
    try {
      const trustScore = await TrustScore.findOne({
        _id: trustScoreId,
        user: userId,
      })
        .populate("document", "title filename cloudinaryUrl")
        .populate("user", "name email")

      if (!trustScore) {
        throw new Error("Trust score not found")
      }

      return trustScore
    } catch (error) {
      logger.error("Get trust score failed:", error)
      throw error
    }
  }

  async reviewTrustScore(trustScoreId, userId, reviewData) {
    try {
      const { notes } = reviewData

      const trustScore = await TrustScore.findById(trustScoreId)

      if (!trustScore) {
        throw new Error("Trust score not found")
      }

      await trustScore.markAsReviewed(userId, notes)

      logger.info(`Trust score reviewed: ${trustScoreId}`)

      return trustScore
    } catch (error) {
      logger.error("Trust score review failed:", error)
      throw error
    }
  }

  async extendExpiration(trustScoreId, userId, days) {
    try {
      const trustScore = await TrustScore.findOne({
        _id: trustScoreId,
        user: userId,
      })

      if (!trustScore) {
        throw new Error("Trust score not found")
      }

      await trustScore.extendExpiration(days)

      logger.info(`Trust score expiration extended: ${trustScoreId}`)

      return trustScore
    } catch (error) {
      logger.error("Trust score expiration extension failed:", error)
      throw error
    }
  }
}

module.exports = new TrustScoreService()
```

### Trust Score Routes
```javascript
// server/src/routes/trust-scores.js
const express = require("express")
const router = express.Router()
const trustScoreService = require("../services/trustScoreService")
const { authenticateToken } = require("../middleware/auth")

// Generate trust score
router.post("/generate", authenticateToken, async (req, res) => {
  try {
    const { documentId } = req.body
    
    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "Document ID is required",
      })
    }

    const trustScore = await trustScoreService.generateTrustScore(documentId, req.user._id)
    
    res.status(201).json({
      success: true,
      data: trustScore,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Get trust scores
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await trustScoreService.getTrustScores(req.user._id, req.query)
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Get single trust score
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const trustScore = await trustScoreService.getTrustScore(req.params.id, req.user._id)
    
    res.json({
      success: true,
      data: trustScore,
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    })
  }
})

// Review trust score
router.post("/:id/review", authenticateToken, async (req, res) => {
  try {
    const trustScore = await trustScoreService.reviewTrustScore(
      req.params.id,
      req.user._id,
      req.body
    )
    
    res.json({
      success: true,
      data: trustScore,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Extend expiration
router.post("/:id/extend", authenticateToken, async (req, res) => {
  try {
    const { days } = req.body
    
    if (!days || days <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid number of days is required",
      })
    }

    const trustScore = await trustScoreService.extendExpiration(
      req.params.id,
      req.user._id,
      days
    )
    
    res.json({
      success: true,
      data: trustScore,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

module.exports = router
```

---

## 🔧 Error Handling & Validation

### Error Handling Middleware
```javascript
// server/src/middleware/errorHandler.js
const logger = require("../utils/logger")

const errorHandler = (err, req, res, next) => {
  logger.error("API Error:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    user: req.user?.id,
  })

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors,
    })
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      success: false,
      error: `${field} already exists`,
    })
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    })
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token expired",
    })
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
  })
}

module.exports = errorHandler
```

### Validation Middleware
```javascript
// server/src/middleware/validation.js
const { body, validationResult } = require("express-validator")

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array(),
    })
  }
  next()
}

const validateRegistration = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage("Password must contain uppercase, lowercase, number, and special character"),
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  handleValidationErrors,
]

const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  handleValidationErrors,
]

const validateProfileUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),
  body("institution")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Institution name cannot exceed 200 characters"),
  handleValidationErrors,
]

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
}
```

---

*This internal APIs documentation provides comprehensive coverage of all internal APIs used in the Mintellect project. For specific implementation details, refer to the individual service and route files.* 