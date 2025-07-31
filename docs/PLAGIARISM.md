# Mintellect - Plagiarism Service Documentation

## 🎯 Plagiarism Service Overview

The Mintellect Plagiarism Service is a Python-based FastAPI application that provides a proxy interface to the PlagiarismSearch API, enabling advanced plagiarism detection and AI text analysis for academic documents.

### 🏗️ Technology Stack

#### Core Framework
- **Python 3.8+** - Programming language
- **FastAPI** - Modern web framework for building APIs
- **Uvicorn** - ASGI server for running FastAPI applications
- **UV** - Fast Python package manager

#### HTTP & Networking
- **httpx** - Async HTTP client for API calls
- **python-dotenv** - Environment variable management

#### Document Processing
- **WeasyPrint** - HTML to PDF conversion (optional)
- **Jinja2** - Template engine for HTML responses

#### Development Tools
- **UV** - Package management and virtual environments
- **Type hints** - Type safety and documentation

---

## 📁 Project Structure

```
plagiarismSearch/
├── main.py                 # Main entry point
├── server.py               # FastAPI application
├── requirements.txt        # Python dependencies
├── pyproject.toml          # Project configuration
├── uv.lock                 # UV lock file
├── doc.md                  # API documentation
├── instructions.md         # Setup instructions
├── plagarismService.md     # Service documentation
├── todo.md                 # Development tasks
├── templates/              # HTML templates
│   └── index.html          # Web interface
└── README.md               # Project overview
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- UV package manager
- PlagiarismSearch API key

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd plagiarismSearch

# Install dependencies using UV
uv pip install -r requirements.txt

# Set up environment variables
echo "PLAGIARISMSEARCH_API_KEY=your_api_key_here" > .env

# Run the server
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### Environment Variables
```bash
# .env file
PLAGIARISMSEARCH_API_KEY=your_plagiarismsearch_api_key_here
```

---

## 🔧 Core Components

### FastAPI Application (`server.py`)

The main FastAPI application that provides the proxy interface:

```python
from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Request, Query, Body, Response
from fastapi.responses import JSONResponse, HTMLResponse, StreamingResponse
from fastapi.templating import Jinja2Templates
from typing import Optional, List
import httpx
import os
from dotenv import load_dotenv
import io

load_dotenv()

API_KEY = os.getenv("PLAGIARISMSEARCH_API_KEY")
API_BASE_URL = "https://plagiarismsearch.com/api/v3"

app = FastAPI(title="PlagiarismSearch Proxy API")

# Enable CORS for all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="templates")

headers = lambda: {"Authorization": API_KEY} if API_KEY else {}
```

### Authentication & Configuration
```python
# API key validation
if not API_KEY:
    print("API KEY not loaded from .env!")
else:
    print(f"Loaded API KEY: {API_KEY[:4]}...{API_KEY[-4:]}")

# Headers function for API requests
def get_headers():
    return {"Authorization": API_KEY} if API_KEY else {}
```

---

## 🔗 API Endpoints

### Document Submission

#### POST /check
Submit a document for plagiarism checking:

```python
@app.post("/check")
async def check_document(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    url: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    callback_url: Optional[str] = Form(None),
    is_search_web: int = Form(1),
    is_search_storage: int = Form(1),
    is_json: int = Form(1),
    is_search_filter_chars: int = Form(0),
    is_search_filter_references: int = Form(0),
    is_search_filter_quotes: int = Form(0),
    search_web_disable_urls: Optional[str] = Form(None),
    search_web_exclude_urls: Optional[str] = Form(None),
    is_search_ai: int = Form(1),
    search_storage_sensibility_percentage: Optional[int] = Form(None),
    search_storage_sensibility_words: Optional[int] = Form(None)
):
    """
    Submit a document, text, or URL for plagiarism checking.
    At least one of file, text, or url is required.
    """
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not set.")
    if not (file or text or url):
        raise HTTPException(status_code=400, detail="One of file, text, or url is required.")

    async with httpx.AsyncClient() as client:
        if file:
            # Handle file upload
            form_data = {
                "is_search_web": str(is_search_web),
                "is_search_storage": str(is_search_storage),
                "is_json": str(is_json),
                "is_search_filter_chars": str(is_search_filter_chars),
                "is_search_filter_references": str(is_search_filter_references),
                "is_search_filter_quotes": str(is_search_filter_quotes),
                "is_search_ai": str(is_search_ai)
            }
            if title:
                form_data["title"] = title
            if callback_url:
                form_data["callback_url"] = callback_url
            if text:
                form_data["text"] = text
            if url:
                form_data["url"] = url
            
            files = {"document": (file.filename, await file.read(), file.content_type)}
            response = await client.post(
                f"{API_BASE_URL}/reports/create",
                headers=headers(),
                data=form_data,
                files=files
            )
        else:
            # Handle text/URL submission
            payload = {
                "is_search_web": is_search_web,
                "is_search_storage": is_search_storage,
                "is_json": is_json,
                "is_search_filter_chars": is_search_filter_chars,
                "is_search_filter_references": is_search_filter_references,
                "is_search_filter_quotes": is_search_filter_quotes,
                "is_search_ai": is_search_ai
            }
            if text:
                payload["text"] = text
            if url:
                payload["url"] = url
            if title:
                payload["title"] = title
            if callback_url:
                payload["callback_url"] = callback_url
            
            response = await client.post(
                f"{API_BASE_URL}/reports/create",
                headers={**headers(), "Content-Type": "application/json"},
                json=payload
            )
        
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
```

**Usage Examples:**

```bash
# Submit text for plagiarism check
curl -X POST "http://localhost:8000/check" \
  -F "text=Your document text here" \
  -F "title=Research Paper" \
  -F "is_search_web=1" \
  -F "is_search_storage=1"

