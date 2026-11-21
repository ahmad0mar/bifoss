import { Link } from 'react-router-dom'
import { splitEvents } from '@/lib/content'
import EventLedger from '@/components/EventLedger'
import EmptyState from '@/components/EmptyState'

export default function UpcomingStrip() {
  const next = splitEvents().upcoming.slice(0, 4)
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="headline text-2xl sm:text-3xl md:text-4xl">Coming up</h2>
        <Link to="/events" className="btn-ghost">See events</Link>
      </div>

      <div className="mt-10">
        {next.length ? (
          <EventLedger events={next} />
        ) : (
          <EmptyState
            title="Dates will appear here"
            message="Workshops, talks and hackathons are listed here once they are scheduled. Join BIFOSS and we will tell you first."
            linkTo="/join"
            linkLabel="Join BIFOSS"
          />
        )}
      </div>
    </section>
  )
}
