import type { AuthOptions, Provider } from 'next-auth'
import KakaoProvider from 'next-auth/providers/kakao'
import NaverProvider from 'next-auth/providers/naver'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@amakers/db'

// Detect whether each provider is fully configured. We don't want NextAuth
// to expose a provider with empty client id — its sign-in URL would 400
// in a confusing way.
const HAS_KAKAO = Boolean(process.env.KAKAO_CLIENT_ID)
const HAS_NAVER = Boolean(process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET)
const HAS_GOOGLE = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
const HAS_DB = Boolean(process.env.DATABASE_URL)
const IS_DEV = process.env.NODE_ENV !== 'production'

const providers: Provider[] = []

if (HAS_KAKAO) {
  providers.push(
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET ?? '',
    }),
  )
}
if (HAS_NAVER) {
  providers.push(
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
  )
}
if (HAS_GOOGLE) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  )
}

// Dev-only credentials provider — lets the team click through the auth
// flow before OAuth apps are registered. Hidden in production.
if (IS_DEV) {
  providers.push(
    CredentialsProvider({
      id: 'dev',
      name: '개발용 로그인 (이메일만)',
      credentials: {
        email: { label: '이메일', type: 'email', placeholder: 'you@example.com' },
        name: { label: '이름 (선택)', type: 'text' },
        role: {
          label: '역할',
          type: 'text',
          placeholder: 'user / hq / franchisee',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        const role = (credentials.role ?? 'user').toString().toLowerCase()
        return {
          id: `dev-${credentials.email}`,
          email: credentials.email.toString(),
          name: (credentials.name ?? credentials.email.toString().split('@')[0]).toString(),
          role,
        }
      },
    }),
  )
}

export const authOptions: AuthOptions = {
  // Only attach the Prisma adapter when DATABASE_URL is set — otherwise
  // the JWT strategy lets us run the whole auth flow without a DB,
  // which is what we need before Supabase is provisioned.
  adapter: HAS_DB ? (PrismaAdapter(prisma) as AuthOptions['adapter']) : undefined,
  providers,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.email = user.email ?? null
        // Carry through any role we attached in CredentialsProvider.
        if ('role' in user && typeof (user as { role?: unknown }).role === 'string') {
          token.role = (user as { role: string }).role
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        const u = session.user as { id?: string; role?: string }
        if (token.userId) u.id = token.userId as string
        if (token.role) u.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

/** Convenience: which providers are configured right now? Use for showing/hiding buttons. */
export const enabledProviders = {
  kakao: HAS_KAKAO,
  naver: HAS_NAVER,
  google: HAS_GOOGLE,
  dev: IS_DEV,
}
