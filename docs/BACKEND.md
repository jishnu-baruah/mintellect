# Mintellect - Backend Documentation

## 🎯 Backend Overview

The Mintellect backend is built with **Express.js** and **Node.js**, providing a robust API for document processing, trust score calculation, user management, and blockchain integration.

### 🏗️ Technology Stack

#### Core Framework
- **Node.js** - JavaScript runtime
- **Express.js 4.18.2** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 8.16.4** - MongoDB object modeling

#### File Processing & AI
- **Multer 1.4.5** - File upload handling
- **PDF.js-extract 0.2.1** - PDF text extraction
- **@xenova/transformers 2.8.0** - AI/ML processing
- **Puppeteer 24.14.0** - Web scraping

#### Cloud Services
- **Cloudinary 2.7.0** - File storage and processing
- **AWS SDK 2.1692.0** - AWS services integration

#### Security & Utilities
- **Helmet 7.1.0** - Security middleware
- **CORS 2.8.5** - Cross-origin resource sharing
- **Winston 3.11.0** - Logging
- **Morgan 1.10.0** - HTTP request logging

---

## 📁 Project Structure

```
server/
├── server.js                 # Main server entry point
├── src/
│   ├── app.js               # Express application setup
│   ├── routes/              # API route handlers
│   │   ├── profile.js       # User profile management
│   │   ├── files.js         # File upload and management
│   │   ├── trustScore.js    # Trust score calculation
│   │   ├── workflowArchive.js # Workflow management
│   │   └── pdf.js           # PDF generation
│   ├── models/              # MongoDB models
│   │   └── user.model.js    # User data model
│   ├── services/            # Business logic services
│   │   ├── trustScoreCalculator.js # Trust score algorithm
│   │   └── workflowArchiveService.js # Workflow management
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.js # Authentication
│   │   ├── errorHandler.js  # Error handling
│   │   └── profileCompletion.js # Profile completion check
│   ├── config/              # Configuration files
│   │   ├── database.config.js # Database configuration
│   │   └── profileRequirements.config.js # Profile requirements
│   └── utils/               # Utility functions
│       ├── asyncHandler.js  # Async error handling
│       ├── cloudinary.js    # Cloudinary configuration
│       └── checkProfileCompletion.js # Profile validation
├── public/                  # Static assets
│   └── img/                 # Images
├── temp/                    # Temporary files
└── package.json             # Dependencies and scripts
```

---

## 🔧 Core Components

### Server Entry Point (`server.js`)
```javascript
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './src/app.js';

dotenv.config();

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Connect to MongoDB
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('MongoDB connected');
      startServer();
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      startServer();
    });
} else {
  startServer();
}
```

### Express Application (`src/app.js`)
```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Route imports
import profileRouter from './routes/profile.js';
import trustScoreRouter from './routes/trustScore.js';
import filesRouter from './routes/files.js';
import workflowArchiveRouter from './routes/workflowArchive.js';
import pdfRouter from './routes/pdf.js';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Special middleware for large payloads
app.use('/api/trust-score', express.json({ limit: '100mb' }));
app.use('/api/files', express.json({ limit: '100mb' }));

// Routes
app.use('/settings/profile', profileRouter);
app.use('/api/trust-score', trustScoreRouter);
app.use('/api/files', filesRouter);
app.use('/api/workflow', workflowArchiveRouter);
app.use('/api/pdf', pdfRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
```

---

## 🗄️ Database Models

### User Model (`src/models/user.model.js`)
```javascript
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  ocid: { type: String }, // On-Chain ID
  name: { type: String, required: true },
  mail: { type: String, required: true, unique: true },
  institution: { type: String },
  bio: { type: String },
  userTier: { 
    type: String, 
    enum: ['free', 'premium'], 
    default: 'free' 
  },
  credits: { type: Number, default: 0 },
  avatar: { type: String }, // Cloudinary URL
  refreshToken: { type: String },
  telegram: { type: String },
  twitter: { type: String },
  orcid: { type: String },
  wallet: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;
```

---

## 🔄 API Routes

