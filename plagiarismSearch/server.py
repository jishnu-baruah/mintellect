from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Request, Query, Body, Response
from fastapi.responses import JSONResponse, HTMLResponse, StreamingResponse
from fastapi.templating import Jinja2Templates
from typing import Optional, List
import httpx
import os
from dotenv import load_dotenv
import io
try:
    from weasyprint import HTML
except ImportError:
    HTML = None
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

API_KEY = os.getenv("PLAGIARISMSEARCH_API_KEY")
if API_KEY:
    print(f"Loaded API KEY: {API_KEY[:4]}...{API_KEY[-4:]}")
else:
    print("API KEY not loaded from .env!")

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

@app.get("/health")
async def health_check(request: Request):
    from fastapi import HTTPException
    import base64
    
    auth = request.headers.get("authorization")
    
    if not auth or not auth.startswith("Basic "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        credentials = base64.b64decode(auth[6:]).decode()
        username, password = credentials.split(":", 1)
        
        if username != "cronjob@mintellect" or password != "mintellect2025":
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except:
        raise HTTPException(status_code=401, detail="Invalid authentication format")
    
    import psutil
    import time
    
    return {
        "status": "healthy",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "uptime": time.time() - psutil.boot_time(),
        "memory": {
            "total": psutil.virtual_memory().total,
            "available": psutil.virtual_memory().available,
            "percent": psutil.virtual_memory().percent
        },
        "version": "1.0.0"
    }

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/reports")
async def list_reports(
    show_relations: int = Query(0),
    ids: Optional[List[int]] = Query(None),
    remote_id: Optional[str] = Query(None),
    page: int = Query(1),
    limit: int = Query(10)
):
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

@app.post("/reports")
async def batch_reports(
    ids: Optional[List[int]] = Form(None),
    remote_id: Optional[str] = Form(None),
    show_relations: int = Form(0),
    page: int = Form(1),
    limit: int = Form(10)
):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not set.")
    payload = {
        "show_relations": show_relations,
        "page": page,
        "limit": limit
    }
    if ids:
        payload["ids"] = ids
    if remote_id:
        payload["remote_id"] = remote_id
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{API_BASE_URL}/reports",
            headers={**headers(), "Content-Type": "application/json"},
            json=payload
        )
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()

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
            if search_web_disable_urls:
                form_data["search_web_disable_urls"] = search_web_disable_urls
            if search_web_exclude_urls:
                form_data["search_web_exclude_urls"] = search_web_exclude_urls
            if search_storage_sensibility_percentage is not None:
                form_data["search_storage_sensibility_percentage"] = str(search_storage_sensibility_percentage)
            if search_storage_sensibility_words is not None:
                form_data["search_storage_sensibility_words"] = str(search_storage_sensibility_words)
            files = {"document": (file.filename, await file.read(), file.content_type)}
            response = await client.post(
                f"{API_BASE_URL}/reports/create",
                headers=headers(),
                data=form_data,
                files=files
            )
        else:
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
            if search_web_disable_urls:
                payload["search_web_disable_urls"] = search_web_disable_urls
            if search_web_exclude_urls:
                payload["search_web_exclude_urls"] = search_web_exclude_urls
            if search_storage_sensibility_percentage is not None:
                payload["search_storage_sensibility_percentage"] = search_storage_sensibility_percentage
            if search_storage_sensibility_words is not None:
                payload["search_storage_sensibility_words"] = search_storage_sensibility_words
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
            payload = {"is_filter_references": is_filter_references, "is_json": is_json, "force": force}
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

