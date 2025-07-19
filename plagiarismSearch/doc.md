# API Documentation

This document describes the endpoints provided by the FastAPI server for interacting with the PlagiarismSearch API.

## Endpoints

### GET /reports
List plagiarism reports (with optional filters).
- Query parameters:
  - show_relations: int (default 0)
  - ids: list of int (optional)
  - remote_id: str (optional)
  - page: int (default 1)
  - limit: int (default 10)
- Returns: JSON list of reports from PlagiarismSearch API

#### Example:
```bash
curl "http://localhost:8000/reports?page=1&limit=10"
```

### POST /reports
Batch fetch reports by ids or remote_id.
- Form parameters:
  - ids: list of int (optional)
  - remote_id: str (optional)
  - show_relations: int (default 0)
  - page: int (default 1)
  - limit: int (default 10)
- Returns: JSON list of reports from PlagiarismSearch API

#### Example:
```bash
curl -X POST "http://localhost:8000/reports" -F "ids=123" -F "ids=456"
```

### PUT /reports/update/{report_id}
Update a plagiarism report's metadata.
- Path parameter: report_id (int)
- Body: JSON object with fields to update (e.g., title, callback_url, remote_id)
- Returns: JSON response from PlagiarismSearch API

#### Example:
```bash
curl -X PUT "http://localhost:8000/reports/update/123456" -H "Content-Type: application/json" -d '{"title": "New Title"}'
```

### DELETE /reports/delete/{report_id}
Delete a plagiarism report.
- Path parameter: report_id (int)
- Returns: JSON response from PlagiarismSearch API

#### Example:
```bash
curl -X DELETE "http://localhost:8000/reports/delete/123456"
```

### POST /check
Submit a document, text, or URL for plagiarism checking.
- Accepts: multipart/form-data (for file upload) or application/x-www-form-urlencoded (for text/url)
- Parameters:
  - file: UploadFile (optional)
  - text: str (optional)
  - url: str (optional)
  - title: str (optional)
  - callback_url: str (optional)
  - is_search_web: int (default 1)
  - is_search_storage: int (default 1)
  - is_json: int (default 1)
- At least one of file, text, or url is required.
- Returns: JSON response from PlagiarismSearch API

#### Example (text):
```bash
curl -X POST "http://localhost:8000/check" -F "text=Your text here" -F "title=Test.txt"
```

#### Example (file):
```bash
curl -X POST "http://localhost:8000/check" -F "file=@test.txt" -F "title=Test.txt"
```

### POST /ai-check
Submit a document, text, or URL for AI detection.
- Accepts: multipart/form-data (for file upload) or application/x-www-form-urlencoded (for text/url)
- Parameters:
  - file: UploadFile (optional)
  - text: str (optional)
  - url: str (optional)
  - title: str (optional)
  - callback_url: str (optional)
  - is_filter_references: int (default 0)
  - is_json: int (default 1)
- At least one of file, text, or url is required.
- Returns: JSON response from PlagiarismSearch API

#### Example (text):
```bash
curl -X POST "http://localhost:8000/ai-check" -F "text=Your text here" -F "title=Test.txt"
```

#### Example (file):
```bash
curl -X POST "http://localhost:8000/ai-check" -F "file=@test.txt" -F "title=Test.txt"
```

### POST /storage/create
Submit a document to user storage.
- Accepts: multipart/form-data (for file upload) or application/x-www-form-urlencoded (for text/url)
- Parameters:
  - file: UploadFile (optional)
  - text: str (optional)
  - url: str (optional)
  - title: str (optional)
  - group_id: int (optional)
  - user_id: int (optional)
  - file_id: int (optional)
  - is_search_filter_chars: int (default 0)
  - is_json: int (default 1)
- At least one of file, text, or url is required.
- Returns: JSON response from PlagiarismSearch API

#### Example:
```bash
curl -X POST "http://localhost:8000/storage/create" -F "file=@test.txt" -F "title=Test.txt"
```

### GET /status/{report_id}
Get the status of a plagiarism check.
- Path parameter: report_id (int)
- Returns: JSON status from PlagiarismSearch API

#### Example:
```bash
curl "http://localhost:8000/status/123456"
```

### GET /progress/{report_id}
Get progress/status of a plagiarism check (for polling in UI).
- Path parameter: report_id (int)
- Returns: JSON status from PlagiarismSearch API

#### Example:
```bash
curl "http://localhost:8000/progress/123456"
```

### GET /report/{report_id}
Retrieve the plagiarism report data.
- Path parameter: report_id (int)
- Query parameter: show_relations (int, default 0)
- Returns: JSON report data from PlagiarismSearch API

#### Example:
```bash
curl "http://localhost:8000/report/123456?show_relations=1"
```

