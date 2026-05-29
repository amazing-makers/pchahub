import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { createInquiry, getInquiries } from '@amakers/db'

const PLATFORM = 'pchabridge'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message, type, metadata } = body
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 })
    }
    const inquiry = await createInquiry({
      platform: PLATFORM,
      type: type ?? 'general',
      name,
      email,
      phone,
      subject,
      message,
      metadata,
    })
    return NextResponse.json({ ok: true, id: inquiry.id })
  } catch (err) {
    console.error('[inquiries POST]', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!session || role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const url = new URL(req.url)
  const status = url.searchParams.get('status') as
    | 'PENDING'
    | 'IN_PROGRESS'
    | 'RESOLVED'
    | 'CLOSED'
    | undefined
  const skip = parseInt(url.searchParams.get('skip') ?? '0', 10)
  const inquiries = await getInquiries({ platform: PLATFORM, status, skip })
  return NextResponse.json(inquiries)
}
