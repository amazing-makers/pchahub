// Server-side SSO helpers for cross-site session handoff.
//
// Background: amakers runs on 9 separate domains. NextAuth session cookies
// are per-domain so they don't auto-share. A user who signs in on
// pchahub.kr should still feel signed in when they hop to themyungdang.kr.
//
// Approach: the issuing site mints a short-lived "passport" JWT
// (60 seconds, signed with the shared NEXTAUTH_SECRET) and the user
// navigates to `https://{target}/api/sso/accept?token=…&next=…`.
// The target verifies the passport, mints its own NextAuth session
// cookie, and redirects to the originally requested path.
//
// We reuse next-auth/jwt's encode/decode so passport tokens are in the
// same JWE format NextAuth already uses — no new crypto, no new deps.

import { encode, decode, type JWT } from 'next-auth/jwt'

/** Passport TTL in seconds. Short on purpose — a passport is a one-shot ticket. */
const PASSPORT_TTL_SECONDS = 60

export interface PassportPayload extends JWT {
  userId?: string
  email?: string | null
  name?: string | null
  role?: string
  /** Target host the passport is intended for. '*' means any. */
  aud?: string
  /** Site key that issued the passport (e.g. 'pchahub'). */
  iss?: string
}

export interface CreatePassportInput {
  userId: string
  email?: string | null
  name?: string | null
  role?: string
  /** Hostname this passport is for (e.g. 'themyungdang.kr'). */
  audience: string
  /** Site key issuing the passport (e.g. 'pchahub'). */
  issuer: string
}

export async function createPassport(input: CreatePassportInput): Promise<string> {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error('NEXTAUTH_SECRET not set — cannot mint SSO passport')
  return encode({
    token: {
      userId: input.userId,
      email: input.email ?? undefined,
      name: input.name ?? undefined,
      role: input.role,
      aud: input.audience,
      iss: input.issuer,
    } satisfies PassportPayload,
    secret,
    maxAge: PASSPORT_TTL_SECONDS,
  })
}

export async function verifyPassport(token: string): Promise<PassportPayload | null> {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) return null
  try {
    const decoded = (await decode({ token, secret })) as PassportPayload | null
    if (!decoded || !decoded.userId) return null
    return decoded
  } catch {
    return null
  }
}

/** Cookie name NextAuth uses for the session JWT. Differs across protocols. */
export function sessionCookieName(): string {
  return process.env.NODE_ENV === 'production'
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token'
}

/**
 * Mint a NextAuth-compatible session token (the format that the session
 * cookie holds). Use after verifying a passport on the receiving side.
 */
export async function mintSessionToken(
  payload: Pick<PassportPayload, 'userId' | 'email' | 'name' | 'role'>,
): Promise<string> {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error('NEXTAUTH_SECRET not set')
  return encode({
    token: {
      userId: payload.userId,
      email: payload.email ?? undefined,
      name: payload.name ?? undefined,
      role: payload.role,
    },
    secret,
    maxAge: 30 * 24 * 60 * 60, // 30 days, same as authOptions.session.maxAge
  })
}