### GET /reports/sources/{report_id}
Get grouped sources for a plagiarism report.
- Path parameter: report_id (int)
- Returns: JSON with grouped sources from PlagiarismSearch API

#### Example:
```bash
curl "http://localhost:8000/reports/sources/123456"
```

### GET /reports/html/{report_id}
Get HTML-highlighted plagiarism report.
- Path parameter: report_id (int)
- Returns: JSON with HTML content from PlagiarismSearch API

#### Example:
```bash
curl "http://localhost:8000/reports/html/123456"
```

### GET /ai-reports/{report_id}
Get AI report details.
- Path parameter: report_id (int)
- Query parameter: show_relations (int, default 0)
- Returns: JSON with AI report details from PlagiarismSearch API

#### Example:
```bash
curl "http://localhost:8000/ai-reports/123456"
```

### GET /ai-reports/html/{report_id}
Get HTML-highlighted AI report.
- Path parameter: report_id (int)
- Returns: JSON with HTML content from PlagiarismSearch API

#### Example:
```bash
curl "http://localhost:8000/ai-reports/html/123456"
```

### POST /webhook/plagiarismsearch
Webhook endpoint for PlagiarismSearch async updates.
- Receives: JSON payload from PlagiarismSearch when a check is complete.
- You can log, process, or trigger actions on this event.
- Returns: JSON echo of received payload.

#### Example (PlagiarismSearch will POST to this URL):
```json
{
  "event": "report.checked",
  "data": { ... }
}
```

### GET /
A simple HTML UI for testing the /check and /ai-check endpoints in your browser. 

### Advanced Options for /check and /ai-check

You can use the following advanced parameters for more control:
- is_search_filter_chars: int (default 0) — Only latin characters
- is_search_filter_references: int (default 0) — Exclude references
- is_search_filter_quotes: int (default 0) — Exclude in-text citations
- search_web_disable_urls: str (optional) — Whitelist URLs (comma-separated)
- search_web_exclude_urls: str (optional) — Exclude URLs (comma-separated)
- is_search_ai: int (default 1) — Search for AI text
- search_storage_sensibility_percentage: int (optional) — Minimal % sensitive to plagiarism check within storage sources
- search_storage_sensibility_words: int (optional) — Minimal word number sensitive to plagiarism check within storage sources
- force: int (default 0, for /ai-check) — Force new check

Example:
```bash
curl -X POST "http://localhost:8000/check" -F "text=..." -F "is_search_filter_references=1" -F "search_web_exclude_urls=example.com,another.com"
``` 

# Frontend Integration Guide

## Handling API Responses

When integrating with this FastAPI backend, always check the response type before parsing as JSON. Some endpoints may return plain text (e.g., error messages) instead of JSON, especially on errors.

### Example: Safe Fetch Wrapper
```js
async function safeFetch(endpoint, options = {}) {
    const res = await fetch(endpoint, options);
    const contentType = res.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
        data = await res.json();
    } else {
        data = await res.text();
    }
    return data;
}
```

### Usage Example
```js
try {
    const data = await safeFetch('/ai-check', { method: 'POST', body: formData });
    if (typeof data === 'string') {
        // Show plain text error
        showError(data);
    } else {
        // Show JSON result
        showResult(data);
    }
} catch (err) {
    showError('Network error: ' + err);
}
```

## Rendering HTML Reports

- Use the `/reports/html/{report_id}` endpoint to get the HTML-highlighted report.
- To display in the browser, inject the HTML into a styled container or open in a new tab.
- For best results, add your own CSS for fonts, colors, and layout.
- To export as PDF, use the browser's Print dialog (Ctrl+P) and select "Save as PDF".

### Example: Open HTML in New Tab
```js
const res = await fetch(`/reports/html/${reportId}`);
const data = await res.json();
if (data && data.data && data.data.html) {
    const htmlWindow = window.open('', '_blank');
    htmlWindow.document.write('<html><head><title>Report</title><style>/* your CSS here */</style></head><body>' + data.data.html + '</body></html>');
    htmlWindow.document.close();
}
```

## Best Practices
- Always check for required fields before submitting forms.
- Handle both JSON and plain text responses.
- Show user-friendly error messages.
- Use the provided endpoints for status, sources, and HTML as needed.
- For PDF export, prefer browser print-to-PDF for best styling.

## Endpoints Reference
- `/check` - Plagiarism check (POST)
- `/ai-check` - AI detection (POST)
- `/status/{id}` - Report status (GET)
- `/report/{id}` - Full report data (GET)
- `/reports/html/{id}` - HTML-highlighted report (GET)
- `/reports/sources/{id}` - Grouped sources (GET)
- `/progress/{id}` - Status polling (GET)

See above for full endpoint documentation and examples. 