# Mintellect - Troubleshooting Guide

## 🔧 Troubleshooting Guide Overview

This document provides comprehensive troubleshooting guidance for the Mintellect project, including common issues, error codes, debug procedures, and performance optimization.

### 📁 Troubleshooting Guide Structure

```
Troubleshooting Guide:
├── Common Issues
├── Error Codes & Messages
├── Debug Procedures
├── Performance Issues
├── Network & Connectivity
└── Recovery Procedures
```

---

## 🚨 Common Issues

### Frontend Issues

#### 1. Build Failures
```bash
# Issue: Next.js build fails
Error: Build failed with errors

# Solution: Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for ESLint errors
npm run lint
```

#### 2. Wallet Connection Issues
```typescript
// Issue: Wallet not connecting
const { isConnected, connect } = useAccount();

// Debug steps:
console.log('Wallet status:', isConnected);
console.log('Available connectors:', connectors);

// Common solutions:
// 1. Check if WalletConnect project ID is set
// 2. Verify network configuration
// 3. Clear browser cache and cookies
// 4. Check if wallet extension is installed
```

#### 3. File Upload Problems
```typescript
// Issue: File upload fails
const handleFileUpload = async (file: File) => {
  try {
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });
    
    // Check file size limit
    if (file.size > 50 * 1024 * 1024) {
      throw new Error('File size exceeds 50MB limit');
    }
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported');
    }
    
    // Proceed with upload
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

#### 4. Trust Score Generation Issues
```typescript
// Issue: Trust score generation fails
const generateTrustScore = async (documentId: string) => {
  try {
    console.log('Starting trust score generation for:', documentId);
    
    const response = await fetch('/api/trust-score/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Trust score generation error:', error);
      throw new Error(error.message || 'Trust score generation failed');
    }
    
    const result = await response.json();
    console.log('Trust score generated:', result);
    
    return result;
  } catch (error) {
    console.error('Trust score generation failed:', error);
    throw error;
  }
};
```

### Backend Issues

#### 1. Database Connection Issues
```javascript
// Issue: MongoDB connection fails
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    
    // Common solutions:
    // 1. Check if MONGODB_URI is set correctly
    // 2. Verify network connectivity
    // 3. Check if MongoDB service is running
    // 4. Verify credentials and permissions
    
    process.exit(1);
  }
};
```

#### 2. API Endpoint Issues
```javascript
// Issue: API endpoints not responding
const debugAPI = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  
  const originalSend = res.send;
  res.send = function(data) {
    console.log('Response:', data);
    originalSend.call(this, data);
  };
  
  next();
};

// Add to app.js
app.use(debugAPI);
```

#### 3. File Processing Issues
```javascript
// Issue: File processing fails
const processFile = async (filePath) => {
  try {
    console.log('Processing file:', filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }
    
    // Check file size
    const stats = fs.statSync(filePath);
    console.log('File size:', stats.size);
    
    // Check file permissions
    fs.accessSync(filePath, fs.constants.R_OK);
    
    // Process file
    const result = await performFileProcessing(filePath);
    console.log('File processing completed:', result);
    
    return result;
  } catch (error) {
    console.error('File processing failed:', error);
    throw error;
  }
};
```

### Plagiarism Service Issues

#### 1. Service Not Starting
```python
# Issue: Plagiarism service fails to start
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def start_service():
    try:
        logger.info("Starting plagiarism service...")
        
        # Check environment variables
        api_key = os.getenv('PLAGIARISMSEARCH_API_KEY')
        if not api_key:
            raise ValueError("PLAGIARISMSEARCH_API_KEY not set")
        
        # Check port availability
        port = int(os.getenv('PORT', 8000))
        logger.info(f"Service will run on port {port}")
        
        # Start Flask app
        app.run(host='0.0.0.0', port=port, debug=False)
        
    except Exception as e:
        logger.error(f"Service startup failed: {e}")
        sys.exit(1)
```

#### 2. API Integration Issues
```python
# Issue: Plagiarism API calls fail
import requests
import logging

logger = logging.getLogger(__name__)