# Submit file for plagiarism check
curl -X POST "http://localhost:8000/check" \
  -F "file=@document.pdf" \
  -F "title=Research Paper" \
  -F "is_search_filter_references=1"

# Submit URL for plagiarism check
curl -X POST "http://localhost:8000/check" \
  -F "url=https://example.com/document" \
  -F "title=Web Document"
```

#### POST /ai-check
Submit a document for AI detection:

```python
@app.post("/ai-check")
async def ai_check(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    url: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    callback_url: Optional[str] = Form(None),
    is_filter_references: int = Form(0),
    is_json: int = Form(1),
    force: int = Form(0)
):
    """
    Submit a document for AI text detection.
    """
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not set.")
    if not (file or text or url):
        raise HTTPException(status_code=400, detail="One of file, text, or url is required.")
    
    async with httpx.AsyncClient() as client:
        if file:
            form_data = {
                "is_filter_references": str(is_filter_references),
                "is_json": str(is_json),
                "force": str(force)
            }
            if title:
                form_data["title"] = title
            if callback_url:
                form_data["callback_url"] = callback_url
            if text:
                form_data["text"] = text
            if url:
                form_data["url"] = url
            
            files = {"document": (file.filename, await file.read(), file.content_type)}
            response = await client.post(
                f"{API_BASE_URL}/ai-reports/create",
                headers=headers(),
                data=form_data,
                files=files
            )
        else:
            payload = {
                "is_filter_references": is_filter_references,
                "is_json": is_json,
                "force": force
            }
            if text:
                payload["text"] = text
            if url:
                payload["url"] = url
            if title:
                payload["title"] = title
            if callback_url:
                payload["callback_url"] = callback_url
            
            response = await client.post(
                f"{API_BASE_URL}/ai-reports/create",
                headers={**headers(), "Content-Type": "application/json"},
                json=payload
            )
        
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
```

### Report Management

#### GET /status/{report_id}
Check the status of a plagiarism check:

```python
@app.get("/status/{report_id}")
async def check_status(report_id: int):
    """Get the status of a plagiarism check."""
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not set.")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_BASE_URL}/reports/status/{report_id}",
            headers=headers()
        )
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
```

#### GET /report/{report_id}
Retrieve the complete plagiarism report:

```python
@app.get("/report/{report_id}")
async def get_report(report_id: int, show_relations: int = 0):
    """Retrieve the plagiarism report data."""
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not set.")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_BASE_URL}/reports/{report_id}",
            headers=headers(),
            params={"show_relations": show_relations}
        )
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
```

#### GET /reports/html/{report_id}
Get HTML-highlighted plagiarism report:

```python
@app.get("/reports/html/{report_id}")
async def get_html_report(report_id: int):
    """Get HTML-highlighted plagiarism report."""
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not set.")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_BASE_URL}/reports/html/{report_id}",
            headers=headers()
        )
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
```

### PDF Generation

#### GET /report/pdf/{report_id}
Generate PDF report from HTML:

```python
@app.get("/report/pdf/{report_id}")
async def report_pdf(report_id: int):
    """Generate PDF report from HTML content."""
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not set.")
    if HTML is None:
        raise HTTPException(status_code=500, detail="WeasyPrint is not installed.")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_BASE_URL}/reports/html/{report_id}",
            headers=headers()
        )
        response.raise_for_status()
        data = response.json()
        html_content = data.get("data", {}).get("html", "")
        
        if not html_content:
            raise HTTPException(status_code=404, detail="No HTML content found for this report.")
        
        # Add default styling for PDF
        style = '''
        <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 2em; 
            color: #222; 
        } 
        .ps-rb-ai { background: #ffe4b2; } 
        .rb-r { background: #ffb3b3; } 
        .rb-y { background: #fff7b2; } 
        .rb-p { background: #b2e0ff; } 
        .ps-rb-ai { background: #e6e6ff; } 
        .status--10 .rp, .status--11 .rp { background: #e0e0e0; } 
        .report-section { 
            margin-bottom: 2em; 
            padding: 1em; 
            border-radius: 8px; 
            background: #fff; 
            box-shadow: 0 2px 8px #0001; 
        } 
        a { color: #2980b9; }
        </style>
        '''
        
        html_full = f"<html><head>{style}</head><body>{html_content}</body></html>"
        pdf_io = io.BytesIO()
        HTML(string=html_full).write_pdf(pdf_io)
        pdf_io.seek(0)
        
        return StreamingResponse(
            pdf_io, 
            media_type="application/pdf", 
            headers={"Content-Disposition": f"attachment; filename=report_{report_id}.pdf"}
        )
