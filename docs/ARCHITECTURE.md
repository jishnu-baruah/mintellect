# Mintellect - System Architecture

## 🏗️ Overall System Architecture

### High-Level System Design
```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Next.js App (React 19)                                        │
│  ├── App Router (Next.js 13+)                                  │
│  ├── UI Components (shadcn/ui)                                 │
│  ├── State Management (SWR + React Hooks)                     │
│  ├── Web3 Integration (RainbowKit + Wagmi)                    │
│  └── Form Handling (React Hook Form + Zod)                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  Express.js Server                                             │
│  ├── CORS & Security Middleware                                │
│  ├── Authentication Middleware                                 │
│  ├── File Upload Handling (Multer)                             │
│  ├── Request Validation (Zod)                                  │
│  └── Error Handling & Logging                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  Business Logic Services                                       │
│  ├── User Management Service                                   │
│  ├── Document Processing Service                               │
│  ├── Trust Score Calculation Service                           │
│  ├── Plagiarism Detection Service                              │
│  ├── NFT Minting Service                                       │
│  └── Workflow Management Service                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  MongoDB (Primary Database)                                    │
│  ├── User Collections                                          │
│  ├── Document Collections                                      │
│  ├── Trust Score Collections                                   │
│  └── Workflow Collections                                      │
│                                                                │
│  Cloudinary (File Storage)                                     │
│  ├── Document Storage                                          │
│  ├── Image Processing                                          │
│  └── CDN Delivery                                              │
│                                                                │
│  Blockchain (Educhain Testnet)                                 │
│  ├── Smart Contracts (ERC-721)                                 │
│  ├── NFT Metadata                                              │
│  └── Transaction History                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Component Architecture

### Frontend Component Hierarchy
```
App (Next.js)
├── Layout Components
│   ├── RootLayout
│   ├── DashboardLayout
│   └── ClientLayout
├── Navigation Components
│   ├── Navbar
│   ├── DashboardSidebar
│   └── Breadcrumb
├── Authentication Components
│   ├── ProfileGate
│   ├── LoginButton
│   └── WalletConnectButton
├── Feature Components
│   ├── Document Management
│   │   ├── FileUpload
│   │   ├── DocumentList
│   │   └── DocumentViewer
│   ├── Workflow Components
│   │   ├── PlagiarismWorkflow
│   │   ├── HumanReviewInterface
│   │   └── WorkflowProgress
│   ├── NFT Components
│   │   ├── NFTMinting
│   │   ├── NFTGallery
│   │   └── CertificateViewer
│   └── Analytics Components
│       ├── TrustScoreGenerator
│       ├── AnalyticsDashboard
│       └── Charts
└── UI Components (shadcn/ui)
    ├── Button, Input, Card
    ├── Dialog, Modal, Toast
    ├── Form Components
    └── Animation Components
```

### Backend Service Architecture
```
Express.js Application
├── Middleware Stack
│   ├── CORS & Security (Helmet)
│   ├── Authentication (Wallet-based)
│   ├── Profile Completion Check
│   ├── Request Logging
│   └── Error Handling
├── Route Handlers
│   ├── Profile Routes (/settings/profile)
│   ├── File Routes (/api/files)
│   ├── Trust Score Routes (/api/trust-score)
│   ├── Workflow Routes (/api/workflow)
│   └── PDF Routes (/api/pdf)
├── Business Logic Services
│   ├── UserService
│   ├── DocumentService
│   ├── TrustScoreService
│   ├── WorkflowService
│   └── NFTService
└── External Service Integrations
    ├── Cloudinary (File Storage)
    ├── Plagiarism Service (Python)
    ├── Blockchain (Educhain)
    └── AI/ML Services
```

---

## 🔄 Data Flow Architecture

### User Authentication Flow
```
1. User connects wallet (MetaMask/WalletConnect)
   ↓
2. Wallet address sent to backend
   ↓
