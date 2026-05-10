# Generates the boilerplate for all 9 Next.js apps.
# Idempotent: safe to re-run; will overwrite scaffolded files.
$ErrorActionPreference = 'Stop'

$repoRoot = if ($env:AMAKERS_REPO_ROOT) { $env:AMAKERS_REPO_ROOT } elseif ($PSScriptRoot) { Split-Path -Parent $PSScriptRoot } else { throw "AMAKERS_REPO_ROOT not set and `$PSScriptRoot empty" }

$apps = @(
    @{ key='pchahub';      port=3000; primary='#4F46E5'; name='프차허브';        role='정보검색+가맹중개'; domain='pchahub.kr' },
    @{ key='openrun';      port=3001; primary='#F97316'; name='오픈런';          role='마케팅';            domain='openrun.kr' },
    @{ key='gongganhansu'; port=3002; primary='#64748B'; name='공간의한수';      role='인테리어';          domain='gongganhansu.kr' },
    @{ key='themyungdang'; port=3003; primary='#10B981'; name='더명당';          role='부동산';            domain='themyungdang.kr' },
    @{ key='themanual';    port=3004; primary='#3B82F6'; name='더메뉴얼';        role='매뉴얼/교육';       domain='themanual.kr' },
    @{ key='jangsanote';   port=3005; primary='#F59E0B'; name='장사노트';        role='커뮤니티';          domain='jangsanote.kr' },
    @{ key='bestplace';    port=3006; primary='#EAB308'; name='베스트플레이스';  role='베스트/시상';       domain='bestplace.kr' },
    @{ key='changupdocu';  port=3007; primary='#F43F5E'; name='창업다큐';        role='미디어';            domain='changupdocu.kr' },
    @{ key='pchabridge';   port=3008; primary='#8B5CF6'; name='프차브릿지';      role='투자/M&A';          domain='pchabridge.kr' }
)

function Write-Utf8NoBom([string]$Path, [string]$Content) {
    $dir = Split-Path -Parent $Path
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    [System.IO.File]::WriteAllText($Path, $Content, (New-Object System.Text.UTF8Encoding($false)))
}

foreach ($app in $apps) {
    $key = $app.key
    $port = $app.port
    $primary = $app.primary
    $appName = $app.name
    $role = $app.role
    $domain = $app.domain
    $appDir = Join-Path $repoRoot "apps\$key"

    Write-Host "Scaffolding apps/$key (port $port, $primary)..."

    # package.json
    $pkg = @"
{
  "name": "$key",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p $port",
    "build": "next build",
    "start": "next start -p $port",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@amakers/ui": "workspace:*",
    "@amakers/auth": "workspace:*",
    "@amakers/db": "workspace:*",
    "@amakers/design-system": "workspace:*",
    "@amakers/api-client": "workspace:*",
    "@amakers/utils": "workspace:*",
    "next": "^14.2.21",
    "next-auth": "^4.24.11",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@amakers/config": "workspace:*",
    "@types/node": "^22.10.2",
    "@types/react": "^18.3.16",
    "@types/react-dom": "^18.3.5",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "eslint-config-next": "^14.2.21",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.16",
    "typescript": "^5.7.2"
  }
}
"@
    Write-Utf8NoBom (Join-Path $appDir "package.json") $pkg

    # next.config.mjs
    $nextConfig = @"
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
"@
    Write-Utf8NoBom (Join-Path $appDir "next.config.mjs") $nextConfig

    # tsconfig.json
    $tsconfig = @"
{
  "extends": "@amakers/config/tsconfig/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
"@
    Write-Utf8NoBom (Join-Path $appDir "tsconfig.json") $tsconfig

    # tailwind.config.ts
    $twConfig = @"
import type { Config } from 'tailwindcss'
import preset from '@amakers/design-system/tailwind-preset'

const config: Config = {
  presets: [preset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '$primary',
      },
    },
  },
}

export default config
"@
    Write-Utf8NoBom (Join-Path $appDir "tailwind.config.ts") $twConfig

    # postcss.config.mjs
    $postcss = @"
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"@
    Write-Utf8NoBom (Join-Path $appDir "postcss.config.mjs") $postcss

    # app/globals.css
    $globalsCss = @"
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --brand-primary: $primary;
}

html { font-family: 'Pretendard', 'Inter', sans-serif; }
body { color: #0F172A; background: #ffffff; }
"@
    Write-Utf8NoBom (Join-Path $appDir "app\globals.css") $globalsCss

    # app/layout.tsx
    $layout = @"
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '$appName | $role',
  description: 'amakers - 한국 프랜차이즈 통합 플랫폼 ($appName, $role)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
"@
    Write-Utf8NoBom (Join-Path $appDir "app\layout.tsx") $layout

    # app/page.tsx
    $page = @"
import { Card, CardContent } from '@amakers/ui'

export default function HomePage() {
  return (
    <main className="container mx-auto py-section">
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
            amakers · $domain
          </p>
          <h1 className="text-h1 font-bold">$appName</h1>
          <p className="text-body text-gray-600">$role</p>
        </header>

        <Card>
          <CardContent className="p-8">
            <p className="text-body">
              <strong>$appName</strong>은 amakers 플랫폼 9개 사이트 중 하나입니다.
              여기서부터 페이지를 채워나갈 수 있습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
"@
    Write-Utf8NoBom (Join-Path $appDir "app\page.tsx") $page

    # .eslintrc.json
    $eslintrc = @"
{
  "extends": "@amakers/config/eslint/nextjs"
}
"@
    Write-Utf8NoBom (Join-Path $appDir ".eslintrc.json") $eslintrc

    # .gitignore (per-app)
    $appGitignore = @"
node_modules
.next
.turbo
next-env.d.ts
"@
    Write-Utf8NoBom (Join-Path $appDir ".gitignore") $appGitignore
}

Write-Host ""
Write-Host "Done. Created scaffolding for $($apps.Count) apps."
