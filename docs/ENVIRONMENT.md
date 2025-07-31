# Mintellect - Environment Setup Documentation

## 🎯 Environment Overview

This document provides comprehensive setup instructions for the Mintellect development environment, including all required dependencies, configuration files, and deployment procedures.

### 🏗️ System Requirements

#### Minimum Requirements
- **Node.js**: 18.0.0 or higher
- **Python**: 3.8.0 or higher
- **Git**: 2.30.0 or higher
- **Docker**: 20.10.0 or higher (optional)
- **Memory**: 8GB RAM minimum, 16GB recommended
- **Storage**: 10GB free space

#### Recommended Requirements
- **Node.js**: 20.0.0 or higher
- **Python**: 3.11.0 or higher
- **Git**: 2.40.0 or higher
- **Docker**: 24.0.0 or higher
- **Memory**: 16GB RAM
- **Storage**: 20GB free space
- **OS**: Ubuntu 22.04, macOS 13.0+, Windows 11

---

## 📦 Installation Guide

### 1. Prerequisites Installation

#### Node.js Installation
```bash
# Using Node Version Manager (nvm) - Recommended
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Or using package manager
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node@20

# Windows
# Download from https://nodejs.org/
```

#### Python Installation
```bash
# Using pyenv - Recommended
curl https://pyenv.run | bash
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
source ~/.bashrc
pyenv install 3.11.0
pyenv global 3.11.0

# Or using package manager
# Ubuntu/Debian
sudo apt update
sudo apt install python3.11 python3.11-venv python3.11-pip

# macOS
brew install python@3.11

# Windows
# Download from https://www.python.org/
```

#### Git Installation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install git

# macOS
brew install git

# Windows
# Download from https://git-scm.com/
```

### 2. Project Setup

#### Clone Repository
```bash
git clone https://github.com/your-org/mintellect.git
cd mintellect
```

#### Install Frontend Dependencies
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Verify installation
npm run build
```

#### Install Backend Dependencies
```bash
# Navigate to server directory
cd ../server

# Install dependencies
npm install

# Verify installation
npm run dev
```

#### Install Plagiarism Service Dependencies
```bash
# Navigate to plagiarism service directory
cd ../plagiarismSearch

# Install Python dependencies
pip install -r requirements.txt
# or using UV
uv pip install -r requirements.txt

# Verify installation
python -c "import fastapi; print('FastAPI installed successfully')"
```

#### Install Smart Contract Dependencies
```bash
# Navigate to contracts directory
cd ../client/contracts

# Install dependencies
npm install

# Verify installation
npx hardhat compile
```

---

## 🔧 Environment Configuration

### 1. Environment Variables

#### Frontend Environment (client/.env.local)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_PLAGIARISM_SERVICE_URL=http://localhost:8000

# Web3 Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0x85ab510c1d219e207916a8c8a36a33ce56f3ef6e

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=656476
NEXT_PUBLIC_RPC_URL=https://rpc.open-campus-codex.gelato.digital

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
```

#### Backend Environment (server/.env)
```bash
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mintellect
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/mintellect

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Services Configuration
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Plagiarism Service Environment (plagiarismSearch/.env)
```bash
# PlagiarismSearch API Configuration
PLAGIARISMSEARCH_API_KEY=your_plagiarismsearch_api_key

# Server Configuration
HOST=0.0.0.0
PORT=8000

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:5001

# Logging Configuration
LOG_LEVEL=INFO
LOG_FILE=logs/plagiarism_service.log

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
```

#### Smart Contracts Environment (client/contracts/.env)
```bash
# Deployment Configuration
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key

# Network Configuration
EDUCHAIN_RPC_URL=https://rpc.open-campus-codex.gelato.digital
EDUCHAIN_CHAIN_ID=656476

# Gas Configuration
GAS_LIMIT=5000000
GAS_PRICE=20000000000
```

### 2. Configuration Files