```

### Report Management

#### GET /reports
List all plagiarism reports:

```python
@app.get("/reports")
async def list_reports(
    show_relations: int = Query(0),
    ids: Optional[List[int]] = Query(None),
    remote_id: Optional[str] = Query(None),
    page: int = Query(1),
    limit: int = Query(10)
):
    """List plagiarism reports with optional filters."""
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not set.")
    
    params = {
        "show_relations": show_relations,
        "page": page,
        "limit": limit
    }
    if ids:
        params["ids"] = ids
    if remote_id:
        params["remote_id"] = remote_id
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_BASE_URL}/reports",
            headers=headers(),
            params=params
        )
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
```

#### PUT /reports/update/{report_id}
Update report metadata:

```python
@app.put("/reports/update/{report_id}")
async def update_report(report_id: int, data: dict = Body(...)):
    """Update a plagiarism report's metadata."""
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not set.")
    
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{API_BASE_URL}/reports/update/{report_id}",
            headers={**headers(), "Content-Type": "application/json"},
            json=data
        )
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
```

#### DELETE /reports/delete/{report_id}
Delete a plagiarism report:

```python
@app.delete("/reports/delete/{report_id}")
async def delete_report(report_id: int):
    """Delete a plagiarism report."""
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not set.")
    
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{API_BASE_URL}/reports/delete/{report_id}",
            headers=headers()
        )
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
```

---

## 🔧 Advanced Features

### Webhook Support
```python
@app.post("/webhook/plagiarismsearch")
async def plagiarismsearch_webhook(request: Request):
    """Webhook endpoint for PlagiarismSearch async updates."""
    data = await request.json()
    # Process webhook data
    # You can log, process, or trigger actions here
    return {"received": data}
```

### Health Check
```python
@app.get("/healthz")
async def health_check():
    """Health check endpoint."""
    if not API_KEY:
        return {"error": "API key not set"}
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_BASE_URL}/reports",
            headers=headers()
        )
        return {
            "status_code": response.status_code,
            "response_text": response.text
        }
```

### Direct Testing
```python
@app.post("/test-direct")
async def test_direct():
    """Test direct API connection."""
    if not API_KEY:
        return {"error": "API key not set"}
    
    # Prepare a minimal multipart/form-data request with a dummy file
    import io
    dummy_content = b"This is a test file for PlagiarismSearch API."
    files = {"document": ("test_file_plagiarism.txt", io.BytesIO(dummy_content), "text/plain")}
    data = {
        "is_search_web": "1",
        "is_search_storage": "1",
        "is_json": "1"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{API_BASE_URL}/reports/create",
            headers=headers(),
            data=data,
            files=files
        )
        return Response(
            content=response.text, 
            status_code=response.status_code, 
            media_type=response.headers.get('content-type', 'application/json')
        )
