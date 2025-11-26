import path from 'path';
import fs from 'fs';

// Get the root directory
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const nextConfig = {
  distDir: 'dist',
  productionBrowserSourceMaps: process.env.NODE_ENV === 'production',
  reactStrictMode: false,
  typescript: {
    // Enable TypeScript type checking during build
    ignoreBuildErrors: false,
  },
  eslint: {
    // Enable ESLint during build
    ignoreDuringBuilds: false,
  },
  env: {},
  images: {
    formats: ['image/webp', 'image/avif', 'image/png', 'image/jpeg'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/:path*',
      },
    ];
  },
  webpack: (config, { isServer, dev }) => {
    // Configure source maps
    config.devtool = dev ? 'cheap-module-source-map' : 'source-map';
    
    // Add path aliases
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Ensure these match your tsconfig.json paths
      '@': resolveApp('src'),
      '@/components': resolveApp('src/components'),
      '@/hooks': resolveApp('src/hooks'),
      '@/lib': resolveApp('src/lib'),
      '@/types': resolveApp('src/types'),
    };

    // Optimization configuration
    config.optimization = {
      ...config.optimization,
      minimize: !dev,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor modules
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
          },
          // Common modules
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    };

    // Initialize plugins and rules if they don't exist
    config.plugins = config.plugins || [];
    config.module = config.module || { rules: [] };
    config.module.rules = config.module.rules || [];

    const fileLoaderRule = config.module.rules.find(
      (rule) =>
        typeof rule === "object" &&
        rule !== null &&
        rule.test instanceof RegExp &&
        rule.test.test(".svg"),
    );
    if (fileLoaderRule && typeof fileLoaderRule === "object") {
      fileLoaderRule.exclude = /\.svg$/i;
    }
    config.module.rules.push(
      {
        test: /\.svg$/i,
        resourceQuery: /url/,
        type: "asset/resource",
      },
      //      {
      //        test: /\.svg$/i,
      //        issuer: /\.[jt]sx?$/,
      //        resourceQuery: { not: [/url/] },
      //        use: ["@svgr/webpack"],
      //      }
    );

    return config;
  },
};

export default nextConfig;
