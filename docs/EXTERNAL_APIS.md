# Mintellect - External APIs Documentation

## 🎯 External APIs Overview

This document provides comprehensive documentation for all external APIs and third-party services integrated into the Mintellect project, including their setup, configuration, and usage patterns.

### 📁 External APIs Structure

```
External Services:
├── Cloudinary (File Storage & Processing)
├── WalletConnect (Web3 Wallet Connection)
├── RainbowKit (Wallet UI Components)
├── PlagiarismSearch (Content Detection)
├── Gemini AI (Content Analysis)
├── OpenAI (AI Services)
├── MongoDB Atlas (Database)
└── Vercel (Deployment)
```

---

## ☁️ Cloudinary Integration

### Service Overview
Cloudinary is used for file storage, image processing, and document management in the Mintellect project.

### Configuration
```javascript
// server/src/utils/cloudinary.js
const cloudinary = require("cloudinary").v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

module.exports = cloudinary
```

### Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Backend (.env)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Upload Service
```javascript
// server/src/services/cloudinaryService.js
const cloudinary = require("../utils/cloudinary")
const logger = require("../utils/logger")

class CloudinaryService {
  async uploadFile(filePath, options = {}) {
    try {
      const defaultOptions = {
        resource_type: "auto",
        folder: "mintellect/documents",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        invalidate: true,
      }

      const uploadOptions = { ...defaultOptions, ...options }

      const result = await cloudinary.uploader.upload(filePath, uploadOptions)

      logger.info(`File uploaded to Cloudinary: ${result.public_id}`)

      return {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
      }
    } catch (error) {
      logger.error("Cloudinary upload failed:", error)
      throw new Error("File upload failed")
    }
  }

  async uploadDocument(filePath, metadata = {}) {
    const options = {
      folder: "mintellect/documents",
      resource_type: "raw",
      format: "pdf",
      ...metadata,
    }

    return this.uploadFile(filePath, options)
  }

  async uploadImage(filePath, metadata = {}) {
    const options = {
      folder: "mintellect/images",
      transformation: [
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
      ...metadata,
    }

    return this.uploadFile(filePath, options)
  }

  async deleteFile(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId)
      
      if (result.result === "ok") {
        logger.info(`File deleted from Cloudinary: ${publicId}`)
        return true
      } else {
        throw new Error(`Failed to delete file: ${publicId}`)
      }
    } catch (error) {
      logger.error("Cloudinary deletion failed:", error)
      throw error
    }
  }

  async generateThumbnail(publicId, options = {}) {
    try {
      const defaultOptions = {
        width: 300,
        height: 400,
        crop: "fill",
        quality: "auto",
        format: "jpg",
      }

      const thumbnailOptions = { ...defaultOptions, ...options }

      const url = cloudinary.url(publicId, {
        transformation: [thumbnailOptions],
      })

      return url
    } catch (error) {
      logger.error("Thumbnail generation failed:", error)
      throw error
    }
  }

  async getFileInfo(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId)
      
      return {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
        createdAt: result.created_at,
        tags: result.tags || [],
      }
    } catch (error) {
      logger.error("File info retrieval failed:", error)
      throw error
    }
  }

  async listFiles(folder = "mintellect", options = {}) {
    try {
      const defaultOptions = {
        type: "upload",
        prefix: folder,
        max_results: 100,
      }

      const listOptions = { ...defaultOptions, ...options }

      const result = await cloudinary.api.resources(listOptions)

      return result.resources.map(resource => ({
        publicId: resource.public_id,
        url: resource.secure_url,
        format: resource.format,
        size: resource.bytes,
        createdAt: resource.created_at,
      }))
    } catch (error) {
      logger.error("File listing failed:", error)
      throw error
    }
  }
}

module.exports = new CloudinaryService()
```

### Frontend Integration
```typescript
// client/lib/cloudinary.ts
export const uploadToCloudinary = async (file: File, preset: string) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", preset)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error("Upload failed")
    }

    const data = await response.json()
    return {
      publicId: data.public_id,
      url: data.secure_url,
      format: data.format,
      size: data.bytes,
    }
  } catch (error) {
    console.error("Cloudinary upload failed:", error)
    throw error
  }
}

export const getCloudinaryUrl = (publicId: string, options: any = {}) => {
  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
  const transformations = Object.entries(options)
    .map(([key, value]) => `${key}_${value}`)
    .join(",")

  return transformations
    ? `${baseUrl}/${transformations}/${publicId}`
    : `${baseUrl}/${publicId}`
}
```

