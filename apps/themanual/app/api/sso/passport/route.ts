import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, createPassport } from '@amakers/auth'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'not_signed_in' }, { status: 401 })

  const url = new URL(req.url)
  const targetHost = url.searchParams.get('to') ?? '*'
  const user = session.user as { id?: string; role?: string } | undefined

  if (!user?.id) return NextResponse.json({ error: 'no_user_id_in_session' }, { status: 400 })

  const token = await createPassport({
    userId: user.id,
    email: session.user?.email ?? null,
    name: session.user?.name ?? null,
    role: user.role,
    audience: targetHost,
    issuer: 'themanual',
  })

  return NextResponse.json({ token, ttlSeconds: 60 })
}
