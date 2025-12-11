import { NextRequest, NextResponse } from 'next/server';

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8051';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const threadId = url.searchParams.get('thread_id');

  try {
    console.log('[RAG-ChatKit State] 🚀 Fetching state for thread:', threadId);

    const response = await fetch(`${PYTHON_BACKEND_URL}/rag-chatkit/state?thread_id=${threadId}`);
    const data = await response.json();

    console.log('[RAG-ChatKit State] ✅ State data received');

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[RAG-ChatKit State] ❌ Error:', error.message);

    if (error.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      return NextResponse.json(
        {
          error: 'Backend Not Running',
          message: 'Python backend is not running',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