---

## 🔗 WalletConnect Integration

### Service Overview
WalletConnect enables secure wallet connections for Web3 functionality in the Mintellect project.

### Configuration
```typescript
// client/lib/walletconnect.ts
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { createConfig } from "wagmi"

export const walletConnectConfig = {
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  metadata: {
    name: "Mintellect",
    description: "Academic Integrity Platform",
    url: "https://mintellect.com",
    icons: ["https://mintellect.com/icon.png"],
  },
}

export const walletConnectConnector = new WalletConnectConnector({
  options: {
    projectId: walletConnectConfig.projectId,
    metadata: walletConnectConfig.metadata,
    showQrModal: true,
  },
})
```

### Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Setup Instructions
1. **Create WalletConnect Account**
   - Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Sign up for an account
   - Create a new project

2. **Get Project ID**
   - Copy the project ID from your WalletConnect dashboard
   - Add it to your environment variables

3. **Configure Metadata**
   - Update the metadata in the configuration
   - Add your app's name, description, and icons

### Usage Examples
```typescript
// client/hooks/useWalletConnect.ts
import { useConnect, useDisconnect, useAccount } from "wagmi"
import { walletConnectConnector } from "@/lib/walletconnect"

export const useWalletConnect = () => {
  const { connect, isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAccount()

  const connectWallet = () => {
    connect({ connector: walletConnectConnector })
  }

  const disconnectWallet = () => {
    disconnect()
  }

  return {
    address,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
  }
}
```

---

## 🌈 RainbowKit Integration

### Service Overview
RainbowKit provides beautiful, accessible wallet connection components for React applications.

### Configuration
```typescript
// client/components/wallet-provider.tsx
"use client"

import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider, createConfig, http } from "wagmi"
import { educhain } from "@/lib/chains"

const { wallets } = getDefaultWallets({
  appName: "Mintellect",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
})

const config = createConfig({
  chains: [educhain],
  transports: {
    [educhain.id]: http(),
  },
})

const queryClient = new QueryClient()

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={config.chains} wallets={wallets}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### Custom Wallet Button
```typescript
// client/components/wallet-connect-button.tsx
"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"

export const WalletConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading"
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === "authenticated")

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} type="button">
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} type="button" variant="destructive">
                    Wrong network
                  </Button>
                )
              }

              return (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={openChainModal}
                    type="button"
                    variant="outline"
                    size="sm"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </Button>

                  <Button onClick={openAccountModal} type="button" variant="outline">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
```

---

## 🔍 PlagiarismSearch Integration

### Service Overview
PlagiarismSearch provides content similarity detection and plagiarism analysis for academic documents.

### Configuration
```javascript
// server/src/services/plagiarismService.js
const axios = require("axios")
const logger = require("../utils/logger")

class PlagiarismService {
  constructor() {
    this.apiKey = process.env.PLAGIARISMSEARCH_API_KEY
    this.baseUrl = "https://api.plagiarismsearch.com/v1"
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    })
  }

  async detectPlagiarism(fileUrl, options = {}) {
    try {
      logger.info("Starting plagiarism detection")

      const defaultOptions = {
        language: "en",
        searchType: "web",
        excludeQuotes: true,
        excludeBibliography: true,
        excludeReferences: true,
      }

      const searchOptions = { ...defaultOptions, ...options }

      // Create search request
      const searchResponse = await this.client.post("/search", {
        url: fileUrl,
        ...searchOptions,
      })

      const searchId = searchResponse.data.id

      // Wait for search completion
      const results = await this.waitForResults(searchId)

      logger.info("Plagiarism detection completed")

      return {
        overallScore: results.overallScore,
        matches: results.matches,
        sources: results.sources,
        reportUrl: results.reportUrl,
      }
    } catch (error) {
      logger.error("Plagiarism detection failed:", error)
      throw new Error("Plagiarism detection failed")
    }
  }

  async waitForResults(searchId, maxAttempts = 30) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await this.client.get(`/search/${searchId}`)
        const status = response.data.status

        if (status === "completed") {
          return response.data.results
        } else if (status === "failed") {
          throw new Error("Plagiarism search failed")
        }

        // Wait 2 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (error) {
        logger.error(`Error checking search status: ${error.message}`)
        throw error
      }
    }

    throw new Error("Plagiarism search timeout")
  }

  async getDetailedReport(searchId) {
    try {
      const response = await this.client.get(`/search/${searchId}/report`)
      return response.data
    } catch (error) {
      logger.error("Failed to get detailed report:", error)
      throw error
    }
  }

  async checkCredits() {
    try {
      const response = await this.client.get("/credits")
      return response.data
    } catch (error) {
      logger.error("Failed to check credits:", error)
      throw error
    }
  }
}

