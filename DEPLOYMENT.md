# 🚀 Deployment Guide

## Option 1: Deploy to Vercel + Render (Recommended)

### Step 1: Setup GitHub Repository

1. **Create GitHub repo:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ai-placement-assistant.git
   git branch -M main
   git push -u origin main
   ```

2. **Create `.env` files for GitHub:**
   - Never commit `.env` files - they're in `.gitignore`
   - Use `.env.example` as reference

### Step 2: Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework**: Next.js
   - **Root Directory**: ./
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL (add after deploying backend)
6. Click "Deploy"

**Your frontend URL:** `https://your-project.vercel.app`

### Step 3: Deploy Backend (Render)

1. Go to [render.com](https://render.com)
2. Click "Create +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name**: ai-placement-assistant-api
   - **Environment**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: ./
5. Add environment variables:
   ```
   GEMINI_API_KEY=your_api_key
   CORS_ORIGINS=https://your-project.vercel.app
   ```
6. Click "Create Web Service"

**Your backend URL:** `https://ai-placement-assistant-api.onrender.com`

### Step 4: Update Frontend Environment

1. Go back to Vercel project settings
2. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: `https://ai-placement-assistant-api.onrender.com`
3. Redeploy frontend

---

## Option 2: Deploy Both on Heroku (Free tier ended, but you can use hobby dynos)

### Prerequisites
- Heroku CLI installed
- Heroku account

### Deploy Backend on Heroku

```bash
# Login
heroku login

# Create app
heroku create ai-placement-assistant-api

# Add environment variables
heroku config:set GEMINI_API_KEY=your_api_key
heroku config:set CORS_ORIGINS=https://your-project.vercel.app

# Deploy
git push heroku main
```

**Your backend URL:** `https://ai-placement-assistant-api.herokuapp.com`

---

## Option 3: Deploy on AWS

### Frontend (CloudFront + S3)
1. Build: `npm run build && npm run export`
2. Upload to S3
3. Setup CloudFront distribution
4. Add custom domain

### Backend (EC2 + Gunicorn + Nginx)
1. Launch EC2 instance (Ubuntu 22.04)
2. SSH and run:
   ```bash
   sudo apt update && sudo apt install python3.10 python3-pip nginx
   git clone your-repo
   cd ai-placement-assistant/backend
   pip install -r requirements.txt
   gunicorn -w 4 -b 127.0.0.1:8000 app.main:app
   ```
3. Setup Nginx as reverse proxy
4. Add SSL with Let's Encrypt
5. Point domain to EC2

---

## Option 4: Deploy on Railway

### Setup (Recommended for ease)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Create two services:

**Service 1: Frontend (Node.js)**
- Build command: `npm run build`
- Start command: `npm start`
- Port: 3000

**Service 2: Backend (Python)**
- Build command: `pip install -r backend/requirements.txt`
- Start command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Port: 8000

5. Add environment variables:
   - Frontend: `NEXT_PUBLIC_API_URL`
   - Backend: `GEMINI_API_KEY`, `CORS_ORIGINS`

---

## Environment Variables Checklist

### Frontend (.env.local or Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend.com
```

### Backend (Render/Heroku/Railway)
```
GEMINI_API_KEY=your_gemini_api_key
APP_NAME=PlacementAI API
DEBUG=False
CORS_ORIGINS=https://your-frontend.com
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE_MB=10
```

---

## Monitoring & Logs

### Vercel
- Logs: Vercel Dashboard → Deployments → Logs
- Monitoring: Analytics tab

### Render
- Logs: Service → Logs
- Monitoring: Metrics tab

### Heroku
```bash
heroku logs --tail
```

### Railway
- Logs: Service → Logs (real-time)

---

## Troubleshooting

### CORS Errors
- Backend: Ensure `CORS_ORIGINS` includes your frontend URL
- Frontend: Check `NEXT_PUBLIC_API_URL` is set correctly

### Gemini API Errors
- Verify API key is valid
- Check quota at [Google AI Studio](https://aistudio.google.com)
- Ensure internet connection on backend

### 502 Bad Gateway
- Check backend is running: curl your-backend-url/
- Verify environment variables
- Check logs for errors

---

## Performance Tips

1. **Frontend**
   - Enable Vercel Analytics
   - Use Image optimization
   - Enable compression

2. **Backend**
   - Add gunicorn workers: `-w 4`
   - Enable caching headers
   - Monitor CPU/memory usage

3. **API**
   - Cache Gemini responses in DB
   - Rate limit endpoints
   - Add request logging

---

## Security Checklist

- [ ] Never commit `.env` files
- [ ] Use strong GEMINI_API_KEY
- [ ] Enable HTTPS everywhere
- [ ] Set DEBUG=False in production
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Enable CORS carefully (specific domains)
- [ ] Add request rate limiting

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Heroku Docs:** https://devcenter.heroku.com
- **FastAPI Docs:** https://fastapi.tiangolo.com
- **Next.js Docs:** https://nextjs.org/docs
