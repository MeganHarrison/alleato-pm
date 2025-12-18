# Render Quick Start - Alleato Backend Deployment

## TL;DR - Deploy in 5 Minutes

### Prerequisites
- GitHub account with alleato-procore repository
- Render account (sign up at [render.com](https://render.com))
- API keys ready:
  - OpenAI API Key
  - Supabase URL, Service Key, and Anon Key

### Quick Deploy Steps

1. **Login to Render**
   - Go to https://dashboard.render.com
   - Connect your GitHub account

2. **Create New Blueprint**
   - Click **"New +"** → **"Blueprint"**
   - Select `alleato-procore` repository
   - Render auto-detects `render.yaml` at repository root

3. **Set Environment Variables**
   When prompted, enter:
   ```
   OPENAI_API_KEY=sk-proj-your-key-here
   SUPABASE_URL=https://lgveqfnpkxvzbnnwuled.supabase.co
   SUPABASE_SERVICE_KEY=your-service-key-here
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Click "Apply"**
   - Render builds Docker image (~5-10 mins)
   - Auto-deploys with health checks
   - Provides URL: `https://alleato-backend.onrender.com`

5. **Verify**
   ```bash
   curl https://your-service.onrender.com/health
   ```

   Expected response:
   ```json
   {
     "status": "healthy",
     "openai_configured": true,
     "rag_available": true
   }
   ```

6. **Update Frontend**
   ```bash
   # In frontend/.env.production
   NEXT_PUBLIC_API_URL=https://your-service.onrender.com
   ```

## What's Already Configured

✅ **render.yaml** - Blueprint in repository root
✅ **Dockerfile** - Optimized for production with health checks
✅ **CORS** - Pre-configured for Vercel frontend
✅ **Health Checks** - `/health` endpoint with OpenAI validation
✅ **Unified Agent** - Faster agent mode enabled by default

## Files Created/Modified

- `render.yaml` - Root level blueprint for Render
- `backend/render.yaml` - Backend-specific configuration
- `backend/Dockerfile` - Updated with production settings
- `backend/RENDER_DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
- `.claude/settings.json` - Added Render MCP server

## What Gets Deployed

- **Service Name**: alleato-backend
- **Runtime**: Docker (Python 3.11)
- **Port**: 8000 (configurable via PORT env var)
- **Health Check**: `/health` endpoint
- **Auto-scaling**: Configured via Render dashboard
- **SSL**: Automatic HTTPS certificate

## API Endpoints Available

Once deployed:

- `GET /health` - Health check
- `GET /docs` - Swagger UI documentation
- `POST /rag-chatkit` - Streaming chat endpoint
- `POST /api/rag-chat-simple` - Simple JSON chat
- `GET /api/projects` - List projects
- More endpoints in [RENDER_DEPLOYMENT_GUIDE.md](backend/RENDER_DEPLOYMENT_GUIDE.md)

## Troubleshooting

### Build Fails
- Check `backend/requirements.txt` is up to date
- Review build logs in Render dashboard

### Health Check Fails
- Verify environment variables in Render
- Check OpenAI API key is valid
- Ensure Supabase URL is correct

### CORS Errors
- Update `CORS_ORIGINS` in Render environment variables
- Format: `https://domain1.com,https://domain2.com`

## Next Steps

1. Deploy backend to Render (follow steps above)
2. Get your backend URL from Render
3. Update frontend environment variables
4. Deploy frontend to Vercel
5. Test end-to-end functionality

## Get API Key from Render

After deploying, you may want to get a Render API key for the MCP server:

1. Go to [Account Settings](https://dashboard.render.com/u/settings/api-keys)
2. Create new API key
3. Add to `.claude/settings.json`:
   ```json
   {
     "mcpServers": {
       "render": {
         "env": {
           "RENDER_API_KEY": "your-key-here"
         }
       }
     }
   }
   ```

## Cost

- **Free Tier**: 750 hours/month, service sleeps after 15 min inactivity
- **Starter ($7/mo)**: No sleep, better performance
- **Recommended for Production**: Starter or Standard plan

## Support

Full documentation: [backend/RENDER_DEPLOYMENT_GUIDE.md](backend/RENDER_DEPLOYMENT_GUIDE.md)

Questions? Check:
- [Render Docs](https://render.com/docs)
- [Backend README](backend/README.md)
