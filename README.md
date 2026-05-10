# amakers Platform

> 한국 프랜차이즈 통합 플랫폼 — 9개 독립 도메인 + 통합 백엔드

## Architecture

- **9 independent apps** (each deploys to its own Vercel domain)
- **Shared backend**: unified PostgreSQL + SSO via NextAuth.js (JWT)
- **Monorepo**: Turborepo + pnpm workspaces

## Apps

| App | Domain | Role |
|---|---|---|
| pchahub | pchahub.kr | 정보검색 + 가맹중개 |
| openrun | openrun.kr | 마케팅 |
| gongganhansu | gongganhansu.kr | 인테리어 |
| themyungdang | themyungdang.kr | 부동산 |
| themanual | themanual.kr | 매뉴얼/교육 |
| jangsanote | jangsanote.kr | 커뮤니티 |
| bestplace | bestplace.kr | 베스트/시상 |
| changupdocu | changupdocu.kr | 미디어 |
| pchabridge | pchabridge.kr | 투자/M&A |

## Shared Packages

- `@amakers/ui` — shared UI components (shadcn/ui)
- `@amakers/auth` — unified SSO (NextAuth.js + JWT)
- `@amakers/db` — Prisma schema & client
- `@amakers/design-system` — design tokens
- `@amakers/api-client` — typed API client
- `@amakers/config` — shared eslint/tsconfig
- `@amakers/utils` — shared utilities

## Quick Start

```bash
pnpm install
cp .env.example .env  # fill in values
pnpm db:generate
pnpm dev              # runs all 9 apps
```

Run a single app:

```bash
pnpm --filter pchahub dev
```

## Tech Stack

Next.js 14 (App Router) · TypeScript 5 · Tailwind CSS 3.4 · shadcn/ui · PostgreSQL (Supabase) · Prisma · NextAuth.js · TanStack Query · Zustand
