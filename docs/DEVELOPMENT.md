# Mintellect - Development Guide

## 🎯 Development Guide Overview

This document provides comprehensive guidance for developers working on the Mintellect project, including local development setup, code standards, testing procedures, and debugging techniques.

### 📁 Development Guide Structure

```
Development Guide:
├── Local Development Setup
├── Code Standards & Best Practices
├── Testing Procedures
├── Debugging Guide
├── Code Review Process
└── Performance Optimization
```

---

## 🛠️ Local Development Setup

### Prerequisites

#### System Requirements
```bash
# Minimum System Requirements
- Node.js 18.0.0 or higher
- Python 3.9 or higher
- Git 2.30 or higher
- MongoDB 5.0 or higher
- Docker (optional, for containerized development)
```

#### Required Software
```bash
# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python and pip
sudo apt-get update
sudo apt-get install python3 python3-pip

# Install Git
sudo apt-get install git

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### Project Setup

#### 1. Clone Repository
```bash
# Clone the main repository
git clone https://github.com/your-org/mintellect.git
cd mintellect

# Initialize submodules (if any)
git submodule update --init --recursive
```

#### 2. Frontend Setup (client/)
```bash
# Navigate to frontend directory
cd client

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

#### 3. Backend Setup (server/)
```bash
# Navigate to backend directory
cd server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
# or
yarn dev
```

#### 4. Plagiarism Service Setup (plagiarismSearch/)
```bash
# Navigate to plagiarism service directory
cd plagiarismSearch

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
# or
uv sync

# Start the service
python server.py
```

#### 5. Smart Contracts Setup (client/contracts/)
```bash
# Navigate to contracts directory
cd client/contracts

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### Development Environment Configuration

#### VS Code Setup
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

#### Recommended Extensions
```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-git",
    "ms-vscode.vscode-docker"
  ]
}
```

### Database Setup

#### MongoDB Local Setup
```bash
# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongosh
use mintellect
db.createUser({
  user: "mintellect_user",
  pwd: "your_password",
  roles: ["readWrite"]
})
```

#### MongoDB Atlas (Cloud)
```bash
# Get connection string from MongoDB Atlas
# Add to .env file
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mintellect
```

### External Services Setup

#### Cloudinary
```bash
# Sign up at https://cloudinary.com/
# Get credentials and add to .env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### WalletConnect
```bash
# Sign up at https://cloud.walletconnect.com/
# Get project ID and add to .env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

#### PlagiarismSearch API
```bash
# Sign up for PlagiarismSearch API
# Get API key and add to .env
PLAGIARISMSEARCH_API_KEY=your_api_key
```

---

## 📝 Code Standards & Best Practices

### Frontend Standards

#### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "@typescript-eslint/recommended",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-template": "error",
  },
  ignorePatterns: ["node_modules/", ".next/", "out/"],
};
```

#### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### Backend Standards

#### ESLint Configuration
```javascript
// server/.eslintrc.js
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error",
  },
};
```

#### Code Organization
```bash
# Backend directory structure
server/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── app.js           # Main application file
├── tests/               # Test files
├── docs/                # API documentation
└── scripts/             # Build and deployment scripts
```

### Naming Conventions

#### File Naming
```bash
# React Components
PascalCase.tsx          # ComponentName.tsx
kebab-case.tsx          # component-name.tsx (for pages)

# Utilities and Hooks
camelCase.ts            # useWallet.ts, utils.ts
kebab-case.ts           # api-client.ts

# Constants and Types
PascalCase.ts           # Types.ts, Constants.ts
UPPER_SNAKE_CASE.ts     # API_ENDPOINTS.ts
```

#### Variable Naming
```typescript
// Variables and functions
const userName = "John";
const isAuthenticated = true;
const handleSubmit = () => {};

// Constants
const API_BASE_URL = "https://api.mintellect.com";
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Types and interfaces
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

type AuthStatus = "authenticated" | "unauthenticated" | "loading";
```

### Code Documentation

#### JSDoc Comments
```typescript
/**
 * Calculates the trust score for a document based on multiple factors
 * @param documentId - The unique identifier of the document
 * @param userId - The unique identifier of the user
 * @param options - Optional configuration for the calculation
 * @returns Promise<TrustScore> - The calculated trust score
 * @throws {Error} When document or user is not found
 * @example
 * const trustScore = await calculateTrustScore("doc123", "user456", {
 *   includePlagiarism: true,
 *   includeAIDetection: true
 * });
 */
async function calculateTrustScore(
  documentId: string,
  userId: string,
  options?: TrustScoreOptions
): Promise<TrustScore> {
  // Implementation
}
```

#### README Files
```markdown
# Component/Module Name

Brief description of what this component/module does.

## Usage

```typescript
import { ComponentName } from './ComponentName';

<ComponentName prop1="value" prop2={value} />
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| prop1 | string | Yes | - | Description of prop1 |
| prop2 | number | No | 0 | Description of prop2 |