@app.post("/storage/create")
async def create_storage(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    url: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    group_id: Optional[int] = Form(None),
    user_id: Optional[int] = Form(None),
    file_id: Optional[int] = Form(None),
    is_search_filter_chars: int = Form(0),
    is_json: int = Form(1)
):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not set.")
    if not (file or text or url):
        raise HTTPException(status_code=400, detail="One of file, text, or url is required.")
    async with httpx.AsyncClient() as client:
        if file:
            form_data = {
                "is_search_filter_chars": str(is_search_filter_chars),
                "is_json": str(is_json)
            }
            if title:
                form_data["title"] = title
            if group_id:
                form_data["group_id"] = str(group_id)
            if user_id:
                form_data["user_id"] = str(user_id)
            if file_id:
                form_data["file_id"] = str(file_id)
            if text:
                form_data["text"] = text
            if url:
                form_data["url"] = url
            files = {"document": (file.filename, await file.read(), file.content_type)}
            response = await client.post(
                f"{API_BASE_URL}/storage/create",
                headers=headers(),
                data=form_data,
                files=files
            )
        else:
            payload = {"is_search_filter_chars": is_search_filter_chars, "is_json": is_json}
            if text:
                payload["text"] = text
            if url:
                payload["url"] = url
            if title:
                payload["title"] = title
            if group_id:
                payload["group_id"] = group_id
            if user_id:
                payload["user_id"] = user_id
            if file_id:
                payload["file_id"] = file_id
            response = await client.post(
                f"{API_BASE_URL}/storage/create",
                headers={**headers(), "Content-Type": "application/json"},
                json=payload
            )
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()

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

@app.put("/reports/update/{report_id}")
async def update_report(report_id: int, data: dict = Body(...)):
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

@app.delete("/reports/delete/{report_id}")
async def delete_report(report_id: int):
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

@app.get("/reports/sources/{report_id}")
async def get_grouped_sources(report_id: int):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not set.")
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_BASE_URL}/reports/sources/{report_id}",
            headers=headers()
        )
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()

@app.get("/reports/html/{report_id}")
async def get_html_report(report_id: int):
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

@app.get("/report/pdf/{report_id}")
async def report_pdf(report_id: int):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not set.")
    if HTML is None:
        raise HTTPException(status_code=500, detail="WeasyPrint is not installed. Please install with 'pip install weasyprint'.")
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
        style = '''<style>body { font-family: Arial, sans-serif; margin: 2em; color: #222; } .ps-rb-ai { background: #ffe4b2; } .rb-r { background: #ffb3b3; } .rb-y { background: #fff7b2; } .rb-p { background: #b2e0ff; } .ps-rb-ai { background: #e6e6ff; } .status--10 .rp, .status--11 .rp { background: #e0e0e0; } .report-section { margin-bottom: 2em; padding: 1em; border-radius: 8px; background: #fff; box-shadow: 0 2px 8px #0001; } a { color: #2980b9; }</style>'''
        html_full = f"<html><head>{style}</head><body>{html_content}</body></html>"
        pdf_io = io.BytesIO()
        HTML(string=html_full).write_pdf(pdf_io)
        pdf_io.seek(0)
        return StreamingResponse(pdf_io, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=report_{report_id}.pdf"})

@app.get("/ai-reports/{report_id}")
async def get_ai_report(report_id: int, show_relations: int = 0):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not set.")
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_BASE_URL}/ai-reports/{report_id}",
            headers=headers(),
            params={"show_relations": show_relations}
        )
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()

@app.get("/ai-reports/html/{report_id}")
async def get_ai_html_report(report_id: int):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not set.")
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_BASE_URL}/ai-reports/{report_id}",
            headers=headers(),
            params={"show_relations": -3}
        )
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()

@app.post("/webhook/plagiarismsearch")
async def plagiarismsearch_webhook(request: Request):
    data = await request.json()
    # You can log, process, or trigger actions here
    # For now, just return the received payload
    return {"received": data}

@app.get("/progress/{report_id}")
async def progress_status(report_id: int):
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

@app.get("/healthz")
async def health_check():
    if not API_KEY:
        return {"error": "API key not set"}
    async with httpx.AsyncClient() as client:
        print("Sending headers:", headers())
        response = await client.get(
            f"{API_BASE_URL}/reports",
            headers=headers()
        )
        return {
            "status_code": response.status_code,
            "response_text": response.text
        }

@app.post("/test-direct")
async def test_direct():
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
        print("Sending headers:", headers())
        response = await client.post(
            f"{API_BASE_URL}/reports/create",
            headers=headers(),
            data=data,
            files=files
        )
        return Response(content=response.text, status_code=response.status_code, media_type=response.headers.get('content-type', 'application/json')) 