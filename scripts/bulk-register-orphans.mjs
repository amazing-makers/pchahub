#!/usr/bin/env node
/**
 * 분류 보류된 외부 API들을 모두 적절한 사이트의 registry.ts에 일괄 등록.
 *
 * 입력: scripts/data-go-kr-intake.tsv
 * 동작:
 *   1. 각 row의 dataName으로 도메인 분류 (가맹/부동산/KOSIS/시설물)
 *   2. endpoint URL 마지막 segment에서 key 자동 생성
 *   3. 이미 동일 endpoint가 registry에 있으면 skip
 *   4. 새 entry는 priority: 'supplementary', fillsMockFields: ['TBD']로 추가
 *   5. union type에도 key 추가
 *   6. gongganhansu는 registry.ts 신규 생성
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DRY = process.argv.includes('--dry-run')

const REGISTRIES = {
  pchahub: resolve(ROOT, 'apps/pchahub/lib/kftc/registry.ts'),
  themyungdang: resolve(ROOT, 'apps/themyungdang/lib/external/registry.ts'),
  bestplace: resolve(ROOT, 'apps/bestplace/lib/external/registry.ts'),
  gongganhansu: resolve(ROOT, 'apps/gongganhansu/lib/external/registry.ts'),
}

// 도메인 분류 규칙 (우선순위 위에서 아래로)
const DOMAIN_RULES = [
  { match: /공정거래위원회|가맹|페어데이터/, site: 'pchahub', fieldsKey: 'fillsMockFields' },
  { match: /국토안전관리원|시설물|건축물/, site: 'gongganhansu', fieldsKey: 'fillsFields' },
  { match: /국토교통부.*실거래|부동산|한국부동산원/, site: 'themyungdang', fieldsKey: 'fillsFields' },
  { match: /KOSIS|국가데이터처|인구통계|소상공인/, site: 'bestplace', fieldsKey: 'fillsFields' },
  { match: /국세청/, site: 'bestplace', fieldsKey: 'fillsFields' },
]

// gongganhansu의 registry.ts 템플릿 (신규 생성용)
const GONGGANHANSU_TEMPLATE = `// gongganhansu의 외부 API 레지스트리.
//
// 인테리어 시공·공간 설계 도메인 — 건축물대장, 시설물 통계 등을 활용해
// 시공 후보지·평가 데이터를 보강한다.

export type GongganhansuEndpointKey =
  | 'FacilStat'   // 국토안전관리원 — 시설물 통계

export interface ExternalEndpointDef {
  key: GongganhansuEndpointKey
  dataName: string
  endpoint: string
  format: 'JSON' | 'XML' | 'JSON+XML'
  priority: 'critical' | 'useful' | 'supplementary'
  fillsFields: string[]
  status: 'configured' | 'pending-endpoint' | 'not-applied'
}

export const ENDPOINTS: ExternalEndpointDef[] = [
]

export function endpointFor(key: GongganhansuEndpointKey): string {
  const def = ENDPOINTS.find((e) => e.key === key)
  if (!def) throw new Error(\`Unknown endpoint key: \${key}\`)
  return def.endpoint
}

export function summarizeStatus() {
  const configured = ENDPOINTS.filter((e) => e.status === 'configured').length
  const pending = ENDPOINTS.filter((e) => e.status === 'pending-endpoint').length
  return { configured, pending, total: ENDPOINTS.length }
}
`

// endpoint URL → key 자동 생성
function makeKey(endpoint) {
  if (!endpoint) return null
  const seg = endpoint.split('/').filter(Boolean).pop() || ''
  if (!seg) return null
  // Fftc 접두사, Service 접미사 제거 → PascalCase 보장
  let key = seg
    .replace(/^Fftc/i, '')
    .replace(/^RTMSDataSvc/i, 'Rtms')
    .replace(/^api\/open\/?/i, '')
    .replace(/Service$/i, '')
  // 첫 글자 대문자
  if (!key) key = seg
  key = key.charAt(0).toUpperCase() + key.slice(1)
  // TypeScript identifier 검증: 영문/숫자/언더스코어만
  key = key.replace(/[^A-Za-z0-9_]/g, '')
  // 숫자로 시작하면 prefix 추가
  if (/^\d/.test(key)) key = 'Api' + key
  return key || null
}

// 인테이크 파싱
function parseIntake() {
  const path = resolve(ROOT, 'scripts/data-go-kr-intake.tsv')
  const lines = readFileSync(path, 'utf8').split(/\r?\n/)
  const rows = []
  for (const raw of lines) {
    const t = raw.trim()
    if (!t || t.startsWith('#')) continue
    const cols = raw.split('\t').map((s) => s.trim())
    if (cols.length < 3) continue
    const [dataName, endpoint, format, status = '승인'] = cols
    if (!dataName || !endpoint) continue
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

// 현재 registry에 등록된 endpoint set 추출
function existingEndpoints(src) {
  const re = /endpoint:\s*'([^']+)'/g
  const set = new Set()
  let m
  while ((m = re.exec(src)) !== null) set.add(m[1])
  return set
}

// 키 노출 검사
function scanLeak(rows) {
  for (const r of rows) {
    const blob = `${r.dataName} ${r.endpoint}`
    if (/serviceKey=[A-Za-z0-9+/=%]{20,}/i.test(blob) || /일반\s*인증키/.test(blob)) {
      console.error(`🛑 보안 위반: ${r.dataName}`)
      process.exit(2)
    }
  }
}

// registry.ts 한 파일에 entries 일괄 추가
function appendToRegistry(file, fieldsKey, entries, dry, isNew = false, templateContent = null) {
  let src
  if (isNew && !existsSync(file)) {
    mkdirSync(dirname(file), { recursive: true })
    src = templateContent
  } else {
    src = readFileSync(file, 'utf8')
  }
  const existing = existingEndpoints(src)

  // 기존 key 추출 (충돌 회피)
  const keyRe = /^\s+key:\s*'([^']+)',/gm
  const existingKeys = new Set()
  let km
  while ((km = keyRe.exec(src)) !== null) existingKeys.add(km[1])

  const added = []
  const skipped = []
  for (const r of entries) {
    if (existing.has(r.endpoint)) {
      skipped.push({ ...r, reason: 'endpoint 이미 존재' })
      continue
    }
    let key = makeKey(r.endpoint)
    if (!key) {
      skipped.push({ ...r, reason: 'key 생성 실패' })
      continue
    }
    // 키 충돌 시 _2, _3 suffix
    let attempt = key
    let n = 2
    while (existingKeys.has(attempt)) {
      attempt = `${key}_${n}`
      n++
    }
    key = attempt
    existingKeys.add(key)

    // union 타입에 key 추가
    const unionRe = /(export\s+type\s+\w+EndpointKey\s*=\s*[^]*?)(\n\nexport interface)/m
    const um = src.match(unionRe)
    if (um) {
      src = src.replace(unionRe, (_, before, after) => {
        return `${before}\n  | '${key}'${after}`
      })
    }

    // 배열 끝에 entry 추가
    const entryText =
      `  {\n` +
      `    key: '${key}',\n` +
      `    dataName: '${escapeStr(r.dataName)}',\n` +
      `    endpoint: '${r.endpoint}',\n` +
      `    format: '${r.format}',\n` +
      `    priority: 'supplementary',\n` +
      `    ${fieldsKey}: ['TBD'],\n` +
      `    status: 'configured',\n` +
      `  },\n`
    // 빈 배열인 경우 처리
    if (/ENDPOINTS:\s*\w+\[\]\s*=\s*\[\s*\]/.test(src)) {
      src = src.replace(/(\[\])/, `[\n${entryText}]`)
    } else if (/\n\]\s*\n\s*export function/.test(src)) {
      src = src.replace(/\n\]\s*\n\s*export function/, `\n${entryText}]\n\nexport function`)
    } else {
      skipped.push({ ...r, reason: '배열 끝 위치 못 찾음' })
      continue
    }
    existing.add(r.endpoint)
    added.push({ key, dataName: r.dataName, endpoint: r.endpoint })
  }
  if (!dry) writeFileSync(file, src, 'utf8')
  return { added, skipped }
}

function escapeStr(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

// 메인
function main() {
  const rows = parseIntake()
  console.log(`📥 ${rows.length}개 row 로드${DRY ? ' (DRY-RUN)' : ''}`)
  scanLeak(rows)
  console.log('🔐 키 노출 검사 통과')

  // 도메인별 분류
  const buckets = { pchahub: [], gongganhansu: [], themyungdang: [], bestplace: [], orphan: [] }
  for (const r of rows) {
    const rule = DOMAIN_RULES.find((d) => d.match.test(r.dataName))
    if (rule) buckets[rule.site].push(r)
    else buckets.orphan.push(r)
  }
  console.log(
    `📂 분류: pchahub=${buckets.pchahub.length} themyungdang=${buckets.themyungdang.length} ` +
      `bestplace=${buckets.bestplace.length} gongganhansu=${buckets.gongganhansu.length} ` +
      `orphan=${buckets.orphan.length}`,
  )

  // 각 사이트 처리
  const results = {}
  for (const site of ['pchahub', 'themyungdang', 'bestplace', 'gongganhansu']) {
    const rule = DOMAIN_RULES.find((d) => d.site === site)
    const fieldsKey = rule?.fieldsKey || 'fillsFields'
    const isNew = site === 'gongganhansu' && !existsSync(REGISTRIES[site])
    const tmpl = isNew ? GONGGANHANSU_TEMPLATE : null
    const r = appendToRegistry(REGISTRIES[site], fieldsKey, buckets[site], DRY, isNew, tmpl)
    results[site] = r
    console.log(`\n[${site}]${isNew ? ' (신규 생성)' : ''}`)
    console.log(`  ➕ 추가: ${r.added.length}`)
    if (r.added.length) {
      r.added.slice(0, 5).forEach((c) => console.log(`     · ${c.key}`))
      if (r.added.length > 5) console.log(`     · ... +${r.added.length - 5}개`)
    }
    console.log(`  ⏭️  skip: ${r.skipped.length}`)
  }

  if (buckets.orphan.length) {
    console.log(`\n⚠️ 미분류 ${buckets.orphan.length}건:`)
    buckets.orphan.forEach((r) => console.log(`  · ${r.dataName}`))
  }

  if (DRY) console.log('\n(--dry-run: 실제 파일은 변경되지 않았습니다)')
}

main()