## Examples

### Basic Usage
```typescript
<ComponentName title="Hello World" />
```

### Advanced Usage
```typescript
<ComponentName 
  title="Hello World"
  count={42}
  onAction={handleAction}
/>
```
```

---

## 🧪 Testing Procedures

### Frontend Testing

#### Unit Testing with Jest
```typescript
// __tests__/components/TrustScoreGenerator.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TrustScoreGenerator } from '@/components/TrustScoreGenerator';

describe('TrustScoreGenerator', () => {
  it('renders upload button', () => {
    render(<TrustScoreGenerator />);
    expect(screen.getByText('Upload Document')).toBeInTheDocument();
  });

  it('handles file upload', async () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    render(<TrustScoreGenerator />);
    
    const fileInput = screen.getByLabelText(/upload file/i);
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    
    await waitFor(() => {
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
  });

  it('displays trust score after processing', async () => {
    render(<TrustScoreGenerator />);
    
    // Mock API response
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ trustScore: 85, confidence: 0.9 }),
    } as Response);
    
    // Trigger processing
    const processButton = screen.getByText('Generate Trust Score');
    fireEvent.click(processButton);
    
    await waitFor(() => {
      expect(screen.getByText('85')).toBeInTheDocument();
    });
  });
});
```

#### Integration Testing
```typescript
// __tests__/integration/document-upload.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentUpload } from '@/components/DocumentUpload';
import { TrustScoreDisplay } from '@/components/TrustScoreDisplay';

describe('Document Upload Integration', () => {
  it('uploads document and displays trust score', async () => {
    render(
      <div>
        <DocumentUpload />
        <TrustScoreDisplay />
      </div>
    );
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const uploadInput = screen.getByLabelText(/upload file/i);
    
    fireEvent.change(uploadInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText(/trust score/i)).toBeInTheDocument();
    });
  });
});
```

#### E2E Testing with Playwright
```typescript
// tests/e2e/document-upload.spec.ts
import { test, expect } from '@playwright/test';

test('document upload and trust score generation', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Upload document
  await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample.pdf');
  await page.click('button:has-text("Upload")');
  
  // Wait for processing
  await page.waitForSelector('text=Processing...');
  await page.waitForSelector('text=Trust Score:', { timeout: 30000 });
  
  // Verify trust score display
  const trustScore = await page.locator('[data-testid="trust-score"]').textContent();
  expect(parseInt(trustScore)).toBeGreaterThan(0);
  expect(parseInt(trustScore)).toBeLessThanOrEqual(100);
});
```

### Backend Testing

#### Unit Testing
```javascript
// tests/services/trustScoreCalculator.test.js
const TrustScoreCalculator = require('../../src/services/trustScoreCalculator');
const Document = require('../../src/models/document.model');
const User = require('../../src/models/user.model');

describe('TrustScoreCalculator', () => {
  beforeEach(() => {
    // Setup test database
    jest.clearAllMocks();
  });

  describe('calculateTrustScore', () => {
    it('should calculate trust score for valid document', async () => {
      const mockDocument = {
        _id: 'doc123',
        content: 'Sample academic content',
        metadata: { title: 'Test Document' }
      };
      
      const mockUser = {
        _id: 'user123',
        canPerformAction: jest.fn().mockReturnValue(true)
      };
      
      jest.spyOn(Document, 'findById').mockResolvedValue(mockDocument);
      jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
      
      const result = await TrustScoreCalculator.calculateTrustScore('doc123', 'user123');
      
      expect(result).toBeDefined();
      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should throw error for non-existent document', async () => {
      jest.spyOn(Document, 'findById').mockResolvedValue(null);
      
      await expect(
        TrustScoreCalculator.calculateTrustScore('nonexistent', 'user123')
      ).rejects.toThrow('Document not found');
    });
  });
});
```

#### API Testing
```javascript
// tests/api/trust-score.test.js
const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');

describe('Trust Score API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/trust-score/generate', () => {
    it('should generate trust score for valid request', async () => {
      const response = await request(app)
        .post('/api/trust-score/generate')
        .send({
          documentId: 'test-doc-id',
          options: {
            includePlagiarism: true,
            includeAIDetection: true
          }
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.trustScore).toBeDefined();
    });

    it('should return 400 for missing documentId', async () => {
      await request(app)
        .post('/api/trust-score/generate')
        .send({})
        .expect(400);
    });
  });
});
```

### Test Configuration

#### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

#### Playwright Configuration
```javascript
// playwright.config.js
module.exports = {
  testDir: './tests/e2e',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
};
```

---

## 🐛 Debugging Guide

### Frontend Debugging

#### React Developer Tools
```typescript
// Enable React DevTools
// Install browser extension and use in development

// Debug component state
const [state, setState] = useState(initialState);
console.log('Component state:', state);