### Profile Management (`src/routes/profile.js`)
```javascript
import express from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import User from '../models/user.model.js';

const router = express.Router();

// GET user profile by wallet
router.get('/profile', asyncHandler(async (req, res) => {
  const { wallet } = req.query;
  if (!wallet) return res.status(400).json({ message: 'Wallet address required' });
  
  const user = await User.findOne({ wallet });
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  const profile = user.toObject();
  const allComplete = checkProfileCompletion(profile);
  res.json({ profile, allComplete });
}));

// POST create/update user profile
router.post('/profile', upload.single('avatar'), asyncHandler(async (req, res) => {
  const { wallet, firstName, lastName, email, institution, bio } = req.body;
  
  let user = await User.findOne({ wallet });
  let avatarUrl = user?.avatar || "";
  
  if (req.file) {
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'mintellect/avatars' },
      (error, result) => {
        if (error) return reject(error);
        avatarUrl = result.secure_url;
        resolve(result);
      }
    );
    stream.end(req.file.buffer);
  }
  
  const updateFields = {
    name: firstName + ' ' + lastName,
    mail: email,
    institution,
    bio,
    avatar: avatarUrl
  };
  
  if (user) {
    Object.assign(user, updateFields);
    await user.save();
    res.status(200).json({ message: 'Profile updated', user });
  } else {
    user = new User({ wallet, ...updateFields });
    await user.save();
    res.status(201).json({ message: 'Profile created', user });
  }
}));
```

### File Management (`src/routes/files.js`)
```javascript
import express from 'express';
import multer from 'multer';

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// POST file upload
router.post('/upload', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file provided'
    });
  }
  
  const file = req.file;
  const fileId = Math.random().toString(36).substring(2, 15);
  
  // Extract text content
  let textContent = '';
  if (file.mimetype === 'text/plain') {
    textContent = file.buffer.toString('utf8');
  } else if (file.mimetype === 'application/pdf') {
    textContent = 'PDF content would be extracted here...';
  }
  
  const fileRecord = {
    _id: fileId,
    originalName: file.originalname,
    fileType: req.body.fileType || 'UNKNOWN',
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
}));
```

### Trust Score Calculation (`src/routes/trustScore.js`)
```javascript
import express from 'express';
import TrustScoreCalculator from '../services/trustScoreCalculator.js';

const router = express.Router();
const trustScoreCalculator = new TrustScoreCalculator();

// POST generate trust score
router.post('/generate', asyncHandler(async (req, res) => {
  const { textContent, plagiarismResults, fileId } = req.body;
  
  if (!textContent) {
    return res.status(400).json({
      success: false,
      error: 'Text content is required'
    });
  }
  
  const result = await trustScoreCalculator.calculateTrustScore({
    textContent,
    plagiarismResults,
    fileId
  });
  
  res.json({
    success: true,
    data: result
  });
}));

// POST generate trust score for large files
router.post('/generate-large', largePayloadMiddleware, asyncHandler(async (req, res) => {
  const { textContent, title, fileType } = req.body;
  
  const result = await trustScoreCalculator.calculateTrustScore(textContent, title, fileType);
  
  res.json({
    success: true,
    data: result
  });
}));
```

---

## 🧠 Business Logic Services