```

---

## 🎨 Web Interface

### HTML Template (`templates/index.html`)
The service includes a simple web interface for testing:

```html
<!DOCTYPE html>
<html>
<head>
    <title>PlagiarismSearch API Tester</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 2em; }
        .form-group { margin-bottom: 1em; }
        label { display: block; margin-bottom: 0.5em; }
        input, textarea, select { width: 100%; padding: 0.5em; }
        button { padding: 0.5em 1em; background: #007bff; color: white; border: none; cursor: pointer; }
        .result { margin-top: 2em; padding: 1em; background: #f8f9fa; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>PlagiarismSearch API Tester</h1>
    
    <form id="checkForm">
        <div class="form-group">
            <label for="file">File:</label>
            <input type="file" id="file" name="file">
        </div>
        
        <div class="form-group">
            <label for="text">Text:</label>
            <textarea id="text" name="text" rows="10" placeholder="Enter text to check..."></textarea>
        </div>
        
        <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" placeholder="Document title">
        </div>
        
        <div class="form-group">
            <label for="checkType">Check Type:</label>
            <select id="checkType" name="checkType">
                <option value="plagiarism">Plagiarism Check</option>
                <option value="ai">AI Detection</option>
            </select>
        </div>
        
        <button type="submit">Submit Check</button>
    </form>
    
    <div id="result" class="result" style="display: none;"></div>
    
    <script>
        document.getElementById('checkForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            const file = document.getElementById('file').files[0];
            const text = document.getElementById('text').value;
            const title = document.getElementById('title').value;
            const checkType = document.getElementById('checkType').value;
            
            if (file) formData.append('file', file);
            if (text) formData.append('text', text);
            if (title) formData.append('title', title);
            
            const endpoint = checkType === 'ai' ? '/ai-check' : '/check';
            
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.text();
                document.getElementById('result').innerHTML = `<pre>${result}</pre>`;
                document.getElementById('result').style.display = 'block';
            } catch (error) {
                document.getElementById('result').innerHTML = `<pre>Error: ${error}</pre>`;
                document.getElementById('result').style.display = 'block';
            }
        });
    </script>
</body>
</html>
```

---

## 🔗 Integration with Main Application

### Frontend Integration
```javascript
// Example: Frontend integration with the plagiarism service
class PlagiarismService {
  constructor(baseUrl = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }
  
  async submitDocument(file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.title) formData.append('title', options.title);
    if (options.callbackUrl) formData.append('callback_url', options.callbackUrl);
    if (options.searchWeb !== undefined) formData.append('is_search_web', options.searchWeb ? '1' : '0');
    if (options.searchStorage !== undefined) formData.append('is_search_storage', options.searchStorage ? '1' : '0');
    if (options.filterReferences) formData.append('is_search_filter_references', '1');
    if (options.filterQuotes) formData.append('is_search_filter_quotes', '1');
    
