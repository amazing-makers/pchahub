import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// 모노레포 루트 .env 로드 (turbo dev 없이 next dev 직접 실행 시에도 동작)
// Node.js 20.12+ 내장 process.loadEnvFile 사용 (dotenv 불필요)
// 기존 process.env 값을 덮어쓰지 않으므로 Turbo / 배포 환경에서 안전
const __dirname = dirname(fileURLToPath(import.meta.url))
try {
  process.loadEnvFile(resolve(__dirname, '../../.env'))
} catch {
  // .env 없거나 이미 주입된 경우 무시
}

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
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
}

export default nextConfig