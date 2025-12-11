export const performanceConfig = {
  // Performance budgets based on industry standards
  budgets: {
    javascript: {
      total: 300 * 1024, // 300KB total JS
      firstParty: 200 * 1024, // 200KB first-party JS
      thirdParty: 100 * 1024, // 100KB third-party JS
    },
    css: {
      total: 60 * 1024, // 60KB total CSS
    },
    images: {
      total: 1000 * 1024, // 1MB total images
      individual: 200 * 1024, // 200KB per image
    },
    fonts: {
      total: 100 * 1024, // 100KB total fonts
    },
  },

  // Core Web Vitals thresholds
  webVitals: {
    LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint (ms)
    FID: { good: 100, needsImprovement: 300 },   // First Input Delay (ms)
    CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
    FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint (ms)
    TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte (ms)
  },

  // Routes to test
  routes: [
    { path: '/', name: 'Home', priority: 'high' },
    { path: '/projects', name: 'Projects', priority: 'high' },
    { path: '/commitments', name: 'Commitments', priority: 'high' },
    { path: '/dashboard', name: 'Dashboard', priority: 'medium' },
    { path: '/contracts/new', name: 'New Contract Form', priority: 'medium' },
    { path: '/chat-rag', name: 'Chat Interface', priority: 'low' },
  ],

  // Network conditions to test
  networkConditions: {
    'Fast 3G': {
      downloadThroughput: 1.6 * 1024 * 1024 / 8, // 1.6 Mbps
      uploadThroughput: 750 * 1024 / 8,          // 750 Kbps
      latency: 150,                              // 150ms RTT
    },
    'Slow 3G': {
      downloadThroughput: 500 * 1024 / 8,        // 500 Kbps
      uploadThroughput: 500 * 1024 / 8,          // 500 Kbps
      latency: 400,                              // 400ms RTT
    },
  },

  // Device profiles
  devices: [
    { name: 'Desktop', viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 },
    { name: 'Laptop', viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 },
    { name: 'Tablet', viewport: { width: 768, height: 1024 }, deviceScaleFactor: 2 },
    { name: 'Mobile', viewport: { width: 375, height: 667 }, deviceScaleFactor: 2 },
  ],
};

// Helper to format bytes
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Helper to get performance grade
export function getPerformanceGrade(value: number, thresholds: { good: number, needsImprovement: number }): string {
  if (value <= thresholds.good) return '🟢 Good';
  if (value <= thresholds.needsImprovement) return '🟡 Needs Improvement';
  return '🔴 Poor';
}

// Helper to generate performance report
export function generatePerformanceReport(metrics: any): string {
  const report = `
# Performance Report

## Core Web Vitals
- LCP: ${metrics.LCP}ms ${getPerformanceGrade(metrics.LCP, performanceConfig.webVitals.LCP)}
- FID: ${metrics.FID}ms ${getPerformanceGrade(metrics.FID, performanceConfig.webVitals.FID)}
- CLS: ${metrics.CLS} ${getPerformanceGrade(metrics.CLS, performanceConfig.webVitals.CLS)}

## Page Load Metrics
- First Contentful Paint: ${metrics.FCP}ms
- Time to Interactive: ${metrics.TTI}ms
- Total Blocking Time: ${metrics.TBT}ms

## Resource Usage
- JavaScript: ${formatBytes(metrics.jsSize)}
- CSS: ${formatBytes(metrics.cssSize)}
- Images: ${formatBytes(metrics.imageSize)}
- Total: ${formatBytes(metrics.totalSize)}

## Recommendations
${generateRecommendations(metrics).join('\n')}
`;
  return report;
}

function generateRecommendations(metrics: any): string[] {
  const recommendations = [];

  if (metrics.LCP > performanceConfig.webVitals.LCP.good) {
    recommendations.push('- Optimize largest content paint by lazy loading images and optimizing server response time');
  }

  if (metrics.jsSize > performanceConfig.budgets.javascript.total) {
    recommendations.push('- Reduce JavaScript bundle size through code splitting and tree shaking');
  }

  if (metrics.imageSize > performanceConfig.budgets.images.total) {
    recommendations.push('- Optimize images using WebP format and proper sizing');
  }

  if (metrics.CLS > performanceConfig.webVitals.CLS.good) {
    recommendations.push('- Fix layout shifts by setting explicit dimensions on images and dynamic content');
  }

  return recommendations;
}