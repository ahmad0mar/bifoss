import { parseFrontmatter } from '@/lib/frontmatter'

// Files whose name starts with "_" (for example _TEMPLATE.md) are ignored.
function load(files) {
  return Object.entries(files)
    .filter(([path]) => !path.split('/').pop().startsWith('_'))
    .map(([path, raw]) => {
      const slug = path.split('/').pop().replace(/\.md$/, '')
      const { data, body } = parseFrontmatter(raw)
      return { slug, ...data, body }
    })
    .filter((item) => item.draft !== true)
}

const eventFiles = import.meta.glob('/src/content/events/*.md', { query: '?raw', import: 'default', eager: true })
const blogFiles = import.meta.glob('/src/content/blog/*.md', { query: '?raw', import: 'default', eager: true })

const byDateAsc = (a, b) => String(a.date).localeCompare(String(b.date))
const byDateDesc = (a, b) => byDateAsc(b, a)

export const allEvents = load(eventFiles).sort(byDateAsc)
export const allPosts = load(blogFiles).sort(byDateDesc)

// Compared with today's date at render time, in the visitor's timezone.
export function todayISO() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function splitEvents(today = todayISO()) {
  const day = (e) => String(e.date).slice(0, 10)
  return {
    upcoming: allEvents.filter((e) => day(e) >= today),
    past: allEvents.filter((e) => day(e) < today).sort(byDateDesc),
  }
}

export const getEvent = (slug) => allEvents.find((e) => e.slug === slug)
export const getPost = (slug) => allPosts.find((p) => p.slug === slug)

export function formatDate(iso, opts = { day: 'numeric', month: 'long', year: 'numeric' }) {
  const d = new Date(String(iso).length === 10 ? `${iso}T00:00:00` : iso)
  return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString('en-IN', opts)
}

/** Returns true if the given ISO date string is today (visitor's local timezone). */
export function isToday(iso) {
  if (!iso) return false
  const today = todayISO()
  return String(iso).slice(0, 10) === today
}

/** A short plain-text summary of Markdown, for meta descriptions. */
export function plainExcerpt(md = '', max = 150) {
  const text = String(md)
    .split('TODO:')[0]
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s*([-*+]|#+|>)\s+/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= max) return text
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`
}