    const response = await fetch(`${this.baseUrl}/check`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  async checkStatus(reportId) {
    const response = await fetch(`${this.baseUrl}/status/${reportId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  async getReport(reportId, showRelations = false) {
    const params = new URLSearchParams();
    if (showRelations) params.append('show_relations', '1');
    
    const response = await fetch(`${this.baseUrl}/report/${reportId}?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  async getHtmlReport(reportId) {
    const response = await fetch(`${this.baseUrl}/reports/html/${reportId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  async downloadPdfReport(reportId) {
    const response = await fetch(`${this.baseUrl}/report/pdf/${reportId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plagiarism_report_${reportId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

// Usage example
const plagiarismService = new PlagiarismService();

// Submit document for checking
const submitDocument = async (file) => {
  try {
    const result = await plagiarismService.submitDocument(file, {
      title: 'Research Paper',
      searchWeb: true,
      searchStorage: true,
      filterReferences: true
    });
    
    console.log('Document submitted:', result);
    return result;
  } catch (error) {
    console.error('Error submitting document:', error);
    throw error;
  }
};

// Poll for status
const pollStatus = async (reportId) => {
  const maxAttempts = 60; // 5 minutes with 5-second intervals
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      const status = await plagiarismService.checkStatus(reportId);
      
      if (status.data && status.data.status === 'checked') {
        return status;
      }
      
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      attempts++;
    } catch (error) {
      console.error('Error checking status:', error);
      throw error;
    }
  }
  
  throw new Error('Timeout waiting for report completion');
};
```

### Backend Integration
```python
# Example: Backend integration with the plagiarism service
import httpx
import asyncio
from typing import Optional, Dict, Any

class PlagiarismServiceClient:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
    
    async def submit_document(self, file_path: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
        """Submit a document for plagiarism checking."""
        if options is None:
            options = {}
        
        async with httpx.AsyncClient() as client:
            with open(file_path, 'rb') as f:
                files = {'file': (file_path, f, 'application/octet-stream')}
                data = {
                    'title': options.get('title', 'Document'),
                    'is_search_web': str(options.get('search_web', 1)),
                    'is_search_storage': str(options.get('search_storage', 1)),
                    'is_search_filter_references': str(options.get('filter_references', 0)),
                    'is_search_filter_quotes': str(options.get('filter_quotes', 0))
                }
                
                response = await client.post(
                    f"{self.base_url}/check",
                    files=files,
                    data=data
                )
                
                response.raise_for_status()
                return response.json()
    
    async def check_status(self, report_id: int) -> Dict[str, Any]:
        """Check the status of a plagiarism report."""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/status/{report_id}")
            response.raise_for_status()
            return response.json()
    
    async def get_report(self, report_id: int, show_relations: bool = False) -> Dict[str, Any]:
        """Get the complete plagiarism report."""
        async with httpx.AsyncClient() as client:
            params = {'show_relations': 1 if show_relations else 0}
            response = await client.get(f"{self.base_url}/report/{report_id}", params=params)
            response.raise_for_status()
            return response.json()
    
    async def get_html_report(self, report_id: int) -> Dict[str, Any]:
        """Get HTML-highlighted plagiarism report."""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/reports/html/{report_id}")
            response.raise_for_status()
            return response.json()

# Usage example
async def process_document(file_path: str):
    client = PlagiarismServiceClient()
    
    try:
        # Submit document
        result = await client.submit_document(file_path, {
            'title': 'Research Paper',
            'search_web': True,
            'search_storage': True,
            'filter_references': True
        })
        
        report_id = result['data']['id']
        print(f"Document submitted, report ID: {report_id}")
        
        # Poll for completion
        while True:
            status = await client.check_status(report_id)
            if status['data']['status'] == 'checked':
                break
            await asyncio.sleep(5)
        
        # Get final report
        report = await client.get_report(report_id, show_relations=True)
        return report
        
    except Exception as e:
        print(f"Error processing document: {e}")
        raise
```

---

## 🚀 Deployment

### Docker Deployment
```dockerfile
# Dockerfile
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

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  plagiarism-service:
    build: .
    ports:
      - "8000:8000"
    environment:
      - PLAGIARISMSEARCH_API_KEY=${PLAGIARISMSEARCH_API_KEY}
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
```

### Production Deployment
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export PLAGIARISMSEARCH_API_KEY="your_api_key_here"

# Run with production server
uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 📊 Monitoring & Logging

### Health Monitoring
```python
# Health check endpoint
@app.get("/health")
async def health_check():
    """Comprehensive health check."""
    try:
        # Check API key
        if not API_KEY:
            return {"status": "unhealthy", "error": "API key not set"}
        
        # Test API connection
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{API_BASE_URL}/reports",
                headers=headers(),
                timeout=10.0
            )
            
            if response.status_code == 200:
                return {
                    "status": "healthy",
                    "api_connection": "ok",
                    "timestamp": datetime.utcnow().isoformat()
                }
            else:
                return {
                    "status": "unhealthy",
                    "api_connection": "failed",
                    "status_code": response.status_code
                }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }
```

### Logging Configuration
```python
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('plagiarism_service.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Log API requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.utcnow()
    response = await call_next(request)
    end_time = datetime.utcnow()
    
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Duration: {(end_time - start_time).total_seconds():.3f}s"
    )
    
    return response
```

---

## 🔐 Security Considerations

### API Key Security
```python
# Secure API key handling
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("PLAGIARISMSEARCH_API_KEY")
if not API_KEY:
    raise ValueError("PLAGIARISMSEARCH_API_KEY environment variable is required")

# Validate API key format
if not API_KEY.startswith("Bearer "):
    API_KEY = f"Bearer {API_KEY}"
```

### Input Validation
```python
from pydantic import BaseModel, validator
from typing import Optional

class DocumentSubmission(BaseModel):
    title: Optional[str] = None
    callback_url: Optional[str] = None
    is_search_web: int = 1
    is_search_storage: int = 1
    
    @validator('title')
    def validate_title(cls, v):
        if v and len(v) > 255:
            raise ValueError('Title too long')
        return v
    
    @validator('callback_url')
    def validate_callback_url(cls, v):
        if v and not v.startswith(('http://', 'https://')):
            raise ValueError('Invalid callback URL')
        return v
```

### Rate Limiting
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/check")
@limiter.limit("10/minute")
async def check_document(request: Request, ...):
    # Implementation
    pass
```

---

*This plagiarism service documentation provides a comprehensive overview of the Mintellect plagiarism detection service. For specific implementation details, refer to the individual files.* 