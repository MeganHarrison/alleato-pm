# Render Deployment Guide for Alleato-Procore Backend

This guide provides step-by-step instructions for deploying the Alleato-Procore backend to Render.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: Have your API keys ready:
   - OpenAI API Key
   - Supabase URL
   - Supabase Service Key
   - Supabase Anon Key

## Deployment Method 1: Using Render Dashboard (Recommended)

### Step 1: Connect GitHub Repository

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** button in the top right
3. Select **"Blueprint"** (this will use the `render.yaml` file)
4. Connect your GitHub account if not already connected
5. Select the `alleato-procore` repository
6. Render will automatically detect the `render.yaml` file in the repository root

### Step 2: Configure Environment Variables

Render will prompt you to set the following environment variables (marked as `sync: false` in render.yaml):

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | `sk-proj-...` |
| `SUPABASE_URL` | Your Supabase project URL | `https://lgveqfnpkxvzbnnwuled.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | `eyJhbGc...` |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |

**Note**: The following variables are already set in `render.yaml`:
- `PORT=8000` (automatically set by Render)
- `USE_UNIFIED_AGENT=true` (uses simpler, faster unified agent)
- `CORS_ORIGINS` (configured for production frontend)

### Step 3: Deploy

1. Review the service configuration
2. Click **"Apply"** to create the service
3. Render will:
   - Build the Docker image from `backend/Dockerfile`
   - Deploy the container
   - Set up health checks at `/health`
   - Provide you with a URL (e.g., `https://alleato-backend.onrender.com`)

### Step 4: Verify Deployment

1. Wait for the build to complete (5-10 minutes)
2. Check the health endpoint: `https://your-service.onrender.com/health`
3. Expected response:
   ```json
   {
     "status": "healthy",
     "openai_configured": true,
     "rag_available": true,
     "timestamp": "2025-12-18T..."
   }
   ```

## Deployment Method 2: Using Render CLI

### Step 1: Install Render CLI

```bash
# Install via Homebrew (Mac)
brew tap render-oss/render
brew install render

# Or download from https://render.com/docs/cli
```

### Step 2: Login to Render

```bash
render login
```

### Step 3: Deploy from Backend Directory

```bash
cd backend
render deploy
```

The CLI will use the `render.yaml` file and guide you through setting environment variables.

## Deployment Method 3: Manual Web Service Creation

If you prefer not to use the Blueprint/render.yaml:

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `alleato-backend`
   - **Runtime**: Docker
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Docker Build Context Directory**: `backend`
4. Set environment variables (see table above)
5. Configure:
   - **Health Check Path**: `/health`
   - **Plan**: Free tier or paid (recommended for production)
6. Click **"Create Web Service"**

## Post-Deployment Configuration

### 1. Update Frontend Configuration

Update your frontend's environment variables to point to the Render backend:

```env
# frontend/.env.production
NEXT_PUBLIC_API_URL=https://your-service.onrender.com
```

### 2. Update CORS Origins

If your frontend is hosted at a different domain, update the `CORS_ORIGINS` in Render:

1. Go to your service in Render Dashboard
2. Navigate to **Environment** tab
3. Add/update `CORS_ORIGINS`:
   ```
   https://your-frontend-domain.com,https://www.your-frontend-domain.com
   ```

### 3. Configure Custom Domain (Optional)

1. In Render Dashboard, go to **Settings** → **Custom Domains**
2. Add your domain (e.g., `api.yourdomain.com`)
3. Follow Render's DNS configuration instructions
4. Enable automatic SSL certificate

## Monitoring & Maintenance

### View Logs

```bash
# Using CLI
render logs

# Or via Dashboard
# Navigate to your service → Logs tab
```

### Check Service Status

```bash
curl https://your-service.onrender.com/health
```

### Restart Service

```bash
# Using CLI
render restart

# Or via Dashboard
# Navigate to your service → Manual Deploy → Restart
```

### Update Deployment

Render automatically deploys when you push to your main branch. To trigger manual deployment:

1. Go to Render Dashboard → Your Service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

## Troubleshooting

### Build Failures

**Issue**: Build fails with dependency errors

**Solution**: Check `requirements.txt` has all dependencies:
```bash
cd backend
pip freeze > requirements.txt
```

### Health Check Failures

**Issue**: Service starts but health checks fail

