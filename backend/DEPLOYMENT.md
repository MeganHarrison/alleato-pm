# Backend Deployment Guide

This guide covers deploying the Alleato-Procore backend API to various cloud platforms.

## Prerequisites

1. **Environment Variables**: Copy `.env.production.template` to `.env.production` and fill in your values:
   ```bash
   cp .env.production.template .env.production
   ```

2. **Required Services**:
   - OpenAI API account with API key
   - Supabase project with service role key
   - Docker installed (for containerized deployments)

## Local Testing

Test the production build locally:

```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.production.yml up --build

# Or build Docker image directly
docker build -t alleato-backend .
docker run -p 8000:8000 --env-file .env.production alleato-backend
```

## Deployment Options

### 1. Railway (Recommended for Quick Deployment)

Railway provides simple, one-click deployments with automatic SSL.

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy from the backend directory
cd backend
railway up
```

The `deploy/railway.json` configuration is already set up. Railway will:
- Build from Dockerfile
- Set up health checks
- Configure environment variables from dashboard
- Provide HTTPS endpoint automatically

### 2. Fly.io

Fly.io offers global edge deployment with built-in scaling.

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login to Fly
fly auth login

# Deploy (from backend directory)
cd backend
fly deploy --config deploy/fly.toml
```

Set environment variables:
```bash
fly secrets set OPENAI_API_KEY=your_key_here
fly secrets set SUPABASE_URL=your_url_here
fly secrets set SUPABASE_SERVICE_KEY=your_key_here
```

### 3. Render

Render provides managed deployments with automatic SSL and zero-downtime deploys.

1. Push your code to GitHub
2. Connect your GitHub repo to Render
3. Use the `deploy/render.yaml` blueprint
4. Set environment variables in Render dashboard

### 4. Google Cloud Run

Cloud Run offers serverless container deployment with automatic scaling.

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/alleato-backend

# Deploy to Cloud Run
gcloud run deploy alleato-backend \
  --image gcr.io/YOUR_PROJECT_ID/alleato-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "PORT=8000" \
  --set-secrets "OPENAI_API_KEY=openai-key:latest,SUPABASE_URL=supabase-url:latest,SUPABASE_SERVICE_KEY=supabase-key:latest"
```

### 5. AWS ECS with Fargate

For AWS deployment:

```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URI
docker build -t alleato-backend .
docker tag alleato-backend:latest YOUR_ECR_URI/alleato-backend:latest
docker push YOUR_ECR_URI/alleato-backend:latest

# Deploy using ECS CLI or Console
# Use the provided task definition template
```

### 6. Kubernetes (Any Provider)

For Kubernetes deployments (GKE, EKS, AKS, or self-managed):

```bash
# Create secrets
kubectl create secret generic alleato-secrets \
  --from-literal=openai-api-key=YOUR_KEY \
  --from-literal=supabase-url=YOUR_URL \
  --from-literal=supabase-service-key=YOUR_KEY

# Apply deployment
kubectl apply -f deploy/kubernetes/deployment.yaml

# Check deployment status
kubectl get pods -l app=alleato-backend
kubectl get service alleato-backend-service
```

### 7. DigitalOcean App Platform

```bash
# Install doctl
# Create app spec based on Docker
doctl apps create --spec - <<EOF
name: alleato-backend
services:
- name: backend
  dockerfile_path: Dockerfile
  source_dir: backend
  http_port: 8000
  health_check:
    http_path: /health
  envs:
  - key: OPENAI_API_KEY
    scope: RUN_TIME
    type: SECRET
  - key: SUPABASE_URL
    scope: RUN_TIME
    type: SECRET
  - key: SUPABASE_SERVICE_KEY
    scope: RUN_TIME
    type: SECRET
EOF
```

## Post-Deployment

### 1. Update CORS Settings

Update the CORS configuration in `src/api/main.py` to include your production domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Configure Frontend

Update your frontend to point to the deployed backend URL:

```env
# frontend/.env.production
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### 3. Monitor Health

All deployments include health checks at `/health`. Monitor this endpoint to ensure the service is running properly.

### 4. Enable SSL/HTTPS

Most platforms provide automatic SSL. For custom deployments:
- Use the included `nginx.conf` with SSL certificates
- Or use a service like Cloudflare for SSL termination

## Scaling Considerations

1. **Horizontal Scaling**: The backend is stateless and can be scaled horizontally
2. **Database Connections**: Monitor Supabase connection limits
3. **Rate Limiting**: Consider implementing rate limiting for OpenAI API calls
4. **Caching**: Add Redis for caching frequently accessed data

## Troubleshooting

### Common Issues

1. **OpenAI API Key Invalid**
   - Check the `/health` endpoint
   - Verify environment variables are set correctly

2. **Supabase Connection Failed**
   - Check Supabase URL and service key
   - Verify network connectivity from deployment

3. **Out of Memory**
   - Increase container memory limits
   - Check for memory leaks in long-running processes

4. **CORS Errors**
   - Update CORS origins in `main.py`
   - Ensure frontend is using HTTPS in production

### Logs

Access logs for each platform:
- Railway: `railway logs`
- Fly.io: `fly logs`
- Cloud Run: `gcloud run services logs read alleato-backend`
- Kubernetes: `kubectl logs -l app=alleato-backend`

## Security Best Practices

1. **Never commit secrets** - Use environment variables or secret management
2. **Enable HTTPS** - All production deployments should use SSL
3. **Restrict CORS** - Only allow your frontend domain
4. **Rate Limiting** - Implement API rate limiting
5. **Regular Updates** - Keep dependencies updated

## Support

For deployment issues:
1. Check the health endpoint: `https://your-api.com/health`
2. Review deployment logs
3. Ensure all environment variables are set
4. Verify Supabase and OpenAI services are accessible