def call_plagiarism_api(document_url):
    try:
        logger.info(f"Calling plagiarism API for: {document_url}")
        
        headers = {
            'Authorization': f'Bearer {os.getenv("PLAGIARISMSEARCH_API_KEY")}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'url': document_url,
            'language': 'en',
            'searchType': 'web'
        }
        
        response = requests.post(
            'https://api.plagiarismsearch.com/v1/search',
            headers=headers,
            json=data,
            timeout=30
        )
        
        if response.status_code != 200:
            logger.error(f"API call failed: {response.status_code} - {response.text}")
            raise Exception(f"API call failed: {response.status_code}")
        
        result = response.json()
        logger.info("Plagiarism API call successful")
        
        return result
        
    except requests.exceptions.Timeout:
        logger.error("API call timed out")
        raise
    except requests.exceptions.RequestException as e:
        logger.error(f"API call failed: {e}")
        raise
```

---

## 📋 Error Codes & Messages

### HTTP Status Codes

#### 4xx Client Errors
```javascript
// 400 Bad Request
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}

// 401 Unauthorized
{
  "success": false,
  "error": "Authentication required",
  "code": "AUTH_REQUIRED"
}

// 403 Forbidden
{
  "success": false,
  "error": "Insufficient permissions",
  "code": "INSUFFICIENT_PERMISSIONS"
}

// 404 Not Found
{
  "success": false,
  "error": "Resource not found",
  "code": "RESOURCE_NOT_FOUND"
}

// 429 Too Many Requests
{
  "success": false,
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

#### 5xx Server Errors
```javascript
// 500 Internal Server Error
{
  "success": false,
  "error": "Internal server error",
  "code": "INTERNAL_ERROR",
  "requestId": "req_123456789"
}

// 502 Bad Gateway
{
  "success": false,
  "error": "External service unavailable",
  "code": "EXTERNAL_SERVICE_ERROR"
}

// 503 Service Unavailable
{
  "success": false,
  "error": "Service temporarily unavailable",
  "code": "SERVICE_UNAVAILABLE",
  "retryAfter": 300
}
```

### Application Error Codes

#### Authentication Errors
```javascript
const AUTH_ERRORS = {
  INVALID_TOKEN: {
    code: 'AUTH_INVALID_TOKEN',
    message: 'Invalid or expired token',
    solution: 'Please log in again'
  },
  TOKEN_EXPIRED: {
    code: 'AUTH_TOKEN_EXPIRED',
    message: 'Authentication token has expired',
    solution: 'Please refresh your session'
  },
  INSUFFICIENT_PERMISSIONS: {
    code: 'AUTH_INSUFFICIENT_PERMISSIONS',
    message: 'You do not have permission to perform this action',
    solution: 'Contact your administrator'
  },
  ACCOUNT_LOCKED: {
    code: 'AUTH_ACCOUNT_LOCKED',
    message: 'Account is temporarily locked',
    solution: 'Try again later or contact support'
  }
};
```

#### File Processing Errors
```javascript
const FILE_ERRORS = {
  FILE_TOO_LARGE: {
    code: 'FILE_TOO_LARGE',
    message: 'File size exceeds maximum limit',
    solution: 'Please upload a smaller file (max 50MB)'
  },
  INVALID_FORMAT: {
    code: 'FILE_INVALID_FORMAT',
    message: 'File format not supported',
    solution: 'Please upload PDF, DOC, or DOCX files only'
  },
  UPLOAD_FAILED: {
    code: 'FILE_UPLOAD_FAILED',
    message: 'File upload failed',
    solution: 'Please try again or contact support'
  },
  PROCESSING_FAILED: {
    code: 'FILE_PROCESSING_FAILED',
    message: 'File processing failed',
    solution: 'Please try again or contact support'
  }
};
```

#### Trust Score Errors
```javascript
const TRUST_SCORE_ERRORS = {
  CALCULATION_FAILED: {
    code: 'TRUST_SCORE_CALCULATION_FAILED',
    message: 'Trust score calculation failed',
    solution: 'Please try again or contact support'
  },
  INSUFFICIENT_DATA: {
    code: 'TRUST_SCORE_INSUFFICIENT_DATA',
    message: 'Insufficient data for trust score calculation',
    solution: 'Please ensure document contains sufficient text'
  },
  SERVICE_UNAVAILABLE: {
    code: 'TRUST_SCORE_SERVICE_UNAVAILABLE',
    message: 'Trust score service temporarily unavailable',
    solution: 'Please try again later'
  },
  RATE_LIMIT_EXCEEDED: {
    code: 'TRUST_SCORE_RATE_LIMIT',
    message: 'Trust score generation rate limit exceeded',
    solution: 'Please wait before generating another score'
  }
};
```

### Blockchain Errors

#### Wallet Connection Errors
```javascript
const WALLET_ERRORS = {
  WALLET_NOT_CONNECTED: {
    code: 'WALLET_NOT_CONNECTED',
    message: 'Wallet not connected',
    solution: 'Please connect your wallet'
  },
  WRONG_NETWORK: {
    code: 'WALLET_WRONG_NETWORK',
    message: 'Please switch to the correct network',
    solution: 'Connect to EduChain or Polygon network'
  },
  INSUFFICIENT_BALANCE: {
    code: 'WALLET_INSUFFICIENT_BALANCE',
    message: 'Insufficient balance for transaction',
    solution: 'Please add funds to your wallet'
  },
  TRANSACTION_FAILED: {
    code: 'WALLET_TRANSACTION_FAILED',
    message: 'Transaction failed',
    solution: 'Please try again or check gas fees'
  }
};
```

---

## 🔍 Debug Procedures

### Frontend Debugging

#### React Component Debugging
```typescript
// Debug component state and props
const MyComponent = (props) => {
  const [state, setState] = useState(initialState);
  
  // Debug logging
  console.log('Component props:', props);
  console.log('Component state:', state);
  
  // Debug effect dependencies
  useEffect(() => {
    console.log('Effect triggered with dependencies:', [state, props]);
  }, [state, props]);
  
  // Debug event handlers
  const handleClick = (event) => {
    console.log('Click event:', event);
    console.log('Current state before update:', state);
    setState(newState);
  };
  
  return <div onClick={handleClick}>...</div>;
};
```

#### API Call Debugging
```typescript
// Debug API calls
const debugAPI = async (url: string, options: RequestInit) => {
  console.log('API Request:', {
    url,
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body,
  });
  
  try {
    const response = await fetch(url, options);
    
    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });
    
    const data = await response.json();
    console.log('API Data:', data);
    
    return { response, data };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

#### Performance Debugging
```typescript
// Debug component performance
import { Profiler } from 'react';

const onRenderCallback = (id, phase, actualDuration) => {
  console.log(`Component ${id} ${phase} took ${actualDuration}ms`);
};

const MyComponent = () => {
  return (
    <Profiler id="MyComponent" onRender={onRenderCallback}>
      <div>...</div>
    </Profiler>
  );
};

// Debug bundle size
import { useEffect } from 'react';

useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle size info:', performance.getEntriesByType('navigation')[0]);
  }
}, []);
```

### Backend Debugging

#### Request/Response Debugging
```javascript
// Debug middleware
const debugMiddleware = (req, res, next) => {
  console.log('=== Request Debug ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  console.log('Params:', req.params);
  console.log('User:', req.user);
  
  const originalSend = res.send;
  res.send = function(data) {
    console.log('=== Response Debug ===');
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.getHeaders());
    console.log('Data:', data);
    originalSend.call(this, data);
  };
  
  next();
};
```

#### Database Query Debugging
```javascript
// Enable MongoDB query logging
mongoose.set('debug', process.env.NODE_ENV === 'development');

