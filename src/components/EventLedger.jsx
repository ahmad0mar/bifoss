import { Link } from 'react-router-dom'
import { formatDate, isToday } from '@/lib/content'

// A ledger of events: the date leads, then title, venue and type. Each row opens the event.
// Used by the Home page ("Coming up") and the Events page, so both look the same.
export default function EventLedger({ events }) {
  return (
    <ul className="border-b border-t-2 border-brand-rule border-t-brand-ink">
      {events.map((e) => (
        <li key={e.slug} className="border-t border-brand-rule first:border-t-0">
          <Link
            to={`/events/${e.slug}`}
            className="grid grid-cols-[4.5rem_1fr] gap-x-5 gap-y-1 px-2 py-5 transition-colors hover:bg-brand-wash sm:grid-cols-[7rem_minmax(0,1fr)_11rem_9rem] sm:items-baseline sm:gap-x-6"
          >
            <time dateTime={String(e.date).slice(0, 10)} className="row-span-3 sm:row-span-1">
              <span className="headline block text-3xl leading-none">
                {formatDate(e.date, { day: 'numeric' })}
              </span>
              <span className="mt-1 block text-sm text-brand-muted">
                {formatDate(e.date, { month: 'short', year: 'numeric' })}
              </span>
            </time>
            <span>
              <span className="text-lg font-semibold text-brand-ink">{e.title}</span>
              {isToday(e.date) && (
                <span className="ml-2 text-sm font-semibold text-brand-orange-ink">Today</span>
              )}
              {e.time && <span className="block text-sm text-brand-muted">{e.time}</span>}
            </span>
            <span className="text-sm text-brand-muted">{e.venue}</span>
            <span className="text-sm font-semibold capitalize text-brand-orange-ink">{e.type}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