3. Backend validates wallet signature
   ↓
4. User profile created/retrieved from MongoDB
   ↓
5. Profile completion status checked
   ↓
6. Access granted/redirected to profile completion
```

### Document Upload & Processing Flow
```
1. User uploads document (PDF/DOCX)
   ↓
2. File stored in Cloudinary
   ↓
3. Document metadata saved to MongoDB
   ↓
4. Text extraction using PDF.js-extract
   ↓
5. Plagiarism detection (Python service)
   ↓
6. Trust score calculation
   ↓
7. Results stored in MongoDB
   ↓
8. User notified of completion
```

### NFT Minting Flow
```
1. User selects verified document
   ↓
2. Document metadata prepared
   ↓
3. IPFS/Arweave metadata upload
   ↓
4. Smart contract interaction (Educhain)
   ↓
5. NFT minted with metadata URI
   ↓
6. Certificate generated
   ↓
7. NFT displayed in gallery
```

---

## 🗄️ Database Architecture

### MongoDB Collections Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  walletAddress: String (unique),
  profile: {
    firstName: String,
    lastName: String,
    email: String,
    institution: String,
    researchField: String,
    bio: String,
    avatar: String (Cloudinary URL)
  },
  settings: {
    notifications: Boolean,
    privacy: Object,
    billing: Object
  },
  profileComplete: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Documents Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  title: String,
  description: String,
  fileUrl: String (Cloudinary URL),
  fileType: String,
  fileSize: Number,
  extractedText: String,
  trustScore: {
    overall: Number,
    plagiarism: Number,
    quality: Number,
    relevance: Number,
    details: Object
  },
  plagiarismReport: {
    score: Number,
    sources: Array,
    details: Object
  },
  status: String (pending/processing/completed/failed),
  nftMetadata: {
    tokenId: String,
    contractAddress: String,
    metadataUri: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Workflows Collection
```javascript
{
  _id: ObjectId,
  documentId: ObjectId (ref: Documents),
  userId: ObjectId (ref: Users),
  type: String (plagiarism/trust-score/nft-minting),
  status: String (pending/processing/completed/failed),
  steps: [{
    name: String,
    status: String,
    result: Object,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Trust Scores Collection
```javascript
{
  _id: ObjectId,
  documentId: ObjectId (ref: Documents),
  userId: ObjectId (ref: Users),
  score: {
    overall: Number,
    plagiarism: Number,
    quality: Number,
    relevance: Number,
    originality: Number
  },
  factors: {
    textQuality: Object,
    citationAccuracy: Object,
    methodology: Object,
    conclusions: Object
  },
  recommendations: Array,
  createdAt: Date
}
```

---

## 🔗 API Architecture

### RESTful API Design

#### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/verify
```

#### Profile Management
```
GET    /settings/profile/profile
POST   /settings/profile/profile
PUT    /settings/profile/profile
DELETE /settings/profile/profile
```

#### Document Management
```
GET    /api/files
POST   /api/files/upload
GET    /api/files/:fileId
PUT    /api/files/:fileId
DELETE /api/files/:fileId
POST   /api/files/:fileId/check-plagiarism
```

#### Trust Score
```
POST   /api/trust-score/generate
GET    /api/trust-score/:fileId
POST   /api/trust-score/:fileId/analyze
```

#### Workflow Management
```
GET    /api/workflow
POST   /api/workflow/archive
GET    /api/workflow/archives
POST   /api/workflow/resume
```

### API Response Format
```javascript
// Success Response
{
  success: true,
  data: Object,
  message: String,
  timestamp: Date
}

// Error Response
{
  success: false,
  error: {
    code: String,
    message: String,
    details: Object
  },
  timestamp: Date
}
```

---

## 🔐 Security Architecture

### Authentication & Authorization
```
1. Wallet-based Authentication
   ├── MetaMask Integration
   ├── WalletConnect Support
   └── RainbowKit Provider

2. Session Management
   ├── JWT Tokens (optional)
   ├── Wallet Signature Verification
   └── Session Timeout

3. Authorization
   ├── Role-based Access Control
   ├── Resource Ownership Validation
   └── API Rate Limiting
```

### Data Security
```
1. Input Validation
   ├── Zod Schema Validation
   ├── XSS Prevention
   └── SQL Injection Prevention

2. File Security
   ├── File Type Validation
   ├── File Size Limits
   ├── Virus Scanning
   └── Secure File Storage

3. Data Encryption
   ├── HTTPS/TLS
   ├── Sensitive Data Encryption
   └── Database Encryption
```

---

## 🚀 Performance Architecture

### Frontend Performance
```
1. Next.js Optimizations
   ├── Code Splitting
   ├── Image Optimization
   ├── Static Generation
   └── Incremental Static Regeneration

2. Caching Strategy
   ├── SWR for Data Fetching
   ├── Browser Caching
   ├── CDN Caching
   └── Service Worker

3. Bundle Optimization
   ├── Tree Shaking
   ├── Dynamic Imports
   ├── Bundle Analysis
   └── Compression
```

### Backend Performance
```
1. Database Optimization
   ├── Indexing Strategy
   ├── Query Optimization
   ├── Connection Pooling
   └── Read Replicas

2. Caching Layer
   ├── Redis for Sessions
   ├── Memory Caching
   ├── CDN for Static Assets
   └── API Response Caching

3. Load Balancing
   ├── Horizontal Scaling
   ├── Load Distribution
   ├── Health Checks
   └── Auto-scaling
```

---

## 🔄 Integration Architecture

### External Service Integrations

#### Cloudinary Integration
```
1. File Upload
   ├── Direct Upload
   ├── Transformations
   └── CDN Delivery

2. Image Processing
   ├── Resizing
   ├── Format Conversion
   └── Optimization
```

#### Blockchain Integration
```
1. Educhain Network
   ├── Smart Contract Deployment
   ├── Transaction Management
   └── Event Listening

2. NFT Operations
   ├── Minting
   ├── Transfer
   └── Metadata Management
```

#### AI/ML Service Integration
```
1. Plagiarism Detection
   ├── Python FastAPI Service
   ├── Text Similarity Analysis
   └── Source Detection

2. Trust Score Calculation
   ├── Multi-factor Analysis
   ├── Quality Assessment
   └── Recommendation Generation
```

---

## 📊 Monitoring & Logging Architecture

### Application Monitoring
```
1. Performance Monitoring
   ├── Response Time Tracking
   ├── Error Rate Monitoring
   ├── Resource Usage
   └── User Experience Metrics

2. Business Metrics
   ├── User Registration
   ├── Document Uploads
   ├── NFT Minting
   └── Trust Score Distribution
```

### Logging Strategy
```
1. Structured Logging
   ├── Winston Logger
   ├── Log Levels
   ├── Context Information
   └── Error Tracking

2. Log Aggregation
   ├── Centralized Logging
   ├── Log Analysis
   ├── Alerting
   └── Retention Policy
```

---

## 🔧 Development Architecture

### Development Environment
```
1. Local Development
   ├── Docker Containers
   ├── Hot Reloading
   ├── Environment Variables
   └── Database Seeding

2. Testing Strategy
   ├── Unit Tests
   ├── Integration Tests
   ├── E2E Tests
   └── Performance Tests
```

### Deployment Architecture
```
1. CI/CD Pipeline
   ├── Code Quality Checks
   ├── Automated Testing
   ├── Build Process
   └── Deployment Automation

2. Environment Management
   ├── Development
   ├── Staging
   ├── Production
   └── Feature Branches
```

---

*This architecture documentation provides a comprehensive overview of the Mintellect system design. For specific implementation details, refer to the individual component documentation.* 