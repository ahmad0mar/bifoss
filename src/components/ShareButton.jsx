import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

/**
 * Copies the current page address. The button says "Copy link" and, once done,
 * "Link copied" (same verb), announced politely to screen readers.
 */
export default function ShareButton() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {
      // fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = window.location.href
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button type="button" onClick={copy} className="btn-ghost !px-4 !text-sm">
      {copied ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Link2 className="h-4 w-4" aria-hidden="true" />
      )}
      <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
    </button>
  )
}
