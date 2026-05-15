/**
 * probe-myfranchise-api.mjs
 *
 * Playwright로 마이프차 브랜드 페이지 (메인/메뉴/인테리어/매장사진/정보)를
 * 실제 브라우저에서 로드 후 각 페이지의 cdn.myfranchise.kr 이미지 URL을 캡처.
 *
 * 사용자가 볼 때 인테리어 페이지에 노출된 사진 = 인테리어 사진,
 * 메뉴 페이지의 사진 = 메뉴 사진. 분류 메타가 따로 없어도 페이지 단위로 분리 가능.
 *
 * 실행:
 *   .tools/node-v22.12.0-win-x64/node.exe scripts/probe-myfranchise-api.mjs
 */

import { chromium } from 'playwright'
import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REG_NUM = process.argv[2] ?? '20080100482' // 토프레소 default
const NAME_PARAM = process.argv[3] ?? encodeURIComponent('토프레소')
const OUT = join(__dirname, '..', 'tmp', 'myfranchise-probe.json')

// 브랜드 페이지별 카테고리 (어떤 종류 사진이 노출되는지)
const SECTIONS = [
  { key: 'main',     path: `/${REG_NUM}/${NAME_PARAM}` },
  { key: 'menu',     path: `/${REG_NUM}/menu` },
  { key: 'interior', path: `/${REG_NUM}/interior` },
  { key: 'photo',    path: `/${REG_NUM}/photo` },
  { key: 'info',     path: `/${REG_NUM}/info` },
]

async function main() {
  let browser
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true })
  } catch {
    browser = await chromium.launch({ channel: 'chrome', headless: true })
  }
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1366, height: 900 },
  })
  const page = await ctx.newPage()

  // 페이지마다 capture된 backend 호출 (수동 매핑이 안 될 경우 fallback)
  const apiCalls = []
  page.on('response', async (res) => {
    const u = res.url()
    if (!/graphql/.test(u)) return // GraphQL 호출만 집중
    try {
      const ct = res.headers()['content-type'] ?? ''
      const reqBody = res.request().postData() ?? ''
      const body = await res.text().catch(() => '')
      apiCalls.push({
        url: u,
        status: res.status(),
        method: res.request().method(),
        contentType: ct,
        reqBody: reqBody.slice(0, 2000),
        resBody: body.slice(0, 3000),
      })
    } catch {}
  })

  const result = {}

  for (const { key, path } of SECTIONS) {
    const url = `https://myfranchise.kr${path}`
    console.log(`=== ${key}: ${url} ===`)
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
      await page.waitForTimeout(2000)
      // 페이지 끝까지 스크롤해서 lazy-load 이미지 트리거
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let y = 0
          const id = setInterval(() => {
            window.scrollBy(0, 800)
            y += 800
            if (y > document.body.scrollHeight + 1000) {
              clearInterval(id)
              window.scrollTo(0, 0)
              resolve()
            }
          }, 200)
        })
      })
      await page.waitForTimeout(2000)
    } catch (e) {
      console.warn(`  load failed: ${e.message}`)
      continue
    }

    // 페이지의 모든 이미지 URL — 모든 src (lazy 포함) + currentSrc
    const imgs = await page.evaluate(() => {
      const out = []
      document.querySelectorAll('img').forEach((el) => {
        const src = el.currentSrc || el.src || el.getAttribute('data-src') || ''
        const alt = el.alt || ''
        const r = el.getBoundingClientRect()
        if (!src) return
        out.push({ src, alt, w: Math.round(r.width), h: Math.round(r.height) })
      })
      // background-image까지 추적
      document.querySelectorAll('*').forEach((el) => {
        const bg = getComputedStyle(el).backgroundImage
        const m = bg.match(/url\("?([^")]+)"?\)/)
        if (m && (m[1].includes('cdn.myfranchise') || m[1].includes('brand-thumbnail'))) {
          const r = el.getBoundingClientRect()
          out.push({ src: m[1], alt: '(bg)', w: Math.round(r.width), h: Math.round(r.height) })
        }
      })
      return out
    })

    // 페이지의 H1·H2·H3 텍스트도 — 어떤 섹션 라벨이 노출되는지 파악
    const headings = await page.evaluate(() => {
      const out = []
      document.querySelectorAll('h1, h2, h3').forEach((el) => {
        const t = (el.textContent ?? '').trim()
        if (t && t.length < 60) out.push(t)
      })
      return out.slice(0, 30)
    })

    // visible 본문 텍스트 (광고/네비 제외) 일부 추출
    const bodyText = await page.evaluate(() => {
      const main = document.querySelector('main') || document.body
      return (main.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 800)
    })

    result[key] = { url, imgs, headings, bodyText }
    console.log(`  imgs: ${imgs.length}, headings: ${headings.length}`)
    console.log(`  bodyText: ${bodyText.slice(0, 200)}`)

    // 페이지마다 스크린샷 저장해서 실제 상태 확인
    const shot = OUT.replace('.json', `-${key}.png`)
    try { await page.screenshot({ path: shot, fullPage: false }) } catch {}
  }

  await browser.close()
  await mkdir(dirname(OUT), { recursive: true })
  await writeFile(OUT, JSON.stringify({ regNum: REG_NUM, apiCalls, sections: result }, null, 2), 'utf8')
  console.log(`\n💾 saved → ${OUT}`)

  console.log('\n--- Summary ---')
  for (const [key, s] of Object.entries(result)) {
    console.log(`[${key}] ${s.imgs.length} imgs`)
    s.imgs.slice(0, 3).forEach((i) => console.log(`    ${i.src.slice(0, 100)} (${i.w}x${i.h})`))
  }
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1) })
