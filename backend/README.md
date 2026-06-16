# Backend – PlacementAI

Python backend that exposes REST APIs for resume analysis, ATS scoring, interview question generation, skill gap detection, and career roadmap generation using the Gemini API.

## 🔧 Tech

- Python
- FastAPI / Flask (update this)
- Gemini AI API
- Uvicorn / Gunicorn (for serving)

## 📦 Setup

```bash
cd backend
pip install -r requirements.txt
```

Create `.env` in `backend/`:

```bash
GEMINI_API_KEY=your_gemini_api_key
```

## ▶️ Run Locally

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.

## 🌐 Main Endpoints (examples)

- `POST /analyze-resume`  
  - Body: `{ "resume_text": "...", "job_role": "SDE" }`  
  - Returns: feedback, strengths, weaknesses, missing points.

- `POST /ats-score`  
  - Body: `{ "resume_text": "...", "job_description": "..." }`  
  - Returns: ATS score, keyword match analysis.

- `POST /interview-questions`  
  - Body: `{ "role": "Frontend Developer", "experience": "Fresher" }`  
  - Returns: list of tailored interview questions.

Update the endpoint names and payloads to match your actual code.