// Debug specific queries
const debugQuery = async (query) => {
  console.log('Query:', JSON.stringify(query, null, 2));
  
  const startTime = Date.now();
  const result = await query.exec();
  const endTime = Date.now();
  
  console.log('Query execution time:', endTime - startTime, 'ms');
  console.log('Query result count:', result.length);
  
  return result;
};

// Usage
const users = await debugQuery(User.find({ active: true }));
```

#### Memory Usage Debugging
```javascript
// Debug memory usage
const debugMemory = () => {
  const usage = process.memoryUsage();
  
  console.log('Memory Usage:');
  console.log('- RSS:', Math.round(usage.rss / 1024 / 1024), 'MB');
  console.log('- Heap Total:', Math.round(usage.heapTotal / 1024 / 1024), 'MB');
  console.log('- Heap Used:', Math.round(usage.heapUsed / 1024 / 1024), 'MB');
  console.log('- External:', Math.round(usage.external / 1024 / 1024), 'MB');
  
  return usage;
};

// Monitor memory usage
setInterval(debugMemory, 60000); // Every minute
```

### Network Debugging

#### API Endpoint Testing
```bash
# Test API endpoints
curl -X GET https://api.mintellect.com/health
curl -X POST https://api.mintellect.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test with authentication
curl -X GET https://api.mintellect.com/api/documents \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Database Connection Testing
```bash
# Test MongoDB connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/mintellect"

# Test specific collections
use mintellect
db.users.find().limit(1)
db.documents.find().limit(1)
```

