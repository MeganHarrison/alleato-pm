#!/bin/bash

# Backend Deployment Script
# Usage: ./deploy.sh [platform]

set -e

PLATFORM=${1:-docker}
IMAGE_NAME="alleato-backend"
VERSION=$(date +%Y%m%d%H%M%S)

echo "🚀 Deploying Alleato Backend..."
echo "Platform: $PLATFORM"
echo "Version: $VERSION"

case $PLATFORM in
  docker)
    echo "📦 Building Docker image..."
    docker build -t $IMAGE_NAME:$VERSION -t $IMAGE_NAME:latest .
    echo "✅ Docker image built successfully"
    echo "Run with: docker run -p 8000:8000 --env-file .env.production $IMAGE_NAME:latest"
    ;;
    
  railway)
    echo "🚂 Deploying to Railway..."
    if ! command -v railway &> /dev/null; then
      echo "❌ Railway CLI not found. Install with: npm install -g @railway/cli"
      exit 1
    fi
    railway up
    ;;
    
  fly)
    echo "✈️ Deploying to Fly.io..."
    if ! command -v fly &> /dev/null; then
      echo "❌ Fly CLI not found. Install from: https://fly.io/install.sh"
      exit 1
    fi
    fly deploy --config deploy/fly.toml
    ;;
    
  compose)
    echo "🐳 Starting with Docker Compose..."
    docker-compose -f docker-compose.production.yml up --build -d
    echo "✅ Services started"
    echo "View logs: docker-compose -f docker-compose.production.yml logs -f"
    ;;
    
  test)
    echo "🧪 Testing production build locally..."
    docker build -t $IMAGE_NAME:test .
    docker run --rm -p 8000:8000 --env-file .env.production $IMAGE_NAME:test
    ;;
    
  *)
    echo "❌ Unknown platform: $PLATFORM"
    echo "Available platforms: docker, railway, fly, compose, test"
    exit 1
    ;;
esac

echo "✨ Deployment complete!"