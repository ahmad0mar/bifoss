import { Link } from 'react-router-dom'

/**
 * Empty state for any list with no entries yet. Says what will appear here and gives
 * the visitor one thing to do now. Left aligned, with the same top rule as the ledgers.
 */
export default function EmptyState({ title, message, linkTo, linkLabel }) {
  return (
    <div className="max-w-xl border-t-2 border-brand-ink pt-6">
      <p className="text-lg font-semibold text-brand-ink">{title}</p>
      <p className="mt-2 text-brand-muted">{message}</p>
      {linkTo && (
        <Link to={linkTo} className="btn-ghost mt-5">
          {linkLabel}
        </Link>
      )}
    </div>
  )
}