#### External Service Testing
```bash
# Test Cloudinary
curl -X GET "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/resources" \
  -H "Authorization: Basic $(echo -n 'YOUR_API_KEY:YOUR_API_SECRET' | base64)"

# Test PlagiarismSearch
curl -X POST "https://api.plagiarismsearch.com/v1/search" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/document.pdf"}'
```

---

## ⚡ Performance Issues

### Frontend Performance

#### Bundle Size Issues
```javascript
// Analyze bundle size
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Next.js config
});

// Run analysis
ANALYZE=true npm run build
```

#### Component Re-rendering Issues
```typescript
// Debug unnecessary re-renders
import { useWhyDidYouUpdate } from 'ahooks';

const MyComponent = React.memo((props) => {
  useWhyDidYouUpdate('MyComponent', props);
  
  return <div>...</div>;
});

// Optimize with useMemo and useCallback
const MyComponent = ({ data, onAction }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: true,
    }));
  }, [data]);
  
  const handleAction = useCallback((id) => {
    onAction(id);
  }, [onAction]);
  
  return <div>...</div>;
};
```

#### API Performance Issues
```typescript
// Implement request caching
const cache = new Map();

const cachedFetch = async (url: string, options?: RequestInit) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    const now = Date.now();
    
    // Cache for 5 minutes
    if (now - timestamp < 5 * 60 * 1000) {
      return data;
    }
  }
  
  const response = await fetch(url, options);
  const data = await response.json();
  
  cache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
  
  return data;
};
```

### Backend Performance

#### Database Performance Issues
```javascript
// Monitor slow queries
mongoose.set('debug', (collectionName, methodName, ...methodArgs) => {
  const startTime = Date.now();
  
  return {
    collectionName,
    methodName,
    methodArgs,
    executionTime: Date.now() - startTime,
  };
});

// Optimize queries
const optimizedQuery = async () => {
  // Use lean() for read-only operations
  const documents = await Document.find({ user: userId })
    .select('title filename trustScore')
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
  
  // Use aggregation for complex queries
  const stats = await Document.aggregate([
    { $match: { user: userId } },
    { $group: { _id: null, total: { $sum: 1 }, avgScore: { $avg: '$trustScore' } } },
  ]);
  
  return { documents, stats };
};
```

#### Memory Leaks
```javascript
// Monitor memory usage
const monitorMemory = () => {
  const usage = process.memoryUsage();
  
  if (usage.heapUsed > 500 * 1024 * 1024) { // 500MB
    console.warn('High memory usage detected:', usage);
    
    // Force garbage collection in development
    if (global.gc) {
      global.gc();
    }
  }
};

setInterval(monitorMemory, 30000); // Every 30 seconds

// Clean up event listeners
const cleanup = () => {
  // Remove event listeners
  // Clear intervals
  // Close database connections
};

process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);
```

#### API Response Time Issues
```javascript
// Monitor API response times
const responseTimeMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    if (duration > 1000) { // 1 second
      console.warn(`Slow API response: ${req.method} ${req.path} took ${duration}ms`);
    }
    
    // Log to monitoring service
    logMetric('api_response_time', duration, {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
    });
  });
  
  next();
};
```

---

## 🌐 Network & Connectivity

### CORS Issues
```javascript
// Debug CORS issues
const corsDebug = (req, res, next) => {
  console.log('CORS Debug:');
  console.log('- Origin:', req.headers.origin);
  console.log('- Method:', req.method);
  console.log('- Headers:', req.headers);
  
  // Check if origin is allowed
  const allowedOrigins = process.env.CORS_ORIGIN.split(',');
  const isAllowed = allowedOrigins.includes(req.headers.origin);
  
  console.log('- Allowed origins:', allowedOrigins);
  console.log('- Is allowed:', isAllowed);
  
  next();
};

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGIN.split(',');
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
```

### SSL/TLS Issues
```javascript
// Debug SSL issues
const https = require('https');

const testSSL = (hostname) => {
  const options = {
    hostname,
    port: 443,
    method: 'GET',
    path: '/',
  };
  
  const req = https.request(options, (res) => {
    console.log('SSL Test Results:');
    console.log('- Status:', res.statusCode);
    console.log('- Headers:', res.headers);
  });
  
  req.on('error', (error) => {
    console.error('SSL Test Error:', error);
  });
  
  req.end();
};
```

