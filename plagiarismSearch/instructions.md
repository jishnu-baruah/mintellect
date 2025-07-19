# Instructions

## Prerequisites
- Python 3.8+
- [UV package manager](https://github.com/astral-sh/uv)

## Setup

1. Install dependencies:
   ```sh
   uv pip install -r requirements.txt
   ```

2. Run the FastAPI server:
   ```sh
   uvicorn server:app --reload
   ```

## Configuration
- Set your PlagiarismSearch API credentials as environment variables or in a `.env` file.

## Endpoints
- See `doc.md` for API endpoint documentation. 