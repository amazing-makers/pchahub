// 저장된 probe JSON으로 분류 로직만 dry-run (외부 호출 없음)
import { readFile } from 'fs/promises'
const data = JSON.parse(await readFile('tmp/probe-20080100482.json', 'utf8'))

const out = { menu: [], interior: [], store: [], other: [] }
const menuItems = []
const seen = new Set()
const isImg = (s) => typeof s === 'string'
  && /cdn\.myfranchise|prod-myfranchise|s3\.[a-z0-9-]+\.amazonaws/.test(s)
  && !/icon_|favicon|placeholder|svg$/.test(s)

function bucketForKey(key) {
  const k = String(key ?? '').toLowerCase()
  if (/^menus?$|^signature/.test(k) || /menu(items|list)?$/i.test(k)) return 'menu'
  if (/^interiors?$|^exteriors?$/.test(k) || /interior(items|list)?$/i.test(k)) return 'interior'
  if (/^stores?$|^shops?$/.test(k)) return 'store'
  return null
}

function pickUrl(item) {
  if (!item || typeof item !== 'object') return ''
  const v = item.originalUrl ?? item.imageUrl ?? item.url ?? item.src ?? item.thumbUrl ?? ''
  return typeof v === 'string' && isImg(v) ? v.split('?')[0] : ''
}

function walk(node) {
  if (!node) return
  if (Array.isArray(node)) { for (const v of node) walk(v); return }
  if (typeof node !== 'object') return
  for (const [k, v] of Object.entries(node)) {
    const bucket = bucketForKey(k)
    if (bucket && Array.isArray(v)) {
      for (const item of v) {
        const url = pickUrl(item)
        if (!url || seen.has(url)) continue
        seen.add(url)
        out[bucket].push(url)
        if (bucket === 'menu' && item && typeof item === 'object') {
          menuItems.push({ name: item.name ?? '', price: item.price, url })
        }
      }
      continue
    }
    walk(v)
  }
}

walk(data)
console.log('menu:', out.menu.length, 'samples:', out.menu.slice(0, 2))
console.log('interior:', out.interior.length, 'samples:', out.interior.slice(0, 2))
console.log('store:', out.store.length)
console.log('menuItems first 3:')
menuItems.slice(0, 3).forEach((m) => console.log(' ', m.name, m.price, m.url))