### Trust Score Calculator (`src/services/trustScoreCalculator.js`)
```javascript
import fetch from 'node-fetch';

class TrustScoreCalculator {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    this.geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
  }
  
  async calculateTrustScore({ textContent, plagiarismResults, fileId }) {
    try {
      // Extract plagiarism score
      const plagiarismScore = this.extractPlagiarismScore(plagiarismResults);
      
      // Get AI analysis from Gemini
      const aiAnalysis = await this.analyzeWithGemini(textContent);
      
      // Calculate weighted trust score
      const trustScore = this.calculateWeightedScore(plagiarismScore, aiAnalysis);
      
      // Generate breakdown and recommendations
      const breakdown = this.generateBreakdown(plagiarismScore, aiAnalysis, trustScore);
      const recommendations = this.generateRecommendations(trustScore, breakdown);
      
      return {
        trustScore: Math.round(trustScore * 100),
        plagiarismScore: Math.round(plagiarismScore * 100),
        aiAnalysis,
        breakdown,
        recommendations,
        timestamp: new Date().toISOString(),
        fileId
      };
    } catch (error) {
      throw new Error(`Trust score calculation failed: ${error.message}`);
    }
  }
  
  extractPlagiarismScore(plagiarismResults) {
    if (!plagiarismResults) return 0.85;
    
    let score = 0;
    if (plagiarismResults.plagiarism?.overall_score) {
      score = plagiarismResults.plagiarism.overall_score / 100;
    } else if (plagiarismResults.overall_score) {
      score = plagiarismResults.overall_score / 100;
    } else if (plagiarismResults.score) {
      score = plagiarismResults.score / 100;
    } else {
      score = 0.85;
    }
    
    return Math.max(0, 1 - score);
  }
  
  async analyzeWithGemini(textContent) {
    if (!this.geminiApiKey) {
      return this.generateFallbackAnalysis();
    }
    
    const truncatedText = textContent.length > 30000 ? 
      textContent.substring(0, 30000) : textContent;
    
    const prompt = `
      Analyze this academic text and provide a detailed assessment:
      
      ${truncatedText}
      
      Please provide analysis in JSON format with the following structure:
      {
        "textQuality": { "score": 0.85, "details": "Assessment of writing quality" },
        "citationAccuracy": { "score": 0.90, "details": "Assessment of citations" },
        "methodology": { "score": 0.80, "details": "Assessment of methodology" },
        "conclusions": { "score": 0.75, "details": "Assessment of conclusions" },
        "overallAssessment": "Overall assessment of the document"
      }
    `;
    
    const response = await fetch(this.geminiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.geminiApiKey}`
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const data = await response.json();
    return this.validateAndNormalizeAnalysis(data);
  }
  
  calculateWeightedScore(plagiarismScore, aiAnalysis) {
    const weights = {
      plagiarism: 0.3,
      textQuality: 0.2,
      citationAccuracy: 0.2,
      methodology: 0.15,
      conclusions: 0.15
    };
    
    return (
      plagiarismScore * weights.plagiarism +
      aiAnalysis.textQuality.score * weights.textQuality +
      aiAnalysis.citationAccuracy.score * weights.citationAccuracy +
      aiAnalysis.methodology.score * weights.methodology +
      aiAnalysis.conclusions.score * weights.conclusions
    );
  }
  
  generateBreakdown(plagiarismScore, aiAnalysis, trustScore) {
    return {
      plagiarism: {
        score: Math.round(plagiarismScore * 100),
        weight: 30,
        contribution: Math.round(plagiarismScore * 30)
      },
      textQuality: {
        score: Math.round(aiAnalysis.textQuality.score * 100),
        weight: 20,
        contribution: Math.round(aiAnalysis.textQuality.score * 20)
      },
      citationAccuracy: {
        score: Math.round(aiAnalysis.citationAccuracy.score * 100),
        weight: 20,
        contribution: Math.round(aiAnalysis.citationAccuracy.score * 20)
      },
      methodology: {
        score: Math.round(aiAnalysis.methodology.score * 100),
        weight: 15,
        contribution: Math.round(aiAnalysis.methodology.score * 15)
      },
      conclusions: {
        score: Math.round(aiAnalysis.conclusions.score * 100),
        weight: 15,
        contribution: Math.round(aiAnalysis.conclusions.score * 15)
      }
    };
  }
  
  generateRecommendations(trustScore, breakdown) {
    const recommendations = [];
    
    if (breakdown.plagiarism.score < 80) {
      recommendations.push("Consider reducing similarity with existing sources");
    }
    
    if (breakdown.textQuality.score < 75) {
      recommendations.push("Improve writing clarity and structure");
    }
    
    if (breakdown.citationAccuracy.score < 80) {
      recommendations.push("Verify and improve citation accuracy");
    }
    
    if (breakdown.methodology.score < 75) {
      recommendations.push("Strengthen methodology section");
    }
    
    if (breakdown.conclusions.score < 75) {
      recommendations.push("Enhance conclusion strength and support");
    }
    
    return recommendations;
  }
}

export default TrustScoreCalculator;
```

### Workflow Archive Service (`src/services/workflowArchiveService.js`)
```javascript
class WorkflowArchiveService {
  constructor() {
    this.archives = new Map();
  }
  
