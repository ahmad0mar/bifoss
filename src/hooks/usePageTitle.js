import { useEffect } from 'react'
import { site } from '@/data/site'

function setMeta(selector, value) {
  document.head.querySelector(selector)?.setAttribute('content', value)
}

/**
 * Sets the tab title and the description that search results and link previews read.
 * Pages call it through PageShell. With no arguments (Home) it uses the site defaults.
 * This runs in the browser, so crawlers that do not run JavaScript only see index.html.
 */
export function usePageTitle(title, description) {
  useEffect(() => {
    const full = title ? `${title} | ${site.name}` : `${site.name} | ${site.tagline}`
    const desc = description || site.description
    document.title = full
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', full)
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[name="twitter:title"]', full)
    setMeta('meta[name="twitter:description"]', desc)
  }, [title, description])
}
