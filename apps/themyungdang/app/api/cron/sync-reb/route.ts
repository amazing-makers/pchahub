import { NextRequest, NextResponse } from 'next/server'
import { fetchExternal, env } from '@amakers/api-client'

function isAuthorized(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  return token === process.env.CRON_SECRET
}

interface RebItem {
  법정동명?: string
  전용면적?: string
  거래금액?: string
  월세금액?: string
  보증금액?: string
  건축년도?: string
  년?: string
  월?: string
  일?: string
}

// 실거래가 스냅샷을 Supabase 캐시 테이블에 저장하는 크론.
// 현재는 로그만 남기고 향후 prisma.priceSnapshot.create()로 교체 예정.
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = env.rebApiKey()
  if (!apiKey) {
    return NextResponse.json({ skipped: true, reason: 'REB_API_KEY not set' })
  }

  const now = new Date()
  const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`

  const result = await fetchExternal<{
    body: { items: RebItem[]; totalCount: number }
  }>({
    endpoint: 'https://apis.data.go.kr/1613000/RTMSDataSvcRHRent/getRTMSDataSvcRHRent',
    key: apiKey,
    query: { LAWD_CD: '11110', DEAL_YMD: yyyymm, pageNo: '1', numOfRows: '50' },
    revalidate: 0,
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 })
  }

  // TODO: prisma.priceSnapshot.createMany({ data: items.map(mapItem) })
  console.info(`[cron/sync-reb] 수신 ${result.data.body.items.length}건 (${yyyymm})`)

  return NextResponse.json({
    ok: true,
    count: result.data.body.items.length,
    period: yyyymm,
    syncedAt: new Date().toISOString(),
  })
}
