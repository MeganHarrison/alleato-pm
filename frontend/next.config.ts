import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Proxy chatkit requests to the Alleato RAG backend (port 8051)
  async rewrites() {
    return [
      {
        source: "/rag-chatkit",
        destination: "http://127.0.0.1:8051/rag-chatkit",
      },
      {
        source: "/rag-chatkit/:path*",
        destination: "http://127.0.0.1:8051/rag-chatkit/:path*",
      },
      {
        source: "/chatkit",
        destination: "http://127.0.0.1:8051/rag-chatkit",
      },
      {
        source: "/chatkit/:path*",
        destination: "http://127.0.0.1:8051/rag-chatkit/:path*",
      },
    ];
  },
};

export default nextConfig;
