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
  typescript: {
    // Skip per-app type-check during `next build`. Workspace deps
    // can be checked separately via `pnpm -r type-check`.
    ignoreBuildErrors: true,
  },
  // Re-enable typedRoutes once concrete routes exist in every app.
  experimental: {
    typedRoutes: false,
  },
}

export default nextConfig