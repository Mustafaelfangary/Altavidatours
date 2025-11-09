



/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server configuration
  env: {
    // Use environment variable if set, otherwise default to 3001
    PORT: process.env.PORT || '3001',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3001',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key-here'
  },
  
  // Temporarily ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Temporarily ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@mui/material', '@mui/icons-material']
  },
  
  // Enhanced image optimization with error handling
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Custom loader for better error handling
    loader: 'custom',
    loaderFile: './src/utils/imageLoader.js',
    // Allow local images with query strings (e.g., cache-busting like ?t=...)
    // Required starting in Next.js 16
    localPatterns: [
      { pathname: '/logos/**' },
      { pathname: '/images/**' },
      { pathname: '/public/**' }
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'treasureegypttours.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.treasureegypttours.com',
        pathname: '/**',
      }
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },
  
  // Redirects to canonical routes
  async redirects() {
    return [
      { source: '/blog', destination: '/blogs', permanent: true },
      { source: '/blog/:slug', destination: '/blogs/:slug', permanent: true },
      { source: '/gallery-new', destination: '/gallery', permanent: true },
      { source: '/dahabiyas/:slug*', destination: '/packages/:slug*', permanent: true },
      { source: '/dahabiyat', destination: '/packages', permanent: true },
      { source: '/dahabiya', destination: '/packages', permanent: true },
      { source: '/itinerary', destination: '/itineraries', permanent: true },
      { source: '/itinerary/:slug', destination: '/itineraries/:slug', permanent: true },
      { source: '/package', destination: '/packages', permanent: true },
      { source: '/package/:slug', destination: '/packages/:slug', permanent: true },
      { source: '/admin/login', destination: '/admin-login', permanent: true },
      { source: '/admin/verify', destination: '/admin-verify', permanent: true },
      { source: '/admin/direct', destination: '/admin-direct', permanent: true },
      { source: '/admin/dashboard', destination: '/admin', permanent: true },
      { source: '/schedule-and-rates', destination: '/', permanent: true }
    ];
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }
    
    return config;
  }
};

export default nextConfig;
