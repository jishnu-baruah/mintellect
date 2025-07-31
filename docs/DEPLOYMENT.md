# Mintellect - Deployment Guide

## 🚀 Deployment Guide Overview

This document provides comprehensive guidance for deploying the Mintellect project to production environments, including environment configuration, monitoring, and performance optimization.

### 📁 Deployment Guide Structure

```
Deployment Guide:
├── Production Deployment
├── Environment Configuration
├── Monitoring & Logging
├── Performance Optimization
├── Security Configuration
└── Disaster Recovery
```

---

## 🏭 Production Deployment

### Deployment Architecture

#### System Architecture
```mermaid
graph TB
    subgraph "CDN Layer"
        CDN[Cloudflare CDN]
    end
    
    subgraph "Frontend Layer"
        Vercel[Vercel Frontend]
    end
    
    subgraph "Backend Layer"
        Railway[Railway Backend]
        Plagiarism[Render Plagiarism Service]
    end
    
    subgraph "Database Layer"
        MongoDB[(MongoDB Atlas)]
    end
    
    subgraph "Storage Layer"
        Cloudinary[Cloudinary Storage]
        IPFS[IPFS Storage]
    end
    
    subgraph "Blockchain Layer"
        EduChain[EduChain Network]
        Polygon[Polygon Network]
    end
    
    CDN --> Vercel
    Vercel --> Railway
    Vercel --> Plagiarism
    Railway --> MongoDB
    Railway --> Cloudinary
    Railway --> IPFS
    Railway --> EduChain
    Railway --> Polygon
```

#### Deployment Components
```typescript
// Deployment Configuration
interface DeploymentConfig {
  frontend: {
    platform: 'Vercel';
    domain: string;
    environment: 'production';
    buildCommand: string;
    outputDirectory: string;
  };
  backend: {
    platform: 'Railway';
    domain: string;
    environment: 'production';
    port: number;
    healthCheck: string;
  };
  plagiarismService: {
    platform: 'Render';
    domain: string;
    environment: 'production';
    port: number;
  };
  database: {
    platform: 'MongoDB Atlas';
    cluster: string;
    database: string;
    connectionString: string;
  };
  storage: {
    cloudinary: CloudinaryConfig;
    ipfs: IPFSConfig;
  };
  blockchain: {
    networks: NetworkConfig[];
    contracts: ContractConfig[];
  };
}
```

### Frontend Deployment (Vercel)

#### 1. Vercel Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Initialize Vercel project
vercel init mintellect-frontend
```

#### 2. Configuration
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

#### 3. Environment Variables
```bash
# Set environment variables in Vercel
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
vercel env add NEXT_PUBLIC_CONTRACT_ADDRESS
vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

# Or set them via Vercel dashboard
# Go to Project Settings > Environment Variables
```

#### 4. Deployment Commands
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Pull environment variables
vercel env pull .env.local
```

### Backend Deployment (Railway)

#### 1. Railway Setup
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize Railway project
railway init
```

#### 2. Configuration
```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

#### 3. Environment Variables
```bash
# Set environment variables in Railway
railway variables set NODE_ENV=production
railway variables set MONGODB_URI=your_mongodb_uri
railway variables set JWT_SECRET=your_jwt_secret
railway variables set CLOUDINARY_CLOUD_NAME=your_cloud_name
railway variables set CLOUDINARY_API_KEY=your_api_key
railway variables set CLOUDINARY_API_SECRET=your_api_secret
railway variables set PLAGIARISMSEARCH_API_KEY=your_api_key
railway variables set GEMINI_API_KEY=your_gemini_key
```

#### 4. Deployment Commands
```bash
# Deploy to Railway
railway up

# View logs
railway logs

# Open Railway dashboard
railway open
```

### Plagiarism Service Deployment (Render)

#### 1. Render Setup
```bash
# Create Render account and connect GitHub repository
# Configure build settings in Render dashboard
```

#### 2. Configuration
```yaml
# render.yaml
services:
  - type: web
    name: mintellect-plagiarism
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python server.py
    envVars:
      - key: PYTHON_VERSION
        value: 3.9.0
      - key: PLAGIARISMSEARCH_API_KEY
        sync: false
    healthCheckPath: /health
    autoDeploy: true
```

