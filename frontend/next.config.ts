import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Proxy chatkit requests directly to Python backend (like OpenAI demo)
  async rewrites() {
    return [
      {
        source: "/rag-chatkit",
        destination: "http://127.0.0.1:8000/rag-chatkit",
      },
      {
        source: "/rag-chatkit/:path*",
        destination: "http://127.0.0.1:8000/rag-chatkit/:path*",
      },
      {
        source: "/chatkit",
        destination: "http://127.0.0.1:8000/chatkit",
      },
      {
        source: "/chatkit/:path*",
        destination: "http://127.0.0.1:8000/chatkit/:path*",
      },
    ];
  },
};

export default nextConfig;
