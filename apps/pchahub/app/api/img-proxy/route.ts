import { type NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOSTS = new Set([
  'cdn.myfranchise.kr',
  'prod-myfranchise-cdn.s3.ap-northeast-2.amazonaws.com',
  'images.unsplash.com',
])

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('url')
  if (!raw) return new NextResponse('missing url', { status: 400 })

  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return new NextResponse('invalid url', { status: 400 })
  }

  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    return new NextResponse('forbidden', { status: 403 })
  }

  try {
    const upstream = await fetch(raw, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://myfranchise.kr/',
        Origin: 'https://myfranchise.kr',
      },
    })

    if (!upstream.ok) {
      return new NextResponse(`upstream error ${upstream.status}`, { status: 502 })
    }

    const contentType = upstream.headers.get('content-type') ?? 'image/jpeg'
    const buf = await upstream.arrayBuffer()

    return new NextResponse(buf, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return new NextResponse('proxy error', { status: 502 })
  }
}