// Debug props
const MyComponent = (props) => {
  console.log('Component props:', props);
  return <div>...</div>;
};
```

#### Redux DevTools (if using Redux)
```typescript
// Configure Redux DevTools
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});
```

#### Network Debugging
```typescript
// Debug API calls
const fetchData = async () => {
  try {
    console.log('Making API call to:', endpoint);
    const response = await fetch(endpoint);
    console.log('API response:', response);
    const data = await response.json();
    console.log('API data:', data);
    return data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};
```

### Backend Debugging

#### Logging
```javascript
// server/src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

#### Debug Middleware
```javascript
// server/src/middleware/debug.js
const debugMiddleware = (req, res, next) => {
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

module.exports = debugMiddleware;
```

#### Database Debugging
```javascript
// Enable MongoDB query logging
mongoose.set('debug', process.env.NODE_ENV === 'development');

// Debug specific queries
const users = await User.find({}).lean();
console.log('Users query result:', users);
```

### Common Issues and Solutions

#### Frontend Issues

##### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

##### TypeScript Errors
```typescript
// Add type assertions when needed
const data = response.data as ApiResponse;

// Use optional chaining
const userName = user?.profile?.name;

// Add proper type definitions
interface ApiResponse {
  data: any;
  status: number;
}
```

##### Styling Issues
```css
/* Debug Tailwind CSS classes */
/* Add border to see element boundaries */
.debug {
  border: 1px solid red;
}

/* Check if classes are being applied */
.element {
  @apply bg-blue-500 text-white;
}
```

#### Backend Issues

##### Database Connection
```javascript
// Check MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
```

##### API Errors
```javascript
// Add error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
});
```

##### Environment Variables
```javascript
// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

---

## 🔍 Code Review Process

### Review Checklist

#### Frontend Review
- [ ] **Code Quality**
  - [ ] TypeScript types are properly defined
  - [ ] No unused imports or variables
  - [ ] Proper error handling
  - [ ] Consistent naming conventions

- [ ] **Performance**
  - [ ] No unnecessary re-renders
  - [ ] Proper use of React hooks
  - [ ] Optimized bundle size
  - [ ] Lazy loading where appropriate

- [ ] **Accessibility**
  - [ ] Proper ARIA labels
  - [ ] Keyboard navigation support
  - [ ] Color contrast compliance
  - [ ] Screen reader compatibility

- [ ] **Testing**
  - [ ] Unit tests for new components
  - [ ] Integration tests for new features
  - [ ] Test coverage meets requirements
  - [ ] Tests are meaningful and not just for coverage

#### Backend Review
- [ ] **Code Quality**
  - [ ] Proper error handling
  - [ ] Input validation
  - [ ] Security considerations
  - [ ] Database query optimization

- [ ] **API Design**
  - [ ] RESTful conventions
  - [ ] Proper HTTP status codes
  - [ ] Consistent response format
  - [ ] API documentation updated

- [ ] **Security**
  - [ ] Authentication/authorization
  - [ ] Input sanitization
  - [ ] Rate limiting
  - [ ] CORS configuration

- [ ] **Testing**
  - [ ] Unit tests for new services
  - [ ] API endpoint tests
  - [ ] Database integration tests
  - [ ] Error scenario testing

### Review Process

#### 1. Pull Request Creation
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

#### 2. Review Request
```markdown
## Pull Request Description

### Changes Made
- List of changes
- New features added
- Bugs fixed

### Testing
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manual testing completed

### Screenshots (if applicable)
- Add screenshots for UI changes

### Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No console errors
```

#### 3. Review Comments
```markdown
## Review Comments

### Positive Feedback
- Good use of TypeScript types
- Clean component structure
- Proper error handling

### Suggestions for Improvement
- Consider extracting this logic to a custom hook
- Add more specific error messages
- Consider adding loading states

### Questions
- Why was this approach chosen over alternatives?
- How does this handle edge cases?
- What's the performance impact?
```

---

## ⚡ Performance Optimization

### Frontend Optimization

#### Bundle Optimization
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};
```

#### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority={true}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

#### Code Splitting
```typescript
// Lazy load components
import dynamic from 'next/dynamic';

const TrustScoreGenerator = dynamic(() => import('./TrustScoreGenerator'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});
```

### Backend Optimization

#### Database Optimization
```javascript
// Add indexes for frequently queried fields
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
});

// Use lean queries for read-only operations
const users = await User.find({}).lean();

// Implement pagination
const users = await User.find({})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();
```

#### Caching
```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient();

const getCachedData = async (key) => {
  const cached = await client.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const data = await fetchDataFromDatabase();
  await client.setex(key, 3600, JSON.stringify(data));
  return data;
};
```

#### API Optimization
```javascript
// Implement response compression
const compression = require('compression');
app.use(compression());

// Add caching headers
app.get('/api/documents', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300');
  // ... rest of handler
});
```

---

*This development guide provides comprehensive coverage of development practices for the Mintellect project. Follow these guidelines to ensure code quality, maintainability, and performance.* 