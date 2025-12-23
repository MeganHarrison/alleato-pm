# Starting the Python Backend with Debugging

## Quick Start

1. **Open a new terminal window**
2. **Navigate to the python-backend directory:**
   ```bash
   cd python-backend
   ```

3. **Run the startup script:**
   ```bash
   ./start-backend.sh
   ```

## What You'll See

The startup script will:
- ✅ Create/activate Python virtual environment
- ✅ Install dependencies from requirements.txt
- ✅ Start FastAPI server on http://localhost:8051
- ✅ Enable detailed debug logging

## Debug Logging

Once running, you'll see detailed logs for:

### In the Python Backend Terminal:
- **Incoming requests**: Every POST/GET to /rag-chatkit
- **Agent handoffs**: When the system switches between agents
- **Tool calls**: When agents use search/retrieval tools
- **Errors**: Full stack traces with line numbers

### In the Browser Console (F12):
- **[Chat Debug] Sending message**: What you're sending
- **[Chat Debug] Response status**: HTTP status code (200 = success, 404 = backend not running)
- **[Chat Debug] Response payload**: Full response from the backend
- **[Chat Debug] Error occurred**: Any client-side errors

## Troubleshooting

### Backend returns 404
- The Python backend isn't running
- Run `./start-backend.sh` in the python-backend directory

### Backend starts but crashes
- Check if you have required environment variables in `.env`:
  - `OPENAI_API_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_KEY`

### Port 8051 already in use
```bash
# Find and kill the process
lsof -ti:8051 | xargs kill -9
# Then restart
./start-backend.sh
```

### Dependencies won't install
```bash
# Manually create venv and install
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

## Testing the Backend Directly

Once running, test it with curl:

```bash
# Test if backend is alive
curl http://localhost:8051/rag-chatkit/bootstrap

# Should return JSON with thread_id and agent info
```

## Running Both Servers

You need **TWO terminal windows**:

**Terminal 1 - Frontend (Next.js):**
```bash
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Backend (Python/FastAPI):**
```bash
cd python-backend
./start-backend.sh
# Runs on http://localhost:8051
```

The Next.js config automatically proxies `/rag-chatkit/*` requests to the Python backend.

## Stopping the Backend

Press `Ctrl+C` in the terminal running the backend.
