# Mintellect - API Documentation

## 🌐 API Overview

The Mintellect API is a RESTful service built with Express.js that provides endpoints for user management, document processing, trust score calculation, and blockchain integration.

### Base URL
- **Development**: `http://localhost:5001`
- **Production**: `https://api.mintellect.xyz`

### Authentication
All API requests require wallet-based authentication using the `x-wallet` header:
```
x-wallet: 0x1234567890abcdef...
```

### Response Format
All API responses follow a consistent format:

```javascript
// Success Response
{
  "success": true,
  "data": Object,
  "message": "Operation completed successfully",
  "timestamp": "2025-01-31T21:43:00.000Z"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": Object
  },
  "timestamp": "2025-01-31T21:43:00.000Z"
}
```

---

## 🔐 Authentication Endpoints

### GET /api/auth/verify
Verify wallet authentication status.

**Headers:**
```
x-wallet: 0x1234567890abcdef...
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "authenticated": true,
    "wallet": "0x1234567890abcdef...",
    "user": {
      "id": "user_id",
      "profileComplete": true
    }
  }
}
```

---

## 👤 Profile Management Endpoints

### GET /settings/profile/profile
Get user profile by wallet address.

**Query Parameters:**
- `wallet` (required): Wallet address

**Example:**
```
GET /settings/profile/profile?wallet=0x1234567890abcdef...
```

**Response:**
```javascript
{
  "profile": {
    "_id": "user_id",
    "wallet": "0x1234567890abcdef...",
    "name": "John Doe",
    "mail": "john@example.com",
    "institution": "University of Technology",
    "bio": "Research scientist...",
    "avatar": "https://cloudinary.com/...",
    "createdAt": "2025-01-31T21:43:00.000Z",
    "updatedAt": "2025-01-31T21:43:00.000Z"
  },
  "allComplete": true
}
```

### GET /settings/profile/requirements
Get profile completion requirements checklist.

**Headers:**
```
x-wallet: 0x1234567890abcdef...
```

**Response:**
```javascript
{
  "checklist": [
    {
      "key": "firstName",
      "label": "First Name",
      "required": true,
      "completed": true
    },
    {
      "key": "lastName", 
      "label": "Last Name",
      "required": true,
      "completed": true
    },
    {
      "key": "email",
      "label": "Email Address",
      "required": true,
      "completed": true
    },
    {
      "key": "institution",
      "label": "Institution",
      "required": true,
      "completed": false
    }
  ],
  "allComplete": false
}
```

### POST /settings/profile/profile
Create or update user profile.

**Headers:**
```
x-wallet: 0x1234567890abcdef...
Content-Type: multipart/form-data
```

**Form Data:**
- `wallet` (required): Wallet address
- `firstName` (required): First name
- `lastName` (required): Last name
- `email` (required): Email address
- `institution` (optional): Institution name
- `bio` (optional): Biography
- `avatar` (optional): Profile image file

**Response:**
```javascript
{
  "message": "Profile created",
  "user": {
    "_id": "user_id",
    "wallet": "0x1234567890abcdef...",
    "name": "John Doe",
    "mail": "john@example.com",
    "institution": "University of Technology",
    "bio": "Research scientist...",
    "avatar": "https://cloudinary.com/...",
    "createdAt": "2025-01-31T21:43:00.000Z",
    "updatedAt": "2025-01-31T21:43:00.000Z"
  }
}
```

---

## 📄 Document Management Endpoints

### POST /api/files/upload
Upload a document for processing.

**Headers:**
```
x-wallet: 0x1234567890abcdef...
Content-Type: multipart/form-data
```

**Form Data:**
- `file` (required): Document file (PDF, DOCX, TXT, ZIP)
- `fileType` (optional): Type of document

**File Limits:**
- Maximum size: 100MB
- Supported formats: PDF, DOCX, TXT, ZIP

**Response:**
```javascript
{
  "success": true,
  "data": {
    "fileId": "abc123def456",
    "status": "COMPLETED",
    "message": "File uploaded successfully"
  }
}
```

### GET /api/files
Get list of user's uploaded files.