### DNS Issues
```bash
# Test DNS resolution
nslookup api.mintellect.com
dig api.mintellect.com

# Test connectivity
ping api.mintellect.com
telnet api.mintellect.com 443

# Check SSL certificate
openssl s_client -connect api.mintellect.com:443 -servername api.mintellect.com
```

---

## 🔄 Recovery Procedures

### Service Recovery

#### Database Recovery
```javascript
// Database recovery procedure
const recoverDatabase = async () => {
  try {
    console.log('Starting database recovery...');
    
    // Check connection
    if (mongoose.connection.readyState !== 1) {
      console.log('Reconnecting to database...');
      await mongoose.connect(process.env.MONGODB_URI);
    }
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Verify indexes
    const users = await User.collection.indexes();
    console.log('User indexes:', users);
    
    console.log('Database recovery completed');
    return true;
  } catch (error) {
    console.error('Database recovery failed:', error);
    return false;
  }
};
```

#### File Service Recovery
```javascript
// Cloudinary recovery
const recoverCloudinary = async () => {
  try {
    console.log('Starting Cloudinary recovery...');
    
    const cloudinary = require('cloudinary').v2;
    
    // Test connection
    const result = await cloudinary.api.ping();
    console.log('Cloudinary ping result:', result);
    
    // Check upload preset
    const presets = await cloudinary.api.upload_presets();
    console.log('Available presets:', presets);
    
    console.log('Cloudinary recovery completed');
    return true;
  } catch (error) {
    console.error('Cloudinary recovery failed:', error);
    return false;
  }
};
```

#### Blockchain Recovery
```javascript
// Blockchain service recovery
const recoverBlockchain = async () => {
  try {
    console.log('Starting blockchain recovery...');
    
    const { ethers } = require('ethers');
    
    // Test EduChain connection
    const eduChainProvider = new ethers.providers.JsonRpcProvider(
      process.env.EDUCHAIN_RPC_URL
    );
    
    const network = await eduChainProvider.getNetwork();
    console.log('EduChain network:', network);
    
    // Test contract connection
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      contractABI,
      eduChainProvider
    );
    
    const name = await contract.name();
    console.log('Contract name:', name);
    
    console.log('Blockchain recovery completed');
    return true;
  } catch (error) {
    console.error('Blockchain recovery failed:', error);
    return false;
  }
};
```

### Data Recovery

#### Backup Restoration
```javascript
// Restore from backup
const restoreFromBackup = async (backupPath) => {
  try {
    console.log('Starting backup restoration...');
    
    const backupData = JSON.parse(await fs.readFile(backupPath, 'utf8'));
    
    for (const collection of Object.keys(backupData)) {
      console.log(`Restoring collection: ${collection}`);
      
      // Clear existing data
      await mongoose.connection.db.collection(collection).deleteMany({});
      
      // Restore data
      if (backupData[collection].length > 0) {
        await mongoose.connection.db.collection(collection).insertMany(
          backupData[collection]
        );
      }
      
      console.log(`Restored ${backupData[collection].length} documents to ${collection}`);
    }
    
    console.log('Backup restoration completed');
    return true;
  } catch (error) {
    console.error('Backup restoration failed:', error);
    return false;
  }
};
```

#### Partial Data Recovery
```javascript
// Recover specific data
const recoverUserData = async (userId) => {
  try {
    console.log(`Recovering data for user: ${userId}`);
    
    // Check user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Recover documents
    const documents = await Document.find({ user: userId });
    console.log(`Found ${documents.length} documents`);
    
    // Recover trust scores
    const trustScores = await TrustScore.find({ user: userId });
    console.log(`Found ${trustScores.length} trust scores`);
    
    // Recover workflows
    const workflows = await Workflow.find({ creator: userId });
    console.log(`Found ${workflows.length} workflows`);
    
    return {
      user,
      documents,
      trustScores,
      workflows,
    };
  } catch (error) {
    console.error('User data recovery failed:', error);
    throw error;
  }
};
```

---

*This troubleshooting guide provides comprehensive coverage of common issues and their solutions for the Mintellect project. Use these procedures to diagnose and resolve problems efficiently.* 