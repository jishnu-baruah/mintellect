# Research Paper Eligibility Scoring System - Backend

A Node.js backend for analyzing research papers and calculating eligibility scores based on various criteria.

## Features

- PDF upload and parsing
- AI-powered analysis of research papers using Gemini 2.5 Flash
- Calculation of eligibility scores based on methodology, originality, formatting, etc.
- Plagiarism detection and analysis
- Trust score generation with detailed breakdowns
- RESTful API for integration with frontend applications

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for user data storage)
- Gemini API key (for AI analysis)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/mintellect

   # JWT Configuration
   JWT_SECRET=your-jwt-secret-key-here
   JWT_REFRESH_SECRET=your-jwt-refresh-secret-key-here

   # Cloudinary Configuration (for avatar uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Gemini API Configuration (for trust score analysis)
   GEMINI_API_KEY=your-gemini-api-key-here

   # PlagiarismSearch API Configuration
   PLAGIARISM_API_KEY=your-plagiarism-api-key-here
   PLAGIARISM_API_URL=https://api.plagiarismsearch.com

   # AWS S3 Configuration (for file storage)
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-s3-bucket-name
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Trust Score Endpoints

#### POST /api/trust-score/generate
Generate trust score for a document using Gemini 2.5 Flash analysis.

**Request Body:**
```json
{
  "textContent": "Document text content...",
  "plagiarismResults": {
    "plagiarism": {
      "overall_score": 15
    }
  },
  "fileId": "file-id-here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trustScore": 85,
    "plagiarismScore": 90,
    "aiAnalysis": {
      "aiProbability": 0.15,
      "humanWrittenProbability": 0.85,
      "academicQuality": 0.8,
      "methodologyScore": 0.75,
      "citationQuality": 0.7,
      "originalityScore": 0.85,
      "confidence": 0.8,
      "classification": "human-written",
      "analysis": "Document appears to be human-written with good academic quality.",
      "flags": [],
      "recommendations": ["Consider minor improvements to methodology section"]
    },
    "breakdown": {
      "overall": {
        "score": 0.85,
        "level": "High",
        "confidence": 0.8
      },
      "components": {
        "plagiarism": {
          "score": 0.9,
          "weight": 0.35,
          "contribution": 0.315,
          "description": "Originality and uniqueness assessment"
        },
        "aiDetection": {
          "score": 0.85,
          "weight": 0.25,
          "contribution": 0.2125,
          "description": "AI-generated content detection"
        },
        "academicQuality": {
          "score": 0.8,
          "weight": 0.20,
          "contribution": 0.16,
          "description": "Academic writing quality assessment"
        },
        "methodology": {
          "score": 0.75,
          "weight": 0.15,
          "contribution": 0.1125,
          "description": "Research methodology evaluation"
        },
        "citations": {
          "score": 0.7,
          "weight": 0.05,
          "contribution": 0.035,
          "description": "Citation and reference quality"
        }
      }
    },
    "recommendations": [
      "Document appears ready for publication",
      "Maintain current quality standards",
      "Consider minor improvements to methodology section"
    ],
    "timestamp": "2024-01-01T00:00:00.000Z",
    "fileId": "file-id-here"
  }
}
```

#### GET /api/trust-score/:fileId
Get trust score for a specific file.

#### POST /api/trust-score/:fileId/analyze
Analyze a file and generate trust score.

### File Management Endpoints

#### POST /api/files/upload
Upload a file (ZIP, PDF, TXT, LaTeX, or BibTeX).

#### GET /api/files
Get list of user's files with pagination.

#### GET /api/files/:fileId
Get file details.

#### POST /api/files/:fileId/check-plagiarism
Check plagiarism for a file.

#### GET /api/files/:fileId/check-status
Get plagiarism check status.

#### GET /api/files/:fileId/plagiarism-results
Get plagiarism results for a file.

#### GET /api/files/:fileId/trust-score
Get trust score for a file.

#### DELETE /api/files/:fileId
Delete a file.

### Profile Endpoints

#### GET /settings/profile/profile
Get user profile by wallet address.

#### POST /settings/profile/profile
Create or update user profile.

#### GET /settings/profile/requirements
Get profile requirements checklist.

## Trust Score Calculation

The trust score is calculated using a weighted combination of multiple factors:

1. **Plagiarism Detection (35%)**: Originality and uniqueness assessment
2. **AI Detection (25%)**: AI-generated content detection using Gemini 2.5 Flash
3. **Academic Quality (20%)**: Academic writing quality assessment
4. **Methodology (15%)**: Research methodology evaluation
5. **Citations (5%)**: Citation and reference quality

### Gemini 2.5 Flash Integration

The system uses Google's Gemini 2.5 Flash model for AI analysis:

- **Text Analysis**: Analyzes writing style, coherence, and academic rigor
- **AI Detection**: Identifies potential AI-generated content markers
- **Quality Assessment**: Evaluates methodology, citations, and overall academic quality
- **Detailed Breakdown**: Provides component-wise scores and recommendations

### Fallback Mode

If the Gemini API is unavailable or fails, the system falls back to:
- Default analysis with reasonable scores
- Warning messages about API unavailability
- Recommendations for manual review

## Development

### Running in Development Mode

```bash
npm run dev
```

### Testing

```bash
npm test
```

## Architecture

- **Express.js**: Web framework
- **MongoDB**: Database for user data and file metadata
- **Multer**: File upload handling
- **JWT**: Authentication
- **Cloudinary**: Image storage for avatars
- **Gemini API**: AI analysis for trust score calculation
- **PlagiarismSearch API**: Plagiarism detection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT

