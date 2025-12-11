import { NextResponse } from 'next/server';

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8051';

export async function GET() {
  try {
    console.log('[RAG-ChatKit Bootstrap] 🚀 Fetching bootstrap state from Python backend...');

    const response = await fetch(`${PYTHON_BACKEND_URL}/rag-chatkit/bootstrap`);
    const data = await response.json();

    console.log('[RAG-ChatKit Bootstrap] ✅ Bootstrap data received:', {
      hasThreadId: !!data.thread_id,
      currentAgent: data.current_agent,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[RAG-ChatKit Bootstrap] ❌ Error:', error.message);

    if (error.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      console.error('[RAG-ChatKit Bootstrap] 🔌 Python backend not running!');
      return NextResponse.json(
        {
          error: 'Backend Not Running',
          message: 'Python backend is not running. Start it with: cd python-backend && ./start-backend.sh',
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