#### 3. Environment Variables
```bash
# Set in Render dashboard
PLAGIARISMSEARCH_API_KEY=your_api_key
FLASK_ENV=production
PORT=8000
```

### Database Deployment (MongoDB Atlas)

#### 1. Atlas Setup
```bash
# Create MongoDB Atlas account
# Create new cluster
# Configure network access
# Create database user
```

#### 2. Connection Configuration
```javascript
// server/src/config/database.config.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    };

    await mongoose.connect(mongoURI, options);
    console.log("MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

#### 3. Database Optimization
```javascript
// Create indexes for performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.documents.createIndex({ "user": 1, "createdAt": -1 });
db.trustScores.createIndex({ "document": 1, "createdAt": -1 });
db.workflows.createIndex({ "creator": 1, "status": 1 });
```

---

## ⚙️ Environment Configuration

### Environment Variables

#### Frontend Environment (.env.local)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.mintellect.com
NEXT_PUBLIC_PLAGIARISM_API_URL=https://plagiarism.mintellect.com

# Wallet Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

#### Backend Environment (.env)
```bash
# Server Configuration
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://mintellect.com

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mintellect
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/mintellect

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# External APIs
PLAGIARISMSEARCH_API_KEY=your_plagiarism_api_key
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Blockchain Configuration
EDUCHAIN_RPC_URL=https://rpc.open-campus-codex.gelato.digital
POLYGON_RPC_URL=https://polygon-rpc.com
CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info
```

#### Plagiarism Service Environment
```bash
# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=false
PORT=8000

# API Configuration
PLAGIARISMSEARCH_API_KEY=your_api_key
API_RATE_LIMIT=100

# Database (if using local database)
DATABASE_URL=sqlite:///plagiarism.db

# Logging
LOG_LEVEL=INFO
LOG_FILE=plagiarism_service.log
```

### Configuration Management

#### Environment-Specific Configs
```javascript
// config/environments.js
const environments = {
  development: {
    apiUrl: 'http://localhost:3001',
    database: 'mongodb://localhost:27017/mintellect_dev',
    logLevel: 'debug',
    corsOrigin: 'http://localhost:3000',
  },
  staging: {
    apiUrl: 'https://staging-api.mintellect.com',
    database: process.env.MONGODB_URI_STAGING,
    logLevel: 'info',
    corsOrigin: 'https://staging.mintellect.com',
  },
  production: {
    apiUrl: 'https://api.mintellect.com',
    database: process.env.MONGODB_URI,
    logLevel: 'warn',
    corsOrigin: 'https://mintellect.com',
  },
};

module.exports = environments[process.env.NODE_ENV || 'development'];
```

#### Feature Flags
```javascript
// config/features.js
const features = {
  nftMinting: process.env.ENABLE_NFT_MINTING === 'true',
  aiDetection: process.env.ENABLE_AI_DETECTION === 'true',
  communityFeatures: process.env.ENABLE_COMMUNITY === 'true',
  advancedAnalytics: process.env.ENABLE_ANALYTICS === 'true',
};

module.exports = features;
```

---

## 📊 Monitoring & Logging

### Application Monitoring

#### Sentry Integration
```javascript
// server/src/utils/sentry.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
  ],
});

module.exports = Sentry;
```

#### Health Check Endpoints
```javascript
// server/src/routes/health.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1;
    
    // Check external services
    const cloudinaryStatus = await checkCloudinaryConnection();
    const plagiarismStatus = await checkPlagiarismService();
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus ? 'healthy' : 'unhealthy',
        cloudinary: cloudinaryStatus ? 'healthy' : 'unhealthy',
        plagiarism: plagiarismStatus ? 'healthy' : 'unhealthy',
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
    
    const isHealthy = Object.values(healthStatus.services).every(
      status => status === 'healthy'
    );
    
    res.status(isHealthy ? 200 : 503).json(healthStatus);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
```

#### Performance Monitoring
```javascript
// server/src/middleware/performance.js
const performanceMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, path, statusCode } = req;
    
    // Log performance metrics
    console.log(`${method} ${path} ${statusCode} - ${duration}ms`);
    
    // Send to monitoring service
    if (duration > 1000) {
      console.warn(`Slow request: ${method} ${path} took ${duration}ms`);
    }
  });
  
  next();
};