module.exports = new PlagiarismService()
```

### Environment Variables
```bash
# Backend (.env)
PLAGIARISMSEARCH_API_KEY=your_api_key_here
```

### Usage Examples
```javascript
// server/src/routes/plagiarism.js
const express = require("express")
const router = express.Router()
const plagiarismService = require("../services/plagiarismService")
const { authenticateToken } = require("../middleware/auth")

router.post("/detect", authenticateToken, async (req, res) => {
  try {
    const { fileUrl, options } = req.body

    if (!fileUrl) {
      return res.status(400).json({ error: "File URL is required" })
    }

    const results = await plagiarismService.detectPlagiarism(fileUrl, options)

    res.json({
      success: true,
      data: results,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

router.get("/credits", authenticateToken, async (req, res) => {
  try {
    const credits = await plagiarismService.checkCredits()
    res.json({ success: true, data: credits })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

module.exports = router
```

---

## 🤖 Gemini AI Integration

### Service Overview
Google's Gemini AI is used for content analysis, text processing, and intelligent document evaluation.

### Configuration
```javascript
// server/src/services/geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai")
const logger = require("../utils/logger")

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY
    this.genAI = new GoogleGenerativeAI(this.apiKey)
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" })
  }

  async analyzeContent(text, analysisType = "general") {
    try {
      logger.info(`Starting ${analysisType} content analysis`)

      const prompts = {
        general: "Analyze the following text for academic quality, coherence, and writing style:",
        academic: "Evaluate this academic text for research quality, methodology, and scholarly standards:",
        technical: "Analyze this technical document for accuracy, completeness, and technical depth:",
      }

      const prompt = prompts[analysisType] || prompts.general

      const result = await this.model.generateContent(`${prompt}\n\n${text}`)
      const response = await result.response
      const analysis = response.text()

      logger.info("Content analysis completed")

      return {
        analysis,
        type: analysisType,
        timestamp: new Date(),
      }
    } catch (error) {
      logger.error("Content analysis failed:", error)
      throw new Error("Content analysis failed")
    }
  }

  async generateSummary(text, maxLength = 200) {
    try {
      const prompt = `Summarize the following text in ${maxLength} words or less:\n\n${text}`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const summary = response.text()

      return {
        summary,
        originalLength: text.length,
        summaryLength: summary.length,
      }
    } catch (error) {
      logger.error("Summary generation failed:", error)
      throw new Error("Summary generation failed")
    }
  }

  async extractKeywords(text, count = 10) {
    try {
      const prompt = `Extract ${count} key terms or concepts from the following text:\n\n${text}`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const keywords = response.text().split("\n").filter(k => k.trim())

      return {
        keywords,
        count: keywords.length,
      }
    } catch (error) {
      logger.error("Keyword extraction failed:", error)
      throw new Error("Keyword extraction failed")
    }
  }

  async detectAIWriting(text) {
    try {
      const prompt = `Analyze the following text and determine if it was likely written by AI. Provide a confidence score (0-100) and reasoning:\n\n${text}`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const analysis = response.text()

      // Extract confidence score from response
      const confidenceMatch = analysis.match(/(\d+)%|confidence.*?(\d+)/i)
      const confidence = confidenceMatch ? parseInt(confidenceMatch[1] || confidenceMatch[2]) : 50

      return {
        aiProbability: confidence,
        humanProbability: 100 - confidence,
        analysis,
        confidence: Math.abs(confidence - 50) * 2, // Convert to 0-100 scale
      }
    } catch (error) {
      logger.error("AI detection failed:", error)
      throw new Error("AI detection failed")
    }
  }

  async improveText(text, improvementType = "general") {
    try {
      const prompts = {
        general: "Improve the writing quality, clarity, and flow of this text:",
        academic: "Improve this academic text for scholarly standards and formal writing:",
        technical: "Improve this technical text for accuracy and professional standards:",
      }

      const prompt = prompts[improvementType] || prompts.general

      const result = await this.model.generateContent(`${prompt}\n\n${text}`)
      const response = await result.response
      const improvedText = response.text()

      return {
        originalText: text,
        improvedText,
        improvements: this.identifyImprovements(text, improvedText),
      }
    } catch (error) {
      logger.error("Text improvement failed:", error)
      throw new Error("Text improvement failed")
    }
  }

  identifyImprovements(original, improved) {
    // Simple comparison to identify improvements
    const improvements = []

    if (improved.length > original.length) {
      improvements.push("Enhanced content and detail")
    }

    if (improved.split(".").length > original.split(".").length) {
      improvements.push("Improved sentence structure")
    }

    return improvements
  }
}

module.exports = new GeminiService()
```

### Environment Variables
```bash
# Backend (.env)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Usage Examples
```javascript
// server/src/routes/ai.js
const express = require("express")
const router = express.Router()
const geminiService = require("../services/geminiService")
const { authenticateToken } = require("../middleware/auth")

router.post("/analyze", authenticateToken, async (req, res) => {
  try {
    const { text, analysisType } = req.body

    if (!text) {
      return res.status(400).json({ error: "Text is required" })
    }

    const analysis = await geminiService.analyzeContent(text, analysisType)

    res.json({
      success: true,
      data: analysis,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

router.post("/detect-ai", authenticateToken, async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ error: "Text is required" })
    }

    const detection = await geminiService.detectAIWriting(text)

    res.json({
      success: true,
      data: detection,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})
```

---

## 🗄️ MongoDB Atlas Integration

### Service Overview
MongoDB Atlas provides cloud-hosted database services for the Mintellect application.

### Configuration
```javascript
// server/src/config/database.config.js
const mongoose = require("mongoose")
const logger = require("../utils/logger")

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI

    if (!mongoURI) {
      throw new Error("MongoDB URI is not defined")
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    }

    await mongoose.connect(mongoURI, options)

    logger.info("MongoDB Atlas connected successfully")

    // Handle connection events
    mongoose.connection.on("error", (error) => {
      logger.error("MongoDB connection error:", error)
    })

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected")
    })

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected")
    })

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close()
      logger.info("MongoDB connection closed through app termination")
      process.exit(0)
    })
  } catch (error) {
    logger.error("MongoDB connection failed:", error)
    process.exit(1)
  }
}

module.exports = connectDB
```

### Environment Variables
```bash
# Backend (.env)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mintellect
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/mintellect
```

### Database Service
```javascript
// server/src/services/databaseService.js
const mongoose = require("mongoose")
const logger = require("../utils/logger")

class DatabaseService {
  async getStats() {
    try {
      const stats = await mongoose.connection.db.stats()
      
      return {
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        indexSize: stats.indexSize,
      }
    } catch (error) {
      logger.error("Failed to get database stats:", error)
      throw error
    }
  }

  async getCollectionStats(collectionName) {
    try {
      const stats = await mongoose.connection.db.collection(collectionName).stats()
      
      return {
        count: stats.count,
        size: stats.size,
        avgObjSize: stats.avgObjSize,
        storageSize: stats.storageSize,
        indexes: stats.nindexes,
        indexSize: stats.totalIndexSize,
      }
    } catch (error) {
      logger.error(`Failed to get collection stats for ${collectionName}:`, error)
      throw error
    }
  }

  async backupDatabase() {
    try {
      // This would typically use mongodump or Atlas backup features
      logger.info("Database backup initiated")
      
      // For Atlas, backups are typically handled automatically
      return {
        success: true,
        message: "Backup process initiated",
        timestamp: new Date(),
      }
    } catch (error) {
      logger.error("Database backup failed:", error)
      throw error
    }
  }

  async optimizeIndexes() {
    try {
      // Analyze and optimize database indexes
      logger.info("Index optimization started")
      
      // This would typically involve analyzing query patterns
      // and creating/removing indexes as needed
      
      return {
        success: true,
        message: "Index optimization completed",
        timestamp: new Date(),
      }
    } catch (error) {
      logger.error("Index optimization failed:", error)
      throw error
    }
  }
}

module.exports = new DatabaseService()
```

---

## 🚀 Vercel Integration

### Service Overview
Vercel provides hosting and deployment services for the Mintellect frontend application.

### Configuration
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID": "@walletconnect-project-id",
    "NEXT_PUBLIC_CONTRACT_ADDRESS": "@contract-address",
    "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME": "@cloudinary-cloud-name"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

### Deployment Scripts
```json
// package.json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "vercel-build": "next build",
    "vercel-dev": "next dev"
  }
}
```

### Environment Variables Setup
```bash
# Vercel CLI commands
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
vercel env add NEXT_PUBLIC_CONTRACT_ADDRESS
vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
```

### Deployment Process
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Pull environment variables
vercel env pull .env.local
```

---

## 📊 Analytics Integration

### Service Overview
Analytics services provide insights into user behavior and application performance.

### Google Analytics Setup
```typescript
// client/lib/analytics.ts
import { GA_TRACKING_ID } from "@/lib/constants"

// Google Analytics
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_location: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
```

### Custom Analytics Service
```javascript
// server/src/services/analyticsService.js
const logger = require("../utils/logger")

class AnalyticsService {
  async trackEvent(eventData) {
    try {
      const {
        userId,
        event,
        category,
        action,
        label,
        value,
        metadata = {},
      } = eventData

      const eventRecord = {
        userId,
        event,
        category,
        action,
        label,
        value,
        metadata,
        timestamp: new Date(),
        userAgent: metadata.userAgent,
        ip: metadata.ip,
      }

      // Store event in database
      // This would typically go to an analytics collection
      logger.info("Event tracked:", eventRecord)

      return eventRecord
    } catch (error) {
      logger.error("Event tracking failed:", error)
      throw error
    }
  }

  async generateReport(startDate, endDate, filters = {}) {
    try {
      // Generate analytics report
      const report = {
        period: { startDate, endDate },
        totalUsers: 0,
        totalSessions: 0,
        totalEvents: 0,
        topEvents: [],
        userRetention: 0,
        generatedAt: new Date(),
      }

      // This would query the analytics database
      // and aggregate the data

      return report
    } catch (error) {
      logger.error("Report generation failed:", error)
      throw error
    }
  }
}

module.exports = new AnalyticsService()
```

---

## 🔐 Security & Rate Limiting

### Rate Limiting Configuration
```javascript
// server/src/middleware/rateLimit.js
const rateLimit = require("express-rate-limit")

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
}

// API rate limiting
const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  "Too many requests from this IP, please try again later."
)

// Auth rate limiting
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  "Too many authentication attempts, please try again later."
)

// Upload rate limiting
const uploadLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  10, // limit each IP to 10 uploads per hour
  "Too many file uploads, please try again later."
)

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
}
```

### API Security Headers
```javascript
// server/src/middleware/security.js
const helmet = require("helmet")

const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://api.cloudinary.com", "https://rpc.open-campus-codex.gelato.digital"],
    },
  },
  crossOriginEmbedderPolicy: false,
})

