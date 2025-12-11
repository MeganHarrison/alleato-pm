# Alleato Procore API Documentation

## Overview

The Alleato Procore application provides a comprehensive API split between two main services:

1. **Frontend API** (Next.js) - Port 3000/3001
   - Handles CRUD operations for projects, commitments, companies
   - Manages authentication via Supabase
   - Provides data access layer for the UI

2. **Backend API** (FastAPI) - Port 8051
   - Handles RAG-based chat functionality
   - Manages agent workflows and AI interactions
   - Processes document ingestion and search

## API Documentation Access

### Interactive Documentation

The API documentation is available in multiple formats:

1. **Swagger UI** (Interactive)
   - Frontend: http://localhost:3000/api-docs
   - Backend FastAPI: http://localhost:8051/docs

2. **ReDoc** (Alternative UI)
   - Backend FastAPI: http://localhost:8051/redoc

3. **OpenAPI Specification**
   - JSON: `/openapi.json`
   - YAML: `/openapi.yaml`

### Key API Endpoints

#### Projects
- `GET /api/projects` - List all projects with pagination and filtering
- `GET /api/projects/{id}` - Get project details with tasks and insights
- `POST /api/projects` - Create a new project

#### Financial Management
- `GET /api/commitments` - List commitments with filtering
- `POST /api/commitments` - Create a new commitment
- `DELETE /api/commitments/{id}` - Delete a commitment

#### RAG Chat
- `POST /api/chat` - Simple chat endpoint (returns JSON)
- `POST /api/rag-chat-simple` - Non-streaming RAG chat
- `POST /rag-chatkit` - Streaming chat interface (SSE)
- `GET /rag-chatkit/bootstrap` - Initialize chat session
- `GET /rag-chatkit/state` - Get chat conversation state

#### Authentication
- `POST /api/auth/signup` - Create new user account
- Authentication is handled via NextAuth.js and Supabase

#### System
- `GET /health` - Backend health check
- `GET /api/health` - Frontend API health check

## Authentication

The API uses JWT-based authentication through Supabase. Include the authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API follows standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error
- `503` - Service Unavailable

Error responses include a JSON body with details:

```json
{
  "error": "Error message",
  "details": "Additional context"
}
```

## Rate Limiting

Currently, there are no rate limits implemented. This may change in production.

## CORS

CORS is configured to allow requests from:
- http://localhost:3000
- http://localhost:3001
- http://localhost:8080

## Development

### Running the APIs

1. Frontend API (Next.js):
   ```bash
   cd frontend
   npm run dev
   ```

2. Backend API (FastAPI):
   ```bash
   cd backend
   python -m uvicorn src.api.main:app --reload --port 8051
   ```

### Testing the API

You can test the API using:
- The Swagger UI interface
- curl commands
- Postman or similar tools
- The built-in "Try it out" feature in Swagger UI

### Extending the API

1. **Frontend API Routes**: Add new routes in `frontend/src/app/api/`
2. **Backend Endpoints**: Add new endpoints in `backend/src/api/main.py`
3. **Update OpenAPI**: Modify `docs/openapi.yaml` and regenerate JSON

## Environment Variables

Required environment variables:

```env
# Frontend
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend
OPENAI_API_KEY=your-openai-api-key
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-service-key
```

## Support

For API support or questions:
- Check the interactive documentation
- Review the OpenAPI specification
- Submit issues to the project repository