  async archiveWorkflow(workflowId, reason) {
    try {
      // Get workflow data
      const workflow = await this.getWorkflow(workflowId);
      
      if (!workflow) {
        throw new Error('Workflow not found');
      }
      
      // Create archive record
      const archive = {
        _id: `archive_${Date.now()}`,
        workflowId,
        originalWorkflow: workflow,
        archivedAt: new Date().toISOString(),
        reason,
        status: 'archived'
      };
      
      // Store archive
      this.archives.set(archive._id, archive);
      
      // Update workflow status
      await this.updateWorkflowStatus(workflowId, 'archived');
      
      return {
        success: true,
        data: {
          workflowId,
          status: 'archived',
          message: 'Workflow archived successfully'
        }
      };
    } catch (error) {
      throw new Error(`Archive failed: ${error.message}`);
    }
  }
  
  async getArchives(page = 1, limit = 10) {
    const archives = Array.from(this.archives.values());
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      archives: archives.slice(startIndex, endIndex),
      pagination: {
        page,
        limit,
        total: archives.length,
        pages: Math.ceil(archives.length / limit)
      }
    };
  }
  
  async resumeWorkflow(workflowId) {
    try {
      const workflow = await this.getWorkflow(workflowId);
      
      if (!workflow) {
        throw new Error('Workflow not found');
      }
      
      // Update workflow status
      await this.updateWorkflowStatus(workflowId, 'resumed');
      
      return {
        success: true,
        data: {
          workflowId,
          status: 'resumed',
          message: 'Workflow resumed successfully'
        }
      };
    } catch (error) {
      throw new Error(`Resume failed: ${error.message}`);
    }
  }
}

export default WorkflowArchiveService;
```

---

## 🔐 Middleware

### Authentication Middleware (`src/middleware/auth.middleware.js`)
```javascript
export const authenticateWallet = (req, res, next) => {
  const wallet = req.headers['x-wallet'];
  
  if (!wallet) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Wallet address required'
      }
    });
  }
  
  // Validate wallet address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid wallet address format'
      }
    });
  }
  
  req.wallet = wallet;
  next();
};
```

### Profile Completion Middleware (`src/middleware/profileCompletion.js`)
```javascript
import { checkProfileCompletion } from '../utils/checkProfileCompletion.js';

export const requireProfileCompletion = async (req, res, next) => {
  const wallet = req.headers['x-wallet'];
  
  if (!wallet) {
    return next();
  }
  
  try {
    const user = await User.findOne({ wallet });
    
    if (user && !checkProfileCompletion(user.toObject())) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'PROFILE_INCOMPLETE',
          message: 'Profile completion required'
        }
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};
```

### Error Handler (`src/middleware/errorHandler.js`)
```javascript
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    },
    timestamp: new Date().toISOString()
  });
};
```

---

## 🔧 Configuration

### Database Configuration (`src/config/database.config.js`)
```javascript
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
};
```

### Profile Requirements (`src/config/profileRequirements.config.js`)
```javascript
export const PROFILE_REQUIREMENTS = [
  {
    key: 'firstName',
    label: 'First Name',
    required: true,
    type: 'text'
  },
  {
    key: 'lastName',
    label: 'Last Name',
    required: true,
    type: 'text'
  },
  {
    key: 'email',
    label: 'Email Address',
    required: true,
    type: 'email'
  },
  {
    key: 'institution',
    label: 'Institution',
    required: true,
    type: 'text'
  },
  {
    key: 'bio',
    label: 'Biography',
    required: false,
    type: 'textarea'
  }
];
```

---

## 🚀 Performance & Security

### Performance Optimizations
- **File Size Limits**: 100MB for regular uploads, 200MB for large files
- **Text Truncation**: AI analysis limited to 30,000 characters
- **Caching**: In-memory caching for frequently accessed data
- **Connection Pooling**: MongoDB connection pooling
- **Async Processing**: Non-blocking operations

### Security Measures
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Request data validation
- **File Type Validation**: Restricted file uploads
- **Rate Limiting**: API request throttling
- **Error Handling**: Secure error responses

### Logging
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'mintellect-backend' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

---

## 🔄 External Integrations

### Cloudinary Integration (`src/utils/cloudinary.js`)
```javascript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;
```

### Gemini AI Integration
```javascript
// Trust score calculation with Gemini 2.5 Flash
const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
  },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }]
  })
});
```

---

## 📊 Monitoring & Health Checks

### Health Check Endpoint
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
});
```

### Performance Monitoring
```javascript
// Request timing middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});
```

---

*This backend documentation provides a comprehensive overview of the Mintellect backend architecture. For specific implementation details, refer to the individual service files.* 