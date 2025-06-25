/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdfjs-dist'],
  },
  // Ensure proper routing for dynamic pages
  trailingSlash: false,
  // Disable static optimization for dynamic routes
  output: 'standalone',
  // Ensure proper handling of dynamic routes
  async rewrites() {
    return []
  },
  async redirects() {
    return []
  }
}

export default nextConfig