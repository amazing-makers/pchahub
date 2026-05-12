#!/usr/bin/env node
/**
 * data.go.kr 활용신청 endpoint 일괄 등록 스크립트.
 *
 * 입력: scripts/data-go-kr-intake.tsv (TAB 구분, # 주석)
 *   컬럼: dataName \t endpoint \t format \t [status]
 *
 * 동작:
 *   1) 각 항목을 사이트별 key 매핑 규칙으로 매칭 (같은 dataName이 여러 사이트에 매칭될 수 있음)
 *   2) 매칭된 site의 registry.ts ENDPOINTS 배열에서
 *      key가 일치하는 entry를 찾아 endpoint 교체 + status: 'configured'.
 *   3) 매칭 안 되는 row는 docs/external-apis-other.md 로 모음.
 *   4) 보안: "일반 인증키" 흔적 발견 시 즉시 중단.
 *
 * 사용:
 *   node scripts/register-data-go-kr.mjs            # 실제 수정
 *   node scripts/register-data-go-kr.mjs --dry-run  # 미리보기만 (파일 변경 없음)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DRY = process.argv.includes('--dry-run')

const INTAKE = resolve(ROOT, 'scripts/data-go-kr-intake.tsv')
const OTHER_MD = resolve(ROOT, 'docs/external-apis-other.md')

const REGISTRIES = {
  pchahub: resolve(ROOT, 'apps/pchahub/lib/kftc/registry.ts'),
  themyungdang: resolve(ROOT, 'apps/themyungdang/lib/external/registry.ts'),
  bestplace: resolve(ROOT, 'apps/bestplace/lib/external/registry.ts'),
}

// 사이트별 dataName 키워드 → registry key.
// 같은 dataName이 여러 사이트에 매칭되면 양쪽 모두 업데이트한다 (e.g., 소상공인 상가/상권은 themyungdang + bestplace에 둘 다 있음).
const KEY_MAP = {
  pchahub: [
    [/정보공개서.*목록/, 'DisclosureList'],
    [/정보공개서.*본문/, 'DisclosureContent'],
    [/정보공개서.*목차/, 'DisclosureTOC'],
    // BrandStoreStats: "페어데이터" 또는 "브랜드 가맹점 및 직영점"
    [/페어데이터.*가맹점|브랜드 가맹점 및 직영점|브랜드별 가맹점 현황/, 'BrandStoreStats'],
    [/브랜드 목록 정보/, 'BrandList'],
    // HqInfo: "가맹본부 일반 정보 상세" (변경 이력 제외)
    [/가맹본부 일반 정보 상세/, 'HqInfo'],
    [/가맹본부 등록 목록/, 'HqRegistrations'],
    [/가맹본부 재무/, 'HqFinance'],
    [/업종별 브랜드변동/, 'IndutyBrandStats'],
    [/지역별 업종별 평균 매출/, 'AvgSaleByRegion'],
  ],
  themyungdang: [
    [/한국부동산원.*임대/, 'RebRentStats'],
    [/한국부동산원.*매매/, 'RebSaleStats'],
    [/국토교통부.*상업.*실거래/, 'MoltRtmsCommercial'],
    // 공백 허용 + "상세" 변형 모두 포괄
    [/국토교통부.*아파트\s*매매.*실거래/, 'MoltApRtmsTrade'],
    [/소상공인.*상권정보$/, 'SosanginCommerce'],
    [/소상공인.*상가\(상권\)정보/, 'SosanginStores'],
  ],
  bestplace: [
    [/소상공인.*상가\(상권\)정보/, 'SosanginStoreList'],
    [/소상공인.*상권정보$/, 'SosanginCommerceArea'],
    // KOSIS: 가장 일반적인 "통계자료" 하나만 매핑 (나머지 KOSIS는 other.md로)
    [/KOSIS\s*통계자료/, 'StatKosisPopulation'],
    [/사업자등록.*진위/, 'BizRegLookup'],
  ],
}

// 새 key 추가 시 union 타입에 표시할 코멘트.
const NEW_KEY_COMMENT = {
  DisclosureTOC: '정보공개서 목차',
  HqFinance: '가맹본부 재무정보',
  AvgSaleByRegion: '지역별 업종별 평균매출',
}

// ─── 1. 인테이크 파싱 ────────────────────────────────────────────
function parseIntake() {
  if (!existsSync(INTAKE)) die(`인테이크 파일 없음: ${INTAKE}`)
  const rows = []
  const lines = readFileSync(INTAKE, 'utf8').split(/\r?\n/)
  for (const raw of lines) {
    const t = raw.trim()
    if (!t || t.startsWith('#')) continue
    const cols = raw.split('\t').map((s) => s.trim())
    if (cols.length < 3) {
      console.warn(`⚠️  컬럼 부족: ${t.slice(0, 60)}`)
      continue
    }
    const [dataName, endpoint, format, status = '승인'] = cols
    rows.push({ dataName, endpoint, format: normFormat(format), status })
  }
  return rows
}

function normFormat(f) {
  const u = (f || '').toUpperCase().replace(/\s/g, '')
  if (u.includes('JSON') && u.includes('XML')) return 'JSON+XML'
  if (u.includes('JSON')) return 'JSON'
  if (u.includes('XML')) return 'XML'
  return 'JSON'
}

// ─── 2. 키 노출 검사 ────────────────────────────────────────────
function scanLeak(rows) {
  for (const r of rows) {
    const blob = `${r.dataName} ${r.endpoint}`
    if (/serviceKey=[A-Za-z0-9+/=%]{20,}/i.test(blob) || /일반\s*인증키/.test(blob)) {
      console.error(`🛑 보안 위반: ${r.dataName}`)
      die('인테이크에 인증키 흔적이 있습니다. 해당 라인 제거 후 다시 실행하세요.')
    }
  }
}

// ─── 3. 매칭 ─────────────────────────────────────────────────────
function findMatches(dataName) {
  // 모든 사이트의 모든 key 규칙을 돌면서 매칭되는 (site, key) 페어를 모두 반환.
  const out = []
  for (const site of Object.keys(KEY_MAP)) {
    for (const [re, key] of KEY_MAP[site]) {
      if (re.test(dataName)) {
        out.push({ site, key })
        break // 한 site 안에서는 첫 매칭만
      }
    }
  }
  return out
}

// ─── 4. registry.ts 업데이트 ─────────────────────────────────────
function updateRegistry(site, items, dry) {
  const file = REGISTRIES[site]
  if (!existsSync(file)) return { configured: [], added: [], skipped: items }
  let src = readFileSync(file, 'utf8')
  const stats = { configured: [], added: [], skipped: [] }

  for (const { row, key } of items) {
    const blockRe = new RegExp(
      String.raw`\{\s*key:\s*'` + key + String.raw`',[\s\S]*?\n\s*\},`,
      'm',
    )
    const m = src.match(blockRe)
    if (m) {
      const block = m[0]
      const newBlock = block
        .replace(/endpoint:\s*'[^']*'/, `endpoint: '${row.endpoint}'`)
        .replace(/status:\s*'pending-endpoint'/, `status: 'configured'`)
        .replace(/dataName:\s*'[^']*'/, `dataName: '${escapeStr(row.dataName)}'`)
      if (newBlock !== block) {
        src = src.replace(block, newBlock)
        stats.configured.push({ key, dataName: row.dataName, endpoint: row.endpoint })
      } else {
        stats.skipped.push({ ...row, reason: '이미 동일 등록' })
      }
    } else {
      // 새 key — union 타입에 추가 + 배열 끝에 push
      const unionRe = /export\s+type\s+(\w+EndpointKey)\s*=\s*[^]*?\n\n/m
      const u = src.match(unionRe)
      if (u) {
        const comment = NEW_KEY_COMMENT[key] || row.dataName.slice(0, 30)
        const newUnion = u[0].replace(
          /(\|\s*'[\w]+'[^\n]*\n)(\nexport interface)/m,
          `$1  | '${key}'   // ${comment}\n$2`,
        )
        // simpler fallback if above didn't insert
        if (newUnion === u[0]) {
          const inj = u[0].replace(/(\n)\n$/, `\n  | '${key}'\n\n`)
          if (inj !== u[0]) src = src.replace(u[0], inj)
        } else {
          src = src.replace(u[0], newUnion)
        }
      }
      const fieldsKey = src.includes('fillsMockFields') ? 'fillsMockFields' : 'fillsFields'
      const newEntry =
        `  {\n` +
        `    key: '${key}',\n` +
        `    dataName: '${escapeStr(row.dataName)}',\n` +
        `    endpoint: '${row.endpoint}',\n` +
        `    format: '${row.format}',\n` +
        `    priority: 'supplementary',\n` +
        `    ${fieldsKey}: ['TBD'],\n` +
        `    status: 'configured',\n` +
        `  },\n`
      const arrEndRe = /\n\]\s*\n\s*export function/m
      if (arrEndRe.test(src)) {
        src = src.replace(arrEndRe, `\n${newEntry}]\n\nexport function`)
        stats.added.push({ key, dataName: row.dataName, endpoint: row.endpoint })
      } else {
        stats.skipped.push({ ...row, reason: '배열 끝 위치 못 찾음' })
      }
    }
  }
  if (!dry) writeFileSync(file, src, 'utf8')
  return stats
}

function escapeStr(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

// ─── 5. other.md ────────────────────────────────────────────────
function writeOtherMd(others, dry) {
  if (!others.length) return
  const lines = [
    '# 분류 보류 외부 API (운영자 검토 필요)',
    '',
    '자동 분류에서 amakers 3개 핵심 사이트(pchahub/themyungdang/bestplace)의',
    'registry key 규칙에 매칭되지 않은 API들. 운영자가 검토 후 다음 사이트로 배정 가능:',
    'gongganhansu / themanual / jangsanote / changupdocu / openrun / pchabridge',
    '',
    `생성: ${new Date().toISOString().slice(0, 10)} · 총 ${others.length}건`,
    '',
    '## 후보',
    '',
    '| 데이터명 | endpoint | 포맷 | 사유 |',
    '|---|---|---|---|',
  ]
  for (const r of others) {
    const safeName = r.dataName.replace(/\|/g, '\\|')
    lines.push(`| ${safeName} | ${r.endpoint} | ${r.format} | ${r.reason || '미분류'} |`)
  }
  lines.push('')
  if (!dry) writeFileSync(OTHER_MD, lines.join('\n'), 'utf8')
}

// ─── 6. 메인 ────────────────────────────────────────────────────
function die(msg) {
  console.error(`❌ ${msg}`)
  process.exit(1)
}

function main() {
  const rows = parseIntake()
  if (!rows.length) die(`인테이크 파일에 데이터 없음.\n   ${INTAKE} 열어서 표 붙여넣으세요.`)
  console.log(`📥 인테이크 ${rows.length}개 row 로드${DRY ? ' (DRY-RUN)' : ''}`)

  scanLeak(rows)
  console.log('🔐 키 노출 검사 통과')

  // row → site별 분배
  const bySite = { pchahub: [], themyungdang: [], bestplace: [] }
  const orphans = []
  for (const row of rows) {
    if (row.status && row.status !== '승인') {
      orphans.push({ ...row, reason: `status=${row.status}` })
      continue
    }
    const matches = findMatches(row.dataName)
    if (!matches.length) {
      orphans.push({ ...row, reason: '키워드 매칭 실패' })
      continue
    }
    for (const m of matches) bySite[m.site].push({ row, key: m.key })
  }

  // 같은 (site, key)에 여러 row가 매칭되면 첫 것만 사용 — 나머지는 orphan으로
  for (const site of ['pchahub', 'themyungdang', 'bestplace']) {
    const seen = new Set()
    const deduped = []
    for (const it of bySite[site]) {
      if (seen.has(it.key)) {
        orphans.push({ ...it.row, reason: `중복: ${site}/${it.key} 이미 다른 row에 할당됨` })
        continue
      }
      seen.add(it.key)
      deduped.push(it)
    }
    bySite[site] = deduped
  }

  console.log(
    `📂 매칭: pchahub=${bySite.pchahub.length} themyungdang=${bySite.themyungdang.length} ` +
      `bestplace=${bySite.bestplace.length} orphan=${orphans.length}`,
  )

  const allSkipped = []
  for (const site of ['pchahub', 'themyungdang', 'bestplace']) {
    const s = updateRegistry(site, bySite[site], DRY)
    console.log(`\n[${site}]`)
    console.log(`  ✅ configured 갱신: ${s.configured.length}`)
    s.configured.forEach((c) => console.log(`     · ${c.key.padEnd(24)} ${c.endpoint}`))
    if (s.added.length) {
      console.log(`  ➕ 신규 추가: ${s.added.length}`)
      s.added.forEach((c) => console.log(`     · ${c.key.padEnd(24)} ${c.endpoint}`))
    }
    if (s.skipped.length) {
      console.log(`  ⏭️  skip: ${s.skipped.length}`)
      allSkipped.push(...s.skipped.map((r) => ({ ...r, reason: `${site}: ${r.reason}` })))
    }
  }

  writeOtherMd([...orphans, ...allSkipped], DRY)
  console.log(`\n📝 other.md: ${orphans.length + allSkipped.length}건${DRY ? ' (미작성, DRY-RUN)' : ''}`)
  if (DRY) console.log('\n(--dry-run: 실제 파일은 변경되지 않았습니다)')
}

main()