**Solutions**:
1. Check environment variables are set correctly
2. Verify OpenAI API key is valid
3. Check Supabase connection:
   ```bash
   curl -X GET "https://your-service.onrender.com/health"
   ```

### CORS Errors

**Issue**: Frontend can't connect to backend

**Solutions**:
1. Add frontend domain to `CORS_ORIGINS` environment variable
2. Ensure frontend is using HTTPS in production
3. Check Network tab in browser DevTools for exact error

### Out of Memory

**Issue**: Service crashes with memory errors

**Solutions**:
1. Upgrade to a paid plan with more memory
2. Review code for memory leaks
3. Optimize agent workflow memory usage

### Slow Response Times

**Issue**: API responses are slow

**Solutions**:
1. Check OpenAI API rate limits
2. Consider upgrading Render plan for better performance
3. Implement caching for frequently accessed data
4. Use `USE_UNIFIED_AGENT=true` for faster responses

## Environment Variables Reference

### Required Variables

```bash
OPENAI_API_KEY=sk-proj-xxxxx          # OpenAI API key
SUPABASE_URL=https://xxx.supabase.co  # Supabase project URL
SUPABASE_SERVICE_KEY=eyJhbGc...       # Supabase service role key
SUPABASE_ANON_KEY=eyJhbGc...          # Supabase anon key
```

### Optional Variables

```bash
PORT=8000                              # Port (automatically set by Render)
USE_UNIFIED_AGENT=true                 # Use unified agent (faster)
CORS_ORIGINS=https://example.com       # Allowed CORS origins
LANGFUSE_PUBLIC_KEY=pk-...             # LangFuse tracing (optional)
LANGFUSE_SECRET_KEY=sk-...             # LangFuse tracing (optional)
LANGFUSE_HOST=https://cloud.langfuse.com  # LangFuse host (optional)
LOG_LEVEL=INFO                         # Logging level
```

## API Endpoints

Once deployed, your backend will expose:

### Health & Status
- `GET /health` - Health check endpoint
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)

### RAG Chat Endpoints
- `POST /rag-chatkit` - Main streaming chat endpoint (ChatKit protocol)
- `GET /rag-chatkit/state?thread_id=xxx` - Get conversation state
- `GET /rag-chatkit/bootstrap` - Bootstrap new conversation
- `POST /api/rag-chat-simple` - Simple non-streaming chat endpoint

### Project & Knowledge Endpoints
- `GET /api/projects` - List all projects
- `GET /api/projects/{project_id}` - Get project details
- `POST /api/chat` - Simple chat with keyword search

### Ingestion Endpoints
- `POST /api/ingest/fireflies` - Ingest Fireflies transcript

## Cost Considerations

### Free Tier Limitations
- Services sleep after 15 minutes of inactivity
- 750 hours per month
- Good for development and testing

### Paid Plans
- **Starter ($7/mo)**: No sleep, better performance
- **Standard ($25/mo)**: More memory, faster CPU
- **Pro ($85/mo)**: Production-grade resources

### Cost Optimization Tips
1. Use `USE_UNIFIED_AGENT=true` to reduce OpenAI API calls
2. Implement caching for repeated queries
3. Monitor OpenAI API usage in OpenAI dashboard
4. Consider upgrading only when needed

## Security Best Practices

1. **Never commit secrets** - Use Render's environment variables
2. **Rotate API keys regularly** - Update in Render dashboard
3. **Use HTTPS only** - Render provides automatic SSL
4. **Restrict CORS** - Only allow your frontend domain
5. **Monitor logs** - Check for suspicious activity
6. **Keep dependencies updated** - Regular security updates

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Verify health endpoint
3. ✅ Update frontend environment variables
4. ✅ Test API endpoints
5. ✅ Configure custom domain (optional)
6. ✅ Set up monitoring and alerts
7. ✅ Deploy frontend to Vercel/Netlify

## Support

- **Render Documentation**: https://render.com/docs
- **Render Community**: https://community.render.com
- **OpenAI API**: https://platform.openai.com/docs
- **Supabase Docs**: https://supabase.com/docs

## Additional Resources

- [Backend README](./README.md) - Backend architecture and development
- [DEPLOYMENT.md](./DEPLOYMENT.md) - General deployment guide
- [Render Blueprint Spec](https://render.com/docs/blueprint-spec) - render.yaml reference
