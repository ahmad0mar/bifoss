// Tiny frontmatter parser: handles `key: value` lines between two `---` fences.
export function parseFrontmatter(raw) {
  const text = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: text }
  const data = {}
  for (const line of match[1].split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const i = line.indexOf(':')
    if (i === -1) continue
    const key = line.slice(0, i).trim()
    let value = line.slice(i + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (value === 'true') value = true
    else if (value === 'false') value = false
    data[key] = value
  }
  return { data, body: match[2].trim() }
}
