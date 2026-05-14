// Probe jumpoline.com detail page deeper.

const url = process.argv[2] ?? 'http://www.jumpoline.com/_jumpo/jumpo_view.asp?webjofrsid=694343'

const res = await fetch(url, {
  headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'http://www.jumpoline.com/' },
})
const html = new TextDecoder('euc-kr').decode(await res.arrayBuffer())

// All <th>+<td> pairs
const pairs = [...html.matchAll(/<th[^>]*>\s*([^<]+?)\s*<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/g)]
console.log(`total ${pairs.length} th-td pairs\n`)
for (const m of pairs) {
  const label = m[1].trim()
  const value = m[2].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80)
  if (value && value.length < 80) console.log(`  ${label.padEnd(15)}| ${value}`)
}

// Look for inline keywords
console.log('\n--- inline keyword contexts ---')
for (const kw of ['보증금', '월세', '권리금', '매매가', '매물명', '매장명', '상호', '주소', '소재지']) {
  const re = new RegExp(`.{0,80}${kw}.{0,80}`, 'g')
  const matches = [...html.matchAll(re)].slice(0, 1)
  for (const m of matches) {
    console.log(`  [${kw}]`, m[0].replace(/\s+/g, ' ').trim().slice(0, 160))
  }
}