#### Next.js Configuration (client/next.config.mjs)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  images: {
    domains: ['cloudinary.com', 'res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

#### TailwindCSS Configuration (client/tailwind.config.ts)
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mintellect: {
          primary: "#00D4FF",
          secondary: "#FF6B6B",
          accent: "#4ECDC4",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: "hsl(var(--chart-1))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

#### Hardhat Configuration (client/contracts/hardhat.config.js)
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    educhain: {
      url: process.env.EDUCHAIN_RPC_URL || "https://rpc.open-campus-codex.gelato.digital",
      chainId: parseInt(process.env.EDUCHAIN_CHAIN_ID || "656476"),
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: parseInt(process.env.GAS_PRICE || "20000000000"),
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};
```

---

## 🚀 Development Setup

### 1. Local Development

#### Start All Services
```bash
# Terminal 1: Start Frontend
cd client
npm run dev

# Terminal 2: Start Backend
cd server
npm run dev

# Terminal 3: Start Plagiarism Service
cd plagiarismSearch
uvicorn server:app --reload --host 0.0.0.0 --port 8000

# Terminal 4: Start Local Blockchain (optional)
cd client/contracts
npx hardhat node
```

#### Development Scripts
```bash
# Frontend scripts (client/package.json)
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check

# Backend scripts (server/package.json)
npm run dev          # Start development server
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests

# Contract scripts (client/contracts/package.json)
npx hardhat compile  # Compile contracts
npx hardhat test     # Run tests
npx hardhat node     # Start local blockchain
npx hardhat run scripts/deploy.js --network educhain
```

### 2. Database Setup

#### MongoDB Setup
```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt update
sudo apt install mongodb

# macOS
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongosh
use mintellect
db.createUser({
  user: "mintellect_user",
  pwd: "secure_password",
  roles: ["readWrite"]
})
```

#### MongoDB Atlas (Cloud)
```bash
# 1. Create MongoDB Atlas account
# 2. Create new cluster
# 3. Get connection string
# 4. Update MONGODB_URI in server/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mintellect
```

### 3. External Services Setup

#### Cloudinary Setup
```bash
# 1. Create Cloudinary account
# 2. Get credentials from dashboard
# 3. Update environment variables

# Frontend (.env.local)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Backend (.env)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### PlagiarismSearch Setup
```bash
# 1. Create PlagiarismSearch account
# 2. Get API key from dashboard
# 3. Update environment variable

# Plagiarism service (.env)
PLAGIARISMSEARCH_API_KEY=your_api_key_here
```

#### WalletConnect Setup
```bash
# 1. Create WalletConnect account
# 2. Create new project
# 3. Get project ID
# 4. Update environment variable

# Frontend (.env.local)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

---

## 🐳 Docker Setup

### 1. Docker Compose Configuration

#### docker-compose.yml
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5001
      - NEXT_PUBLIC_PLAGIARISM_SERVICE_URL=http://plagiarism-service:8000
    depends_on:
      - backend
    volumes:
      - ./client:/app
      - /app/node_modules
    networks:
      - mintellect-network

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "5001:5001"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/mintellect
      - NODE_ENV=development
    depends_on:
      - mongodb
      - plagiarism-service
    volumes:
      - ./server:/app
      - /app/node_modules
    networks:
      - mintellect-network

  plagiarism-service:
    build:
      context: ./plagiarismSearch
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - PLAGIARISMSEARCH_API_KEY=${PLAGIARISMSEARCH_API_KEY}
    volumes:
      - ./plagiarismSearch:/app
    networks:
      - mintellect-network

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
      - MONGO_INITDB_DATABASE=mintellect
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    networks:
      - mintellect-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - mintellect-network

volumes:
  mongodb_data:
  redis_data:

networks:
  mintellect-network:
    driver: bridge
```

#### Frontend Dockerfile (client/Dockerfile)
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start application
CMD ["pnpm", "start"]
```

#### Backend Dockerfile (server/Dockerfile)
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5001

# Start application
CMD ["npm", "start"]
```

#### Plagiarism Service Dockerfile (plagiarismSearch/Dockerfile)
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 8000

# Start application
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v

# Rebuild specific service
docker-compose up --build frontend

# Access service shell
docker-compose exec backend sh
docker-compose exec mongodb mongosh
```

---

## 🔧 Development Tools

### 1. Code Quality Tools

#### ESLint Configuration (client/.eslintrc.json)
```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "prefer-const": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

#### Prettier Configuration (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

#### TypeScript Configuration (client/tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
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

### 2. Git Configuration

#### .gitignore
```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
logs/
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Hardhat
cache/
artifacts/
typechain/
typechain-types/

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
env.bak/
venv.bak/
```

#### Git Hooks (.husky/pre-commit)
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm run test
```

---

## 🚀 Production Deployment

### 1. Vercel Deployment (Frontend)

#### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID": "@walletconnect-project-id",
    "NEXT_PUBLIC_CONTRACT_ADDRESS": "@contract-address"
  }
}
```

#### Deployment Commands
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### 2. Railway Deployment (Backend)

#### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Environment Variables (Railway Dashboard)
```bash
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GEMINI_API_KEY=...
JWT_SECRET=...
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### 3. Render Deployment (Plagiarism Service)

#### render.yaml
```yaml
services:
  - type: web
    name: mintellect-plagiarism-service
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn server:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PLAGIARISMSEARCH_API_KEY
        value: your_api_key_here
      - key: HOST
        value: 0.0.0.0
      - key: PORT
        value: 8000
```

---

## 🔍 Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using a port
lsof -i :3000
lsof -i :5001
lsof -i :8000

# Kill process using port
kill -9 <PID>
```

#### Node.js Version Issues
```bash
# Check Node.js version
node --version

# Switch Node.js version
nvm use 20
nvm alias default 20
```

#### Python Environment Issues
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

#### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check MongoDB logs
sudo journalctl -u mongod
```

#### Contract Deployment Issues
```bash
# Check network configuration
npx hardhat console --network educhain

# Verify contract deployment
npx hardhat verify --network educhain <CONTRACT_ADDRESS>

# Check gas prices
npx hardhat run scripts/check-gas.js --network educhain
```

### Performance Optimization

#### Frontend Optimization
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Optimize images
npm run optimize-images

# Check performance
npm run lighthouse
```

#### Backend Optimization
```bash
# Monitor memory usage
node --inspect server.js

# Profile performance
npm run profile

# Check database queries
npm run db:analyze
```

---

## 📊 Monitoring & Logging

### 1. Application Monitoring

#### Health Check Endpoints
```bash
# Frontend health check
curl https://your-frontend.vercel.app/api/health

# Backend health check
curl https://your-backend.railway.app/health

# Plagiarism service health check
curl https://your-plagiarism-service.render.com/healthz
```

#### Logging Configuration
```javascript
// server/src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'mintellect-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### 2. Error Tracking

#### Sentry Integration
```javascript
// client/sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
});
```

---

*This environment setup documentation provides comprehensive instructions for setting up the Mintellect development environment. For specific implementation details, refer to the individual configuration files.* 