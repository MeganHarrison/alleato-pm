import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed direct rewrite to Python backend
  // All requests now go through /api/rag-chatkit for better logging and error handling
};

export default nextConfig;
