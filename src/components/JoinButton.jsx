import { Link } from 'react-router-dom'
import { site } from '@/data/site'

/**
 * The one place that decides what a "join" button does. Its name is always "Join BIFOSS".
 *
 * - `site.joinUrl` set: opens the real join form in a new tab.
 * - `site.joinUrl` empty and fallback="link" (default): links to the Join page,
 *   which always exists.
 * - `site.joinUrl` empty and fallback="notice": shows a short "not open yet"
 *   message instead of a button, for places where a link to /join would loop
 *   (the Join page itself).
 */
export default function JoinButton({ fallback = 'link', className = 'btn-brand' }) {
  if (site.joinUrl) {
    return (
      <a
        href={site.joinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        Join {site.name}
        <span className="sr-only"> (opens the form in a new tab)</span>
      </a>
    )
  }

  if (fallback === 'notice') {
    return (
      <p className="max-w-xl text-brand-muted">
        <span className="font-semibold text-brand-ink">The join form is not open yet.</span>{' '}
        Membership details will appear here when it opens. Until then, you can see the next
        session on the events page.
      </p>
    )
  }

  return (
    <Link to="/join" className={className}>
      Join {site.name}
    </Link>
  )
}