**Headers:**
```
x-wallet: 0x1234567890abcdef...
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status

**Response:**
```javascript
{
  "success": true,
  "data": {
    "files": [
      {
        "_id": "file_id",
        "originalName": "research_paper.pdf",
        "fileType": "RESEARCH_PAPER",
        "size": 2048576,
        "mimetype": "application/pdf",
        "status": "COMPLETED",
        "textContent": "Extracted text content...",
        "createdAt": "2025-01-31T21:43:00.000Z",
        "updatedAt": "2025-01-31T21:43:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### GET /api/files/:fileId
Get specific file details.

**Headers:**
```
x-wallet: 0x1234567890abcdef...
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "_id": "file_id",
    "originalName": "research_paper.pdf",
    "fileType": "RESEARCH_PAPER",
    "size": 2048576,
    "mimetype": "application/pdf",
    "status": "COMPLETED",
    "textContent": "Extracted text content...",
    "trustScore": {
      "overall": 85.5,
      "plagiarism": 92.0,
      "quality": 78.0,
      "relevance": 88.0
    },
    "plagiarismReport": {
      "score": 8.5,
      "sources": [
        {
          "url": "https://example.com/paper1",
          "similarity": 0.15
        }
      ]
    },
    "createdAt": "2025-01-31T21:43:00.000Z",
    "updatedAt": "2025-01-31T21:43:00.000Z"
  }
}
```

### POST /api/files/:fileId/check-plagiarism
Initiate plagiarism detection for a file.

**Headers:**
```
x-wallet: 0x1234567890abcdef...
Content-Type: application/json
```

**Request Body:**
```javascript
{
  "textContent": "Document text content...",
  "title": "Research Paper Title"
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "workflowId": "workflow_123",
    "status": "PROCESSING",
    "message": "Plagiarism check initiated"
  }
}
```

---

## 🎯 Trust Score Endpoints

### POST /api/trust-score/generate
Generate trust score for a document.

**Headers:**
```
x-wallet: 0x1234567890abcdef...
Content-Type: application/json
```

**Request Body:**
```javascript
{
  "textContent": "Document text content...",
  "plagiarismResults": {
    "score": 8.5,
    "sources": [...]
  },
  "fileId": "file_123"
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "trustScore": {
      "overall": 85.5,
      "plagiarism": 92.0,
      "quality": 78.0,
      "relevance": 88.0,
      "originality": 82.0
    },
    "factors": {
      "textQuality": {
        "score": 78.0,
        "details": "Good structure and clarity"
      },
      "citationAccuracy": {
        "score": 85.0,
        "details": "Proper citations found"
      },
      "methodology": {
        "score": 82.0,
        "details": "Clear methodology"
      },
      "conclusions": {
        "score": 80.0,
        "details": "Well-supported conclusions"
      }
    },
    "recommendations": [
      "Improve methodology section",
      "Add more recent citations",
      "Strengthen conclusions"
    ],
    "fileId": "file_123",
    "generatedAt": "2025-01-31T21:43:00.000Z"
  }
}
```

### POST /api/trust-score/generate-large
Generate trust score for large files (up to 200MB).

**Headers:**
```
x-wallet: 0x1234567890abcdef...
Content-Type: application/json
```

**Request Body:**
```javascript
{
  "textContent": "Large document content...",
  "title": "Large Research Paper",
  "fileType": "RESEARCH_PAPER"
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "trustScore": {
      "overall": 82.5,
      "plagiarism": 90.0,
      "quality": 75.0,
      "relevance": 85.0,
      "originality": 80.0
    },
    "factors": {...},
    "recommendations": [...],
    "processingTime": "45.2s"
  }
}
```

### GET /api/trust-score/:fileId
Get trust score for a specific file.

**Headers:**
```
x-wallet: 0x1234567890abcdef...
```

**Query Parameters:**
- `textContent` (required): Document text content
- `plagiarismResults` (optional): Plagiarism detection results

**Response:**
```javascript
{
  "success": true,
  "data": {
    "trustScore": {
      "overall": 85.5,
      "plagiarism": 92.0,
      "quality": 78.0,
      "relevance": 88.0,
      "originality": 82.0
    },
    "factors": {...},
    "recommendations": [...],
    "fileId": "file_123"
  }
}
```

### POST /api/trust-score/:fileId/analyze
Analyze a file and generate trust score.

**Headers:**
```
x-wallet: 0x1234567890abcdef...
Content-Type: application/json
```

**Request Body:**
```javascript
{
  "textContent": "Document text content...",
  "plagiarismResults": {
    "score": 8.5,
    "sources": [...]
  }
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "trustScore": {...},
    "factors": {...},
    "recommendations": [...],
    "fileId": "file_123"
  }
}
```

---

## 🔄 Workflow Management Endpoints

### GET /api/workflow
Get user's workflow history.

**Headers:**
```
x-wallet: 0x1234567890abcdef...
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `type` (optional): Filter by workflow type
- `status` (optional): Filter by status

**Response:**
```javascript
{
  "success": true,
  "data": {
    "workflows": [
      {
        "_id": "workflow_123",
        "documentId": "file_123",
        "userId": "user_123",
        "type": "plagiarism",
        "status": "completed",
        "steps": [
          {
            "name": "text_extraction",
            "status": "completed",
            "result": {...},
            "timestamp": "2025-01-31T21:43:00.000Z"
          },
          {
            "name": "plagiarism_check",
            "status": "completed",
            "result": {...},
            "timestamp": "2025-01-31T21:43:00.000Z"
          }
        ],
        "createdAt": "2025-01-31T21:43:00.000Z",
        "updatedAt": "2025-01-31T21:43:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "pages": 2
    }
  }
}
```

### POST /api/workflow/archive
Archive a workflow.

**Headers:**
```
x-wallet: 0x1234567890abcdef...
Content-Type: application/json
```

**Request Body:**
```javascript
{
  "workflowId": "workflow_123",
  "reason": "Completed successfully"
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "workflowId": "workflow_123",
    "status": "archived",
    "message": "Workflow archived successfully"
  }
}
```

### GET /api/workflow/archives
Get archived workflows.

**Headers:**
```
x-wallet: 0x1234567890abcdef...
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```javascript
{
  "success": true,
  "data": {
    "archives": [
      {
        "_id": "archive_123",
        "workflowId": "workflow_123",
        "originalWorkflow": {...},
        "archivedAt": "2025-01-31T21:43:00.000Z",
        "reason": "Completed successfully"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 8,
      "pages": 1
    }
  }
}
```

### POST /api/workflow/resume
Resume a paused workflow.

**Headers:**
```
x-wallet: 0x1234567890abcdef...
Content-Type: application/json
```

**Request Body:**
```javascript
{
  "workflowId": "workflow_123"
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "workflowId": "workflow_123",
    "status": "resumed",
    "message": "Workflow resumed successfully"
  }
}
```

---

## 📄 PDF Generation Endpoints

### POST /api/pdf/generate-plagiarism-report
Generate PDF plagiarism report.

**Headers:**
```
x-wallet: 0x1234567890abcdef...
Content-Type: application/json
```

**Request Body:**
```javascript
{
  "fileId": "file_123",
  "plagiarismResults": {
    "score": 8.5,
    "sources": [
      {
        "url": "https://example.com/paper1",
        "similarity": 0.15,
        "title": "Original Paper Title"
      }
    ]
  },
  "documentInfo": {
    "title": "Research Paper Title",
    "author": "John Doe",
    "institution": "University of Technology"
  }
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "pdfUrl": "https://cloudinary.com/pdf_report.pdf",
    "reportId": "report_123",
    "generatedAt": "2025-01-31T21:43:00.000Z"
  }
}
```

---

## 🔧 Error Codes

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `413` - Payload Too Large
- `500` - Internal Server Error

### Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_ERROR` - Authentication failed
- `FILE_TOO_LARGE` - File exceeds size limit
- `FILE_TYPE_NOT_SUPPORTED` - Unsupported file type
- `WORKFLOW_NOT_FOUND` - Workflow not found
- `PROCESSING_ERROR` - Document processing failed
- `TRUST_SCORE_ERROR` - Trust score calculation failed

### Example Error Response
```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Wallet address is required",
    "details": {
      "field": "wallet",
      "value": null,
      "constraint": "required"
    }
  },
  "timestamp": "2025-01-31T21:43:00.000Z"
}
```

---

## 📊 Rate Limiting

### Rate Limits
- **General API**: 100 requests per minute per wallet
- **File Upload**: 10 uploads per hour per wallet
- **Trust Score Generation**: 5 requests per hour per wallet
- **PDF Generation**: 3 requests per hour per wallet

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643673600
```

---

## 🔐 Security Considerations

### Authentication
- All endpoints require wallet authentication
- Wallet signature verification for sensitive operations
- Session timeout after 24 hours of inactivity

### File Upload Security
- File type validation (PDF, DOCX, TXT, ZIP only)
- File size limits (100MB for regular uploads, 200MB for large files)
- Virus scanning for uploaded files
- Secure file storage in Cloudinary

### Data Protection
- All sensitive data encrypted in transit (HTTPS)
- Database encryption for stored data
- Regular security audits and updates

---

## 📈 API Versioning

### Current Version
- **Version**: v1
- **Base URL**: `/api/v1/` (optional)

### Versioning Strategy
- Backward compatibility maintained for 6 months
- New versions released quarterly
- Deprecation notices sent 3 months in advance

---

## 🔗 SDKs and Libraries

### JavaScript/TypeScript
```javascript
// Example API client usage
const response = await fetch('/api/files/upload', {
  method: 'POST',
  headers: {
    'x-wallet': walletAddress,
    'Content-Type': 'multipart/form-data'
  },
  body: formData
});

const result = await response.json();
```

### Python
```python
import requests

# Example API client usage
headers = {'x-wallet': wallet_address}
response = requests.post(
    'https://api.mintellect.xyz/api/files/upload',
    headers=headers,
    files={'file': open('document.pdf', 'rb')}
)

result = response.json()
```

---

## 📞 Support

### API Support
- **Documentation**: [API Docs](https://docs.mintellect.xyz/api)
- **Status Page**: [API Status](https://status.mintellect.xyz)
- **Support Email**: api-support@mintellect.xyz

### Community
- **Discord**: [Mintellect Community](https://discord.gg/mintellect)
- **Twitter**: [@_Mintellect_](https://x.com/_Mintellect_)
- **Telegram**: [@mintellect_community](https://t.me/mintellect_community)

---

*This API documentation is continuously updated. For the latest changes, check the [changelog](./CHANGELOG.md).* 