module.exports = performanceMiddleware;
```

### Logging Configuration

#### Winston Logger Setup
```javascript
// server/src/utils/logger.js
const winston = require('winston');
require('winston-daily-rotate-file');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'mintellect-backend' },
  transports: [
    // Error logs
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
    }),
    
    // Combined logs
    new winston.transports.DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

// Console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

#### Request Logging
```javascript
// server/src/middleware/logging.js
const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, path, statusCode } = req;
    const userAgent = req.get('User-Agent');
    const ip = req.ip;
    
    logger.info('HTTP Request', {
      method,
      path,
      statusCode,
      duration,
      userAgent,
      ip,
      userId: req.user?.id,
    });
  });
  
  next();
};

module.exports = requestLogger;
```

### Metrics Collection

#### Custom Metrics
```javascript
// server/src/utils/metrics.js
const metrics = {
  requests: {
    total: 0,
    successful: 0,
    failed: 0,
    byEndpoint: {},
  },
  documents: {
    uploaded: 0,
    processed: 0,
    failed: 0,
  },
  trustScores: {
    generated: 0,
    averageScore: 0,
    processingTime: [],
  },
  nfts: {
    minted: 0,
    failed: 0,
    gasUsed: 0,
  },
};

const updateMetrics = (category, action, value = 1) => {
  if (metrics[category]) {
    if (typeof metrics[category][action] === 'number') {
      metrics[category][action] += value;
    } else if (Array.isArray(metrics[category][action])) {
      metrics[category][action].push(value);
    }
  }
};

const getMetrics = () => {
  return {
    ...metrics,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  };
};

module.exports = { updateMetrics, getMetrics };
```

---

## ⚡ Performance Optimization

### Frontend Optimization

#### Next.js Optimization
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  
  // Image optimization
  images: {
    domains: ['cloudinary.com', 'res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }
    return config;
  },
  
  // Compression
  compress: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

#### Code Splitting
```typescript
// Lazy load components
import dynamic from 'next/dynamic';

const TrustScoreGenerator = dynamic(() => import('./TrustScoreGenerator'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const NFTMinting = dynamic(() => import('./NFTMinting'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

// Lazy load pages
const AnalyticsPage = dynamic(() => import('./pages/analytics'), {
  loading: () => <div>Loading Analytics...</div>,
});
```

#### Caching Strategy
```typescript
// Cache configuration
const cacheConfig = {
  // Static assets
  static: {
    maxAge: 31536000, // 1 year
    immutable: true,
  },
  
  // API responses
  api: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 60, // 1 minute
  },
  
  // User data
  user: {
    maxAge: 0, // No cache
    staleWhileRevalidate: 0,
  },
};

// Implement caching
export async function getStaticProps() {
  return {
    props: {
      data: await fetchData(),
    },
    revalidate: 3600, // Revalidate every hour
  };
}
```

### Backend Optimization

#### Database Optimization
```javascript
// Database connection pooling
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0,
  bufferCommands: false,
});

// Query optimization
const optimizedQuery = async (userId) => {
  return await User.findById(userId)
    .select('name email avatar')
    .lean()
    .exec();
};

// Index optimization
const createIndexes = async () => {
  await User.collection.createIndex({ email: 1 }, { unique: true });
  await Document.collection.createIndex({ user: 1, createdAt: -1 });
  await TrustScore.collection.createIndex({ document: 1, createdAt: -1 });
  await Workflow.collection.createIndex({ creator: 1, status: 1 });
};
```

#### Caching Implementation
```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL,
});

const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      const originalSend = res.json;
      res.json = function(data) {
        client.setex(key, duration, JSON.stringify(data));
        originalSend.call(this, data);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};

module.exports = cacheMiddleware;
```

#### API Response Optimization
```javascript
// Response compression
const compression = require('compression');

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
}));

// Response caching
app.get('/api/documents', cacheMiddleware(300), async (req, res) => {
  const documents = await Document.find({ user: req.user.id })
    .select('title filename trustScore createdAt')
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
  
  res.json({
    success: true,
    data: documents,
  });
});
```

---

## 🔐 Security Configuration

### Security Headers
```javascript
// Security middleware
const helmet = require('helmet');

app.use(helmet({
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
}));
```

### Rate Limiting
```javascript
// Rate limiting middleware
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
```

### Input Validation
```javascript
// Input validation middleware
const { body, validationResult } = require('express-validator');

const validateDocumentUpload = [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }
    next();
  },
];
```

### CORS Configuration
```javascript
// CORS configuration
const cors = require('cors');

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://mintellect.com',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
};

app.use(cors(corsOptions));
```

---

## 🚨 Disaster Recovery

### Backup Strategy

#### Database Backups
```javascript
// Automated database backup
const backupDatabase = async () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `./backups/mintellect-${timestamp}.json`;
    
    // Export all collections
    const collections = ['users', 'documents', 'trustScores', 'workflows'];
    
    for (const collection of collections) {
      const data = await mongoose.connection.db
        .collection(collection)
        .find({})
        .toArray();
      
      await fs.writeFile(
        `${backupPath}-${collection}.json`,
        JSON.stringify(data, null, 2)
      );
    }
    
    console.log(`Backup completed: ${backupPath}`);
  } catch (error) {
    console.error('Backup failed:', error);
  }
};

// Schedule daily backups
const cron = require('node-cron');
cron.schedule('0 2 * * *', backupDatabase); // Daily at 2 AM
```

#### File Storage Backups
```javascript
// Cloudinary backup strategy
const backupCloudinary = async () => {
  try {
    const cloudinary = require('cloudinary').v2;
    
    // List all resources
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'mintellect',
      max_results: 1000,
    });
    
    // Store backup metadata
    const backupData = {
      timestamp: new Date().toISOString(),
      resources: result.resources.map(resource => ({
        public_id: resource.public_id,
        url: resource.secure_url,
        format: resource.format,
        size: resource.bytes,
      })),
    };
    
    await fs.writeFile(
      `./backups/cloudinary-${Date.now()}.json`,
      JSON.stringify(backupData, null, 2)
    );
    
    console.log('Cloudinary backup completed');
  } catch (error) {
    console.error('Cloudinary backup failed:', error);
  }
};
```

### Recovery Procedures

#### Database Recovery
```javascript
// Database recovery script
const restoreDatabase = async (backupPath) => {
  try {
    const collections = ['users', 'documents', 'trustScores', 'workflows'];
    
    for (const collection of collections) {
      const backupFile = `${backupPath}-${collection}.json`;
      const data = JSON.parse(await fs.readFile(backupFile, 'utf8'));
      
      // Clear existing data
      await mongoose.connection.db.collection(collection).deleteMany({});
      
      // Restore data
      if (data.length > 0) {
        await mongoose.connection.db.collection(collection).insertMany(data);
      }
      
      console.log(`Restored ${collection}: ${data.length} documents`);
    }
    
    console.log('Database recovery completed');
  } catch (error) {
    console.error('Database recovery failed:', error);
  }
};
```

#### Service Recovery
```javascript
// Service recovery checklist
const recoveryChecklist = {
  database: async () => {
    // Check database connection
    const isConnected = mongoose.connection.readyState === 1;
    if (!isConnected) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    return isConnected;
  },
  
  cloudinary: async () => {
    // Check Cloudinary connection
    try {
      const cloudinary = require('cloudinary').v2;
      await cloudinary.api.ping();
      return true;
    } catch (error) {
      return false;
    }
  },
  
  plagiarism: async () => {
    // Check plagiarism service
    try {
      const response = await fetch(`${process.env.PLAGIARISM_API_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  },
  
  blockchain: async () => {
    // Check blockchain connection
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.EDUCHAIN_RPC_URL
      );
      await provider.getNetwork();
      return true;
    } catch (error) {
      return false;
    }
  },
};

const performRecovery = async () => {
  console.log('Starting service recovery...');
  
  for (const [service, check] of Object.entries(recoveryChecklist)) {
    const isHealthy = await check();
    console.log(`${service}: ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`);
    
    if (!isHealthy) {
      console.log(`Attempting to recover ${service}...`);
      // Implement specific recovery logic for each service
    }
  }
};
```

---

*This deployment guide provides comprehensive coverage of production deployment for the Mintellect project. Follow these guidelines to ensure reliable, secure, and performant deployment.* 