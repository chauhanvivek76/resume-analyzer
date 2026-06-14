# 📤 GitHub & Deployment Setup

## 🔧 Step 1: Configure Git User (One-time)

```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```

## 🚀 Step 2: Create GitHub Repository

### Option A: Using GitHub Web Interface

1. Go to [github.com/new](https://github.com/new)
2. Enter repository name: `ai-placement-assistant`
3. Add description: "AI-powered placement assistant with resume analysis and interview prep"
4. Choose Public (for portfolio) or Private
5. ⚠️ **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

### Option B: Using GitHub CLI

```bash
# Install GitHub CLI if not already installed
brew install gh

# Login to GitHub
gh auth login

# Create repository
gh repo create ai-placement-assistant --source=. --remote=origin --push
```

## 📤 Step 3: Push to GitHub

Copy your repository URL from GitHub, then run:

```bash
# Set remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/ai-placement-assistant.git

# Push to main branch
git branch -M main
git push -u origin main
```

## ✅ Verify on GitHub

Visit `https://github.com/YOUR_USERNAME/ai-placement-assistant`

You should see:
- All source code
- `DEPLOYMENT.md` with deployment instructions
- `README.md` with project info
- `.gitignore` excluding sensitive files

---

## 🚀 Choose Your Deployment Platform

### ⭐ Recommended: Vercel (Frontend) + Render (Backend)

[See DEPLOYMENT.md for detailed instructions](./DEPLOYMENT.md)

**Why?**
- Vercel: Perfect for Next.js, free tier, automatic deployments
- Render: Python-friendly, free tier with auto-redeploy on push
- Both: Automatic deployments on git push!

### Quick Deploy Steps:

#### 1️⃣ Frontend - Vercel

```
1. Visit vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Framework: Next.js
5. Environment Variables:
   - NEXT_PUBLIC_API_URL = (add after backend deployed)
6. Click Deploy
```

#### 2️⃣ Backend - Render

```
1. Visit render.com
2. Click "New +" → "Web Service"
3. Connect GitHub account
4. Select your repository
5. Configure:
   - Name: ai-placement-assistant-api
   - Environment: Python 3
   - Build: pip install -r backend/requirements.txt
   - Start: cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
6. Environment Variables:
   - GEMINI_API_KEY = your_key_here
   - CORS_ORIGINS = https://your-vercel-app.vercel.app
7. Click Deploy
```

#### 3️⃣ Update Frontend Environment

```
1. Go to Vercel Project Settings
2. Environment Variables
3. Add NEXT_PUBLIC_API_URL = https://your-render-backend.onrender.com
4. Redeploy
```

---

## 🔄 Auto-Deployment Workflow

After setup, here's how it works:

```
You push code to GitHub
    ↓
Vercel automatically:
  - Pulls latest code
  - Runs npm run build
  - Deploys to production
  - Updates https://your-app.vercel.app
    ↓
Render automatically:
  - Pulls latest code
  - Installs dependencies
  - Runs uvicorn server
  - Updates https://your-api.onrender.com
```

**That's it!** No manual deployment needed going forward.

---

## 🔐 Secrets Management

⚠️ **NEVER commit secrets!** Use environment variables:

### Local Development
```bash
# .env.local (not in git)
NEXT_PUBLIC_API_URL=http://localhost:8000

# backend/.env (not in git)
GEMINI_API_KEY=your_key_here
```

### Production (Vercel/Render)
- Set in platform's environment variable settings
- Automatically loaded by the platform

---

## 📝 Git Workflow Going Forward

```bash
# Make changes locally
nano src/app/page.tsx

# Test locally
npm run dev
# Backend: cd backend && uvicorn app.main:app --reload

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push

# Automatic deployment happens! ✨
```

---

## 🐛 Debugging Deployments

### Vercel Issues
```bash
# View logs
vercel logs

# View deployment info
vercel list

# Rebuild
vercel --prod
```

### Render Issues
```
1. Visit render.com → your-project
2. Click "Logs" tab
3. Check latest deployment logs
4. Look for errors in build or start commands
```

---

## 📚 Next Steps

1. ✅ Push to GitHub
2. ✅ Deploy frontend to Vercel
3. ✅ Deploy backend to Render
4. ✅ Test live application
5. ✅ Share with friends/portfolio

## 🎯 Complete Project Features

- ✅ Resume Analyzer (Gemini AI)
- ✅ ATS Score Calculator (Gemini AI)
- ⏳ Interview Questions Generator (Gemini AI) - Ready in backend
- ⏳ Skill Gap Analysis (Gemini AI) - Ready in backend
- ⏳ Career Roadmap (Gemini AI) - Ready in backend

---

## 📞 Need Help?

- **GitHub Issues:** Create issue in your repo
- **Vercel Support:** vercel.com/support
- **Render Support:** render.com/docs
- **FastAPI Docs:** fastapi.tiangolo.com
- **Next.js Docs:** nextjs.org/docs

---

## 🎉 You're Done!

Your AI Placement Assistant is now deployed and accessible to the world! 🚀

Share your deployment URL with:
- Your portfolio
- GitHub profile
- LinkedIn
- Resume

Good luck with your placements! 💪
