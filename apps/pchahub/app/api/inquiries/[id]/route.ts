import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { updateInquiry } from '@amakers/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!session || role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { status, adminNote } = await req.json()
    const updated = await updateInquiry(params.id, {
      status,
      adminNote,
      resolvedAt:
        status === 'RESOLVED' ? new Date() : status === 'CLOSED' ? new Date() : undefined,
    })
    return NextResponse.json({ ok: true, inquiry: updated })
  } catch (err) {
    console.error('[inquiries PATCH]', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
