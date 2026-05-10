/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@amakers/ui',
    '@amakers/auth',
    '@amakers/db',
    '@amakers/design-system',
    '@amakers/api-client',
    '@amakers/utils',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    typedRoutes: true,
  },
}

export default nextConfig