module.exports = securityMiddleware
```

---

## 🔧 Error Handling & Monitoring

### Error Tracking Service
```javascript
// server/src/services/errorTrackingService.js
const logger = require("../utils/logger")

class ErrorTrackingService {
  async trackError(error, context = {}) {
    try {
      const errorRecord = {
        message: error.message,
        stack: error.stack,
        name: error.name,
        context,
        timestamp: new Date(),
        environment: process.env.NODE_ENV,
      }

      // Log error
      logger.error("Application error:", errorRecord)

      // Send to error tracking service (e.g., Sentry)
      if (process.env.SENTRY_DSN) {
        // Sentry integration would go here
      }

      return errorRecord
    } catch (trackingError) {
      logger.error("Error tracking failed:", trackingError)
    }
  }

  async trackPerformance(operation, duration, metadata = {}) {
    try {
      const performanceRecord = {
        operation,
        duration,
        metadata,
        timestamp: new Date(),
      }

      logger.info("Performance metric:", performanceRecord)

      return performanceRecord
    } catch (error) {
      logger.error("Performance tracking failed:", error)
    }
  }
}

module.exports = new ErrorTrackingService()
```

---

*This external APIs documentation provides comprehensive coverage of all third-party services integrated into the Mintellect project. For specific implementation details, refer to the individual service files.* 