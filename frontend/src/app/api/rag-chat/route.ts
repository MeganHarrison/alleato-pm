import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple RAG Chat API Route
 *
 * This route proxies chat requests to the Python backend's /api/rag-chat-simple endpoint.
 * Unlike the ChatKit endpoint, this returns JSON directly (not streaming SSE).
 *
 * Used by the SimpleRagChat component as a fallback when ChatKit has CORS issues.
 */

const PYTHON_BACKEND_URL =
  process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000';

interface ChatRequestBody {
  message: string;
  thread_id?: string | null;
  history?: Array<{ role: string; text: string }>;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: ChatRequestBody = await request.json();

    if (!body.message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('[RAG-Chat API] Incoming request:', {
      message: body.message.substring(0, 100),
      hasHistory: !!(body.history && body.history.length > 0),
    });

    // Call the simple RAG chat endpoint (non-streaming)
    const response = await fetch(`${PYTHON_BACKEND_URL}/api/rag-chat-simple`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: body.message,
        history: body.history || [],
      }),
    });

    const elapsed = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[RAG-Chat API] Backend error:', response.status, errorText);

      return NextResponse.json(
        {
          error: 'Backend Error',
          message: `Failed to get response from AI backend (${response.status})`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('[RAG-Chat API] Success in', elapsed, 'ms');

    return NextResponse.json({
      response: data.response,
      retrieved: data.retrieved || [],
      thread_id: body.thread_id || null,
    });

  } catch (error: unknown) {
    const elapsed = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = error && typeof error === 'object' && 'code' in error ? (error as { code: string }).code : null;

    console.error('[RAG-Chat API] Error after', elapsed, 'ms:', errorMessage);

    // Check if backend is not running
    if (errorCode === 'ECONNREFUSED' || errorMessage.includes('fetch failed')) {
      return NextResponse.json(
        {
          error: 'Backend Not Running',
          message: 'The Python AI backend is not running. Please start it with: cd backend && ./start.sh',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
