# PlacementAI – AI Resume & Placement Assistant

An AI-powered platform that analyzes resumes, calculates ATS scores, generates interview questions, identifies skill gaps, and gives career roadmaps for students and job seekers.

## 🔗 Live Demo

[PlacementAI – Live](https://ai-resume-analyzer-pro-gamma.vercel.app/)

## ✨ Features

- **Resume Analyzer** – Upload your resume and get structured feedback on strengths, weaknesses, and missing points.
- **ATS Score Checker** – Estimate how well your resume passes Applicant Tracking Systems based on keywords and formatting.
- **AI Interview Questions** – Generate role-specific interview questions from your resume and job role.
- **Skill Gap Detector** – Find missing skills compared to your target role and get suggestions to improve.
- **Career Roadmap** – Get step-by-step guidance on what to learn or do next based on your profile.
- **AI Career Coach** – Chat-style assistant to answer career and placement-related queries.

## 🧰 Tech Stack

| Layer       | Technologies                                     |
|------------|---------------------------------------------------|
| Frontend   | Next.js, React, TypeScript, Tailwind CSS (if used) |
| Backend    | Python (FastAPI/Flask) + Gemini AI API            |
| Database   | (Mention if you use any: e.g., MongoDB / Postgres / None) |
| Deployment | Vercel (frontend) + \<your backend host\>         |

## 📂 Project Structure

```bash
root
├── src/              # Next.js frontend
├── backend/          # Python API with Gemini integration
├── public/
├── package.json
└── ...
```

## 🚀 Getting Started (Local)

### 1) Frontend (Next.js)

```bash
git clone https://github.com/chauhanvivek76/resume-analyzer.git
cd resume-analyzer

# install dependencies
npm install

# run dev server
npm run dev
# app runs on http://localhost:3000
```

Create a `.env.local` file in the root and add:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

(or whatever your backend URL is).

### 2) Backend (Python)

```bash
cd backend
pip install -r requirements.txt
# or use virtualenv if you prefer
# python -m venv venv && source venv/bin/activate

# run backend (example for FastAPI)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Create a `.env` file in `backend/` and add:

```bash
GEMINI_API_KEY=your_api_key_here
```

## 🌐 Deployment

- **Frontend** deployed on Vercel from the `main` branch.  
- **Backend** deployed on \<platform name\> using `Procfile` and `runtime.txt` (Python server with Gemini API integration).  

## 🧪 Future Improvements

- Add user authentication and resume history.
- Add more detailed analytics for ATS compatibility.
- Improve 
