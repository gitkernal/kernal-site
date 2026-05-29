/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@anthropic-ai/sdk']
  },
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://gitkernal.xyz' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PATCH, OPTIONS' }
      ]
    }
  ]
}

export default nextConfig
