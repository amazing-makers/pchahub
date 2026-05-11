import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { mintSessionToken, sessionCookieName, verifyPassport } from '@amakers/auth'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  const next = url.searchParams.get('next') ?? '/'

  const failRedirect = new URL('/auth/signin', url.origin)
  failRedirect.searchParams.set('error', 'Verification')

  if (!token) return NextResponse.redirect(failRedirect)

  const payload = await verifyPassport(token)
  if (!payload || !payload.userId) {
    return NextResponse.redirect(failRedirect)
  }

  const sessionToken = await mintSessionToken({
    userId: payload.userId,
    email: payload.email ?? null,
    name: payload.name ?? null,
    role: payload.role,
  })

  cookies().set(sessionCookieName(), sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  })

  return NextResponse.redirect(new URL(next, url.origin))
}
