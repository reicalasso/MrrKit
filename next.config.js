/** @type {import('next').NextConfig} */
const nextConfig = {
  // Improve development experience
  experimental: {
    turbo: {
      // Disable turbo mode if it causes fetch issues
      enabled: false
    }
  },

  // Better error handling
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Handle potential hydration issues
  reactStrictMode: true,

  // Disable x-powered-by header
  poweredByHeader: false,

  // Optimize for development
  swcMinify: true,

  // Handle potential CORS issues in development
  async headers() {
    return [
      {
        // Apply headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
}

export default nextConfig
