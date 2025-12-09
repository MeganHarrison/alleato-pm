import { NextRequest, NextResponse } from 'next/server';

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8051';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[RAG Simple API] 📨 Incoming request at', new Date().toISOString());
    console.log('[RAG Simple API] 📝 Message:', body.message);
    console.log('[RAG Simple API] 📚 History length:', body.history?.length || 0);
    console.log('[RAG Simple API] 🎯 Target:', `${PYTHON_BACKEND_URL}/api/rag-chat-simple`);

    const response = await fetch(`${PYTHON_BACKEND_URL}/api/rag-chat-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const elapsed = Date.now() - startTime;
    console.log(`[RAG Simple API] ⏱️  Response received in ${elapsed}ms`);
    console.log('[RAG Simple API] 📊 Status:', response.status, response.statusText);

    const data = await response.json();

    if (!response.ok) {
      console.error('[RAG Simple API] ❌ Backend error:', data);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      return NextResponse.json(
        {
          error: 'Backend Error',
          message: data.detail || data.message || 'The AI backend returned an error',
          details: data,
        },
        { status: response.status }
      );
    }

    console.log('[RAG Simple API] ✅ Success! Response:', {
      responseLength: data.response?.length || 0,
      retrievedCount: data.retrieved?.length || 0,
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return NextResponse.json(data);

  } catch (error: any) {
    const elapsed = Date.now() - startTime;
    console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('[RAG Simple API] ❌ ERROR after', elapsed, 'ms');
    console.error('[RAG Simple API] 🔥 Error type:', error.name);
    console.error('[RAG Simple API] 💥 Error message:', error.message);

    if (error.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      console.error('[RAG Simple API] 🔌 Connection refused - Python backend is not running!');
      console.error('[RAG Simple API] 💡 Solution: Run `cd python-backend && ./start-backend.sh`');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      return NextResponse.json(
        {
          error: 'Backend Not Running',
          message: '🔌 The Python AI backend is not running. Please start it with: cd python-backend && ./start-backend.sh',
          details: {
            backendUrl: `${PYTHON_BACKEND_URL}/api/rag-chat-simple`,
            errorType: 'ECONNREFUSED',
            solution: 'Start the Python backend server',
          },
        },
        { status: 503 }
      );
    }

    console.error('[RAG Simple API] 📋 Full error:', error);
    console.error('[RAG Simple API] 🔍 Stack trace:', error.stack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while processing your request',
        details: process.env.NODE_ENV === 'development' ? {
          errorMessage: error.message,
          errorType: error.name,
        } : undefined,
      },
      { status: 500 }
    );
  }
}
