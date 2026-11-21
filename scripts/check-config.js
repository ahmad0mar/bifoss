// Lists what the club still has to fill in before the site is complete.
// Usage:  npm run check          (checks the source files)
//         npm run check -- --dist (also scans a built dist/ for leftover "TODO:")
// This only warns. It never fails the build.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const missing = []
const ok = []

const { site } = await import(join(root, 'src/data/site.js'))

function check(label, value, where) {
  const empty = value == null || String(value).trim() === ''
  ;(empty ? missing : ok).push({ label, where })
}

check('joinUrl (join form link)', site.joinUrl, 'src/data/site.js')
check('email', site.email, 'src/data/site.js')
check('address', site.address, 'src/data/site.js')
check('domain', site.domain, 'src/data/site.js and public/CNAME')
for (const s of site.social) check(`social: ${s.label} (optional, empty hides it)`, s.url, 'src/data/site.js')

// public/CNAME should hold the real domain, not the placeholder.
const cname = join(root, 'public/CNAME')
if (existsSync(cname)) {
  const v = readFileSync(cname, 'utf8').trim()
  check('public/CNAME (real domain, GitHub Pages only)', /example\./i.test(v) ? '' : v, 'public/CNAME')
}

// JSON lists
for (const [file, label] of [['team.json', 'team members'], ['projects.json', 'projects']]) {
  const list = JSON.parse(readFileSync(join(root, 'src/data', file), 'utf8'))
  check(`${label} (at least one entry)`, list.length ? 'yes' : '', `src/data/${file}`)
}

// Markdown content (files starting with "_" are templates)
for (const dir of ['events', 'blog']) {
  const folder = join(root, 'src/content', dir)
  const files = readdirSync(folder).filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  check(`${dir} (at least one entry)`, files.length ? 'yes' : '', `src/content/${dir}/`)
}

// Leftover TODO text in data files and real content
function scan(dir, hits = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('_')) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) scan(p, hits)
    else if (/\.(js|json|md)$/.test(name) && /TODO:?|FILL IN/.test(readFileSync(p, 'utf8'))) hits.push(p.replace(root + '/', ''))
  }
  return hits
}
const todoFiles = [...scan(join(root, 'src/data')), ...scan(join(root, 'src/content'))]
if (todoFiles.length) missing.push(...todoFiles.map((f) => ({ label: 'TODO or FILL IN text still in file', where: f })))

// Optional: scan a build for visible TODO text
if (process.argv.includes('--dist')) {
  const dist = join(root, 'dist')
  if (!existsSync(dist)) console.log('dist/ not found. Run `npm run build` first.\n')
  else {
    const hits = []
    const walk = (d) => {
      for (const n of readdirSync(d)) {
        const p = join(d, n)
        if (statSync(p).isDirectory()) walk(p)
        else if (/\.(html|js)$/.test(n) && readFileSync(p, 'utf8').includes('TODO:')) hits.push(p.replace(root + '/', ''))
      }
    }
    walk(dist)
    if (hits.length) missing.push(...hits.map((f) => ({ label: 'visible "TODO:" in build', where: f })))
    else ok.push({ label: 'no visible "TODO:" in dist/', where: 'dist/' })
  }
}

console.log('\nBIFOSS site check\n')
if (missing.length) {
  console.log('Still to fill in:')
  for (const m of missing) console.log(`  - ${m.label}  [${m.where}]`)
} else console.log('Nothing missing.')
console.log(`\n${ok.length} item(s) filled in, ${missing.length} still empty. See HANDOFF.md for how to fill each one.\n`)
