import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@amakers/db'
import { fetchExternal, env } from '@amakers/api-client'

// Vercel Cron은 Authorization: Bearer <CRON_SECRET> 헤더를 주입한다.
function isAuthorized(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  return token === process.env.CRON_SECRET
}

interface KftcBrandItem {
  frnChrgNm: string        // 브랜드명
  indutyNm: string         // 업종
  cmpnNm: string           // 본사명
  telNo: string            // 연락처
  homepageUrl?: string     // 홈페이지
  totalStoreCount?: string // 가맹점 수
  avgSalAmt?: string       // 평균 매출액
  frnFee?: string          // 가맹비
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let apiKey: string
  try {
    apiKey = env.kftcApiKey()
  } catch {
    return NextResponse.json({ error: 'KFTC_API_KEY not set' }, { status: 500 })
  }

  const result = await fetchExternal<{
    header: { resultCode: string }
    body: { items: KftcBrandItem[]; totalCount: number }
  }>({
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandFrcsStatsService/getBrandFrcsStats',
    key: apiKey,
    query: { pageNo: '1', numOfRows: '100' },
    revalidate: 0,
  })

  if (!result.ok) {
    console.error('[cron/sync-kftc] API 오류:', result.error)
    return NextResponse.json({ error: result.error }, { status: 502 })
  }

  const items = result.data.body.items
  let upserted = 0

  for (const item of items) {
    if (!item.frnChrgNm) continue

    await prisma.brand.upsert({
      where: { name: item.frnChrgNm },
      create: {
        name: item.frnChrgNm,
        category: item.indutyNm ?? '기타',
        hqName: item.cmpnNm ?? item.frnChrgNm,
        hqContact: item.telNo,
        websiteUrl: item.homepageUrl,
        storeCount: parseInt(item.totalStoreCount ?? '0', 10) || 0,
        isVerified: true,
        verifiedAt: new Date(),
      },
      update: {
        category: item.indutyNm ?? '기타',
        hqName: item.cmpnNm ?? item.frnChrgNm,
        hqContact: item.telNo,
        websiteUrl: item.homepageUrl,
        storeCount: parseInt(item.totalStoreCount ?? '0', 10) || 0,
        isVerified: true,
        verifiedAt: new Date(),
      },
    })
    upserted++
  }

  return NextResponse.json({
    ok: true,
    upserted,
    total: result.data.body.totalCount,
    syncedAt: new Date().toISOString(),
  })
}
