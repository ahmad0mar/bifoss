import react from '@vitejs/plugin-react'
import path from 'node:path'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import { site } from './src/data/site.js'

// Preload the two font files needed for first paint (headline and body). File names are
// hashed by the build, so the tags are generated from the bundle. Does nothing in dev.
const firstPaintFonts = ['bricolage-grotesque-latin-700-normal', 'ibm-plex-sans-latin-400-normal']
function preloadFonts() {
  let base = '/'
  return {
    name: 'preload-first-paint-fonts',
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return []
      return Object.keys(ctx.bundle)
        .filter((f) => f.endsWith('.woff2') && firstPaintFonts.some((n) => f.includes(n)))
        .map((f) => ({
          tag: 'link',
          attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: '', href: `${base}${f}` },
          injectTo: 'head',
        }))
    },
  }
}

// Writes robots.txt always, and sitemap.xml once `domain` is set in src/data/site.js
// (a sitemap needs absolute URLs). Routes are the fixed pages plus every non-draft event and post.
const pages = ['/', '/about', '/join', '/events', '/projects', '/blog', '/team', '/code-of-conduct']
function slugs(dir) {
  const folder = path.resolve(__dirname, 'src/content', dir)
  if (!existsSync(folder)) return []
  return readdirSync(folder)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .filter((f) => {
      const front = readFileSync(path.join(folder, f), 'utf8').split(/^---\s*$/m)[1] ?? ''
      return !/^draft:\s*true\s*$/m.test(front)
    })
    .map((f) => f.replace(/\.md$/, ''))
}
function seoFiles() {
  let base = '/'
  return {
    name: 'seo-files',
    configResolved(config) {
      base = config.base
    },
    generateBundle() {
      const host = String(site.domain || '').trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
      const lines = ['User-agent: *', 'Allow: /']
      if (host) {
        const root = `https://${host}${base.replace(/\/$/, '')}`
        const urls = [
          ...pages,
          ...slugs('events').map((s) => `/events/${encodeURIComponent(s)}`),
          ...slugs('blog').map((s) => `/blog/${encodeURIComponent(s)}`),
        ].map((u) => `  <url><loc>${root}${u === '/' ? '/' : u}</loc></url>`)
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
        })
        lines.push(`Sitemap: ${root}/sitemap.xml`)
      } else {
        this.warn('sitemap.xml was not written: set `domain` in src/data/site.js, then build again.')
      }
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${lines.join('\n')}\n` })
    },
  }
}

export default defineConfig({
  plugins: [react(), preloadFonts(), seoFiles()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
