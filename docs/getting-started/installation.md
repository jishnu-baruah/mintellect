# Installation Guide

This guide provides detailed installation instructions for different deployment scenarios and user types.

## 🎯 Installation Options

### For End Users
- **Web Platform**: No installation required - use directly in browser
- **Mobile App**: Download from app stores (coming soon)
- **Browser Extension**: Chrome/Firefox extension for quick access

### For Developers
- **Local Development**: Set up development environment
- **Docker Deployment**: Containerized installation
- **Cloud Deployment**: Deploy to cloud platforms

### For Institutions
- **Self-Hosted**: On-premises installation
- **Private Cloud**: Private cloud deployment
- **Hybrid Setup**: Combination of cloud and on-premises

## 🌐 Web Platform (No Installation Required)

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- JavaScript enabled

### Access Steps
1. **Visit Platform**: Navigate to [mintellect.com](https://mintellect.com)
2. **Create Account**: Sign up with email and password
3. **Verify Email**: Click verification link in email
4. **Start Using**: Begin uploading and verifying documents

### Browser Compatibility
```bash
# Supported browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+
```

## 📱 Mobile App Installation

### iOS App
```bash
# Installation steps
1. Open App Store
2. Search "Mintellect"
3. Tap "Get" or "Install"
4. Authenticate with Face ID/Touch ID
5. Launch app and sign in
```

### Android App
```bash
# Installation steps
1. Open Google Play Store
2. Search "Mintellect"
3. Tap "Install"
4. Grant necessary permissions
5. Launch app and sign in
```

### App Features
- **Document Upload**: Camera and file picker integration
- **Offline Mode**: Basic functionality without internet
- **Push Notifications**: Real-time updates and alerts
- **Biometric Auth**: Secure login with fingerprint/face

## 🔧 Browser Extension

### Chrome Extension
```bash
# Installation
1. Visit Chrome Web Store
2. Search "Mintellect"
3. Click "Add to Chrome"
4. Confirm installation
5. Pin extension to toolbar
```

### Firefox Extension
```bash
# Installation
1. Visit Firefox Add-ons
2. Search "Mintellect"
3. Click "Add to Firefox"
4. Confirm installation
5. Pin extension to toolbar
```

### Extension Features
- **Quick Upload**: Right-click to upload documents
- **Page Integration**: Verify content from web pages
- **Notifications**: Browser notifications for updates
- **Shortcuts**: Keyboard shortcuts for common actions

## 💻 Local Development Setup

### Prerequisites
```bash
# Required software
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+
- Git 2.30+
- MongoDB 6.0+
- Python 3.9+ (for plagiarism service)
```

### Frontend Setup
```bash
# Clone repository
git clone https://github.com/your-org/mintellect.git
cd mintellect/client

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
# or
yarn dev
```

### Backend Setup
```bash
# Navigate to server directory
cd ../server

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Plagiarism Service Setup
```bash
# Navigate to plagiarism service
cd ../plagiarismSearch

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
# or
uv sync

# Start service
python server.py
```

### Smart Contracts Setup
```bash
# Navigate to contracts directory
cd ../client/contracts

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

## 🐳 Docker Deployment

### Prerequisites
```bash
# Required software
- Docker 20.10+
- Docker Compose 2.0+
- Git 2.30+
```

### Quick Start with Docker Compose
```bash
# Clone repository
git clone https://github.com/your-org/mintellect.git
cd mintellect

# Create environment file
cp docker-compose.env.example docker-compose.env
# Edit docker-compose.env with your configuration

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

### Individual Service Deployment
```bash
# Frontend only
docker run -d \
  --name mintellect-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:5000 \
  mintellect/frontend:latest

# Backend only
docker run -d \
  --name mintellect-backend \
  -p 5000:5000 \
  -e MONGODB_URI=mongodb://localhost:27017/mintellect \
  mintellect/backend:latest

# Plagiarism service only
docker run -d \
  --name mintellect-plagiarism \
  -p 8000:8000 \
  -e PLAGIARISM_API_KEY=your_api_key \
  mintellect/plagiarism:latest
```

### Docker Compose Configuration
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    image: mintellect/frontend:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000
    depends_on:
      - backend

  backend:
    image: mintellect/backend:latest
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/mintellect
      - JWT_SECRET=your_jwt_secret
    depends_on:
      - mongo
      - plagiarism

  plagiarism:
    image: mintellect/plagiarism:latest
    ports:
      - "8000:8000"
    environment:
      - PLAGIARISM_API_KEY=your_api_key

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## ☁️ Cloud Deployment

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd client
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
```

### Railway (Backend)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Deploy backend
cd server
railway init
railway up

# Set environment variables
railway variables set MONGODB_URI=your_mongodb_uri
railway variables set JWT_SECRET=your_jwt_secret
```

### Render (Plagiarism Service)
```bash
# Connect GitHub repository
1. Go to render.com
2. Connect your GitHub account
3. Select mintellect repository
4. Configure build settings
5. Deploy service
```

### AWS Deployment
```bash
# Using AWS CLI
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com

# Build and push images
docker build -t mintellect-frontend .
docker tag mintellect-frontend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/mintellect-frontend:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/mintellect-frontend:latest

# Deploy with ECS
aws ecs create-service --cluster mintellect --service-name frontend --task-definition frontend:1
```

## 🏢 Institutional Deployment

### Self-Hosted Installation
```bash
# System requirements
- Ubuntu 20.04+ or CentOS 8+
- 8GB RAM minimum (16GB recommended)
- 100GB storage
- SSL certificate
- Domain name

# Installation script
curl -fsSL https://install.mintellect.com | bash

# Configuration
sudo mintellect configure
sudo mintellect start
```

### Private Cloud Setup
```bash
# Kubernetes deployment
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

### Hybrid Configuration
```bash
# On-premises components
- Database (MongoDB)
- File storage
- Authentication service

# Cloud components
- Frontend hosting
- AI services
- CDN
- Analytics
```

## 🔐 Security Configuration

### SSL/TLS Setup
```bash
# Let's Encrypt (recommended)
sudo apt install certbot
sudo certbot --nginx -d your-domain.com

# Self-signed certificate (development)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout private.key -out certificate.crt
```

### Environment Variables
```bash
# Required variables
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/mintellect
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_URL=cloudinary://your_cloudinary_url
PLAGIARISM_API_KEY=your_plagiarism_api_key

# Optional variables
REDIS_URL=redis://localhost:6379
SENTRY_DSN=your_sentry_dsn
STRIPE_SECRET_KEY=your_stripe_secret
```

### Firewall Configuration
```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# iptables (CentOS)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

## 📊 Monitoring & Logging

### Health Checks
```bash
# Frontend health check
curl -f http://localhost:3000/api/health

# Backend health check
curl -f http://localhost:5000/api/health

# Plagiarism service health check
curl -f http://localhost:8000/health
```

### Logging Configuration
```bash
# Winston logging (backend)
npm install winston
npm install winston-daily-rotate-file

# Log rotation
{
  "maxSize": "20m",
  "maxFiles": "14d",
  "datePattern": "YYYY-MM-DD"
}
```

### Monitoring Tools
```bash
# Prometheus metrics
npm install prom-client

# Grafana dashboards
# Import dashboard templates from /monitoring/grafana/

# Alerting
# Configure alerts in /monitoring/alerts/
```

## 🚨 Troubleshooting

### Common Issues
```bash
# Port conflicts
sudo lsof -i :3000
sudo kill -9 <PID>

# Permission issues
sudo chown -R $USER:$USER /path/to/mintellect
chmod +x /path/to/mintellect/scripts/*

# Database connection
mongo --host localhost --port 27017
use mintellect
db.stats()
```

### Debug Mode
```bash
# Frontend debug
DEBUG=* npm run dev

# Backend debug
NODE_ENV=development DEBUG=* npm run dev

# Plagiarism service debug
python -u server.py --debug
```

### Log Analysis
```bash
# View logs
tail -f logs/app.log

# Search logs
grep "ERROR" logs/app.log

# Log analysis tools
npm install -g log-analyzer
log-analyzer logs/app.log
```

## 📚 Additional Resources

### Documentation
- [Architecture Overview](architecture-overview.md)
- [API Reference](../backend/api-reference.md)
- [Deployment Guide](../deployment/production.md)
- [Troubleshooting Guide](../troubleshooting/common-issues.md)

### Support
- [Installation FAQ](../troubleshooting/faq.md#installation)
- [Community Forum](https://community.mintellect.com)
- [Technical Support](mailto:support@mintellect.com)
- [Enterprise Support](mailto:enterprise@mintellect.com)

---

**Need help with installation?** Contact our support team or check our [Troubleshooting Guide](../troubleshooting/common-issues.md) for common installation issues. 