/**
 * generate-v2-catalog.mjs
 *
 * Reads scripts/all-v2-brands.json → outputs apps/pchahub/lib/v2-brands.json
 * with top brands per category, excluding the 12 hand-curated brands.
 *
 * Run:
 *   .tools/node-v22.12.0-win-x64/node.exe scripts/generate-v2-catalog.mjs
 */

import { writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

// The 12 hand-curated brands (already have local assets in public/brands/)
const EXISTING_REG_NUMS = new Set([
  '20120100525', // 호치킨 → b1
  '20180244',    // 텐퍼센트스페셜티커피 → b2
  '20213078',    // 육칠이 → b3
  '20211853',    // 백소정 → b4
  '20220073',    // 헬키푸키 → b5
  '20211504',    // 과일에반하다.프루타 → b6
  '20212429',    // 슬로우캘리 → b7
  '20240481',    // 숯토리 → b8
  '20213267',    // 기영이숯불두마리치킨 → b9
  '20181157',    // 동경에서먹었던규동 → b10
  '20250859',    // 9504 양평칼국수 → b11
  '20220296',    // 국민매운찜갈비 → b12
])

const BIZ_TO_CATEGORY = {
  '한식': 'korean',
  '커피': 'cafe',
  '주점': 'bar',
  '일식': 'japanese',
  '치킨': 'chicken',
  '패스트푸드': 'snack',
  '분식': 'snack',
  '아이스크림/빙수': 'dessert',
  '기타 외식': 'korean',
  '서양식': 'western',
  '피자': 'pizza',
  '중식': 'chinese',
  '제과제빵': 'dessert',
  '스터디카페': 'cafe',
  '편의점': 'convenience',
}

const MAX_PER_CATEGORY = 25

async function main() {
  const all = require('./all-v2-brands.json')

  // Filter: skip existing 12 brands, require at least one photo
  const filtered = all.filter(
    (b) => !EXISTING_REG_NUMS.has(b.regNum) && b.photos.length > 0,
  )

  // Group by category (already sorted by score DESC in all-v2-brands.json)
  const byCat = {}
  for (const b of filtered) {
    const cat = BIZ_TO_CATEGORY[b.bizStr]
    if (!cat) continue
    if (!byCat[cat]) byCat[cat] = []
    byCat[cat].push(b)
  }

  // Select top MAX_PER_CATEGORY from each category
  const selected = []
  for (const brands of Object.values(byCat)) {
    selected.push(
      ...brands.slice(0, MAX_PER_CATEGORY).map((b) => ({
        regNum: b.regNum,
        name: b.name,
        bizStr: b.bizStr,
        category: BIZ_TO_CATEGORY[b.bizStr],
        logo: b.logo ?? b.thumbnail ?? '',
        thumbnail: b.thumbnail ?? '',
        photos: b.photos.slice(0, 3),
        videos: b.videos.slice(0, 1),
        score: b.score,
      })),
    )
  }

  // Sort final list by score DESC
  selected.sort((a, b) => b.score - a.score)

  const outPath = join(__dirname, '..', 'apps', 'pchahub', 'lib', 'v2-brands.json')
  await writeFile(outPath, JSON.stringify(selected, null, 2), 'utf8')
  console.log(`✅ Written ${selected.length} brands to ${outPath}`)

  // Summary by category
  const cats = {}
  for (const b of selected) cats[b.category] = (cats[b.category] ?? 0) + 1
  console.log('\nBreakdown:')
  for (const [cat, count] of Object.entries(cats).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`)
  }
}

main().catch((e) => {
  console.error('Fatal:', e)
  process.exit(1)
})
