# Render Deployment Checklist

## ✅ Pre-Deployment Setup (COMPLETE)

All configuration files have been created and are ready for deployment:

### Configuration Files
- ✅ `render.yaml` (root) - Blueprint configuration
- ✅ `backend/render.yaml` - Backend-specific config
- ✅ `backend/Dockerfile` - Production-optimized Docker image
- ✅ `.claude/settings.json` - Render MCP configured

### Documentation
- ✅ `RENDER_QUICK_START.md` - 5-minute deployment guide
- ✅ `RENDER_SETUP_SUMMARY.md` - Complete setup summary
- ✅ `backend/RENDER_DEPLOYMENT_GUIDE.md` - Comprehensive guide
- ✅ `DEPLOYMENT_CHECKLIST.md` - This checklist

## 🚀 Deployment Steps (DO NOW)

### Step 1: Commit Changes
```bash
cd /Users/meganharrison/Documents/github/alleato-procore
git add .
git commit -m "feat: Add Render deployment configuration for backend

- Add render.yaml blueprints (root and backend)
- Update Dockerfile for production deployment
- Add comprehensive deployment documentation
- Configure Render MCP in Claude settings
- Set USE_UNIFIED_AGENT for better performance"
git push origin main
```

### Step 2: Gather API Keys
Before deploying, have these ready:

- [ ] OpenAI API Key: `sk-proj-...`
  - Get from: https://platform.openai.com/api-keys
  
- [ ] Supabase URL: `https://lgveqfnpkxvzbnnwuled.supabase.co`
  - Get from: Supabase Project Settings
  
- [ ] Supabase Service Key: `eyJhbGc...`
  - Get from: Supabase Settings → API → service_role key
  
- [ ] Supabase Anon Key: `eyJhbGc...`
  - Get from: Supabase Settings → API → anon public key

### Step 3: Deploy to Render

#### Option A: Dashboard (Recommended)
1. [ ] Go to https://dashboard.render.com
2. [ ] Click "New +" → "Blueprint"
3. [ ] Connect GitHub and select `alleato-procore` repo
4. [ ] Render detects `render.yaml` automatically
5. [ ] Enter environment variables (from Step 2)
6. [ ] Click "Apply"
7. [ ] Wait 5-10 minutes for deployment
8. [ ] Copy your service URL (e.g., `https://alleato-backend.onrender.com`)

#### Option B: Use Render MCP (After Restart)
1. [ ] Restart Claude Code to load Render MCP
2. [ ] Ask Claude: "List my Render services"
3. [ ] Ask Claude: "Create a new Render service from render.yaml"
4. [ ] Provide environment variables when prompted

### Step 4: Verify Deployment
```bash
# Replace with your actual Render URL
curl https://your-service.onrender.com/health

# Expected response:
# {
#   "status": "healthy",
#   "openai_configured": true,
#   "rag_available": true,
#   "timestamp": "2025-12-18T..."
# }
```

- [ ] Health check returns `"status": "healthy"`
- [ ] `"openai_configured": true`
- [ ] `"rag_available": true`

### Step 5: Test API Endpoints
- [ ] Visit Swagger UI: `https://your-service.onrender.com/docs`
- [ ] Test health endpoint
- [ ] Test RAG chat endpoint
- [ ] Test projects API

### Step 6: Update Frontend
```bash
# Update frontend/.env.production
NEXT_PUBLIC_API_URL=https://your-service.onrender.com
```

- [ ] Update frontend environment variable
- [ ] Commit and push changes
- [ ] Deploy frontend to Vercel
- [ ] Test end-to-end functionality

## 📋 Post-Deployment (Optional)

### Configure Custom Domain
- [ ] Add custom domain in Render Settings
- [ ] Update DNS records
- [ ] Enable automatic SSL

### Set Up Monitoring
- [ ] Configure health check alerts in Render
- [ ] Set up uptime monitoring
- [ ] Review logs for any errors

### Update CORS if Needed
If frontend is on a different domain:
- [ ] Add domain to `CORS_ORIGINS` in Render
- [ ] Format: `https://domain1.com,https://domain2.com`

### Get Render API Key for MCP
- [ ] Go to https://dashboard.render.com/u/settings/api-keys
- [ ] Create new API key
- [ ] Add to `.claude/settings.json`:
  ```json
  "render": {
    "env": {
      "RENDER_API_KEY": "rnd_your_key_here"
    }
  }
  ```

## 🔍 Verification Tests

After deployment, test these endpoints:

```bash
# Replace YOUR_URL with actual Render URL
export API_URL=https://your-service.onrender.com

# 1. Health Check
curl $API_URL/health

# 2. API Documentation
open $API_URL/docs

# 3. Projects List
curl $API_URL/api/projects

# 4. Simple Chat (requires OpenAI)
curl -X POST $API_URL/api/rag-chat-simple \
  -H "Content-Type: application/json" \
  -d '{"message": "What projects do we have?"}'
```

## 📊 Monitoring

### Check Service Status
- Dashboard: https://dashboard.render.com
- Logs: View in Render Dashboard → Your Service → Logs
- Metrics: View in Render Dashboard → Your Service → Metrics

### Common Issues
If you encounter issues, check:
- [ ] Environment variables are set correctly
- [ ] OpenAI API key is valid and has credits
- [ ] Supabase credentials are correct
- [ ] CORS origins include your frontend domain
- [ ] Service has enough resources (upgrade plan if needed)

## 📚 Documentation Reference

- Quick Start: [RENDER_QUICK_START.md](RENDER_QUICK_START.md)
- Full Guide: [backend/RENDER_DEPLOYMENT_GUIDE.md](backend/RENDER_DEPLOYMENT_GUIDE.md)
- Setup Summary: [RENDER_SETUP_SUMMARY.md](RENDER_SETUP_SUMMARY.md)

## 💡 Tips

1. **Free Tier**: Service sleeps after 15 min inactivity
   - First request after sleep takes ~30 seconds
   - Upgrade to Starter ($7/mo) to eliminate sleep

2. **Build Time**: First deployment takes 5-10 minutes
   - Subsequent deployments are faster (~2-3 min)
   - Render caches Docker layers

3. **Auto-Deploy**: Render deploys automatically on push to main
   - Disable in Settings if you want manual control

4. **Environment Variables**: Can be updated without rebuild
   - Go to Dashboard → Your Service → Environment
   - Changes take effect on next deployment

## ✨ What's Configured

Your backend deployment includes:
- 🐳 Docker containerization (Python 3.11)
- 🏥 Automatic health checks (`/health`)
- 🔒 Automatic SSL/HTTPS
- 🌐 CORS pre-configured for Vercel
- ⚡ Unified agent mode (faster responses)
- 📊 Swagger UI documentation (`/docs`)
- 🔧 Dynamic port binding
- 📝 Production-ready logging

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ Health endpoint returns healthy status
- ✅ OpenAI is configured correctly
- ✅ RAG workflow is available
- ✅ API documentation loads at `/docs`
- ✅ Frontend can communicate with backend
- ✅ Chat endpoint responds to queries

## 🆘 Need Help?

1. Check [RENDER_DEPLOYMENT_GUIDE.md](backend/RENDER_DEPLOYMENT_GUIDE.md) troubleshooting section
2. Review Render logs in dashboard
3. Verify environment variables are set
4. Check OpenAI API key is valid
5. Ensure Supabase connection works

---

**Status**: Configuration complete ✅ | Ready to deploy 🚀

**Next**: Follow Step 1 above to commit changes and deploy!
